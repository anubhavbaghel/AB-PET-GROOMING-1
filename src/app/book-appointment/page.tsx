'use client'

import { useState } from 'react'

export default function BookAppointment() {
  const [status, setStatus] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus(null)
    const form = new FormData(e.currentTarget)
    const payload: any = {}
    form.forEach((v, k) => {
      if (payload[k]) {
        if (Array.isArray(payload[k])) payload[k].push(v)
        else payload[k] = [payload[k], v]
      } else payload[k] = v
    })

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (res.ok && json.success) {
        setStatus('success')
        e.currentTarget.reset()
      } else if (json.full) {
        setStatus('full')
      } else {
        setStatus('error')
      }
    } catch (err) {
      setStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="appointment-page">
      <div className="container">
        <section className="appt-hero">
          <h1>Book an Appointment</h1>
          <p>Schedule a grooming session for your beloved pet. Fill out the form below and we will confirm your appointment.</p>
        </section>

        <div className="appt-grid">
          
          <div className="appt-form-card">
            <div className="form-head">
              <h2>Booking Form</h2>
              <p>Please enter your information correctly to avoid delays.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="appt-form">
              <h3>Owner Information</h3>
              <div className="form-group">
                <label>Owner Name *</label>
                <input name="owner_name" placeholder="Enter full name" required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input name="email" type="email" placeholder="you@example.com" required />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input name="phone" type="tel" placeholder="+91 00000 00000" required />
                </div>
              </div>

              <h3>Pet Information</h3>
              <div className="form-group">
                <label>Pet Name *</label>
                <input name="pet_name" placeholder="Enter pet's name" required />
              </div>

              <div className="form-group">
                <label>Pet Category *</label>
                <div className="pet-type-pills">
                  <label className="pet-pill">
                    <input type="radio" name="pet_category" value="Dog" required defaultChecked />
                    <span>🐶 Dog</span>
                  </label>
                  <label className="pet-pill">
                    <input type="radio" name="pet_category" value="Cat" required />
                    <span>🐱 Cat</span>
                  </label>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Breed</label>
                  <input name="breed" placeholder="E.g., Golden Retriever" />
                </div>
                <div className="form-group">
                  <label>Pet Size / Type *</label>
                  <select name="pet_size" required>
                    <option value="">Select size</option>
                    <option value="Small">Small (under 10kg)</option>
                    <option value="Medium">Medium (10kg - 25kg)</option>
                    <option value="Large">Large (25kg+)</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Number of Pets *</label>
                  <select name="pet_count" required>
                    <option value="">Select</option>
                    <option value="1">1 Pet</option>
                    <option value="2">2 Pets</option>
                    <option value="3">3+ Pets</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Multiple Pets Note</label>
                  <input name="multi_pet_note" placeholder="Any details for other pets?" />
                </div>
              </div>

              <h3>Service & Date</h3>
              <div className="form-group">
                <label>Main Service *</label>
                <select name="main_service" required>
                  <option value="">Select Service</option>
                  <option value="Full Bath & Groom">Full Bath & Groom</option>
                  <option value="Haircut & Styling">Haircut & Styling</option>
                  <option value="Quick Bath">Quick Bath</option>
                </select>
              </div>

              <div className="form-group">
                <label>Add-On Services</label>
                <div className="checkbox-grid">
                  <label><input type="checkbox" name="addons[]" value="Ear Cleaning" /> Ear Cleaning</label>
                  <label><input type="checkbox" name="addons[]" value="Nail Clipping & Grinding" /> Nail Clipping</label>
                  <label><input type="checkbox" name="addons[]" value="Teeth Brushing" /> Teeth Brushing</label>
                  <label><input type="checkbox" name="addons[]" value="Flea Treatment" /> Flea Treatment</label>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Preferred Date *</label>
                  <input name="appointment_date" type="date" required />
                </div>
                <div className="form-group">
                  <label>Preferred Time *</label>
                  <input name="appointment_time" type="time" required />
                </div>
              </div>

              <div className="form-group">
                <label>Additional Notes</label>
                <textarea name="notes" rows={4} placeholder="Any medical conditions or aggressive behavior we should know about?"></textarea>
              </div>

              <div className="payment-method-section">
                <label className="payment-title">Select Payment Method</label>
                <div className="payment-options">
                  <label className="payment-card">
                    <input type="radio" name="payment_method" value="cash" defaultChecked />
                    <div className="payment-content"><h4>Pay at Store (Cash)</h4></div>
                  </label>
                  <label className="payment-card">
                    <input type="radio" name="payment_method" value="online" />
                    <div className="payment-content"><h4>Pay Online</h4></div>
                  </label>
                </div>
              </div>

              <button type="submit" className="appt-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting Booking...' : 'Book Appointment'}
              </button>
              
              {status === 'success' && <div className="form-alert success" style={{marginTop: '20px'}}>Appointment successfully requested! Our team will contact you shortly.</div>}
              {status === 'full' && <div className="form-alert error" style={{marginTop: '20px'}}>Sorry, we are fully booked for that slot. Please choose another date or time.</div>}
              {status === 'error' && <div className="form-alert error" style={{marginTop: '20px'}}>Something went wrong. Please try again.</div>}
            </form>
          </div>

          {/* Sidebar */}
          <aside className="appt-sidebar">
            <div className="side-card lavender">
              <h3>Why Book With Us?</h3>
              <p><strong>✓ Certified Groomers:</strong> We utilize advanced, gentle grooming techniques.</p>
              <p><strong>✓ Premium Products:</strong> We only use 100% pet-safe, organic shampoos.</p>
              <p><strong>✓ Stress-Free Environment:</strong> A calm setting guaranteed to make your furry friend feel safe.</p>
            </div>
            
            <div className="side-card pink">
              <h3>Need Urgent Help?</h3>
              <p>If you require immediate assistance or have very specific requests, don't hesitate to reach out directly!</p>
              <p style={{fontSize: '18px', fontWeight: '800', color: '#dd2a7b'}}>+91 8828719786</p>
            </div>
          </aside>

        </div>
      </div>
    </main>
  )
}
