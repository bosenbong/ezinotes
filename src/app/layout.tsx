import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EziNotes - Voice to NDIS Notes',
  description: 'AI-powered NDIS note taking for support workers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
<!-- build fix -->
