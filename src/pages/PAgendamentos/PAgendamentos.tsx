import { useCallback, useEffect, useState, type FormEvent, type JSX } from "react";
import type { AgendamentoDTO, AgendamentoInput } from "../../dto/AgendamentoDTO";
import type { EquipamentoDTO } from "../../dto/EquipamentoDTO";
import AgendamentoRequests from "../../fetch/AgendamentoRequests";
import EquipamentoRequests from "../../fetch/EquipamentoRequests";
import Navegacao from "../../components/Navegacao/Navegacao";
import Rodape from "../../components/Rodape/Rodape";

function dataDeHoje(): string {
    const hoje = new Date();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");
    return `${hoje.getFullYear()}-${mes}-${dia}`;
}

function formatarData(data: string): string {
    const [ano, mes, dia] = data.slice(0, 10).split("-");
    return ano && mes && dia ? `${dia}/${mes}/${ano}` : data;
}

const formularioVazio = (): AgendamentoInput => ({
    id_equipamento: 0,
    data_agendamento: dataDeHoje(),
    descricao_servico: "",
    status: "AGENDADO",
});

function PAgendamentos(): JSX.Element {
    const [agendamentos, setAgendamentos] = useState<AgendamentoDTO[]>([]);
    const [equipamentos, setEquipamentos] = useState<EquipamentoDTO[]>([]);
    const [formulario, setFormulario] = useState<AgendamentoInput>(formularioVazio);
    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");
    const [mensagem, setMensagem] = useState("");

    const carregarDados = useCallback(async () => {
        setErro("");
        try {
            const [listaAgendamentos, listaEquipamentos] = await Promise.all([
                AgendamentoRequests.listar(),
                EquipamentoRequests.listar(),
            ]);
            setAgendamentos(listaAgendamentos);
            setEquipamentos(listaEquipamentos);
        } catch (error) {
            setErro(error instanceof Error ? error.message : "Não foi possível carregar os dados.");
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        let mounted = true;
        const carregarInicialmente = async () => {
            try {
                const [listaAgendamentos, listaEquipamentos] = await Promise.all([
                    AgendamentoRequests.listar(),
                    EquipamentoRequests.listar(),
                ]);
                if (mounted) {
                    setAgendamentos(listaAgendamentos);
                    setEquipamentos(listaEquipamentos);
                }
            } catch (error) {
                if (mounted) setErro(error instanceof Error ? error.message : "Não foi possível carregar os dados.");
            } finally {
                if (mounted) setCarregando(false);
            }
        };
        void carregarInicialmente();
        return () => { mounted = false; };
    }, []);

    const salvar = async (evento: FormEvent<HTMLFormElement>) => {
        evento.preventDefault();
        setErro("");
        setMensagem("");
        setSalvando(true);

        try {
            if (editandoId === null) {
                await AgendamentoRequests.cadastrar(formulario);
                setMensagem("Agendamento cadastrado.");
            } else {
                await AgendamentoRequests.atualizar(editandoId, formulario);
                setMensagem("Agendamento atualizado.");
            }
            setFormulario(formularioVazio());
            setEditandoId(null);
            await carregarDados();
        } catch (error) {
            setErro(error instanceof Error ? error.message : "Não foi possível salvar o agendamento.");
        } finally {
            setSalvando(false);
        }
    };

    const editar = (agendamento: AgendamentoDTO) => {
        setEditandoId(agendamento.id_agendamento);
        setFormulario({
            id_equipamento: agendamento.id_equipamento,
            data_agendamento: agendamento.data_agendamento.slice(0, 10),
            descricao_servico: agendamento.descricao_servico,
            status: agendamento.status,
        });
        setMensagem("");
        setErro("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const remover = async (agendamento: AgendamentoDTO) => {
        if (!window.confirm(`Deseja excluir o agendamento de ${agendamento.cliente_nome}?`)) return;
        setErro("");
        setMensagem("");
        try {
            await AgendamentoRequests.remover(agendamento.id_agendamento);
            setMensagem("Agendamento removido.");
            await carregarDados();
        } catch (error) {
            setErro(error instanceof Error ? error.message : "Não foi possível remover o agendamento.");
        }
    };

    const cancelarEdicao = () => {
        setEditandoId(null);
        setFormulario(formularioVazio());
        setErro("");
        setMensagem("");
    };

    return (
        <div className="flex min-h-screen flex-col bg-violet-50">
            <Navegacao />
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
                <div className="mb-8">
                    <p className="text-sm font-semibold uppercase tracking-wide text-violet-700">Atendimentos</p>
                    <h1 className="mt-1 text-3xl font-bold text-slate-900">Agendamentos</h1>
                    <p className="mt-2 text-slate-600">Organize os serviços e acompanhe o status dos atendimentos.</p>
                </div>

                <section className="mb-8 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-violet-100 sm:p-7">
                    <h2 className="mb-5 text-xl font-semibold text-slate-900">{editandoId === null ? "Novo agendamento" : "Editar agendamento"}</h2>
                    {erro && <p role="alert" className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</p>}
                    {mensagem && <p role="status" className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">{mensagem}</p>}
                    {equipamentos.length === 0 && !carregando && <p className="mb-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">Cadastre um equipamento antes de agendar um serviço.</p>}
                    <form onSubmit={salvar} className="grid gap-4 sm:grid-cols-2">
                        <label className="text-sm font-medium text-slate-700 sm:col-span-2">
                            Equipamento
                            <select required value={formulario.id_equipamento || ""} onChange={(e) => setFormulario((anterior) => ({ ...anterior, id_equipamento: Number(e.target.value) }))} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100">
                                <option value="" disabled>Selecione um equipamento</option>
                                {equipamentos.map((equipamento) => <option key={equipamento.id_equipamento} value={equipamento.id_equipamento}>{equipamento.cliente_nome} — {equipamento.tipo} {equipamento.marca} {equipamento.modelo}</option>)}
                            </select>
                        </label>
                        <label className="text-sm font-medium text-slate-700">
                            Data
                            <input required type="date" value={formulario.data_agendamento} onChange={(e) => setFormulario((anterior) => ({ ...anterior, data_agendamento: e.target.value }))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100" />
                        </label>
                        <label className="text-sm font-medium text-slate-700">
                            Status
                            <select required value={formulario.status} onChange={(e) => setFormulario((anterior) => ({ ...anterior, status: e.target.value }))} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100">
                                <option value="AGENDADO">Agendado</option>
                                <option value="EM_ANDAMENTO">Em andamento</option>
                                <option value="CONCLUIDO">Concluído</option>
                                <option value="CANCELADO">Cancelado</option>
                            </select>
                        </label>
                        <label className="text-sm font-medium text-slate-700 sm:col-span-2">
                            Descrição do serviço
                            <textarea required maxLength={255} rows={3} value={formulario.descricao_servico} onChange={(e) => setFormulario((anterior) => ({ ...anterior, descricao_servico: e.target.value }))} className="mt-1 w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100" />
                        </label>
                        <div className="flex gap-3 sm:col-span-2">
                            <button disabled={salvando || equipamentos.length === 0} className="rounded-lg bg-violet-700 px-5 py-2.5 font-semibold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60">
                                {salvando ? "Salvando..." : editandoId === null ? "Cadastrar agendamento" : "Salvar alterações"}
                            </button>
                            {editandoId !== null && <button type="button" onClick={cancelarEdicao} className="rounded-lg border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-50">Cancelar</button>}
                        </div>
                    </form>
                </section>

                <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-violet-100">
                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-7">
                        <h2 className="text-xl font-semibold text-slate-900">Agendamentos cadastrados</h2>
                        <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-medium text-violet-800">{agendamentos.length}</span>
                    </div>
                    {carregando ? <p className="p-6 text-slate-600">Carregando agendamentos...</p> : agendamentos.length === 0 ? <p className="p-6 text-slate-600">Nenhum agendamento cadastrado ainda.</p> : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[820px] text-left text-sm">
                                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                    <tr><th className="px-5 py-3 sm:px-7">Cliente</th><th className="px-5 py-3">Equipamento</th><th className="px-5 py-3">Data</th><th className="px-5 py-3">Serviço</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Ações</th></tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {agendamentos.map((agendamento) => (
                                        <tr key={agendamento.id_agendamento} className="text-slate-700">
                                            <td className="px-5 py-4 font-medium text-slate-900 sm:px-7">{agendamento.cliente_nome}</td><td className="px-5 py-4">{agendamento.tipo} {agendamento.marca} {agendamento.modelo}</td><td className="px-5 py-4 whitespace-nowrap">{formatarData(agendamento.data_agendamento)}</td><td className="max-w-56 px-5 py-4">{agendamento.descricao_servico}</td><td className="px-5 py-4 whitespace-nowrap">{agendamento.status.replaceAll("_", " ")}</td>
                                            <td className="px-5 py-4"><div className="flex gap-2"><button onClick={() => editar(agendamento)} className="rounded-md px-2 py-1 font-medium text-violet-700 hover:bg-violet-50">Editar</button><button onClick={() => void remover(agendamento)} className="rounded-md px-2 py-1 font-medium text-red-700 hover:bg-red-50">Excluir</button></div></td>
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

export default PAgendamentos;
