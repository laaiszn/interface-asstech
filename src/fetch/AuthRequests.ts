import type { UsuarioDTO } from "../dto/UsuarioDTO";
import { apiRequest, jsonBody } from "./api";

interface LoginResponse {
    auth: boolean;
    token: string | null;
    usuario?: UsuarioDTO;
    message?: string;
}

class AuthRequests {
    async login(login: { email: string; senha: string }): Promise<void> {
        const data = await apiRequest<LoginResponse>("/api/login", jsonBody(login));

        if (!data.auth || !data.token || !data.usuario) {
            throw new Error(data.message || "E-mail ou senha incorretos.");
        }

        this.persistToken(data.token, data.usuario);
    }

    private persistToken(token: string, usuario: UsuarioDTO): void {
        localStorage.setItem("token", token);
        localStorage.setItem("nome", usuario.nome);
        localStorage.setItem("idUsuario", usuario.id_usuario.toString());
        localStorage.setItem("email", usuario.email);
        localStorage.setItem("role", usuario.role);
        localStorage.setItem("isAuth", "true");
    }

    removeToken(): void {
        for (const key of ["token", "nome", "idUsuario", "email", "role", "isAuth"]) {
            localStorage.removeItem(key);
        }
    }

    isAuthenticated(): boolean {
        return localStorage.getItem("isAuth") === "true" && this.checkTokenExpiry();
    }

    checkTokenExpiry(): boolean {
        const token = localStorage.getItem("token");
        if (!token) {
            return false;
        }

        try {
            const payload = token.split(".")[1];
            if (!payload) {
                throw new Error("Token JWT inválido.");
            }

            const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
            const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
            const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
            const decoded: unknown = JSON.parse(new TextDecoder().decode(bytes));

            if (
                typeof decoded !== "object" ||
                decoded === null ||
                !("exp" in decoded) ||
                typeof decoded.exp !== "number"
            ) {
                throw new Error("Token JWT sem data de expiração.");
            }

            if (decoded.exp <= Math.floor(Date.now() / 1000)) {
                this.removeToken();
                return false;
            }

            return true;
        } catch {
            this.removeToken();
            return false;
        }
    }
}

export default new AuthRequests();
