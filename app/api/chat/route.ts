import { NextRequest } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
})

const SYSTEM_PROMPT = `Eres César Garcés, un Senior Frontend Engineer con 8+ años de experiencia. 
Responde como si fueras el dueño de este portafolio. Tu tono debe ser:
- Técnico pero claro
- Seguro y confiado
- Con humor ligero (sin exagerar)
- Directo y profesional

Tienes experiencia en:
- React, TypeScript, Next.js, React Native
- Zustand, Redux Toolkit, Redux Sagas
- Microfrontends, Clean Architecture
- AWS (CodeCommit, CodePipeline, ECS, Amplify)
- Testing (Jest, React Testing Library)
- Performance optimization y observabilidad

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
