(function () {
  var WHATSAPP_NUMBER = '919487549271';
  var overlay = document.getElementById('contactOverlay');
  var form = document.getElementById('contactForm');
  var openBtn = document.getElementById('openContactModal');
  var closeBtn = document.getElementById('contactClose');
  var errorEl = document.getElementById('contactError');

  if (!overlay || !form || !openBtn) return;

  var scrollLockY = 0;

  function preventBackgroundScroll(e) {
    if (!overlay.classList.contains('is-open')) return;
    if (e.target.closest && e.target.closest('.contact-modal')) return;
    e.preventDefault();
  }

  function setOpen(open) {
    overlay.classList.toggle('is-open', open);
    overlay.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.documentElement.classList.toggle('contact-modal-open', open);

    if (open) {
      scrollLockY = window.scrollY || window.pageYOffset || 0;
      document.body.style.position = 'fixed';
      document.body.style.top = '-' + scrollLockY + 'px';
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      closeBtn && closeBtn.focus();
    } else {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollLockY);
      form.reset();
      if (errorEl) errorEl.textContent = '';
      openBtn.focus();
    }
  }

  document.addEventListener('wheel', preventBackgroundScroll, { passive: false });
  document.addEventListener('touchmove', preventBackgroundScroll, { passive: false });

  function showError(msg) {
    if (errorEl) errorEl.textContent = msg;
  }

  openBtn.addEventListener('click', function (e) {
    e.preventDefault();
    setOpen(true);
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', function () {
      setOpen(false);
    });
  }

  overlay.addEventListener('click', function (e) {
    if (
      e.target === overlay ||
      e.target.id === 'contactBackdrop' ||
      e.target.classList.contains('contact-backdrop')
    ) {
      setOpen(false);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
      setOpen(false);
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    showError('');

    var firstName = form.firstName.value.trim();
    var lastName = form.lastName.value.trim();
    var phone = form.phone.value.trim();
    var email = form.email.value.trim();
    var message = form.message.value.trim();
    var terms = form.terms.checked;

    if (!firstName) {
      showError('Please enter your first name.');
      form.firstName.focus();
      return;
    }
    if (!phone) {
      showError('Please enter your phone number.');
      form.phone.focus();
      return;
    }
    if (!email) {
      showError('Please enter your mail id.');
      form.email.focus();
      return;
    }
    if (!terms) {
      showError('Please agree to the terms and conditions.');
      form.terms.focus();
      return;
    }

    var lines = [
      '*SussexForex — Contact enquiry*',
      '',
      '*First name:* ' + firstName,
      '*Last name:* ' + (lastName || '—'),
      '*Phone number:* ' + phone,
      '*Mail id:* ' + email,
      '',
      '*Message:*',
      message || '—',
      '',
      '_Terms agreed:_ Yes'
    ];

    var url =
      'https://wa.me/' +
      WHATSAPP_NUMBER +
      '?text=' +
      encodeURIComponent(lines.join('\n'));

    window.open(url, '_blank', 'noopener,noreferrer');
    setOpen(false);
  });
})();
