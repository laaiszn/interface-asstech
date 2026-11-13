import { type JSX } from "react";
import { Link } from "react-router-dom";

const areas = [
    {
        titulo: "Clientes",
        descricao: "Cadastre e consulte os clientes da assistência.",
        rota: "/clientes",
        acao: "Ver clientes",
    },
    {
        titulo: "Equipamentos",
        descricao: "Organize os aparelhos e associe-os aos clientes.",
        rota: "/equipamentos",
        acao: "Ver equipamentos",
    },
    {
        titulo: "Agendamentos",
        descricao: "Acompanhe os serviços, as datas e o status dos atendimentos.",
        rota: "/agendamentos",
        acao: "Ver agendamentos",
    },
];

function BoasVindas(): JSX.Element {
    return (
        <main className="flex-1 px-6 py-16 sm:py-20">
            <section className="mx-auto max-w-6xl text-center">
                <h1 className="mb-6 text-4xl font-black text-violet-800 sm:text-5xl md:text-6xl">
                    Assistência Técnica
                </h1>

                <p className="mx-auto max-w-4xl text-base font-bold leading-relaxed text-violet-900 sm:text-lg md:text-xl">
                    Bem-vindo a nossa plataforma de assistência técnica! Aqui você pode gerenciar clientes, equipamentos e agendamentos de forma eficiente e organizada.
                </p>

                <div className="mt-12 grid gap-5 text-left md:grid-cols-3">
                    {areas.map((area) => (
                        <article
                            key={area.rota}
                            className="flex flex-col rounded-2xl border border-violet-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                        >
                            <h2 className="text-xl font-bold text-violet-900">{area.titulo}</h2>
                            <p className="mt-3 flex-1 text-base leading-relaxed text-slate-600">
                                {area.descricao}
                            </p>
                            <Link
                                to={area.rota}
                                className="mt-6 inline-flex w-fit items-center rounded-lg bg-violet-700 px-4 py-2.5 font-semibold text-white transition hover:bg-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                            >
                                {area.acao}
                                <span aria-hidden="true" className="ml-2">→</span>
                            </Link>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}

export default BoasVindas;
