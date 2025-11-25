import { describe, it, expect } from 'vitest'
import { Criterio } from '../CriterioUsuario'
import { Ingrediente } from '../Ingrediente'
import { Usuario, type UsuarioJSON } from '../Usuario'

describe('Usuario', () => {
  describe('constructor', () => {
    it('crea un usuario con valores por defecto', () => {
      const usuario = new Usuario()
      
      expect(usuario.nombre).toBe('')
      expect(usuario.apellido).toBe('')
      expect(usuario.imagen).toBe('/usuario-chica.png')
      expect(usuario.username).toBe('')
      expect(usuario.password).toBe('')
      expect(usuario.mail).toBe('')
      expect(usuario.calle).toBe('')
      expect(usuario.altura).toBe(0)
      expect(usuario.latitud).toBe(0)
      expect(usuario.longitud).toBe(0)
      expect(usuario.distancia).toBe(0)
      expect(usuario.criterio).toBeInstanceOf(Criterio)
      expect(usuario.ingredientesPreferidos).toEqual([])
      expect(usuario.ingredientesEvitar).toEqual([])
    })

    it('crea un usuario con valores específicos', () => {
      const criterio = new Criterio('VEGANO')
      const usuario = new Usuario(
        'Juan',
        'Pérez',
        '/juan.jpg',
        'juanp',
        'pass123',
        'juan@mail.com',
        'Calle Falsa',
        123,
        -34.6037,
        -58.3816,
        5.0,
        criterio
      )
      
      expect(usuario.nombre).toBe('Juan')
      expect(usuario.apellido).toBe('Pérez')
      expect(usuario.mail).toBe('juan@mail.com')
      expect(usuario.calle).toBe('Calle Falsa')
      expect(usuario.altura).toBe(123)
      expect(usuario.distancia).toBe(5.0)
      expect(usuario.criterio.tipo).toBe('VEGANO')
    })
  })

  describe('fromJSON', () => {
    it('convierte un JSON básico a Usuario correctamente', () => {
      const usuarioJSON: UsuarioJSON = {
        id: 1,
        nombre: 'María',
        apellido: 'García',
        mail: 'maria@mail.com',
        direccion: {
          direccion: 'Av. Siempre Viva 742',
          calle: 'Av. Siempre Viva',
          altura: 742,
          latitud: -34.5,
          longitud: -58.5
        },
        distanciaMaximaCercana: 10.0,
        criterio: { tipo: 'GENERAL' },
        ingredientesPreferidos: [],
        ingredientesEvitar: []
      }
      
      const usuario = Usuario.fromJSON(usuarioJSON)
      
      expect(usuario.id).toBe(1)
      expect(usuario.nombre).toBe('María')
      expect(usuario.apellido).toBe('García')
      expect(usuario.mail).toBe('maria@mail.com')
      expect(usuario.calle).toBe('Av. Siempre Viva')
      expect(usuario.altura).toBe(742)
      expect(usuario.latitud).toBe(-34.5)
      expect(usuario.longitud).toBe(-58.5)
      expect(usuario.distancia).toBe(10.0)
      expect(usuario.criterio.tipo).toBe('GENERAL')
      expect(usuario).toBeInstanceOf(Usuario)
    })

    it('convierte un JSON con ingredientes a Usuario correctamente', () => {
      const usuarioJSON: UsuarioJSON = {
        id: 2,
        nombre: 'Pedro',
        apellido: 'López',
        mail: 'pedro@mail.com',
        direccion: {
          direccion: 'Calle 1 100',
          calle: 'Calle 1',
          altura: 100,
          latitud: 0,
          longitud: 0
        },
        distanciaMaximaCercana: 5.0,
        criterio: { tipo: 'VEGANO' },
        ingredientesPreferidos: [
          { id: 1, nombre: 'Tomate' },
          { id: 2, nombre: 'Lechuga' }
        ],
        ingredientesEvitar: [
          { id: 3, nombre: 'Carne' }
        ]
      }
      
      const usuario = Usuario.fromJSON(usuarioJSON)
      
      expect(usuario.ingredientesPreferidos).toHaveLength(2)
      expect(usuario.ingredientesPreferidos[0].nombre).toBe('Tomate')
      expect(usuario.ingredientesEvitar).toHaveLength(1)
      expect(usuario.ingredientesEvitar[0].nombre).toBe('Carne')
    })

    it('convierte un JSON con criterio complejo a Usuario correctamente', () => {
      const usuarioJSON: UsuarioJSON = {
        id: 3,
        nombre: 'Ana',
        apellido: 'Martínez',
        mail: 'ana@mail.com',
        direccion: {
          direccion: 'Calle 2 200',
          calle: 'Calle 2',
          altura: 200,
          latitud: 0,
          longitud: 0
        },
        distanciaMaximaCercana: 8.0,
        criterio: {
          tipo: 'COMBINADO',
          subCriterios: [
            { tipo: 'VEGANO' },
            { tipo: 'EXQUISITO' }
          ]
        },
        ingredientesPreferidos: [],
        ingredientesEvitar: []
      }
      
      const usuario = Usuario.fromJSON(usuarioJSON)
      
      expect(usuario.criterio.tipo).toBe('COMBINADO')
      expect(usuario.criterio.subCriterios).toHaveLength(2)
      expect(usuario.criterio.subCriterios[0].tipo).toBe('VEGANO')
    })
  })

  describe('toJSON', () => {
    it('convierte un Usuario básico a JSON correctamente', () => {
      const usuario = new Usuario(
        'Carlos',
        'Rodríguez',
        '/carlos.jpg',
        'carlosr',
        'pass456',
        'carlos@mail.com',
        'Av. Principal',
        500,
        -34.6,
        -58.4,
        7.5
      )
      usuario.id = 10
      
      const json = usuario.toJSON()
      
      expect(json.id).toBe(10)
      expect(json.nombre).toBe('Carlos')
      expect(json.apellido).toBe('Rodríguez')
      expect(json.mail).toBe('carlos@mail.com')
      expect(json.direccion.calle).toBe('Av. Principal')
      expect(json.direccion.altura).toBe(500)
      expect(json.direccion.direccion).toBe('Av. Principal 500')
      expect(json.direccion.latitud).toBe(-34.6)
      expect(json.direccion.longitud).toBe(-58.4)
      expect(json.distanciaMaximaCercana).toBe(7.5)
    })

    it('convierte un Usuario con ingredientes a JSON correctamente', () => {
      const tomate = new Ingrediente('Tomate')
      tomate.id = 1
      const queso = new Ingrediente('Queso')
      queso.id = 2
      
      const usuario = new Usuario()
      usuario.id = 5
      usuario.nombre = 'Laura'
      usuario.apellido = 'Fernández'
      usuario.mail = 'laura@mail.com'
      usuario.ingredientesPreferidos = [tomate]
      usuario.ingredientesEvitar = [queso]
      
      const json = usuario.toJSON()
      
      expect(json.ingredientesPreferidos).toHaveLength(1)
      expect(json.ingredientesPreferidos[0].nombre).toBe('Tomate')
      expect(json.ingredientesEvitar).toHaveLength(1)
      expect(json.ingredientesEvitar[0].nombre).toBe('Queso')
    })

    it('convierte un Usuario con criterio a JSON correctamente', () => {
      const usuario = new Usuario()
      usuario.id = 8
      usuario.nombre = 'Diego'
      usuario.apellido = 'González'
      usuario.mail = 'diego@mail.com'
      usuario.criterio = new Criterio('VEGANO')
      
      const json = usuario.toJSON()
      
      expect(json.criterio.tipo).toBe('VEGANO')
    })

    it('usa criterio GENERAL por defecto si no hay criterio', () => {
      const usuario = new Usuario()
      usuario.id = 9
      usuario.criterio = null
      
      const json = usuario.toJSON()
      
      expect(json.criterio.tipo).toBe('GENERAL')
    })
  })

  describe('conversión bidireccional', () => {
    it('fromJSON y toJSON son operaciones inversas', () => {
      const usuarioJSON: UsuarioJSON = {
        id: 100,
        nombre: 'Test',
        apellido: 'User',
        mail: 'test@mail.com',
        direccion: {
          direccion: 'Test 123',
          calle: 'Test',
          altura: 123,
          latitud: -34.0,
          longitud: -58.0
        },
        distanciaMaximaCercana: 3.0,
        criterio: {
          tipo: 'MARKETING',
          palabrasClave: ['promo', 'oferta']
        },
        ingredientesPreferidos: [
          { id: 1, nombre: 'Ingrediente 1' }
        ],
        ingredientesEvitar: [
          { id: 2, nombre: 'Ingrediente 2' }
        ]
      }
      
      const usuario = Usuario.fromJSON(usuarioJSON)
      const resultJSON = usuario.toJSON()
      
      expect(resultJSON.id).toBe(usuarioJSON.id)
      expect(resultJSON.nombre).toBe(usuarioJSON.nombre)
      expect(resultJSON.direccion.calle).toBe(usuarioJSON.direccion.calle)
      expect(resultJSON.criterio.tipo).toBe(usuarioJSON.criterio.tipo)
      expect(resultJSON.ingredientesPreferidos).toHaveLength(1)
      expect(resultJSON.ingredientesEvitar).toHaveLength(1)
    })
  })
})