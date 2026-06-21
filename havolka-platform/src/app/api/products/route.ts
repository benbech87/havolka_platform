import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getTokenFromHeader } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('cat')
    const finish = searchParams.get('finish')
    const slug = searchParams.get('slug')

    // Check member status for pricing
    const token = getTokenFromHeader(req.headers.get('authorization'))
    const auth = token ? verifyToken(token) : null
    const isMember = auth?.type === 'member'

    const where: any = { status: { in: ['ACTIVE', 'COMING_SOON'] } }
    if (category) where.category = category
    if (slug) where.slug = slug

    const products = await prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { position: 'asc' } },
        skus: {
          where: finish ? { finish: finish as any } : undefined,
          select: {
            id: true,
            sku: true,
            finish: true,
            function: true,
            size: true,
            stockLevel: true,
            // Only return pricing to members
            price1_5: isMember,
            price6_9: isMember,
            price10plus: isMember,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Products error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
