/* ============================================================
   script.js — Мифы о детской миопии
   Интерактив: sticky header, бургер, Intersection Observer, активная навигация
   ============================================================ */

'use strict';

// ============================================================
// 1. STICKY HEADER — тень при прокрутке
// ============================================================
const header = document.getElementById('site-header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}, { passive: true });


// ============================================================
// 2. БУРГЕР-МЕНЮ (мобильный)
// ============================================================
const burger    = document.getElementById('burger');
const navLinks  = document.getElementById('nav-links');

if (burger && navLinks) {
  burger.addEventListener('click', () => {
    const isOpen = burger.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
  });

  // Закрываем меню при клике на ссылку
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // Закрываем меню при клике вне
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) {
      burger.classList.remove('open');
      navLinks.classList.remove('open');
    }
  });
}


// ============================================================
// 3. REVEAL ANIMATIONS — появление элементов при скролле
// ============================================================
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Отписываемся после первого показа (анимируем один раз)
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,      // элемент видим на 12%
    rootMargin: '0px 0px -40px 0px'
  }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


// ============================================================
// 4. АКТИВНАЯ ССЫЛКА В НАВИГАЦИИ (по секции в viewport)
// ============================================================
const sections  = document.querySelectorAll('main section[id]');
const navItems  = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(link => {
          const isActive = link.getAttribute('href') === `#${id}`;
          link.classList.toggle('active', isActive);
        });
      }
    });
  },
  {
    rootMargin: '-30% 0px -60% 0px'
  }
);

sections.forEach(sec => navObserver.observe(sec));


// ============================================================
// 5. ПЛАВНЫЙ SCROLL для всех якорных ссылок
// (страховка на случай если браузер не поддерживает scroll-behavior CSS)
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const headerHeight = header ? header.offsetHeight : 0;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    }
  });
});


// ============================================================
// 6. MICRO-INTERACTION — маскот покачивается при наведении
// ============================================================
const mascotHero = document.getElementById('mascot-hero');
if (mascotHero) {
  mascotHero.addEventListener('mouseenter', () => {
    mascotHero.style.animationPlayState = 'paused';
    mascotHero.style.transform = 'scale(1.04) rotate(-3deg)';
    mascotHero.style.transition = 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)';
  });
  mascotHero.addEventListener('mouseleave', () => {
    mascotHero.style.transform = '';
    mascotHero.style.transition = '';
    // небольшая задержка перед возобновлением анимации float
    setTimeout(() => {
      mascotHero.style.animationPlayState = '';
    }, 300);
  });
}


// ============================================================
// 7. MYTH CARDS — аккордеон (клик по заголовку разворачивает тело)
// ============================================================
document.querySelectorAll('.myth-card').forEach(card => {
  const btn  = card.querySelector('.myth-card-header');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const isOpen = card.classList.contains('is-open');

    // Закрываем все остальные карточки
    document.querySelectorAll('.myth-card.is-open').forEach(other => {
      if (other !== card) {
        other.classList.remove('is-open');
        other.querySelector('.myth-card-header')
             .setAttribute('aria-expanded', 'false');
      }
    });

    // Переключаем текущую
    card.classList.toggle('is-open', !isOpen);
    btn.setAttribute('aria-expanded', String(!isOpen));

    // Плавный скролл к карточке если открываем
    if (!isOpen) {
      setTimeout(() => {
        const top = card.getBoundingClientRect().top + window.scrollY
                    - (header ? header.offsetHeight : 0) - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }, 50);
    }
  });
});


// ============================================================
// 8. УТИЛИТА — логируем готовность страницы
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  console.info('✅ МиоПравда: страница загружена.');
  // TODO: здесь можно инициализировать аналитику (Яндекс.Метрика, GA и т.д.)
});
