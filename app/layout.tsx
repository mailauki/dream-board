import './globals.css'
import { Geist } from 'next/font/google'
import Link from 'next/link'
import { ThemeProvider } from 'next-themes'

import { ThemeSwitcher } from '@/components/theme-switcher'
import Navbar from '@/components/navbar'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Next.js and Supabase Starter Kit',
  description: 'The fastest way to build apps with Next.js and Supabase',
}

const geistSans = Geist({
  display: 'swap',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning className={geistSans.className} lang="en">
      <body className="bg-background text-foreground">
        <ThemeProvider
          disableTransitionOnChange
          enableSystem
          attribute="class"
          defaultTheme="system"
        >
          <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="w-full flex flex-col flex-1">
              {children}
            </main>

            <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 pt-8 pb-24 sm:py-16">
              <p>
                  Powered by{' '}
                <Link
                  className="font-bold hover:underline"
                  href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
                  rel="noreferrer"
                  target="_blank"
                >
                    Supabase
                </Link>
              </p>
              <ThemeSwitcher />
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
