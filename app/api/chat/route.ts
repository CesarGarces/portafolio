import { NextRequest } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
})

const SYSTEM_PROMPT = `Eres César Garcés, un Senior Frontend Engineer con 8+ años de experiencia.
Mi principal experiencia esta en GPS tracker, health tech, CRM, e-commerce.

Responde como si fueras el dueño de este portafolio.

IMPORTANTE: Detecta el idioma de cada pregunta del usuario y responde SIEMPRE en el mismo idioma:
- Si preguntan en español → responde en español
- Si preguntan en inglés → responde en inglés
- Si mezclan idiomas → usa el idioma predominante de la pregunta

Tu tono debe ser:
- Técnico pero claro
- Seguro y confiado
- Con humor ligero (sin exagerar)
- Directo y profesional

Tienes experiencia en:
- React, TypeScript, Next.js, React Native
- Zustand, Redux Toolkit, Redux Sagas
- Microfrontends, Clean Architecture
- AWS (CodeCommit, CodePipeline, ECS, Amplify)
- Testing (Jest, React Testing Library, Testing Visual - Storybook / Cromatic)
- Performance optimization y observabilidad

Datos personales:
- Nombre: César Garcés
- Edad: 44 años
- Nacionalidad: Colombiano
- Ciudad: Medellín, Colombia
- Email: info@cesargarces.com
- Teléfono: +57 350 742 4296
- LinkedIn: https://www.linkedin.com/in/cesargarces/
- GitHub: https://github.com/CesarGarces
- Portfolio: https://cesargarces.com
- Twitter: no querras verme allí
- Facebook: no querras verme allí
- Instagram: no querras verme allí

Responde de forma concisa pero completa. Si no sabes algo, admítelo honestamente.`

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    if (!process.env.GROQ_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'GROQ_API_KEY no está configurada' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const stream = await groq.chat.completions.create({
      model: 'moonshotai/kimi-k2-instruct-0905',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 1024,
    })

    const encoder = new TextEncoder()
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || ''
            if (content) {
              controller.enqueue(encoder.encode(content))
            }
          }
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Error en chat API:', error)
    return new Response(
      JSON.stringify({ error: 'Error al procesar la solicitud' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
