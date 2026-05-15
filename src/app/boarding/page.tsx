"use client"

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

export default function BoardingPage(){
  const [formMsg, setFormMsg] = useState('')
  const planRef = useRef<HTMLSelectElement|null>(null)
  const petTypeRef = useRef<HTMLSelectElement|null>(null)
  const checkinRef = useRef<HTMLInputElement|null>(null)
  const checkoutRef = useRef<HTMLInputElement|null>(null)
  const qrPopupRef = useRef<HTMLDivElement|null>(null)

  useEffect(()=>{
    const ownerName = document.getElementById('owner_name') as HTMLInputElement|null
    const petName = document.getElementById('pet_name') as HTMLInputElement|null
    const breed = document.getElementById('breed') as HTMLInputElement|null
    const phone = document.getElementById('phone') as HTMLInputElement|null
    const emergencyContact = document.getElementById('emergency_contact') as HTMLInputElement|null
    const age = document.getElementById('age') as HTMLInputElement|null

    function onlyLetters(value:string){ return value.replace(/[^A-Za-z ]/g,'') }
    function onlyNumbers(value:string){ return value.replace(/[^0-9]/g,'') }

    if(ownerName) ownerName.addEventListener('input', function(){ this.value = onlyLetters(this.value).slice(0,30) })
    if(petName) petName.addEventListener('input', function(){ this.value = onlyLetters(this.value).slice(0,30) })
    if(breed) breed.addEventListener('input', function(){ this.value = onlyLetters(this.value).slice(0,30) })
    if(phone) phone.addEventListener('input', function(){ this.value = onlyNumbers(this.value).slice(0,10) })
    if(emergencyContact) emergencyContact.addEventListener('input', function(){ this.value = onlyNumbers(this.value).slice(0,10) })
    if(age) age.addEventListener('input', function(){ if(parseFloat(this.value) < 0) this.value = '' })

    const dogPlans = [
      'Day Boarding','24 Hours Boarding','Luxury Room','Playing','Giant Breed','Silver Plan','Gold Plan','Diamond Plan','Platinum Plan','Annual Plan'
    ]
    const catPlans = ['Per Day (Without Food)']

    function updatePlans(type:string){
      const sel = planRef.current
      if(!sel) return
      sel.innerHTML = ''
      const defaultOpt = document.createElement('option')
      defaultOpt.value = ''
      defaultOpt.textContent = 'Select Plan'
      sel.appendChild(defaultOpt)
      const plans = type === 'Dog' ? dogPlans : (type === 'Cat' ? catPlans : [])
      plans.forEach(p=>{
        const o = document.createElement('option')
        o.value = p
        o.textContent = p
        sel.appendChild(o)
      })
    }

    const petType = petTypeRef.current
    if(petType){
      petType.addEventListener('change', function(){ updatePlans((this as HTMLSelectElement).value) })
    }

    // date min handling
    const checkin = checkinRef.current
    const checkout = checkoutRef.current
    if(checkin && checkout){
      const today = new Date(); const pad=(n:number)=>String(n).padStart(2,'0')
      const minDate = `${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())}`
      checkin.min = minDate; checkout.min = minDate

      checkin.addEventListener('change', ()=>{
        if(checkin.value){ checkout.min = checkin.value; if(checkout.value && checkout.value < checkin.value){ checkout.value = ''; setFormMsg('Check-out date cannot be before check-in date.') } else setFormMsg('') }
      })
      checkout.addEventListener('change', ()=>{
        if(checkin.value && checkout.value && checkout.value < checkin.value){ checkout.value = ''; setFormMsg('Check-out date cannot be before check-in date.') } else setFormMsg('') }
      )
    }

    // QR popup handlers
    const onlinePayment = document.getElementById('onlinePayment') as HTMLInputElement|null
    const closeQrBtn = document.getElementById('closeQrBtn') as HTMLButtonElement|null
    const qrPopup = qrPopupRef.current
    if(onlinePayment && qrPopup){
      const onClick = ()=> qrPopup.classList.add('active')
      onlinePayment.addEventListener('click', onClick)
      if(closeQrBtn) closeQrBtn.addEventListener('click', ()=> qrPopup.classList.remove('active'))
      qrPopup.addEventListener('click', (e)=>{ if(e.target === qrPopup) qrPopup.classList.remove('active') })
    }

    return ()=>{
      // cleanup listeners (best-effort)
    }
  }, [])

  function selectPet(type:string){
    if(petTypeRef.current){ petTypeRef.current.value = type; const ev = new Event('change'); petTypeRef.current.dispatchEvent(ev); document.getElementById('boardingForm')?.scrollIntoView({behavior:'smooth'}) }
  }

  function onSubmit(e:React.FormEvent){
    e.preventDefault()
    setFormMsg('Frontend converted — backend submission pending. I will wire API later.')
  }

  return (
    <section className="boarding-page">
      <div className="boarding-container">
        <section className="boarding-hero">
          <div className="boarding-hero-content">
            <div className="hero-main-info">
              <h1>Pet Boarding</h1>
              <p>Safe, loving and hygienic boarding for dogs and cats with comfort-first care, personal attention and daily support.</p>
              <div className="hero-badges"><span className="hero-badge">Comfort First</span><span className="hero-badge">Daily Updates</span></div>
              <div className="hero-actions">
                <a href="#boardingForm" className="board-btn board-btn-primary">Book Boarding</a>
                <a href="https://wa.me/918828719786" target="_blank" className="board-btn board-btn-secondary">WhatsApp Us</a>
              </div>
            </div>

            <div className="hero-note">
              <h3>Quick Note</h3>
              <p>Vaccinated and tick-free pets only. We maintain a calm, clean and caring environment for every pet.</p>
              <div className="hero-note-pills" />
            </div>
          </div>
        </section>

        <section className="boarding-info-grid">
          <div className="info-card">
            <div className="info-card-top"><h2>AB Dog Boarding & Day Care Center</h2><p>Big on love. Big on savings. Choose the plan that fits your routine and your pet’s comfort.</p></div>
            <div className="info-card-body">
              <h3 className="info-section-title">Pricing</h3>
              <div className="price-grid">
                <div className="price-box">
                  <div className="price-row"><span>Sample Plan A</span><b>₹999</b></div>
                </div>
                <div className="price-box">
                  <div className="price-row"><span>Sample Plan B</span><b>₹1499</b></div>
                </div>
              </div>
              <h3 className="info-section-title">Included</h3>
              <div className="feature-grid">
                <div className="feature-item">Daily Video Updates</div>
                <div className="feature-item">Freshly Cooked Food</div>
                <div className="feature-item">Custom Feeding</div>
                <div className="feature-item">3 Times Daily Walk</div>
              </div>
              <div className="info-card-actions"><a href="#boardingForm" className="soft-btn">Book Boarding</a></div>
            </div>
          </div>

          <div className="info-card">
            <div className="info-card-top"><h2>AB Cat Boarding Center</h2><p>Calm, cozy and hygienic cat boarding with gentle handling and comfort-first care.</p></div>
            <div className="info-card-body">
              <h3 className="info-section-title">Pricing</h3>
              <div className="price-box" style={{marginBottom:18}}>
                <div className="price-row"><span>Per Day</span><b>₹499</b></div>
              </div>
              <h3 className="info-section-title">Included</h3>
              <div className="feature-grid">
                <div className="feature-item">Quiet & Stress-Free Space</div>
                <div className="feature-item">Clean Bedding</div>
                <div className="feature-item">Gentle Handling</div>
                <div className="feature-item">Regular Updates</div>
              </div>
              <div className="info-card-actions"><a href="#boardingForm" className="soft-btn">Book Boarding</a></div>
            </div>
          </div>
        </section>

        <section className="form-layout">
          <div className="boarding-form-card">
            <div className="form-head"><h2>Book Boarding</h2><p>Fill only the important details below. Our team will confirm your request after checking availability.</p></div>
            <form id="boardingForm" className="boarding-form" onSubmit={onSubmit}>
              <div className="form-block">
                <h3>Owner Details</h3>
                <div className="form-row">
                  <div className="form-field"><label>Owner Name *</label><input type="text" name="owner_name" id="owner_name" maxLength={30} placeholder="Enter owner name" required /></div>
                  <div className="form-field"><label>Phone Number *</label><input type="tel" name="phone" id="phone" maxLength={10} inputMode="numeric" placeholder="10-digit number" required /></div>
                </div>
                <div className="form-row">
                  <div className="form-field"><label>Email</label><input type="email" name="email" id="email" placeholder="example@gmail.com" /></div>
                  <div className="form-field"><label>City / Area</label><input type="text" name="city" id="city" maxLength={30} placeholder="Chembur, Mumbai" /></div>
                </div>
              </div>

              <div className="form-block">
                <h3>Pet Details</h3>
                <div className="form-row">
                  <div className="form-field"><label>Pet Name *</label><input type="text" name="pet_name" id="pet_name" maxLength={30} placeholder="Enter pet name" required /></div>
                  <div className="form-field"><label>Pet Type *</label>
                    <select name="pet_type" id="pet_type" ref={petTypeRef} required>
                      <option value="">Select Pet Type</option>
                      <option value="Dog">Dog</option>
                      <option value="Cat">Cat</option>
                    </select>
                  </div>
                </div>

                <div className="form-field">
                  <label>Select Plan *</label>
                  <select name="plan" id="plan" ref={planRef} required>
                    <option value="">First select pet type</option>
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-field"><label>Breed *</label><input type="text" name="breed" id="breed" maxLength={30} placeholder="Eg. Shih Tzu / Persian" required /></div>
                  <div className="form-field"><label>Age *</label><input type="number" name="age" id="age" min={0} max={30} step={0.5} placeholder="Eg. 2" required /></div>
                </div>

                <div className="form-row">
                  <div className="form-field"><label>Gender *</label><select name="gender" id="gender" required><option value="">Select Gender</option><option value="Male">Male</option><option value="Female">Female</option></select></div>
                  <div className="form-field"><label>Special Notes</label><textarea name="notes" id="notes" maxLength={150} placeholder="Medicine / allergy / food notes"></textarea></div>
                </div>
              </div>

              <div className="form-block">
                <h3>Boarding Details</h3>
                <div className="form-row">
                  <div className="form-field"><label>Boarding Type *</label><select name="boarding_type" id="boarding_type" required><option value="">Select Boarding Type</option><option value="Day Boarding">Day Boarding</option><option value="Overnight Boarding">Overnight Boarding</option></select></div>
                  <div className="form-field"><label>Emergency Contact *</label><input type="tel" name="emergency_contact" id="emergency_contact" maxLength={10} inputMode="numeric" placeholder="10-digit number" required /></div>
                </div>
                <div className="form-row">
                  <div className="form-field"><label>Check-in Date *</label><input type="date" name="checkin_date" id="checkinDate" ref={checkinRef} required /></div>
                  <div className="form-field"><label>Check-out Date *</label><input type="date" name="checkout_date" id="checkoutDate" ref={checkoutRef} required /></div>
                </div>
                <div className="form-check"><input type="checkbox" id="vaccinated" name="vaccinated_confirm" value="Yes" required /><label htmlFor="vaccinated">I confirm my pet is vaccinated and tick / parasite-free. *</label></div>
              </div>

              <div className="payment-method-section">
                <label className="payment-title">Select Payment Method</label>
                <div className="payment-options">
                  <label className="payment-card">
                    <input type="radio" name="payment_method" value="cash" defaultChecked />
                    <div className="payment-content"><h4>Cash</h4></div>
                  </label>
                  <label className="payment-card">
                    <input type="radio" name="payment_method" value="online" id="onlinePayment" />
                    <div className="payment-content"><h4>Online</h4></div>
                  </label>
                </div>
              </div>

              <div className="qr-popup-overlay" id="qrPopup" ref={qrPopupRef}>
                <div className="qr-popup-box">
                  <button type="button" className="close-qr-btn" id="closeQrBtn">×</button>
                  <img src="/assets/images/qr.avif" alt="QR Code" className="qr-popup-image" />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">Submit Booking Request</button>
                <a href="https://wa.me/918828719786" target="_blank" className="ghost-btn">WhatsApp Us</a>
              </div>

              <div className="form-msg" id="formMsg">{formMsg}</div>
            </form>
          </div>

          <aside className="boarding-side-card">
            <h3>What happens next?</h3>
            <ul>
              <li>You submit your request</li>
              <li>We call or WhatsApp to confirm the slot</li>
              <li>Final details are checked at check-in</li>
              <li>Your pet stays in a safe and loving environment</li>
            </ul>
            <div className="criteria-box"><h4>Basic Boarding Criteria</h4><ul><li>Pet should be vaccinated</li><li>Pet should be tick and parasite-free</li></ul></div>
          </aside>
        </section>
      </div>
    </section>
  )
}
