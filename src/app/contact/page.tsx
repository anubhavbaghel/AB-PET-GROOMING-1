'use client'

import { useState } from 'react'

export default function ContactPage(){
  const [status, setStatus] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [reviewStatus, setReviewStatus] = useState<string | null>(null)
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false)

  async function submitContact(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault()
    setIsSubmitting(true)
    setStatus(null)
    const form = new FormData(e.currentTarget)
    const payload = Object.fromEntries(form.entries())

    try{
      const res = await fetch('/api/contact',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(payload)
      })
      const json = await res.json()
      if(res.ok && json.success){
        setStatus('success')
        e.currentTarget.reset()
      } else {
        setStatus('error')
      }
    }catch(err){
      setStatus('error')
    }finally{
      setIsSubmitting(false)
    }
  }

  async function submitReview(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault()
    setIsReviewSubmitting(true)
    setReviewStatus(null)
    const form = new FormData(e.currentTarget)
    const payload = Object.fromEntries(form.entries())

    try{
      const res = await fetch('/api/reviews',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(payload)
      })
      if(res.ok){
        setReviewStatus('success')
        e.currentTarget.reset()
      } else {
        setReviewStatus('error')
      }
    }catch(err){
      setReviewStatus('error')
    }finally{
      setIsReviewSubmitting(false)
    }
  }

  return (
    <main className="contact-page-new">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <h1>Get in Touch</h1>
          <p>Have questions about our grooming services or boarding? We'd love to hear from you and your furry friend!</p>
        </div>
      </section>

      {/* Main Contact Grid */}
      <section className="contact-content-section">
        <div className="container">
          <div className="contact-split">
            
            {/* Left Column: Info & Map */}
            <div className="contact-info-col">
              <div className="info-cards">
                <div className="info-card">
                  <div className="info-icon">📞</div>
                  <div>
                    <h3>Call Us</h3>
                    <p>+91 8828719786</p>
                    <span className="info-sub">Mon – Sun, 10:30 AM – 7 PM</span>
                  </div>
                </div>
                <div className="info-card">
                  <div className="info-icon">✉️</div>
                  <div>
                    <h3>Email Us</h3>
                    <p>abpetgroomingstudio@gmail.com</p>
                    <span className="info-sub">We respond within 24 hours</span>
                  </div>
                </div>
                <div className="info-card">
                  <div className="info-icon">📍</div>
                  <div>
                    <h3>Visit Us</h3>
                    <p>Shop No 1, Amar Chawl, Kelkar Wadi Road,<br/>Chembur East, Mumbai</p>
                  </div>
                </div>
              </div>

              <div className="map-wrapper">
                <iframe src="https://maps.google.com/maps?q=Chembur&t=&z=13&output=embed" title="Google Maps - AB Pet Grooming" loading="lazy"></iframe>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="contact-form-col">
              <div className="contact-form-card">
                <h2>Send Us a Message</h2>
                <p>Fill out the form below and we'll get back to you as soon as possible.</p>
                <form onSubmit={submitContact} className="modern-form">
                  <div className="modern-form-group">
                    <label htmlFor="contact-name">Your Name</label>
                    <input id="contact-name" name="name" placeholder="Your Full Name" required />
                  </div>
                  
                  <div className="modern-form-group">
                    <label htmlFor="contact-email">Your Email</label>
                    <input id="contact-email" name="email" type="email" placeholder="you@example.com" required />
                  </div>
                  
                  <div className="modern-form-group">
                    <label htmlFor="contact-phone">Phone Number</label>
                    <input id="contact-phone" name="phone" type="tel" placeholder="+91 00000 00000" required />
                  </div>
                  
                  <div className="modern-form-group">
                    <label htmlFor="contact-subject">Subject</label>
                    <input id="contact-subject" name="subject" placeholder="How can we help?" required />
                  </div>
                  
                  <div className="modern-form-group">
                    <label htmlFor="contact-message">Your Message</label>
                    <textarea id="contact-message" name="message" rows={4} placeholder="Tell us more about your furry friend..." required></textarea>
                  </div>
                  
                  <button type="submit" className="submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                  
                  {status === 'success' && <div className="form-alert success">Message sent successfully!</div>}
                  {status === 'error' && <div className="form-alert error">Something went wrong. Please try again.</div>}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Review Section */}
      <section className="reviews-submit-section">
        <div className="container">
          <div className="review-form-card">
            <h2>Write a Review</h2>
            <p>We value your feedback. Let us know how we did!</p>
            <form onSubmit={submitReview} className="review-form">
              <div className="review-row">
                <div className="review-group">
                  <label htmlFor="review-name">Your Name</label>
                  <input id="review-name" name="name" placeholder="Your Name" required />
                </div>
                <div className="review-group">
                  <label htmlFor="review-rating">Rating</label>
                  <select id="review-rating" name="rating" required>
                    <option value="">Select Rating</option>
                    <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                    <option value="4">⭐⭐⭐⭐ (4/5)</option>
                    <option value="3">⭐⭐⭐ (3/5)</option>
                    <option value="2">⭐⭐ (2/5)</option>
                    <option value="1">⭐ (1/5)</option>
                  </select>
                </div>
              </div>
              <div className="review-group">
                <label htmlFor="review-message">Review</label>
                <textarea id="review-message" name="message" rows={4} placeholder="Write your review here..." required />
              </div>
              <button type="submit" className="review-submit-btn" disabled={isReviewSubmitting}>
                {isReviewSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
              
              {reviewStatus === 'success' && <div className="review-msg success" style={{marginTop: '15px'}}>Review submitted successfully!</div>}
              {reviewStatus === 'error' && <div className="review-msg error" style={{marginTop: '15px'}}>Failed to submit review.</div>}
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}
