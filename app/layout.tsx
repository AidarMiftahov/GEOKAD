import type { Metadata, Viewport } from 'next'
import { Libre_Baskerville, IBM_Plex_Sans } from 'next/font/google'
import './globals.css'

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'GEOKAD — Кадастровые и инженерные изыскания',
  description: 'Технические планы, межевание, геодезия и проектные работы по всей России. 15 лет на рынке, аттестованные кадастровые инженеры.',
}

export const viewport: Viewport = {
  themeColor: '#F5F3EF',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={`${libreBaskerville.variable} ${ibmPlexSans.variable}`}>
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  )
}
