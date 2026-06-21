import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s | HAVOLKA',
    default: 'HAVOLKA — Premium Architectural Door Hardware',
  },
  description: 'Trade-only architectural door hardware. Lever handles, hinges, flush pulls, and cabinet hardware across four premium finishes. Membership by application.',
  keywords: ['door hardware', 'lever handles', 'architectural hardware', 'trade hardware', 'Australian door hardware'],
  openGraph: {
    title: 'HAVOLKA — Premium Architectural Door Hardware',
    description: 'Trade-only architectural door hardware. Available by application.',
    url: 'https://havolka.com',
    siteName: 'HAVOLKA',
    locale: 'en_AU',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-AU">
      <body>{children}</body>
    </html>
  )
}
