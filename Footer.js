export function renderFooter() {
  return `
  <footer class="footer-hero">
    <div class="footer-content">
      <div class="footer-main">
        <div class="footer-info">
          <a href="index.html" class="footer-logo" style="text-decoration:none;">
            <span data-i18n="footer_logo">AURA</span>
          </a>
          <p class="footer-description" data-i18n="footer_slogan">ss
            The future of beauty and wellness, powered by advanced AI
            technology and cutting-edge skincare science.
          </p>
          <div class="footer-social">
            <span data-i18n="footer_social_title">Follow us</span>
            <div class="social-icons">
              <a href="#" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#63435e" viewBox="0 0 256 256">
                  <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z"></path>
                </svg>
              </a>
              <a href="#" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#63435e" viewBox="0 0 256 256">
                  <path d="M214.75,211.71l-62.6-98.38,61.77-67.95a8,8,0,0,0-11.84-10.76L143.24,99.34,102.75,35.71A8,8,0,0,0,96,32H48a8,8,0,0,0-6.75,12.3l62.6,98.37-61.77,68a8,8,0,1,0,11.84,10.76l58.84-64.72,40.49,63.63A8,8,0,0,0,160,224h48a8,8,0,0,0,6.75-12.29ZM164.39,208,62.57,48h29L193.43,208Z"></path>
                </svg>
              </a>
              <a href="#" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill="#63435e" viewBox="0 0 256 256">
                  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm8,191.63V152h24a8,8,0,0,0,0-16H136V112a16,16,0,0,1,16-16h16a8,8,0,0,0,0-16H152a32,32,0,0,0-32,32v24H96a8,8,0,0,0,0,16h24v63.63a88,88,0,1,1,16,0Z"></path>
                </svg>
              </a>
              <a href="#" aria-label="YouTube">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#63435e" viewBox="0 0 256 256">
                  <path d="M164.44,121.34l-48-32A8,8,0,0,0,104,96v64a8,8,0,0,0,12.44,6.66l48-32a8,8,0,0,0,0-13.32ZM120,145.05V111l25.58,17ZM234.33,69.52a24,24,0,0,0-14.49-16.4C185.56,39.88,131,40,128,40s-57.56-.12-91.84,13.12a24,24,0,0,0-14.49,16.4C19.08,79.5,16,97.74,16,128s3.08,48.5,5.67,58.48a24,24,0,0,0,14.49,16.41C69,215.56,120.4,216,127.34,216h1.32c6.94,0,58.37-.44,91.18-13.11a24,24,0,0,0,14.49-16.41c2.59-10,5.67-28.22,5.67-58.48S236.92,79.5,234.33,69.52Zm-15.49,113a8,8,0,0,1-4.77,5.49c-31.65,12.22-85.48,12-86,12H128c-.54,0-54.33.2-86-12a8,8,0,0,1-4.77-5.49C34.8,173.39,32,156.57,32,128s2.8-45.39,5.16-54.47A8,8,0,0,1,41.93,68c30.52-11.79,81.66-12,85.85-12h.27c.54,0,54.38-.18,86,12a8,8,0,0,1,4.77,5.49C221.2,82.61,224,99.43,224,128S221.2,173.39,218.84,182.47Z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <nav class="footer-menu">
          <div class="footer-column">
            <h3 data-i18n="footer_menu_title_1">Company</h3>
            <ul>
              <li><a href="Products Page.html" data-i18n="footer_menu_link_home">All Products</a></li>
              <li><a href="AI Analysis Page.html" data-i18n="footer_menu_link_about">AI Analysis</a></li>
              <li><a href="Skincare Quiz Page.html" data-i18n="footer_menu_link_products">Skincare Quiz</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h3 data-i18n="footer_menu_title_2">Resources</h3>
            <ul>
              <li><a href="About Page.html" data-i18n="footer_menu_link_reviews">About Us</a></li>
              <li><a href="Blog Page.html" data-i18n="footer_menu_link_faq">Blog</a></li>
              <li><a href="Reviews Page.html" data-i18n="footer_menu_link_support">Reviews</a></li>
            </ul>
          </div>
          <div class="footer-column final">
            <h3 data-i18n="footer_menu_title_3">Help</h3>
            <ul>
              <li><a href="Contact Page.html" data-i18n="footer_menu_link_contact">Contact Us</a></li>
              <li><a href="Profile Page.html" data-i18n="footer_menu_link_terms">My Acount</a></li>
              <li>
                <a href="#" id="footer-cart-link" data-i18n="footer_menu_link_privacy">Shopping Cart</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <hr class="footer-divider" />
      <div class="footer-bottom">
        <span class="copyright" data-i18n="footer_copyright">
          © 2025 AURA. All rights reserved.
        </span>
        <div class="legal-links">
          <a href="terms.html" data-i18n="footer_legal_terms">Terms</a>
          <a href="privacy.html" data-i18n="footer_legal_privacy">Privacy</a>
          <a href="cookies.html" data-i18n="footer_legal_cookies">Cookies</a>
        </div>
      </div>
    </div>
  </footer>
  `;
}
