import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { v4 as uuidv4 } from 'uuid';
import { 
  Type, FileText, CheckSquare, User, Tag, Phone, Clock, 
  ArrowRight, Trash2, Settings, GripVertical, Save, X, 
  UploadCloud, AlertTriangle, GitMerge, Layout, DollarSign, Hash, CreditCard, Paperclip, Calendar, Mail
} from 'lucide-react';

const FIELD_TYPES = [
  { tipo: 'text', label: 'Texto Curto', icon: Type },
  { tipo: 'text_long', label: 'Texto Longo', icon: FileText },
  { tipo: 'anexo', label: 'Anexo', icon: UploadCloud },
  { tipo: 'checkbox', label: 'Checkbox', icon: CheckSquare },
  { tipo: 'responsavel', label: 'Responsável', icon: User },
  { tipo: 'data', label: 'Data', icon: Clock },
  { tipo: 'etiquetas', label: 'Etiquetas', icon: Tag },
  { tipo: 'email', label: 'E-mail', icon: Layout }, 
  { tipo: 'telefone', label: 'Telefone', icon: Phone },
  { tipo: 'tempo', label: 'Tempo', icon: Clock },
  { tipo: 'cpf_cnpj', label: 'CPF / CNPJ', icon: FileText },
  { tipo: 'moeda', label: 'Moeda', icon: DollarSign },
  { tipo: 'numerico', label: 'Apenas Números', icon: Hash },
];

export default function ConfiguracaoCard({ modeloCard, setModeloCard, setPaginaAtual }) {
  const [campos, setCampos] = useState(modeloCard);
  const [campoEmEdicao, setCampoEmEdicao] = useState(null);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === 'sidebar-fields' && destination.droppableId === 'builder-area') {
      const fieldType = FIELD_TYPES[source.index];
      const newField = {
        id: uuidv4(),
        tipo: fieldType.tipo,
        label: fieldType.label,
        helpText: '',
        obrigatorio: false,
        editableInPhases: true,
        opcoes: ['Opção 1'], 
        aceitaMultiplo: true,
        subTipo: fieldType.tipo === 'data' ? 'data' : undefined
      };
      
      const novosCampos = Array.from(campos);
      novosCampos.splice(destination.index, 0, newField);
      setCampos(novosCampos);
      setCampoEmEdicao(newField);
      return;
    }

    if (source.droppableId === 'builder-area' && destination.droppableId === 'builder-area') {
      const novosCampos = Array.from(campos);
      const [moved] = novosCampos.splice(source.index, 1);
      novosCampos.splice(destination.index, 0, moved);
      setCampos(novosCampos);
    }
  };

  const salvarModelo = () => {
    setModeloCard(campos);
    alert("Modelo salvo com sucesso!");
    setPaginaAtual('inicio');
  };

  const removerCampo = (id) => {
    setCampos(campos.filter(c => c.id !== id));
    if (campoEmEdicao?.id === id) setCampoEmEdicao(null);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="flex-none h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-sm z-10">
        <div>
          <h2 className="text-xl font-bold text-[#00557f]">Editor de Modelo de Card</h2>
          <p className="text-xs text-slate-400">Arraste os campos da esquerda para a direita</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setPaginaAtual('inicio')} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg text-sm font-bold">Cancelar</button>
          <button onClick={salvarModelo} className="px-6 py-2 bg-[#00557f] text-white rounded-lg text-sm font-bold shadow-md hover:bg-[#003d5c] flex items-center gap-2">
            <Save size={18} /> Salvar Modelo
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 flex overflow-hidden">
          <div className="w-72 bg-white border-r border-slate-200 flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Biblioteca de Campos</h3>
            </div>
            <Droppable droppableId="sidebar-fields" isDropDisabled={true}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                  {FIELD_TYPES.map((fieldType, index) => (
                    <Draggable key={fieldType.tipo} draggableId={fieldType.tipo} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                            snapshot.isDragging ? 'bg-[#00557f] text-white shadow-xl' : 'bg-white text-slate-600 hover:border-[#00557f]'
                          }`}
                        >
                          <fieldType.icon size={18} />
                          <span className="text-sm font-medium">{fieldType.label}</span>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          <div className="flex-1 bg-[#f4f6f8] overflow-y-auto p-8 flex justify-center custom-scrollbar">
            <div className="w-full max-w-2xl">
              <Droppable droppableId="builder-area">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[500px] bg-white rounded-xl shadow-sm border-2 border-dashed transition-all p-6 space-y-4
                      ${snapshot.isDraggingOver ? 'border-[#5fb0a5] bg-[#f0fffd]' : 'border-slate-300'}
                      ${campos.length === 0 ? 'flex items-center justify-center' : ''}
                    `}
                  >
                    {campos.length === 0 && !snapshot.isDraggingOver && (
                      <div className="text-center text-slate-400">
                        <ArrowRight size={48} className="mx-auto mb-4 opacity-20" />
                        <p>Arraste campos aqui para começar</p>
                      </div>
                    )}

                    {campos.map((campo, index) => (
                      <Draggable key={campo.id} draggableId={campo.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`relative bg-white border rounded-lg group hover:shadow-md transition-all
                              ${campoEmEdicao?.id === campo.id ? 'border-[#00557f] ring-1 ring-[#00557f]' : 'border-slate-200'}
                              ${snapshot.isDragging ? 'shadow-2xl z-50' : ''}
                            `}
                          >
                            <div className="flex items-center justify-between p-3 bg-slate-50 border-b border-slate-100 rounded-t-lg">
                              <div className="flex items-center gap-2" {...provided.dragHandleProps}>
                                <GripVertical size={16} className="text-slate-400 cursor-grab" />
                                <span className="text-sm font-bold text-slate-700">{campo.label}</span>
                                {campo.obrigatorio && <span className="text-red-500 text-xs">*</span>}
                              </div>
                              <div className="flex items-center gap-1">
                                <button onClick={() => setCampoEmEdicao(campoEmEdicao?.id === campo.id ? null : campo)} className="p-1.5 hover:bg-white rounded text-slate-500 hover:text-[#00557f]">
                                  <Settings size={16} />
                                </button>
                                <button onClick={() => removerCampo(campo.id)} className="p-1.5 hover:bg-white rounded text-slate-500 hover:text-red-500">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>

                            <div className="p-4" onClick={() => setCampoEmEdicao(campo)}>
                                <div className="h-10 bg-slate-50 border border-slate-200 rounded w-full flex items-center px-3 text-xs text-slate-400 select-none uppercase tracking-widest">
                                    TÍTULO: {campo.tipo}
                                </div>
                            </div>

                            {campoEmEdicao?.id === campo.id && (
                              <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-lg animate-in slide-in-from-top-2">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Título do Campo</label>
                                    <input 
                                      className="w-full p-2 text-sm border rounded focus:border-[#00557f] outline-none"
                                      value={campoEmEdicao.label}
                                      onChange={(e) => {
                                        const atualizado = { ...campoEmEdicao, label: e.target.value };
                                        setCampoEmEdicao(atualizado);
                                        setCampos(campos.map(c => c.id === campo.id ? atualizado : c));
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Texto de Ajuda</label>
                                    <input 
                                        className="w-full p-2 text-sm border rounded focus:border-[#00557f] outline-none"
                                        value={campoEmEdicao.helpText || ''}
                                        onChange={(e) => {
                                            const atualizado = { ...campoEmEdicao, helpText: e.target.value };
                                            setCampoEmEdicao(atualizado);
                                            setCampos(campos.map(c => c.id === campo.id ? atualizado : c));
                                        }}
                                    />
                                  </div>
                                </div>

                                {campo.tipo === 'data' && (
                                    <div className="mb-4 p-3 bg-white rounded border border-slate-200">
                                        <label className="block text-xs font-bold text-[#00557f] mb-1">Tipo de Calendário</label>
                                        <select 
                                            className="w-full p-2 text-sm border rounded focus:border-[#00557f] outline-none"
                                            value={campoEmEdicao.subTipo || 'data'}
                                            onChange={(e) => {
                                                const atualizado = { ...campoEmEdicao, subTipo: e.target.value };
                                                setCampoEmEdicao(atualizado);
                                                setCampos(campos.map(c => c.id === campo.id ? atualizado : c));
                                            }}
                                        >
                                            <option value="data">Apenas Data</option>
                                            <option value="data_hora">Data e Hora</option>
                                            <option value="data_vencimento">Data de Vencimento (Destaque Vermelho)</option>
                                        </select>
                                    </div>
                                )}

                                {campo.tipo === 'checkbox' && (
                                    <div className="mb-4 space-y-4">
                                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                                            <label className="flex items-center gap-2 text-sm font-bold text-[#00557f] cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    checked={campoEmEdicao.aceitaMultiplo ?? true}
                                                    onChange={(e) => {
                                                        const atualizado = { ...campoEmEdicao, aceitaMultiplo: e.target.checked };
                                                        setCampoEmEdicao(atualizado);
                                                        setCampos(campos.map(c => c.id === campo.id ? atualizado : c));
                                                    }}
                                                />
                                                Aceitar mais de uma resposta
                                            </label>
                                        </div>

                                        <div className="bg-white p-3 rounded-lg border border-slate-200">
                                            <label className="block text-xs font-bold text-[#00557f] mb-3 uppercase">Gerenciar Alternativas</label>
                                            <div className="space-y-2">
                                                {(campoEmEdicao.opcoes || []).map((opcao, idx) => (
                                                    <div key={idx} className="flex items-center gap-2">
                                                        <input 
                                                            className="flex-1 p-2 text-sm border rounded focus:border-[#00557f] outline-none"
                                                            value={opcao}
                                                            onChange={(e) => {
                                                                const novasOpcoes = [...campoEmEdicao.opcoes];
                                                                novasOpcoes[idx] = e.target.value;
                                                                const atualizado = { ...campoEmEdicao, opcoes: novasOpcoes };
                                                                setCampoEmEdicao(atualizado);
                                                                setCampos(campos.map(c => c.id === campo.id ? atualizado : c));
                                                            }}
                                                        />
                                                        <button type="button" onClick={() => {
                                                            if(idx === 0) return;
                                                            const novas = [...campoEmEdicao.opcoes];
                                                            [novas[idx-1], novas[idx]] = [novas[idx], novas[idx-1]];
                                                            const atualizado = { ...campoEmEdicao, opcoes: novas };
                                                            setCampoEmEdicao(atualizado);
                                                            setCampos(campos.map(c => c.id === campo.id ? atualizado : c));
                                                        }} className="p-1 bg-slate-100 rounded text-slate-500 hover:bg-slate-200">↑</button>
                                                        <button type="button" onClick={() => {
                                                            const novas = [...campoEmEdicao.opcoes];
                                                            const atualizado = { ...campoEmEdicao, opcoes: novas.filter((_, i) => i !== idx) };
                                                            setCampoEmEdicao(atualizado);
                                                            setCampos(campos.map(c => c.id === campo.id ? atualizado : c));
                                                        }} className="p-1 bg-red-50 rounded text-red-500 hover:bg-red-100"><X size={14}/></button>
                                                    </div>
                                                ))}
                                                <button type="button" onClick={() => {
                                                    const atualizado = { ...campoEmEdicao, opcoes: [...(campoEmEdicao.opcoes || []), `Nova Opção ${(campoEmEdicao.opcoes?.length || 0) + 1}`] };
                                                    setCampoEmEdicao(atualizado);
                                                    setCampos(campos.map(c => c.id === campo.id ? atualizado : c));
                                                }} className="text-xs font-bold text-[#5fb0a5] hover:underline mt-2">+ Adicionar Opção</button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-6 border-t border-slate-200 pt-3">
                                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                                    <input type="checkbox" checked={campoEmEdicao.obrigatorio} 
                                      onChange={(e) => {
                                        const atualizado = { ...campoEmEdicao, obrigatorio: e.target.checked };
                                        setCampoEmEdicao(atualizado);
                                        setCampos(campos.map(c => c.id === campo.id ? atualizado : c));
                                      }}
                                    />
                                    Obrigatório
                                  </label>
                                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                                    <input type="checkbox" checked={campoEmEdicao.editableInPhases} 
                                      onChange={(e) => {
                                        const atualizado = { ...campoEmEdicao, editableInPhases: e.target.checked };
                                        setCampoEmEdicao(atualizado);
                                        setCampos(campos.map(c => c.id === campo.id ? atualizado : c));
                                      }}
                                    />
                                    Editável em outras fases
                                  </label>
                                </div>
                                <button onClick={() => setCampoEmEdicao(null)} className="w-full mt-4 bg-[#00557f] text-white py-2 rounded-lg text-sm font-bold shadow-sm">Concluir Edição</button>
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
    </div>
  );
}