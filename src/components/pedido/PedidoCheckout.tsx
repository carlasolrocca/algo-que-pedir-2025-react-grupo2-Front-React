
import { Button } from '@/components/boton/boton'
import { Articulo } from '@/components/articulo-checkout/Articulo'
import { Heading, Stack, IconButton, Select, createListCollection, Portal, Text } from '@chakra-ui/react'
import { IoMdArrowBack } from 'react-icons/io'
import { medioDePagoLabels, type LocalJSON, type MedioDePago } from '@/services/localServiceTest'
import type { ItemPedido } from '@/domain/Carrito'

interface PedidoCheckoutProps {
    local: LocalJSON
    items: ItemPedido[]
    subtotal: number
    recargo: number
    tarifaEntrega: number
    total: number
    distancia: string | null
    readOnly: boolean
    medioDePago?: MedioDePago
    onDecrement?: (platoId: number) => void
    onMedioDePagoChange?: (medio: MedioDePago) => void
    onConfirm?: () => void
    onClearCart?: () => void
    onBack?: () => void
}

export const PedidoCheckout = ({
    local,
    items,
    subtotal,
    recargo,
    tarifaEntrega,
    total,
    distancia,
    readOnly,
    medioDePago,
    onDecrement,
    onMedioDePagoChange,
    onConfirm,
    onClearCart,
    onBack,
}: PedidoCheckoutProps) => {

    const itemsSelect = local.mediosDePago.map((medio) => ({
        label: medioDePagoLabels[medio],
        value: medio,
    })
    )

    const collection = createListCollection({ items: itemsSelect })

    return (
        <main className="main-checkout">
            <Heading as="header" className="checkout-header">
                <IconButton aria-label='Volver atrás' variant="ghost" onClick={onBack}><IoMdArrowBack /></IconButton>
                <h1 className="checkout-titulo">{readOnly ? 'Detalle del pedido' : 'Tu pedido'}</h1>
            </Heading>
            <Stack as="section" className="container-checkout">
                <Heading as="h2">Restaurante</Heading>
                <figure className="restaurante-figure">
                    <img className="imagen-restaurante" src={local.urlImagenLocal} alt='Imágen del restaurante' />
                    <Stack as='figcaption' gap={0}>
                        <h3>{local.nombre}</h3>
                        <span className='texto-secundario-checkout'>{local.rating.toFixed(1)} ★ · {distancia} · ${tarifaEntrega.toFixed(2)}</span>
                    </Stack>
                </figure>
            </Stack>
            <Stack as="section" className="container-checkout">
                <Heading as="h2">Artículos</Heading>
                {items.map((item) => (
                    <Articulo
                        key={item.plato.id}
                        nombre={item.plato.nombre}
                        cantidad={item.cantidad}
                        precioUnitario={item.plato.precioUnitario}
                        onDecrement={readOnly ? undefined : () => onDecrement?.(item.plato.id)}
                    />
                ))}
            </Stack>
            <Stack as="section" className="container-checkout">
                <Heading as="h2">Resumen</Heading>
                <article className="container-resumen">
                    <Stack>
                        <span className="texto-secundario-checkout">Subtotal</span>
                        <span className="texto-secundario-checkout">Recargo por tipo de pago</span>
                        <span className="texto-secundario-checkout">Tarifa de entrega</span>
                        <span className="texto-secundario-checkout">Total</span>
                    </Stack>
                    <Stack>
                        <span className="precio-resumen">${subtotal.toFixed(2)}</span>
                        <span className="precio-resumen">${recargo.toFixed(2)}</span>
                        <span className="precio-resumen">${tarifaEntrega.toFixed(2)}</span>
                        <span className="precio-resumen">${total.toFixed(2)}</span>
                    </Stack>
                </article>
            </Stack>
            <Stack as="section" className="container-checkout">
                {readOnly ? (
                    <article className="container-resumen">
                         <Stack>
                            <span className="texto-secundario-checkout">Forma de pago</span>
                        </Stack>
                        <Stack>
                            <span className="precio-resumen">{medioDePago ? medioDePagoLabels[medioDePago] : 'No especificado'}</span>
                        </Stack>
                    </article>
                ) : (
                    <>
                        <Select.Root collection={collection} size="lg" value={medioDePago ? [medioDePago] : []}
                            onValueChange={(details) => {
                                const seleccionado = details.value[0] as MedioDePago
                                if (seleccionado) {
                                    onMedioDePagoChange?.(seleccionado)
                                }
                            }}
                        >
                            <Select.HiddenSelect />
                            <Select.Label>Forma de pago</Select.Label>
                            <Select.Control>
                                <Select.Trigger>
                                    <Select.ValueText />
                                </Select.Trigger>
                                <Select.IndicatorGroup>
                                    <Select.Indicator />
                                </Select.IndicatorGroup>
                            </Select.Control>
                            <Portal>
                                <Select.Positioner>
                                    <Select.Content>
                                        {collection.items.map((item) => (
                                            <Select.Item item={item} key={item.value}>
                                                {item.label}
                                                <Select.ItemIndicator />
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Positioner>
                            </Portal>
                        </Select.Root>
                        <Button className='boton-checkout' onClick={onConfirm}>Confirmar pedido</Button>
                        <Button variant="secundario" className='boton-checkout' onClick={onClearCart}>Limpiar carrito de compras</Button>
                    </>
                )}
            </Stack>
        </main>
    )
}
