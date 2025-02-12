import { Inter } from 'next/font/google'
import { Providers } from './providers'
import NavHeader from '@/components/ui/nav-header'
import { Footer } from '@/components/ui/footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'EriEthio Research',
  description: 'Research and Innovation Hub',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <NavHeader />
            <main className="flex-grow pt-16">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
