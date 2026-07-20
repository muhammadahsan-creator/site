(() => {
  const body = document.body;
  const loader = document.querySelector('.site-loader');
  const enterPage = () => {
    window.setTimeout(() => {
      loader?.classList.add('loader-hidden');
      loader?.setAttribute('aria-hidden', 'true');
      body.classList.remove('page-loading');
      body.classList.add('page-entered');
    }, 650);
  };
  if (document.readyState === 'complete') enterPage();
  else window.addEventListener('load', enterPage, { once: true });
  window.setTimeout(() => {
    loader?.classList.add('loader-hidden');
    body.classList.remove('page-loading');
    body.classList.add('page-entered');
  }, 1800);

  const targets = document.querySelectorAll('.proof,.section-heading,.service-card,.editorial-image,.editorial-copy,.client-heading,.process-card,.pricing-heading,.pricing-card,.pricing-note,.visual-duo article,.about-visual,.about-main,.tool-grid>div,.industries,.testimonial-heading,.testimonial-card,.portfolio-cta,.faq-intro,.faq-list,.contact');
  targets.forEach((target, index) => {
    target.classList.add('reveal-item');
    target.style.setProperty('--reveal-delay', Math.min(index % 4, 3) * 70 + 'ms');
  });
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -45px' });
  targets.forEach((target) => observer.observe(target));

  const processGrid = document.querySelector('.process-grid');
  const processBar = document.querySelector('.process-progress span');
  const processCards = [...document.querySelectorAll('.process-card')];
  let furthestStep = 0;
  let progressAnimation = null;
  const completionTimers = [];
  const advanceProcess = (index) => {
    const previousStep = furthestStep;
    const nextStep = Math.max(furthestStep, index + 1);
    if (nextStep === furthestStep) return;
    furthestStep = nextStep;
    const targetPercent = (furthestStep / processCards.length) * 100;
    processGrid?.style.setProperty('--process-progress', String(furthestStep / processCards.length));
    if (processBar?.parentElement) {
      const trackWidth = processBar.parentElement.getBoundingClientRect().width || 1;
      const currentPercent = Math.min(100, processBar.getBoundingClientRect().width / trackWidth * 100);
      progressAnimation?.cancel();
      processBar.style.width = currentPercent + '%';
      progressAnimation = processBar.animate(
        [{ width: currentPercent + '%' }, { width: targetPercent + '%' }],
        { duration: 1050, easing: 'cubic-bezier(.16,.78,.18,1)', fill: 'forwards' }
      );
      progressAnimation.onfinish = () => {
        processBar.style.width = targetPercent + '%';
        progressAnimation?.cancel();
        progressAnimation = null;
      };
    }
    const travelled = Math.max(1, furthestStep - previousStep);
    for (let cardIndex = previousStep; cardIndex < furthestStep; cardIndex += 1) {
      const delay = ((cardIndex - previousStep + 1) / travelled) * 920;
      completionTimers.push(window.setTimeout(() => processCards[cardIndex]?.classList.add('process-complete'), delay));
    }
  };
  processCards.forEach((card, index) => {
    const handler = () => advanceProcess(index);
    card.addEventListener('pointerenter', handler);
    card.addEventListener('focusin', handler);
    card.addEventListener('click', handler);
  });

  document.querySelectorAll('.mobile-menu a').forEach((link) => {
    link.addEventListener('click', () => link.closest('details')?.removeAttribute('open'));
  });
})();

// Export source: Sites live version 16, commit 0676760a454da750dd0df1d459500b0320f2609b
