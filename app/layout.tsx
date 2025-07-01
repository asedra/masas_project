import './globals.css'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'Customer Dashboard',
  description: 'Customer admin dashboard',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
