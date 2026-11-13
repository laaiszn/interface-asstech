export interface EquipamentoDTO {
  id_equipamento: number;
  id_cliente: number;
  cliente_nome: string;
  tipo: string;
  marca: string;
  modelo: string;
  numero_serie: string;
}

export type EquipamentoInput = Pick<
  EquipamentoDTO,
  "id_cliente" | "tipo" | "marca" | "modelo" | "numero_serie"
>;