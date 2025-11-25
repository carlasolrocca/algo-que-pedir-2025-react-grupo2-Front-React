import { describe, it, expect } from 'vitest'
import { Local, type LocalCriterioJSON } from '../Local'

describe('Local', () => {
  describe('constructor', () => {
    it('crea un local con valores por defecto', () => {
      const local = new Local()
      
      expect(local.nombre).toBe('')
      expect(local.urlImagenLocal).toBe('')
      expect(local.mediosDePago).toEqual([])
      expect(local.rating).toBe(0)
      expect(local.reviews).toBe('')
      expect(local.tarifaEntrega).toBe(0)
      expect(local.recargosMedioDePago).toEqual({ EFECTIVO: 0, TARJETA: 0, QR: 0 })
    })

    it('crea un local con valores específicos', () => {
      const local = new Local(
        'Pizzería Don Juan',
        '/pizza.jpg',
        ['EFECTIVO', 'TARJETA'],
        4.5,
        '100 reseñas',
        150
      )
      
      expect(local.nombre).toBe('Pizzería Don Juan')
      expect(local.urlImagenLocal).toBe('/pizza.jpg')
      expect(local.mediosDePago).toEqual(['EFECTIVO', 'TARJETA'])
      expect(local.rating).toBe(4.5)
      expect(local.reviews).toBe('100 reseñas')
      expect(local.tarifaEntrega).toBe(150)
    })
  })

  describe('fromJSON', () => {
    it('convierte un JSON a Local correctamente', () => {
      const localJSON: LocalCriterioJSON = {
        idLocal: 10,
        nombre: 'El Buen Sabor',
        urlImagenLocal: '/sabor.jpg',
        rating: 4.8,
        tarifaEntrega: 200
      }
      
      const local = Local.fromJSON(localJSON)
      
      expect(local.idLocal).toBe(10)
      expect(local.nombre).toBe('El Buen Sabor')
      expect(local.urlImagenLocal).toBe('/sabor.jpg')
      expect(local.rating).toBe(4.8)
      expect(local.tarifaEntrega).toBe(200)
      expect(local).toBeInstanceOf(Local)
    })
  })

  describe('toJSON', () => {
    it('convierte un Local a JSON correctamente', () => {
      const local = new Local('Burguer King', '/burger.jpg')
      local.idLocal = 15
      local.rating = 3.5
      local.tarifaEntrega = 100
      
      const json = local.toJSON()
      
      expect(json.idLocal).toBe(15)
      expect(json.nombre).toBe('Burguer King')
      expect(json.urlImagenLocal).toBe('/burger.jpg')
      expect(json.rating).toBe(3.5)
      expect(json.tarifaEntrega).toBe(100)
    })
  })
})