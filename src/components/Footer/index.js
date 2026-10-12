import {FaGoogle, FaTwitter, FaInstagram, FaYoutube} from 'react-icons/fa'
import './index.css'

const Footer = () => (
  <footer className="footer-container">
    <div className="icons-row">
      <button type="button" className="footer-btn">
        <FaGoogle className="footer-icon" />
      </button>
      <button type="button" className="footer-btn">
        <FaTwitter className="footer-icon" />
      </button>
      <button type="button" className="footer-btn">
        <FaInstagram className="footer-icon" />
      </button>
      <button type="button" className="footer-btn">
        <FaYoutube className="footer-icon" />
      </button>
    </div>
    <p className="contact-us-text">Contact Us</p>
  </footer>
)

export default Footer
