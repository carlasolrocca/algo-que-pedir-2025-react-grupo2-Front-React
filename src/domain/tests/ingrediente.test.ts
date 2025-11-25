import { describe, expect, it } from 'vitest'
import { Ingrediente, type IngredienteJSON } from '../Ingrediente'

describe('Ingrediente', () => {
  describe('constructor', () => {
    it('crea un ingrediente con valores por defecto', () => {
      const ingrediente = new Ingrediente()
      
      expect(ingrediente.nombre).toBe('')
      expect(ingrediente.id).toBeUndefined()
    })

    it('crea un ingrediente con nombre específico', () => {
      const ingrediente = new Ingrediente('Tomate')
      
      expect(ingrediente.nombre).toBe('Tomate')
    })
  })

  describe('fromJSON', () => {
    it('convierte un JSON a Ingrediente correctamente', () => {
      const ingredienteJSON: IngredienteJSON = {
        id: 1,
        nombre: 'Lechuga'
      }
      
      const ingrediente = Ingrediente.fromJSON(ingredienteJSON)
      
      expect(ingrediente.id).toBe(1)
      expect(ingrediente.nombre).toBe('Lechuga')
      expect(ingrediente).toBeInstanceOf(Ingrediente)
    })
  })

  describe('toJSON', () => {
    it('convierte un Ingrediente a JSON correctamente', () => {
      const ingrediente = new Ingrediente('Queso')
      ingrediente.id = 5
      
      const json = ingrediente.toJSON()
      
      expect(json.id).toBe(5)
      expect(json.nombre).toBe('Queso')
    })
  })
})
