/**
 * Main Application Logic for Divine Astra Landing Page
 */

document.addEventListener('DOMContentLoaded', () => {
  initCountdownTimer();
  renderContent();
  initTabs();
  initFaqAccordion();
  initModal();
  initForms();
  initLiveToasts();
});

// 1. Urgency Countdown Timer (Counts down to midnight or 2h 45m cycle)
function initCountdownTimer() {
  const timerElement = document.getElementById('offerTimer');
  if (!timerElement) return;

  let totalSeconds = 2 * 3600 + 44 * 60 + 19; // 02:44:19

  function update() {
    if (totalSeconds <= 0) {
      totalSeconds = 3 * 3600 + 15 * 60; // reset
    }
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    const pad = (n) => String(n).padStart(2, '0');
    timerElement.textContent = `${pad(h)}h : ${pad(m)}m : ${pad(s)}s`;
    totalSeconds--;
  }

  update();
  setInterval(update, 1000);
}

// 2. Render Dynamic Components from SITE_DATA
function renderContent() {
  if (typeof SITE_DATA === 'undefined') return;

  // Render Benefits Grid
  const benefitsGrid = document.getElementById('benefitsGrid');
  if (benefitsGrid && SITE_DATA.benefits) {
    benefitsGrid.innerHTML = SITE_DATA.benefits.map(b => `
      <div class="benefit-card">
        <div class="benefit-icon-box">${b.icon}</div>
        <h3 class="benefit-title">${b.title}</h3>
        <p class="benefit-title-hi">${b.titleHi}</p>
        <p class="benefit-desc">${b.desc}</p>
      </div>
    `).join('');
  }

  // Render Ritual Steps (Vidhi)
  const vidhiGrid = document.getElementById('vidhiGrid');
  if (vidhiGrid && SITE_DATA.ritualSteps) {
    vidhiGrid.innerHTML = SITE_DATA.ritualSteps.map(step => `
      <div class="vidhi-card">
        <div class="vidhi-img-wrap">
          <img src="${step.image}" alt="${step.title}" class="vidhi-img" loading="lazy" />
          <div class="vidhi-step-pill">STEP ${step.step}</div>
        </div>
        <div class="vidhi-body">
          <h3 class="vidhi-title">${step.title}</h3>
          <p class="vidhi-title-hi">${step.titleHi}</p>
          <p class="vidhi-desc">${step.desc}</p>
        </div>
      </div>
    `).join('');
  }

  // Render Bonuses
  const bonusesGrid = document.getElementById('bonusesGrid');
  if (bonusesGrid && SITE_DATA.bonuses) {
    bonusesGrid.innerHTML = SITE_DATA.bonuses.map(item => `
      <div class="bonus-card">
        <div class="bonus-badge">${item.tag}</div>
        <div class="bonus-img-wrap">
          <img src="${item.image}" alt="${item.title}" class="bonus-img" loading="lazy" />
        </div>
        <div class="bonus-worth">${item.worth}</div>
        <h3 class="bonus-title">${item.title}</h3>
        <p class="bonus-title-hi">${item.titleHi}</p>
        <p class="bonus-desc">${item.desc}</p>
      </div>
    `).join('');
  }

  // Render Testimonials
  const testimonialsGrid = document.getElementById('testimonialsGrid');
  if (testimonialsGrid && SITE_DATA.testimonials) {
    testimonialsGrid.innerHTML = SITE_DATA.testimonials.map(t => `
      <div class="testimonial-card">
        <div>
          <div class="testimonial-header">
            <img src="${t.image}" alt="${t.name}" class="client-avatar" loading="lazy" />
            <div>
              <div class="client-name">${t.name}</div>
              <div class="client-location">${t.location}</div>
              <div class="verified-tag">
                <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
                Verified Buyer
              </div>
            </div>
          </div>
          <div class="rating-stars">★★★★★</div>
          <h4 class="testimonial-headline">"${t.headline}"</h4>
          <p class="testimonial-quote">"${t.quote}"</p>
        </div>
      </div>
    `).join('');
  }

  // Render FAQs
  const faqContainer = document.getElementById('faqContainer');
  if (faqContainer && SITE_DATA.faqs) {
    faqContainer.innerHTML = SITE_DATA.faqs.map((f, i) => `
      <div class="faq-card ${i === 0 ? 'open' : ''}">
        <button class="faq-question" type="button" aria-expanded="${i === 0 ? 'true' : 'false'}">
          <span>${f.q}</span>
          <span class="faq-icon">+</span>
        </button>
        <div class="faq-answer">
          <p>${f.a}</p>
        </div>
      </div>
    `).join('');
  }
}

// 3. Tab Switching
function initTabs() {
  const tabs = document.querySelectorAll('.order-tab');
  const panes = document.querySelectorAll('.tab-pane');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-tab');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');
    });
  });
}

// 4. FAQ Accordion Interaction
function initFaqAccordion() {
  const faqContainer = document.getElementById('faqContainer');
  if (!faqContainer) return;

  faqContainer.addEventListener('click', (e) => {
    const questionBtn = e.target.closest('.faq-question');
    if (!questionBtn) return;

    const card = questionBtn.closest('.faq-card');
    const isOpen = card.classList.contains('open');

    // Close others
    document.querySelectorAll('.faq-card').forEach(c => {
      c.classList.remove('open');
      c.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
    });

    if (!isOpen) {
      card.classList.add('open');
      questionBtn.setAttribute('aria-expanded', 'true');
    }
  });
}

// 5. Modal Lead Capture System
function initModal() {
  const modal = document.getElementById('consultationModal');
  const openButtons = document.querySelectorAll('.btn-open-consultation');
  const closeButton = document.getElementById('modalCloseBtn');

  if (!modal) return;

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeButton) {
    closeButton.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

// 6. Form Handling & Confirmations
function initForms() {
  const orderForm = document.getElementById('bogoOrderForm');
  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = orderForm.querySelector('.btn-submit-order');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Processing Sacred Consecration...</span>';

      setTimeout(() => {
        alert('🎉 Congratulations! Your BUY 1 GET 1 FREE 7 Mukhi Nepal Rudraksha order has been confirmed.\n\nOur Acharya will consecrate both beads in your name and dispatch them via Express BlueDart courier within 24 hours.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        orderForm.reset();
      }, 1200);
    });
  }

  const modalForm = document.getElementById('modalConsultForm');
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const modal = document.getElementById('consultationModal');
      alert('🙏 Pranam! Your consultation slot has been reserved. Our senior Vedic Astrologer / Pandit Ji will call you directly on WhatsApp within 30 minutes.');
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
      modalForm.reset();
    });
  }
}

// 7. Live Verified Buyer Notification Toasts
function initLiveToasts() {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const sampleNotifications = [
    { name: "Rahul S.", city: "Bengaluru", action: "claimed BUY 1 GET 1 FREE offer", time: "2 mins ago" },
    { name: "Meena K.", city: "Pune", action: "booked 1-on-1 Pandit Ji Call", time: "4 mins ago" },
    { name: "Vikas M.", city: "Delhi NCR", action: "ordered 7 Mukhi Nepal Rudraksha", time: "7 mins ago" },
    { name: "Suresh P.", city: "Ahmedabad", action: "verified Nepal Lab Certificate", time: "9 mins ago" },
    { name: "Anita D.", city: "Mumbai", action: "received Free Gemstone Report", time: "11 mins ago" }
  ];

  let index = 0;

  function showToast() {
    const item = sampleNotifications[index];
    const toast = document.createElement('div');
    toast.className = 'toast-item';
    toast.innerHTML = `
      <div style="font-size: 1.3rem;">🪔</div>
      <div>
        <strong>${item.name}</strong> (${item.city}) ${item.action}.
        <div style="font-size: 0.72rem; color: #888;">${item.time} • Verified</div>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 4200);

    index = (index + 1) % sampleNotifications.length;
  }

  // Show first toast after 4s, then every 20s
  setTimeout(showToast, 4000);
  setInterval(showToast, 20000);
}
