window.addEventListener("DOMContentLoaded", () => {
  let reviews = JSON.parse(localStorage.getItem("productReviews") || "[]");
  const container = document.getElementById("reviews-list");
  const loadMoreBtn = document.querySelector(".reviews-loadmore-btn");
  const filterBtns = document.querySelectorAll(".reviews-filter-btn");
  let shown = 0;
  const INITIAL = 3;
  const STEP = 3;
  let currentFilter = "all";

  // Asigură-te că fiecare review are replies
  reviews = reviews.map((r) => ({ ...r, replies: r.replies || [] }));

  function saveReviews() {
    localStorage.setItem("productReviews", JSON.stringify(reviews));
  }

  function getFilteredReviews() {
    if (currentFilter === "5stars") {
      return reviews.filter((r) => r.rating === 5);
    }
    if (currentFilter === "verified") {
      // presupunem că toate sunt verificate, sau poți adăuga un flag r.verified === true
      return reviews.filter((r) => r.verified !== false);
    }
    return reviews;
  }

  function renderReviews() {
    const filtered = getFilteredReviews();
    const toShow = filtered.slice(0, shown);

    container.innerHTML = toShow
      .map(
        (r, idx) => `
    <div class="review-card" data-review-index="${idx}">
      <div class="review-header">
        <div class="review-avatar"></div>
        <div class="review-main">
          <div class="review-user-row">
            <span class="review-user">${r.name}</span>
            <span class="review-badge" data-i18n="review_verified">Verified Purchase</span>
            
          </div>
          <div class="review-product-title">
            ${window.translateProductField(r.productKey)}
          </div>
          <div class="review-row">
            <span class="review-stars" data-rating="${r.rating}"></span>
            <span class="review-date" data-date="${new Date(
              r.date
            ).toISOString()}"></span>
          </div>
          <div class="review-text" data-i18n-comment>
            ${r.comment}
          </div>
          <div class="review-actions">
            <button class="helpful-btn"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#b884af" viewBox="0 0 256 256"><path d="M234,80.12A24,24,0,0,0,216,72H160V56a40,40,0,0,0-40-40,8,8,0,0,0-7.16,4.42L75.06,96H32a16,16,0,0,0-16,16v88a16,16,0,0,0,16,16H204a24,24,0,0,0,23.82-21l12-96A24,24,0,0,0,234,80.12ZM32,112H72v88H32ZM223.94,97l-12,96a8,8,0,0,1-7.94,7H88V105.89l36.71-73.43A24,24,0,0,1,144,56V80a8,8,0,0,0,8,8h64a8,8,0,0,1,7.94,9Z">'
            </path>
            </svg>
            Like(<span class="helpful-count">0</span>)</button>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#b884af" viewBox="0 0 256 256"><path d="M128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z">
            </path>
            </svg>
            <button class="reply-btn" data-i18n="review_reply">
            Reply</button>
            <button class="review-delete-btn" title="Delete review" aria-label="Delete review" style="background:none;border:none;cursor:pointer;padding:0 0.5em;display:flex;align-items:center; margin-left:auto;">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="5" y="7" width="12" height="13" rx="2" stroke="#b884af" stroke-width="1.5"/>
                <path d="M9 10V15" stroke="#b884af" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M13 10V15" stroke="#b884af" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M3 7H19" stroke="#b884af" stroke-width="1.5" stroke-linecap="round"/>
                <rect x="8" y="5" width="6" height="2" rx="1" stroke="#b884af" stroke-width="1.5"/>
                <path d="M11 10V15" stroke="#b884af" stroke-width="1.5" stroke-linecap="round"/> <!-- linia din mijloc -->
              </svg>
            </button>
          </div>
          
          <div class="reply-section" style="display:none;">
            <textarea placeholder="Write a reply..." data-i18n-placeholder="review_reply_placeholder"></textarea>
            <button class="reply-submit-btn" data-i18n="review_submit">Submit</button>
          </div>
          <div class="review-replies">
            ${(r.replies || [])
              .map(
                (reply, ridx) =>
                  `<div class="single-reply" data-reply-index="${ridx}">
                      <span class="reply-text">${
                        typeof reply === "string" ? reply : reply.text
                      }</span>
                      <span class="reply-date">${
                        typeof reply === "string" ? "" : timeAgo(reply.date)
                      }</span>
                      <button class="reply-delete-btn" title="Delete reply" aria-label="Delete reply" style="background:none;border:none;cursor:pointer;padding:0 0.3em;display:flex;align-items:center;">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <rect x="4" y="8.25" width="10" height="1.5" rx="0.75" fill="#b884af"/>
                        </svg>
                      </button>
                    </div>`
              )
              .join("")}
          </div>
        </div>
      </div>
    </div>
  `
      )
      .join("");

    // Init stele, timp, helpful, reply
    document.querySelectorAll(".review-card").forEach((card) => {
      // Stele
      const starsDiv = card.querySelector(".review-stars");
      if (starsDiv && starsDiv.dataset.rating) {
        const rating = parseInt(starsDiv.dataset.rating, 10);
        starsDiv.innerHTML = "★".repeat(rating) + "☆".repeat(5 - rating);
      }
      // Timp
      const dateDiv = card.querySelector(".review-date");
      if (dateDiv && dateDiv.dataset.date) {
        dateDiv.textContent = timeAgo(dateDiv.dataset.date);
      }
      // Helpful
      const helpfulBtn = card.querySelector(".helpful-btn");
      const helpfulCount = helpfulBtn.querySelector(".helpful-count");
      let liked = false,
        count = 0;
      helpfulBtn.onclick = () => {
        liked = !liked;
        helpfulBtn.classList.toggle("liked", liked);
        count += liked ? 1 : -1;
        helpfulCount.textContent = count;
      };
    });

    // Adaugă logica pentru reply
    container.querySelectorAll(".review-card").forEach((card, idx) => {
      const replyBtn = card.querySelector(".reply-btn");
      const replySection = card.querySelector(".reply-section");
      const replyTextarea = replySection.querySelector("textarea");
      const replySubmit = replySection.querySelector(".reply-submit-btn");
      const repliesContainer = card.querySelector(".review-replies");

      replyBtn.onclick = () => {
        replySection.style.display =
          replySection.style.display === "none" ? "flex" : "none";
      };
      replySubmit.onclick = () => {
        const val = replyTextarea.value.trim();
        if (val) {
          reviews[idx].replies = reviews[idx].replies || [];
          reviews[idx].replies.push({
            text: val,
            date: new Date().toISOString(),
          });
          saveReviews();
          renderReviews();
        }
      };

      // Delete reply logic
      card.querySelectorAll(".reply-delete-btn").forEach((btn) => {
        btn.onclick = function () {
          const replyDiv = btn.closest(".single-reply");
          const replyIdx = parseInt(
            replyDiv.getAttribute("data-reply-index"),
            10
          );
          reviews[idx].replies.splice(replyIdx, 1);
          saveReviews();
          renderReviews();
        };
      });
    });

    // Delete review logic
    container.querySelectorAll(".review-delete-btn").forEach((btn, idx) => {
      btn.onclick = function () {
        // idx corespunde cu indexul din toShow, trebuie să găsești indexul real în reviews
        const reviewCard = btn.closest(".review-card");
        const reviewIndex = parseInt(
          reviewCard.getAttribute("data-review-index"),
          10
        );
        // Găsește review-ul real în reviews (poate fi filtrat)
        const filtered = getFilteredReviews();
        const reviewToDelete = filtered[reviewIndex];
        // Găsește indexul real în array-ul reviews
        const realIndex = reviews.findIndex(
          (r) =>
            r.name === reviewToDelete.name &&
            r.date === reviewToDelete.date &&
            r.comment === reviewToDelete.comment
        );
        if (realIndex !== -1) {
          reviews.splice(realIndex, 1);
          saveReviews();
          shown = Math.max(
            INITIAL,
            Math.min(shown, getFilteredReviews().length)
          );
          renderReviews();
        }
      };
    });

    // Ascunde butonul dacă nu mai sunt review-uri de afișat
    if (shown >= filtered.length) {
      loadMoreBtn.style.display = "none";
    } else {
      loadMoreBtn.style.display = "";
    }

    if (window.setSiteLanguage) {
      const lang =
        window.currentLang || localStorage.getItem("site-lang") || "en";
      window.setSiteLanguage(lang);
    }
  }

  function timeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diff = Math.floor((now - date) / 1000);
    const lang =
      window.currentLang || localStorage.getItem("site-lang") || "en";
    const t = window.translations?.[lang] || window.translations.en;
    if (diff < 60) return t.review_time_seconds;
    if (diff < 120) return t.review_time_minute;
    if (diff < 3600)
      return t.review_time_minutes.replace("{x}", Math.floor(diff / 60));
    if (diff < 7200) return t.review_time_hour;
    if (diff < 86400)
      return t.review_time_hours.replace("{x}", Math.floor(diff / 3600));
    if (diff < 172800) return t.review_time_day;
    return t.review_time_days.replace("{x}", Math.floor(diff / 86400));
  }

  if (!reviews.length) {
    container.innerHTML =
      "<p class='no-reviews' data-i18n='review_no_reviews'>No reviews yet.</p>";
    loadMoreBtn.style.display = "none";
    return;
  }

  // Filter button logic
  filterBtns.forEach((btn) => {
    btn.onclick = () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      if (btn.dataset.i18n === "reviews_filter_5stars") {
        currentFilter = "5stars";
      } else if (btn.dataset.i18n === "reviews_filter_verified") {
        currentFilter = "verified";
      } else {
        currentFilter = "all";
      }
      shown = INITIAL;
      renderReviews();
    };
  });

  shown = INITIAL;
  renderReviews();

  loadMoreBtn.addEventListener("click", () => {
    shown += STEP;
    renderReviews();
  });
});

window.translateProductField = function (key) {
  const lang = window.currentLang || localStorage.getItem("site-lang") || "en";
  if (!key) return "";
  if (
    window.translations &&
    window.translations[lang] &&
    window.translations[lang][key]
  ) {
    return window.translations[lang][key];
  }
  return key;
};
