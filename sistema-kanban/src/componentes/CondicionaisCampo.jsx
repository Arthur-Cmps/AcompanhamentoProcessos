import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Plus, Trash2, Settings2, Edit,
  AlertCircle, CheckCircle2, List, ArrowLeft
} from 'lucide-react';

export default function CondicionaisCampo({ tituloCard, regrasSalvas = [], aoFechar, aoSalvar, dadosKanban }) {
  const listaColunas = dadosKanban?.columns ? Object.values(dadosKanban.columns) : [];
  
  // Estado principal: Guarda a lista de todas as regras
  const [listaDeRegras, setListaDeRegras] = useState(regrasSalvas);
  
  // Controle de Tela: 'form' (criando/editando) ou 'lista' (vendo as criadas)
  const [telaAtual, setTelaAtual] = useState('form');
  const [idRegraEmEdicao, setIdRegraEmEdicao] = useState(null);

  // Estados do Formulário
  const [cenarios, setCenarios] = useState([{ id: Date.now(), faseId: '', campoId: '' }]);
  const [acoesPositivas, setAcoesPositivas] = useState([{ id: Date.now() + 1, acao: '', faseId: '', campoId: '' }]);
  const [acoesNegativas, setAcoesNegativas] = useState([{ id: Date.now() + 2, acao: '', faseId: '', campoId: '' }]);

  const atualizarItem = (id, campoAtualizado, valor, set, lista) => {
    set(lista.map(item => {
      if (item.id === id) {
        if (campoAtualizado === 'faseId') return { ...item, [campoAtualizado]: valor, campoId: '' };
        return { ...item, [campoAtualizado]: valor };
      }
      return item;
    }));
  };

  const adicionarItem = (set, lista) => set([...lista, { id: Date.now(), acao: '', faseId: '', campoId: '' }]);
  const removerItem = (id, set, lista) => set(lista.filter(i => i.id !== id));

  const pegarCamposDaFase = (faseId) => {
    if (!faseId || !dadosKanban?.columns) return [];
    return dadosKanban.columns[faseId]?.configuracaoEntrada || [];
  };

  const pegarNomeDoCampo = (faseId, campoId) => {
    const campos = pegarCamposDaFase(faseId);
    const campo = campos.find(c => c.id === campoId);
    return campo ? campo.label : "Campo deletado";
  };

  const limparFormulario = () => {
    setCenarios([{ id: Date.now(), faseId: '', campoId: '' }]);
    setAcoesPositivas([{ id: Date.now() + 1, acao: '', faseId: '', campoId: '' }]);
    setAcoesNegativas([{ id: Date.now() + 2, acao: '', faseId: '', campoId: '' }]);
    setIdRegraEmEdicao(null);
  };

  const salvarRegraAtual = () => {
    // Validação básica
    if (!cenarios[0].campoId) return alert("Defina o cenário principal!");

    const novaRegra = {
      id: idRegraEmEdicao || Date.now().toString(),
      cenarios,
      acoesPositivas,
      acoesNegativas
    };

    let novaLista;
    if (idRegraEmEdicao) {
      novaLista = listaDeRegras.map(r => r.id === idRegraEmEdicao ? novaRegra : r);
    } else {
      novaLista = [...listaDeRegras, novaRegra];
    }

    setListaDeRegras(novaLista);
    limparFormulario();
    setTelaAtual('lista');
  };

  const editarRegra = (regra) => {
    setCenarios(regra.cenarios);
    setAcoesPositivas(regra.acoesPositivas);
    setAcoesNegativas(regra.acoesNegativas);
    setIdRegraEmEdicao(regra.id);
    setTelaAtual('form');
  };

  const excluirRegra = (id) => {
    setListaDeRegras(listaDeRegras.filter(r => r.id !== id));
  };

  const concluirTudo = () => {
    aoSalvar(listaDeRegras);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* HEADER */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-[#00557f] flex items-center gap-2">
              <Settings2 className="text-[#5fb0a5]" /> {tituloCard}
            </h2>
            <p className="text-slate-500 font-medium mt-1">
              {telaAtual === 'form' ? "Configure as regras de exibição dos campos." : "Gerencie as regras já criadas."}
            </p>
          </div>
          <button onClick={aoFechar} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
            <X size={24} />
          </button>
        </div>

        {/* CONTEÚDO */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          
          {/* TELA DE LISTAGEM */}
          {telaAtual === 'lista' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-700 text-lg">Regras Ativas ({listaDeRegras.length})</h3>
                <button onClick={() => { limparFormulario(); setTelaAtual('form'); }} className="bg-[#5fb0a5] text-white px-4 py-2 rounded-lg font-bold text-sm shadow flex items-center gap-2 hover:bg-[#4a9c91]">
                  <Plus size={16}/> Nova Regra
                </button>
              </div>

              {listaDeRegras.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 text-slate-400">
                  <List size={40} className="mx-auto mb-3 opacity-50"/>
                  <p>Nenhuma condicional criada para esta fase.</p>
                </div>
              ) : (
                listaDeRegras.map((regra, index) => (
                  <div key={regra.id} className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm flex justify-between items-center group hover:border-[#00557f] transition-all">
                    <div>
                      <span className="text-xs font-bold text-[#00557f] bg-blue-50 px-2 py-1 rounded mb-2 inline-block">Regra {index + 1}</span>
                      <p className="text-sm text-slate-600 font-medium">
                        Se o campo <strong className="text-slate-800">{pegarNomeDoCampo(regra.cenarios[0]?.faseId, regra.cenarios[0]?.campoId)}</strong> for preenchido...
                      </p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => editarRegra(regra)} className="p-2 text-slate-400 hover:text-[#5fb0a5] hover:bg-slate-50 rounded-lg"><Edit size={18}/></button>
                      <button onClick={() => excluirRegra(regra.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TELA DE FORMULÁRIO (A criação original) */}
          {telaAtual === 'form' && (
            <div className="space-y-8">
              {/* CAIXA 1: Cenário */}
              <section className="relative p-6 rounded-2xl border-2 border-dashed border-slate-200 bg-white">
                <div className="absolute -top-4 left-6 bg-[#00557f] text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">1. Primeiro, defina o cenário</div>
                <div className="space-y-4 mt-4">
                  {cenarios.map((cenario) => (
                    <div key={cenario.id} className="flex gap-3 items-center">
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <select value={cenario.faseId} onChange={(e) => atualizarItem(cenario.id, 'faseId', e.target.value, setCenarios, cenarios)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-[#5fb0a5] font-medium text-slate-700 text-sm">
                          <option value="">Selecione a Fase</option>
                          {listaColunas.map(col => <option key={col.id} value={col.id}>{col.title}</option>)}
                        </select>
                        <select disabled={!cenario.faseId} value={cenario.campoId} onChange={(e) => atualizarItem(cenario.id, 'campoId', e.target.value, setCenarios, cenarios)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-[#5fb0a5] font-medium text-slate-700 text-sm disabled:opacity-50">
                          <option value="">{cenario.faseId ? "Selecione o campo" : "Aguardando Fase"}</option>
                          {pegarCamposDaFase(cenario.faseId).map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* CAIXA 2: Se Sim */}
                <section className="p-6 rounded-2xl border border-emerald-100 bg-emerald-50/30">
                  <h4 className="text-emerald-700 font-bold mb-4 flex items-center gap-2"><CheckCircle2 size={18} /> Se acontecer, faça isso:</h4>
                  <div className="space-y-3">
                    {acoesPositivas.map((acao) => (
                      <div key={acao.id} className="grid grid-cols-3 gap-2 relative">
                        <select value={acao.acao} onChange={(e) => atualizarItem(acao.id, 'acao', e.target.value, setAcoesPositivas, acoesPositivas)} className="bg-white border border-emerald-200 rounded-lg px-2 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-400 text-emerald-700">
                          <option value="">Ação</option><option value="exibir">👁️ Exibir</option><option value="esconder">🚫 Esconder</option>
                        </select>
                        <select value={acao.faseId} onChange={(e) => atualizarItem(acao.id, 'faseId', e.target.value, setAcoesPositivas, acoesPositivas)} className="bg-white border border-emerald-200 rounded-lg px-2 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-400">
                          <option value="">Fase</option>{listaColunas.map(col => <option key={col.id} value={col.id}>{col.title}</option>)}
                        </select>
                        <select disabled={!acao.faseId} value={acao.campoId} onChange={(e) => atualizarItem(acao.id, 'campoId', e.target.value, setAcoesPositivas, acoesPositivas)} className="bg-white border border-emerald-200 rounded-lg px-2 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-50">
                          <option value="">Campo</option>{pegarCamposDaFase(acao.faseId).map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                        </select>
                      </div>
                    ))}
                    <button onClick={() => adicionarItem(setAcoesPositivas, acoesPositivas)} className="w-full py-2 border-2 border-dashed border-emerald-200 rounded-lg text-emerald-600 text-xs font-bold hover:bg-emerald-100">+ Adicionar ação</button>
                  </div>
                </section>

                {/* CAIXA 3: Se Não */}
                <section className="p-6 rounded-2xl border border-amber-100 bg-amber-50/30">
                  <h4 className="text-amber-700 font-bold mb-4 flex items-center gap-2"><AlertCircle size={18} /> Se NÃO acontecer:</h4>
                  <div className="space-y-3">
                    {acoesNegativas.map((acao) => (
                      <div key={acao.id} className="grid grid-cols-3 gap-2 relative">
                        <select value={acao.acao} onChange={(e) => atualizarItem(acao.id, 'acao', e.target.value, setAcoesNegativas, acoesNegativas)} className="bg-white border border-amber-200 rounded-lg px-2 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-amber-400 text-amber-700">
                          <option value="">Ação</option><option value="exibir">👁️ Exibir</option><option value="esconder">🚫 Esconder</option>
                        </select>
                        <select value={acao.faseId} onChange={(e) => atualizarItem(acao.id, 'faseId', e.target.value, setAcoesNegativas, acoesNegativas)} className="bg-white border border-amber-200 rounded-lg px-2 py-2 text-xs outline-none focus:ring-2 focus:ring-amber-400">
                          <option value="">Fase</option>{listaColunas.map(col => <option key={col.id} value={col.id}>{col.title}</option>)}
                        </select>
                        <select disabled={!acao.faseId} value={acao.campoId} onChange={(e) => atualizarItem(acao.id, 'campoId', e.target.value, setAcoesNegativas, acoesNegativas)} className="bg-white border border-amber-200 rounded-lg px-2 py-2 text-xs outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-50">
                          <option value="">Campo</option>{pegarCamposDaFase(acao.faseId).map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                        </select>
                      </div>
                    ))}
                    <button onClick={() => adicionarItem(setAcoesNegativas, acoesNegativas)} className="w-full py-2 border-2 border-dashed border-amber-200 rounded-lg text-amber-600 text-xs font-bold hover:bg-amber-100">+ Adicionar ação</button>
                  </div>
                </section>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER DINÂMICO */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-4">
          <button onClick={aoFechar} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-all">Cancelar</button>
          
          {telaAtual === 'form' ? (
            <>
              {/* NOVO BOTÃO QUE VOCÊ PEDIU */}
              <button onClick={() => setTelaAtual('lista')} className="px-6 py-3 rounded-xl font-bold text-[#00557f] bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-all flex items-center gap-2">
                <List size={18} /> Ver Salvas ({listaDeRegras.length})
              </button>
              <button onClick={salvarRegraAtual} className="px-8 py-3 rounded-xl font-bold bg-[#5fb0a5] text-white shadow-lg shadow-[#5fb0a5]/30 hover:bg-[#4a9c91] transition-all flex items-center gap-2">
                <Plus size={18} /> {idRegraEmEdicao ? "Atualizar Regra" : "Salvar Regra"}
              </button>
            </>
          ) : (
            <button onClick={concluirTudo} className="px-8 py-3 rounded-xl font-bold bg-[#00557f] text-white shadow-lg shadow-[#00557f]/30 hover:bg-[#003d5c] transition-all flex items-center gap-2">
              <CheckCircle2 size={18} /> Concluir e Aplicar Tudo
            </button>
          )}
        </div>

      </motion.div>
    </div>
  );
}