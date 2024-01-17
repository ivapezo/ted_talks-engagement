import './css/style.css'

import { Inter, Architects_Daughter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react';
import Banner from '@/components/banner'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

const architects_daughter = Architects_Daughter({
  subsets: ['latin'],
  variable: '--font-architects-daughter',
  weight: '400',
  display: 'swap'
})

export const metadata = {
  title: 'Predicting popularity and audience engagement',
  description: 'Predicting popularity and audience engagement in TED talks based on language usage',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${architects_daughter.variable} font-inter antialiased bg-gray-900 text-gray-200 tracking-tight`}>
        <div className="flex flex-col min-h-screen overflow-hidden">
          {children}
          <Banner />
        </div>
        <Analytics />
      </body>
    </html>
  )
}
 