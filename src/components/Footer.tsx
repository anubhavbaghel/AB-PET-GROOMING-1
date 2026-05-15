import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <div className="footer-brand">AB Pet Grooming</div>
          <p className="muted">Professional grooming, safe boarding & pet care services in Mumbai.</p>
        </div>

        <div className="footer-links">
          <Link href="/">Home</Link>
          <Link href="/about">About Us</Link>
          <Link href="/services">Services</Link>
          <Link href="/boarding">Boarding</Link>
          <Link href="/book-appointment">Book Appointment</Link>
          <Link href="/petstore">Pet Store</Link>
          <Link href="/contact">Contact</Link>
        </div>

        <div className="footer-links">
          <a href="tel:+918828719786">Call</a>
          <a href="https://wa.me/918828719786" target="_blank">WhatsApp</a>
          <a href="https://instagram.com/ab_pet_grooming_studio" target="_blank">Instagram</a>
        </div>
      </div>

      <div className="container footer-bottom muted">
        © {year} AB Pet Grooming. All rights reserved.
      </div>
    </footer>
  )
}
