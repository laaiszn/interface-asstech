import { useCallback, useEffect, useState, type FormEvent, type JSX } from "react";
import type { ClienteDTO } from "../../dto/ClienteDTO";
import type { EquipamentoDTO, EquipamentoInput } from "../../dto/EquipamentoDTO";
import ClienteRequests from "../../fetch/ClienteRequests";
import EquipamentoRequests from "../../fetch/EquipamentoRequests";
import Navegacao from "../../components/Navegacao/Navegacao";
import Rodape from "../../components/Rodape/Rodape";

const formularioVazio: EquipamentoInput = {
    id_cliente: 0,
    tipo: "",
    marca: "",
    modelo: "",
    numero_serie: "",
};

function PEquipamentos(): JSX.Element {
    const [equipamentos, setEquipamentos] = useState<EquipamentoDTO[]>([]);
    const [clientes, setClientes] = useState<ClienteDTO[]>([]);
    const [formulario, setFormulario] = useState<EquipamentoInput>(formularioVazio);
    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");
    const [mensagem, setMensagem] = useState("");

    const carregarDados = useCallback(async () => {
        setErro("");
        try {
            const [listaEquipamentos, listaClientes] = await Promise.all([
                EquipamentoRequests.listar(),
                ClienteRequests.listar(),
            ]);
            setEquipamentos(listaEquipamentos);
            setClientes(listaClientes);
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
                const [listaEquipamentos, listaClientes] = await Promise.all([
                    EquipamentoRequests.listar(),
                    ClienteRequests.listar(),
                ]);
                if (mounted) {
                    setEquipamentos(listaEquipamentos);
                    setClientes(listaClientes);
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
                await EquipamentoRequests.cadastrar(formulario);
                setMensagem("Equipamento cadastrado.");
            } else {
                await EquipamentoRequests.atualizar(editandoId, formulario);
                setMensagem("Equipamento atualizado.");
            }
            setFormulario(formularioVazio);
            setEditandoId(null);
            await carregarDados();
        } catch (error) {
            setErro(error instanceof Error ? error.message : "Não foi possível salvar o equipamento.");
        } finally {
            setSalvando(false);
        }
    };

    const editar = (equipamento: EquipamentoDTO) => {
        setEditandoId(equipamento.id_equipamento);
        setFormulario({
            id_cliente: equipamento.id_cliente,
            tipo: equipamento.tipo,
            marca: equipamento.marca,
            modelo: equipamento.modelo,
            numero_serie: equipamento.numero_serie,
        });
        setMensagem("");
        setErro("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const remover = async (equipamento: EquipamentoDTO) => {
        if (!window.confirm(`Excluir ${equipamento.tipo} ${equipamento.modelo}? Os agendamentos desse equipamento também serão removidos.`)) return;
        setErro("");
        setMensagem("");
        try {
            await EquipamentoRequests.remover(equipamento.id_equipamento);
            setMensagem("Equipamento removido.");
            await carregarDados();
        } catch (error) {
            setErro(error instanceof Error ? error.message : "Não foi possível remover o equipamento.");
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
                    <h1 className="mt-1 text-3xl font-bold text-slate-900">Equipamentos</h1>
                    <p className="mt-2 text-slate-600">Associe os equipamentos aos clientes e acompanhe os números de série.</p>
                </div>

                <section className="mb-8 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-violet-100 sm:p-7">
                    <h2 className="mb-5 text-xl font-semibold text-slate-900">{editandoId === null ? "Novo equipamento" : "Editar equipamento"}</h2>
                    {erro && <p role="alert" className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</p>}
                    {mensagem && <p role="status" className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">{mensagem}</p>}
                    {clientes.length === 0 && !carregando && <p className="mb-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">Cadastre um cliente antes de cadastrar um equipamento.</p>}
                    <form onSubmit={salvar} className="grid gap-4 sm:grid-cols-2">
                        <label className="text-sm font-medium text-slate-700">
                            Cliente
                            <select required value={formulario.id_cliente || ""} onChange={(e) => setFormulario((anterior) => ({ ...anterior, id_cliente: Number(e.target.value) }))} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100">
                                <option value="" disabled>Selecione um cliente</option>
                                {clientes.map((cliente) => <option key={cliente.id_cliente} value={cliente.id_cliente}>{cliente.nome}</option>)}
                            </select>
                        </label>
                        <label className="text-sm font-medium text-slate-700">
                            Tipo
                            <input required maxLength={50} value={formulario.tipo} onChange={(e) => setFormulario((anterior) => ({ ...anterior, tipo: e.target.value }))} placeholder="Ex.: Notebook" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100" />
                        </label>
                        <label className="text-sm font-medium text-slate-700">
                            Marca
                            <input required maxLength={50} value={formulario.marca} onChange={(e) => setFormulario((anterior) => ({ ...anterior, marca: e.target.value }))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100" />
                        </label>
                        <label className="text-sm font-medium text-slate-700">
                            Modelo
                            <input required maxLength={50} value={formulario.modelo} onChange={(e) => setFormulario((anterior) => ({ ...anterior, modelo: e.target.value }))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100" />
                        </label>
                        <label className="text-sm font-medium text-slate-700 sm:col-span-2">
                            Número de série
                            <input required maxLength={60} value={formulario.numero_serie} onChange={(e) => setFormulario((anterior) => ({ ...anterior, numero_serie: e.target.value }))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 font-normal outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100" />
                        </label>
                        <div className="flex gap-3 sm:col-span-2">
                            <button disabled={salvando || clientes.length === 0} className="rounded-lg bg-violet-700 px-5 py-2.5 font-semibold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60">
                                {salvando ? "Salvando..." : editandoId === null ? "Cadastrar equipamento" : "Salvar alterações"}
                            </button>
                            {editandoId !== null && <button type="button" onClick={cancelarEdicao} className="rounded-lg border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-50">Cancelar</button>}
                        </div>
                    </form>
                </section>

                <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-violet-100">
                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-7">
                        <h2 className="text-xl font-semibold text-slate-900">Equipamentos cadastrados</h2>
                        <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-medium text-violet-800">{equipamentos.length}</span>
                    </div>
                    {carregando ? <p className="p-6 text-slate-600">Carregando equipamentos...</p> : equipamentos.length === 0 ? <p className="p-6 text-slate-600">Nenhum equipamento cadastrado ainda.</p> : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[760px] text-left text-sm">
                                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                    <tr><th className="px-5 py-3 sm:px-7">Equipamento</th><th className="px-5 py-3">Cliente</th><th className="px-5 py-3">Marca / modelo</th><th className="px-5 py-3">Nº de série</th><th className="px-5 py-3">Ações</th></tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {equipamentos.map((equipamento) => (
                                        <tr key={equipamento.id_equipamento} className="text-slate-700">
                                            <td className="px-5 py-4 font-medium text-slate-900 sm:px-7">{equipamento.tipo}</td><td className="px-5 py-4">{equipamento.cliente_nome}</td><td className="px-5 py-4">{equipamento.marca} {equipamento.modelo}</td><td className="px-5 py-4">{equipamento.numero_serie}</td>
                                            <td className="px-5 py-4"><div className="flex gap-2"><button onClick={() => editar(equipamento)} className="rounded-md px-2 py-1 font-medium text-violet-700 hover:bg-violet-50">Editar</button><button onClick={() => void remover(equipamento)} className="rounded-md px-2 py-1 font-medium text-red-700 hover:bg-red-50">Excluir</button></div></td>
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

export default PEquipamentos;
