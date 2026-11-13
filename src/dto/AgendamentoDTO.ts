export interface AgendamentoDTO {
  id_agendamento: number;
  id_equipamento: number;
  data_agendamento: string;
  descricao_servico: string;
  status: string;
  cliente_nome: string;
  tipo: string;
  marca: string;
  modelo: string;
}

export type AgendamentoInput = Pick<
  AgendamentoDTO,
  "id_equipamento" | "data_agendamento" | "descricao_servico" | "status"
>;