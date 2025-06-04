// Exemplu de traduceri (adaugă-le în window.translations înainte de acest script)
window.translations = {
  ro: {
    quiz_title: "Quiz de îngrijire a pielii",
    quiz_progress: "Întrebarea 1 din 4",
    quiz_prev: "Înapoi",
    quiz_next: "Următoarea",
    quiz_result_see: "Vezi rezultatul",
    quiz_result_title: "Analiză completă!",
    quiz_result_desc:
      "Pe baza răspunsurilor tale, am creat o rutină personalizată de îngrijire a pielii pentru tine.",
    quiz_result_products_title: "Produse recomandate",
    quiz_result_retake: "Reia quiz-ul",
    quiz_result_full: "Vezi rezultatul complet",
    product1: "Ser Neo Hydration",
    product2: "Mască Quantum Repair",
    product3: "Cremă hidratantă Daily Protection",
    q1: "Care este principala ta preocupare legată de piele?",
    q2: "Cum ai descrie tipul tău de piele?",
    q3: "Cât de des ai erupții?",
    q4: "Cum arată rutina ta actuală de îngrijire?",
    o1a: "Îmbătrânire",
    o1b: "Acnee",
    o1c: "Hiperpigmentare",
    o1d: "Uscăciune",
    o1e: "Sensibilitate",
    o2a: "Grasă",
    o2b: "Uscată",
    o2c: "Combinată",
    o2d: "Normală",
    o2e: "Nu știu",
    o3a: "Niciodată",
    o3b: "Rar",
    o3c: "Uneori",
    o3d: "Des",
    o3e: "Foarte des",
    o4a: "De bază",
    o4b: "Intermediară",
    o4c: "Avansată",
    o4d: "Niciuna",
    o4e: "Vreau să încep",
  },
  en: {
    quiz_title: "Skincare Quiz",
    quiz_progress: "Question 1 of 4",
    quiz_prev: "Previous",
    quiz_next: "Next",
    quiz_result_see: "See Results",
    quiz_result_title: "Analysis Complete!",
    quiz_result_desc:
      "Based on your responses, we've created a personalized skincare routine just for you.",
    quiz_result_products_title: "Recommended Products",
    quiz_result_retake: "Retake Quiz",
    quiz_result_full: "View Full Results",
    product1: "Neo Hydration Serum",
    product2: "Quantum Repair Mask",
    product3: "Daily Protection Moisturizer",
    q1: "What's your primary skin concern?",
    q2: "How would you describe your skin type?",
    q3: "How often do you experience breakouts?",
    q4: "What's your current skincare routine like?",
    o1a: "Aging",
    o1b: "Acne",
    o1c: "Hyperpigmentation",
    o1d: "Dryness",
    o1e: "Sensitivity",
    o2a: "Oily",
    o2b: "Dry",
    o2c: "Combination",
    o2d: "Normal",
    o2e: "Not sure",
    o3a: "Never",
    o3b: "Rarely",
    o3c: "Sometimes",
    o3d: "Often",
    o3e: "Very Often",
    o4a: "Basic",
    o4b: "Intermediate",
    o4c: "Advanced",
    o4d: "None",
    o4e: "Looking to start",
  },
  ru: {
    quiz_title: "Опрос по уходу за кожей",
    quiz_progress: "Вопрос 1 из 4",
    quiz_prev: "Назад",
    quiz_next: "Далее",
    quiz_result_see: "Смотреть результат",
    quiz_result_title: "Анализ завершен!",
    quiz_result_desc:
      "На основе ваших ответов мы создали для вас индивидуальный уход за кожей.",
    quiz_result_products_title: "Рекомендуемые продукты",
    quiz_result_retake: "Пройти тест заново",
    quiz_result_full: "Смотреть результат полностью",
    product1: "Сыворотка Neo Hydration",
    product2: "Маска Quantum Repair",
    product3: "Увлажняющий крем Daily Protection",
    q1: "Какова ваша основная проблема с кожей?",
    q2: "Как бы вы описали свой тип кожи?",
    q3: "Как часто у вас бывают высыпания?",
    q4: "Как выглядит ваш текущий уход за кожей?",
    o1a: "Старение",
    o1b: "Акне",
    o1c: "Гиперпигментация",
    o1d: "Сухость",
    o1e: "Чувствительность",
    o2a: "Жирная",
    o2b: "Сухая",
    o2c: "Комбинированная",
    o2d: "Нормальная",
    o2e: "Не уверен",
    o3a: "Никогда",
    o3b: "Редко",
    o3c: "Иногда",
    o3d: "Часто",
    o3e: "Очень часто",
    o4a: "Базовый",
    o4b: "Средний",
    o4c: "Продвинутый",
    o4d: "Нет",
    o4e: "Хочу начать",
  },
};

// Helper pentru traduceri
function getCurrentLang() {
  return localStorage.getItem("site-lang") || "ro";
}
function t(key) {
  const lang = getCurrentLang();
  return (
    (window.translations &&
      window.translations[lang] &&
      window.translations[lang][key]) ||
    key
  );
}

// Datele quizului (poți folosi și structura ta cu quizDataRO/EN/RU dacă vrei)
const questions = [
  t("q1") || "What's your primary skin concern?",
  t("q2") || "How would you describe your skin type?",
  t("q3") || "How often do you experience breakouts?",
  t("q4") || "What's your current skincare routine like?",
];

const options = [
  [
    t("o1a") || "Aging",
    t("o1b") || "Acne",
    t("o1c") || "Hyperpigmentation",
    t("o1d") || "Dryness",
    t("o1e") || "Sensitivity",
  ],
  [
    t("o2a") || "Oily",
    t("o2b") || "Dry",
    t("o2c") || "Combination",
    t("o2d") || "Normal",
    t("o2e") || "Not sure",
  ],
  [
    t("o3a") || "Never",
    t("o3b") || "Rarely",
    t("o3c") || "Sometimes",
    t("o3d") || "Often",
    t("o3e") || "Very Often",
  ],
  [
    t("o4a") || "Basic",
    t("o4b") || "Intermediate",
    t("o4c") || "Advanced",
    t("o4d") || "None",
    t("o4e") || "Looking to start",
  ],
];

let current = 0;
const total = questions.length;
const progress = document.getElementById("quiz-progress");
const bar = document.getElementById("quiz-bar-inner");
const question = document.getElementById("quiz-question");
const optionsBox = document.getElementById("quiz-options");
const prevBtn = document.getElementById("quiz-prev");
const nextBtn = document.getElementById("quiz-next");

let answers = Array(total).fill(null);

function renderQuiz() {
  // Ascunde secțiunea de rezultate dacă există
  const resultSection = document.getElementById("quiz-result-section");
  if (resultSection) resultSection.remove();

  // Titlu quiz (dacă ai un element cu id="quiz-title")
  const quizTitle = document.getElementById("quiz-title");
  if (quizTitle) quizTitle.textContent = t("quiz_title");

  progress.textContent = t("quiz_progress")
    .replace("1", current + 1)
    .replace("4", total);

  bar.style.width = `${((current + 1) / total) * 100}%`;
  question.textContent = questions[current];

  // Render options
  optionsBox.innerHTML = "";
  options[current].forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "quiz-option";
    btn.textContent = opt;
    if (answers[current] === idx) btn.classList.add("selected");
    btn.onclick = () => {
      answers[current] = idx;
      renderQuiz();
    };
    optionsBox.appendChild(btn);
  });

  // Butoane Previous/Next
  prevBtn.disabled = current === 0;
  nextBtn.disabled = answers[current] === null;

  // Previous cu săgeată la stânga și traducere
  prevBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#eafdf8" viewBox="0 0 256 256" style="transform:rotate(180deg)">
      <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"/>
    </svg>
    <span>${t("quiz_prev")}</span>
  `;

  // Next cu săgeată la dreapta și traducere
  if (current === total - 1) {
    nextBtn.innerHTML = `
      <span>${t("quiz_result_see")}</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#eafdf8" viewBox="0 0 256 256">
        <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"/>
      </svg>`;
  } else {
    nextBtn.innerHTML = `
      <span>${t("quiz_next")}</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#eafdf8" viewBox="0 0 256 256">
        <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"/>
      </svg>`;
  }
}

prevBtn.onclick = () => {
  if (current > 0) {
    current--;
    renderQuiz();
  }
};

nextBtn.onclick = () => {
  if (current < total - 1) {
    current++;
    renderQuiz();
  } else if (current === total - 1 && answers[current] !== null) {
    showResults();
  }
};

function showResults() {
  // Elimină orice secțiune de rezultate existentă
  const oldResult = document.getElementById("quiz-result-section");
  if (oldResult) oldResult.remove();

  // Ascunde complet quiz-ul
  document.querySelector(".quiz-card").style.display = "none";

  // Creează secțiunea de rezultate
  const resultSection = document.createElement("div");
  resultSection.id = "quiz-result-section";
  resultSection.innerHTML = `
    <div class="result-icon">
      <svg viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="22" fill="none" stroke="var(--primary-300)" stroke-width="4"/>
        <path d="M16 24l6 6 10-12" fill="none" stroke="var(--primary-300)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <h2>${t("quiz_result_title")}</h2>
    <div class="result-desc">${t("quiz_result_desc")}</div>
    <div class="result-products">
      <div class="result-products-title">${t(
        "quiz_result_products_title"
      )}</div>
      <ul class="result-products-list">
        <li><span class="result-dot"></span>${t("product1")}</li>
        <li><span class="result-dot"></span>${t("product2")}</li>
        <li><span class="result-dot"></span>${t("product3")}</li>
      </ul>
    </div>
    <div class="result-actions">
      <button id="retake-quiz-btn" class="result-btn retake">${t(
        "quiz_result_retake"
      )}</button>
      <button id="view-results-btn" class="result-btn full-results">${t(
        "quiz_result_full"
      )}</button>
    </div>
  `;

  // Adaugă rezultatul după quiz-bg
  document.querySelector(".quiz-bg").appendChild(resultSection);

  // Retake Quiz
  document.getElementById("retake-quiz-btn").onclick = () => {
    // Reset quiz
    answers = Array(total).fill(null);
    current = 0;
    // Show quiz again
    document.querySelector(".quiz-card").style.display = "";
    resultSection.remove();
    renderQuiz();
  };

  // View Full Results (poți adăuga funcționalitate suplimentară aici)
  document.getElementById("view-results-btn").onclick = () => {
    alert(t("quiz_result_full"));
  };
}

// Pentru traducere live: apelează renderQuiz() după orice schimbare de limbă!
renderQuiz();
window.renderQuiz = renderQuiz;
