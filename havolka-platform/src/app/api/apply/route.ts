export const dynamic = 'force-dynamic'
  import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
import { sendApplicationConfirmation, notifyTeamNewApplication, notifyNewLead } from '@/lib/email'
import { z } from 'zod'

const ApplicationSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  company: z.string().min(1),
  tradeType: z.enum(['ARCHITECT', 'INTERIOR_DESIGNER', 'BUILDER', 'OTHER']),
  abn: z.string().optional(),
  website: z.string().optional(),
  phone: z.string().optional(),
  projectsPerYear: z.string().optional(),
  whyHavolka: z.string().optional(),
  companyFoundedDate: z.string().optional(),
  merchAddress: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = ApplicationSchema.parse(body)

    // Check if email already exists
    const existing = await prisma.member.findUnique({ where: { email: data.email } })
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    const hashedPassword = await hashPassword(data.password)

    const member = await prisma.member.create({
      data: {
        ...data,
        password: hashedPassword,
        status: 'PRICING_ACCESS', // immediate read access
        companyFoundedDate: data.companyFoundedDate ? new Date(data.companyFoundedDate) : undefined,
      },
    })

    // Create lead record
    await prisma.lead.create({
      data: {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        company: data.company,
        phone: data.phone,
        tradeType: data.tradeType,
        source: 'APPLICATION',
        notes: data.whyHavolka,
      },
    })

    // Send emails (non-blocking)
    Promise.all([
      sendApplicationConfirmation(data.email, data.firstName),
      notifyTeamNewApplication(`${data.firstName} ${data.lastName}`, data.company, data.tradeType),
      notifyNewLead('Membership Application', `${data.firstName} ${data.lastName}`, data.email, data.company, data.whyHavolka),
    ]).catch(console.error)

    return NextResponse.json({
      success: true,
      memberId: member.id,
      status: member.status,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    console.error('Application error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
