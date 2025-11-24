import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Heading, Stack, Text } from '@chakra-ui/react'
import { PedidoCheckout } from '@/components/pedido/PedidoCheckout'
import { LoadingSpinner } from '@/components/spinnerCargando/spinner'
import { useOnInit } from '@/customHooks/useOnInit'
import { Pedido } from '@/domain/Pedido'
import { pedidoService } from '@/services/pedidoService'
import { distanciaService } from '@/services/distanciaService'
import type { Plato } from '@/domain/Plato'
import { ItemPedido } from '@/domain/Carrito'

export const PaginaDetallePedido = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [distancia, setDistancia] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useOnInit(async () => {
    if (!id) {
      setError('No se especificó un ID de pedido')
      setIsLoading(false)
      return
    }

    try {
      const pedidoData = await pedidoService.getPedidoById(Number(id))
      setPedido(pedidoData)
    } catch (err) {
      console.error('Error cargando el pedido', err)
      setError('Error al cargar el pedido')
      setIsLoading(false)
    }
  })

  useEffect(() => {
    const fetchDistancia = async () => {
      if (pedido && pedido.local && pedido.usuario) {
        try {
          const distanciaCalculada = await distanciaService.obtenerDistancia(pedido.local.idLocal, pedido.usuario.id!)
          setDistancia(distanciaCalculada)
        } catch (error) {
          console.error('Error calculando la distnacia', error)
          setDistancia('N/A')
        }
      }
      setIsLoading(false)
    }
    fetchDistancia()
  }, [pedido])


  if (isLoading) {
    return <LoadingSpinner mensaje="Cargando detalle del pedido..." />
  }

  if (error) {
    return (
      <Stack p={4} flex={1} justify="center" align="center">
        <Heading>Error</Heading>
        <Text>{error}</Text>
      </Stack>
    )
  }

  if (!pedido || !pedido.local) {
    return (
      <Stack p={4} flex={1} justify="center" align="center">
        <Text>No se encontró el pedido con ID "{id}"</Text>
      </Stack>
    )
  }

  const groupPlatos = (platos: Plato[]): ItemPedido[] => {
    if (!platos) return []
    
    const platoMap = new Map<number, ItemPedido>()
    platos.forEach(plato => {
      const existing = platoMap.get(plato.id)
      if (existing) {
        existing.cantidad++
      } else {
        platoMap.set(plato.id, new ItemPedido(plato, 1))
      }
    })
    return Array.from(platoMap.values())
  }

  const groupedPlatos = groupPlatos(pedido.platosDelPedido || [])

  return (
    <PedidoCheckout
      local={pedido.local}
      items={groupedPlatos}
      subtotal={pedido.subtotal}
      recargo={pedido.recargo}
      tarifaEntrega={pedido.tarifaEntrega}
      total={pedido.costoTotalPedido}
      distancia={distancia}
      readOnly={true}
      medioDePago={pedido.medioDePago!}
      onBack={() => navigate(-1)}
    />
  )
}
