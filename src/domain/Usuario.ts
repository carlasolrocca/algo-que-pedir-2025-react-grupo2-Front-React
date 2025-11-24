import type { DireccionJSON } from '@/types/direccionType'
import { Ingrediente, type IngredienteJSON } from './Ingrediente'
import { Criterio, type CriterioJSON } from './CriterioUsuario'

export class Usuario {
  id?: number

  constructor(
    public nombre: string = '',
    public apellido: string = '',
    public imagen: string = '/usuario-chica.png',
    public username: string = '',
    public password: string = '',
    public email: string = '',
    public direccion: string = '',
    public calle: string = '',
    public altura: number = 0,
    public latitud: number = 0,
    public longitud: number = 0,
    public distancia: number = 0,
    public criterio: Criterio = new Criterio(),
    public ingredientesPreferidos: Ingrediente[] = [],
    public ingredientesEvitar: Ingrediente[] = []
  ) {}

  validarCambios() {
    // if (!this.nombre.trim()) throw new Error('El nombre es requerido')
    // if (!this.apellido.trim()) throw new Error('El apellido es requerido')
    // if (!this.email.trim()) throw new Error('El email es requerido')
    // if (!this.direccion.trim()) throw new Error('La dirección es requerida')
    // if (this.latitud < -90 || this.latitud > 90) {
    //   throw new Error('La latitud debe estar entre -90 y 90')
    // }
    // if (this.longitud < -180 || this.longitud > 180) {
    //   throw new Error('La longitud debe estar entre -180 y 180')
    // }
    // if (this.tienesCriterioImpaciente() && this.distancia <= 0) {
    //   throw new Error('La distancia máxima debe ser mayor a 0 para criterio Impaciente')
    // }
  }

  static fromJSON(usuarioJSON: UsuarioJSON): Usuario {
      const usuario = Object.assign(new Usuario(), usuarioJSON, {
        direccion: usuarioJSON.direccion.direccion,
        calle: usuarioJSON.direccion.calle,
        altura: usuarioJSON.direccion.altura,
        latitud: usuarioJSON.direccion.latitud,
        longitud: usuarioJSON.direccion.longitud,
        criterio: Criterio.fromJSON(usuarioJSON.criterio),
        ingredientesPreferidos: usuarioJSON.ingredientesPreferidos.map(ing => Ingrediente.fromJSON(ing)),
        ingredientesEvitar: usuarioJSON.ingredientesEvitar.map(ing => Ingrediente.fromJSON(ing))
      })
      return usuario
  }

  toJSON(): UsuarioJSON {
    return {
      id: this.id!,
      nombre: this.nombre,
      apellido: this.apellido,
      mail: this.email,
      username: this.username,
      password: this.password,
      direccion: {
        direccion: this.direccion,
        calle: this.calle,
        altura: this.altura,
        latitud: this.latitud,
        longitud: this.longitud
      },
      distanciaMaximaCercana: this.distancia,
      criterio: this.criterio?.toJSON() ?? { tipo: 'GENERAL' },
      ingredientesPreferidos: this.ingredientesPreferidos.map(ing => ing.toJSON()),
      ingredientesEvitar: this.ingredientesEvitar.map(ing => ing.toJSON())
    }
  }
}

export type UsuarioJSON = {
    id: number
    nombre: string,
    apellido: string,
    mail: string,
    username: string,
    password: string,
    direccion: DireccionJSON,
    distanciaMaximaCercana: number,
    criterio: CriterioJSON,
    ingredientesPreferidos: IngredienteJSON[],
    ingredientesEvitar: IngredienteJSON[]
}