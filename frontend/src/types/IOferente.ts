export interface OferenteBase {
  
  nombre: string;
  identificacion: string;
}

export interface Oferente extends OferenteBase {
  IdOferente: number;
  Direccion: string;
  TipoIdentificacion: string;
  FechaNacimiento: Date;
  EstadoCivil: string;
  Nacionalidad: string;
  IdDistrito: number;
  Curriculum: string;

}