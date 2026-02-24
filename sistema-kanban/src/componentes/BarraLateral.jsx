import React from 'react';
import { Home, PlusSquare, Phone, Shield, Settings, Layout } from 'lucide-react';

export default function BarraLateral({ usuarioLogado, paginaAtual, setPaginaAtual, notificacoesChamados }) {
  
  const BotaoMenu = ({ id, icon: Icon, label, badge, special }) => (
    <button
      onClick={() => usuarioLogado && setPaginaAtual(id)}
      disabled={!usuarioLogado}
      className={`relative group w-12 h-12 rounded-xl transition-all duration-300 flex items-center justify-center mb-4
      ${paginaAtual === id && usuarioLogado 
        ? 'bg-[#00557f] text-white shadow-lg shadow-[#00557f]/40 scale-105' 
        : special 
            ? 'bg-[#5fb0a5] text-white hover:bg-[#4a9c91] shadow-md'
            : 'text-slate-400 hover:bg-white hover:text-[#00557f] hover:shadow-md'
      } ${!usuarioLogado ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <Icon size={20} strokeWidth={2} />
      
      {/* Tooltip Lateral */}
      <span className="absolute left-14 bg-slate-800 text-white text-xs px-2 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-xl border border-slate-700 font-medium translate-x-2 group-hover:translate-x-0">
        {label}
      </span>

      {/* Badge */}
      {badge > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#f4f6f8]">
          {badge}
        </span>
      )}
    </button>
  );

  return (
    <div className="fixed left-0 top-0 bottom-0 w-20 flex flex-col items-center py-6 z-50 bg-[#f4f6f8] border-r border-slate-200/60">
      
      {/* Topo Logo ou Ícone */}
      <div className="mb-8 w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-[#00557f]">
          <Layout size={24} />
      </div>

      <div className="flex-1 flex flex-col items-center w-full px-2">
        
        <BotaoMenu id="inicio" icon={Home} label="Board Kanban" />
        
        {/* Botão de Destaque para Criar */}
        <div className="my-2">
             <BotaoMenu id="criar-card" icon={PlusSquare} label="Criar Card" special={true} />
        </div>

        <BotaoMenu id="chamados" icon={Phone} label="Chamados" badge={notificacoesChamados} />
        
        <div className="w-8 h-[1px] bg-slate-300/50 my-4" />
        
        {/* Área Admin */}
        <BotaoMenu id="config-modelo" icon={Settings} label="Editor de Modelo (Admin)" />
        <BotaoMenu id="admin" icon={Shield} label="Admin Setores" />
        
      </div>
    </div>
  );
}