const API_URL = (import.meta.env.VITE_API_SERVER_URL || "http://localhost:3000").replace(/\/+$/, "");

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
    let response: Response;

    try {
        response = await fetch(`${API_URL}${path}`, {
            ...init,
            headers: {
                ...(init?.body ? { "Content-Type": "application/json" } : {}),
                ...init?.headers,
            },
        });
    } catch {
        throw new Error(`Não foi possível conectar à API em ${API_URL}. Confira se o backend está rodando.`);
    }

    const contentType = response.headers.get("content-type") || "";
    const body: unknown = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

    if (!response.ok) {
        const message = typeof body === "object" && body !== null && "message" in body
            ? String(body.message)
            : typeof body === "object" && body !== null && "mensagem" in body
                ? String(body.mensagem)
                : typeof body === "string" && body
                    ? body
                    : `A API respondeu com erro ${response.status}.`;

        throw new Error(message);
    }

    return body as T;
}

export async function apiList<T>(path: string): Promise<T[]> {
    const data = await apiRequest<unknown>(path);
    if (!Array.isArray(data)) {
        throw new Error("A API retornou uma lista em um formato inesperado.");
    }
    return data as T[];
}

export function jsonBody(data: unknown, method = "POST"): RequestInit {
    return {
        method,
        body: JSON.stringify(data),
    };
}
