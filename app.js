document.addEventListener('DOMContentLoaded', () => {

    // ==================== HAMBURGER NAV ====================
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    const navOverlay = document.getElementById('nav-overlay');

    function openNav() {
        navToggle?.classList.add('open');
        navLinks?.classList.add('open');
        navOverlay?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeNav() {
        navToggle?.classList.remove('open');
        navLinks?.classList.remove('open');
        navOverlay?.classList.remove('active');
        document.body.style.overflow = '';
    }

    navToggle?.addEventListener('click', () => {
        navLinks?.classList.contains('open') ? closeNav() : openNav();
    });

    navOverlay?.addEventListener('click', closeNav);

    // Close nav on link click (mobile)
    navLinks?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeNav);
    });

    // ==================== FADE-IN ON SCROLL ====================
    const faders = document.querySelectorAll('.fade-in');
    const scrollObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

    faders.forEach(el => scrollObserver.observe(el));
    // Also immediately appear anything already visible
    faders.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) el.classList.add('appear');
    });

    // ==================== 34 PROVINCE CARDS ====================
    const cardsContainer = document.getElementById('dynamic-cards-container');
    if (cardsContainer && typeof dataProvinsi !== 'undefined') {
        const letters = ['A', 'B', 'C'];

        function renderCards(filter = 'semua') {
            cardsContainer.innerHTML = '';
            const filtered = filter === 'semua'
                ? dataProvinsi
                : dataProvinsi.filter(p => p.region === filter);

            filtered.forEach(prov => {
                const card = document.createElement('div');
                card.className = 'flip-card';
                card.setAttribute('data-region', prov.region);
                card.innerHTML = `
                    <div class="flip-card-inner">
                        <div class="flip-card-front">
                            <span class="province-badge" data-region="${prov.region}">${prov.region}</span>
                            <img src="assets/kid_${prov.id}.png"
                                 style="width:100%; height:170px; object-fit:contain; filter:drop-shadow(0 5px 15px rgba(0,0,0,0.1));"
                                 onerror="this.style.display='none'">
                            <h3>${prov.nama}</h3>
                            <p style="color:#555; font-size:0.9rem; font-weight:600;">Suku: ${prov.suku}</p>
                            <p style="color:#888; font-size:0.8rem;">&#128247; <em>${prov.pakaian}</em></p>
                            <p class="flip-hint">&#128070; Klik untuk lihat rumah adat</p>
                        </div>
                        <div class="flip-card-back">
                            <span class="province-badge" data-region="${prov.region}">${prov.region}</span>
                            <img src="assets/rumah_${prov.id}.png"
                                 style="width:100%; height:160px; object-fit:contain; filter:drop-shadow(0 5px 15px rgba(0,0,0,0.1));"
                                 onerror="this.style.display='none'">
                            <h3>&#127968; ${prov.rumah}</h3>
                            <p>Rumah adat Suku <strong>${prov.suku}</strong> dari <strong>${prov.nama}</strong>.</p>
                            <p class="flip-hint">&#128070; Klik untuk kembali</p>
                        </div>
                    </div>
                `;
                card.addEventListener('click', () => card.classList.toggle('flipped'));

                // Touch support: flip on tap
                let touchMoved = false;
                card.addEventListener('touchstart', () => { touchMoved = false; }, { passive: true });
                card.addEventListener('touchmove', () => { touchMoved = true; }, { passive: true });
                card.addEventListener('touchend', (e) => {
                    if (!touchMoved) {
                        card.classList.toggle('flipped');
                    }
                });

                cardsContainer.appendChild(card);
            });
        }

        renderCards();

        // Filter bar
        const filterBar = document.getElementById('filter-bar');
        filterBar?.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderCards(btn.getAttribute('data-region'));
                cardsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    }

    // ==================== SPIN WHEEL ====================
    const wheel = document.getElementById('spin-wheel');
    const spinBtn = document.getElementById('spin-btn');
    const quizModal = document.getElementById('quiz-modal');

    if (wheel && spinBtn && typeof wheelSegments !== 'undefined') {
        const segmentCount = wheelSegments.length;
        const degPerSeg = 360 / segmentCount;
        const colors = ['#FF6B6B','#4ECDC4','#FFE66D','#FF9F43','#54A0FF','#A29BFE','#FF6B6B','#4ECDC4','#FFE66D'];

        // Build conic gradient
        let gradient = 'conic-gradient(';
        wheelSegments.forEach((seg, i) => {
            const from = i * degPerSeg;
            const to = (i + 1) * degPerSeg;
            gradient += `${colors[i]} ${from}deg ${to}deg${i < segmentCount - 1 ? ', ' : ''}`;
        });
        gradient += ')';
        wheel.style.background = gradient;

        // Render segment text labels
        wheelSegments.forEach((seg, i) => {
            const midAngle = (i + 0.5) * degPerSeg;
            const label = document.createElement('div');
            label.style.cssText = `
                position: absolute;
                top: 50%; left: 50%;
                width: 45%;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                padding-right: 0.4rem;
                transform-origin: left center;
                transform: rotate(${midAngle}deg);
                font-family: var(--font-heading);
                font-size: clamp(0.55rem, 1.5vw, 0.85rem);
                font-weight: bold;
                color: white;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
                pointer-events: none;
                white-space: nowrap;
            `;
            label.textContent = seg.label;
            wheel.appendChild(label);
        });

        let currentRot = 0;
        let scoreCorrect = 0, scoreWrong = 0, scoreSpins = 0;

        spinBtn.addEventListener('click', () => {
            spinBtn.disabled = true;
            spinBtn.textContent = '🌀 Memutar...';

            const extraSpins = Math.floor(Math.random() * 5 + 5) * 360;
            const randomOffset = Math.floor(Math.random() * 360);
            currentRot += extraSpins + randomOffset;

            wheel.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
            wheel.style.transform = `rotate(${currentRot}deg)`;

            scoreSpins++;
            updateScores();

            setTimeout(() => {
                const normalised = (360 - (currentRot % 360)) % 360;
                const idx = Math.floor(normalised / degPerSeg) % segmentCount;
                showQuizModal(wheelSegments[idx]);
            }, 4300);
        });

        function updateScores() {
            const sc = document.getElementById('score-correct');
            const sw = document.getElementById('score-wrong');
            const ss = document.getElementById('score-spins');
            if (sc) sc.textContent = scoreCorrect;
            if (sw) sw.textContent = scoreWrong;
            if (ss) ss.textContent = scoreSpins;
        }

        function showQuizModal(segment) {
            const prov = dataProvinsi.find(p => p.id === segment.id);
            if (!prov) return;

            const imgEl = document.getElementById('quiz-image');
            if (imgEl) {
                imgEl.src = `assets/kid_${prov.id}.png`;
                imgEl.onerror = () => { imgEl.style.display = 'none'; };
                imgEl.onload = () => { imgEl.style.display = 'block'; };
            }

            document.getElementById('quiz-title').textContent = `Budaya ${prov.suku}`;
            document.getElementById('quiz-question').textContent = prov.kuis;

            const container = document.getElementById('quiz-options-container');
            container.innerHTML = '';
            const feedback = document.getElementById('quiz-feedback');
            if (feedback) { feedback.style.display = 'none'; feedback.textContent = ''; }

            const letterMap = ['A', 'B', 'C', 'D'];
            prov.opsi.forEach((opt, i) => {
                const btn = document.createElement('button');
                btn.className = 'btn-option';
                btn.setAttribute('data-letter', letterMap[i]);
                btn.textContent = opt;
                btn.addEventListener('click', () => {
                    container.querySelectorAll('.btn-option').forEach(b => b.disabled = true);

                    if (opt === prov.jawaban) {
                        btn.classList.add('correct');
                        scoreCorrect++;
                        if (feedback) { feedback.textContent = '🎉 Benar sekali! Kamu hebat!'; feedback.style.display = 'block'; feedback.style.color = '#1a6e1a'; }
                        fireConfetti();
                    } else {
                        btn.classList.add('wrong');
                        btn.classList.add('shake');
                        scoreWrong++;
                        container.querySelectorAll('.btn-option').forEach(b => {
                            if (b.textContent === prov.jawaban) b.classList.add('correct');
                        });
                        if (feedback) { feedback.textContent = `❌ Jawabannya: ${prov.jawaban}`; feedback.style.display = 'block'; feedback.style.color = '#8b1a1a'; }
                    }
                    updateScores();
                    const closeBtn = document.getElementById('close-modal');
                    if (closeBtn) closeBtn.style.display = 'block';
                });
                container.appendChild(btn);
            });

            document.getElementById('close-modal').style.display = 'none';
            quizModal.classList.add('active');

            document.getElementById('close-modal').onclick = () => {
                quizModal.classList.remove('active');
                spinBtn.disabled = false;
                spinBtn.textContent = '🎡 Putar Roda!';
            };
        }
    }

    // ==================== DRAG & DROP GAME ====================
    const draggables = document.querySelectorAll('.drag-item');
    const dropzones = document.querySelectorAll('.drop-zone');
    if (draggables.length > 0) {
        const totalItems = draggables.length;
        let correctCount = 0;
        const feedbackMsg = document.getElementById('game-feedback');
        const resetBtn = document.getElementById('reset-game');
        let currentDragEl = null;

        // Desktop Drag & Drop
        draggables.forEach(el => {
            el.addEventListener('dragstart', (e) => {
                currentDragEl = el;
                el.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            });
            el.addEventListener('dragend', () => el.classList.remove('dragging'));
        });

        dropzones.forEach(zone => {
            zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('hovered'); });
            zone.addEventListener('dragleave', () => zone.classList.remove('hovered'));
            zone.addEventListener('drop', e => {
                e.preventDefault();
                zone.classList.remove('hovered');
                if (currentDragEl) handleDrop(currentDragEl, zone);
            });
        });

        // Touch Drag & Drop (Mobile)
        draggables.forEach(el => {
            let startX, startY, clone;

            el.addEventListener('touchstart', e => {
                const touch = e.touches[0];
                startX = touch.clientX;
                startY = touch.clientY;
                currentDragEl = el;

                clone = el.cloneNode(true);
                clone.style.cssText = `
                    position: fixed; pointer-events: none; z-index: 9000;
                    width: ${el.offsetWidth}px; height: ${el.offsetHeight}px;
                    opacity: 0.85; transform: scale(1.1);
                    left: ${touch.clientX - el.offsetWidth / 2}px;
                    top: ${touch.clientY - el.offsetHeight / 2}px;
                `;
                document.body.appendChild(clone);
                el.style.opacity = '0.3';
            }, { passive: true });

            el.addEventListener('touchmove', e => {
                e.preventDefault();
                const touch = e.touches[0];
                if (clone) {
                    clone.style.left = `${touch.clientX - clone.offsetWidth / 2}px`;
                    clone.style.top = `${touch.clientY - clone.offsetHeight / 2}px`;
                }

                // Highlight potential drop zone
                dropzones.forEach(z => z.classList.remove('hovered'));
                const elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
                const zone = elemBelow?.closest('.drop-zone');
                if (zone) zone.classList.add('hovered');
            }, { passive: false });

            el.addEventListener('touchend', e => {
                if (clone) { clone.remove(); clone = null; }
                el.style.opacity = '';
                dropzones.forEach(z => z.classList.remove('hovered'));

                const touch = e.changedTouches[0];
                const elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
                const zone = elemBelow?.closest('.drop-zone');
                if (zone && currentDragEl) handleDrop(currentDragEl, zone);
            }, { passive: true });
        });

        function handleDrop(dragEl, zone) {
            const dragTarget = dragEl.getAttribute('data-target');
            const zoneId = zone.getAttribute('data-id');

            if (dragTarget === zoneId) {
                // Correct!
                zone.classList.add('correct');
                const span = zone.querySelector('span');
                if (span) span.style.display = 'none';
                dragEl.classList.add('hide');

                const dropped = dragEl.cloneNode(true);
                dropped.draggable = false;
                dropped.style.cssText = 'position:absolute; top:0; left:0; width:100%; height:100%; object-fit:contain;';
                zone.appendChild(dropped);

                correctCount++;
                if (correctCount === totalItems) {
                    feedbackMsg?.classList.remove('hidden');
                    if (resetBtn) resetBtn.style.display = 'inline-flex';
                    fireConfetti();
                }
            } else {
                dragEl.classList.add('shake');
                setTimeout(() => dragEl.classList.remove('shake'), 500);
            }
        }

        // Reset
        resetBtn?.addEventListener('click', () => {
            correctCount = 0;

            draggables.forEach(el => {
                el.classList.remove('hide', 'shake');
                el.style.opacity = '';
            });

            dropzones.forEach(zone => {
                zone.classList.remove('correct', 'hovered');
                const span = zone.querySelector('span');
                if (span) span.style.display = '';
                zone.querySelectorAll('img:not(.drag-item)').forEach(img => img.remove());
            });

            feedbackMsg?.classList.add('hidden');
            if (resetBtn) resetBtn.style.display = 'none';
        });
    }

    // ==================== CONFETTI ====================
    function fireConfetti() {
        const canvas = document.getElementById('confetti');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const shapes = ['square', 'circle', 'triangle'];
        const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF9F43', '#54A0FF', '#A29BFE'];
        const pieces = Array.from({ length: 180 }, () => ({
            x: canvas.width / 2,
            y: canvas.height * 0.6,
            vx: (Math.random() - 0.5) * 30,
            vy: (Math.random() - 0.9) * 28,
            size: Math.random() * 12 + 6,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 12,
            shape: shapes[Math.floor(Math.random() * shapes.length)],
            gravity: 0.6 + Math.random() * 0.4
        }));

        let frame;
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let active = false;
            pieces.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += p.gravity;
                p.rotation += p.rotSpeed;
                if (p.y < canvas.height + 50) {
                    active = true;
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.rotation * Math.PI / 180);
                    ctx.fillStyle = p.color;
                    if (p.shape === 'square') {
                        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                    } else if (p.shape === 'circle') {
                        ctx.beginPath();
                        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                        ctx.fill();
                    } else {
                        ctx.beginPath();
                        ctx.moveTo(0, -p.size / 2);
                        ctx.lineTo(p.size / 2, p.size / 2);
                        ctx.lineTo(-p.size / 2, p.size / 2);
                        ctx.closePath();
                        ctx.fill();
                    }
                    ctx.restore();
                }
            });
            if (active) frame = requestAnimationFrame(animate);
            else ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        if (frame) cancelAnimationFrame(frame);
        animate();
    }
});
