import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyToken, getTokenFromHeader } from '@/lib/auth'
import { notifyNewLead } from '@/lib/email'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `You are HAVOLKA's specification assistant — a knowledgeable, concise trade hardware advisor helping architects, interior designers, and builders specify door hardware for residential projects.

Your job is to guide the user through building either a Quick Quote or a Full Door Schedule, then output a structured JSON schedule at the end.

PRODUCT KNOWLEDGE:
Handle styles: "Long Lever" (default), "Curve Lever"
Functions: "Passage Set", "Privacy Set", "Entrance Set", "Lever Set Only"
Hinges: 2 per door standard, 3 for heavy/oversized doors (>900mm wide or solid timber >45kg)
Door stops: "Floor Mount" or "Wall Mount" — ask per door in full schedule
Flush pulls (sliding doors): "Oval Flush Pull 150mm" or "Straight Flush Pull 152mm"
Cabinet handles: "Edge Handle" (96, 128, 192, 256, 320mm), "Linear Handle" (96, 128, 192, 224, 256, 320mm)
Finishes: "Smooth Black", "Smooth Nickel", "Smooth Bronze", "Smooth Graphite"
Sliding doors: replace lever set with flush pull + sliding kit

RULES:
- Residential only. If commercial mentioned: "Commercial projects need our team for compliance. I'll connect you with Rafe — our product and schedule specialist." Stop flow.
- Be brief. One question at a time. Conversational.
- Auto-apply 2 hinges per door unless user says heavy door.
- Quick Quote: ask total counts, one finish, done.
- Full Schedule: go D1, D2, D3... For each: swing or sliding? function? handle style? door stop? notes?
- After all doors, ask about cabinet handles.
- On completion output SCHEDULE_JSON_START...SCHEDULE_JSON_END.

SKU codes: MB=Smooth Black, MSN=Smooth Nickel, BRO=Smooth Bronze, GRA=Smooth Graphite
Long Lever Passage → HVK.01/02.[CODE]
Curve Lever → HVK.03/04.[CODE]
Hinge → HVK.60.[CODE]
Floor Stop → HVK.70.[CODE]
Wall Stop → HVK.71.[CODE]
Oval Flush Pull → HVK.85.[CODE]
Edge Handle 192mm → HVK.E192.[CODE]
Linear Handle 224mm → HVK.L224.[CODE]

When complete output:
SCHEDULE_JSON_START
{"mode":"full","projectName":null,"finish":"Smooth Black","doors":[],"cabinetHandles":[],"summary":[]}
SCHEDULE_JSON_END

Start: "Hi — are you after a Quick Quote or a Full Door Schedule?"`

const MessageSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })),
  // Lead capture for non-members
  leadName: z.string().optional(),
  leadEmail: z.string().optional(),
  leadCompany: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { messages, leadName, leadEmail, leadCompany } = MessageSchema.parse(body)

    const token = getTokenFromHeader(req.headers.get('authorization'))
    const auth = token ? verifyToken(token) : null

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages,
    })

    const content = response.content[0]?.type === 'text' ? response.content[0].text : ''

    // Check if schedule is complete and capture lead
    if (content.includes('SCHEDULE_JSON_START') && !auth && leadEmail) {
      // Extract schedule
      const match = content.match(/SCHEDULE_JSON_START\s*([\s\S]*?)\s*SCHEDULE_JSON_END/)
      const scheduleData = match ? JSON.parse(match[1]) : null

      // Save lead
      await prisma.lead.create({
        data: {
          name: leadName || 'Unknown',
          email: leadEmail,
          company: leadCompany,
          source: 'AI_SCHEDULE',
          notes: scheduleData ? `${scheduleData.mode} schedule, ${scheduleData.doors?.length || 0} doors, ${scheduleData.finish}` : undefined,
        },
      }).catch(console.error)

      // Notify team
      notifyNewLead(
        'AI Schedule Builder',
        leadName || 'Unknown',
        leadEmail,
        leadCompany,
        scheduleData ? `${scheduleData.doors?.length || 0} doors, ${scheduleData.finish}` : undefined
      ).catch(console.error)
    }

    return NextResponse.json({ content })
  } catch (error) {
    console.error('AI quote error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
