import Link from "next/link";
import { MapPin, Phone, Mail, ChevronRight } from "lucide-react";

const WhatsAppIcon = ({
  size = 24,
  className,
}: {
  size?: number | string;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.021-.967-.263-.099-.455-.149-.648.149-.193.297-.765.967-.936 1.166-.171.198-.342.223-.639.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.648-1.564-.888-2.141-.233-.564-.469-.487-.648-.497-.171-.008-.368-.009-.565-.009-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const InstagramIcon = ({
  size = 20,
  className,
}: {
  size?: number | string;
  className?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="#ffffff"
    width={size}
    height={size}
    viewBox="0 0 256 256"
    id="Flat"
  >
    <path d="M128,84a44,44,0,1,0,44,44A44.04978,44.04978,0,0,0,128,84Zm0,80a36,36,0,1,1,36-36A36.04061,36.04061,0,0,1,128,164ZM172,32H84A52.059,52.059,0,0,0,32,84v88a52.059,52.059,0,0,0,52,52h88a52.059,52.059,0,0,0,52-52V84A52.059,52.059,0,0,0,172,32Zm44,140a44.04978,44.04978,0,0,1-44,44H84a44.04978,44.04978,0,0,1-44-44V84A44.04978,44.04978,0,0,1,84,40h88a44.04978,44.04978,0,0,1,44,44ZM188,76a8,8,0,1,1-8-8A8.00917,8.00917,0,0,1,188,76Z" />
  </svg>
);

const FacebookIcon = ({
  size = 20,
  className,
}: {
  size?: number | string;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.406.593 24 1.325 24H12.82v-9.294H9.692V11.01h3.127V8.413c0-3.1 1.893-4.788 4.658-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.313h3.587l-.467 3.696h-3.12V24h6.116C23.407 24 24 23.406 24 22.676V1.325C24 .593 23.407 0 22.675 0z" />
  </svg>
);

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Column 1: Brand */}
          <div className="footer-col">
            <Link href="/" className="footer-brand-name">
              <img src="/assets/images/logo.avif" alt="AB Pet Grooming" />
              <span>AB Pet Grooming</span>
            </Link>
            <p className="footer-desc">
              Providing professional, gentle, and stress-free grooming,
              boarding, and pet care services in Mumbai. Your pet's happiness is
              our priority.
            </p>
            <div className="footer-socials">
              <a
                href="https://instagram.com/ab_pet_grooming_studio"
                target="_blank"
                rel="noreferrer"
                className="footer-social-btn"
                aria-label="Instagram"
              >
                <InstagramIcon size={20} />
              </a>
              <a
                href="https://wa.me/918828719786"
                target="_blank"
                rel="noreferrer"
                className="footer-social-btn"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon size={20} />
              </a>
              <a
                href="https://facebook.com/ab_pet_grooming_studio"
                target="_blank"
                rel="noreferrer"
                className="footer-social-btn"
                aria-label="Facebook"
              >
                <FacebookIcon size={20} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col">
            <h3>Quick Links</h3>
            <ul className="footer-links-list">
              <li>
                <Link href="/">
                  <ChevronRight size={18} color="#c084fc" /> Home
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <ChevronRight size={18} color="#c084fc" /> About Us
                </Link>
              </li>
              <li>
                <Link href="/services">
                  <ChevronRight size={18} color="#c084fc" /> Services
                </Link>
              </li>
              <li>
                <Link href="/boarding">
                  <ChevronRight size={18} color="#c084fc" /> Boarding
                </Link>
              </li>
              <li>
                <Link href="/petstore">
                  <ChevronRight size={18} color="#c084fc" /> Pet Store
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="footer-col">
            <h3>Our Services</h3>
            <ul className="footer-links-list">
              <li>
                <Link href="/book-appointment">
                  <ChevronRight size={18} color="#c084fc" /> Dog Grooming
                </Link>
              </li>
              <li>
                <Link href="/book-appointment">
                  <ChevronRight size={18} color="#c084fc" /> Cat Grooming
                </Link>
              </li>
              <li>
                <Link href="/book-appointment">
                  <ChevronRight size={18} color="#c084fc" /> Spa Packages
                </Link>
              </li>
              <li>
                <Link href="/book-appointment">
                  <ChevronRight size={18} color="#c084fc" /> Pet Boarding
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <ChevronRight size={18} color="#c084fc" /> Consultation
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="footer-col">
            <h3>Get in Touch</h3>
            <div className="footer-contact-item">
              <MapPin className="footer-contact-icon" />
              <div>
                <strong>Location</strong>
                Mumbai, Maharashtra, India
              </div>
            </div>
            <div className="footer-contact-item">
              <Phone className="footer-contact-icon" />
              <div>
                <strong>Phone</strong>
                <a
                  href="tel:+918828719786"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  +91 88287 19786
                </a>
              </div>
            </div>
            <div className="footer-contact-item">
              <Mail className="footer-contact-icon" />
              <div>
                <strong>Email</strong>
                <a
                  href="mailto:hello@abpetgrooming.com"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  hello@abpetgrooming.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <div className="footer-copy">
            &copy; {year} AB Pet Grooming. All rights reserved.
          </div>
          <div className="footer-legal-links">
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms of Service</Link>
            <Link href="#">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
