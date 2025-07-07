import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Climate DAO ',
  description: 'Create a Climate DAO to fund climate projects',
  generator: 'Next.js',
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
