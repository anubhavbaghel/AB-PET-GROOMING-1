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
    <>
      <section className="story-flow">
        <div className="container">
          <div className="story-block">
            <h2>Our Story</h2>
            <p>
              AB Pet Grooming is built with one goal — stress-free grooming.
              Every pet deserves gentle care, hygiene, and a calm environment.
            </p>
          </div>

          <div className="story-block">
            <h2>Our Goal</h2>
            <p>
              We aim to deliver premium grooming with consistency and trust.
              Every visit should feel safe, clean, and professional.
            </p>
          </div>

          <div className="story-block">
            <h2>Our Vision</h2>
            <p>
              We are creating a modern grooming experience where comfort meets
              premium quality and global standards.
            </p>
          </div>
        </div>
      </section>

      <section className="awardsStack">
        <div className="container">
          <div className="awardsHead">
            <h3>Awards & Journey</h3>
            <p>Championship moments, trophies, certificates and grooming highlights.</p>
          </div>

          <div className="stackWrap">
            <button className="stackBtn left" type="button" onClick={prev}>&#10094;</button>

            <div className="stackStage">
              <div className="stackTrack" ref={trackRef} style={{transform:`translateX(-${slideIndex * 100}%)`, display:'flex', transition:'transform 400ms ease'}}>
                {images.map((n) => (
                  <div className="stackItem" key={n} style={{flex:'0 0 100%'}}>
                    <img src={`/assets/images/about/${n}.avif`} alt="" />
                  </div>
                ))}
              </div>
            </div>

            <button className="stackBtn right" type="button" onClick={next}>&#10095;</button>
          </div>

          <div className="stackDots" />
        </div>
      </section>

      <section className="reelsSection">
        <div className="container">
          <div className="reelsHead">
            <h2>Watch Our Reels</h2>
            <p>Quick grooming highlights, transformations, happy pets and behind-the-scenes moments.</p>
          </div>

          <div className="reelsWrap">
            <div className="reelsViewport">
              <div className="reelsTrack" style={{display:'flex', gap:12}}>
                {[1,2,3,4,5,6].map(i=> (
                  <div className="reelSlide" key={i} style={{flex:'0 0 33.3333%'}}>
                    <div className="reelCard">
                      <video className="reelVideo" controls playsInline preload="metadata" poster={`/assets/images/reels/reel${i}.jpg`}>
                        <source src={`/assets/videos/reels/reel${i}.mp4`} type="video/mp4" />
                      </video>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="reelsInstagram">
            <a href="https://www.instagram.com/ab_pet_grooming_studio" target="_blank" rel="noreferrer" className="instaBtn">View More on Instagram →</a>
          </div>
        </div>
      </section>

      <section className="review-section">
        <h2 className="review-title">What Our Happy Users Say 💜</h2>

        <div className="carousel">
          <div className="carousel-track" style={{display:'flex', gap:20, overflowX:'auto', padding:'20px'}}>
            {reviews.length === 0 ? (
              <div className="review-card">No reviews yet.</div>
            ) : reviews.map(r => (
              <div className="review-card" key={r.id} style={{minWidth:260}}>
                <div className="stars">{'⭐'.repeat(r.rating)}</div>
                <p className="review-text">“{r.message}”</p>
                <h4 className="review-name">— {r.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
