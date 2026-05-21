/* =========================================================
   Panteón Rococó · Neza · 30 Mayo 2026
   main.js — reemplaza el main.js de la plantilla con la
   funcionalidad mínima requerida + countdown del evento.
   ========================================================= */

(function () {
    'use strict';

    // ============ AOS init ============
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true, offset: 60 });
    }

    // ============ Preloader ============
    window.addEventListener('load', function () {
        var pre = document.querySelector('.preloader');
        if (pre) {
            pre.style.transition = 'opacity .5s ease';
            pre.style.opacity = '0';
            setTimeout(function () { pre.style.display = 'none'; }, 600);
        }
    });

    // ============ Header sticky ============
    var header = document.querySelector('.header.header-five');
    function onScroll() {
        if (!header) return;
        if (window.scrollY > 50) header.classList.add('sticky', 'menu-fixed');
        else header.classList.remove('sticky', 'menu-fixed');
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ============ Mobile menu toggle (offcanvas) ============
    var mobileMenu = document.querySelector('.mobile-menu');
    var mobileMenuOpen = document.querySelector('.toggle-mobileMenu');
    var mobileMenuClose = document.querySelector('.mobile-menu .close-button');
    var overlay = document.querySelector('.overlay');

    function openMobileMenu() {
        if (mobileMenu) mobileMenu.classList.add('mobile-menu-open');
        if (overlay) overlay.classList.add('show');
        document.body.classList.add('mobile-menu-open');
    }
    function closeMobileMenu() {
        if (mobileMenu) mobileMenu.classList.remove('mobile-menu-open');
        if (overlay) overlay.classList.remove('show');
        document.body.classList.remove('mobile-menu-open');
    }
    if (mobileMenuOpen) mobileMenuOpen.addEventListener('click', openMobileMenu);
    if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);
    if (overlay) overlay.addEventListener('click', closeMobileMenu);

    // Close mobile menu when clicking a link
    if (mobileMenu) {
        mobileMenu.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', closeMobileMenu);
        });
    }

    // ============ Smooth scroll for anchor links ============
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (!href || href === '#') return;
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                var offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });

    // ============ Scroll-to-top progress button ============
    var progressWrap = document.querySelector('.progress-wrap');
    var progressPath = document.querySelector('.progress-wrap path');
    if (progressPath) {
        var pathLength = progressPath.getTotalLength();
        progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
        progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
        progressPath.style.strokeDashoffset = pathLength;
        progressPath.getBoundingClientRect();
        progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';
        function updateProgress() {
            var scroll = window.pageYOffset;
            var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            var progress = pathLength - (scroll * pathLength / height);
            progressPath.style.strokeDashoffset = progress;
            if (progressWrap) {
                if (scroll > 200) progressWrap.classList.add('active-progress');
                else progressWrap.classList.remove('active-progress');
            }
        }
        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();
        if (progressWrap) {
            progressWrap.addEventListener('click', function (e) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }

    // ============ COUNTDOWN ============
    // Target: Saturday May 30, 2026 at 20:30 Mexico City time (UTC-6).
    var targetDate = new Date('2026-05-30T20:30:00-06:00').getTime();
    var cdNodes = {
        days:    document.querySelector('[data-cd="days"]'),
        hours:   document.querySelector('[data-cd="hours"]'),
        minutes: document.querySelector('[data-cd="minutes"]')
    };
    function pad(n) { return n < 10 ? '0' + n : '' + n; }
    function updateCountdown() {
        var diff = targetDate - Date.now();
        if (diff <= 0) {
            if (cdNodes.days)    cdNodes.days.textContent    = '00';
            if (cdNodes.hours)   cdNodes.hours.textContent   = '00';
            if (cdNodes.minutes) cdNodes.minutes.textContent = '00';
            var el = document.getElementById('countdown');
            if (el) el.classList.add('finished');
            return false;
        }
        var d = Math.floor(diff / (1000 * 60 * 60 * 24));
        var h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        if (cdNodes.days)    cdNodes.days.textContent    = pad(d);
        if (cdNodes.hours)   cdNodes.hours.textContent   = pad(h);
        if (cdNodes.minutes) cdNodes.minutes.textContent = pad(m);
        return true;
    }
    if (cdNodes.days) {
        updateCountdown();
        var cdInterval = setInterval(function () {
            if (updateCountdown() === false) clearInterval(cdInterval);
        }, 1000);
    }

    // ============ Apply background-image from data-background-image ============
    document.querySelectorAll('[data-background-image]').forEach(function (el) {
        var bg = el.getAttribute('data-background-image');
        if (bg) el.style.backgroundImage = "url('" + bg + "')";
    });

    // ============ Disable distracting custom cursor on touch devices / small screens ============
    if ('ontouchstart' in window || window.innerWidth < 1024) {
        document.querySelectorAll('#magic-cursor, .cursor, .dot').forEach(function (el) {
            el.style.display = 'none';
        });
    }

    // ============ EVENT REGISTRATION FORM (Web3Forms) ============
    var regForm = document.getElementById('event-register-form');
    if (regForm) {
        var statusEl = document.getElementById('form-event-status');
        var submitBtn = regForm.querySelector('button[type="submit"]');
        var phoneInput = regForm.querySelector('[name="telefono"]');
        if (phoneInput) {
            phoneInput.addEventListener('input', function () {
                this.value = this.value.replace(/\D/g, '').slice(0, 10);
            });
        }
        regForm.addEventListener('submit', function (e) {
            e.preventDefault();
            regForm.classList.add('was-validated');
            if (!regForm.checkValidity()) {
                statusEl.className = 'form-event-status mt-4 error';
                statusEl.textContent = 'Revisa los campos requeridos.';
                return;
            }
            var data = new FormData(regForm);
            statusEl.className = 'form-event-status mt-4';
            statusEl.textContent = 'Enviando…';
            if (submitBtn) submitBtn.disabled = true;
            fetch('https://api.web3forms.com/submit', { method: 'POST', body: data })
                .then(function (res) { return res.json(); })
                .then(function (json) {
                    if (json && json.success) {
                        statusEl.classList.add('success');
                        statusEl.textContent = '¡Listo! Te enviaremos información del evento por WhatsApp y correo.';
                        regForm.reset();
                        regForm.classList.remove('was-validated');
                        try { if (typeof fbq === 'function') fbq('track', 'Lead'); } catch (err) {}
                        try { if (typeof gtag === 'function') gtag('event', 'generate_lead', { event_category: 'registro', event_label: 'evento_neza' }); } catch (err) {}
                        try { if (typeof ttq !== 'undefined' && ttq && typeof ttq.track === 'function') ttq.track('SubmitForm'); } catch (err) {}
                    } else {
                        statusEl.classList.add('error');
                        statusEl.textContent = (json && json.message) || 'No pudimos enviar tu registro. Inténtalo de nuevo.';
                    }
                })
                .catch(function () {
                    statusEl.classList.add('error');
                    statusEl.textContent = 'Error de conexión. Inténtalo de nuevo en un momento.';
                })
                .then(function () {
                    if (submitBtn) submitBtn.disabled = false;
                });
        });
    }

})();
