"use client"

import { useEffect, useState, useRef } from "react"

type Review = {
  id: number
  name: string
  message: string
  rating: number
}

export default function AboutPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [slideIndex, setSlideIndex] = useState(0)
  const trackRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    fetch('/api/reviews')
      .then(async (res) => {
        let data: any = null
        try {
          data = await res.json()
        } catch (err) {
          console.error('Failed to parse reviews response', err)
        }

        if (!res.ok) {
          console.error('Reviews API error', data)
          setReviews([])
          return
        }

        if (!Array.isArray(data)) {
          setReviews([])
          return
        }

        setReviews(data)
      })
      .catch((err) => {
        console.error('Failed to fetch reviews', err)
        setReviews([])
      })
  }, [])

  const images = [
    'about',
    ...Array.from({length:20}, (_,i)=>`about${i+1}`)
  ]

  function prev() {
    setSlideIndex(s => Math.max(0, s-1))
  }

  function next() {
    setSlideIndex(s => Math.min(images.length-1, s+1))
  }

  return (
    <main className="about-main">
      {/* Story Section */}
      <section className="story-section">
        <div className="container story-grid">
          <article className="story-card">
            <h2>Our Story</h2>
            <p>
              AB Pet Grooming is built with one goal — stress-free grooming.
              Every pet deserves gentle care, hygiene, and a calm environment.
            </p>
          </article>

          <article className="story-card">
            <h2>Our Goal</h2>
            <p>
              We aim to deliver premium grooming with consistency and trust.
              Every visit should feel safe, clean, and professional.
            </p>
          </article>

          <article className="story-card">
            <h2>Our Vision</h2>
            <p>
              We are creating a modern grooming experience where comfort meets
              premium quality and global standards.
            </p>
          </article>
        </div>
      </section>

      {/* Awards Slider */}
      <section className="awards-section">
        <div className="container">
          <div className="section-header">
            <h2>Awards & Journey</h2>
            <p>Championship moments, trophies, certificates and grooming highlights.</p>
          </div>

          <div className="slider-container">
            <button className="slider-btn prev" type="button" aria-label="Previous image" onClick={prev}>&#10094;</button>

            <div className="slider-track" ref={trackRef} style={{ transform: `translateX(-${slideIndex * 100}%)` }}>
              {images.map((n) => (
                <div className="slider-item" key={n}>
                  <img src={`/assets/images/about/${n}.avif`} alt="Award moment" loading="lazy" />
                </div>
              ))}
            </div>

            <button className="slider-btn next" type="button" aria-label="Next image" onClick={next}>&#10095;</button>
          </div>
        </div>
      </section>

      {/* Reels Section */}
      <section className="reels-section">
        <div className="container">
          <div className="section-header">
            <h2>Watch Our Reels</h2>
            <p>Quick grooming highlights, transformations, happy pets and behind-the-scenes moments.</p>
          </div>

          <div className="reels-track">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div className="reel-card" key={i}>
                <video className="reel-video" controls playsInline autoPlay muted loop poster={`/assets/images/reels/reel${i}.jpg`}>
                  <source src={`/assets/videos/reels/reel${i}.mp4`} type="video/mp4" />
                </video>
              </div>
            ))}
          </div>

          <div className="insta-btn-wrap">
            <a href="https://www.instagram.com/ab_pet_grooming_studio" target="_blank" rel="noreferrer" className="insta-btn">View More on Instagram →</a>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="reviews-section">
        <div className="container">
          <div className="section-header">
            <h2>What Our Happy Users Say 💜</h2>
            <p>Authentic experiences shared by our beloved pet parents.</p>
          </div>
          
          <div className="reviews-track">
            {reviews.length === 0 ? (
              <div className="review-card"><p className="review-text" style={{textAlign: 'center'}}>No reviews yet.</p></div>
            ) : reviews.map(r => (
              <article className="review-card" key={r.id}>
                <div className="review-stars">{'⭐'.repeat(r.rating)}</div>
                <p className="review-text">“{r.message}”</p>
                <h4 className="review-name">— {r.name}</h4>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
