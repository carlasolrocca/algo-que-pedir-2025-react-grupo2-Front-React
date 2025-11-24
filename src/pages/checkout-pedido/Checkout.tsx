import { Button } from '@/components/boton/boton'
import { Flex, Heading, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Pedido } from '@/domain/Pedido'
import { pedidoService } from '@/services/pedidoService'
import { useNavigate, useOutletContext, type ErrorResponse } from 'react-router-dom'
import { getMensajeError } from '@/utils/errorHandling'
import { toaster } from '@/components/chakra-toaster/toaster'
import { useOnInit } from '@/customHooks/useOnInit'
import { localService, type LocalJSON, type MedioDePago } from '@/services/localServiceTest'
import type { CarritoContext } from '../layout-carrito/CarritoLayout'
import { LoadingSpinner } from '@/components/spinnerCargando/spinner'
import type { Usuario } from '@/domain/Usuario'
import { usuarioService } from '@/services/usuarioService'
import { distanciaService } from '@/services/distanciaService'
import { PedidoCheckout } from '@/components/pedido/PedidoCheckout'


export const CheckoutPedido = () => {
    const navigate = useNavigate()
    const { carrito, decrementarPlato, limpiarCarrito } = useOutletContext<CarritoContext>()

    const [local, setLocal] = useState<LocalJSON | null>(null)
    const [usuario, setUsuario] = useState<Usuario | null>(null)
    const [medioSeleccionado, setMedioSeleccionado] = useState<MedioDePago>('EFECTIVO')

    const [tarifaEntregaMonto, setTarifaEntregaMonto] = useState(0)
    const [recargo, setRecargo] = useState(0)
    const [total, setTotal] = useState(0)
    const [distancia, setDistancia] = useState<string | null>(null)

    const [estaCargando, setEstaCargando] = useState(true)


    useOnInit(async () => {
        const idLocalStorage = localStorage.getItem('idUsuario')
        const userId = idLocalStorage !== null ? Number(idLocalStorage) : null
        if (!carrito.localId) {
            setEstaCargando(false)
            return
        }

        if (!userId) {
            toaster.create({ title: 'Error', description: 'Usuario no autenticado.', type: 'error' })
            navigate('/loginUsuario')
            setEstaCargando(false)
            return
        }

        try {
            const [localData, userData] = await Promise.all([
                localService.obtenerLocalPorId(carrito.localId),
                usuarioService.getById(userId)
            ])
            setLocal(localData)
            setUsuario(userData)

            if (localData && userData) {
                const distanciaCalculada = await distanciaService.obtenerDistancia(localData.idLocal, userData.id!)
                setDistancia(distanciaCalculada)
            }
        } catch (error) {
            console.error('Error al cargar la información:', error)
            toaster.create({ title: 'Error', description: 'No se pudo cargar la información.', type: 'error' })
            navigate('/home')
        } finally {
            setEstaCargando(false)
        }
    })

    useEffect(() => { //Recalcula valores cuando cambia medio de pago
        if (!local) return

        // Monto de entrega
        const tarifaEntregaMonto = carrito.subtotal * local.tarifaEntrega
        setTarifaEntregaMonto(tarifaEntregaMonto)

        //Monto medio de pago
        const subtotalConEnvio = carrito.subtotal + tarifaEntregaMonto
        const tarifaMedioDePago = local.recargosMedioDePago[medioSeleccionado] || 0
        const tarifaMedioDePagoMonto = subtotalConEnvio * tarifaMedioDePago
        setRecargo(tarifaMedioDePagoMonto)

        //Monto total
        const montoTotal = carrito.subtotal + tarifaEntregaMonto + tarifaMedioDePagoMonto
        setTotal(montoTotal)
    }, [carrito.subtotal, local, medioSeleccionado])

    const confirmarPedido = async () => {
        if (!local || !usuario) return

        const fechaPedido = new Date()
        const pedido = Pedido.fromCarrito(carrito, local, medioSeleccionado, total, fechaPedido, usuario, carrito.subtotal, recargo, tarifaEntregaMonto)

        try {
            await pedidoService.crearPedido(pedido)
            toaster.create({
                title: 'Pedido confirmado!',
                description: 'Tu pedido ha sido realizado con éxito.',
                type: 'success',
            })
            limpiarCarrito()
            navigate('/home')
        } catch (error: unknown) {
            const mensajeError = getMensajeError(error as ErrorResponse)
            toaster.create({
                title: 'No se pudo confirmar el pedido',
                description: mensajeError,
                type: 'error',
            })
        }
    }

    if (estaCargando) {
        return <LoadingSpinner mensaje="Cargando checkout..." />
    }

    if (!local || carrito.items.length === 0) {
        return (
            <Flex direction="column" gap="4" align="center" justify="center" minH="80vh" width="100%">
                <Heading as="h1">Tu carrito está vacío</Heading>
                <Text>Agrega platos del menú para continuar.</Text>
                <Button onClick={() => local ? navigate(`/local/${local.idLocal}/platos`) : navigate('/home')}>
                    Volver al menú
                </Button>
            </Flex>
        )
    }

    return (
        <PedidoCheckout
            local={local}
            items={carrito.items}
            subtotal={carrito.subtotal}
            recargo={recargo}
            tarifaEntrega={tarifaEntregaMonto}
            total={total}
            distancia={distancia}
            readOnly={false}
            medioDePago={medioSeleccionado}
            onDecrement={(platoId) => decrementarPlato(platoId)}
            onMedioDePagoChange={setMedioSeleccionado}
            onConfirm={confirmarPedido}
            onClearCart={limpiarCarrito}
            onBack={() => navigate(-1)}
        />
    )
}