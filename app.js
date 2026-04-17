document.addEventListener('DOMContentLoaded', () => {
    
    // --- Global Image Fallback Handler ---
    window.handleImageFallback = function(el, id, type, char) {
        el.onerror = null;
        let svg = '';
        if (type === 'front') {
            svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><defs><linearGradient id="g1_${id}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FF9F43"/><stop offset="100%" stop-color="#FF6B6B"/></linearGradient></defs><rect width="200" height="200" rx="20" fill="url(#g1_${id})"/><text x="50%" y="50%" font-family="Nunito, sans-serif" font-size="80" font-weight="bold" fill="white" text-anchor="middle" dy=".35em">${char}</text></svg>`;
        } else {
            svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><defs><linearGradient id="g2_${id}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#4ECDC4"/><stop offset="100%" stop-color="#54A0FF"/></linearGradient></defs><rect width="200" height="200" rx="20" fill="url(#g2_${id})"/><path d="M20 100 L100 30 L180 100 Z" fill="white" opacity="0.8"/><rect x="60" y="100" width="80" height="70" fill="white" opacity="0.8"/></svg>`;
        }
        el.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    };

    // --- 0. Utility Animations ---
    const faders = document.querySelectorAll('.fade-in');
    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    faders.forEach(fader => appearOnScroll.observe(fader));


    // --- 1. RENDER 34 PROVINSI (Eksplorasi.html) ---
    const cardsContainer = document.getElementById('dynamic-cards-container');
    if (cardsContainer && typeof dataProvinsi !== 'undefined') {
        dataProvinsi.forEach((prov) => {
            const cardHTML = `
            <div class="flip-card">
                <div class="flip-card-inner">
                    <div class="flip-card-front" style="background: linear-gradient(135deg, var(--bg-color), #fff);">
                        <img src="assets/kid_${prov.id}.png" style="width:100%; height:180px; object-fit:contain; filter:drop-shadow(0 5px 15px rgba(0,0,0,0.1));" 
                             onerror="window.handleImageFallback(this, '${prov.id}', 'front', '${prov.nama.charAt(0).replace(/'/g, "\\'")}');">
                        <h3 style="font-size: 1.3rem;">${prov.nama}</h3>
                        <p style="color: #666; font-weight: bold;">Pakaian: <br>${prov.pakaian}</p>
                    </div>
                    <div class="flip-card-back">
                        <img src="assets/rumah_${prov.id}.png" style="width:100%; height:160px; object-fit:contain; filter:drop-shadow(0 5px 15px rgba(0,0,0,0.1));" 
                             onerror="window.handleImageFallback(this, '${prov.id}', 'back', '');">
                        <h3 style="color: var(--primary);">${prov.rumah}</h3>
                        <p style="margin-top: 10px; font-size: 0.9rem;">Rumah adat kebanggaan Suku ${prov.suku} dari provinsi ${prov.nama}.</p>
                    </div>
                </div>
            </div>
            `;
            cardsContainer.insertAdjacentHTML('beforeend', cardHTML);
        });

        // Add flip listeners to new cards
        document.querySelectorAll('.flip-card').forEach(card => {
            card.addEventListener('click', () => card.classList.toggle('flipped'));
        });
    }

    // --- 2. RODA BUDAYA & KUIS (Roda.html) ---
    const wheel = document.getElementById('spin-wheel');
    const spinBtn = document.getElementById('spin-btn');
    const quizModal = document.getElementById('quiz-modal');
    
    if (wheel && spinBtn && typeof wheelSegments !== 'undefined') {
        // Render 9 segments dynamically on wheel
        wheelSegments.forEach((seg, index) => {
            const rot = (40 * index) + 20; // 360/9 = 40. Start center offset +20
            const segEl = document.createElement('div');
            segEl.className = `wheel-segment seg-${index+1}`;
            // Adjust segment CSS rotation directly or via classes
            segEl.style.transform = `rotate(${rot}deg) translate(20px, -10px)`;
            segEl.innerHTML = `<span style="display:inline-block; transform: rotate(-${rot/2}deg);">${seg.label}</span>`;
            segEl.style.display = 'flex';
            segEl.style.alignItems = 'center';
            segEl.style.justifyContent = 'center';
            segEl.style.fontWeight = 'bold';
            segEl.style.fontFamily = "var(--font-heading)";
            segEl.style.color = "white";
            segEl.style.fontSize = "1.2rem";
            segEl.style.textShadow = "1px 1px 3px rgba(0,0,0,0.4)";
            wheel.appendChild(segEl);
        });

        let currentRotation = 0;
        
        spinBtn.addEventListener('click', () => {
            spinBtn.disabled = true;
            
            // Spin random amount
            const randomDeg = Math.floor(Math.random() * 1800) + 1800; // 5-10 spins
            currentRotation += randomDeg;
            
            wheel.style.transform = `rotate(-${currentRotation}deg)`;
            
            setTimeout(() => {
                const actualRotation = currentRotation % 360;
                // Each slice is 40 degrees
                const sliceIndex = Math.floor(actualRotation / 40);
                const winnerIndex = sliceIndex; // Since it rotates inverse to index
                const winnerSeg = wheelSegments[winnerIndex];
                
                // Find culture in dataProvinsi
                const provData = dataProvinsi.find(p => p.id === winnerSeg.id) || dataProvinsi[0];
                
                showQuizModal(provData);
                
            }, 4000); // 4 seconds transition
        });
    }

    function showQuizModal(provData) {
        document.getElementById('quiz-title').textContent = `Budaya ${provData.suku}`;
        document.getElementById('quiz-question').textContent = provData.kuis;
        
        const quizImg = document.getElementById('quiz-image');
        if(quizImg) {
            quizImg.src = `assets/kid_${provData.id}.png`;
            quizImg.onerror = function() {
                window.handleImageFallback(this, provData.id, 'front', provData.nama.charAt(0));
            };
        }
        
        const optionsCtn = document.getElementById('quiz-options-container');
        optionsCtn.innerHTML = '';
        
        provData.opsi.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'btn-option';
            btn.textContent = opt;
            btn.addEventListener('click', () => {
                // Disable all buttons
                document.querySelectorAll('.btn-option').forEach(b => b.disabled = true);
                
                if (opt === provData.jawaban) {
                    btn.classList.add('correct');
                    fireConfetti();
                    document.getElementById('close-modal').style.display = 'inline-block';
                } else {
                    btn.classList.add('wrong');
                    btn.classList.add('shake');
                    // Find correct one and highlight green
                    document.querySelectorAll('.btn-option').forEach(b => {
                        if(b.textContent === provData.jawaban) b.classList.add('correct');
                    });
                    document.getElementById('close-modal').style.display = 'inline-block';
                }
            });
            optionsCtn.appendChild(btn);
        });
        
        quizModal.classList.add('active');
        document.getElementById('close-modal').style.display = 'none';
        
        document.getElementById('close-modal').onclick = () => {
            quizModal.classList.remove('active');
            spinBtn.disabled = false;
        };
    }

    // --- 3. DRAG & DROP GAME (Permainan.html) ---
    const dropzones = document.querySelectorAll('.drop-zone');
    if (dropzones.length > 0) {
        const draggables = document.querySelectorAll('.drag-item');
        const feedbackMsg = document.getElementById('game-feedback');
        let correctMatches = 0;

        draggables.forEach(draggable => {
            draggable.addEventListener('dragstart', () => draggable.classList.add('dragging'));
            draggable.addEventListener('dragend', () => draggable.classList.remove('dragging'));
        });

        dropzones.forEach(zone => {
            zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('hovered'); });
            zone.addEventListener('dragleave', () => zone.classList.remove('hovered'));
            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('hovered');
                
                const draggingEl = document.querySelector('.dragging');
                if(!draggingEl) return;
                
                const targetId = draggingEl.getAttribute('data-target');
                const zoneId = zone.getAttribute('data-id');

                if (targetId === zoneId) {
                    zone.classList.add('correct');
                    const span = zone.querySelector('span');
                    if(span) span.style.display = 'none';
                    
                    draggingEl.classList.add('hide'); // hide drag item
                    const clone = draggingEl.cloneNode(true);
                    clone.classList.remove('drag-item', 'dragging', 'hide');
                    zone.appendChild(clone);
                    
                    correctMatches++;
                    if(correctMatches === draggables.length) {
                        feedbackMsg.classList.remove('hidden');
                        fireConfetti();
                    }
                } else {
                    draggingEl.classList.add('shake');
                    setTimeout(() => draggingEl.classList.remove('shake'), 500);
                }
            });
        });
    }

    // --- 4. CONFETTI ENGINE ---
    function fireConfetti() {
        const canvas = document.getElementById('confetti');
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const pieces = [];
        const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF9F43', '#54A0FF'];

        for (let i = 0; i < 150; i++) {
            pieces.push({
                x: canvas.width / 2,
                y: canvas.height / 2 + 50,
                vx: (Math.random() - 0.5) * 30,
                vy: (Math.random() - 1) * 30,
                size: Math.random() * 15 + 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10
            });
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let active = false;
            
            pieces.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.8; // gravity
                p.rotation += p.rotationSpeed;
                
                if (p.y < canvas.height + 100) {
                    active = true;
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.rotation * Math.PI / 180);
                    ctx.fillStyle = p.color;
                    ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
                    ctx.restore();
                }
            });

            if (active) requestAnimationFrame(animate);
            else ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        animate();
    }
});
