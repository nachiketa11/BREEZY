import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, JetBrains_Mono, DotGothic16 } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

const dotGothic = DotGothic16({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-dot-gothic',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'BREEZY — Student OS',
  description: 'Attendance, tasks and timeline. One raw dashboard, no noise.',
}

export const viewport: Viewport = {
  themeColor: '#000000',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${dotGothic.variable} h-full`}
    >
      <body className="min-h-dvh bg-black text-[#FAFAFA] font-[family-name:var(--font-space-grotesk)] antialiased">
        <div className="nos-grain" aria-hidden="true" />
        {children}
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: '#0D0D0D',
              border: '1px solid rgba(255,255,255,0.22)',
              borderRadius: 0,
              color: '#FAFAFA',
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              fontSize: 12,
            },
          }}
        />
      </body>
    </html>
  )
}
