/* Links Valuers — site interactions */
(function () {
  'use strict';

  /* ---------- Mobile menu ---------- */
  var burger = document.querySelector('.nav__burger');
  var body = document.body;
  if (burger) {
    burger.addEventListener('click', function () {
      var open = body.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.querySelectorAll('.mobile-menu a').forEach(function (a) {
      a.addEventListener('click', function () { body.classList.remove('menu-open'); });
    });
  }

  /* ---------- Active nav link ---------- */
  var path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .mobile-menu a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === path) a.classList.add('is-active');
  });

  /* ---------- Footer year ---------- */
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { ro.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Animated stat counters ---------- */
  function animateCount(el) {
    var raw = el.getAttribute('data-count');
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    var decimals = (raw.indexOf('.') > -1) ? raw.split('.')[1].length : 0;
    var target = parseFloat(raw);
    var dur = 1600, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = (target * eased).toFixed(decimals);
      el.textContent = prefix + Number(val).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = prefix + Number(target).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); co.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(function (el) {
      el.textContent = (el.getAttribute('data-prefix') || '') + el.getAttribute('data-count') + (el.getAttribute('data-suffix') || '');
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-q').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = q.closest('.faq-item');
      var ans = item.querySelector('.faq-a');
      var isOpen = item.classList.contains('open');
      if (isOpen) {
        item.classList.remove('open');
        ans.style.maxHeight = null;
        q.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('open');
        ans.style.maxHeight = ans.scrollHeight + 'px';
        q.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- FAQ category tabs ---------- */
  document.querySelectorAll('.faq-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      var cat = tab.getAttribute('data-cat');
      document.querySelectorAll('.faq-tab').forEach(function (t) { t.classList.remove('is-active'); });
      tab.classList.add('is-active');
      document.querySelectorAll('.faq-cat').forEach(function (c) {
        c.classList.toggle('is-active', c.getAttribute('data-cat') === cat);
      });
    });
  });

  /* ---------- Service type prefill (book-valuation) ---------- */
  var params = new URLSearchParams(location.search);
  var presetType = params.get('type');
  if (presetType) {
    var sel = document.getElementById('service-type');
    if (sel) {
      var map = {
        insurance: 'Insurance Valuation', bank: 'Bank / Loan Collateral Valuation',
        fleet: 'Fleet Valuation', accident: 'Accident Assessment',
        'pre-purchase': 'Pre-Purchase Inspection', court: 'Court Report'
      };
      var want = map[presetType];
      if (want) Array.prototype.forEach.call(sel.options, function (o) { if (o.value === want) sel.value = want; });
    }
  }

  /* ---------- Forms (demo handling) ---------- */
  document.querySelectorAll('form[data-demo]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var success = form.parentNode.querySelector('.form-success');
      form.style.display = 'none';
      if (success) {
        success.classList.add('show');
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  /* ---------- WhatsApp form alternative ---------- */
  document.querySelectorAll('[data-wa-send]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var form = btn.closest('form');
      var name = form && form.querySelector('[name="name"]') ? form.querySelector('[name="name"]').value : '';
      var msg = 'Hello Links Valuers, I would like to book a valuation.' + (name ? ' My name is ' + name + '.' : '');
      window.open('https://wa.me/254708412668?text=' + encodeURIComponent(msg), '_blank');
    });
  });

  /* ---------- Image slider / carousel ---------- */
  document.querySelectorAll('[data-slider]').forEach(function (root) {
    var track = root.querySelector('.tslider__track');
    var slides = Array.prototype.slice.call(root.querySelectorAll('.tslider__slide'));
    var dotsWrap = root.querySelector('.tslider__dots');
    var prevBtn = root.querySelector('.tslider__arrow--prev');
    var nextBtn = root.querySelector('.tslider__arrow--next');
    if (!track || !slides.length) return;

    var index = 0, autoplay, AUTOPLAY_MS = 5500;

    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'tslider__dot';
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', function () { goTo(i); restart(); });
      dotsWrap.appendChild(dot);
    });
    var dots = Array.prototype.slice.call(dotsWrap.querySelectorAll('.tslider__dot'));

    function render() {
      track.style.transform = 'translateX(-' + (index * 100) + '%)';
      dots.forEach(function (d, i) { d.classList.toggle('is-active', i === index); });
    }
    function goTo(i) { index = (i + slides.length) % slides.length; render(); }
    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }
    function restart() {
      clearInterval(autoplay);
      autoplay = setInterval(next, AUTOPLAY_MS);
    }

    if (nextBtn) nextBtn.addEventListener('click', function () { next(); restart(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); restart(); });
    root.addEventListener('mouseenter', function () { clearInterval(autoplay); });
    root.addEventListener('mouseleave', restart);

    var touchStartX = null;
    root.addEventListener('touchstart', function (e) { touchStartX = e.touches[0].clientX; clearInterval(autoplay); }, { passive: true });
    root.addEventListener('touchend', function (e) {
      if (touchStartX === null) return;
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); }
      touchStartX = null;
      restart();
    }, { passive: true });

    render();
    restart();
  });
})();
