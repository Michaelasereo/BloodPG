import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/lib/authContext'

export const metadata: Metadata = {
  title: 'BloodPG - Blood Pressure Tracker',
  description: 'Track your blood pressure and glucose levels',
  icons: {
    icon: '/favicon.ico',
    apple: '/logo192.png',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

