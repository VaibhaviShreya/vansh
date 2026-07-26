import Link from 'next/link'
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube, FaWhatsapp, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary-navy text-white">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">VE</span>
              </div>
              <span className="font-bold text-xl">Vansh Enterprises</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              India's trusted supplier of premium wire and fencing solutions since 2010.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-blue transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-blue transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-blue transition-colors">
                <FaLinkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-blue transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-blue transition-colors">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-primary-blue transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-400 hover:text-primary-blue transition-colors">
                  Products
                </Link>
              </li>
              {/* <li>
                <Link href="/contact" className="text-gray-400 hover:text-primary-blue transition-colors">
                  Contact
                </Link>
              </li> */}
              <li>
                <Link href="/register" className="text-gray-400 hover:text-primary-blue transition-colors">
                  Become a Dealer
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-bold mb-4">Our Products</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products/gi-wire" className="text-gray-400 hover:text-primary-blue transition-colors">
                  GI Wire
                </Link>
              </li>
              <li>
                <Link href="/products/barbed-wire" className="text-gray-400 hover:text-primary-blue transition-colors">
                  Barbed Wire
                </Link>
              </li>
              <li>
                <Link href="/products/chain-link-fencing" className="text-gray-400 hover:text-primary-blue transition-colors">
                  Chain Link Fencing
                </Link>
              </li>
              <li>
                <Link href="/products/wire-mesh" className="text-gray-400 hover:text-primary-blue transition-colors">
                  Wire Mesh
                </Link>
              </li>
              <li>
                <Link href="/products/nails" className="text-gray-400 hover:text-primary-blue transition-colors">
                  Nails
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-primary-blue mt-1" />
                <span className="text-gray-400 text-sm">
                  123 Industrial Area,<br />
                  Mumbai, Maharashtra - 400001
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhone className="text-primary-blue" style={{ transform: 'scaleX(-1)' }} />
                <a href="tel:++916261758053" className="text-gray-400 hover:text-primary-blue transition-colors">
                  +916261758053
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-primary-blue" />
                <a href="mailto:sarthakagrawal1142@gmail.com" className="text-gray-400 hover:text-primary-blue transition-colors">
                  sarthakagrawal1142@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <FaWhatsapp className="text-green-500" />
                <a href="https://wa.me/+916261758053" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-blue transition-colors">
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} Vansh Enterprises. All rights reserved. | Designed with ❤️ in India
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer