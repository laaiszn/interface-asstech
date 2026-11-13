import { useCallback, useEffect, useState, type FormEvent, type JSX } from "react";
import type { ClienteDTO } from "../../dto/ClienteDTO";
import ClienteRequests, { type ClienteInput } from "../../fetch/ClienteRequests";
import Navegacao from "../../components/Navegacao/Navegacao";
import Rodape from "../../components/Rodape/Rodape";

const formularioVazio: ClienteInput = { nome: "", cpf: "", email: "", telefone: "" };

function PClientes(): JSX.Element {
    const [clientes, setClientes] = useState<ClienteDTO[]>([]);
    const [formulario, setFormulario] = useState<ClienteInput>(formularioVazio);
    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");
    const [mensagem, setMensagem] = useState("");

    const carregarClientes = useCallback(async () => {
        setErro("");
        try {
            setClientes(await ClienteRequests.listar());
        } catch (error) {
            setErro(error instanceof Error ? error.message : "Não foi possível carregar os clientes.");
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        let mounted = true;
        const carregarInicialmente = async () => {
            try {
                const lista = await ClienteRequests.listar();
                if (mounted) setClientes(lista);
            } catch (error) {
                if (mounted) setErro(error instanceof Error ? error.message : "Não foi possível carregar os clientes.");
            } finally {
                if (mounted) setCarregando(false);
            }
        };
        void carregarInicialmente();
        return () => { mounted = false; };
    }, []);

    const atualizarCampo = (campo: keyof ClienteInput, valor: string) => {
        setFormulario((anterior) => ({ ...anterior, [campo]: valor }));
    };

    const salvar = async (evento: FormEvent<HTMLFormElement>) => {
        evento.preventDefault();
        setErro("");
        setMensagem("");
        setSalvando(true);

        try {
            if (editandoId === null) {
                await ClienteRequests.cadastrar(formulario);
                setMensagem("Cliente cadastrado.");
            } else {
                await ClienteRequests.atualizar(editandoId, formulario);
                setMensagem("Cliente atualizado.");
            }
            setFormulario(formularioVazio);
            setEditandoId(null);
            await carregarClientes();
        } catch (error) {
            setErro(error instanceof Error ? error.message : "Não foi possível salvar o cliente.");
        } finally {
            setSalvando(false);
        }
    };

    const editar = (cliente: ClienteDTO) => {
        setEditandoId(cliente.id_cliente);
        setFormulario({
            nome: cliente.nome,
            cpf: cliente.cpf,
            email: cliente.email,
            telefone: cliente.telefone,
        });
        setMensagem("");
        setErro("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const remover = async (cliente: ClienteDTO) => {
        if (!window.confirm(`Deseja excluir o cliente ${cliente.nome}? Os equipamentos e agendamentos associados também serão removidos.`)) return;
        setErro("");
        setMensagem("");
        try {
            await ClienteRequests.remover(cliente.id_cliente);
            setMensagem("Cliente removido.");
            await carregarClientes();
        } catch (error) {
            setErro(error instanceof Error ? error.message : "Não foi possível remover o cliente.");
        }
    };

    const cancelarEdicao = () => {
        setEditandoId(null);
        setFormulario(formularioVazio);
        setErro("");
        setMensagem("");
    };

    return (
        <div className="flex min-h-screen flex-col bg-violet-50">
            <Navegacao />
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
                <div className="mb-8">
                    <p className="text-sm font-semibold uppercase tracking-wide text-violet-700">Cadastros</p>
                    <h1 className="mt-1 text-3xl font-bold text-slate-900">Clientes</h1>
                    <p className="mt-2 text-slate-600">Cadastre e mantenha os dados dos clientes da assistência.</p>
                </div>

                <section className="mb-8 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-violet-100 sm:p-7">
                    <h2 className="mb-5 text-xl font-semibold text-slate-900">
                        {editandoId === null ? "Novo cliente" : "Editar cliente"}
                    </h2>
                    {erro && <p role="alert" className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</p>}
                    {mensagem && <p role="status" className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">{mensagem}</p>}
                    <form onSubmit={salvar} className="grid gap-4 sm:grid-cols-2">
                        <label className="text-sm font-medium text-slate-700">
                            Nome
                            <input required maxLength={100} value={formulario.nome} onChange={(e) => atualizarCampo("nome", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100" />
                        </label>
                        <label className="text-sm font-medium text-slate-700">
                            CPF
                            <input required maxLength={11} inputMode="numeric" value={formulario.cpf} onChange={(e) => atualizarCampo("cpf", e.target.value.replace(/\D/g, "").slice(0, 11))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100" />
                        </label>
                        <label className="text-sm font-medium text-slate-700">
                            E-mail
                            <input required type="email" maxLength={120} value={formulario.email} onChange={(e) => atualizarCampo("email", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100" />
                        </label>
                        <label className="text-sm font-medium text-slate-700">
                            Telefone
                            <input required maxLength={20} value={formulario.telefone} onChange={(e) => atualizarCampo("telefone", e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100" />
                        </label>
                        <div className="flex gap-3 sm:col-span-2">
                            <button disabled={salvando} className="rounded-lg bg-violet-700 px-5 py-2.5 font-semibold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60">
                                {salvando ? "Salvando..." : editandoId === null ? "Cadastrar cliente" : "Salvar alterações"}
                            </button>
                            {editandoId !== null && <button type="button" onClick={cancelarEdicao} className="rounded-lg border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-50">Cancelar</button>}
                        </div>
                    </form>
                </section>

                <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-violet-100">
                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-7">
                        <h2 className="text-xl font-semibold text-slate-900">Clientes cadastrados</h2>
                        <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-medium text-violet-800">{clientes.length}</span>
                    </div>
                    {carregando ? <p className="p-6 text-slate-600">Carregando clientes...</p> : clientes.length === 0 ? <p className="p-6 text-slate-600">Nenhum cliente cadastrado ainda.</p> : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[700px] text-left text-sm">
                                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                    <tr><th className="px-5 py-3 sm:px-7">Nome</th><th className="px-5 py-3">CPF</th><th className="px-5 py-3">E-mail</th><th className="px-5 py-3">Telefone</th><th className="px-5 py-3">Ações</th></tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {clientes.map((cliente) => (
                                        <tr key={cliente.id_cliente} className="text-slate-700">
                                            <td className="px-5 py-4 font-medium text-slate-900 sm:px-7">{cliente.nome}</td><td className="px-5 py-4">{cliente.cpf}</td><td className="px-5 py-4">{cliente.email}</td><td className="px-5 py-4">{cliente.telefone}</td>
                                            <td className="px-5 py-4"><div className="flex gap-2"><button onClick={() => editar(cliente)} className="rounded-md px-2 py-1 font-medium text-violet-700 hover:bg-violet-50">Editar</button><button onClick={() => void remover(cliente)} className="rounded-md px-2 py-1 font-medium text-red-700 hover:bg-red-50">Excluir</button></div></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>
            <Rodape />
        </div>
    );
}

export default PClientes;
