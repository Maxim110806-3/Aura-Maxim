import { updateCartBadge, setupCartIcon, loadCart } from "./CartComponent.js";
import { renderFooter } from "./Footer.js";

export { setSiteLanguage, moveUserActionsToMenu };
export function renderMenu() {
  return `
  <header class="hero-menu">
    <div class="menu-container">
      <div class="menu-background"></div>
      <nav class="main-nav">
        <div class="logo-menu">
          <div class="logo">
            <a href="index.html" style="text-decoration:none; color:inherit;">
              <h1 data-i18n="footer_logo">AURA</h1>
            </a>
          </div>
        </div>
        <button class="menu-toggle" aria-label="Open menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul class="menu">
          <li><a href="index.html" data-i18n="menu_home">Home</a></li>
          <li><a href="Products Page.html" data-i18n="menu_products">Products</a></li>
          <li><a href="AI Analysis Page.html" data-i18n="menu_ai_analysis">AI Analysis</a></li>
          <li><a href="Skincare Quiz Page.html" data-i18n="menu_skincare_quiz">Skincare Quiz</a></li>
          <li><a href="Blog Page.html" data-i18n="menu_blog">Blog</a></li>
          <li><a href="Reviews Page.html" data-i18n="menu_reviews">Reviews</a></li>
        </ul>
        <div class="user-actions">
          <button aria-label="Search" class="icon-button search-toggle">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="#63435e" viewBox="0 0 256 256">
              <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
            </svg>
          </button>
          <input type="text" class="search-bar" placeholder="Search..." style="display:none;" />
          <button aria-label="User account" class="icon-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="#63435e" viewBox="0 0 256 256">
              <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
            </svg>
          </button>
          <button aria-label="Shopping bag" class="icon-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="#63435e" viewBox="0 0 256 256">
              <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V72H40V56Zm0,144H40V88H216V200Zm-40-88a48,48,0,0,1-96,0,8,8,0,0,1,16,0,32,32,0,0,0,64,0,8,8,0,0,1,16,0Z"></path>
            </svg>
            <span class="cart-badge"></span>
          </button>
          <div class="lang-switcher">
            <button class="lang-btn" aria-label="Change language">
              <img src="https://flagcdn.com/24x18/gb.png" alt="English" />
              <span class="lang-arrow">&#9662;</span>
            </button>
            <div class="lang-dropdown">
              <button class="lang-option" data-lang="en">
                <img src="https://flagcdn.com/24x18/gb.png" alt="English" /> English
              </button>
              <button class="lang-option" data-lang="ro">
                <img src="https://flagcdn.com/24x18/ro.png" alt="Română" /> Română
              </button>
              <button class="lang-option" data-lang="ru">
                <img src="https://flagcdn.com/24x18/ru.png" alt="Русский" /> Русский
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </header>
  `;
}

setTimeout(() => {
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".menu");
  if (toggle && menu) {
    toggle.onclick = () => {
      menu.classList.toggle("open");
      setTimeout(() => {
        updateCartBadge();
        setupCartIcon();
      }, 0);
    };
    // Închide meniul la click pe link
    menu.querySelectorAll("a").forEach((link) => {
      link.onclick = () => menu.classList.remove("open");
    });
  }

  // Language dropdown logic
  document.querySelectorAll(".lang-switcher").forEach((switcher) => {
    const btn = switcher.querySelector(".lang-btn");
    const dropdown = switcher.querySelector(".lang-dropdown");
    btn.onclick = (e) => {
      e.stopPropagation();
      switcher.classList.toggle("open");
    };
    dropdown.querySelectorAll(".lang-option").forEach((opt) => {
      opt.onclick = (e) => {
        e.preventDefault();
        const lang = opt.getAttribute("data-lang");
        setSiteLanguage(lang);
        document
          .querySelectorAll(".lang-switcher")
          .forEach((s) => s.classList.remove("open"));
      };
    });
  });
  // Închide dropdown la click în afara lui
  document.addEventListener("click", () => {
    document
      .querySelectorAll(".lang-switcher.open")
      .forEach((s) => s.classList.remove("open"));
  });

  // Search bar animation & live search
  const searchToggle = document.querySelector(".search-toggle");
  const searchBar = document.querySelector(".search-bar");
  if (searchToggle && searchBar) {
    searchToggle.onclick = (e) => {
      e.stopPropagation();
      searchBar.classList.toggle("active");
      if (searchBar.classList.contains("active")) {
        searchBar.focus();
      } else {
        searchBar.value = "";
        // Remove highlights if any
        document.querySelectorAll(".search-highlight").forEach((el) => {
          el.classList.remove("search-highlight");
        });
      }
    };

    // Hide search bar when clicking outside
    document.addEventListener("click", (e) => {
      if (
        searchBar.classList.contains("active") &&
        !searchBar.contains(e.target) &&
        !searchToggle.contains(e.target)
      ) {
        searchBar.classList.remove("active");
        searchBar.value = "";
        document.querySelectorAll(".search-highlight").forEach((el) => {
          el.classList.remove("search-highlight");
        });
      }
    });

    // Live search highlight
    searchBar.addEventListener("input", function () {
      // Remove old highlights
      document.querySelectorAll(".search-highlight").forEach((el) => {
        el.classList.remove("search-highlight");
      });
      const val = this.value.trim().toLowerCase();
      if (!val) return;
      // Highlight all text nodes containing the search term
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (
          node.parentNode &&
          node.nodeValue.toLowerCase().includes(val) &&
          !["SCRIPT", "STYLE"].includes(node.parentNode.nodeName)
        ) {
          const span = document.createElement("span");
          span.className = "search-highlight";
          span.style.background = "#ffe7fa";
          span.style.color = "#63435e";
          span.textContent = node.nodeValue;
          node.parentNode.replaceChild(span, node);
        }
      }
    });
  }
}, 0);

const translations = {
  en: {
    hero_title: "The Future of Beauty & Wellness",
    hero_description:
      "Experience an AI-powered journey through personalized skincare, health monitoring, and self-care routines designed specifically for you",
    btn_journey: "Begin Your Journey →",
    btn_explore: "Explore Products",
    gallery_title: "Holographic Product Gallery",
    gallery_description:
      "Explore our cutting-edge products through interactive 3D displays. Rotate, zoom, and discover the future of beauty technology",
    view_details: "View Details",
    add_to_cart: "Add to cart",
    routine_title: "Interactive Routine Builder",
    routine_description:
      "Discover your perfect skincare sequence with our AI-powered routine builder. Personalized steps based on your skin's unique needs.",
    morning: "Morning",
    evening: "Evening",
    cleanse: "Cleanse",
    cleanse_duration: "1 min",
    tone: "Tone",
    tone_duration: "30 sec",
    serum: "Serum",
    serum_duration: "1 min",
    moisturize: "Moisturize",
    moisturize_duration: "1 min",
    ai_title: "Smart AI Recommendations",
    ai_description:
      "Our advanced AI analyzes your skin profile and lifestyle to create personalized recommendations that adapt to your changing needs",
    profile_title: "Your Skin Profile",
    skin_type: "SKIN TYPE",
    dry: "Dry",
    oily: "Oily",
    combination: "Combination",
    normal: "Normal",
    sensitive: "Sensitive",
    skin_concerns: "SKIN CONCERNS",
    dryness: "Dryness",
    fine_lines: "Fine Lines",
    sensitivity: "Sensitivity",
    acne: "Acne",
    hyperpigmentation: "Hyperpigmentation",
    rosacea: "Rosacea",
    update_profile: "Update Profile",
    ai_insights: "AI Insights",
    skin_analysis: "Skin Analysis",
    analysis_description:
      "Based on your combination skin type with hyperpigmentation and fine lines concerns, our AI suggests focusing on gentle exfoliation and targeted treatments.",
    recommended_ingredients: "Recommended Ingredients",
    niacinamide: "Niacinamide",
    vitamin_c: "Vitamin C",
    hyaluronic_acid: "Hyaluronic Acid",
    retinol: "Retinol",
    peptides: "Peptides",
    custom_formula: "Custom Formula",
    create_formula: "Tap to create your custom formula",
    get_full_analysis: "Get Full AI Analysis",
    // MENU
    menu_home: "Home",
    menu_products: "Products",
    menu_ai_analysis: "AI Analysis",
    menu_skincare_quiz: "Skincare Quiz",
    menu_blog: "Blog",
    menu_reviews: "Reviews",
    menu_login: "Login",
    menu_logout: "Logout",
    menu_account: "Account",
    menu_cart: "Cart",
    menu_language: "Language",
    // AI Analysis
    ai_analysis_title: "AI Skin Analysis",
    ai_analysis_subtitle:
      "Get a personalized skin analysis using our advanced AI technology",
    ai_analysis_upload_title: "Upload Your Photo",
    ai_analysis_upload_desc:
      "Take or upload a clear, well-lit photo of your face for the most accurate analysis",
    ai_analysis_upload_btn: "Click to upload or drag and drop",

    // Products
    currency_price: "€",
    products_title: "Our products",
    products_description:
      "Discover our collection of AI-powered skincare solutions",
    products_search_placeholder: "Search products...",
    products_categories: "Categories",
    products_brands: "Brands",
    products_countries: "Countries",
    products_reset: "Reset All",
    products_all_products: "All Products",
    products_all_brands: "All brands",
    products_all_countries: "All Countries",
    products_cleansers: "Cleansers",
    products_serums: "Serums",
    products_moisturizers: "Moisturizers",
    products_masks: "Masks",
    products_treatments: "Treatments",
    products_moldova: "Moldova",
    products_romania: "Romania",
    products_france: "France",
    products_italy: "Italy",
    products_usa: "USA",
    products_maybelline: "Maybelline",
    products_loreal: "L'Oréal",
    products_nyx: "NYX",
    products_mac: "MAC",
    products_act: "Act+",
    products_daily_hydro_serum: "Daily Hydro Serum",
    products_daily_hydro_shampoo: "Clarifying Hard Water Shampoo",
    products_daily_hydro_masks: "Fulvic Acid Volumizing Dry Shampoo",

    // Details
    product_details: "Details",
    product_price: "Price",
    product_category: "Category",
    product_country: "Country",
    product_brand: "Brand",
    product_description_placeholder:
      "Lightweight, daily leave-on scalp serum formulated to deliver multi-level hydration to relieve dry scalp + optimize scalp health.",
    product_description_placeholder_shampoo:
      "A gentle clarifying shampoo designed to detox the hair + scalp from hard water minerals, contaminants, and product buildup while boosting hydration, shine, and volume—never stripping.",
    product_description_placeholder_masks:
      "Our Dry Shampoo is formulated with only plant based ingredients, such as Organic Rice + Tapioca Powder to absorb excess oil and odor while supporting the scalp microbiome.",
    product_rating_label: "Your rating:",
    product_review_placeholder: "Write your review...",
    product_review_send: "Send",
    // Footer
    footer_logo: "AURA",
    footer_slogan:
      "The future of beauty and wellness, powered by advanced AI technology and cutting-edge skincare science.",
    footer_social_title: "Follow us",
    footer_menu_title_1: "Company",
    footer_menu_title_2: "Resources",
    footer_menu_title_3: "Help",
    footer_menu_link_home: "All Products",
    footer_menu_link_about: "AI Analysis",
    footer_menu_link_products: "Skincare Quiz",
    footer_menu_link_blog: "Blog",
    footer_menu_link_reviews: "About Us",
    footer_menu_link_faq: "Blog",
    footer_menu_link_support: "Reviews",
    footer_menu_link_contact: "Contact Us",
    footer_menu_link_terms: "My Account",
    footer_menu_link_privacy: "Shopping Cart",
    footer_copyright: "© 2025 AURA. All rights reserved.",
    footer_legal_terms: "Terms",
    footer_legal_privacy: "Privacy",
    footer_legal_cookies: "Cookies",

    // CART
    cart_title: "Your Cart",
    cart_empty: "Your cart is empty.",
    cart_remove: "Remove",
    cart_order_summary: "Order Summary",
    cart_subtotal: "SubTotal",
    cart_shipping: "Shipping",
    cart_shipping_free: "Free",
    cart_total: "Total",
    cart_checkout: "Checkout",

    //CHECKOUT
    checkout_title: "Pay with card",
    checkout_secure: "Secure connection",
    checkout_email: "Email",
    checkout_card_info: "Card Information",
    checkout_card_placeholder: "1234 1234 1234 1234",
    checkout_expiry_placeholder: "MM/YY",
    checkout_cvc_placeholder: "CVC",
    checkout_cardholder: "Cardholder name",
    checkout_cardholder_placeholder: "Full name on card",
    checkout_country: "Country or region",
    checkout_country_md: "Moldova",
    checkout_country_ro: "Romania",
    checkout_country_fr: "France",
    checkout_country_it: "Italy",
    checkout_country_us: "USA",
    checkout_save_payment: "Save my payment information for future purchases",
    checkout_save_card_label: "Set a name for this card",
    checkout_save_card_placeholder: "e.g. My Visa",
    checkout_pay: "Pay",

    //BLOG
    blog_products_title: "Our products",
    blog_products_subtitle:
      "Discover our collection of AI-powered skincare solutions",
    blog_card_category: "Skincare Science",
    blog_card_title: "Understanding the Science of Skin Aging",
    blog_card_desc:
      "Discover the latest research on skin aging and how to combat its effects naturally.",
    blog_card_btn: "Subscribe for more",

    // Reviews
    reviews_title: "Customer Reviews",
    reviews_subtitle:
      "See what our community has to say about their AURA experience",
    reviews_filter_all: "All Reviews",
    reviews_filter_verified: "Verified Purchases",
    reviews_filter_5stars: "5 Stars Reviews",
    reviews_loadmore_btn: "Load More Reviews",
    review_verified: "Verified Purchase",
    review_reply: "Reply",
    review_submit: "Submit",
    review_reply_placeholder: "Write a reply...",
    review_no_reviews: "No reviews yet.",
    review_time_seconds: "a few seconds ago",
    review_time_minute: "a minute ago",
    review_time_minutes: "{x} minutes ago",
    review_time_hour: "an hour ago",
    review_time_hours: "{x} hours ago",
    review_time_day: "a day ago",
    review_time_days: "{x} days ago",

    //About Us
    about_title: "About Aura",
    about_subtitle:
      "Revolutionizing beauty and wellness through the power of AI and advanced skincare science",
    about_story_title: "Our Story",
    about_story_p1:
      "Founded with a vision to merge cutting-edge technology with advanced skincare science, AURA represents the future of personalized beauty and wellness.",
    about_story_p2:
      "Our team of experts combines AI-driven analysis with proven skincare ingredients to create truly personalized solutions for every individual's unique needs.",
    about_feature_innovation_title: "Innovation",
    about_feature_innovation_desc:
      "Pushing the boundaries of what's possible in skincare through AI",
    about_feature_quality_title: "Quality",
    about_feature_quality_desc:
      "Premium ingredients and rigorous testing for optimal results",
    about_feature_intelligence_title: "Intelligence",
    about_feature_intelligence_desc:
      "Smart technology that learns and adapts to your unique needs",
    about_feature_sustainability_title: "Sustainability",
    about_feature_sustainability_desc:
      "Eco-conscious practices and responsible sourcing",

    // Contact
    contact_title: "Contact Us",
    contact_subtitle:
      "Have questions? We’re here to help and would love to hear from you",
    contact_form_title: "Get in Touch",
    contact_label_name: "Name",
    contact_label_email: "Email",
    contact_label_message: "Message",
    contact_placeholder_name: "Your Name",
    contact_placeholder_email: "your@email.com",
    contact_placeholder_message: "How can we help?",
    contact_btn_send: "Send Message",
    contact_toast_success: "Email sent successfully!",
    contact_info_email_title: "Email Us",
    contact_info_email_btn: "Email",
    contact_info_call_title: "Call Us",
    contact_info_call_btn: "Call",
    contact_info_chat_title: "Live Chat",
    contact_info_chat_btn: "Chat",
    contact_info_email_desc: "support@aura.com",
    contact_info_call_desc: "+1 (555) 123-4567",
    contact_info_chat_desc: "Available 24/7",
    chat_header_title: "Chat with us!",
    chat_support_hello: "Hello, how can I help you?",
    chat_support_wait: "One moment, I'm calling a real man to respond you.",
    chat_input_placeholder: "Message",

    // Sign Up
    signup_logo: "AURA",
    signup_login_title: "Login to your beauty!",
    signup_login_btn: "Login",
    signup_title: "Sign Up",
    signup_first_name: "First Name",
    signup_last_name: "Last Name",
    signup_email: "Email",
    signup_password: "Password",
    signup_confirm_password: "Confirm Password",
    signup_continue_btn: "Continue",
    signup_error: "There was an error. Please try again.",
    signup_or: "Or continue with",
    signup_google: "Google",
    signup_facebook: "Facebook",
    signup_terms: "Prin înregistrare ești de acord cu {terms}",
    signup_success: "Account created successfully!",
    // Login
    login_title: "Login",
    login_email: "Email",
    login_password: "Password",
    login_continue_btn: "Continue",
    login_no_account: "Don't have an account?",
    login_create_account: "Create account",
    login_or: "Or continue with",
    login_google: "Google",
    login_facebook: "Facebook",
    login_terms: "By registering you agree to {terms}",
    login_success: "Login successful!",

    // Profile
    profile_welcome: "Welcome back,",
    profile_desc: "Manage your account and preferences",
    profile_settings_title: "Account Settings",
    profile_settings_profile: "Edit Profile",
    profile_settings_preferences: "Preferences",
    profile_settings_saved: "Saved Items",
    profile_settings_orders: "Order History",
    profile_settings_logout: "Logout",
    profile_skin_title: "Skin Profile",
    profile_skin_type: "Skin type",
    profile_skin_concerns: "Concerns",
    profile_skin_sensitivity: "Sensitivity",
    profile_skin_value_combination: "Combination",
    profile_skin_value_hydration_texture: "Hydration,Texture",
    profile_skin_value_moderate: "Moderate",
    profile_sub_title: "Subscription",
    profile_sub_status: "Active Premium Membership",
    profile_sub_btn: "Manage Subscription",
    profile_preferences_title: "Preferences",
    preferences_light_mode: "Light Mode",
    preferences_dark_mode: "Dark Mode",
    preferences_delete_account: "Delete Account",

    // Subscription
    sub_basic_title: "Nude Glow (Basic)",
    sub_basic_feat1: "✔ 3 product samples (skincare or make-up)",
    sub_basic_feat2: "✔ Access to AI Analysis 3 times a day",
    sub_basic_feat3: "✔ 5% discount on all orders",
    sub_basic_feat4: "✔ Discount code -10% if you invite a friend",
    sub_basic_feat5: "✔ Free standard shipping on orders over €150",
    sub_basic_feat6: "✖ Priority access to new product launches",
    sub_basic_feat7: "✖ Access to 1 professional video tutorial/month",
    sub_basic_feat8: "✖ Access to monthly educational articles",
    sub_basic_feat9: "✖ Anniversary birthday gift box (full-size, luxury)",
    sub_basic_feat10: "✖ Badge digital “Diva Elite”",
    sub_basic_price: "9.99 EUR",
    sub_gold_title: "Rosy Blush (Gold)",
    sub_gold_feat1: "✔ 3 product deluxe",
    sub_gold_feat2: "✔ Access to AI Analysis 25 times a day",
    sub_gold_feat3: "✔ 15% discount on all orders",
    sub_gold_feat4: "✔ Discount code -20% if you invite a friend",
    sub_gold_feat5: "✔ Free standard shipping on orders over €50",
    sub_gold_feat6: "✔ Priority access to new product launches",
    sub_gold_feat7: "✔ Access to 1 professional video tutorial/month",
    sub_gold_feat8: "✔ Access to monthly educational articles",
    sub_gold_feat9: "✖ Anniversary birthday gift box (full-size, luxury)",
    sub_gold_feat10: "✖ Badge digital “Diva Elite”",
    sub_gold_price: "19.99 EUR",
    sub_elite_title: "Glam Diva (Elite)",
    sub_elite_feat1: "✔ 3 product limited edition",
    sub_elite_feat2: "✔ Unlimited access to AI Analysis",
    sub_elite_feat3: "✔ 25% discount on all orders",
    sub_elite_feat4: "✔ Discount code -30% if you invite a friend",
    sub_elite_feat5: "✔ Free standard shipping on orders over €0",
    sub_elite_feat6: "✔ Priority access to new product luxury launches",
    sub_elite_feat7: "✔ Access to 5 professional video tutorial/month",
    sub_elite_feat8: "✔ Access to weekly educational articles",
    sub_elite_feat9: "✔ Anniversary birthday gift box (full-size, luxury)",
    sub_elite_feat10: "✔ Badge digital “Diva Elite”",
    sub_elite_price: "34.99 EUR",
    sub_btn: "Subscribe",

    // Edit Profile
    edit_profile_title: "Edit Profile",
    edit_profile_firstname: "First name",
    edit_profile_lastname: "Last name",
    edit_profile_email: "Email",
    edit_profile_password: "Password",
    edit_profile_confirmpass: "Confirm Password",
    edit_profile_update: "Update Profile",
  },
  ro: {
    hero_title: "Viitorul frumuseții & al stării de bine",
    hero_description:
      "Experimentează o călătorie personalizată cu ajutorul inteligenței artificiale pentru îngrijirea pielii, monitorizarea sănătății și rutine de self-care create special pentru tine",
    btn_journey: "Începe călătoria →",
    btn_explore: "Vezi produsele",
    gallery_title: "Galerie Holografică de Produse",
    gallery_description:
      "Explorează produsele noastre de ultimă generație prin afișaje 3D interactive. Rotește, mărește și descoperă viitorul tehnologiei de frumusețe",
    view_details: "Vezi detalii",
    add_to_cart: "Adaugă în coș",
    routine_title: "Constructor Interactiv de Rutine",
    routine_description:
      "Descoperă rutina perfectă de îngrijire cu ajutorul AI. Pași personalizați în funcție de nevoile pielii tale.",
    morning: "Dimineața",
    evening: "Seara",
    cleanse: "Curățare",
    cleanse_duration: "1 min",
    tone: "Tonifiere",
    tone_duration: "30 sec",
    serum: "Ser",
    serum_duration: "1 min",
    moisturize: "Hidratare",
    moisturize_duration: "1 min",
    ai_title: "Recomandări AI inteligente",
    ai_description:
      "AI-ul nostru avansat analizează profilul pielii și stilul tău de viață pentru a crea recomandări personalizate care se adaptează nevoilor tale",
    profile_title: "Profilul tău de piele",
    skin_type: "TIP DE PIELE",
    dry: "Uscată",
    oily: "Grasă",
    combination: "Mixtă",
    normal: "Normală",
    sensitive: "Sensibilă",
    skin_concerns: "PROBLEME ALE PIELII",
    dryness: "Uscăciune",
    fine_lines: "Linii fine",
    sensitivity: "Sensibilitate",
    acne: "Acnee",
    hyperpigmentation: "Hiperpigmentare",
    rosacea: "Roșeață",
    update_profile: "Actualizează profilul",
    ai_insights: "Informații AI",
    skin_analysis: "Analiză a pielii",
    analysis_description:
      "Pe baza tipului tău de piele mixtă cu probleme de hiperpigmentare și linii fine, AI-ul nostru recomandă exfoliere blândă și tratamente țintite.",
    recommended_ingredients: "Ingrediente recomandate",
    niacinamide: "Niacinamidă",
    vitamin_c: "Vitamina C",
    hyaluronic_acid: "Acid hialuronic",
    retinol: "Retinol",
    peptides: "Peptide",
    custom_formula: "Formulă personalizată",
    create_formula: "Apasă pentru a crea formula ta personalizată",
    get_full_analysis: "Vezi analiza AI completă",
    menu_products: "Produse",
    menu_ai_analysis: "Analiză AI",
    menu_skincare_quiz: "Quiz Îngrijire",
    menu_blog: "Blog",
    menu_reviews: "Recenzii",
    // MENU
    menu_home: "Acasă",
    menu_products: "Produse",
    menu_ai_analysis: "Analiză AI",
    menu_skincare_quiz: "Quiz Îngrijire",
    menu_blog: "Blog",
    menu_reviews: "Recenzii",
    menu_login: "Autentificare",
    menu_logout: "Deconectare",
    menu_account: "Cont",
    menu_cart: "Coș",
    menu_language: "Limba",
    // AI Analysis
    ai_analysis_title: "Analiză AI a pielii",
    ai_analysis_subtitle:
      "Obține o analiză personalizată a pielii folosind tehnologia noastră AI avansată",
    ai_analysis_upload_title: "Încarcă o fotografie",
    ai_analysis_upload_desc:
      "Fă sau încarcă o fotografie clară, bine luminată a feței tale pentru cea mai precisă analiză",
    ai_analysis_upload_btn: "Apasă pentru a încărca sau trage fișierul aici",

    // Products
    currency_price: "lei",
    products_title: "Produsele noastre",
    products_description:
      "Descoperă colecția noastră de soluții AI pentru îngrijirea pielii",
    products_categories: "Categorii",
    products_brands: "Branduri",
    products_countries: "Țări",
    products_reset: "Resetează tot",
    products_all_products: "Toate produsele",
    products_all_brands: "Toate brandurile",
    products_all_countries: "Toate țările",
    products_cleansers: "Demachiante",
    products_serums: "Seruri",
    products_moisturizers: "Hidratante",
    products_masks: "Măști",
    products_treatments: "Tratamente",
    products_moldova: "Moldova",
    products_romania: "România",
    products_france: "Franța",
    products_italy: "Italia",
    products_usa: "SUA",
    products_maybelline: "Maybelline",
    products_loreal: "L'Oréal",
    products_nyx: "NYX",
    products_mac: "MAC",
    products_act: "Act+",
    products_daily_hydro_serum: "Ser Hidro Zilnic",
    products_daily_hydro_shampoo: "Șampon Clarifiant pentru Apă Dură",
    products_daily_hydro_masks: "Șampon uscat cu acid fulvic pentru volum",

    // FOOTER
    footer_logo: "AURA",
    footer_slogan:
      "Viitorul frumuseții și al stării de bine, alimentat de tehnologie AI avansată și știință de ultimă oră în îngrijirea pielii.",
    footer_social_title: "Urmărește-ne",
    footer_menu_title_1: "Companie",
    footer_menu_title_2: "Resurse",
    footer_menu_title_3: "Ajutor",
    footer_menu_link_home: "Toate produsele",
    footer_menu_link_about: "Analiză AI",
    footer_menu_link_products: "Quiz Îngrijire",
    footer_menu_link_blog: "Blog",
    footer_menu_link_reviews: "Despre noi",
    footer_menu_link_faq: "Blog",
    footer_menu_link_support: "Recenzii",
    footer_menu_link_contact: "Contact",
    footer_menu_link_terms: "Contul meu",
    footer_menu_link_privacy: "Coș cumpărături",
    footer_copyright: "© 2025 AURA. Toate drepturile rezervate.",
    footer_legal_terms: "Termeni",
    footer_legal_privacy: "Confidențialitate",
    footer_legal_cookies: "Cookie-uri",

    // CART
    cart_title: "Coșul tău",
    cart_empty: "Coșul este gol.",
    cart_remove: "Șterge",
    cart_order_summary: "Sumar comandă",
    cart_subtotal: "Subtotal",
    cart_shipping: "Livrare",
    cart_shipping_free: "Gratuit",
    cart_total: "Total",
    cart_checkout: "Finalizare",

    //CHECKOUT
    checkout_title: "Plătește cu cardul",
    checkout_secure: "Conexiune securizată",
    checkout_email: "Email",
    checkout_card_info: "Informații card",
    checkout_card_placeholder: "1234 1234 1234 1234",
    checkout_expiry_placeholder: "LL/AA",
    checkout_cvc_placeholder: "CVC",
    checkout_cardholder: "Nume pe card",
    checkout_cardholder_placeholder: "Numele complet de pe card",
    checkout_country: "Țara sau regiunea",
    checkout_country_md: "Moldova",
    checkout_country_ro: "România",
    checkout_country_fr: "Franța",
    checkout_country_it: "Italia",
    checkout_country_us: "SUA",
    checkout_save_payment:
      "Salvează informațiile de plată pentru cumpărături viitoare",
    checkout_save_card_label: "Setează un nume pentru acest card",
    checkout_save_card_placeholder: "ex: Cardul meu Visa",
    checkout_pay: "Plătește",

    //BLOG
    blog_products_title: "Produsele noastre",
    blog_products_subtitle:
      "Descoperă colecția noastră de soluții AI pentru îngrijirea pielii",
    blog_card_category: "Știința îngrijirii pielii",
    blog_card_title: "Înțelegerea științei îmbătrânirii pielii",
    blog_card_desc:
      "Descoperă cele mai noi cercetări despre îmbătrânirea pielii și cum să-i combati efectele în mod natural.",
    blog_card_btn: "Abonează-te pentru mai mult",

    // Details
    product_details: "Detalii",
    product_price: "Preț",
    product_category: "Categorie",
    product_country: "Țara",
    product_brand: "Brand",
    product_description_placeholder:
      "Ser ușor, de utilizare zilnică, formulat pentru a oferi hidratare pe mai multe niveluri, pentru a calma scalpul uscat și a optimiza sănătatea scalpului.",
    product_description_placeholder_shampoo:
      "Șampon clarifiant delicat conceput pentru a detoxifica părul și scalpul de mineralele din apa dură, contaminanți și reziduuri de produse, în timp ce oferă hidratare, strălucire și volum—fără a usca.",
    product_description_placeholder_masks:
      "Șamponul nostru uscat este formulat doar cu ingrediente pe bază de plante, precum pudra organică de orez și tapioca, pentru a absorbi excesul de sebum și mirosurile, susținând în același timp microbiomul scalpului.",
    product_rating_label: "Evaluarea ta:",
    product_review_placeholder: "Scrie recenzia ta...",
    product_review_send: "Trimite",

    // Reviews
    reviews_title: "Recenzii clienți",
    reviews_subtitle: "Vezi ce spune comunitatea despre experiența lor cu AURA",
    reviews_filter_all: "Toate recenziile",
    reviews_filter_verified: "Achiziții verificate",
    reviews_filter_5stars: "Recenzii de 5 stele",
    reviews_loadmore_btn: "Încarcă mai multe recenzii",
    review_verified: "Achiziție verificată",
    review_reply: "Răspunde",
    review_submit: "Trimite",
    review_reply_placeholder: "Scrie un răspuns...",
    review_no_reviews: "Nu există recenzii încă.",
    review_time_seconds: "acum câteva secunde",
    review_time_minute: "acum un minut",
    review_time_minutes: "acum {x} minute",
    review_time_hour: "acum o oră",
    review_time_hours: "acum {x} ore",
    review_time_day: "acum o zi",
    review_time_days: "acum {x} zile",

    // About Us
    about_title: "Despre Aura",
    about_subtitle:
      "Revoluționăm frumusețea și starea de bine prin puterea AI și știința avansată a îngrijirii pielii",
    about_story_title: "Povestea Noastră",
    about_story_p1:
      "Fondată cu viziunea de a îmbina tehnologia de ultimă oră cu știința avansată a îngrijirii pielii, AURA reprezintă viitorul frumuseții și al stării de bine personalizate.",
    about_story_p2:
      "Echipa noastră de experți combină analiza bazată pe AI cu ingrediente dovedite pentru a crea soluții cu adevărat personalizate pentru nevoile fiecăruia.",
    about_feature_innovation_title: "Inovație",
    about_feature_innovation_desc:
      "Depășim limitele posibilului în îngrijirea pielii prin AI",
    about_feature_quality_title: "Calitate",
    about_feature_quality_desc:
      "Ingrediente premium și testare riguroasă pentru rezultate optime",
    about_feature_intelligence_title: "Inteligență",
    about_feature_intelligence_desc:
      "Tehnologie inteligentă care învață și se adaptează nevoilor tale unice",
    about_feature_sustainability_title: "Sustenabilitate",
    about_feature_sustainability_desc:
      "Practici eco-conștiente și aprovizionare responsabilă",

    // Contact
    contact_title: "Contactează-ne",
    contact_subtitle:
      "Ai întrebări? Suntem aici să te ajutăm și ne-ar plăcea să te auzim",
    contact_form_title: "Ia legătura cu noi",
    contact_label_name: "Nume",
    contact_label_email: "Email",
    contact_label_message: "Mesaj",
    contact_placeholder_name: "Numele tău",
    contact_placeholder_email: "adresa@email.com",
    contact_placeholder_message: "Cu ce te putem ajuta?",
    contact_btn_send: "Trimite mesajul",
    contact_toast_success: "Email trimis cu succes!",
    contact_info_email_title: "Trimite-ne un email",
    contact_info_email_btn: "E-mail",
    contact_info_call_title: "Sună-ne",
    contact_info_call_btn: "Sună",
    contact_info_chat_title: "Chat live",
    contact_info_chat_btn: "Chat",
    contact_info_email_desc: "support@aura.com",
    contact_info_call_desc: "+1 (555) 123-4567",
    contact_info_chat_desc: "Disponibil 24/7",
    chat_header_title: "Discută cu noi!",
    chat_support_hello: "Salut! Cu ce te pot ajuta?",
    chat_support_wait: "Un moment, chem un coleg să te ajute.",
    chat_input_placeholder: "Mesaj",

    // Sign Up
    signup_logo: "AURA",
    signup_login_title: "Autentifică-te în frumusețea ta!",
    signup_login_btn: "Autentificare",
    signup_title: "Creează cont",
    signup_first_name: "Prenume",
    signup_last_name: "Nume",
    signup_email: "Email",
    signup_password: "Parolă",
    signup_confirm_password: "Confirmă parola",
    signup_continue_btn: "Continuă",
    signup_error: "A apărut o eroare. Încearcă din nou.",
    signup_or: "Sau continuă cu",
    signup_google: "Google",
    signup_facebook: "Facebook",
    signup_terms: "Prin înregistrare ești de acord cu {terms}",
    signup_success: "Cont creat cu succes!",
    // Login
    login_title: "Autentificare",
    login_email: "Email",
    login_password: "Parolă",
    login_continue_btn: "Continuă",
    login_no_account: "Nu ai cont?",
    login_create_account: "Creează cont",
    login_or: "Sau continuă cu",
    login_google: "Google",
    login_facebook: "Facebook",
    login_terms: "Prin înregistrare ești de acord cu {terms}",
    login_success: "Autentificare reușită!",

    // Profile
    profile_welcome: "Bine ai revenit,",
    profile_desc: "Gestionează-ți contul și preferințele",
    profile_settings_title: "Setări cont",
    profile_settings_profile: "Editați profilul",
    profile_settings_preferences: "Preferințe",
    profile_settings_saved: "Articole salvate",
    profile_settings_orders: "Istoric comenzi",
    profile_settings_logout: "Deconectare",
    profile_skin_title: "Profilul pielii",
    profile_skin_type: "Tipul pielii",
    profile_skin_concerns: "Preocupări",
    profile_skin_sensitivity: "Sensibilitate",
    profile_skin_value_combination: "Mixtă",
    profile_skin_value_hydration_texture: "Hidratare,Textură",
    profile_skin_value_moderate: "Moderată",
    profile_sub_title: "Abonament",
    profile_sub_status: "Membru Premium Activ",
    profile_sub_btn: "Gestionează abonamentul",
    profile_preferences_title: "Preferințe",
    preferences_light_mode: "Mod Luminos",
    preferences_dark_mode: "Mod Întunecat",
    preferences_delete_account: "Șterge contul",

    // Subscription
    sub_basic_title: "Nude Glow (Basic)",
    sub_basic_feat1: "✔ 3 mostre de produse (îngrijire sau machiaj)",
    sub_basic_feat2: "✔ Acces la Analiza AI de 3 ori pe zi",
    sub_basic_feat3: "✔ 5% reducere la toate comenzile",
    sub_basic_feat4: "✔ Cod de reducere -10% dacă inviți un prieten",
    sub_basic_feat5: "✔ Livrare standard gratuită la comenzi peste 150€",
    sub_basic_feat6: "✖ Acces prioritar la lansări de produse noi",
    sub_basic_feat7: "✖ Acces la 1 tutorial video profesional/lună",
    sub_basic_feat8: "✖ Acces la articole educaționale lunare",
    sub_basic_feat9: "✖ Cutie cadou aniversară (full-size, luxury)",
    sub_basic_feat10: "✖ Insignă digitală „Diva Elite”",
    sub_basic_price: "9,99 EUR",
    sub_gold_title: "Rosy Blush (Gold)",
    sub_gold_feat1: "✔ 3 produse deluxe",
    sub_gold_feat2: "✔ Acces la Analiza AI de 25 ori pe zi",
    sub_gold_feat3: "✔ 15% reducere la toate comenzile",
    sub_gold_feat4: "✔ Cod de reducere -20% dacă inviți un prieten",
    sub_gold_feat5: "✔ Livrare standard gratuită la comenzi peste 50€",
    sub_gold_feat6: "✔ Acces prioritar la lansări de produse noi",
    sub_gold_feat7: "✔ Acces la 1 tutorial video profesional/lună",
    sub_gold_feat8: "✔ Acces la articole educaționale lunare",
    sub_gold_feat9: "✖ Cutie cadou aniversară (full-size, luxury)",
    sub_gold_feat10: "✖ Insignă digitală „Diva Elite”",
    sub_gold_price: "19,99 EUR",
    sub_elite_title: "Glam Diva (Elite)",
    sub_elite_feat1: "✔ 3 produse ediție limitată",
    sub_elite_feat2: "✔ Acces nelimitat la Analiza AI",
    sub_elite_feat3: "✔ 25% reducere la toate comenzile",
    sub_elite_feat4: "✔ Cod de reducere -30% dacă inviți un prieten",
    sub_elite_feat5: "✔ Livrare standard gratuită la orice comandă",
    sub_elite_feat6: "✔ Acces prioritar la lansări de produse luxury",
    sub_elite_feat7: "✔ Acces la 5 tutoriale video profesionale/lună",
    sub_elite_feat8: "✔ Acces la articole educaționale săptămânale",
    sub_elite_feat9: "✔ Cutie cadou aniversară (full-size, luxury)",
    sub_elite_feat10: "✔ Insignă digitală „Diva Elite”",
    sub_elite_price: "34,99 EUR",
    sub_btn: "Abonează-te",

    // Edit Profile
    edit_profile_title: "Editează profilul",
    edit_profile_firstname: "Prenume",
    edit_profile_lastname: "Nume",
    edit_profile_email: "Email",
    edit_profile_password: "Parolă",
    edit_profile_confirmpass: "Confirmă parola",
    edit_profile_update: "Actualizează profilul",
  },
  ru: {
    hero_title: "Будущее красоты и здоровья",
    hero_description:
      "Испытайте индивидуальное путешествие с ИИ по уходу за кожей, мониторингу здоровья и персональным процедурам специально для вас",
    btn_journey: "Начать путешествие →",
    btn_explore: "Посмотреть продукты",
    gallery_title: "Голографическая галерея продуктов",
    gallery_description:
      "Изучайте наши передовые продукты с помощью интерактивных 3D-дисплеев. Вращайте, увеличивайте и открывайте будущее бьюти-технологий",
    view_details: "Подробнее",
    add_to_cart: "Добавить в корзину",
    routine_title: "Интерактивный конструктор рутин",
    routine_description:
      "Откройте для себя идеальную последовательность ухода с помощью ИИ. Персонализированные шаги на основе потребностей вашей кожи.",
    morning: "Утро",
    evening: "Вечер",
    cleanse: "Очищение",
    cleanse_duration: "1 мин",
    tone: "Тонизирование",
    tone_duration: "30 сек",
    serum: "Сыворотка",
    serum_duration: "1 мин",
    moisturize: "Увлажнение",
    moisturize_duration: "1 мин",
    ai_title: "Умные рекомендации AI",
    ai_description:
      "Наш продвинутый ИИ анализирует ваш профиль кожи и образ жизни, чтобы создать персональные рекомендации, адаптирующиеся к вашим потребностям",
    profile_title: "Ваш профиль кожи",
    skin_type: "ТИП КОЖИ",
    dry: "Сухая",
    oily: "Жирная",
    combination: "Комбинированная",
    normal: "Нормальная",
    sensitive: "Чувствительная",
    skin_concerns: "ПРОБЛЕМЫ КОЖИ",
    dryness: "Сухость",
    fine_lines: "Морщины",
    sensitivity: "Чувствительность",
    acne: "Акне",
    hyperpigmentation: "Гиперпигментация",
    rosacea: "Розацеа",
    update_profile: "Обновить профиль",
    ai_insights: "AI Инсайты",
    skin_analysis: "Анализ кожи",
    analysis_description:
      "Основываясь на вашем комбинированном типе кожи с гиперпигментацией и морщинами, наш ИИ рекомендует мягкое отшелушивание и целевые процедуры.",
    recommended_ingredients: "Рекомендуемые ингредиенты",
    niacinamide: "Ниацинамид",
    vitamin_c: "Витамин C",
    hyaluronic_acid: "Гиалуроновая кислота",
    retinol: "Ретинол",
    peptides: "Пептиды",
    custom_formula: "Персональная формула",
    create_formula: "Нажмите, чтобы создать свою формулу",
    get_full_analysis: "Получить полный AI-анализ",
    // MENU
    menu_home: "Главная",
    menu_products: "Продукты",
    menu_ai_analysis: "AI Анализ",
    menu_skincare_quiz: "Тест по уходу",
    menu_blog: "Блог",
    menu_reviews: "Отзывы",
    menu_login: "Войти",
    menu_logout: "Выйти",
    menu_account: "Аккаунт",
    menu_cart: "Корзина",
    menu_language: "Язык",
    // AI Analysis
    ai_analysis_title: "AI-анализ кожи",
    ai_analysis_subtitle:
      "Получите персонализированный анализ кожи с помощью нашей передовой AI-технологии",
    ai_analysis_upload_title: "Загрузите фото",
    ai_analysis_upload_desc:
      "Сделайте или загрузите четкое, хорошо освещенное фото вашего лица для наиболее точного анализа",
    ai_analysis_upload_btn: "Нажмите для загрузки или перетащите файл сюда",

    // Products
    currency_price: "руб.",
    products_title: "Наши продукты",
    products_description:
      "Ознакомьтесь с нашей коллекцией средств по уходу за кожей с ИИ",
    products_search_placeholder: "Поиск продуктов...",
    products_categories: "Категории",
    products_brands: "Бренды",
    products_countries: "Страны",
    products_reset: "Сбросить всё",
    products_all_products: "Все продукты",
    products_all_brands: "Все бренды",
    products_all_countries: "Все страны",
    products_cleansers: "Очищающие средства",
    products_serums: "Сыворотки",
    products_moisturizers: "Увлажняющие",
    products_masks: "Маски",
    products_treatments: "Лечения",
    products_moldova: "Молдова",
    products_romania: "Румыния",
    products_france: "Франция",
    products_italy: "Италия",
    products_usa: "США",
    products_maybelline: "Maybelline",
    products_loreal: "L'Oréal",
    products_nyx: "NYX",
    products_mac: "MAC",
    products_act: "Act+",
    products_daily_hydro_serum: "Ежедневная гидро-сыворотка",
    products_daily_hydro_shampoo: "Очищающий шампунь от жесткой воды",
    products_daily_hydro_masks: "Объемный сухой шампунь с фульвовой кислотой",

    // FOOTER
    footer_logo: "AURA",
    footer_slogan:
      "Будущее красоты и здоровья с поддержкой передовых AI-технологий и современных научных достижений в уходе за кожей.",
    footer_social_title: "Следите за нами",
    footer_menu_title_1: "Компания",
    footer_menu_title_2: "Ресурсы",
    footer_menu_title_3: "Помощь",
    footer_menu_link_home: "Все продукты",
    footer_menu_link_about: "AI-анализ",
    footer_menu_link_products: "Опрос по уходу",
    footer_menu_link_blog: "Блог",
    footer_menu_link_reviews: "О нас",
    footer_menu_link_faq: "Блог",
    footer_menu_link_support: "Отзывы",
    footer_menu_link_contact: "Контакты",
    footer_menu_link_terms: "Мой аккаунт",
    footer_menu_link_privacy: "Корзина",
    footer_copyright: "© 2025 AURA. Все права защищены.",
    footer_legal_terms: "Условия",
    footer_legal_privacy: "Конфиденциальность",
    footer_legal_cookies: "Cookies",

    // CART
    cart_title: "Ваша корзина",
    cart_empty: "Корзина пуста.",
    cart_remove: "Удалить",
    cart_order_summary: "Сводка заказа",
    cart_subtotal: "Промежуточный итог",
    cart_shipping: "Доставка",
    cart_shipping_free: "Бесплатно",
    cart_total: "Итого",
    cart_checkout: "Оформить заказ",

    //CHECKOUT
    checkout_title: "Оплата картой",
    checkout_secure: "Безопасное соединение",
    checkout_email: "Электронная почта",
    checkout_card_info: "Данные карты",
    checkout_card_placeholder: "1234 1234 1234 1234",
    checkout_expiry_placeholder: "ММ/ГГ",
    checkout_cvc_placeholder: "CVC",
    checkout_cardholder: "Имя владельца карты",
    checkout_cardholder_placeholder: "Полное имя на карте",
    checkout_country: "Страна или регион",
    checkout_country_md: "Молдова",
    checkout_country_ro: "Румыния",
    checkout_country_fr: "Франция",
    checkout_country_it: "Италия",
    checkout_country_us: "США",
    checkout_save_payment: "Сохранить данные для будущих покупок",
    checkout_save_card_label: "Задайте имя для этой карты",
    checkout_save_card_placeholder: "например, Моя Visa",
    checkout_pay: "Оплатить",

    //BLOG
    blog_products_title: "Наши продукты",
    blog_products_subtitle:
      "Ознакомьтесь с нашей коллекцией средств по уходу за кожей с ИИ",
    blog_card_category: "Наука о коже",
    blog_card_title: "Понимание науки старения кожи",
    blog_card_desc:
      "Узнайте о последних исследованиях старения кожи и о том, как естественным образом бороться с его последствиями.",
    blog_card_btn: "Подписаться на больше",

    // Details
    product_details: "Детали",
    product_price: "Цена",
    product_category: "Категория",
    product_country: "Страна",
    product_brand: "Бренд",
    product_description_placeholder:
      "Легкая ежедневная сыворотка для кожи головы, обеспечивающая многоуровневое увлажнение, снимает сухость и оптимизирует здоровье кожи головы.",
    product_description_placeholder_shampoo:
      "Мягкий очищающий шампунь, созданный для детоксикации волос и кожи головы от минеральных отложений жесткой воды, загрязнений и остатков средств, одновременно усиливая увлажнение, блеск и объем — без пересушивания.",
    product_description_placeholder_masks:
      "Наш сухой шампунь создан только из растительных ингредиентов, таких как органический рис и тапиоковый порошок, чтобы впитывать излишки жира и запахи, поддерживая микробиом кожи головы.",
    product_rating_label: "Ваша оценка:",
    product_review_placeholder: "Напишите свой отзыв...",
    product_review_send: "Отправить",

    // Reviews
    reviews_title: "Отзывы клиентов",
    reviews_subtitle:
      "Узнайте, что говорит наше сообщество о своем опыте с AURA",
    reviews_filter_all: "Все отзывы",
    reviews_filter_verified: "Проверенные покупки",
    reviews_filter_5stars: "Отзывы на 5 звезд",
    reviews_loadmore_btn: "Показать больше отзывов",
    review_verified: "Проверенная покупка",
    review_reply: "Ответить",
    review_submit: "Отправить",
    review_reply_placeholder: "Напишите ответ...",
    review_no_reviews: "Пока нет отзывов.",
    review_time_seconds: "несколько секунд назад",
    review_time_minute: "минуту назад",
    review_time_minutes: "акум {x} минут назад",
    review_time_hour: "час назад",
    review_time_hours: "акум {x} часов назад",
    review_time_day: "день назад",
    review_time_days: "акум {x} дней назад",

    // About Us
    about_title: "Об Ауре",
    about_subtitle:
      "Революция в красоте и здоровье с помощью ИИ и передовой науки о коже",
    about_story_title: "Наша история",
    about_story_p1:
      "Основана с целью объединить передовые технологии и науку о коже, AURA — это будущее персонализированной красоты и здоровья.",
    about_story_p2:
      "Наша команда экспертов сочетает анализ на базе ИИ с проверенными ингредиентами для создания по-настоящему персонализированных решений для каждого.",
    about_feature_innovation_title: "Инновации",
    about_feature_innovation_desc:
      "Расширяем границы возможного в уходе за кожей с помощью ИИ",
    about_feature_quality_title: "Качество",
    about_feature_quality_desc:
      "Премиальные ингредиенты и строгие тесты для лучших результатов",
    about_feature_intelligence_title: "Интеллект",
    about_feature_intelligence_desc:
      "Умные технологии, которые учатся и адаптируются под ваши уникальные потребности",
    about_feature_sustainability_title: "Устойчивость",
    about_feature_sustainability_desc:
      "Экологичные практики и ответственное снабжение",

    // Contact
    contact_title: "Связаться с нами",
    contact_subtitle: "Есть вопросы? Мы всегда готовы помочь и будем рады вам",
    contact_form_title: "Свяжитесь с нами",
    contact_label_name: "Имя",
    contact_label_email: "Эл. почта",
    contact_label_message: "Сообщение",
    contact_placeholder_name: "Ваше имя",
    contact_placeholder_email: "ваш@email.com",
    contact_placeholder_message: "Чем мы можем помочь?",
    contact_btn_send: "Отправить сообщение",
    contact_toast_success: "Письмо успешно отправлено!",
    contact_info_email_title: "Напишите нам",
    contact_info_email_btn: "Почта",
    contact_info_call_title: "Позвоните нам",
    contact_info_call_btn: "Позвонить",
    contact_info_chat_title: "Онлайн-чат",
    contact_info_chat_btn: "Чат",
    contact_info_email_desc: "support@aura.com",
    contact_info_call_desc: "+1 (555) 123-4567",
    contact_info_chat_desc: "Доступно 24/7",
    chat_header_title: "Чат с нами!",
    chat_support_hello: "Здравствуйте! Чем могу помочь?",
    chat_support_wait: "Момент, я позову специалиста для ответа.",
    chat_input_placeholder: "Сообщение",

    // Sign Up
    signup_logo: "AURA",
    signup_login_title: "Войдите в свою красоту!",
    signup_login_btn: "Войти",
    signup_title: "Регистрация",
    signup_first_name: "Имя",
    signup_last_name: "Фамилия",
    signup_email: "Эл. почта",
    signup_password: "Пароль",
    signup_confirm_password: "Подтвердите пароль",
    signup_continue_btn: "Продолжить",
    signup_error: "Произошла ошибка. Пожалуйста, попробуйте еще раз.",
    signup_or: "Или продолжить с помощью",
    signup_google: "Google",
    signup_facebook: "Facebook",
    signup_terms: "Регистрируясь, вы соглашаетесь с нашими {terms}",
    signup_success: "Аккаунт успешно создан!",
    // Login
    login_title: "Вход",
    login_email: "Эл. почта",
    login_password: "Пароль",
    login_continue_btn: "Продолжить",
    login_no_account: "Нет аккаунта?",
    login_create_account: "Создать аккаунт",
    login_or: "Или продолжить с помощью",
    login_google: "Google",
    login_facebook: "Facebook",
    login_terms: "Регистрируясь, вы соглашаетесь с нашими {terms}",
    login_success: "Вход выполнен успешно!",

    // Profile
    profile_welcome: "С возвращением,",
    profile_desc: "Управляйте своим аккаунтом и настройками",
    profile_settings_title: "Настройки аккаунта",
    profile_settings_profile: "Редактировать профиль",
    profile_settings_preferences: "Настройки",
    profile_settings_saved: "Сохранённые",
    profile_settings_orders: "История заказов",
    profile_settings_logout: "Выйти",
    profile_skin_title: "Профиль кожи",
    profile_skin_type: "Тип кожи",
    profile_skin_concerns: "Проблемы",
    profile_skin_sensitivity: "Чувствительность",
    profile_skin_value_combination: "Комбинированная",
    profile_skin_value_hydration_texture: "Увлажнение,Текстура",
    profile_skin_value_moderate: "Умеренная",
    profile_sub_title: "Подписка",
    profile_sub_status: "Активная премиум-подписка",
    profile_sub_btn: "Управлять подпиской",
    profile_preferences_title: "Настройки",
    preferences_light_mode: "Светлая тема",
    preferences_dark_mode: "Темная тема",
    preferences_delete_account: "Удалить аккаунт",

    //Subscription
    sub_basic_title: "Nude Glow (Базовый)",
    sub_basic_feat1: "✔ 3 пробника продукта (уход или макияж)",
    sub_basic_feat2: "✔ Доступ к AI-анализу 3 раза в день",
    sub_basic_feat3: "✔ 5% скидка на все заказы",
    sub_basic_feat4: "✔ Промокод -10% если пригласите друга",
    sub_basic_feat5: "✔ Бесплатная стандартная доставка при заказе от 150€",
    sub_basic_feat6: "✖ Приоритетный доступ к новым продуктам",
    sub_basic_feat7: "✖ Доступ к 1 профессиональному видео-уроку/месяц",
    sub_basic_feat8: "✖ Доступ к ежемесячным образовательным статьям",
    sub_basic_feat9: "✖ Подарочная коробка ко дню рождения (full-size, luxury)",
    sub_basic_feat10: "✖ Цифровой значок «Diva Elite»",
    sub_basic_price: "9,99 EUR",
    sub_gold_title: "Rosy Blush (Золотой)",
    sub_gold_feat1: "✔ 3 продукта deluxe",
    sub_gold_feat2: "✔ Доступ к AI-анализу 25 раз в день",
    sub_gold_feat3: "✔ 15% скидка на все заказы",
    sub_gold_feat4: "✔ Промокод -20% если пригласите друга",
    sub_gold_feat5: "✔ Бесплатная стандартная доставка при заказе от 50€",
    sub_gold_feat6: "✔ Приоритетный доступ к новым продуктам",
    sub_gold_feat7: "✔ Доступ к 1 профессиональному видео-уроку/месяц",
    sub_gold_feat8: "✔ Доступ к ежемесячным образовательным статьям",
    sub_gold_feat9: "✖ Подарочная коробка ко дню рождения (full-size, luxury)",
    sub_gold_feat10: "✖ Цифровой значок «Diva Elite»",
    sub_gold_price: "19,99 EUR",
    sub_elite_title: "Glam Diva (Элитный)",
    sub_elite_feat1: "✔ 3 продукта лимитированной серии",
    sub_elite_feat2: "✔ Неограниченный доступ к AI-анализу",
    sub_elite_feat3: "✔ 25% скидка на все заказы",
    sub_elite_feat4: "✔ Промокод -30% если пригласите друга",
    sub_elite_feat5: "✔ Бесплатная стандартная доставка на любой заказ",
    sub_elite_feat6: "✔ Приоритетный доступ к luxury-новинкам",
    sub_elite_feat7: "✔ Доступ к 5 профессиональным видео-урокам/месяц",
    sub_elite_feat8: "✔ Доступ к еженедельным образовательным статьям",
    sub_elite_feat9: "✔ Подарочная коробка ко дню рождения (full-size, luxury)",
    sub_elite_feat10: "✔ Цифровой значок «Diva Elite»",
    sub_elite_price: "34,99 EUR",
    sub_btn: "Оформить подписку",

    // Edit Profile
    edit_profile_title: "Редактировать профиль",
    edit_profile_firstname: "Имя",
    edit_profile_lastname: "Фамилия",
    edit_profile_email: "Эл. почта",
    edit_profile_password: "Пароль",
    edit_profile_confirmpass: "Подтвердите пароль",
    edit_profile_update: "Обновить профиль",
  },
};

window.translations = translations;

// Modificare pentru păstrarea culorii la Terms and Conditions
const originalTermsLink =
  document.querySelector(".signup-terms a")?.outerHTML ||
  '<a href="#" class="green-link">Terms and Conditions</a>';

function setSiteLanguage(lang) {
  localStorage.setItem("site-lang", lang);

  // Schimbă steagul principal
  document.querySelectorAll(".lang-btn img").forEach((img) => {
    if (lang === "ro") img.src = "https://flagcdn.com/24x18/ro.png";
    else if (lang === "ru") img.src = "https://flagcdn.com/24x18/ru.png";
    else img.src = "https://flagcdn.com/24x18/gb.png";
  });

  // Traduce textele și atributele
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang] && translations[lang][key]) {
      if (
        el.placeholder !== undefined &&
        (el.tagName === "INPUT" || el.tagName === "TEXTAREA")
      ) {
        el.placeholder = translations[lang][key];
      } else if (
        el.classList.contains("signup-terms") ||
        el.classList.contains("login-terms")
      ) {
        // Înlocuiește {terms} cu link-ul original păstrând culoarea
        el.innerHTML = translations[lang][key].replace(
          "{terms}",
          originalTermsLink
        );
      } else if (el.tagName === "BUTTON") {
        el.innerText = translations[lang][key];
      } else {
        el.innerText = translations[lang][key];
      }
    }
  });

  // Adaugă și pentru textarea sau alte elemente cu data-i18n-placeholder
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (translations[lang] && translations[lang][key]) {
      el.placeholder = translations[lang][key];
    }
  });

  document.documentElement.setAttribute("lang", lang);
  // Notifică restul aplicației că s-a schimbat limba
  window.currentLanguage = lang;
  document.dispatchEvent(
    new CustomEvent("languageChanged", { detail: { lang } })
  );
}

document.addEventListener("DOMContentLoaded", () => {
  // Elimină orice meniu și footer existente
  document.querySelectorAll(".hero-menu").forEach((el) => el.remove());
  document.querySelectorAll(".footer-hero").forEach((el) => el.remove());

  document.body.insertAdjacentHTML("afterbegin", renderMenu());
  document.body.insertAdjacentHTML("beforeend", renderFooter());

  const lang = localStorage.getItem("site-lang") || "en";
  setSiteLanguage(lang);

  loadCart();
  updateCartBadge();
  setupCartIcon();
  moveUserActionsToMenu();
  if (window.renderQuiz) window.renderQuiz();
});

function moveUserActionsToMenu() {
  const nav = document.querySelector(".main-nav");
  const menu = nav?.querySelector(".menu");
  const actions = nav?.querySelector(".user-actions");
  if (!menu || !actions) return;
  if (window.innerWidth <= 900) {
    if (!menu.contains(actions)) menu.appendChild(actions);
  } else {
    if (nav && ![...nav.children].includes(actions)) nav.appendChild(actions);
  }
  // Actualizează badge-ul de fiecare dată când mutăm iconița
  setTimeout(updateCartBadge, 0);
  setTimeout(setupCartIcon, 0);
}
window.addEventListener("resize", moveUserActionsToMenu);
window.addEventListener("DOMContentLoaded", moveUserActionsToMenu);

// Funcție globală pentru traducerea cheilor produselor (name, category, brand etc)
window.translateProductField = function (productOrKey, field) {
  const lang = window.currentLang || localStorage.getItem("site-lang") || "en";
  if (!productOrKey) return "";
  // Dacă e obiect și are field, extrage cheia
  if (typeof productOrKey === "object" && field) {
    const val = productOrKey[field];
    if (
      typeof val === "string" &&
      window.translations &&
      window.translations[lang] &&
      window.translations[lang][val]
    ) {
      return window.translations[lang][val];
    }
    return val || "";
  }
  // Dacă e direct cheia
  if (
    typeof productOrKey === "string" &&
    window.translations &&
    window.translations[lang] &&
    window.translations[lang][productOrKey]
  ) {
    return window.translations[lang][productOrKey];
  }
  return productOrKey;
};

// Poți pune acest cod în Menu.js sau imediat după ce inserezi footerul
setTimeout(() => {
  const footerCartLink = document.getElementById("footer-cart-link");
  if (footerCartLink) {
    footerCartLink.onclick = function (e) {
      e.preventDefault();
      // Găsește butonul de shopping bag din meniu și simulează click
      document
        .querySelector('.user-actions .icon-button[aria-label="Shopping bag"]')
        ?.click();
    };
  }
}, 0);
setTimeout(() => {
  document
    .querySelectorAll('.icon-button[aria-label="User account"]')
    .forEach((btn) => {
      btn.onclick = (e) => {
        e.preventDefault();
        // Verifică dacă utilizatorul este logat (există userProfile în localStorage)
        const user = localStorage.getItem("userProfile");
        if (user) {
          window.location.href = "Profile Page.html";
        } else {
          window.location.href = "SignUp Page.html";
        }
      };
    });
}, 0);
