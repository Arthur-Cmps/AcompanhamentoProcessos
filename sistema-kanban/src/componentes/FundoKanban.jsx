import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { 
  Plus, Trash2, X, Save, Settings, ArrowRight, 
  FileText, Clock, User, ChevronRight, Layout,
  UploadCloud, AlertTriangle, GitMerge, Type, CheckSquare, Phone, Tag 
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useForm } from 'react-hook-form';

const TIPOS_DE_CAMPOS = [
  { tipo: 'text', label: 'Texto Curto', icon: Type },
  { tipo: 'text_long', label: 'Texto Longo', icon: FileText },
  { tipo: 'anexo', label: 'Anexo', icon: UploadCloud },
  { tipo: 'checkbox', label: 'Checkbox', icon: CheckSquare },
  { tipo: 'responsavel', label: 'Responsável', icon: User },
  { tipo: 'data', label: 'Data', icon: Clock },
  { tipo: 'data_hora', label: 'Data e Hora', icon: Clock },
  { tipo: 'data_vencimento', label: 'Data de Vencimento', icon: AlertTriangle },
  { tipo: 'etiquetas', label: 'Etiquetas', icon: Tag }, // Adicionado
  { tipo: 'email', label: 'E-mail', icon: Layout }, 
  { tipo: 'telefone', label: 'Telefone', icon: Phone },
  { tipo: 'tempo', label: 'Tempo', icon: Clock },
  { tipo: 'cpf_cnpj', label: 'CPF / CNPJ', icon: FileText },
  { tipo: 'moeda', label: 'Moeda', icon: FileText },
  { tipo: 'numerico', label: 'Apenas Números', icon: FileText },
];

export const NotificacaoToast = ({ mensagem, visivel }) => {
    if (!visivel) return null;
    return (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-3 bg-[#00557f]/90 backdrop-blur-md text-white px-6 py-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 animate-in slide-in-from-top-10 fade-in duration-500">
            <div className="bg-[#5fb0a5] p-2 rounded-lg">
                <AlertTriangle size={18} className="text-white animate-pulse" />
            </div>
            <span className="font-bold text-sm tracking-wide">{mensagem}</span>
        </div>
    );
};

// ==========================================
// RENDERIZADOR DINÂMICO DE CAMPOS
// ==========================================
export const CampoDinamico = ({ campo, register, equipe, setValue, watch, dados }) => {
    const estiloBase = "w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#5fb0a5] focus:ring-4 focus:ring-[#5fb0a5]/10 transition-all text-sm font-medium text-slate-700 shadow-sm";
    
    const moedas = [
        { label: 'R$ - Real', value: 'BRL' },
        { label: 'U$ - Dólar', value: 'USD' },
        { label: '€ - Euro', value: 'EUR' },
        { label: '£ - Libra', value: 'GBP' }
    ];

    switch (campo.tipo) {
        case 'anexo':
            return (
                <div className="relative group">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer bg-slate-50 hover:bg-white hover:border-[#5fb0a5] transition-all group">
                        <UploadCloud size={32} className="text-slate-400 group-hover:text-[#5fb0a5] mb-2 transition-colors" />
                        <span className="text-xs font-bold text-slate-500 group-hover:text-[#00557f]">Escolha o documento, ou arraste-o aqui</span>
                        <input type="file" className="hidden" {...register(campo.id, { required: campo.obrigatorio })} />
                    </label>
                </div>
            );

        case 'responsavel':
            return (
                <select className={estiloBase} {...register(campo.id, { required: campo.obrigatorio })}>
                    <option value="">Selecione um colaborador da equipe...</option>
                    {equipe?.map((membro, i) => (
                        <option key={i} value={membro}>{membro}</option>
                    ))}
                </select>
            );

        case 'data':
            // O subTipo é definido pelo ADM na configuração
            const tipoData = campo.subTipo || 'data'; 

            if (tipoData === 'data_hora') {
                return <input type="datetime-local" className={estiloBase} {...register(campo.id, { required: campo.obrigatorio })} />;
            }
            
            if (tipoData === 'data_vencimento') {
                return (
                    <div className="relative">
                        <input 
                            type="date" 
                            className={`${estiloBase} border-red-200 text-red-600 font-bold focus:border-red-500 focus:ring-red-100`} 
                            {...register(campo.id, { required: campo.obrigatorio })} 
                        />
                        <div className="absolute right-3 top-3.5 text-red-400"><AlertTriangle size={18}/></div>
                    </div>
                );
        }

        // Padrão: Apenas Data
        return <input type="date" className={estiloBase} {...register(campo.id, { required: campo.obrigatorio })} />;
        case 'data_hora':
            return <input type="datetime-local" className={estiloBase} {...register(campo.id, { required: campo.obrigatorio })} />;

        case 'data_vencimento':
            return (
                <div className="relative">
                    <input 
                        type="date" 
                        className={`${estiloBase} border-red-200 text-red-600 font-bold focus:border-red-500 focus:ring-red-100`} 
                        {...register(campo.id, { required: campo.obrigatorio })} 
                    />
                    <div className="absolute right-3 top-3.5 text-red-400"><Clock size={18}/></div>
                </div>
            );
            
        case 'etiquetas':
        // Busca etiquetas já usadas em outros cards para sugerir
        const etiquetasSugeridas = Object.values(dados?.cards || {})
            .map(c => c.dados?.[campo.id])
            .filter(Boolean)
            .flat();
        const etiquetasUnicas = [...new Set(etiquetasSugeridas)];

        return (
            <div className="space-y-2">
                <input type="text" className={estiloBase} placeholder="Digite a etiqueta..." {...register(campo.id)} />
                <div className="flex gap-2 overflow-x-auto py-1 custom-scrollbar">
                    {etiquetasUnicas.map((tag, idx) => (
                        <button key={idx} type="button" onClick={() => setValue(campo.id, tag)} className="px-3 py-1 bg-slate-100 hover:bg-[#5fb0a5] hover:text-white rounded-full text-[10px] font-bold transition-all whitespace-nowrap">
                            + {tag}
                        </button>
                    ))}
                </div>
            </div>
        );

        case 'email':
            return (
                <input 
                    type="email" 
                    placeholder="exemplo@dominio.com"
                    className={estiloBase}
                    {...register(campo.id, { 
                        required: campo.obrigatorio,
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Email inválido"
                        }
                    })} 
                />
            );

        case 'telefone':
            return (
                <input 
                    type="tel" 
                    placeholder="(00) 00000-0000"
                    className={estiloBase}
                    {...register(campo.id, { 
                        required: campo.obrigatorio,
                        pattern: {
                            value: /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/,
                            message: "Telefone inválido"
                        }
                    })} 
                />
        );

        case 'tempo':
            return <input type="time" className={estiloBase} {...register(campo.id, { required: campo.obrigatorio })} />;

        case 'cpf_cnpj':
            const [tipoDoc, setTipoDoc] = useState('cpf'); // Adicione este estado no topo do componente ou controle via watch
            
            const validarDoc = (valor) => {
                const limpo = valor.replace(/\D/g, '');
                if (tipoDoc === 'cpf' && limpo.length !== 11) return "CPF deve ter 11 números";
                if (tipoDoc === 'cnpj' && limpo.length !== 14) return "CNPJ deve ter 14 números";
                return true;
            };

        return (
            <div className="space-y-3">
                <div className="flex gap-2">
                    <button type="button" onClick={() => setTipoDoc('cpf')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${tipoDoc === 'cpf' ? 'bg-[#00557f] text-white border-[#00557f]' : 'bg-white text-slate-400 border-slate-200'}`}>CPF</button>
                    <button type="button" onClick={() => setTipoDoc('cnpj')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${tipoDoc === 'cnpj' ? 'bg-[#00557f] text-white border-[#00557f]' : 'bg-white text-slate-400 border-slate-200'}`}>CNPJ</button>
                </div>
                <input 
                    type="text" 
                    placeholder={tipoDoc === 'cpf' ? "000.000.000-00" : "00.000.000/0000-00"}
                    maxLength={tipoDoc === 'cpf' ? 14 : 18}
                    className={estiloBase}
                    {...register(campo.id, { 
                        required: campo.obrigatorio,
                        validate: validarDoc
                    })}
                />
            </div>
        );

        case 'moeda':
            return (
                <div className="flex gap-2">
                <select className="p-2 border rounded-lg bg-slate-50 text-sm">
                <option>BRL (R$)</option>
                <option>USD ($)</option>
                <option>EUR (€)</option>
                </select>
                <input
                type="number"
                placeholder="0,00"
                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-[#00557f] outline-none"
                {...register(campo.id, { required: campo.obrigatorio })}
                />
                </div>
            );

        case 'numerico':
            return <input
            type="number"
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#00557f] outline-none"
            {...register(campo.id, { required: campo.obrigatorio })}
            onKeyPress={(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }}
        />;

        case 'checkbox':
            return (
            <div className="space-y-2">
                {campo.opcoes?.map((opcao) => (
                <label key={opcao} className="flex items-center gap-2 p-2 border rounded-lg hover:bg-slate-50 cursor-pointer">
                    <input
                    type="checkbox"
                    value={opcao}
                    {...register(campo.id, { required: campo.obrigatorio })}
                    // Lógica para múltipla escolha: se 'multiplo' for false, agimos como radio
                    onClick={(e) => {
                        if (!campo.aceitaMultiplo) {
                        const checkboxes = document.getElementsByName(campo.id);
                        checkboxes.forEach(cb => { if(cb !== e.target) cb.checked = false; });
                        }
                    }}
                    className="rounded border-slate-300 text-[#00557f] focus:ring-[#00557f]"
                    />
                    <span className="text-sm text-slate-600">{opcao}</span>
                </label>
                ))}
            </div>
            );

        default:
            return <textarea className={estiloBase} rows={3} placeholder="Digite as informações aqui..." {...register(campo.id, { required: campo.obrigatorio })} />;
    }
};

// ==========================================
// MODAL DE CONFIGURAÇÃO DE FASE (Admin)
// ==========================================
const ModalConfigFase = ({ coluna, fechar, salvarConfig, deletarFase, mostrarNotificacao }) => {
    const cliqueNoFundo = (e) => {
        if (e.target.id === "fundo-modal-config") fechar();
    };
    
    const [campos, setCampos] = useState(coluna.configuracaoEntrada || []);
    const [campoEmEdicao, setCampoEmEdicao] = useState(null);
    const [modalCondicionaisAberto, setModalCondicionaisAberto] = useState(false);

    const removerCampo = (id) => {
        setCampos(campos.filter(c => c.id !== id));
        if (campoEmEdicao?.id === id) setCampoEmEdicao(null);
        {/* Adicione isso dentro das configurações de campo do ADM */}
        {campoEmEdicao.tipo === 'data' && (
            <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <label className="block text-xs font-bold text-[#00557f] mb-2 uppercase">Tipo de Calendário</label>
                <select 
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm"
                    value={campoEmEdicao.subTipo || 'data'}
                    onChange={(e) => {
                        const atualizado = { ...campoEmEdicao, subTipo: e.target.value };
                        setCampoEmEdicao(atualizado);
                        setCampos(campos.map(c => c.id === campo.id ? atualizado : c));
                    }}
                >
                    <option value="data">Apenas Data (Calendário)</option>
                    <option value="data_hora">Data e Hora (Calendário + Relógio)</option>
                    <option value="data_vencimento">Data de Vencimento (Destaque Vermelho)</option>
                </select>
            </div>
        )}
        mostrarNotificacao("Campo removido.");
    };

    const onDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;

        if (source.droppableId === 'sidebar-fields' && destination.droppableId === 'builder-area') {
            const fieldType = TIPOS_DE_CAMPOS[source.index];
            const newField = {
                id: uuidv4(),
                tipo: fieldType.tipo,
                label: fieldType.label,
                ajuda: '',
                obrigatorio: false,
                opcoes: ['Opção 1']
            };
            const novosCampos = Array.from(campos);
            novosCampos.splice(destination.index, 0, newField);
            setCampos(novosCampos);
            setCampoEmEdicao(newField);
            mostrarNotificacao("Campo adicionado!");
            return;
        }

        if (source.droppableId === 'builder-area' && destination.droppableId === 'builder-area') {
            const novosCampos = Array.from(campos);
            const [moved] = novosCampos.splice(source.index, 1);
            novosCampos.splice(destination.index, 0, moved);
            setCampos(novosCampos);
        }
    };

    return (
        <div id="fundo-modal-config" onClick={cliqueNoFundo} className="fixed inset-0 z-[100] bg-[#001a2c]/60 backdrop-blur-sm flex items-center justify-center p-4 transition-all">
            
            {/* Modal de Condicionais (Sobreposto) */}
            {modalCondicionaisAberto && (
                <div id="modal-condicionais" onClick={(e) => {if(e.target.id === "modal-condicionais") setModalCondicionaisAberto(false)}} className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white/95 backdrop-blur-2xl rounded-[2rem] shadow-2xl w-[600px] h-[500px] p-8 border border-white/50 flex flex-col animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-black text-[#00557f] flex items-center gap-2"><GitMerge className="text-[#5fb0a5]"/> Condicionais em Campo</h3>
                            <button onClick={() => setModalCondicionaisAberto(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
                        </div>
                        <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                            <p className="text-slate-400 font-medium">Área reservada para lógica de condicionais (Em breve).</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white/95 backdrop-blur-2xl rounded-[2rem] shadow-[0_0_50px_rgba(0,85,127,0.4)] w-full max-w-[1100px] h-[85vh] flex flex-col overflow-hidden border border-white/40 animate-in zoom-in-95 duration-300">
                <div className="px-8 py-6 border-b border-slate-200/50 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
                    <div>
                        <span className="text-[10px] font-bold text-[#5fb0a5] uppercase tracking-[0.2em]">Construa sua Fase</span>
                        <h3 className="text-2xl font-black text-[#00557f] flex items-center gap-3">
                            <Settings className="text-[#5fb0a5]" size={28} /> {coluna.title}
                        </h3>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => { if(window.confirm('Excluir fase permanentemente?')) { deletarFase(coluna.id); fechar(); } }} className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-xl font-bold transition-all text-sm border border-red-100 hover:border-red-500 shadow-sm">
                            <Trash2 size={16}/> 
                        </button>
                        <button onClick={fechar} className="p-2.5 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"><X size={24}/></button>
                    </div>
                </div>

                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex-1 flex overflow-hidden">
                        <div className="w-[320px] bg-slate-50/50 flex flex-col border-r border-slate-200/50">
                            <div className="p-5 border-b border-slate-200/50">
                                <h4 className="font-bold text-slate-500 text-xs uppercase tracking-wider">Tipos de Campo</h4>
                                <p className="text-[10px] text-slate-400 mt-1">Arraste para a área à direita</p>
                            </div>
                            <Droppable droppableId="sidebar-fields" isDropDisabled={true}>
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps} className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                                        {TIPOS_DE_CAMPOS.map((field, index) => (
                                            <Draggable key={field.tipo} draggableId={field.tipo} index={index}>
                                                {(provided, snapshot) => (
                                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={`flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-[#5fb0a5] hover:shadow-md cursor-grab active:cursor-grabbing transition-all ${snapshot.isDragging ? 'ring-2 ring-[#00557f] rotate-2 z-50' : ''}`}>
                                                        <div className="bg-slate-50 p-2 rounded-lg text-[#00557f]"><field.icon size={16} /></div>
                                                        <span className="text-sm font-bold text-slate-600">{field.label}</span>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                            <div className="p-5 border-t border-slate-200/50 bg-white/50 backdrop-blur">
                                <button onClick={() => setModalCondicionaisAberto(true)} className="w-full bg-[#00557f] text-white py-3.5 rounded-xl font-bold hover:bg-[#003d5c] hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 shadow-md shadow-[#00557f]/20">
                                    <GitMerge size={18}/> Condicionais em Campo
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 bg-white p-8 overflow-y-auto custom-scrollbar flex justify-center">
                            <div className="w-full max-w-2xl">
                                <Droppable droppableId="builder-area">
                                    {(provided, snapshot) => (
                                        <div ref={provided.innerRef} {...provided.droppableProps} className={`min-h-[400px] rounded-[2rem] transition-all p-6 space-y-4 ${snapshot.isDraggingOver ? 'bg-[#f0fffd] border-2 border-dashed border-[#5fb0a5]' : 'bg-transparent border-2 border-dashed border-transparent'} ${campos.length === 0 ? 'border-slate-200 flex items-center justify-center' : ''}`}>
                                            {campos.length === 0 && !snapshot.isDraggingOver && (
                                                <div className="text-center text-slate-400 opacity-60">
                                                    <Layout size={64} className="mx-auto mb-4 text-[#5fb0a5]"/>
                                                    <h3 className="text-lg font-bold text-slate-600 mb-1">Área de Montagem</h3>
                                                    <p className="text-sm">Arraste os campos da esquerda para cá.</p>
                                                </div>
                                            )}
                                            {campos.map((campo, index) => (
                                                <Draggable key={campo.id} draggableId={campo.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div ref={provided.innerRef} {...provided.draggableProps} className={`bg-white rounded-2xl border transition-all overflow-hidden ${campoEmEdicao?.id === campo.id ? 'border-[#5fb0a5] ring-4 ring-[#5fb0a5]/10 shadow-lg' : 'border-slate-200 shadow-sm hover:border-[#00557f]'} ${snapshot.isDragging ? 'shadow-2xl ring-2 ring-[#00557f] z-50' : ''}`}>
                                                            <div className="flex items-center justify-between p-3 bg-slate-50 border-b border-slate-100">
                                                                <div className="flex items-center gap-3 flex-1" {...provided.dragHandleProps}>
                                                                    <div className="cursor-grab text-slate-400 hover:text-[#00557f]"><Layout size={16}/></div>
                                                                    <span className="font-bold text-[#00557f] text-sm">{campo.label || 'Campo Sem Título'} {campo.obrigatorio && <span className="text-red-500">*</span>}</span>
                                                                    <span className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-400 font-mono uppercase">{campo.tipo}</span>
                                                                </div>
                                                                <div className="flex gap-1">
                                                                    <button onClick={() => setCampoEmEdicao(campoEmEdicao?.id === campo.id ? null : campo)} className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-[#5fb0a5] transition-colors"><Settings size={16}/></button>
                                                                    <button onClick={() => removerCampo(campo.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                                                                </div>
                                                            </div>

                                                            {campoEmEdicao?.id === campo.id && (
                                                                <div className="p-5 bg-white space-y-4 animate-in slide-in-from-top-2 duration-200">
                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        <div>
                                                                            <label className="block text-xs font-bold text-slate-500 mb-1">Título do Campo</label>
                                                                            <input className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#5fb0a5] focus:ring-2 focus:ring-[#5fb0a5]/20" value={campoEmEdicao.label} onChange={(e) => { const atualizado = { ...campoEmEdicao, label: e.target.value }; setCampoEmEdicao(atualizado); setCampos(campos.map(c => c.id === campo.id ? atualizado : c)); }} />
                                                                        </div>
                                                                        <div>
                                                                            <label className="block text-xs font-bold text-slate-500 mb-1">Texto de Ajuda</label>
                                                                            <input className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#5fb0a5] focus:ring-2 focus:ring-[#5fb0a5]/20" value={campoEmEdicao.ajuda} onChange={(e) => { const atualizado = { ...campoEmEdicao, ajuda: e.target.value }; setCampoEmEdicao(atualizado); setCampos(campos.map(c => c.id === campo.id ? atualizado : c)); }} />
                                                                        </div>
                                                                    </div>
                                                                    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer w-max p-2 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-200">
                                                                        <input type="checkbox" checked={campoEmEdicao.obrigatorio} onChange={(e) => { const atualizado = { ...campoEmEdicao, obrigatorio: e.target.checked }; setCampoEmEdicao(atualizado); setCampos(campos.map(c => c.id === campo.id ? atualizado : c)); }} className="w-4 h-4 text-[#00557f] rounded" />
                                                                        Tornar este campo obrigatório
                                                                    </label>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        </div>
                    </div>
                </DragDropContext>

                <div className="p-6 bg-slate-50 border-t border-slate-200/50 flex justify-end">
                    <button onClick={() => { salvarConfig(coluna.id, campos); fechar(); }} className="bg-[#5fb0a5] text-white px-10 py-3.5 rounded-xl font-bold hover:bg-[#4a9c91] hover:-translate-y-1 transition-all shadow-lg shadow-[#5fb0a5]/30 text-sm flex items-center gap-2">
                        <Save size={18} /> Salvar Modelo da Fase
                    </button>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// MODAL: EDITAR CARD (Usuário)
// ==========================================
const ModalEditarCard = ({ card, dados, setDados, modeloCard, fechar, equipe, mostrarNotificacao }) => {
    const colunaAtualId = Object.keys(dados.columns).find(colId => dados.columns[colId].cardIds.includes(card.id));
    const colunaAtual = dados.columns[colunaAtualId];
    const camposFase = colunaAtual.configuracaoEntrada || [];
    
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: card.dadosFases?.[colunaAtualId] || {}
    });

    const moverCard = (destinoColId) => {
        const novaOrigemCardIds = colunaAtual.cardIds.filter(id => id !== card.id);
        const destinoCol = dados.columns[destinoColId];
        const novoDestinoCardIds = [...destinoCol.cardIds, card.id];

        setDados({
            ...dados,
            columns: {
                ...dados.columns,
                [colunaAtualId]: { ...colunaAtual, cardIds: novaOrigemCardIds },
                [destinoColId]: { ...destinoCol, cardIds: novoDestinoCardIds }
            }
        });
        fechar();
    };

    const salvarDadosFase = (data) => {
        const cardAtualizado = {
            ...card,
            dadosFases: {
                ...card.dadosFases,
                [colunaAtualId]: data
            }
        };
        setDados({
            ...dados,
            cards: { ...dados.cards, [card.id]: cardAtualizado }
        });
        mostrarNotificacao("Dados da fase salvos com sucesso!");
    };
    
    const excluirCard = () => {
        if(!window.confirm("Excluir card permanentemente?")) return;
        const novosCards = { ...dados.cards };
        delete novosCards[card.id];
        const novasCols = { ...dados.columns };
        novasCols[colunaAtualId].cardIds = novasCols[colunaAtualId].cardIds.filter(id => id !== card.id);
        setDados({ ...dados, cards: novosCards, columns: novasCols });
        fechar();
    };

    return (
        <div id="modal-backdrop-card" onClick={(e) => {if(e.target.id === "modal-backdrop-card") fechar()}} className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-[1200px] h-[85vh] rounded-[2rem] shadow-2xl flex overflow-hidden">
                <div className="w-[300px] bg-slate-50 border-r border-slate-200 flex flex-col">
                    <div className="p-6 border-b border-slate-200">
                        <h2 className="text-lg font-bold text-[#00557f] leading-tight mb-2">{card.titulo}</h2>
                        <span className="text-xs font-mono text-slate-400 bg-slate-200 px-2 py-1 rounded">ID: {card.id.slice(0,6)}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                        <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Dados Iniciais</h4>
                            {/* Dentro do formulário de Criar Card */}
                            <div className="space-y-4">
                                {modeloCard.map((campo) => (
                                    <div key={campo.id} className="flex flex-col gap-1">
                                        <label className="text-sm font-bold text-slate-700">
                                            {campo.label} {campo.obrigatorio && <span className="text-red-500">*</span>}
                                        </label>
                                        {campo.ajuda && <p className="text-[11px] text-slate-400 mb-1">{campo.ajuda}</p>}
                                        
                                        {/* CHAMADA DO COMPONENTE INTELIGENTE */}
                                        <CampoDinamico 
                                            campo={campo} 
                                            register={register} 
                                            equipe={equipe} 
                                            setValue={setValue} 
                                            watch={watch} 
                                        />
                                        
                                        {/* Validação de erro (Email, CPF, etc) */}
                                        {errors[campo.id] && (
                                            <span className="text-[10px] text-red-500 font-bold mt-1">
                                                {errors[campo.id].message || 'Campo obrigatório'}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* HISTÓRICO EXPANSÍVEL POR FASE */}
                        <div className="pt-4 border-t border-slate-200">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Histórico de Fases</h4>
                            <div className="space-y-2">
                                {Object.entries(card.dadosFases || {}).map(([faseId, dadosFase]) => {
                                    const nomeFase = dados.columns[faseId]?.title || "Fase Antiga";
                                    const [aberto, setAberto] = useState(false); // Você pode gerenciar um array de IDs abertos

                                    return (
                                        <div key={faseId} className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                                            <button 
                                                onClick={() => setAberto(!aberto)}
                                                className="w-full p-3 flex justify-between items-center bg-slate-50 hover:bg-slate-100 transition-colors"
                                            >
                                                <span className="text-xs font-bold text-[#00557f]">{nomeFase}</span>
                                                <ChevronRight size={14} className={`transition-transform ${aberto ? 'rotate-90' : ''}`} />
                                            </button>
                                            
                                            {aberto && (
                                                <div className="p-3 space-y-3 bg-white animate-in slide-in-from-top-2">
                                                    {Object.entries(dadosFase).map(([campoId, valor]) => {
                                                        // Lógica para Anexo (Simulação de abertura local)
                                                        if (valor instanceof FileList || (typeof valor === 'string' && valor.includes('fakepath'))) {
                                                            return (
                                                                <div key={campoId} className="p-2 bg-[#5fb0a5]/5 border border-[#5fb0a5]/20 rounded-lg flex items-center justify-between">
                                                                    <span className="text-xs font-medium text-slate-600 truncate">{valor.name || "Documento Anexo"}</span>
                                                                    <button 
                                                                        onClick={() => window.open(URL.createObjectURL(valor[0]), '_blank')}
                                                                        className="text-[10px] font-bold text-[#5fb0a5] hover:underline"
                                                                    >
                                                                        ABRIR ARQUIVO
                                                                    </button>
                                                                </div>
                                                            );
                                                        }
                                                        return (
                                                            <div key={campoId} className="text-xs border-b border-slate-50 pb-2">
                                                                <p className="text-slate-400 text-[10px] mb-1">Campo: {campoId}</p>
                                                                <p className="text-slate-700 font-medium">{valor}</p>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 bg-white flex flex-col relative">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-500">Fase Atual:</span>
                            <span className="px-3 py-1 bg-[#00557f]/10 text-[#00557f] font-bold rounded-full text-sm flex items-center gap-1">
                                <Layout size={14}/> {colunaAtual.title}
                            </span>
                        </div>
                        <div className="flex gap-2">
                             <button onClick={excluirCard} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors" title="Excluir Card"><Trash2 size={18}/></button>
                             <button onClick={fechar} className="p-2 text-slate-400 hover:bg-slate-100 rounded transition-colors"><X size={24}/></button>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50/30">
                        <form id="form-fase" onSubmit={handleSubmit(salvarDadosFase)} className="space-y-6 max-w-2xl mx-auto">
                            {camposFase.length === 0 ? (
                                <div className="text-center py-10 opacity-50">
                                    <FileText size={48} className="mx-auto mb-2 text-slate-300"/>
                                    <p className="text-slate-500">Esta fase não possui campos adicionais configurados pelo admin.</p>
                                </div>
                            ) : (
                                camposFase.map(campo => (
                                    <div key={campo.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                        <label className="block text-sm font-bold text-slate-700 mb-1">
                                            {campo.label} {campo.obrigatorio && <span className="text-red-500">*</span>}
                                        </label>
                                        {campo.ajuda && <p className="text-xs text-slate-400 mb-4">{campo.ajuda}</p>}
                                        <CampoDinamico campo={campo} register={register} equipe={equipe} setValue={setValue} watch={watch} />
                                    </div>
                                ))
                            )}
                        </form>
                    </div>

                    <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
                         {camposFase.length > 0 && (
                            <button form="form-fase" type="submit" className="flex items-center gap-2 px-8 py-3 bg-[#00557f] text-white rounded-xl font-bold shadow hover:bg-[#003d5c] transition-all">
                                <Save size={18}/> Salvar Dados da Fase
                            </button>
                         )}
                    </div>
                </div>

                <div className="w-[280px] bg-slate-50 border-l border-slate-200 p-6 flex flex-col">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <ArrowRight size={14}/> Mover Card para
                    </h4>
                    <div className="space-y-2 overflow-y-auto flex-1">
                        {dados.columnOrder.map(colId => {
                            const col = dados.columns[colId];
                            if(col.id === colunaAtualId) return null;
                            return (
                                <button key={colId} onClick={() => moverCard(colId)} className="w-full text-left p-4 rounded-xl bg-white border border-slate-200 hover:border-[#5fb0a5] hover:shadow-md transition-all group flex items-center justify-between">
                                    <span className="text-sm font-bold text-slate-600 group-hover:text-[#00557f]">{col.title}</span>
                                    <ChevronRight size={16} className="text-slate-300 group-hover:text-[#5fb0a5]"/>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// COMPONENTE PRINCIPAL (FundoKanban)
// ==========================================
export default function FundoKanban({ dados, setDados, usuarioAtual, logado, modeloCard, equipe, setPaginaAtual, setColunaAlvoCriacao }) {
  const [configColunaId, setConfigColunaId] = useState(null);
  const [cardSelecionado, setCardSelecionado] = useState(null);
  const [toast, setToast] = useState({ mensagem: '', visivel: false });

  const mostrarNotificacao = (msg) => {
      setToast({ mensagem: msg, visivel: true });
      setTimeout(() => setToast({ mensagem: '', visivel: false }), 4000);
  };

  const onDragEnd = (result) => {
      const { destination, source, draggableId, type } = result;
      if (!destination) return;
      if (destination.droppableId === source.droppableId && destination.index === source.index) return;
      
      if (type === 'column') {
          const newColumnOrder = Array.from(dados.columnOrder);
          newColumnOrder.splice(source.index, 1);
          newColumnOrder.splice(destination.index, 0, draggableId);
          setDados({ ...dados, columnOrder: newColumnOrder });
          return;
      }

      const start = dados.columns[source.droppableId];
      const finish = dados.columns[destination.droppableId];

      if (start === finish) {
          const newCardIds = Array.from(start.cardIds);
          newCardIds.splice(source.index, 1);
          newCardIds.splice(destination.index, 0, draggableId);
          const newColumn = { ...start, cardIds: newCardIds };
          setDados({ ...dados, columns: { ...dados.columns, [newColumn.id]: newColumn } });
          return;
      }

      const startCardIds = Array.from(start.cardIds);
      startCardIds.splice(source.index, 1);
      const newStart = { ...start, cardIds: startCardIds };
      const finishCardIds = Array.from(finish.cardIds);
      finishCardIds.splice(destination.index, 0, draggableId);
      const newFinish = { ...finish, cardIds: finishCardIds };
      setDados({ ...dados, columns: { ...dados.columns, [newStart.id]: newStart, [newFinish.id]: newFinish } });
  };

  const salvarConfigFase = (colId, novosCampos) => {
      setDados({
          ...dados,
          columns: {
              ...dados.columns,
              [colId]: { ...dados.columns[colId], configuracaoEntrada: novosCampos }
          }
      });
      setConfigColunaId(null);
      mostrarNotificacao("Fase configurada com sucesso!");
  };

  const deletarColuna = (colId) => {
      const newOrder = dados.columnOrder.filter(id => id !== colId);
      const newCols = { ...dados.columns };
      delete newCols[colId];
      setDados({ ...dados, columnOrder: newOrder, columns: newCols });
      mostrarNotificacao("Fase excluída!");
  };

  const adicionarCardNaColuna = (colId) => {
      setColunaAlvoCriacao(colId);
      setPaginaAtual('criar-card');
  };

  if (!logado) return null;

  return (
    <>
        <NotificacaoToast mensagem={toast.mensagem} visivel={toast.visivel} />

        {configColunaId && (
            <ModalConfigFase 
                coluna={dados.columns[configColunaId]} 
                fechar={() => setConfigColunaId(null)}
                salvarConfig={salvarConfigFase}
                deletarFase={deletarColuna}
                mostrarNotificacao={mostrarNotificacao}
            />
        )}

        {cardSelecionado && (
            <ModalEditarCard 
                card={cardSelecionado}
                dados={dados}
                setDados={setDados}
                modeloCard={modeloCard}
                equipe={equipe}
                mostrarNotificacao={mostrarNotificacao}
                fechar={() => setCardSelecionado(null)}
            />
        )}

        <div className="h-full w-full flex flex-col bg-[#f4f6f8]">
            <div className="flex-none p-6 flex justify-between items-center bg-white border-b border-slate-200">
                <div>
                    <h2 className="text-xl font-bold text-[#00557f]">Fluxo de Processos</h2>
                    <p className="text-xs text-slate-400">Arraste para mover ou clique para detalhes</p>
                </div>
                <button 
                    onClick={() => {
                        const id = `col-${uuidv4()}`;
                        setDados({...dados, columns: {...dados.columns, [id]: {id, title: 'Nova Fase', cardIds: []}}, columnOrder: [...dados.columnOrder, id]});
                        mostrarNotificacao("Nova fase criada!");
                    }} 
                    className="flex items-center gap-2 text-sm font-bold text-white bg-[#00557f] px-4 py-2 rounded-lg hover:bg-[#003d5c] shadow-md transition-all active:scale-95"
                >
                    <Plus size={18} /> Nova Fase
                </button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="all-columns" direction="horizontal" type="column">
                {(provided) => (
                    <div className="flex-1 flex overflow-x-auto p-6 gap-6 items-start custom-scrollbar bg-slate-50/50" {...provided.droppableProps} ref={provided.innerRef}>
                    {dados.columnOrder.map((columnId, index) => {
                        const column = dados.columns[columnId];
                        const cards = column.cardIds.map(id => dados.cards[id]).filter(c => c);

                        return (
                        <Draggable key={column.id} draggableId={column.id} index={index}>
                            {(provided) => (
                            <div className="w-[320px] flex-none bg-slate-100 rounded-2xl flex flex-col max-h-full border border-slate-200 shadow-sm"
                                ref={provided.innerRef} {...provided.draggableProps}>
                                {/* Nessa parte eu mexo no titulo das fases */}
                                <div className="p-3 bg-white rounded-t-2xl border-b border-slate-200 flex justify-between items-center group h-14" {...provided.dragHandleProps}>
                                    <div className="flex items-center gap-2 w-full overflow-hidden">
                                        <input 
                                            className="font-bold text-slate-700 text-sm uppercase truncate flex-1 bg-transparent hover:bg-slate-50 border-none focus:ring-2 focus:ring-[#5fb0a5] rounded px-1 outline-none transition-all"
                                            value={column.title}
                                            onChange={(e) => {
                                                const novasColunas = {
                                                    ...dados.columns,
                                                    [column.id]: { ...column, title: e.target.value }
                                                };
                                                setDados({ ...dados, columns: novasColunas });
                                            }}
                                    />
                                        <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200">{cards.length}</span>
                                        <button onClick={() => setConfigColunaId(column.id)} className="p-1.5 text-slate-300 hover:text-[#00557f] hover:bg-slate-50 rounded transition-colors" title="Configurar Campos desta Fase"><Settings size={14} /></button>
                                        <button onClick={() => adicionarCardNaColuna(column.id)} className="p-1.5 bg-[#5fb0a5] text-white rounded hover:bg-[#4a9c91] transition-transform hover:scale-105 shadow-sm"><Plus size={14} strokeWidth={3} /></button>
                                    </div>
                                </div>

                                <Droppable droppableId={column.id} type="card">
                                {(provided, snapshot) => (
                                    <div className={`p-3 flex-1 overflow-y-auto custom-scrollbar space-y-3 min-h-[100px] transition-colors ${snapshot.isDraggingOver ? 'bg-slate-200/50' : ''}`}
                                    ref={provided.innerRef} {...provided.droppableProps}>
                                    {cards.map((card, index) => (
                                        <Draggable key={card.id} draggableId={card.id} index={index}>
                                        {(provided, snapshot) => (
                                            <div className={`bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-[#5fb0a5] group relative transition-all cursor-pointer select-none
                                                ${snapshot.isDragging ? 'rotate-2 shadow-2xl ring-2 ring-[#00557f] z-50' : ''}`}
                                            ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                                            onClick={() => setCardSelecionado(card)}>
                                                
                                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                                    <button onClick={(e) => { e.stopPropagation(); if(window.confirm('Excluir card?')) { 
                                                        const newCards = {...dados.cards}; delete newCards[card.id];
                                                        const newCols = {...dados.columns};
                                                        newCols[column.id].cardIds = newCols[column.id].cardIds.filter(id => id !== card.id);
                                                        setDados({...dados, cards: newCards, columns: newCols});
                                                        mostrarNotificacao("Card excluído!");
                                                    }}} className="text-slate-300 hover:text-red-500 bg-white shadow-sm rounded-full p-1"><X size={12}/></button>
                                                </div>

                                                <div className="absolute left-0 top-3 bottom-3 w-1.5 rounded-r-full bg-[#5fb0a5]"></div>
                                                <div className="pl-3">
                                                    <h4 className="text-sm font-bold text-slate-700 mb-2 leading-tight line-clamp-2">{card.titulo}</h4>
                                                    <div className="mt-3 pt-2 border-t border-slate-50 flex justify-between items-center">
                                                        <span className="text-[10px] text-slate-300 font-medium">ID: {card.id.slice(0,4)}</span>
                                                        {card.dados?.responsavel && (
                                                            <div className="w-6 h-6 rounded-full bg-[#00557f] text-white text-[10px] flex items-center justify-center font-bold">
                                                                {card.dados.responsavel[0]?.charAt(0) || 'U'}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                    </div>
                                )}
                                </Droppable>
                            </div>
                            )}
                        </Draggable>
                        );
                    })}
                    {provided.placeholder}
                    </div>
                )}
                </Droppable>
            </DragDropContext>
        </div>
    </>
  );
}