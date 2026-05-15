'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const heroSlides = [
  {
    bg: 'linear-gradient(135deg, #a58ae6 0%, #7158a6 100%)',
    blob1: '#a58ae6',
    blob2: '#7158a6',
    blob3: '#c4b0f5',
    bigText: 'pawsome',
    subText: 'place for your pet',
    desc: 'Premium grooming, safe boarding and pet care for dogs and cats. Clean, gentle and stress-free service.',
    image: '/assets/images/hero/dog-hero.avif',
  },
  {
    bg: 'linear-gradient(135deg, #f4a261 0%, #e76f51 100%)',
    blob1: '#f4a261',
    blob2: '#e76f51',
    blob3: '#f4d03f',
    bigText: 'purrfect',
    subText: 'care for your cat',
    desc: 'Gentle cat grooming, safe boarding and specialized feline care. Stress-free experience for your cat.',
    image: '/assets/images/hero/cat-hero.avif',
  },
]

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isFading, setIsFading] = useState(false)
  const slide = heroSlides[currentSlide]

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true)
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
        setIsFading(false)
      }, 650)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* ================= HERO SLIDER ================= */}
      <section className="hero" id="hero" style={{ background: slide.bg }}>
        <div className="blob blob-1" style={{ background: slide.blob1 }}></div>
        <div className="blob blob-2" style={{ background: slide.blob2 }}></div>
        <div className="blob blob-3" style={{ background: slide.blob3 }}></div>

        <div className="container hero-inner">
          <div className="hero-left">
            <h1 className="hero-title">
              <span className={`hero-big ${isFading ? 'fade-out' : 'fade-in'}`} style={{ color: 'rgba(255,255,255,0.95)' }}>
                {slide.bigText}
              </span>
              <span className={`hero-sub ${isFading ? 'fade-out' : 'fade-in'}`}>
                {slide.subText}
              </span>
            </h1>

            <p className={`hero-desc ${isFading ? 'fade-out' : 'fade-in'}`}>
              {slide.desc}
            </p>

            <div className="hero-actions">
              <Link className="btn-pill btn-solid" href="/book-appointment">Book Appointment</Link>
              <a className="btn-pill btn-ghost" href="tel:+918828719786">Call Now</a>
            </div>
          </div>

          <div className="hero-right">
            <Image
              className={`hero-image ${isFading ? 'fade-out' : 'fade-in'}`}
              src={slide.image}
              alt="Pet Hero"
              width={520}
              height={500}
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>
      </section>

      {/* ================= FOUNDER SECTION ================= */}
      <section className="founder-section">
        <div className="container founder-wrapper">
          <div className="founder-image">
            <Image src="/assets/images/founder.avif" alt="Abrar Shaikh" width={420} height={500} style={{ borderRadius: '30px', boxShadow: '0 25px 60px rgba(0,0,0,0.15)' }} />
          </div>

          <div className="founder-content">
            <h2 className="founder-name">Abrar Shaikh</h2>

            <a href="https://instagram.com/abrar_shaikhsk__" target="_blank" className="insta-icon" title="Instagram">
              <svg width="28" height="28" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="insta-gradient" cx="30%" cy="107%" r="150%">
                    <stop offset="0%" stopColor="#fdf497" />
                    <stop offset="5%" stopColor="#fdf497" />
                    <stop offset="45%" stopColor="#fd5949" />
                    <stop offset="60%" stopColor="#d6249f" />
                    <stop offset="90%" stopColor="#285AEB" />
                  </radialGradient>
                </defs>
                <rect width="24" height="24" rx="6" fill="url(#insta-gradient)" />
                <circle cx="12" cy="12" r="4" fill="white" />
                <circle cx="17.5" cy="6.5" r="1.2" fill="white" />
              </svg>
            </a>

            <p className="founder-description">
              Abrar Shaikh, Founder of AB Pet Grooming, is a nationally recognized and internationally certified pet grooming expert with multiple championship titles to his name. From winning Best in Show at prestigious international competitions to proudly representing India on global grooming platforms, his journey reflects passion, precision, and unwavering dedication.
              <br /><br />
              With years of professional experience and advanced training under renowned global mentors, Abrar has set new benchmarks in modern pet grooming standards. His vision for AB Pet Grooming is clear — to provide world-class care, ethical grooming practices, and a calm, stress-free experience for every pet that walks through the door.
            </p>
          </div>
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section className="section section-soft">
        <div className="container center">
          <h2 className="h2">Everything Your Pet Needs</h2>
          <p className="subtext">Modern services with premium care.</p>

          <div className="grid-3">
            <div className="card">
              <div className="icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path fillRule="evenodd" d="M8.128 9.155a3.751 3.751 0 1 1 .713-1.321l1.136.656a.75.75 0 0 1 .222 1.104l-.006.007a.75.75 0 0 1-1.032.157 1.421 1.421 0 0 0-.113-.072l-.92-.531Zm-4.827-3.53a2.25 2.25 0 0 1 3.994 2.063.756.756 0 0 0-.122.23 2.25 2.25 0 0 1-3.872-2.293ZM13.348 8.272a5.073 5.073 0 0 0-3.428 3.57 5.08 5.08 0 0 0-.165 1.202 1.415 1.415 0 0 1-.707 1.201l-.96.554a3.751 3.751 0 1 0 .734 1.309l13.729-7.926a.75.75 0 0 0-.181-1.374l-.803-.215a5.25 5.25 0 0 0-2.894.05l-5.325 1.629Zm-9.223 7.03a2.25 2.25 0 1 0 2.25 3.897 2.25 2.25 0 0 0-2.25-3.897ZM12 12.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                  <path d="M16.372 12.615a.75.75 0 0 1 .75 0l5.43 3.135a.75.75 0 0 1-.182 1.374l-.802.215a5.25 5.25 0 0 1-2.894-.051l-5.147-1.574a.75.75 0 0 1-.156-1.367l3-1.732Z" />
                </svg>
              </div>
              <h3>Grooming</h3>
              <p className="muted">Bath • Blow Dry • Haircut • Nail Trim • Ear Cleaning</p>
              <Link className="btn-pill btn-outline" href="/services">View Grooming</Link>
            </div>

            <div className="card">
              <div className="icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                  <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                </svg>
              </div>
              <h3>Boarding</h3>
              <p className="muted">Safe Stay • Clean Rooms • Routine Care • Comfort First</p>
              <Link className="btn-pill btn-outline" href="/boarding">View Boarding</Link>
            </div>

            <div className="card">
              <div className="icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M5.223 2.25c-.497 0-.974.198-1.325.55l-1.3 1.298A3.75 3.75 0 0 0 7.5 9.75c.627.47 1.406.75 2.25.75.844 0 1.624-.28 2.25-.75.626.47 1.406.75 2.25.75.844 0 1.623-.28 2.25-.75a3.75 3.75 0 0 0 4.902-5.652l-1.3-1.299a1.875 1.875 0 0 0-1.325-.549H5.223Z" />
                  <path fillRule="evenodd" d="M3 20.25v-8.755c1.42.674 3.08.673 4.5 0A5.234 5.234 0 0 0 9.75 12c.804 0 1.568-.182 2.25-.506a5.234 5.234 0 0 0 2.25.506c.804 0 1.567-.182 2.25-.506 1.42.674 3.08.675 4.5.001v8.755h.75a.75.75 0 0 1 0 1.5H2.25a.75.75 0 0 1 0-1.5H3Zm3-6a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75v-3Zm8.25-.75a.75.75 0 0 0-.75.75v5.25c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75v-5.25a.75.75 0 0 0-.75-.75h-3Z" clipRule="evenodd" />
                </svg>
              </div>
              <h3>Pet Shop</h3>
              <p className="muted">Browse pets available and send inquiry to buy</p>
              <Link className="btn-pill btn-outline" href="/petstore">Visit Pet Shop</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE ================= */}
      <section className="section">
        <div className="container center">
          <h2 className="h2">Why Choose AB Pet Grooming?</h2>
          <p className="subtext">Premium care, safe products and a stress-free grooming experience.</p>

          <div className="why-grid">
            <div className="why-box">
              <div className="why-icon">
                <svg width="40" height="40" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                  <ellipse cx="30" cy="38" rx="16" ry="10" fill="#8B4513" />
                  <circle cx="45" cy="28" r="9" fill="#8B4513" />
                  <ellipse cx="52" cy="24" rx="4" ry="6" fill="#A0522D" />
                  <circle cx="48" cy="26" r="2" fill="white" />
                  <circle cx="48" cy="26" r="1" fill="black" />
                  <rect x="18" y="44" width="4" height="10" fill="#D3D3D3" />
                  <rect x="30" y="44" width="4" height="10" fill="#D3D3D3" />
                  <path d="M16 32 Q8 20 12 16" stroke="#8B4513" strokeWidth="3" fill="none" />
                </svg>
              </div>
              <h3>Experienced Groomers</h3>
              <p>Certified professionals with years of experience caring for pets.</p>
            </div>

            <div className="why-box">
              <div className="why-icon">
                <svg width="40" height="40" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                  <rect x="10" y="18" width="44" height="34" fill="#E6C27A" />
                  <rect x="10" y="14" width="44" height="8" fill="#D4AF63" />
                  <rect x="26" y="26" width="12" height="4" fill="#B8924F" />
                  <path d="M40 40 L40 50 M36 44 L40 40 L44 44" stroke="#4A90E2" strokeWidth="2" />
                  <path d="M46 40 L46 50 M42 44 L46 40 L50 44" stroke="#4A90E2" strokeWidth="2" />
                </svg>
              </div>
              <h3>Pet-Safe Products</h3>
              <p>We use only gentle, hypoallergenic products for your pet's safety.</p>
            </div>

            <div className="why-box">
              <div className="why-icon">
                <svg width="40" height="40" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="8,40 32,26 56,40 32,54" fill="#F4B24A" />
                  <polygon points="20,34 28,22 36,34" fill="#4CAF50" />
                  <polygon points="28,30 36,18 44,30" fill="#2E7D32" />
                  <circle cx="48" cy="28" r="5" fill="#4CAF50" />
                  <rect x="46" y="30" width="4" height="8" fill="#2E7D32" />
                  <circle cx="14" cy="22" r="4" fill="#81D4FA" />
                </svg>
              </div>
              <h3>Stress-Free Environment</h3>
              <p>Calm, welcoming space designed to keep your pets comfortable.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
