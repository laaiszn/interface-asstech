import { useState, type JSX } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthRequests from "../../fetch/AuthRequests";


function Navegacao(): JSX.Element {
    const [menuAberto, setMenuAberto] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const isAuthenticated = AuthRequests.isAuthenticated();

    const nome = localStorage.getItem("nome") || "Usuário";
    const email = localStorage.getItem("email") || "";

    const links = [
        {
            label: "Home",
            icon: "pi pi-home",
            url: "/",
        },

        ...(isAuthenticated
            ? [
                { label: "Clientes", icon: "pi pi-users", url: "/clientes" },
                { label: "Equipamentos", icon: "pi pi-desktop", url: "/equipamentos" },
                { label: "Agendamentos", icon: "pi pi-calendar", url: "/agendamentos" },
            ]
            : []),
    ];

    const navegar = (url: string) => {
        navigate(url);
        setMenuAberto(false);
    };

    const sair = () => {
        AuthRequests.removeToken();
        setMenuAberto(false);
        navigate("/login");
    };

    const linkAtivo = (url: string) => {
        if (url === "/") {
            return location.pathname === "/";
        }

        return location.pathname.startsWith(url);
    };

    return (
        <header className="sticky top-0 z-50 border-b border-violet-700 bg-violet-900 shadow-lg">

            {/* NAVBAR */}
            <div className="mx-auto flex min-h-16 w-full max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* LOGO */}
                <button
                    type="button"
                    onClick={() => navegar("/")}
                    className="flex items-center gap-2"
                >
                

                    <span className="text-xl font-bold tracking-tight text-white">
                        Assistência <span className="text-violet-200">Técnica</span>
                    </span>
                </button>

                {/* LINKS DESKTOP */}
                <nav className="hidden items-center gap-1 md:flex">

                    {links.map((link) => {
                        const ativo = linkAtivo(link.url);

                        return (
                            <button
                                key={link.url}
                                type="button"
                                onClick={() => navegar(link.url)}
                                className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${ativo
                                        ? "bg-violet-700 text-white shadow-sm"
                                        : "text-violet-100 hover:bg-violet-800 hover:text-white"
                                    }`}
                            >
                                <i
                                    className={`${link.icon} text-sm ${ativo
                                            ? "text-violet-200"
                                            : "text-violet-300/70 group-hover:text-violet-100"
                                        }`}
                                />

                                <span>{link.label}</span>
                            </button>
                        );
                    })}

                </nav>

                {/* USUÁRIO */}
                <div className="hidden items-center gap-3 md:flex">

                    {isAuthenticated ? (
                        <>
                            <div className="hidden text-right lg:block">
                                <p className="text-sm font-semibold text-white">
                                    {nome}
                                </p>

                                <p className="max-w-40 truncate text-xs text-violet-200/70">
                                    {email}
                                </p>
                            </div>

    

                            <button
                                type="button"
                                onClick={sair}
                                className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-neutral-950 shadow-sm transition hover:bg-neutral-200 active:scale-95"
                            >
                                <i className="pi pi-sign-out" />
                                <span>Sair</span>
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            onClick={() => navegar("/login")}
                            className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-neutral-950 shadow-sm transition hover:bg-neutral-200 active:scale-95"
                        >
                            <i className="pi pi-sign-in" />
                            <span>Entrar</span>
                        </button>
                    )}

                </div>

                {/* MENU MOBILE */}
                <button
                    type="button"
                    onClick={() => setMenuAberto(!menuAberto)}
                    aria-label="Abrir menu"
                    aria-expanded={menuAberto}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-800 text-white transition hover:bg-violet-700 md:hidden"
                >
                    <i
                        className={`pi ${menuAberto
                                ? "pi-times"
                                : "pi-bars"
                            } text-lg`}
                    />
                </button>

            </div>

            {/* MENU MOBILE */}
            {menuAberto && (
                <div className="border-t border-violet-700 bg-violet-900 px-4 pb-5 pt-3 shadow-lg md:hidden">

                    <nav className="flex flex-col gap-1">

                        {links.map((link) => {
                            const ativo = linkAtivo(link.url);

                            return (
                                <button
                                    key={link.url}
                                    type="button"
                                    onClick={() => navegar(link.url)}
                                    className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition ${ativo
                                            ? "bg-violet-700 text-white"
                                            : "text-violet-100 hover:bg-violet-800 hover:text-white"
                                        }`}
                                >
                                    <i
                                        className={`${link.icon} w-5 text-center ${ativo
                                                ? "text-violet-200"
                                                : "text-violet-300/70"
                                            }`}
                                    />

                                    <span>{link.label}</span>
                                </button>
                            );
                        })}

                    </nav>

                    <div className="my-3 border-t border-violet-700" />

                    {isAuthenticated ? (
                        <div className="space-y-3">

                            <div className="flex items-center gap-3 px-2">

                                

                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-white">
                                        {nome}
                                    </p>

                                    <p className="truncate text-xs text-violet-200/70">
                                        {email}
                                    </p>
                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={sair}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200"
                            >
                                <i className="pi pi-sign-out" />
                                Sair
                            </button>

                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => navegar("/login")}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200"
                        >
                            <i className="pi pi-sign-in" />
                            Entrar
                        </button>
                    )}

                </div>
            )}

        </header>
    );
}

export default Navegacao;
