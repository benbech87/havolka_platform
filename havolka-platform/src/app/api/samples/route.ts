import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getTokenFromHeader } from '@/lib/auth'
import { notifyNewLead, sendSampleDispatched } from '@/lib/email'
import { z } from 'zod'

const SampleSchema = z.object({
  name: z.string().min(1),
  company: z.string().min(1),
  email: z.string().email(),
  tradeType: z.enum(['ARCHITECT', 'INTERIOR_DESIGNER', 'BUILDER', 'OTHER']).optional(),
  address: z.string().min(1),
  finishes: z.array(z.string()).min(1),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = SampleSchema.parse(body)

    // Check if member
    const token = getTokenFromHeader(req.headers.get('authorization'))
    const auth = token ? verifyToken(token) : null

    await prisma.sampleRequest.create({
      data: {
        memberId: auth?.id || null,
        name: data.name,
        company: data.company,
        email: data.email,
        tradeType: data.tradeType,
        address: data.address,
        finishes: data.finishes,
        status: 'pending',
      },
    })

    // Create lead if not a member
    if (!auth) {
      await prisma.lead.create({
        data: {
          name: data.name,
          email: data.email,
          company: data.company,
          tradeType: data.tradeType,
          source: 'SAMPLE_REQUEST',
          notes: `Finishes: ${data.finishes.join(', ')}`,
        },
      })
    }

    // Notify team (non-blocking)
    notifyNewLead(
      'Finish Sample Request',
      data.name,
      data.email,
      data.company,
      `Finishes: ${data.finishes.join(', ')} — Address: ${data.address}`
    ).catch(console.error)

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    console.error('Sample request error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
