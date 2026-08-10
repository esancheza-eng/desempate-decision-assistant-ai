import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initializer for Gemini client with required headers
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY variable is missing or empty.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Desempate AI' });
});

// API Endpoint to Analyze Decision
app.post('/api/analyze-decision', async (req, res) => {
  try {
    const { title, context, options, userPriorities, urgency, analysisMode } = req.body;

    if (!title || !options || !Array.isArray(options) || options.length === 0) {
      return res.status(400).json({ error: 'Debes proporcionar un título y al menos una opción.' });
    }

    const ai = getGeminiClient();

    const normalizedOptions = options.map((opt: string) => opt.trim()).filter(Boolean);
    if (normalizedOptions.length === 1) {
      // If user provides 1 option, add a default implicit alternative
      normalizedOptions.push('Mantener el estado actual (No realizar el cambio)');
    }

    const systemInstruction = `
Eres "Desempate", un consultor estratégico experto en teoría de decisiones, análisis cuantitativo, psicología conductual y evaluación de riesgos.
Tu misión es ayudar al usuario a tomar la mejor decisión estructurando su dilema en tres niveles de análisis:
1. Ventajas y Desventajas (Pros y Contras clasificados por categoría e impacto de -5 a +5).
2. Tabla de Comparación Criterio por Criterio con ponderaciones e importancia (1-10) y puntuación de cada opción (1-10).
3. Análisis FODA / SWOT completo (Fortalezas, Oportunidades, Debilidades, Amenazas) con estrategias cruzadas para las opciones principales.
4. El Veredicto Final / Recomendación del Desempate con nivel de confianza, razones claras, mitigación de riesgos y pasos siguientes.

INSTRUCCIONES DE IDIOMA Y TONO:
- Responde strictly en ESPAÑOL.
- Mantén un tono analítico, empático, imparcial, accionable y profesional.
- Para las categorías de Pros/Contras, usa etiquetas claras como: "Financiero", "Paz Mental", "Tiempo y Flexibilidad", "Crecimiento Profesional", "Riesgo e Incertidumbre", "Relaciones y Familia", "Salud".
- Asigna identificadores de opción limpios y consistentes, por ejemplo "opt_0", "opt_1", "opt_2".
`;

    const promptText = `
DILEMA A ANALIZAR:
- Título/Decisión: "${title}"
- Contexto adicional: "${context || 'Sin contexto adicional proporcionado'}"
- Opciones a comparar: ${JSON.stringify(normalizedOptions)}
- Prioridades del usuario: ${userPriorities && userPriorities.length > 0 ? userPriorities.join(', ') : 'Equilibrio general (Financiero, Tiempo, Paz Mental, Crecimiento)'}
- Urgencia: ${urgency || 'Media'}
- Modo de análisis solicitado: ${analysisMode || 'completo'}

Genera un objeto JSON completo siguiendo exactamente la estructura requerida.
Asegúrate de evaluar cada una de las opciones con identificadores "opt_0", "opt_1", etc.
`;

    // Response Schema Definition conforming strictly to Gemini OpenAPI Schema
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        dilemmaContext: { type: Type.STRING },
        recommendedOptionId: { type: Type.STRING, description: "ID de la opción recomendada (ej: opt_0)" },
        recommendationReason: { type: Type.STRING, description: "Razón detallada y persuasiva del veredicto" },
        confidenceScore: { type: Type.INTEGER, description: "Porcentaje de confianza de 0 a 100" },
        options: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              optionId: { type: Type.STRING, description: "ID de la opción, ej: opt_0, opt_1" },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              overallScore: { type: Type.INTEGER, description: "Puntuación general estimada de 0 a 100" },
              summary: { type: Type.STRING },
              pros: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    text: { type: Type.STRING },
                    category: { type: Type.STRING },
                    impact: { type: Type.INTEGER, description: "Impacto positivo de 1 a 5" },
                    explanation: { type: Type.STRING }
                  },
                  required: ["id", "text", "category", "impact"]
                }
              },
              cons: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    text: { type: Type.STRING },
                    category: { type: Type.STRING },
                    impact: { type: Type.INTEGER, description: "Impacto negativo de 1 a 5" },
                    explanation: { type: Type.STRING }
                  },
                  required: ["id", "text", "category", "impact"]
                }
              }
            },
            required: ["optionId", "title", "overallScore", "summary", "pros", "cons"]
          }
        },
        comparisonCriteria: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              weight: { type: Type.INTEGER, description: "Ponderación/Importancia de 1 a 10" },
              optionScores: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    optionId: { type: Type.STRING },
                    score: { type: Type.INTEGER, description: "Puntuación de 1 a 10" },
                    note: { type: Type.STRING, description: "Justificación breve" }
                  },
                  required: ["optionId", "score"]
                }
              },
              bestOptionId: { type: Type.STRING }
            },
            required: ["id", "name", "weight", "optionScores"]
          }
        },
        swotItems: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              optionId: { type: Type.STRING },
              fortalezas: { type: Type.ARRAY, items: { type: Type.STRING } },
              oportunidades: { type: Type.ARRAY, items: { type: Type.STRING } },
              debilidades: { type: Type.ARRAY, items: { type: Type.STRING } },
              amenazas: { type: Type.ARRAY, items: { type: Type.STRING } },
              estrategias: {
                type: Type.OBJECT,
                properties: {
                  FO: { type: Type.STRING },
                  DO: { type: Type.STRING },
                  FA: { type: Type.STRING },
                  DA: { type: Type.STRING }
                },
                required: ["FO", "DO", "FA", "DA"]
              }
            },
            required: ["optionId", "fortalezas", "oportunidades", "debilidades", "amenazas"]
          }
        },
        nextSteps: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        riskMitigationPlan: { type: Type.STRING },
        keyInsights: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      },
      required: [
        "title",
        "dilemmaContext",
        "recommendedOptionId",
        "recommendationReason",
        "confidenceScore",
        "options",
        "comparisonCriteria",
        "swotItems",
        "nextSteps",
        "riskMitigationPlan",
        "keyInsights"
      ]
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: promptText,
      config: {
        systemInstruction,
        temperature: 0.2,
        responseMimeType: 'application/json',
        responseSchema,
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Respuesta vacía recibida del modelo Gemini.');
    }

    const jsonResult = JSON.parse(responseText);

    // Transform comparisonCriteria to client expected format
    const formattedComparisonCriteria = (jsonResult.comparisonCriteria || []).map((c: any, index: number) => {
      const scores: Record<string, number> = {};
      const notes: Record<string, string> = {};

      if (Array.isArray(c.optionScores)) {
        c.optionScores.forEach((os: any) => {
          if (os.optionId) {
            scores[os.optionId] = typeof os.score === 'number' ? os.score : 5;
            if (os.note) {
              notes[os.optionId] = os.note;
            }
          }
        });
      }

      return {
        id: c.id || `crit_${index + 1}`,
        name: c.name || 'Criterio',
        weight: typeof c.weight === 'number' ? c.weight : 5,
        scores,
        notes,
        bestOptionId: c.bestOptionId || (Object.keys(scores)[0] || 'opt_0'),
      };
    });

    // Transform swotItems array to swot Record<string, SwotAnalysis>
    const formattedSwot: Record<string, any> = {};

    if (Array.isArray(jsonResult.swotItems)) {
      jsonResult.swotItems.forEach((item: any) => {
        if (item.optionId) {
          formattedSwot[item.optionId] = {
            fortalezas: Array.isArray(item.fortalezas) ? item.fortalezas : [],
            oportunidades: Array.isArray(item.oportunidades) ? item.oportunidades : [],
            debilidades: Array.isArray(item.debilidades) ? item.debilidades : [],
            amenazas: Array.isArray(item.amenazas) ? item.amenazas : [],
            estrategias: item.estrategias || undefined,
          };
        }
      });
    }

    // Ensure pros impacts are positive and cons impacts are negative
    const formattedOptions = (jsonResult.options || []).map((opt: any, optIndex: number) => {
      const optId = opt.optionId || `opt_${optIndex}`;

      return {
        ...opt,
        optionId: optId,
        pros: (opt.pros || []).map((p: any, pIdx: number) => ({
          ...p,
          id: p.id || `pro_${optId}_${pIdx}`,
          impact: Math.abs(typeof p.impact === 'number' ? p.impact : 3),
        })),
        cons: (opt.cons || []).map((c: any, cIdx: number) => ({
          ...c,
          id: c.id || `con_${optId}_${cIdx}`,
          impact: -Math.abs(typeof c.impact === 'number' ? c.impact : 3),
        })),
      };
    });

    const finalResult = {
      title: jsonResult.title || title,
      dilemmaContext: jsonResult.dilemmaContext || context || '',
      recommendedOptionId: jsonResult.recommendedOptionId || (formattedOptions[0]?.optionId || 'opt_0'),
      recommendationReason: jsonResult.recommendationReason || '',
      confidenceScore: typeof jsonResult.confidenceScore === 'number' ? jsonResult.confidenceScore : 85,
      options: formattedOptions,
      comparisonCriteria: formattedComparisonCriteria,
      swot: formattedSwot,
      nextSteps: Array.isArray(jsonResult.nextSteps) ? jsonResult.nextSteps : [],
      riskMitigationPlan: jsonResult.riskMitigationPlan || '',
      keyInsights: Array.isArray(jsonResult.keyInsights) ? jsonResult.keyInsights : [],
    };

    res.json(finalResult);
  } catch (error: any) {
    console.error('Error en /api/analyze-decision:', error);
    res.status(500).json({
      error: error.message || 'Error al procesar la decisión con la IA. Verifica tu API Key en la configuración.',
    });
  }
});

// API Endpoint for Follow-up Chat & Scenario Exploration
app.post('/api/chat-decision', async (req, res) => {
  try {
    const { decisionTitle, analysis, userQuestion, previousMessages } = req.body;

    if (!decisionTitle || !userQuestion) {
      return res.status(400).json({ error: 'Falta la pregunta del usuario o la decisión.' });
    }

    const ai = getGeminiClient();

    const systemInstruction = `
Eres "Desempate", el consultor inteligente para decisiones.
El usuario ya recibió un análisis previo de su decisión titulada "${decisionTitle}".
Tu objetivo es responder sus preguntas de seguimiento, explorar escenarios hipotéticos ("¿Qué pasaría si...?") o darle consejos prácticos para implementar su veredicto.
Responde de forma clara, directa, empática y en formato Markdown estructurado (con negritas, listas o viñetas según sea conveniente).
Siempre en ESPAÑOL.
`;

    const contextPrompt = `
RESUMEN DEL ANÁLISIS PREVIO:
- Título: ${decisionTitle}
- Opción Recomendada: ${analysis?.recommendedOptionId || 'N/A'}
- Razonamiento: ${analysis?.recommendationReason || 'N/A'}
- Opciones Evaluadas: ${analysis?.options?.map((o: any) => o.title).join(', ') || 'Varias'}

HISTORIAL PREVIO DE MENSAJES:
${previousMessages && Array.isArray(previousMessages) ? previousMessages.map((m: any) => `${m.sender.toUpperCase()}: ${m.text}`).join('\n') : 'Ninguno'}

PREGUNTA ACTUAL DEL USUARIO:
${userQuestion}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: contextPrompt,
      config: {
        systemInstruction,
        temperature: 0.5,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Error en /api/chat-decision:', error);
    res.status(500).json({
      error: error.message || 'Error al procesar la consulta con la IA.',
    });
  }
});

// Setup Vite Development or Production Server Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor Desempate ejecutándose en http://localhost:${PORT}`);
  });
}

startServer();
