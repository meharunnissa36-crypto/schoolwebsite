/**
 * Basharat Higher Secondary School (BHSS)
 * Main Interactive & Smooth Animation Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all core interactive components
  initScrollProgress();
  initStickyHeader();
  initHeroSlider();
  initScrollAnimations();
  initCounterAnimations();
  initWingFilters();
  initBackToTop();
  initModals();
  initMobileNav();
  initDrawerSearch();
  initAnnouncementTicker();
});

/* --------------------------------------------------------------------------
   1. SCROLL PROGRESS BAR
   -------------------------------------------------------------------------- */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   2. STICKY GLASSMORPHIC HEADER & ACTIVE LINK HIGHLIGHT
   -------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.querySelector('.main-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Smooth anchor scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId.startsWith('#')) return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Close mobile nav if open
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu && navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
        }
      }
    });
  });
}

/* --------------------------------------------------------------------------
   3. HERO SLIDER CAROUSEL
   -------------------------------------------------------------------------- */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const prevBtn = document.querySelector('.hero-arrow.prev');
  const nextBtn = document.querySelector('.hero-arrow.next');

  if (!slides.length) return;

  let currentSlide = 0;
  let slideInterval;
  const slideDuration = 6000;

  const goToSlide = (index) => {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentSlide = index;
  };

  const nextSlide = () => {
    let nextIndex = (currentSlide + 1) % slides.length;
    goToSlide(nextIndex);
  };

  const prevSlide = () => {
    let prevIndex = (currentSlide - 1 + slides.length) % slides.length;
    goToSlide(prevIndex);
  };

  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetInterval(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetInterval(); });

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      goToSlide(idx);
      resetInterval();
    });
  });

  const startInterval = () => {
    slideInterval = setInterval(nextSlide, slideDuration);
  };

  const resetInterval = () => {
    clearInterval(slideInterval);
    startInterval();
  };

  startInterval();

  // Pause on hover
  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    heroSection.addEventListener('mouseenter', () => clearInterval(slideInterval));
    heroSection.addEventListener('mouseleave', startInterval);
  }
}

/* --------------------------------------------------------------------------
   4. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const animElements = document.querySelectorAll('.anim-reveal, .anim-left, .anim-right');
  
  if (!('IntersectionObserver' in window)) {
    animElements.forEach(el => el.classList.add('anim-active'));
    return;
  }

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('anim-active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  animElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   5. COUNTER NUMBER ANIMATION
   -------------------------------------------------------------------------- */
function initCounterAnimations() {
  const counterElements = document.querySelectorAll('.metric-number[data-target]');
  if (!counterElements.length) return;

  let hasAnimated = false;

  const countUpObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        counterElements.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const suffix = counter.getAttribute('data-suffix') || '';
          const duration = 2000;
          const stepTime = 30;
          const totalSteps = duration / stepTime;
          const increment = target / totalSteps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.textContent = target + suffix;
              clearInterval(timer);
            } else {
              counter.textContent = Math.floor(current) + suffix;
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const section = document.querySelector('.ranked-banner-section');
  if (section) {
    countUpObserver.observe(section);
  }
}

/* --------------------------------------------------------------------------
   6. ACADEMIC WINGS FILTER TABS
   -------------------------------------------------------------------------- */
function initWingFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const wingCards = document.querySelectorAll('.wing-card');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      wingCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   7. BACK TO TOP BUTTON
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backTopBtns = document.querySelectorAll('.float-back-top');
  if (!backTopBtns.length) return;

  window.addEventListener('scroll', () => {
    const isScrolled = window.scrollY > 350;
    backTopBtns.forEach(btn => {
      if (isScrolled) {
        btn.classList.add('show');
      } else {
        btn.classList.remove('show');
      }
    });
  }, { passive: true });

  backTopBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  });
}

/* --------------------------------------------------------------------------
   8. INTERACTIVE MODALS (ADMISSION INQUIRY & SEARCH)
   -------------------------------------------------------------------------- */
function initModals() {
  // Modal Triggers
  const openInquiryBtns = document.querySelectorAll('[data-open-modal="inquiry"]');
  const modalOverlay = document.getElementById('inquiry-modal');
  const closeBtns = document.querySelectorAll('.modal-close-btn, .modal-close-action');

  if (modalOverlay) {
    openInquiryBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeModal = () => {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    };

    closeBtns.forEach(btn => btn.addEventListener('click', closeModal));

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModal();
      }
    });

    // Inquiry Form Handling (WhatsApp & Portal)
    const inquiryForm = document.getElementById('admission-inquiry-form');
    const portalBtn = document.getElementById('btn-submit-portal');

    if (inquiryForm) {
      const getFormData = () => {
        const studentName = document.getElementById('student-name')?.value.trim() || 'N/A';
        const studentDob = document.getElementById('student-dob')?.value || 'N/A';
        const gradeSelect = document.getElementById('applying-grade');
        const applyingGrade = gradeSelect && gradeSelect.selectedIndex >= 0 ? gradeSelect.options[gradeSelect.selectedIndex].text : 'N/A';
        const boardingSelect = document.getElementById('boarding-preference');
        const boardingPref = boardingSelect && boardingSelect.selectedIndex >= 0 ? boardingSelect.options[boardingSelect.selectedIndex].text : 'N/A';
        const parentName = document.getElementById('parent-name')?.value.trim() || 'N/A';
        const parentPhone = document.getElementById('parent-phone')?.value.trim() || 'N/A';
        const parentEmail = document.getElementById('parent-email')?.value.trim() || 'N/A';
        const inquiryMsg = document.getElementById('inquiry-message')?.value.trim() || '';

        return { studentName, studentDob, applyingGrade, boardingPref, parentName, parentPhone, parentEmail, inquiryMsg };
      };

      // Primary submit: Send Application via WhatsApp
      inquiryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = getFormData();
        const whatsappBtn = document.getElementById('btn-submit-whatsapp');
        const originalText = whatsappBtn ? whatsappBtn.innerHTML : '';

        if (whatsappBtn) {
          whatsappBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting WhatsApp...';
          whatsappBtn.disabled = true;
        }

        const schoolWhatsApp = "923338011180";
        const messageText = 
`*ADMISSION INQUIRY - BASHARAT HIGHER SECONDARY SCHOOL*
🏛 *Session:* 2026–2027

👤 *Student Name:* ${data.studentName}
📅 *Date of Birth:* ${data.studentDob}
📚 *Applying Grade / Wing:* ${data.applyingGrade}
🏡 *Enrollment:* ${data.boardingPref}
👨‍💼 *Father / Guardian:* ${data.parentName}
📞 *Contact Phone:* ${data.parentPhone}
✉️ *Email:* ${data.parentEmail}
${data.inquiryMsg ? `💬 *Questions / Notes:* ${data.inquiryMsg}\n` : ''}
Assalam-o-Alaikum! Please provide the prospectus and admission test schedule. Thank you!`;

        const waUrl = `https://wa.me/${schoolWhatsApp}?text=${encodeURIComponent(messageText)}`;

        setTimeout(() => {
          window.open(waUrl, '_blank');
          showToast("Application created! Opening WhatsApp with Basharat H.S.S Admissions...");

          if (whatsappBtn) {
            whatsappBtn.innerHTML = '<i class="fas fa-check-circle"></i> Message Sent!';
            whatsappBtn.style.background = '#10B981';
          }

          setTimeout(() => {
            closeModal();
            inquiryForm.reset();
            if (whatsappBtn) {
              whatsappBtn.innerHTML = originalText;
              whatsappBtn.disabled = false;
              whatsappBtn.style.background = '';
            }
          }, 1600);
        }, 600);
      });

      // Secondary submit: Online Portal
      if (portalBtn) {
        portalBtn.addEventListener('click', () => {
          if (!inquiryForm.checkValidity()) {
            inquiryForm.reportValidity();
            return;
          }
          const originalText = portalBtn.innerHTML;
          portalBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
          portalBtn.disabled = true;

          setTimeout(() => {
            showToast("Application submitted to Basharat H.S.S online registry!");
            portalBtn.innerHTML = '<i class="fas fa-check-circle"></i> Registered!';
            setTimeout(() => {
              closeModal();
              inquiryForm.reset();
              portalBtn.innerHTML = originalText;
              portalBtn.disabled = false;
            }, 1500);
          }, 1000);
        });
      }
    }
  }

  // Quick Search Overlay
  const searchBtn = document.querySelector('.btn-search');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const query = prompt("Search Basharat Higher Secondary School:\n(e.g., Admissions, FSc Pre-Medical, Horse Riding, Fee Structure, Cambridge IGCSE)");
      if (query && query.trim()) {
        showToast(`Searching campus resources for: "${query}"...`);
      }
    });
  }
}

/* --------------------------------------------------------------------------
   9. MOBILE NAVIGATION DRAWER & BACKDROP
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const hamburgerBtns = document.querySelectorAll('.hamburger-btn, #siteMenuBtn, #mobileMenuBtn');
  const siteDrawer = document.getElementById('siteDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop') ||
                         document.getElementById('siteDrawerBackdrop') ||
                         document.querySelector('.site-drawer-backdrop');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');

  // Fallback to old navMenu if siteDrawer isn't rendered on a page
  const navMenu = document.querySelector('.nav-menu');
  const oldBackdrop = document.querySelector('.nav-backdrop');
  const oldCloseBtn = document.querySelector('.mobile-nav-close');

  const openDrawer = () => {
    if (siteDrawer) {
      siteDrawer.classList.add('open');
      if (drawerBackdrop) drawerBackdrop.classList.add('active');
    } else if (navMenu) {
      navMenu.classList.add('open');
      if (oldBackdrop) oldBackdrop.classList.add('active');
    }
    hamburgerBtns.forEach(btn => btn.classList.add('active'));
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    if (siteDrawer) {
      siteDrawer.classList.remove('open');
      if (drawerBackdrop) drawerBackdrop.classList.remove('active');
    }
    if (navMenu) {
      navMenu.classList.remove('open');
      if (oldBackdrop) oldBackdrop.classList.remove('active');
    }
    hamburgerBtns.forEach(btn => btn.classList.remove('active'));
    document.body.style.overflow = '';
  };

  hamburgerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = (siteDrawer && siteDrawer.classList.contains('open')) ||
                     (navMenu && navMenu.classList.contains('open'));
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  });

  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', (e) => { e.preventDefault(); closeDrawer(); });
  if (oldCloseBtn) oldCloseBtn.addEventListener('click', (e) => { e.preventDefault(); closeDrawer(); });
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);
  if (oldBackdrop) oldBackdrop.addEventListener('click', closeDrawer);

  // Close with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
    }
  });

  // Close when clicking internal links inside the drawer
  const allDrawerLinks = document.querySelectorAll('.site-drawer a, .nav-menu a');
  allDrawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      const parentItem = link.closest('.nav-item');
      const hasDropdown = parentItem && parentItem.querySelector('.dropdown-menu');
      if (!hasDropdown || link.classList.contains('dropdown-item') || link.closest('.site-drawer')) {
        closeDrawer();
      }
    });
  });

  // Mobile drawer accordion submenu toggle
  const drawerToggles = document.querySelectorAll('.drawer-nav-toggle');
  drawerToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const parentItem = toggle.closest('.drawer-nav-item');
      if (!parentItem) return;
      const isCurrentlyOpen = parentItem.classList.contains('open');

      // Close other open accordions
      document.querySelectorAll('.drawer-nav-item.open').forEach(openItem => {
        if (openItem !== parentItem) {
          openItem.classList.remove('open');
          const btn = openItem.querySelector('.drawer-nav-toggle');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        }
      });

      if (isCurrentlyOpen) {
        parentItem.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      } else {
        parentItem.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Mobile accordion for desktop fallback dropdown menus
  const navItemsWithDrop = document.querySelectorAll('.nav-item');
  navItemsWithDrop.forEach(item => {
    const link = item.querySelector('.nav-link');
    const drop = item.querySelector('.dropdown-menu');
    if (drop && link) {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 1180) {
          e.preventDefault();
          const isOpen = item.classList.contains('open-drop');
          navItemsWithDrop.forEach(i => i.classList.remove('open-drop'));
          if (!isOpen) {
            item.classList.add('open-drop');
          }
        }
      });
    }
  });
}

/* --------------------------------------------------------------------------
   10. TOAST NOTIFICATION UTILITY
   -------------------------------------------------------------------------- */
function showToast(message) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fas fa-bell" style="color: var(--color-gold);"></i> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}

/* --------------------------------------------------------------------------
   11. ANNOUNCEMENT TICKER PAUSE ON HOVER
   -------------------------------------------------------------------------- */
function initAnnouncementTicker() {
  const ticker = document.querySelector('.ticker-content');
  if (ticker) {
    ticker.addEventListener('mouseenter', () => {
      ticker.style.animationPlayState = 'paused';
    });
    ticker.addEventListener('mouseleave', () => {
      ticker.style.animationPlayState = 'running';
    });
  }
}

/* --------------------------------------------------------------------------
   12. MOBILE DRAWER REAL-TIME SEARCH FILTER
   -------------------------------------------------------------------------- */
function initDrawerSearch() {
  const searchInput = document.getElementById('drawerSearchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const groups = document.querySelectorAll('.site-drawer .drawer-card-group');
    const cards = document.querySelectorAll('.site-drawer .drawer-links-grid > .drawer-link-card');
    const sections = document.querySelectorAll('.site-drawer .drawer-section');

    groups.forEach(group => {
      const text = group.textContent.toLowerCase();
      if (!query || text.includes(query)) {
        group.style.display = '';
      } else {
        group.style.display = 'none';
      }
    });

    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      if (!query || text.includes(query)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });

    sections.forEach(sec => {
      const visible = sec.querySelectorAll('.drawer-card-group:not([style*="display: none"]), .drawer-links-grid > .drawer-link-card:not([style*="display: none"])');
      if (query && visible.length === 0) {
        sec.style.display = 'none';
      } else {
        sec.style.display = '';
      }
    });
  });
}

