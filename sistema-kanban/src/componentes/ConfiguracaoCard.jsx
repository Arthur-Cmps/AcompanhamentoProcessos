import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { v4 as uuidv4 } from 'uuid';
import { 
  Type, FileText, CheckSquare, Calendar, User, Tag, Mail, Phone, Clock, 
  DollarSign, Hash, CreditCard, Paperclip, ArrowRight, Trash2, Settings, GripVertical, Save, X
} from 'lucide-react';

// Definição dos Tipos de Campos
const FIELD_TYPES = [
  { type: 'text_short', label: 'Texto Curto', icon: Type },
  { type: 'text_long', label: 'Texto Longo', icon: FileText },
  { type: 'dynamic', label: 'Conteúdo Dinâmico', icon: FileText }, // Rich text
  { type: 'attachment', label: 'Anexo', icon: Paperclip },
  { type: 'checkbox', label: 'Checkbox', icon: CheckSquare },
  { type: 'select', label: 'Seleção de Lista', icon: ArrowRight },
  { type: 'responsible', label: 'Responsável', icon: User },
  { type: 'date', label: 'Data', icon: Calendar },
  { type: 'tags', label: 'Etiquetas', icon: Tag },
  { type: 'email', label: 'Email', icon: Mail },
  { type: 'phone', label: 'Telefone', icon: Phone },
  { type: 'time', label: 'Tempo', icon: Clock },
  { type: 'number', label: 'Numérico', icon: Hash },
  { type: 'currency', label: 'Moeda', icon: DollarSign },
  { type: 'document', label: 'CPF/CNPJ', icon: CreditCard },
  { type: 'id', label: 'ID Automático', icon: Hash },
];

export default function ConfiguracaoCard({ modeloCard, setModeloCard, setPaginaAtual }) {
  const [campos, setCampos] = useState(modeloCard);
  const [campoEmEdicao, setCampoEmEdicao] = useState(null);

  // Drag and Drop Logic
  const onDragEnd = (result) => {
    const { source, destination } = result;

    // Se soltou fora
    if (!destination) return;

    // Se a fonte é a sidebar (criando novo campo)
    if (source.droppableId === 'sidebar-fields' && destination.droppableId === 'builder-area') {
      const fieldType = FIELD_TYPES[source.index];
      const newField = {
        id: uuidv4(),
        type: fieldType.type,
        label: fieldType.label, // Nome padrão
        helpText: '',
        required: false,
        editableInPhases: true,
        options: ['Opção 1', 'Opção 2'], // Padrão para selects
        width: 'full', // full or half
      };
      
      const novosCampos = Array.from(campos);
      novosCampos.splice(destination.index, 0, newField);
      setCampos(novosCampos);
      setCampoEmEdicao(newField); // Abre config imediatamente
      return;
    }

    // Se está reordenando dentro do formulário
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
      
      {/* Header do Editor */}
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
          
          {/* SIDEBAR DE CAMPOS (Source) */}
          <div className="w-72 bg-white border-r border-slate-200 flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Biblioteca de Campos</h3>
            </div>
            <Droppable droppableId="sidebar-fields" isDropDisabled={true}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                  {FIELD_TYPES.map((field, index) => (
                    <Draggable key={field.type} draggableId={field.type} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-[#00557f] cursor-grab active:cursor-grabbing transition-all
                            ${snapshot.isDragging ? 'ring-2 ring-[#00557f] shadow-xl rotate-2' : ''}
                          `}
                        >
                          <div className="bg-slate-100 p-2 rounded text-[#00557f]">
                            <field.icon size={16} />
                          </div>
                          <span className="text-sm font-medium text-slate-700">{field.label}</span>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {/* ÁREA DE CONSTRUÇÃO (Destination) */}
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
                            {/* Header do Card no Editor */}
                            <div className="flex items-center justify-between p-3 bg-slate-50 border-b border-slate-100 rounded-t-lg">
                              <div className="flex items-center gap-2" {...provided.dragHandleProps}>
                                <GripVertical size={16} className="text-slate-400 cursor-grab" />
                                <span className="text-sm font-bold text-slate-700">{campo.label}</span>
                                {campo.required && <span className="text-red-500 text-xs">*</span>}
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

                            {/* Corpo de Pré-visualização Simples */}
                            <div className="p-4" onClick={() => setCampoEmEdicao(campo)}>
                                <div className="h-10 bg-slate-50 border border-slate-200 rounded w-full flex items-center px-3 text-xs text-slate-400 select-none">
                                    Simulação de input ({campo.type})
                                </div>
                            </div>

                            {/* PAINEL DE CONFIGURAÇÃO (Só aparece se editando) */}
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
                                        value={campoEmEdicao.helpText}
                                        onChange={(e) => {
                                            const atualizado = { ...campoEmEdicao, helpText: e.target.value };
                                            setCampoEmEdicao(atualizado);
                                            setCampos(campos.map(c => c.id === campo.id ? atualizado : c));
                                        }}
                                    />
                                  </div>
                                </div>

                                {/* Opções para Checkbox/Select */}
                                {(campo.type === 'checkbox' || campo.type === 'select') && (
                                    <div className="mb-4">
                                        <label className="block text-xs font-bold text-slate-500 mb-1">Opções (Separadas por vírgula)</label>
                                        <textarea 
                                            className="w-full p-2 text-sm border rounded focus:border-[#00557f] outline-none"
                                            value={campoEmEdicao.options.join(', ')}
                                            onChange={(e) => {
                                                const atualizado = { ...campoEmEdicao, options: e.target.value.split(',').map(s => s.trim()) };
                                                setCampoEmEdicao(atualizado);
                                                setCampos(campos.map(c => c.id === campo.id ? atualizado : c));
                                            }}
                                        />
                                    </div>
                                )}

                                <div className="flex gap-6 border-t border-slate-200 pt-3">
                                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer select-none">
                                    <input type="checkbox" checked={campoEmEdicao.required} 
                                      onChange={(e) => {
                                        const atualizado = { ...campoEmEdicao, required: e.target.checked };
                                        setCampoEmEdicao(atualizado);
                                        setCampos(campos.map(c => c.id === campo.id ? atualizado : c));
                                      }}
                                    />
                                    Obrigatório
                                  </label>
                                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer select-none">
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
                                
                                <button onClick={() => setCampoEmEdicao(null)} className="w-full mt-4 bg-[#00557f] text-white py-1 rounded text-sm font-bold">Concluir Edição</button>
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