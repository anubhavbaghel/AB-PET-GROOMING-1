import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'AB Pet Grooming',
  description: 'Professional pet grooming, safe boarding & pet care services in Mumbai.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 9999 }}>
          <a href="https://wa.me/918828719786" target="_blank" className="btn-pill btn-wa" style={{ boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)', textAlign: 'center' }}>WhatsApp</a>
          <a href="https://instagram.com/abrar_shaikhsk__" target="_blank" className="btn-pill btn-ig" style={{ boxShadow: '0 4px 12px rgba(225, 48, 108, 0.3)', textAlign: 'center' }}>Instagram</a>
        </div>
      </body>
    </html>
  )
}
