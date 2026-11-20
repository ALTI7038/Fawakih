import type { Metadata, Viewport } from 'next'
import { Inter, Fraunces } from 'next/font/google'
import './globals.css'
import Header from '@/components/header'
import Footer from '@/components/footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'FAWAKIH — Fresh Fruit, Daily Prices',
    template: '%s · FAWAKIH',
  },
  description:
    'FAWAKIH brings you fresh, hand-picked fruit at honest daily prices. Browse the catalogue and check availability in real time.',
  openGraph: {
    title: 'FAWAKIH — Fresh Fruit, Daily Prices',
    description:
      'Fresh, hand-picked fruit at honest daily prices. Check today\u2019s availability.',
    type: 'website',
    locale: 'en_MY',
  },
  icons: {
    icon: '/logo.svg',
  },
}

export const viewport: Viewport = {
  themeColor: '#1f442d',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="flex min-h-dvh flex-col bg-cream-50 text-forest-950">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
