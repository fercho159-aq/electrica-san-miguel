/* =========================================================
   ELÉCTRICA SAN MIGUEL · Interactividad
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* ============ HEADER SCROLL EFFECT ============ */
    const header = document.getElementById('header');
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const current = window.pageYOffset;
        if (current > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
        lastScroll = current;
    }, { passive: true });

    /* ============ MOBILE MENU ============ */
    const hamburger = document.getElementById('hamburgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('overlay');
    const closeMenu = document.getElementById('closeMenuBtn');

    const openMobileMenu = () => {
        mobileMenu.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    const closeMobileMenu = () => {
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    hamburger?.addEventListener('click', openMobileMenu);
    closeMenu?.addEventListener('click', closeMobileMenu);
    overlay?.addEventListener('click', closeMobileMenu);

    /* ============ MOBILE ACCORDIONS ============ */
    document.querySelectorAll('.accordion').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.target;
            const content = document.getElementById(targetId);
            btn.classList.toggle('open');
            content?.classList.toggle('open');
        });
    });

    /* ============ BUSCADOR PREDICTIVO ============ */
    const searchInput = document.getElementById('predictiveSearch');
    const suggestionsBox = document.getElementById('searchSuggestions');

    const productDB = [
        { name: 'Cable THHN #12 AWG', category: 'Conductores', price: '$2,480' },
        { name: 'Cable THHN #14 AWG', category: 'Conductores', price: '$1,890' },
        { name: 'Cable THW #10 AWG', category: 'Conductores', price: '$3,450' },
        { name: 'Panel LED 60x60 40W', category: 'Iluminación', price: '$489' },
        { name: 'Panel LED Backlit 60x60', category: 'Iluminación', price: '$689' },
        { name: 'Reflector LED 100W Industrial', category: 'Iluminación', price: '$1,250' },
        { name: 'Foco LED 9W E27', category: 'Iluminación', price: '$45' },
        { name: 'Interruptor Termomagnético 2x40A', category: 'Control', price: '$385' },
        { name: 'Interruptor Schneider Acti9 1P', category: 'Control', price: '$220' },
        { name: 'Contactor Schneider LC1D09', category: 'Automatización', price: '$942' },
        { name: 'Apagador Simon 75 Sencillo', category: 'Apagadores', price: '$85' },
        { name: 'Toma BTicino Magic Blanca', category: 'Tomas', price: '$68' },
        { name: 'Canaleta PVC 20x10mm', category: 'Canalización', price: '$28' },
        { name: 'Tubería Conduit EMT 1/2"', category: 'Canalización', price: '$95' },
        { name: 'Panel Solar 450W Monocristalino', category: 'Energía Solar', price: '$3,890' },
        { name: 'Inversor Híbrido 5kW', category: 'Energía Solar', price: '$28,500' },
        { name: 'Cámara IP PTZ 4MP', category: 'Seguridad', price: '$4,250' }
    ];

    const renderSuggestions = (query) => {
        if (!query || query.length < 2) {
            suggestionsBox.classList.remove('active');
            suggestionsBox.innerHTML = '';
            return;
        }
        const q = query.toLowerCase();
        const matches = productDB.filter(p =>
            p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
        ).slice(0, 6);

        if (matches.length === 0) {
            suggestionsBox.innerHTML = `
                <div class="suggestion-item">
                    <span class="suggestion-icon">🔍</span>
                    <div class="suggestion-text">Sin resultados para "<b>${query}</b>" — Solicita cotización personalizada</div>
                </div>`;
        } else {
            suggestionsBox.innerHTML = matches.map(p => {
                const highlighted = p.name.replace(new RegExp(`(${q})`, 'gi'), '<b>$1</b>');
                return `
                    <div class="suggestion-item">
                        <span class="suggestion-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        </span>
                        <div style="flex:1;display:flex;justify-content:space-between;align-items:center;gap:12px">
                            <div>
                                <div class="suggestion-text">${highlighted}</div>
                                <div class="suggestion-category">${p.category}</div>
                            </div>
                            <strong style="color:var(--red);font-size:13px;white-space:nowrap">${p.price}</strong>
                        </div>
                    </div>`;
            }).join('');
        }
        suggestionsBox.classList.add('active');
    };

    searchInput?.addEventListener('input', e => renderSuggestions(e.target.value));
    searchInput?.addEventListener('focus', e => { if (e.target.value) renderSuggestions(e.target.value); });
    document.addEventListener('click', e => {
        if (!e.target.closest('.hero-search')) suggestionsBox?.classList.remove('active');
    });

    /* Tags populares */
    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', () => {
            if (searchInput) {
                searchInput.value = tag.textContent;
                searchInput.focus();
                renderSuggestions(tag.textContent);
            }
        });
    });

    /* ============ CONTADOR REGRESIVO (OFERTAS) ============ */
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const countdownEl = document.getElementById('countdown');

    let totalSeconds = 23 * 3600 + 42 * 60 + 18;

    const tick = () => {
        if (totalSeconds <= 0) totalSeconds = 24 * 3600;
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        const pad = n => String(n).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = pad(h);
        if (minutesEl) minutesEl.textContent = pad(m);
        if (secondsEl) secondsEl.textContent = pad(s);
        if (countdownEl) countdownEl.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
        totalSeconds--;
    };
    tick();
    setInterval(tick, 1000);

    /* ============ CONTADOR ANIMADO TRUST ============ */
    const counters = document.querySelectorAll('.trust-num');
    const animateCounter = (el) => {
        const target = parseInt(el.dataset.count, 10);
        let current = 0;
        const duration = 1600;
        const step = target / (duration / 16);
        const update = () => {
            current += step;
            if (current >= target) {
                el.textContent = target;
                return;
            }
            el.textContent = Math.floor(current);
            requestAnimationFrame(update);
        };
        update();
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });
    counters.forEach(c => counterObserver.observe(c));

    /* ============ FEED DE ACTIVIDAD EN VIVO ============ */
    const feed = document.getElementById('activityFeed');
    const activities = [
        { initials: 'MC', name: 'María C.', action: 'cotizó <em>200m cable UTP</em>', time: 'Ahora mismo' },
        { initials: 'DR', name: 'Diego R.', action: 'compró <em>48 focos LED 9W</em>', time: 'Hace 3 seg' },
        { initials: 'PF', name: 'Patricia F.', action: 'agendó asesoría técnica', time: 'Hace 15 seg' },
        { initials: 'GH', name: 'Gabriel H.', action: 'descargó catálogo <em>Simon</em>', time: 'Hace 30 seg' },
        { initials: 'IM', name: 'Isabel M.', action: 'pidió <em>16 paneles LED</em>', time: 'Hace 45 seg' },
        { initials: 'JR', name: 'Javier R.', action: 'cotizó <em>tablero 200A</em>', time: 'Hace 1 min' },
        { initials: 'NS', name: 'Natalia S.', action: 'compró <em>500m conduit EMT</em>', time: 'Hace 1 min' },
        { initials: 'FL', name: 'Fernando L.', action: 'solicitó crédito empresarial', time: 'Hace 2 min' }
    ];

    const rotateFeed = () => {
        if (!feed) return;
        const random = activities[Math.floor(Math.random() * activities.length)];
        const newItem = document.createElement('div');
        newItem.className = 'activity-item';
        newItem.style.opacity = '0';
        newItem.style.transform = 'translateY(-10px)';
        newItem.style.transition = 'all 0.4s ease';
        newItem.innerHTML = `
            <div class="activity-avatar">${random.initials}</div>
            <div>
                <strong>${random.name}</strong> ${random.action}
                <small>${random.time}</small>
            </div>`;

        feed.insertBefore(newItem, feed.firstChild);
        requestAnimationFrame(() => {
            newItem.style.opacity = '1';
            newItem.style.transform = 'translateY(0)';
        });

        while (feed.children.length > 3) {
            const last = feed.lastChild;
            last.style.opacity = '0';
            last.style.transform = 'translateY(10px)';
            setTimeout(() => last.remove(), 400);
        }
    };
    setInterval(rotateFeed, 4500);

    /* ============ SMOOTH SCROLL ANCHORS ============ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.length < 2) return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = 78 + 38;
                window.scrollTo({
                    top: target.offsetTop - offset,
                    behavior: 'smooth'
                });
                closeMobileMenu();
            }
        });
    });

    /* ============ FADE-IN ANIMATIONS ============ */
    const fadeTargets = document.querySelectorAll('.category-card, .offer-card, .service-card, .testimonial-card, .blog-card');
    fadeTargets.forEach(el => el.classList.add('fade-in'));

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, idx) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), idx * 80);
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    fadeTargets.forEach(el => fadeObserver.observe(el));

    /* ============ CTA CART BADGE ANIMATION ============ */
    document.querySelectorAll('.btn-primary').forEach(btn => {
        if (btn.textContent.includes('cotización') || btn.textContent.includes('Agregar')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const badge = document.querySelector('.cart-badge');
                if (badge) {
                    const current = parseInt(badge.textContent, 10) || 0;
                    badge.textContent = current + 1;
                    badge.style.transition = 'transform 0.3s ease';
                    badge.style.transform = 'scale(1.4)';
                    setTimeout(() => { badge.style.transform = 'scale(1)'; }, 300);
                }

                /* Toast feedback */
                showToast('✓ Agregado a tu cotización');
            });
        }
    });

    /* ============ TOAST NOTIFICATION ============ */
    function showToast(message) {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '100px',
            right: '24px',
            padding: '14px 22px',
            background: '#0A0A0F',
            color: '#FFFFFF',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 12px 32px rgba(10,10,15,0.25)',
            zIndex: '1000',
            opacity: '0',
            transform: 'translateY(20px)',
            transition: 'all 0.3s ease',
            borderLeft: '3px solid #E30613'
        });
        document.body.appendChild(toast);
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        });
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }

    /* ============ HERO PARALLAX SUTIL ============ */
    const heroGlow = document.querySelector('.hero-bg-glow');
    if (heroGlow && window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            if (scrolled < 800) {
                heroGlow.style.transform = `translate(${scrolled * 0.1}px, ${scrolled * 0.3}px)`;
            }
        }, { passive: true });
    }

    /* ============ DETECCIÓN DE INTENCIÓN DE SALIR ============ */
    let exitIntentShown = false;
    document.addEventListener('mouseleave', (e) => {
        if (exitIntentShown || e.clientY > 0 || window.innerWidth < 768) return;
        exitIntentShown = true;
        showToast('⚡ ¡Espera! Llévate 15% OFF en tu primera compra');
    });

    console.log('%c⚡ Eléctrica San Miguel', 'color:#E30613;font-size:20px;font-weight:bold');
    console.log('%c50 años iluminando México', 'color:#8A8A95;font-size:12px');
});
