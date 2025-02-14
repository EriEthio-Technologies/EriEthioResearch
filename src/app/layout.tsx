import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { securityHeaders } from '@/lib/security'
import GlobalErrorPage from '@/app/error'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EriEthio Research',
  description: 'A platform for research collaboration between Eritrea and Ethiopia',
  icons: {
    icon: '/favicon.ico'
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta httpEquiv="Content-Security-Policy" content={securityHeaders['Content-Security-Policy']} />
        <meta httpEquiv="X-Content-Type-Options" content={securityHeaders['X-Content-Type-Options']} />
        <meta httpEquiv="X-Frame-Options" content={securityHeaders['X-Frame-Options']} />
      </head>
      <body className={inter.className}>
        <ErrorBoundary fallback={<GlobalErrorPage />}>
          <Providers>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
}
