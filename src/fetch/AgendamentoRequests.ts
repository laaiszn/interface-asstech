import type { AgendamentoDTO, AgendamentoInput } from "../dto/AgendamentoDTO";
import { apiList, apiRequest, jsonBody } from "./api";

class AgendamentoRequests {
    listar(): Promise<AgendamentoDTO[]> {
        return apiList<AgendamentoDTO>("/agendamentos");
    }

    buscar(id: number): Promise<AgendamentoDTO> {
        return apiRequest<AgendamentoDTO>(`/agendamento/${id}`);
    }

    cadastrar(agendamento: AgendamentoInput): Promise<{ mensagem: string }> {
        return apiRequest("/agendamento", jsonBody(agendamento));
    }

    atualizar(id: number, agendamento: AgendamentoInput): Promise<{ mensagem: string }> {
        return apiRequest(`/agendamento/${id}`, jsonBody(agendamento, "PUT"));
    }

    remover(id: number): Promise<{ mensagem: string }> {
        return apiRequest(`/agendamento/${id}`, { method: "DELETE" });
    }
}

export default new AgendamentoRequests();
