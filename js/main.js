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

  /* ---------- Forms (AJAX email submission via FormSubmit) ---------- */
  document.querySelectorAll('form[data-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var success = form.parentNode.querySelector('.form-success');
      var submitBtn = form.querySelector('button[type="submit"]');
      var originalLabel = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      }).then(function (res) {
        if (!res.ok) throw new Error('Request failed');
        form.style.display = 'none';
        if (success) {
          success.classList.add('show');
          success.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }).catch(function () {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalLabel; }
        alert('Sorry, something went wrong sending your request. Please try again, or contact us directly on WhatsApp or by phone.');
      });
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

  /* ---------- Blog card slider (multi-card, step-by-one) ---------- */
  document.querySelectorAll('[data-card-slider]').forEach(function (root) {
    var track = root.querySelector('.blog-slider__track');
    var cards = Array.prototype.slice.call(root.querySelectorAll('.blog-card'));
    var prevBtn = root.querySelector('.blog-slider__arrow--prev');
    var nextBtn = root.querySelector('.blog-slider__arrow--next');
    if (!track || !cards.length) return;

    var index = 0, autoplay, AUTOPLAY_MS = 6000;

    function step() {
      var gap = parseFloat(getComputedStyle(track).gap) || 24;
      return cards[0].getBoundingClientRect().width + gap;
    }
    function maxIndex() {
      var viewport = root.querySelector('.blog-slider__viewport');
      var visible = Math.max(1, Math.round(viewport.clientWidth / step()));
      return Math.max(0, cards.length - visible);
    }
    function render() {
      track.style.transform = 'translateX(-' + (index * step()) + 'px)';
    }
    function goTo(i) { index = Math.max(0, Math.min(i, maxIndex())); render(); }
    function next() { index >= maxIndex() ? goTo(0) : goTo(index + 1); }
    function prev() { goTo(index - 1); }
    function restart() {
      clearInterval(autoplay);
      autoplay = setInterval(next, AUTOPLAY_MS);
    }

    if (nextBtn) nextBtn.addEventListener('click', function () { next(); restart(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); restart(); });
    root.addEventListener('mouseenter', function () { clearInterval(autoplay); });
    root.addEventListener('mouseleave', restart);
    window.addEventListener('resize', render);

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

  /* ---------- Chatbot widget ---------- */
  (function () {
    var root = document.querySelector('[data-chatbot]');
    if (!root) return;

    var launcher = root.querySelector('.chatbot__launcher');
    var closeBtn = root.querySelector('.chatbot__close');
    var body = root.querySelector('[data-chatbot-body]');
    var quickWrap = root.querySelector('[data-chatbot-quick]');
    var form = root.querySelector('[data-chatbot-form]');
    var input = root.querySelector('[data-chatbot-input]');
    var AVATAR = 'images/Avatar/Links ChatBot.png';
    var LEAD_KEY = 'linksChatLeadCaptured';
    var SKIP_KEY = 'linksChatLeadSkipped';
    var lastUserQuestion = '';
    var leadHandled = localStorage.getItem(LEAD_KEY) === '1';
    var greeted = false;

    var KB = [
      { keys: ['turnaround', 'how long', 'time taken', 'fast', 'quick', 'delivery', 'deliver'], a: 'Most valuations are delivered within <b>4–48 hours</b> of inspection. The physical inspection itself only takes 1–2 hours.' },
      { keys: ['price', 'cost', 'fee', 'charge', 'how much', 'expensive', 'cheap'], a: 'Pricing depends on the vehicle and service type. Tell us a bit about what you need and our team will send an exact quote — or <a href="book-valuation.html">book a valuation</a> and we will confirm pricing with you directly.' },
      { keys: ['service', 'offer', 'insurance valuation', 'bank valuation', 'fleet', 'court report', 'accident', 'pre-purchase', 'prepurchase', 'inspection'], a: 'We offer Insurance Valuation, Bank / Loan Collateral Valuation, Fleet Valuation, Accident Assessment, Pre-Purchase Inspection, and Court Reports. See the full list on our <a href="services.html">Services</a> page.' },
      { keys: ['branch', 'location', 'where are you', 'nairobi', 'mombasa', 'kisumu', 'nakuru', 'eldoret', 'office'], a: 'Links has <b>25 branches</b> across Kenya plus mobile assessors who can come to you. Our head office is at Pamstech House, Westlands, Nairobi. See all <a href="branches.html">branches</a>.' },
      { keys: ['book', 'appointment', 'schedule', 'valuation request', 'get a valuation'], a: 'You can book directly here: <a href="book-valuation.html">Book a Valuation</a> — most requests are confirmed within 2 business hours.' },
      { keys: ['document', 'logbook', 'national id', 'requirement', 'what do i need'], a: 'You will need your vehicle logbook, national ID or passport, and current insurance certificate (for insurance valuations).' },
      { keys: ['licens', 'accredit', 'legit', 'trust', 'm.a.a.k', 'maak', 'ira'], a: 'Links is dual-licensed by both <b>M.A.A.K</b> and <b>I.R.A</b> — the only firm of our scale in Kenya with both. Our reports are accepted by 100+ banks, insurers, SACCOs and MFBs.' },
      { keys: ['contact', 'phone', 'call', 'email', 'reach', 'talk to someone', 'human'], a: 'Call us on <b>0722 388 260</b>, email <a href="mailto:info@linksvaluers.com">info@linksvaluers.com</a>, or message us on <a href="https://wa.me/254708412668" target="_blank" rel="noopener">WhatsApp</a>.' },
      { keys: ['hi', 'hello', 'hey', 'habari', 'sasa'], a: 'Hello! 👋 Ask me about turnaround times, pricing, services, or branches — or I can connect you with our team.' },
      { keys: ['thank'], a: 'You are welcome! Anything else I can help with?' }
    ];

    var QUICK_REPLIES = [
      'How long does a valuation take?',
      'What services do you offer?',
      'Where are your branches?',
      'Book a valuation'
    ];

    function findAnswer(text) {
      var t = text.toLowerCase();
      for (var i = 0; i < KB.length; i++) {
        for (var j = 0; j < KB[i].keys.length; j++) {
          if (t.indexOf(KB[i].keys[j]) > -1) return KB[i].a;
        }
      }
      return null;
    }

    function scrollDown() { body.scrollTop = body.scrollHeight; }

    function addMessage(role, html) {
      var msg = document.createElement('div');
      msg.className = 'chatbot__msg chatbot__msg--' + role;
      var bubble = '<div class="chatbot__bubble">' + html + '</div>';
      msg.innerHTML = role === 'bot' ? ('<img class="chatbot__msg-avatar" src="' + AVATAR + '" alt="">' + bubble) : bubble;
      body.appendChild(msg);
      scrollDown();
      return msg;
    }

    function showTyping(cb) {
      var typing = document.createElement('div');
      typing.className = 'chatbot__msg chatbot__msg--bot';
      typing.innerHTML = '<img class="chatbot__msg-avatar" src="' + AVATAR + '" alt=""><div class="chatbot__bubble chatbot__typing"><span></span><span></span><span></span></div>';
      body.appendChild(typing);
      scrollDown();
      setTimeout(function () { typing.remove(); cb(); }, 550 + Math.random() * 350);
    }

    function botSay(html) {
      showTyping(function () { addMessage('bot', html); maybeAskForLead(); });
    }

    function maybeAskForLead() {
      if (leadHandled) return;
      if (sessionStorage.getItem(SKIP_KEY) === '1') return;
      if (root.dataset.leadAsked === '1') return;
      root.dataset.leadAsked = '1';
      setTimeout(function () { showTyping(renderLeadForm); }, 450);
    }

    function renderLeadForm() {
      var msg = document.createElement('div');
      msg.className = 'chatbot__msg chatbot__msg--bot';
      msg.innerHTML =
        '<img class="chatbot__msg-avatar" src="' + AVATAR + '" alt="">' +
        '<div class="chatbot__bubble">Would you like a specialist to follow up directly? Leave your details and we’ll reach out.' +
        '<form class="chatbot__lead-form" data-chatbot-lead>' +
        '<input type="text" name="name" placeholder="Your name" required>' +
        '<input type="text" name="contact" placeholder="Phone or email" required>' +
        '<div class="chatbot__lead-btns">' +
        '<button type="button" class="is-ghost" data-lead-skip>Maybe later</button>' +
        '<button type="submit" class="is-primary">Send</button>' +
        '</div></form></div>';
      body.appendChild(msg);
      scrollDown();

      var leadForm = msg.querySelector('[data-chatbot-lead]');
      var skipBtn = msg.querySelector('[data-lead-skip]');

      skipBtn.addEventListener('click', function () {
        sessionStorage.setItem(SKIP_KEY, '1');
        leadForm.outerHTML = '<p style="margin-top:8px;font-size:0.84rem;color:var(--grey)">No problem — ask me anything else!</p>';
      });

      leadForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var fd = new FormData(leadForm);
        fd.append('_subject', 'New Chatbot Lead — Links Valuers');
        fd.append('_template', 'table');
        fd.append('_captcha', 'false');
        fd.append('last_question', lastUserQuestion || '(none)');
        fd.append('page', location.href);
        var btn = leadForm.querySelector('.is-primary');
        btn.disabled = true; btn.textContent = 'Sending…';

        fetch('https://formsubmit.co/info@linksvaluers.com', {
          method: 'POST', body: fd, headers: { Accept: 'application/json' }
        }).then(function (res) {
          if (!res.ok) throw new Error('failed');
          localStorage.setItem(LEAD_KEY, '1');
          leadHandled = true;
          var name = (fd.get('name') || '').toString().split(' ')[0];
          leadForm.outerHTML = '<p style="margin-top:8px;font-size:0.84rem">Thanks' + (name ? ' ' + name : '') + '! A Links team member will reach out to you shortly.</p>';
        }).catch(function () {
          btn.disabled = false; btn.textContent = 'Send';
          alert('Something went wrong sending your details. Please try again or message us on WhatsApp.');
        });
      });
    }

    function handleUserMessage(text) {
      text = (text || '').trim();
      if (!text) return;
      lastUserQuestion = text;
      addMessage('user', text);
      var answer = findAnswer(text);
      if (answer) {
        botSay(answer);
      } else {
        botSay('I don’t have an exact answer for that, but our team can help directly — call <b>0722 388 260</b> or message us on <a href="https://wa.me/254708412668" target="_blank" rel="noopener">WhatsApp</a>.');
      }
    }

    QUICK_REPLIES.forEach(function (q) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chatbot__chip';
      chip.textContent = q;
      chip.addEventListener('click', function () { handleUserMessage(q); });
      quickWrap.appendChild(chip);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var val = input.value;
      input.value = '';
      handleUserMessage(val);
    });

    function openChat() {
      root.classList.add('is-open');
      if (!greeted) {
        greeted = true;
        showTyping(function () {
          addMessage('bot', 'Hello! 👋 I’m the Links Assistant. Ask me about turnaround times, pricing, services, or branches.');
        });
      }
      setTimeout(function () { input.focus(); }, 250);
    }
    function closeChat() { root.classList.remove('is-open'); }

    launcher.addEventListener('click', function () {
      root.classList.contains('is-open') ? closeChat() : openChat();
    });
    if (closeBtn) closeBtn.addEventListener('click', closeChat);
  })();
})();
