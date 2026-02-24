import React from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { ArrowLeft, Check, AlertTriangle } from 'lucide-react';

export default function NovoCard({ modeloCard, dadosKanban, setDadosKanban, setPaginaAtual, usuarioAtual, equipe, colunaAlvo }) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    const cardId = uuidv4();
    const campoTitulo = modeloCard.find(c => c.type === 'text_short' || c.type === 'id');
    const tituloCard = campoTitulo ? data[campoTitulo.id] : "Novo Card";

    const novoCard = {
      id: cardId,
      titulo: tituloCard || "Sem título",
      dados: data,
      criadoPor: usuarioAtual,
      criadoEm: new Date().toISOString(),
    };

    // Usa a colunaAlvo (vinda do botão +) ou a primeira coluna
    const idColunaDestino = colunaAlvo || dadosKanban.columnOrder[0];
    const colunaObj = dadosKanban.columns[idColunaDestino];

    if (!colunaObj) {
        alert("Erro: Coluna de destino não encontrada.");
        return;
    }

    setDadosKanban({
      ...dadosKanban,
      cards: { ...dadosKanban.cards, [cardId]: novoCard },
      columns: {
        ...dadosKanban.columns,
        [idColunaDestino]: {
          ...colunaObj,
          cardIds: [cardId, ...colunaObj.cardIds] // Topo da lista
        }
      }
    });

    setPaginaAtual('inicio');
  };

  const renderField = (field) => {
    const commonProps = {
      ...register(field.id, { required: field.required ? "Este campo é obrigatório" : false }),
      className: `w-full p-3 bg-white border ${errors[field.id] ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-[#00557f]/20 focus:border-[#00557f] outline-none transition-all`
    };

    switch (field.type) {
      case 'text_long': return <textarea {...commonProps} rows={4} />;
      case 'select':
        return (
          <select {...commonProps}>
            <option value="">Selecione...</option>
            {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        );
      case 'responsible':
         return (
            <select {...commonProps} multiple className={`${commonProps.className} h-32`}>
                {equipe.map(pessoa => <option key={pessoa} value={pessoa}>{pessoa}</option>)}
            </select>
         );
      case 'checkbox':
        return (
            <div className="space-y-2">
                {field.options?.map((opt, idx) => (
                    <label key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                        <input type="checkbox" value={opt} {...register(field.id)} className="w-4 h-4 text-[#00557f] rounded focus:ring-[#00557f]" />
                        {opt}
                    </label>
                ))}
            </div>
        );
      case 'currency':
        return (
            <div className="relative">
                <span className="absolute left-3 top-3 text-slate-400">R$</span>
                <input type="number" step="0.01" {...commonProps} className={`${commonProps.className} pl-10`} />
            </div>
        );
      default: return <input type={field.type === 'date' ? 'date' : 'text'} {...commonProps} />;
    }
  };

  return (
    /* ADICIONADO overflow-y-auto e h-full NO CONTAINER PRINCIPAL PARA HABILITAR SCROLL */
    <div className="h-full w-full overflow-y-auto bg-slate-50 p-8 flex justify-center custom-scrollbar">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col min-h-min mb-10">
        
        <div className="p-6 border-b border-slate-100 flex items-center gap-4 bg-white rounded-t-2xl sticky top-0 z-10">
            <button onClick={() => setPaginaAtual('inicio')} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-[#00557f]">
                <ArrowLeft size={20}/>
            </button>
            <div>
                <h2 className="text-xl font-bold text-[#00557f]">Novo Card</h2>
                {colunaAlvo && <p className="text-xs text-slate-400">Adicionando em: {dadosKanban.columns[colunaAlvo]?.title}</p>}
            </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6 flex-1">
          {modeloCard.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  <AlertTriangle className="mx-auto text-yellow-500 mb-2" size={30} />
                  <p className="text-slate-500 font-medium">O administrador ainda não configurou o modelo de card.</p>
              </div>
          ) : (
            modeloCard.map((field) => (
                <div key={field.id} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {field.helpText && <p className="text-xs text-slate-400 mb-2 -mt-1">{field.helpText}</p>}
                    {renderField(field)}
                    {errors[field.id] && <span className="text-xs text-red-500 mt-1 block font-medium">{errors[field.id].message}</span>}
                </div>
            ))
          )}

          {modeloCard.length > 0 && (
            <button type="submit" className="w-full bg-[#00557f] text-white py-4 rounded-xl font-bold shadow-lg hover:bg-[#003d5c] transition-all transform active:scale-95 flex items-center justify-center gap-2 mt-8">
                <Check size={20} /> CRIAR CARD
            </button>
          )}
        </form>
      </div>
    </div>
  );
}