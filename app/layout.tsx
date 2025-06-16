import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fillout Navigator',
  description: 'Created with next',
  generator: 'dhsolver',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
