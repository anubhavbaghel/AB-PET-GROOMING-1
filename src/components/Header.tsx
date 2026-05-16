'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <header className="site-header">
      <div className="container nav-inner">
        <Link className="brand" href="/" onClick={() => setIsOpen(false)}>
          <img src="/assets/images/logo.avif" alt="Logo" className="logo" />
          <span>AB Pet Grooming Store</span>
        </Link>

        <button 
          className={`menu-toggle ${isOpen ? 'open' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-container ${isOpen ? 'open' : ''}`}>
          <nav className="nav">
            <Link href="/">Home</Link>
            <Link href="/about">About Us</Link>
            <Link href="/services">Services</Link>
            <Link href="/boarding">Boarding</Link>
            <Link href="/petstore">Pet Store</Link>
            <Link href="/contact">Contact</Link>
          </nav>

          <div className="nav-buttons">
            <Link href="/book-appointment" className="btn-pill btn-solid">Book Appointment</Link>
          </div>
        </div>
      </div>
    </header>
  )
}
