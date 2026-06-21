import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { comparePassword, signToken } from '@/lib/auth'
import { z } from 'zod'

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = LoginSchema.parse(body)

    const member = await prisma.member.findUnique({ where: { email } })
    if (!member) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    if (member.status === 'SUSPENDED') {
      return NextResponse.json({ error: 'Account suspended' }, { status: 403 })
    }

    const valid = await comparePassword(password, member.password)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = signToken({
      id: member.id,
      email: member.email,
      type: 'member',
      status: member.status,
    })

    const response = NextResponse.json({
      success: true,
      token,
      member: {
        id: member.id,
        firstName: member.firstName,
        lastName: member.lastName,
        company: member.company,
        status: member.status,
      },
    })

    // Set httpOnly cookie for SSR
    response.cookies.set('havolka-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error' }, { status: 400 })
    }
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
