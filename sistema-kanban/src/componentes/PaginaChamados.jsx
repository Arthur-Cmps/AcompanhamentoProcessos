import React, { useState } from 'react';
import { 
  CheckCircle, Clock, Plus, Trash2, XCircle, Paperclip, 
  Play, Search 
} from 'lucide-react';

export default function PaginaChamados({ chamados, setChamados, usuarioSetor }) {
  const [novoChamado, setNovoChamado] = useState({ assunto: '', descricao: '', setorDestino: 'TI', arquivo: null });
  const [filtro, setFiltro] = useState('');

  const abrirChamado = (e) => {
    e.preventDefault();
    if (!novoChamado.assunto || !novoChamado.descricao) return;
    
    const chamado = {
      id: Date.now(),
      ...novoChamado,
      status: 'aberto', // aberto -> em_andamento -> concluido
      data: new Date().toLocaleDateString(),
      requisitanteSetor: "Financeiro", // Exemplo fixo
      arquivoNome: novoChamado.arquivo ? novoChamado.arquivo.name : null
    };
    
    setChamados([chamado, ...chamados]);
    setNovoChamado({ assunto: '', descricao: '', setorDestino: 'TI', arquivo: null });
  };

  // Fluxo de Status
  const pegarChamado = (id) => {
    setChamados(chamados.map(c => c.id === id ? { ...c, status: 'em_andamento' } : c));
  };

  const concluirChamado = (id) => {
    setChamados(chamados.map(c => c.id === id ? { ...c, status: 'concluido' } : c));
  };

  const cancelarChamado = (id) => {
      if(!window.confirm("Deseja cancelar este chamado?")) return;
      setChamados(chamados.map(c => c.id === id ? { ...c, status: 'cancelado' } : c));
  };

  const excluirChamado = (id) => {
      if(!window.confirm("Remover do histórico permanentemente?")) return;
      setChamados(chamados.filter(c => c.id !== id));
  };

  const handleFileChange = (e) => {
      if(e.target.files[0]) setNovoChamado({...novoChamado, arquivo: e.target.files[0]});
  };

  // Filtros
  // Proteção adicionada: Verifica se c.requisitanteSetor existe antes de comparar
  const meusChamados = chamados.filter(c => (c.requisitanteSetor || "") === "Financeiro" && c.status !== 'concluido'); 
  
  // Proteção adicionada: Verifica se c.setorDestino existe
  const chamadosParaMeuSetor = chamados.filter(c => (c.setorDestino || "") === usuarioSetor);
  
  // Cálculo Barra de Progresso
  const totalParaSetor = chamadosParaMeuSetor.length;
  const concluidosSetor = chamadosParaMeuSetor.filter(c => c.status === 'concluido').length;
  const porcentagem = totalParaSetor === 0 ? 0 : Math.round((concluidosSetor / totalParaSetor) * 100);

  return (
    <div className="h-full w-full bg-[#f4f6f8] p-8 overflow-y-auto custom-scrollbar">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header e Barra de Progresso */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <div className="flex justify-between items-end mb-4">
                 <div>
                     <h2 className="text-2xl font-bold text-[#00557f]">Central de Serviços</h2>
                     <p className="text-slate-500 text-sm">Gerencie solicitações e acompanhe métricas</p>
                 </div>
                 <div className="text-right">
                     <span className="text-3xl font-bold text-[#5fb0a5]">{porcentagem}%</span>
                     <p className="text-xs text-slate-400 uppercase tracking-wide">Resolução do Setor</p>
                 </div>
             </div>
             <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                 <div 
                    className="bg-gradient-to-r from-[#00557f] to-[#5fb0a5] h-3 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${porcentagem}%` }}
                 />
             </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            
            {/* Coluna Esquerda: Abrir Chamado + Meus Chamados */}
            <div className="xl:col-span-4 space-y-6">
                {/* Form */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-[#00557f]">
                    <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <Plus className="bg-[#00557f] text-white rounded p-1" size={20}/> Novo Chamado
                    </h3>
                    <form onSubmit={abrirChamado} className="space-y-4">
                        <input 
                            type="text" placeholder="Assunto curto" 
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#00557f]/20 outline-none transition-all"
                            value={novoChamado.assunto}
                            onChange={e => setNovoChamado({...novoChamado, assunto: e.target.value})}
                        />
                        <select 
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
                            value={novoChamado.setorDestino}
                            onChange={e => setNovoChamado({...novoChamado, setorDestino: e.target.value})}
                        >
                            <option value="TI">Para: T.I.</option>
                            <option value="RH">Para: R.H.</option>
                            <option value="Financeiro">Para: Financeiro</option>
                            <option value="Manutenção">Para: Manutenção</option>
                        </select>
                        <textarea 
                            placeholder="Descreva detalhadamente..." 
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm h-28 resize-none focus:ring-2 focus:ring-[#00557f]/20 outline-none transition-all"
                            value={novoChamado.descricao}
                            onChange={e => setNovoChamado({...novoChamado, descricao: e.target.value})}
                        />
                        
                        <label className="flex items-center justify-center w-full p-3 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 hover:border-[#00557f] transition-all group">
                            <div className="flex items-center gap-2 text-slate-400 group-hover:text-[#00557f]">
                                <Paperclip size={16} />
                                <span className="text-xs font-bold">{novoChamado.arquivo ? novoChamado.arquivo.name : "Anexar Arquivo"}</span>
                            </div>
                            <input type="file" className="hidden" onChange={handleFileChange} />
                        </label>

                        <button type="submit" className="w-full bg-[#00557f] hover:bg-[#003d5c] text-white py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all active:scale-95">
                            Enviar Solicitação
                        </button>
                    </form>
                </div>

                {/* Meus Chamados */}
                <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 pl-2">Minhas Solicitações</h3>
                    <div className="space-y-3">
                        {meusChamados.map(chamado => (
                            <div key={chamado.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${chamado.status === 'aberto' ? 'bg-yellow-400' : chamado.status === 'cancelado' ? 'bg-red-400' : 'bg-blue-400'}`} />
                                <div className="pl-3">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-slate-700 text-sm">{chamado.assunto || "Sem assunto"}</h4>
                                        {chamado.status === 'aberto' && (
                                            <button onClick={() => cancelarChamado(chamado.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                                                <XCircle size={16} />
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">Para: {chamado.setorDestino} • {chamado.data}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border
                                            ${chamado.status === 'aberto' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' : 
                                              chamado.status === 'em_andamento' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                                              'bg-slate-50 text-slate-500 border-slate-100'}`}>
                                            {chamado.status?.replace('_', ' ') || 'status'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {meusChamados.length === 0 && <div className="text-center p-4 text-slate-400 text-sm bg-slate-100/50 rounded-xl border border-dashed border-slate-200">Nenhuma solicitação ativa.</div>}
                    </div>
                </div>
            </div>

            {/* Coluna Direita: Chamados para o Setor (TI) */}
            <div className="xl:col-span-8">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[600px] flex flex-col">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h3 className="font-bold text-[#00557f] flex items-center gap-2">
                            <Clock size={18}/> Chamados para {usuarioSetor}
                        </h3>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14}/>
                            <input 
                                type="text" placeholder="Buscar..." 
                                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-[#00557f] outline-none"
                                onChange={(e) => setFiltro(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
                        {chamadosParaMeuSetor
                            /* CORREÇÃO AQUI: Adicionado (c.assunto || "") para evitar crash com dados antigos */
                            .filter(c => (c.assunto || "").toLowerCase().includes(filtro.toLowerCase()))
                            .map((chamado) => (
                            <div key={chamado.id} className={`group relative bg-white border rounded-xl p-5 transition-all hover:shadow-lg
                                ${chamado.status === 'concluido' ? 'border-slate-100 opacity-60 bg-slate-50' : 'border-slate-200'}`}>
                                
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border border-slate-200">
                                                De: {chamado.requisitanteSetor || "Desconhecido"}
                                            </span>
                                            {chamado.arquivoNome && (
                                                <span className="flex items-center gap-1 text-[10px] text-blue-500 bg-blue-50 px-2 py-1 rounded border border-blue-100 cursor-pointer hover:underline">
                                                    <Paperclip size={10} /> {chamado.arquivoNome}
                                                </span>
                                            )}
                                        </div>
                                        <h4 className={`text-lg font-bold mb-1 ${chamado.status === 'concluido' ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                                            {chamado.assunto || "Sem Assunto"}
                                        </h4>
                                        <p className="text-sm text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 mt-2">
                                            {chamado.descricao}
                                        </p>
                                    </div>

                                    {/* Ações do Chamado */}
                                    <div className="flex flex-col gap-2 ml-4 items-end">
                                        <span className="text-[10px] text-slate-400 font-mono mb-2">#{String(chamado.id).slice(-4)}</span>
                                        
                                        {chamado.status === 'aberto' && (
                                            <button 
                                                onClick={() => pegarChamado(chamado.id)}
                                                className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-bold hover:bg-yellow-200 transition-colors shadow-sm"
                                            >
                                                <Play size={14} fill="currentColor" /> PEGAR
                                            </button>
                                        )}

                                        {chamado.status === 'em_andamento' && (
                                            <button 
                                                onClick={() => concluirChamado(chamado.id)}
                                                className="flex items-center gap-2 px-4 py-2 bg-[#5fb0a5] text-white rounded-lg text-xs font-bold hover:bg-[#4a9c91] transition-colors shadow-sm"
                                            >
                                                <CheckCircle size={14} /> CONCLUIR
                                            </button>
                                        )}

                                        {chamado.status === 'concluido' && (
                                            <button 
                                                onClick={() => excluirChamado(chamado.id)}
                                                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Remover do Histórico"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Barra de status visual no card */}
                                {chamado.status === 'em_andamento' && (
                                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-yellow-600 bg-yellow-50 p-2 rounded border border-yellow-100">
                                        <Clock size={14} className="animate-pulse"/> Em resolução...
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        {chamadosParaMeuSetor.length === 0 && (
                             <div className="flex flex-col items-center justify-center h-64 text-slate-300">
                                 <CheckCircle size={48} className="mb-4 opacity-50"/>
                                 <p>Tudo limpo! Nenhum chamado pendente.</p>
                             </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}