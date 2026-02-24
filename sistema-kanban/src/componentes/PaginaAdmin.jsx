import React, { useState } from 'react';
import { Shield, UserPlus, Users, X } from 'lucide-react';

export default function PaginaAdmin({ equipe, setEquipe }) {
  // Mock de todos os usuários da empresa
  const todosUsuarios = [
    "João Silva", "Maria Oliveira", "Pedro Santos", "Ana Costa", 
    "Lucas Pereira", "Juliana Alves", "Fernando Rocha", "Camila Dias",
    "Ricardo Lima", "Beatriz Gomes"
  ];

  const [usuarioSelecionado, setUsuarioSelecionado] = useState('');

  const adicionarMembro = () => {
    if (!usuarioSelecionado) return;
    if (equipe.includes(usuarioSelecionado)) return alert("Usuário já está na equipe!");
    setEquipe([...equipe, usuarioSelecionado]);
    setUsuarioSelecionado('');
  };

  const removerMembro = (nome) => {
    setEquipe(equipe.filter(m => m !== nome));
  };

  return (
    <div className="h-full w-full overflow-y-auto p-8 bg-slate-50 custom-scrollbar">
      <div className="max-w-3xl mx-auto">
        
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-8">
          <h2 className="text-2xl font-bold text-[#00557f] mb-2 flex items-center gap-2">
            <Shield size={28} /> Painel do Administrador
          </h2>
          <p className="text-slate-500 mb-6">Gerencie os membros que têm acesso ao setor de <strong>TI</strong>.</p>

          <div className="flex gap-4 items-end bg-slate-50 p-6 rounded-xl border border-dashed border-slate-300">
            <div className="flex-1">
              <label className="block text-sm font-bold text-slate-700 mb-2">Adicionar Colaborador</label>
              <select 
                className="w-full p-3 border rounded-lg bg-white outline-none focus:border-[#00557f]"
                value={usuarioSelecionado}
                onChange={(e) => setUsuarioSelecionado(e.target.value)}
              >
                <option value="">Selecione um funcionário...</option>
                {todosUsuarios.filter(u => !equipe.includes(u)).map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
            <button 
              onClick={adicionarMembro}
              className="bg-[#00557f] text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-[#004466] transition-colors"
            >
              <UserPlus size={18} /> Adicionar
            </button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
            <Users size={20} /> Equipe Atual ({equipe.length})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {equipe.length === 0 && <p className="text-slate-400 italic">Nenhum membro na equipe.</p>}
            
            {equipe.map(membro => (
              <div key={membro} className="flex justify-between items-center p-3 border rounded-lg hover:border-[#5fb0a5] group bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[#00557f] font-bold text-xs">
                    {membro.charAt(0)}
                  </div>
                  <span className="font-medium text-slate-700">{membro}</span>
                </div>
                <button onClick={() => removerMembro(membro)} className="text-slate-300 hover:text-red-500 p-1">
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}