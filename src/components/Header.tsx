import Link from 'next/link'

export default function Header() {
  return (
    <header className="site-header">
      <div className="container nav-inner">
        <a className="brand" href="#">
          <img src="/assets/images/logo.avif" alt="Logo" className="logo" />
          <span>AB Pet Grooming Store</span>
        </a>

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
    </header>
  )
}
