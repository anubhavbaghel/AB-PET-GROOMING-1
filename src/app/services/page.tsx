"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"

export default function ServicesPage(){
  const [active, setActive] = useState<'dogs'|'cats'>('dogs')
  const indicatorRef = useRef<HTMLDivElement|null>(null)
  const dogsTabRef = useRef<HTMLButtonElement|null>(null)
  const catsTabRef = useRef<HTMLButtonElement|null>(null)

  useEffect(()=>{
    const tab = active === 'dogs' ? dogsTabRef.current : catsTabRef.current
    const parent = tab?.parentElement
    if(!tab || !parent || !indicatorRef.current) return
    const tabRect = tab.getBoundingClientRect()
    const parentRect = parent.getBoundingClientRect()
    indicatorRef.current.style.width = tabRect.width + 'px'
    indicatorRef.current.style.left = (tabRect.left - parentRect.left) + 'px'
  },[active])

  // placeholder data until backend is wired
  const sample = [
    {icon: '✂️', title: 'Full Grooming', items: ['Bath', 'Haircut', 'Nail trim'], price: 'From ₹799'},
    {icon: '🛁', title: 'Quick Bath', items: ['Shampoo', 'Blowdry'], price: 'From ₹499'},
    {icon: '🦷', title: 'Dental & Hygiene', items: ['Teeth clean', 'Ear clean'], price: 'From ₹399'},
  ]

  return (
    <main className="services-page">
      <div className="container">
        <section className="services-hero">
          <h1>Our Grooming Services</h1>
          <p>Premium care for your furry family members — because they deserve the best.</p>
        </section>

        <div className="services-toggle-wrapper">
          <div className="services-toggle" role="tablist" aria-label="Service tabs">
            <div className="services-indicator" ref={indicatorRef} />
            <button ref={dogsTabRef} className={`services-tab ${active==='dogs'?'active':''}`} onClick={()=>setActive('dogs')}>Dogs</button>
            <button ref={catsTabRef} className={`services-tab ${active==='cats'?'active':''}`} onClick={()=>setActive('cats')}>Cats</button>
          </div>
        </div>

        <div className={`services-panel ${active==='dogs'?'active':''}`} id="dogsPanel">
          <section className="services-grid">
            {sample.map((s,idx)=> (
              <article key={idx} className="service-card">
                <div className="service-icon">{s.icon}</div>
                <div className="service-info">
                  <h2>{s.title}</h2>
                  <ul className="service-list">
                    {s.items.map((it,i)=>(<li key={i}>{it}</li>))}
                  </ul>
                </div>
                <div className="service-price">{s.price}</div>
              </article>
            ))}
          </section>
        </div>

        <div className={`services-panel ${active==='cats'?'active':''}`} id="catsPanel">
          <section className="services-grid">
            {sample.map((s,idx)=> (
              <article key={idx} className="service-card">
                <div className="service-icon">{s.icon}</div>
                <div className="service-info">
                  <h2>{s.title}</h2>
                  <ul className="service-list">
                    {s.items.map((it,i)=>(<li key={i}>{it}</li>))}
                  </ul>
                </div>
                <div className="service-price">{s.price}</div>
              </article>
            ))}
          </section>
        </div>

        <div className="book-center">
          <Link href="/book-appointment" className="book-btn">Book Appointment</Link>
        </div>

        <div className="services-banner">
          <div>
            <h3>Pet Boarding Services</h3>
            <p>Going on a trip? Leave your furry friend in safe, loving hands.</p>
          </div>
          <Link href="/boarding" className="services-banner-btn">Explore Boarding →</Link>
        </div>
      </div>
    </main>
  )
}
