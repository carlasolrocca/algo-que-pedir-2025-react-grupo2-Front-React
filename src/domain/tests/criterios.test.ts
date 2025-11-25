import { describe, it, expect } from 'vitest'
import { Criterio, type CriterioJSON } from '../CriterioUsuario'
import { Local } from '../Local'

describe('Criterio', () => {
  describe('constructor', () => {
    it('crea un criterio GENERAL por defecto', () => {
      const criterio = new Criterio()
      
      expect(criterio.tipo).toBe('GENERAL')
      expect(criterio.localesPreferidos).toEqual([])
      expect(criterio.palabrasClave).toEqual([])
      expect(criterio.subCriterios).toEqual([])
    })

    it('crea un criterio con tipo específico', () => {
      const criterio = new Criterio('VEGANO')
      
      expect(criterio.tipo).toBe('VEGANO')
    })
  })

  describe('esCombinado', () => {
    it('devuelve true cuando el criterio es COMBINADO', () => {
      const criterio = new Criterio('COMBINADO')
      
      expect(criterio.esCombinado()).toBe(true)
    })

    it('devuelve false cuando el criterio no es COMBINADO', () => {
      const criterio = new Criterio('VEGANO')
      
      expect(criterio.esCombinado()).toBe(false)
    })
  })

  describe('fromJSON', () => {
    it('convierte un criterio simple desde JSON', () => {
      const criterioJSON: CriterioJSON = { tipo: 'EXQUISITO' }
      
      const criterio = Criterio.fromJSON(criterioJSON)
      
      expect(criterio.tipo).toBe('EXQUISITO')
      expect(criterio).toBeInstanceOf(Criterio)
    })

    it('convierte un criterio FIEL con locales desde JSON', () => {
      const criterioJSON: CriterioJSON = {
        tipo: 'FIEL',
        localesPreferidos: [
          { idLocal: 1, nombre: 'Local 1', urlImagenLocal: '/local1.jpg', rating: 4.5, tarifaEntrega: 100 },
          { idLocal: 2, nombre: 'Local 2', urlImagenLocal: '/local2.jpg', rating: 4.0, tarifaEntrega: 150 }
        ]
      }
      
      const criterio = Criterio.fromJSON(criterioJSON)
      
      expect(criterio.tipo).toBe('FIEL')
      expect(criterio.localesPreferidos).toHaveLength(2)
      expect(criterio.localesPreferidos[0].nombre).toBe('Local 1')
    })

    it('convierte un criterio MARKETING con palabras clave desde JSON', () => {
      const criterioJSON: CriterioJSON = {
        tipo: 'MARKETING',
        palabrasClave: ['oferta', 'descuento', '2x1']
      }
      
      const criterio = Criterio.fromJSON(criterioJSON)
      
      expect(criterio.tipo).toBe('MARKETING')
      expect(criterio.palabrasClave).toEqual(['oferta', 'descuento', '2x1'])
    })

    it('convierte un criterio COMBINADO con subcriterios desde JSON', () => {
      const criterioJSON: CriterioJSON = {
        tipo: 'COMBINADO',
        subCriterios: [
          { tipo: 'VEGANO' },
          { tipo: 'EXQUISITO' }
        ]
      }
      
      const criterio = Criterio.fromJSON(criterioJSON)
      
      expect(criterio.tipo).toBe('COMBINADO')
      expect(criterio.subCriterios).toHaveLength(2)
      expect(criterio.subCriterios[0].tipo).toBe('VEGANO')
      expect(criterio.subCriterios[1].tipo).toBe('EXQUISITO')
    })
  })

  describe('toJSON', () => {
    it('convierte un criterio simple a JSON', () => {
      const criterio = new Criterio('CONSERVADOR')
      
      const json = criterio.toJSON()
      
      expect(json.tipo).toBe('CONSERVADOR')
      expect(json.localesPreferidos).toBeUndefined()
      expect(json.palabrasClave).toBeUndefined()
      expect(json.subCriterios).toBeUndefined()
    })

    it('convierte un criterio FIEL con locales a JSON', () => {
      const local = new Local('Local Test')
      local.idLocal = 1
      const criterio = new Criterio('FIEL', [local])
      
      const json = criterio.toJSON()
      
      expect(json.tipo).toBe('FIEL')
      expect(json.localesPreferidos).toHaveLength(1)
      expect(json.localesPreferidos![0].nombre).toBe('Local Test')
    })

    it('convierte un criterio MARKETING con palabras clave a JSON', () => {
      const criterio = new Criterio('MARKETING', [], ['promo', 'nuevo'])
      
      const json = criterio.toJSON()
      
      expect(json.tipo).toBe('MARKETING')
      expect(json.palabrasClave).toEqual(['promo', 'nuevo'])
    })

    it('convierte un criterio COMBINADO con subcriterios a JSON', () => {
      const subCriterio1 = new Criterio('VEGANO')
      const subCriterio2 = new Criterio('IMPACIENTE')
      const criterio = new Criterio('COMBINADO', [], [], [subCriterio1, subCriterio2])
      
      const json = criterio.toJSON()
      
      expect(json.tipo).toBe('COMBINADO')
      expect(json.subCriterios).toHaveLength(2)
      expect(json.subCriterios![0].tipo).toBe('VEGANO')
      expect(json.subCriterios![1].tipo).toBe('IMPACIENTE')
    })

    it('no incluye arrays vacíos en JSON', () => {
      const criterio = new Criterio('FIEL', [])
      
      const json = criterio.toJSON()
      
      expect(json.tipo).toBe('FIEL')
      expect(json.localesPreferidos).toBeUndefined()
    })
  })
})