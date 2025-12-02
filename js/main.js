// script.js — Sidebar moderno + SPA + contenido completo (orden correcto)
document.addEventListener('DOMContentLoaded', () => {
    /* ====== ELEMENTOS ====== */
    const content = document.getElementById('content');
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body') || document.querySelector('#modal #modal-body');
    const closeModalBtn = document.getElementById('closeModal');
    const menuButtons = document.querySelectorAll('.menu-btn');
    const submenuButtons = document.querySelectorAll('.submenu button');
    const menuHasSub = document.querySelectorAll('.menu-btn.has-sub');
    const sidebar = document.querySelector('.sidebar');

    // Safety: ensure modalBody exists (if markup differs)
    function ensureModalBody() {
        let mb = document.getElementById('modal-body');
        if (!mb) {
            // create inside .modal-content
            const mc = document.querySelector('.modal .modal-content');
            mb = document.createElement('div');
            mb.id = 'modal-body';
            mc.appendChild(mb);
        }
        return mb;
    }

    /* ====== DATA: CONTENT_FICHAS (completo, organizado) ======
       Cada key es usada como sección y para la galería/modal.
       He incluido información ampliada tomada de la presentación (citas incluidas).
    */
    const CONTENT_FICHAS = {
        // Vestuario
        'vestuario-prendas': {
            title: 'Prendas y materiales',
            html: `<p>Sombreros de paja o lana; ruanas (de un solo color o a rayas); ponchos; pantalones; camisas; calzoncillos; mantillas; pañuelos para la cabeza; mochilas de fique; alpargatas; vituallas; morrales; monteras; vaquetas (piel curtida de ternera); cordobanes (piel curtida de cabra); badanas (piel curtida de oveja); lienzos; frazadas; bayetas; mantas; esteras de esparto; sogas y canastos.</p>
             <p class="muted">Fuente: Presentación Sala 4. :contentReference[oaicite:0]{index=0}</p>`
        },
        'vestuario-campesinos': {
            title: 'Campesinos de Tunja',
            html: `<p>Los campesinos de la provincia de Tunja llevaban camisón de zaraza azul, mantilla de paño azul y sombrero cubano —también ruanas gruesas, cuadradas y de lana cruda, usadas como abrigo, lecho y en ocasiones mortaja—; sombrero de lana gris de anchas alas y copa baja; alpargatas en los pies.</p>
             <p class="muted">Fuente: Presentación Sala 4. :contentReference[oaicite:1]{index=1}</p>`
        },
        'vestuario-elite': {
            title: 'Tropas de élite (Húsares, Dragones, Rifles, Británicos)',
            html: `<p>Las unidades de élite como Húsares y Dragones llevaban chaquetas ligeras azules, pantalones estilo hússar, shakos adornados con penachos o plumas y placas de identificación. Algunos usaban colbac o morrión (gorros de pelo) con formas cilíndricas y penachos. La Legión Británica, la Guardia de Honor de Bolívar y el Batallón Rifles eran ejemplos de unidades con más uniformidad.</p>
             <p class="muted">Fuente: Presentación Sala 4. :contentReference[oaicite:2]{index=2}</p>`
        },
        'vestuario-social': {
            title: 'Condición social y apariencia',
            html: `<p>La vestimenta reflejaba la condición social: mendigos, campesinos y comerciantes podían llevar prendas similares (p. ej. ruana), pero la calidad, limpieza y estado del tejido marcaban diferencias notables en la apariencia social.</p>`
        },

        // Alimentos
        'alimentos-cultivos': {
            title: 'Cultivos y producción',
            html: `<p>Cultivos: maíz (mazorca), trigo, cebada, fríjoles, lentejas, habas, rubas, cubios, nabos, ibias, arveja, cebollas, garbanzo, papa, topocho, arracacha, yuca, plátano, calabazas, ahuyamas, guatilas, hortalizas, café y tabaco. Producción de panela, quesos y extracción de sal.</p>
             <p class="muted">Fuente: Presentación Sala 4. :contentReference[oaicite:3]{index=3}</p>`
        },
        'alimentos-frutas': {
            title: 'Frutas y derivados',
            html: `<p>Frutas: manzanas, guayabas, pomarrosas, chirimoyas, naranjas, tomate de árbol, mangos, papayos, durazno, papaya, mortiño, brevas, curubas, guamas, granadillas, limones y caña de azúcar/miel (para producción de panela, miel y aguardiente).</p>`
        },
        'alimentos-bebidas': {
            title: 'Bebidas tradicionales',
            html: `<p>Agua, leche, chocolate, aguardiente, guarapo (preparado de panela y conservado en tinajas), chicha (elaborada con maíz y melao). En menor medida se consumía ron, brandy y vino.</p>
             <p class="muted">Fuente: Presentación Sala 4. :contentReference[oaicite:4]{index=4}</p>`
        },
        'alimentos-preparaciones': {
            title: 'Preparaciones y menús',
            html: `<p>Preparaciones: menestras, sopas, arepas de maíz, envueltos de mazorca, pan de trigo, galletas, biscochos, postres y dulces. Proteínas: reses, cerdos, gallinas, corderos, chivos, pavos, pescado y huevos.</p>`
        },
        'alimentos-abastecimiento': {
            title: 'Abastecimiento y rol de las "juanas"',
            html: `<p>El abastecimiento se realizaba muchas veces desde la población: mujeres que acompañaban las tropas (las "juanas") preparaban alimentos y cargaban bultos. En el paso por el páramo de Pisba, mujeres de pueblos y caseríos acercaban canastos con alimentos. Para las tropas realistas, las mujeres recibían bultos de harina para preparar pan y galletas.</p>
             <p class="muted">Fuente: Presentación Sala 4. :contentReference[oaicite:5]{index=5}</p>`
        },

        // Armas
        'armas-lista': {
            title: 'Lista de armas',
            html: `<p>Armas: fusiles, carabinas, pistolas, trabucos, bayonetas, mosquetes, arcabuces, cañones, obuses, escopetas, sables, espadas, lanzas, palos, cuchillos domésticos, herramientas de labranza (rejos, picas, azadones), oz, resorteras, trinchetes, machetes y macanas.</p>
             <p class="muted">Fuente: Presentación Sala 4. :contentReference[oaicite:6]{index=6}</p>`
        },
        'armas-municion': {
            title: 'Municiones y medidas',
            html: `<p>Municiones: pólvora, plomo, piedra de chispa, cartuchos (balas). Cartuchos de fusil ~2 onzas; cada soldado llevaba hasta 50 cartuchos; bayonetas de ~50 cm; fusiles de chispa ~1.5 m con alcance de 2–3 cuadras; cañones con alcance de hasta 5 cuadras.</p>
             <p class="muted">Fuente: Presentación Sala 4. :contentReference[oaicite:7]{index=7}</p>`
        },
        'armas-artesanal': {
            title: 'Armas artesanales y fabricación',
            html: `<p>Por la escasez se fabricaban cuchillos y chuzos de albarico (madera fuerte). En herrerías locales se reconvirtieron azadones y palas en puntas de lanza; también se fabricaron herraduras y estribos cuando fue necesario.</p>`
        },
        'armas-mantenimiento': {
            title: 'Mantenimiento y conservación',
            html: `<p>Ante la humedad, los soldados untaban sebo de res a los fusiles para evitar el moho. A lanzas y cuchillos se les sacaba filo constantemente. El parque de equipo debía ser custodiado por 10–20 hombres y era transportado en mulas en la retaguardia.</p>
             <p class="muted">Fuente: Presentación Sala 4. :contentReference[oaicite:8]{index=8}</p>`
        },

        // Roles & logística
        'roles-juana': {
            title: 'La Juana — rol femenino',
            html: `<p>Las "juanas" eran mujeres que acompañaban a las tropas: cocinaban, preparaban raciones, cargaban bultos y cuidaban del rancho del ejército. Su presencia fue decisiva para mantener la cohesión alimentaria.</p>`
        },
        'roles-vanguardia': {
            title: 'Vanguardia y jinetes',
            html: `<p>La vanguardia racionaba alimentos capturados en el avance, especialmente ganado. Los jinetes salían a "coger" ganado y cazaban por turnos para proveer proteína a la columna.</p>`
        },
        'roles-parque': {
            title: 'Parque, custodia y transporte',
            html: `<p>El parque (municiones y pertrechos) era custodiado por grupos de 10–20 hombres y era transportado en mulas en la retaguardia, lo que lo hacía vulnerable a robos o interrupciones logísticas.</p>`
        },

        // Ración
        'racion-ideal': {
            title: 'Ración ideal para un soldado',
            html: `<p><strong>1 libra de pan</strong>, <strong>½ libra de carne</strong>, <strong>4 onzas de menestra</strong> y <strong>½ onza de sal</strong>. En campañas se entregaban raciones para 1–2 días; cuando escaseaba la comida se daba media ración y la carne a veces se servía sin sal. En algunos momentos se entregaron 2 onzas de sal por soldado.</p>
             <p class="muted">Fuente: Presentación Sala 4. :contentReference[oaicite:9]{index=9}</p>`
        }
    };

    /* ====== UTILIDADES ====== */
    function stripTags(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }

    function openModal(html) {
        const mb = ensureModalBody();
        mb.innerHTML = html;
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
    function closeModal() {
        modal.setAttribute('aria-hidden', 'true');
        const mb = ensureModalBody();
        mb.innerHTML = '';
        document.body.style.overflow = '';
    }

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

    /* ====== PAGES / RENDERING (SPA hash-based) ====== */
    // Build page HTML fragments using CONTENT_FICHAS
    function renderHome() {
        return `
      <section class="page-hero">
        <div>
          <h2 class="section-title">Sala 4 — Museo Digital</h2>
          <p class="section-desc">Explora vestuario, alimentación, armas y logística. Usa el sidebar para navegar por subtemas.</p>
          <div style="display:flex;gap:8px;margin-top:12px">
            <a class="btn" href="#/vestuario">Ir a Vestuario</a>
            <a class="btn ghost" href="#/galeria">Galería</a>
          </div>
        </div>
        <aside class="museum-frame">
          <img src="img/Museo-Ruta-de-la-Libertad-Blanco.png" alt="Hero" onerror="this.style.display='none'">
        </aside>
      </section>

      <section style="margin-top:18px">
        <h3 class="section-title">Accesos rápidos</h3>
        <div class="cards-grid">
          <div class="card"><h3>Vestuario</h3><p>Prendas, campesinos, tropas de élite y diferencias sociales.</p><button class="more-btn" data-target="vestuario-prendas">Abrir</button></div>
          <div class="card"><h3>Alimentación</h3><p>Cultivos, bebidas, preparaciones y las juanas.</p><button class="more-btn" data-target="alimentos-cultivos">Abrir</button></div>
          <div class="card"><h3>Armas</h3><p>Lista de armas, munición y mantenimiento.</p><button class="more-btn" data-target="armas-lista">Abrir</button></div>
          <div class="card"><h3>Ración</h3><p>Ración ideal por soldado y prácticas de racionamiento.</p><button class="more-btn" data-target="racion-ideal">Abrir</button></div>
        </div>
      </section>
    `;
    }

    function renderVestuario() {
        return `
      <section>
        <h2 class="section-title">Vestuario — visión organizada</h2>
        <p class="section-desc">Detalles por subtema: prendas, campesinos, unidades de élite y condición social.</p>

        <div class="section-gallery">
          <img src="img/vestuario_1.jpg" onerror="this.style.display='none'">
          <img src="img/vestuario_2.jpg" onerror="this.style.display='none'">
        </div>

        <div class="text-block">
          <h3>Prendas y materiales</h3>
          ${CONTENT_FICHAS['vestuario-prendas'].html}
        </div>

        <div class="text-block">
          <h3>Campesinos (Tunja)</h3>
          ${CONTENT_FICHAS['vestuario-campesinos'].html}
        </div>

        <div class="text-block">
          <h3>Unidades de élite</h3>
          ${CONTENT_FICHAS['vestuario-elite'].html}
        </div>

        <div class="text-block">
          <h3>Condición social</h3>
          ${CONTENT_FICHAS['vestuario-social'].html}
        </div>
      </section>
    `;
    }

    function renderAlimentos() {
        return `
      <section>
        <h2 class="section-title">Alimentos, bebidas y abastecimiento</h2>
        <p class="section-desc">Cultivos, frutas, bebidas, preparaciones y la logística del rancho.</p>

        <div class="section-gallery">
          <img src="img/alimentos_1.jpg" onerror="this.style.display='none'">
          <img src="img/alimentos_2.jpg" onerror="this.style.display='none'">
        </div>

        <div class="text-block">
          <h3>Cultivos y producción</h3>
          ${CONTENT_FICHAS['alimentos-cultivos'].html}
          ${CONTENT_FICHAS['alimentos-frutas'].html}
        </div>

        <div class="text-block">
          <h3>Bebidas y preparaciones</h3>
          ${CONTENT_FICHAS['alimentos-bebidas'].html}
          ${CONTENT_FICHAS['alimentos-preparaciones'].html}
        </div>

        <div class="text-block">
          <h3>Abastecimiento y la Juana</h3>
          ${CONTENT_FICHAS['alimentos-abastecimiento'].html}
        </div>
      </section>
    `;
    }

    function renderArmas() {
        return `
      <section>
        <h2 class="section-title">Armas y munición</h2>
        <p class="section-desc">Listado completo de armas, municiones, artesanías y prácticas de mantenimiento.</p>

        <div class="section-gallery">
          <img src="img/armas_1.jpg" onerror="this.style.display='none'">
          <img src="img/armas_2.jpg" onerror="this.style.display='none'">
        </div>

        <div class="text-block">
          <h3>Lista de armas</h3>
          ${CONTENT_FICHAS['armas-lista'].html}
        </div>

        <div class="text-block">
          <h3>Munición y medidas</h3>
          ${CONTENT_FICHAS['armas-municion'].html}
        </div>

        <div class="text-block">
          <h3>Armas artesanales y mantenimiento</h3>
          ${CONTENT_FICHAS['armas-artesanal'].html}
          ${CONTENT_FICHAS['armas-mantenimiento'].html}
        </div>
      </section>
    `;
    }

    function renderLogistica() {
        return `
      <section>
        <h2 class="section-title">Logística de campaña</h2>
        <p class="section-desc">Roles, organización de la vanguardia, custodia del parque y transporte de pertrechos.</p>

        <div class="text-block">
          <h3>La Juana</h3>
          ${CONTENT_FICHAS['roles-juana'].html}
        </div>

        <div class="text-block">
          <h3>Vanguardia y jinetes</h3>
          ${CONTENT_FICHAS['roles-vanguardia'].html}
        </div>

        <div class="text-block">
          <h3>Parque y custodia</h3>
          ${CONTENT_FICHAS['roles-parque'].html}
        </div>
      </section>
    `;
    }

    function renderRacion() {
        return `
      <section>
        <h2 class="section-title">Ración ideal</h2>
        <p class="section-desc">Ración por soldado y prácticas de racionamiento en campaña.</p>

        <div class="text-block">
          ${CONTENT_FICHAS['racion-ideal'].html}
        </div>

        <div class="racion-grid" style="margin-top:12px">
          <div class="card"><h3>Ración (resumen)</h3><ul><li>1 libra pan</li><li>½ libra carne</li><li>4 oz menestra</li><li>½ oz sal</li></ul></div>
          <div class="card"><h3>Aplicación práctica</h3><p>Entregas para 1–2 días; en Pisba se dio carne y arracacha; en escasez media ración.</p></div>
        </div>
      </section>
    `;
    }

    function renderGaleria() {
        const keys = Object.keys(CONTENT_FICHAS);
        const cards = keys.map(k => {
            const f = CONTENT_FICHAS[k];
            const img = `img/${k}.jpg`;
            return `<div class="card gallery-card">
                <img src="${img}" class="card-img" onerror="this.style.display='none'">
                <h3>${f.title}</h3>
                <p>${stripTags(f.html).slice(0, 160)}${stripTags(f.html).length > 160 ? '…' : ''}</p>
                <div style="margin-top:8px;display:flex;gap:8px">
                  <button class="more-btn" data-target="${k}">Abrir ficha</button>
                  <button class="copy-btn" data-target="${k}">Copiar</button>
                </div>
              </div>`;
        }).join('');
        return `<section>
      <h2 class="section-title">Galería & Fichas</h2>
      <p class="section-desc">Haz clic en una ficha para ver el contenido completo.</p>
      <div class="gallery-grid">${cards}</div>
    </section>`;
    }

    // Router map
    function getPathFromHash() {
        const h = location.hash.replace('#', '');
        return h || '/';
    }

    function renderPath() {
        const path = getPathFromHash();
        let html = '';
        switch (path) {
            case '/': html = renderHome(); break;
            case '/vestuario': html = renderVestuario(); break;
            case '/alimentos': html = renderAlimentos(); break;
            case '/armas': html = renderArmas(); break;
            case '/logistica': html = renderLogistica(); break;
            case '/racion': html = renderRacion(); break;
            case '/galeria': html = renderGaleria(); break;
            // support deep link like /vestuario/prendas -> bring to vestuario page
            default:
                // map some subpaths to parent pages
                if (path.startsWith('/vestuario')) html = renderVestuario();
                else if (path.startsWith('/alimentos')) html = renderAlimentos();
                else if (path.startsWith('/armas')) html = renderArmas();
                else if (path.startsWith('/logistica')) html = renderLogistica();
                else if (path.startsWith('/racion')) html = renderRacion();
                else html = renderHome();
        }
        content.innerHTML = html;
        attachPageListeners();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    window.addEventListener('hashchange', renderPath);
    if (!location.hash) location.hash = '#/';
    renderPath();

    /* ====== INTERACTIVIDAD SIDEBAR ====== */
    // Toggle submenus
    menuHasSub.forEach(btn => {
        btn.addEventListener('click', () => {
            const submenuId = btn.dataset.submenu;
            const sub = document.getElementById(`sub-${submenuId}`);
            if (!sub) return;
            const open = getComputedStyle(sub).display === 'flex';
            // close other open submenus for neatness
            document.querySelectorAll('.submenu').forEach(s => { if (s !== sub) s.style.display = 'none'; });
            sub.style.display = open ? 'none' : 'flex';
            btn.classList.toggle('active', !open);
        });
    });

    // Top-level menu buttons without submenu navigate home/section
    menuButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const sec = btn.dataset.section;
            if (sec) {
                location.hash = `#${sec.startsWith('/') ? sec : `/${sec}`}`;
            } else {
                // if has-sub, toggled above
            }
        });
    });

    // Submenu buttons navigate to page anchors or deep routes
    submenuButtons.forEach(sbtn => {
        sbtn.addEventListener('click', () => {
            const sec = sbtn.dataset.section || sbtn.getAttribute('data-section');
            if (sec) {
                // map known section keywords to routes
                const map = {
                    'vestuario-prendas': '#/vestuario',
                    'vestuario-campesinos': '#/vestuario',
                    'vestuario-elite': '#/vestuario',
                    'vestuario-social': '#/vestuario',
                    'alimentos-cultivos': '#/alimentos',
                    'alimentos-frutas': '#/alimentos',
                    'alimentos-bebidas': '#/alimentos',
                    'alimentos-preparaciones': '#/alimentos',
                    'alimentos-abastecimiento': '#/alimentos',
                    'armas-lista': '#/armas',
                    'armas-municion': '#/armas',
                    'armas-artesanal': '#/armas',
                    'armas-mantenimiento': '#/armas',
                    'roles-juana': '#/logistica',
                    'roles-vanguardia': '#/logistica',
                    'roles-parque': '#/logistica'
                };
                const route = map[sec] || '#/';
                location.hash = route.replace('#', '') ? route : '#/';
            }
        });
    });

    /* ====== PAGE - local listeners (buttons in page) ====== */
    function attachPageListeners() {
        // more-btn: open ficha modal using CONTENT_FICHAS
        document.querySelectorAll('.more-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const key = btn.dataset.target;
                const f = CONTENT_FICHAS[key];
                if (f) openModal(`<h2 style="margin-top:0">${f.title}</h2>${f.html}`);
            });
        });

        // copy-btn: copy text to clipboard
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const key = btn.dataset.target;
                const f = CONTENT_FICHAS[key];
                if (!f) return;
                try {
                    await navigator.clipboard.writeText(stripTags(f.html));
                    btn.textContent = 'Copiado';
                    setTimeout(() => btn.textContent = 'Copiar', 1400);
                } catch (e) {
                    alert('No fue posible copiar. Usa Ctrl+C o Cmd+C.');
                }
            });
        });

        // internal page more-btns (cards in home)
        document.querySelectorAll('.card .more-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const t = btn.dataset.target;
                const f = CONTENT_FICHAS[t];
                if (f) openModal(`<h2>${f.title}</h2>${f.html}`);
            });
        });

        // ensure sidebar closes in mobile when navigating
        document.querySelectorAll('.menu .submenu button, .menu .menu-btn').forEach(el => {
            el.addEventListener('click', () => {
                if (window.innerWidth <= 980) sidebar.classList.remove('open');
            });
        });
    }

    /* ====== SEARCH: simple text filter inside current content ====== */
    // Place search input at top of content
    function injectSearchControl() {
        const ctrl = document.createElement('div');
        ctrl.className = 'controls';
        ctrl.innerHTML = `<input id="globalSearch" class="search-input" placeholder="Buscar (por ejemplo: 'ruana', 'fusil', 'chicha')">`;
        content.prepend(ctrl);
        const searchInput = document.getElementById('globalSearch');
        searchInput.addEventListener('input', (e) => {
            const q = e.target.value.trim().toLowerCase();
            // show/hide blocks (text-block, card, gallery-card)
            document.querySelectorAll('#content .text-block, #content .card, #content .gallery-card').forEach(el => {
                const text = el.textContent.toLowerCase();
                el.style.display = q === '' || text.includes(q) ? '' : 'none';
            });
        });
    }
    // Inject search on first render
    injectSearchControl();

    /* ====== Download TXT (all fichas) ====== */
    // Add a small download control at bottom of sidebar
    const footer = document.createElement('div');
    footer.className = 'footer-credits';
    footer.innerHTML = `<div style="margin-top:12px"><a id="downloadTxt" class="btn" href="#">Descargar resumen (TXT)</a><div style="margin-top:8px;color:var(--muted);font-size:13px"></div></div>`;
    document.querySelector('.sidebar').appendChild(footer);
    document.getElementById('downloadTxt').addEventListener('click', (e) => {
        e.preventDefault();
        let txt = 'Sala 4 — Resumen completo\n\n';
        for (const k in CONTENT_FICHAS) {
            txt += '== ' + CONTENT_FICHAS[k].title + '\n\n';
            txt += stripTags(CONTENT_FICHAS[k].html) + '\n\n';
        }
        const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'Sala4_resumen.txt';
        document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    });

    /* ====== Responsive toggle for sidebar (small screens) ====== */
    // Add a floating toggle button when width small
    const floatToggle = document.createElement('button');
    floatToggle.innerHTML = '☰';
    floatToggle.style = 'position:fixed;left:12px;top:12px;z-index:120;background:var(--gold);border:0;padding:10px;border-radius:10px;color:#071018;display:none;box-shadow:var(--shadow);';
    document.body.appendChild(floatToggle);
    function updateToggleVisibility() {
        if (window.innerWidth <= 980) { floatToggle.style.display = 'block'; }
        else { floatToggle.style.display = 'none'; sidebar.classList.remove('open'); document.body.classList.remove('show-sidebar'); }
    }
    updateToggleVisibility();
    window.addEventListener('resize', updateToggleVisibility);
    floatToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        document.body.classList.toggle('show-sidebar');
    });

    /* ====== Utility: ensure modal-body exists (if not present in markup) ====== */
    function ensureModalBody() {
        let mb = document.getElementById('modal-body');
        if (!mb) {
            const mc = document.querySelector('.modal .modal-content');
            mb = document.createElement('div');
            mb.id = 'modal-body';
            mc.appendChild(mb);
            // also add close button if not exist
            if (!document.getElementById('closeModal')) {
                const cb = document.createElement('button'); cb.id = 'closeModal'; cb.textContent = '✕';
                cb.style = 'position:absolute;right:14px;top:14px;background:transparent;border:0;color:var(--gold-2);font-size:20px;cursor:pointer;';
                mc.appendChild(cb); cb.addEventListener('click', closeModal);
            }
        }
        return mb;
    }

    /* ====== Initial attach for page (already executed in renderPath) ====== */
    // call attachPageListeners once to bind initial home page buttons
    attachPageListeners();

});
