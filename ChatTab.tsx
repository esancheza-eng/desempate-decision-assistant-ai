import React, { useState } from 'react';
import { DecisionAnalysisResponse, ChatMessage } from '../types';
import { Send, Bot, User, Sparkles, HelpCircle } from 'lucide-react';

interface ChatTabProps {
  decisionTitle: string;
  analysis: DecisionAnalysisResponse;
}

export const ChatTab: React.FC<ChatTabProps> = ({ decisionTitle, analysis }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `¡Hola! Soy tu asistente **Desempate**. He revisado todos los datos de la decisión **"${decisionTitle}"**. 

¿Tienes alguna duda sobre el veredicto, quieres explorar un escenario alternativo (*"¿Qué pasa si...?"*) o necesitas un plan paso a paso para comunicarlo? ¡Pregúntame lo que quieras!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const SUGGESTED_QUESTIONS = [
    '¿Qué pasa si las cosas no salen como esperaba en 6 meses?',
    '¿Cómo puedo comunicarle esta decisión a las partes involucradas?',
    'Dame un plan de acción de 3 pasos para empezar mañana.',
    '¿Cuáles son los 2 mayores riesgos ciegos de la opción ganadora?',
  ];

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || input.trim();
    if (!textToSend || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!questionText) setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decisionTitle,
          analysis,
          userQuestion: textToSend,
          previousMessages: messages.slice(-6),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error en la respuesta del servidor.');

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.text || 'No pude generar una respuesta en este momento.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `Lo siento, ocurrió un error al responder: ${err.message}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[600px] flex-col rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center space-x-3 border-b border-slate-200 px-6 py-4 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/20">
          <Bot className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Consultoría Interactiva de Decisión
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Resuelve dudas específicas y explora escenarios hipotéticos con Desempate IA
          </p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${
              msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white ${
                msg.sender === 'user' ? 'bg-slate-800 dark:bg-slate-700' : 'bg-amber-500'
              }`}
            >
              {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>

            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-amber-500 text-white rounded-tr-none'
                  : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
              <span
                className={`mt-1 block text-[10px] text-right ${
                  msg.sender === 'user' ? 'text-amber-100' : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-white">
              <Bot className="h-4 w-4" />
            </div>
            <div className="rounded-2xl rounded-tl-none bg-slate-100 px-4 py-3 dark:bg-slate-800">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 animate-bounce rounded-full bg-amber-500" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-amber-500 [animation-delay:0.2s]" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-amber-500 [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Quick Questions */}
      <div className="border-t border-slate-100 px-6 py-2 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
        <p className="mb-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          Sugerencias rápidas de consulta:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={loading}
              className="rounded-lg bg-white border border-slate-200 px-2.5 py-1 text-[11px] text-slate-700 hover:border-amber-400 hover:bg-amber-50 transition-colors dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="border-t border-slate-200 p-4 dark:border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu consulta sobre esta decisión..."
            disabled={loading}
            className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50 transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
