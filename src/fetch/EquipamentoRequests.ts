import type { EquipamentoDTO, EquipamentoInput } from "../dto/EquipamentoDTO";
import { apiList, apiRequest, jsonBody } from "./api";

class EquipamentoRequests {
    listar(): Promise<EquipamentoDTO[]> {
        return apiList<EquipamentoDTO>("/equipamentos");
    }

    buscar(id: number): Promise<EquipamentoDTO> {
        return apiRequest<EquipamentoDTO>(`/equipamento/${id}`);
    }

    cadastrar(equipamento: EquipamentoInput): Promise<{ mensagem: string }> {
        return apiRequest("/equipamento", jsonBody(equipamento));
    }

    atualizar(id: number, equipamento: EquipamentoInput): Promise<{ mensagem: string }> {
        return apiRequest(`/equipamento/${id}`, jsonBody(equipamento, "PUT"));
    }

    remover(id: number): Promise<{ mensagem: string }> {
        return apiRequest(`/equipamento/${id}`, { method: "DELETE" });
    }
}

export default new EquipamentoRequests();
