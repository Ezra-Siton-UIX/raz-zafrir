// ---------- הגדרות אנימציה משותפות ----------
const gsap_setting = {
  reveal_duration: 0.65,
  easing_type: "cubic-bezier(0.22, 1, 0.36, 1)",
  stagger_duration: 0.1
};

// ---------- אנימציית פיצול טקסט (split) ----------
function split_text() {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  const splits = document.querySelectorAll("[split]");
  const split_heros = document.querySelectorAll("[split_hero]");

  const project_about_RTB_titles = document.querySelectorAll("[project_about_RTB2] :is(h1, h2, h3, h4, h5, h6)");
  project_about_RTB_titles.forEach((project_about_RTB_title) => {
    project_about_RTB_title.setAttribute("trigger_box", "");
  });

  const project_about_RTB_paragraphs = document.querySelectorAll("[project_about_RTB2] p");
  project_about_RTB_paragraphs.forEach((project_about_RTB_paragraph) => {
    project_about_RTB_paragraph.setAttribute("trigger_box", "");
  });

  if (split_heros.length > 0) {
    gsap.set("[split_hero]", { opacity: 1 });

    let split_hero = new SplitText("[split_hero]", {
      type: "words, lines",
      mask: "words",
      linesClass: "line++",
    });

    gsap.from(split_hero.words, {
      yPercent: -120,
      opacity: 1,
      duration: 0.7,
      ease: gsap_setting.easing_type,
      stagger: 0.2
    });
  }

  if (splits.length > 0) {
    gsap.set("[split]", { opacity: 1 });

    ScrollTrigger.batch("[split]", {
      interval: 0,
      batchMax: 5,
      onEnter: batch => {
        batch.forEach((split_text_node) => {
          if (!split_text_node.hasAttribute('data-split-text')) {
            split_text_node.setAttribute('data-split-text', 'true');
            split_text_animation(split_text_node);
          }
        });
      },
      stagger: 0.2,
      once: true,
      markers: false,
      ease: gsap_setting.easing_type,
    });
  }

  function split_text_animation(split_text_node) {
    const closest_section = split_text_node.closest('section');

    new SplitText(split_text_node, {
      type: "words, lines",
      mask: "words",
      linesClass: "line",
      autoSplit: true,
      onSplit: (instance) => {
        return gsap.from(instance.words, {
          yPercent: -120,
          opacity: 0,
          stagger: gsap_setting.stagger_duration,
          duration: gsap_setting.reveal_duration,
          ease: gsap_setting.easing_type,
          scrollTrigger: {
            trigger: closest_section,
            markers: false,
            scrub: false,
          }
        });
      }
    });
  }
}

// ---------- אנימציית פייד לאלמנטים (trigger_box) ----------
function trigger_box_animation() {
  gsap.set("[trigger_box]", { y: 32 });

  ScrollTrigger.batch("[trigger_box]", {
    interval: 0.25,
    batchMax: 10,
    onEnter: batch => {
      gsap.to(batch, {
        duration: gsap_setting.reveal_duration * 1.1,
        autoAlpha: 1,
        y: 0,
        delay: 0.0,
        ease: gsap_setting.easing_type,
        stagger: { each: gsap_setting.stagger_duration },
        scrollTrigger: {
          start: "top bottom",
          end: "bottom top"
        }
      });
    },
  });
}

// ---------- גלילה חלקה (Lenis) ----------
// מסונכרן עם ה-ticker וה-ScrollTrigger של GSAP כדי שהאנימציות והגלילה
// יתעדכנו על אותו פריים בדיוק
function init_smooth_scroll() {
  const lenis = new Lenis();

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

// ---------- ניווט: גלילה לעוגן + סימון קישור פעיל ----------
function scroll_spy(lenis) {
  const siteHeader = document.querySelector('.site-nav');

  // גלילה בלחיצה על קישורי עוגן (#id), עם קיזוז לגובה ההדר הדביק
  // כדי שהסקשן לא ייעצר מתחת להדר או מוסתר מאחוריו
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      const headerHeight = siteHeader ? siteHeader.offsetHeight : 0;
      lenis.scrollTo(target, { offset: -headerHeight });
    });
  });

  // סימון קישור הניווט הפעיל (active) לפי הסקשן שנמצא כרגע בתצוגה
  const navLinks = document.querySelectorAll('nav.links a[href^="#"]');
  const navSections = Array.from(navLinks)
    .map(link => {
      const href = link.getAttribute('href');
      return href.length > 1 ? document.querySelector(href) : null;
    })
    .filter(Boolean);

  // מצב עדכני לכל סקשן: האם הוא נמצא כרגע ב"אזור הפעיל" של המסך
  const sectionIntersecting = new Map();

  // IntersectionObserver עוקב אחרי הסקשנים ומעדכן את הקישור הפעיל תוך כדי גלילה
  // (כולל כיבוי הסימון כשלא נמצאים בתוך אף סקשן, למשל בחזרה לראש הדף)
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      sectionIntersecting.set(entry.target.id, entry.isIntersecting);
    });

    const activeSection = navSections.find(section => sectionIntersecting.get(section.id));
    navLinks.forEach(link => {
      link.classList.toggle('active', !!activeSection && link.getAttribute('href') === `#${activeSection.id}`);
    });
  }, { rootMargin: '-96px 0px -60% 0px', threshold: 0 });

  navSections.forEach(section => sectionObserver.observe(section));
}

// ---------- הפעלה ----------
const lenis = init_smooth_scroll();
split_text();
trigger_box_animation();
scroll_spy(lenis);
