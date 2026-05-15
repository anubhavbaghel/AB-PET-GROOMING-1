"use client"

import Link from 'next/link'

const pets = [
  {img: '/assets/images/pets/pet2.avif', title: 'Puppies'},
  {img: '/assets/images/pets/pet1.avif', title: 'Kittens'},
  {img: '/assets/images/pets/pet6.avif', title: 'Birds'},
  {img: '/assets/images/pets/pet7.avif', title: 'Fish'},
]

export default function PetStore(){
  return (
    <div className="container">
      <h2 className="storeTitle">Our Pets</h2>
      <p className="storeSub">Healthy, happy and adorable companions waiting for a loving home.</p>

      <div className="petGrid">
        {pets.map((p, i) => (
          <div key={i} className="petCard">
            <img src={p.img} alt={p.title} />
            <div className="petInfo">
              <h3>{p.title}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="petContact">
        <p className="contactText">Are you interested to adopt a pet?</p>
        <div className="contactBtns">
          <a href="https://wa.me/8828719786" target="_blank" className="whatsappBtn">Chat on WhatsApp</a>
          <a href="tel:+918828719786" className="callBtn">Call Now</a>
        </div>
      </div>
    </div>
  )
}
