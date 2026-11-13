import type { ClienteDTO } from "../dto/ClienteDTO";
import { apiList, apiRequest, jsonBody } from "./api";

export type ClienteInput = Omit<ClienteDTO, "id_cliente">;

class ClienteRequests {
    listar(): Promise<ClienteDTO[]> {
        return apiList<ClienteDTO>("/clientes");
    }

    buscar(id: number): Promise<ClienteDTO> {
        return apiRequest<ClienteDTO>(`/cliente/${id}`);
    }

    cadastrar(cliente: ClienteInput): Promise<{ mensagem: string }> {
        return apiRequest("/cliente", jsonBody(cliente));
    }

    atualizar(id: number, cliente: ClienteInput): Promise<{ mensagem: string }> {
        return apiRequest(`/cliente/${id}`, jsonBody(cliente, "PUT"));
    }

    remover(id: number): Promise<{ mensagem: string }> {
        return apiRequest(`/cliente/${id}`, { method: "DELETE" });
    }
}

export default new ClienteRequests();