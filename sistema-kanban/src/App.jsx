import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldCheck } from 'lucide-react';

// Componentes
import FundoKanban from './componentes/FundoKanban';
import BarraLateral from './componentes/BarraLateral';
import PaginaChamados from './componentes/PaginaChamados';
import PaginaAdmin from './componentes/PaginaAdmin';
import ConfiguracaoCard from './componentes/ConfiguracaoCard';
import NovoCard from './componentes/NovoCard';

// Imagens (Mantenha seus imports de imagem aqui...)
import Logocfl from './assets/logocfl.png'; 
import Logofm from './assets/logofm.png';
import Logog1 from './assets/logog1.png';
import Logoge from './assets/logoge.png'; 
import Logoglobo from './assets/logoglobo.png';
import Logotvsergipe from './assets/logotvsergipe.png';
import Logoseven1 from './assets/logoseven1.png'; 
import Logoseven2 from './assets/logoseven2.png';
import Logogpsergipe from './assets/logogpsergipe.png';


function App() {
  const [equipe, setEquipe] = useState(["Arthur Campos", "Mariana Silva", "Ricardo Oliveira"]);
  const [usuarioLogado, setUsuarioLogado] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState('inicio'); 

  const [notifications, setNotifications] = useState([]);

  const notify = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
   }, 3000);
  };

  const NotificationToast = ({ notifications }) => (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2">
      {notifications.map(n => (
        <div key={n.id} className={`px-6 py-3 rounded-full border backdrop-blur-md shadow-lg transition-all animate-in fade-in slide-in-from-top-4 ${
          n.type === 'success' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-red-500/20 border-red-500 text-red-400'
        }`}>
          {n.message}
        </div>
      ))}
    </div>
  );

    const ModalOverlay = ({ children, onClose }) => (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose} // Fecha ao clicar no fundo
    >
      <div 
        className="bg-[#0f172a]/90 border border-blue-500/30 rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.2)] w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={e => e.stopPropagation()} // Impede fechar ao clicar dentro do modal
      >
        {children}
      </div>
    </div>
  );
  
  // Estado para saber em qual coluna criar o card (quando clica no +)
  const [colunaAlvoCriacao, setColunaAlvoCriacao] = useState(null);

  // Chamados
  const [chamados, setChamados] = useState(() => 
    JSON.parse(localStorage.getItem('sistema_chamados')) || []
  );
  
  // Kanban Data
  const [dadosKanban, setDadosKanban] = useState(() => 
    JSON.parse(localStorage.getItem('sistema_kanban_v3')) || {
      cards: {},
      columns: { 
        'col-1': { id: 'col-1', title: 'Caixa de Entrada', cardIds: [] },
        'col-2': { id: 'col-2', title: 'Em Análise', cardIds: [] },
        'col-3': { id: 'col-3', title: 'Concluído', cardIds: [] }
      },
      columnOrder: ['col-1', 'col-2', 'col-3'],
    }
  );

  // Modelo Card
  const [modeloCard, setModeloCard] = useState(() => 
    JSON.parse(localStorage.getItem('sistema_modelo_card_v3')) || []
  );

  const setorUsuarioLogado = "TI"; 
  const nomeUsuario = "Arthur Campos";

  useEffect(() => {
    localStorage.setItem('sistema_chamados', JSON.stringify(chamados));
    localStorage.setItem('sistema_kanban_v3', JSON.stringify(dadosKanban));
    localStorage.setItem('sistema_modelo_card_v3', JSON.stringify(modeloCard));
  }, [chamados, dadosKanban, modeloCard]);

  const entrarNoSistema = () => setUsuarioLogado(true);

  return (
    <div className="h-screen w-screen bg-[#f4f6f8] text-slate-700 flex flex-col overflow-hidden font-sans relative">
      
      {/* Background Decorativo */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#00557f]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Modal Bloqueio (Mantido igual) */}
      <AnimatePresence>
        {!usuarioLogado && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] flex items-center justify-center bg-[#00557f]/40 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-white p-10 rounded-3xl shadow-2xl w-[400px] text-center border border-white/50"
            >
              <div className="w-20 h-20 bg-[#f0f7ff] rounded-full flex items-center justify-center mx-auto mb-6 text-[#00557f] shadow-inner">
                <Lock size={40} />
              </div>
              <h2 className="text-2xl font-bold text-[#00557f] mb-2 font-sans">Área Restrita</h2>
              <button onClick={entrarNoSistema} className="w-full py-4 bg-[#00557f] text-white font-bold rounded-xl shadow-lg hover:bg-[#003d5c] transition-all flex items-center justify-center gap-3 active:scale-95 mt-6">
                <ShieldCheck size={20} /> ACESSAR SISTEMA
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Fixo */}
      <header className="flex-none flex items-center px-6 bg-white border-b border-slate-200 z-40 shadow-sm h-16 justify-between ml-20">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold text-[#00557f] tracking-tight uppercase flex items-center gap-2">
            Processos <span className="text-[#5fb0a5]">Internos</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
             <div className="text-right hidden md:block">
                 <p className="text-xs font-bold text-[#00557f]">{nomeUsuario}</p>
                 <p className="text-[10px] text-slate-400">{setorUsuarioLogado}</p>
             </div>
             <div className="w-8 h-8 rounded-full bg-[#00557f] text-white flex items-center justify-center font-bold text-xs">
                 {nomeUsuario.charAt(0)}
             </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden relative">
        <BarraLateral 
          usuarioLogado={usuarioLogado} 
          paginaAtual={paginaAtual} 
          setPaginaAtual={(pag) => { setPaginaAtual(pag); setColunaAlvoCriacao(null); }} // Reseta alvo ao mudar menu
          notificacoesChamados={chamados.filter(c => c.setorDestino === setorUsuarioLogado && c.status === 'aberto').length}
        />

        <div className="flex-1 flex flex-col overflow-hidden p-6 pl-24 relative bg-[#f4f6f8]">
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden relative flex flex-col">
            
            {paginaAtual === 'inicio' && (
              <FundoKanban 
                dados={dadosKanban} 
                setDados={setDadosKanban} 
                usuarioAtual={nomeUsuario} 
                logado={usuarioLogado}
                modeloCard={modeloCard}
                equipe={equipe} // Passando equipe para o modal de edição
                setPaginaAtual={setPaginaAtual}
                setColunaAlvoCriacao={setColunaAlvoCriacao}
              />
            )}

            {paginaAtual === 'config-modelo' && (
              <ConfiguracaoCard 
                modeloCard={modeloCard} 
                setModeloCard={setModeloCard} 
                setPaginaAtual={setPaginaAtual}
              />
            )}

            {paginaAtual === 'criar-card' && (
              <NovoCard 
                modeloCard={modeloCard}
                dadosKanban={dadosKanban}
                setDadosKanban={setDadosKanban}
                setPaginaAtual={setPaginaAtual}
                usuarioAtual={nomeUsuario}
                equipe={equipe}
                colunaAlvo={colunaAlvoCriacao} // Passa a coluna específica se existir
              />
            )}

            {paginaAtual === 'chamados' && (
              <PaginaChamados 
                chamados={chamados} 
                setChamados={setChamados} 
                usuarioSetor={setorUsuarioLogado} 
              />
            )}

            {paginaAtual === 'admin' && (
              <PaginaAdmin equipe={equipe} setEquipe={setEquipe} />
            )}
          </div>
          
          {/* Footer mantido */}
          <footer className="flex-none pt-4 flex justify-center opacity-40">
             <div className="flex gap-20 grayscale scale-80">
                <img src={Logocfl} alt="CFL" className="h-6 object-contain" />
                <img src={Logofm} alt="FM" className="h-6 object-contain" />
                <img src={Logog1} alt="G1" className="h-6 object-contain" />
                <img src={Logoge} alt="GE" className="h-6 object-contain" />
                <img src={Logoglobo} alt="Globo" className="h-6 object-contain" />
                <img src={Logotvsergipe} alt="TV Sergipe" className="h-6 object-contain" />
                <img src={Logoseven1} alt="Seven 1" className="h-6 object-contain" />
                <img src={Logoseven2} alt="Seven 2" className="h-6 object-contain" />
                <img src={Logogpsergipe} alt="Gp Sergipe" className="h-8 object-contain" />
             </div>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;