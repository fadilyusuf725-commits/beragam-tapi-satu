// ===================================================================
//  identitas.js — Logic for "Mengenal Identitasku" page
// ===================================================================

(function () {
    'use strict';

    // ==================== TAB NAVIGATION ====================
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
        });
    });

    // ==================== TAB 1: KARTU IDENTITAS ====================
    const idState = {
        nama: '', jk: null, rambut: null, tinggi: null,
        hobi: null, sifat: null, cita: null, avatar: '🧒'
    };

    const fisikGroups = new Set(['jk', 'rambut', 'tinggi']);

    function updatePreview() {
        document.getElementById('preview-nama').textContent = idState.nama || 'Namamu';
        document.getElementById('preview-avatar').textContent = idState.avatar;

        // Fisik tags
        const fisikEl = document.getElementById('preview-fisik');
        fisikEl.innerHTML = '';
        ['jk', 'rambut', 'tinggi'].forEach(k => {
            if (idState[k]) {
                const span = document.createElement('span');
                span.className = 'id-tag';
                span.textContent = idState[k];
                fisikEl.appendChild(span);
            }
        });
        if (!fisikEl.children.length) fisikEl.innerHTML = '<span style="color:#bbb;font-size:0.85rem;">Belum diisi...</span>';

        // Non-fisik tags
        const nfEl = document.getElementById('preview-nonfisik');
        nfEl.innerHTML = '';
        ['hobi', 'sifat', 'cita'].forEach(k => {
            if (idState[k]) {
                const span = document.createElement('span');
                span.className = 'id-tag nonfisik';
                span.textContent = idState[k];
                nfEl.appendChild(span);
            }
        });
        if (!nfEl.children.length) nfEl.innerHTML = '<span style="color:#bbb;font-size:0.85rem;">Belum diisi...</span>';
    }

    // Name input
    const namaInput = document.getElementById('id-nama');
    namaInput?.addEventListener('input', () => {
        idState.nama = namaInput.value;
        updatePreview();
    });

    // Choice pills
    document.querySelectorAll('.choice-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            const group = pill.dataset.group;
            const val = pill.dataset.val;

            // Deselect siblings
            document.querySelectorAll(`.choice-pill[data-group="${group}"]`).forEach(p => {
                p.classList.remove('selected');
            });

            pill.classList.add('selected');
            idState[group] = val;

            if (group === 'jk' && pill.dataset.avatar) {
                idState.avatar = pill.dataset.avatar;
            }
            updatePreview();
        });
    });

    // Save
    document.getElementById('save-card-btn')?.addEventListener('click', () => {
        if (!idState.nama) { alert('Jangan lupa isi namamu dulu ya! 😊'); return; }
        const msg = document.getElementById('save-msg');
        msg.style.display = 'block';
        fireConfetti();
        setTimeout(() => { msg.style.display = 'none'; }, 3000);
    });

    updatePreview();

    // ==================== TAB 2: FISIK vs NONFISIK SORT ====================
    const sortItems = [
        { label: '🖤 Warna Rambut',    category: 'fisik' },
        { label: '📏 Tinggi Badan',     category: 'fisik' },
        { label: '🧑 Jenis Kelamin',   category: 'fisik' },
        { label: '🌿 Warna Kulit',      category: 'fisik' },
        { label: '👀 Warna Mata',       category: 'fisik' },
        { label: '⚖️ Berat Badan',      category: 'fisik' },
        { label: '📚 Hobi Membaca',     category: 'nonfisik' },
        { label: '🎵 Suka Bernyanyi',   category: 'nonfisik' },
        { label: '😄 Kepribadian Ceria',category: 'nonfisik' },
        { label: '🙏 Agama',           category: 'nonfisik' },
        { label: '🎯 Cita-cita',        category: 'nonfisik' },
        { label: '💡 Kreatif',          category: 'nonfisik' },
    ];

    let sortState = {};

    function initSort() {
        sortState = {};
        const bank = document.getElementById('sort-bank');
        const binFisik = document.getElementById('bin-fisik-items');
        const binNonFisik = document.getElementById('bin-nonfisik-items');
        const resultEl = document.getElementById('sort-result');

        bank.innerHTML = '';
        binFisik.innerHTML = '';
        binNonFisik.innerHTML = '';
        resultEl.className = 'sort-result';
        resultEl.textContent = '';

        // Shuffle
        const shuffled = [...sortItems].sort(() => Math.random() - 0.5);

        shuffled.forEach((item, idx) => {
            const card = document.createElement('div');
            card.className = 'sort-card';
            card.textContent = item.label;
            card.dataset.idx = idx;
            card.dataset.cat = item.category;
            card.draggable = true;

            // Desktop Drag
            card.addEventListener('dragstart', e => {
                e.dataTransfer.setData('text/plain', idx);
                e.dataTransfer.effectAllowed = 'move';
                setTimeout(() => card.style.opacity = '0.4', 0);
            });

            card.addEventListener('dragend', () => card.style.opacity = '');

            // Mobile touch — clone follows finger
            let clone = null;
            card.addEventListener('touchstart', e => {
                const touch = e.touches[0];
                clone = card.cloneNode(true);
                clone.style.cssText = `
                    position:fixed; z-index:9000; pointer-events:none;
                    opacity:0.85; transform:scale(1.08);
                    width:${card.offsetWidth}px;
                    left:${touch.clientX - card.offsetWidth / 2}px;
                    top:${touch.clientY - 20}px;
                `;
                document.body.appendChild(clone);
                card.style.opacity = '0.3';
            }, { passive: true });

            card.addEventListener('touchmove', e => {
                e.preventDefault();
                const touch = e.touches[0];
                if (clone) {
                    clone.style.left = `${touch.clientX - clone.offsetWidth / 2}px`;
                    clone.style.top = `${touch.clientY - 20}px`;
                }
                document.querySelectorAll('.sort-bin').forEach(b => b.classList.remove('hovered'));
                const el = document.elementFromPoint(touch.clientX, touch.clientY);
                el?.closest('.sort-bin')?.classList.add('hovered');
            }, { passive: false });

            card.addEventListener('touchend', e => {
                if (clone) { clone.remove(); clone = null; }
                card.style.opacity = '';
                const touch = e.changedTouches[0];
                const el = document.elementFromPoint(touch.clientX, touch.clientY);
                const bin = el?.closest('.sort-bin');
                if (bin) handleSort(card, bin, item);
                document.querySelectorAll('.sort-bin').forEach(b => b.classList.remove('hovered'));
            }, { passive: true });

            // Click to sort (simple)
            card.addEventListener('click', () => {
                if (card.classList.contains('placed')) return;
                // Quick sort on click: auto-route to correct bin for feedback (optional: let them choose)
                // Show choice prompt via inline toggle
                card.style.outline = '2px solid var(--secondary)';
                const pickFisik = confirm(`"${item.label}" — Masuk ke Identitas Fisik? (Tekan OK = Fisik, Cancel = Non-Fisik)`);
                card.style.outline = '';
                const bin = document.getElementById(pickFisik ? 'bin-fisik' : 'bin-nonfisik');
                handleSort(card, bin, item);
            });

            bank.appendChild(card);
        });

        // Bin drop events
        ['bin-fisik', 'bin-nonfisik'].forEach(binId => {
            const bin = document.getElementById(binId);
            bin.addEventListener('dragover', e => { e.preventDefault(); bin.classList.add('hovered'); });
            bin.addEventListener('dragleave', () => bin.classList.remove('hovered'));
            bin.addEventListener('drop', e => {
                e.preventDefault();
                bin.classList.remove('hovered');
                const idx = e.dataTransfer.getData('text/plain');
                const card = bank.querySelector(`[data-idx="${idx}"]`);
                if (card) handleSort(card, bin, shuffled[idx]);
            });
        });
    }

    function handleSort(card, bin, item) {
        if (card.classList.contains('placed')) return;

        const isCorrectBin = (bin.id === 'bin-fisik' && item.category === 'fisik')
            || (bin.id === 'bin-nonfisik' && item.category === 'nonfisik');

        const chip = document.createElement('div');
        chip.className = `sort-bin-item ${isCorrectBin
            ? (item.category === 'fisik' ? 'fisik-item' : 'nonfisik-item')
            : 'wrong-item'}`;
        chip.textContent = item.label;

        if (isCorrectBin) {
            bin.querySelector('.sort-bin-items').appendChild(chip);
            card.classList.add('placed');
            sortState[item.label] = true;
        } else {
            const wrongBin = document.getElementById(bin.id === 'bin-fisik' ? 'bin-nonfisik' : 'bin-fisik');
            wrongBin.querySelector('.sort-bin-items').appendChild(chip);
            card.classList.add('shake');
            setTimeout(() => { chip.remove(); card.classList.remove('shake'); }, 600);
            sortState[item.label] = false;
            return;
        }

        // Check if all done
        const total = document.querySelectorAll('.sort-card').length;
        const placed = document.querySelectorAll('.sort-card.placed').length;
        if (placed === total) {
            const correct = Object.values(sortState).filter(Boolean).length;
            const res = document.getElementById('sort-result');
            if (correct === total) {
                res.className = 'sort-result good';
                res.textContent = `🎉 Luar biasa! Semua ${total} kartu benar! Kamu sudah paham perbedaan identitas fisik dan nonfisik!`;
                fireConfetti();
            } else {
                res.className = 'sort-result retry';
                res.textContent = `Kamu benar ${correct} dari ${total}. Coba lagi ya! Klik tombol "Coba Lagi".`;
            }
        }
    }

    initSort();
    document.getElementById('reset-sort')?.addEventListener('click', initSort);

    // ==================== TAB 3: KELUARGA & TEMAN ====================
    const friends = [
        {
            image: 'assets/Identitas/Niko.jpg', 
            name: 'Niko', 
            tagline: 'Atlet Voli',
            fisik: ['Tinggi', 'Rambut Hitam', 'Kulit Sawo Matang', 'Laki-Laki'],
            nonfisik: ['Hobi: Bermain Voli', 'Sifat: Peduli', 'Cita-cita: Atlet'],
            pesan: 'Niko adalah anak yang baik, peduli, dan menjunjung tinggi persahabatan. Ia juga suka memberi semangat kepada teman-temannya.'
        },
        {
            image: 'assets/Identitas/Putri.jpg', 
            name: 'Putri', 
            tagline: 'Chef Ceria',
            fisik: ['Pendek', 'Rambut Coklat', 'Kulit Putih', 'Perempuan'],
            nonfisik: ['Hobi: Memasak', 'Sifat: Ceria & Ramah', 'Cita-cita: Chef'],
            pesan: 'Putri adalah anak yang ceria, ramah, dan suka membantu. Ia gemar memasak serta memiliki cita-cita menjadi seorang chef. Putri juga senang berbagi dan membuat orang lain bahagia.'
        },
        {
            image: 'assets/Identitas/Pak Samsu.jpg', 
            name: 'Pak Samsu', 
            tagline: 'Pekerja Kantoran yang Ramah',
            fisik: ['Tinggi Berisi', 'Rambut Hitam Ikal', 'Kulit Sawo Matang', 'Laki-Laki'],
            nonfisik: ['Usia: 40-45 th', 'Pekerjaan: Kantoran', 'Sifat: Berwibawa'],
            pesan: 'Pak Samsu adalah pria yang ramah dan berwibawa. Sebagai pekerja kantoran, ia terlihat rapi, profesional, serta tetap hangat dan mudah didekati.'
        },
        {
            image: 'assets/Identitas/Nenek Vira.jpg', 
            name: 'Nenek Vira', 
            tagline: 'Nenek Penyayang',
            fisik: ['Tinggi Kurus', 'Rambut Putih Diikat', 'Kulit Sawo Matang', 'Perempuan'],
            nonfisik: ['Usia: 50-60 th', 'Sifat: Penyayang & Bijaksana'],
            pesan: 'Nenek Vira adalah sosok yang penyayang dan bijaksana. Ia selalu memberikan nasihat yang baik dan menjadi tempat bersandar bagi orang-orang di sekitarnya.'
        },
        {
            image: 'assets/Identitas/Andi.jpg', 
            name: 'Andi', 
            tagline: 'Anak Pemberani',
            fisik: ['Pendek Kurus', 'Rambut Pirang', 'Kulit Hitam', 'Laki-Laki'],
            nonfisik: ['Usia: 5-10 th', 'Sifat: Penyayang & Pemberani'],
            pesan: 'Andi adalah anak yang pemberani dan penuh semangat. Meski tubuhnya kecil, semangatnya tak pernah mengecil. Sifatnya yang penyayang membuatnya mudah disukai dan selalu siap membantu orang lain.'
        }
    ];

    const friendGrid = document.getElementById('friend-grid');
    friends.forEach((f, i) => {
        const card = document.createElement('div');
        card.className = 'friend-card';
        card.innerHTML = `
            <img class="friend-avatar-img" src="${f.image}" alt="${f.name}">
            <div class="friend-name">${f.name}</div>
            <div class="friend-desc">${f.tagline}</div>
        `;
        card.addEventListener('click', () => openFriendModal(f));
        friendGrid?.appendChild(card);
    });

    function openFriendModal(f) {
        document.getElementById('modal-avatar-img').src = f.image;
        document.getElementById('modal-avatar-img').alt = f.name;
        document.getElementById('modal-name').textContent = f.name;
        document.getElementById('modal-tagline').textContent = f.tagline;
        document.getElementById('modal-pesan').textContent = f.pesan;

        const tagsEl = document.getElementById('modal-tags');
        tagsEl.innerHTML = '';
        f.fisik.forEach(t => {
            const chip = document.createElement('span');
            chip.className = 'id-chip fisik';
            chip.innerHTML = `🔵 ${t}`;
            tagsEl.appendChild(chip);
        });
        f.nonfisik.forEach(t => {
            const chip = document.createElement('span');
            chip.className = 'id-chip nonfisik';
            chip.innerHTML = `🔴 ${t}`;
            tagsEl.appendChild(chip);
        });

        document.getElementById('friend-modal').classList.add('active');
    }

    // Close modal on overlay click
    document.getElementById('friend-modal')?.addEventListener('click', function (e) {
        if (e.target === this) this.classList.remove('active');
    });

    // ==================== TAB 4: MENGHARGAI PERBEDAAN ====================
    const scenarios = [
        {
            emoji: '🤝',
            question: 'Temanmu, Budi, berasal dari Sulawesi dan membawa bekal makanan khas daerahnya. Kamu belum pernah mencicipinya. Apa yang kamu lakukan?',
            options: [
                { text: 'Menolak dan bilang makanannya aneh', correct: false, feedback: 'Menolak makanan teman bisa menyakiti perasaannya. Lebih baik mencoba dengan pikiran terbuka!' },
                { text: 'Mencicipi dengan pikiran terbuka dan bertanya nama makanannya', correct: true, feedback: '🌟 Bagus! Mencoba sesuatu yang baru dengan pikiran terbuka adalah tanda menghargai budaya orang lain!' },
                { text: 'Pura-pura tidak melihat', correct: false, feedback: 'Lebih baik bersikap ramah dan menunjukkan ketertarikanmu!' },
            ]
        },
        {
            emoji: '🕌',
            question: 'Temanmu, Sari, sedang beribadah sesuai kepercayaannya. Kamu dan Sari berbeda agama. Apa yang kamu lakukan?',
            options: [
                { text: 'Mengganggunya dan mengajaknya bermain', correct: false, feedback: 'Mengganggu orang yang sedang beribadah tidak sopan dan menyakiti perasaannya.' },
                { text: 'Menunggunya dengan sabar dan menghormati waktu ibadahnya', correct: true, feedback: '🌟 Hebat! Menghormati waktu ibadah teman adalah tanda persahabatan yang sejati!' },
                { text: 'Pergi dan tidak mau berteman lagi dengannya', correct: false, feedback: 'Perbedaan agama bukan alasan untuk tidak berteman. Kita bisa saling menghormati!' },
            ]
        },
        {
            emoji: '♿',
            question: 'Ada teman baru yang menggunakan kursi roda di kelasmu. Teman-teman lain tidak mau duduk di dekatnya. Apa yang kamu lakukan?',
            options: [
                { text: 'Ikut menjauhi teman baru itu agar tidak dianggap aneh', correct: false, feedback: 'Menjauhi seseorang karena perbedaan fisik adalah tindakan tidak adil.' },
                { text: 'Mendekatinya, memperkenalkan diri, dan mengajaknya bergabung', correct: true, feedback: '🌟 Luar biasa! Kamu adalah teman yang baik! Semua orang berhak mendapat teman yang tulus.' },
                { text: 'Membicarakannya dengan teman-teman yang lain', correct: false, feedback: 'Membicarakan kelemahan orang lain bisa menyakiti perasaan mereka.' },
            ]
        },
        {
            emoji: '🎨',
            question: 'Saat belajar kelompok, Reza selalu menggambar-gambar di bukunya. Kamu merasa itu mengganggu. Apa yang kamu lakukan?',
            options: [
                { text: 'Memarahinya di depan semua teman', correct: false, feedback: 'Memarahi teman di depan umum bisa mempermalukannya.' },
                { text: 'Berbicara baik-baik dengannya secara langsung setelah belajar', correct: true, feedback: '🌟 Tepat! Komunikasi yang baik dan sopan adalah kunci memecahkan masalah.' },
                { text: 'Melaporkannya ke guru tanpa mencoba bicara dulu', correct: false, feedback: 'Coba selesaikan terlebih dahulu dengan berbicara baik-baik. Itu lebih bijaksana!' },
            ]
        },
        {
            emoji: '🌏',
            question: 'Temanmu Ahmad berbicara dengan logat yang berbeda. Teman-teman lain menirukan logat Ahmad sambil tertawa. Apa yang kamu lakukan?',
            options: [
                { text: 'Ikut menirukan dan tertawa bersama', correct: false, feedback: 'Menirukan cara bicara seseorang untuk bercanda bisa menyakiti perasaannya.' },
                { text: 'Diam saja dan pura-pura tidak tahu', correct: false, feedback: 'Membiarkan teman diperlakukan tidak adil juga bukan tindakan yang benar.' },
                { text: 'Membela Ahmad dan mengingatkan teman-teman bahwa perbedaan logat itu wajar', correct: true, feedback: '🌟 Bravo! Keberanian membela yang benar adalah tanda karakter mulia!' },
            ]
        },
        {
            emoji: '🏆',
            question: 'Tim kamu kalah dalam perlombaan. Sementera tim lawan menang dan merayakannya. Apa sikap terbaik yang kamu tunjukkan?',
            options: [
                { text: 'Mengucapkan selamat kepada tim lawan dengan tulus', correct: true, feedback: '🌟 Sikap ksatria! Mengakui kemenangan orang lain dengan ikhlas adalah sikap yang sangat mulia.' },
                { text: 'Pergi tanpa mengucapkan apa-apa karena kesal', correct: false, feedback: 'Meski kecewa, tetap bersikap sopan kepada pemenang adalah hal yang penting.' },
                { text: 'Mencari alasan bahwa kemenangan mereka tidak adil', correct: false, feedback: 'Menerima hasil dengan lapang dada adalah tanda kedewasaan.' },
            ]
        },
    ];

    let currentScenario = 0;
    let quizScore = 0;
    const wrongIndexes = [];

    function initScenarios() {
        currentScenario = 0;
        quizScore = 0;
        wrongIndexes.length = 0;
        document.getElementById('final-score-box').style.display = 'none';
        document.getElementById('scenario-area').style.display = 'block';
        renderScenario(0);
    }

    function renderProgressDots() {
        const dots = document.getElementById('prog-dots');
        if (!dots) return;
        dots.innerHTML = '';
        scenarios.forEach((_, i) => {
            const d = document.createElement('div');
            d.className = 'prog-dot' + (i === currentScenario ? ' current' : '')
                + (i < currentScenario ? (wrongIndexes.includes(i) ? ' wrong-dot' : ' done') : '');
            dots.appendChild(d);
        });
    }

    function renderScenario(idx) {
        const s = scenarios[idx];
        renderProgressDots();

        const area = document.getElementById('scenario-area');
        area.innerHTML = `
            <div class="scenario-card">
                <span class="scenario-emoji">${s.emoji}</span>
                <p style="font-size:0.8rem; font-weight:700; color:#aaa; margin-bottom:0.5rem;">
                    Situasi ${idx + 1} dari ${scenarios.length}
                </p>
                <p class="scenario-question">${s.question}</p>
                <div class="scenario-options" id="opts-${idx}"></div>
                <div class="scenario-feedback" id="fb-${idx}"></div>
            </div>
        `;

        const optsEl = document.getElementById(`opts-${idx}`);
        s.options.forEach((opt, oi) => {
            const btn = document.createElement('button');
            btn.className = 'scenario-btn';
            btn.textContent = opt.text;
            btn.addEventListener('click', () => {
                optsEl.querySelectorAll('.scenario-btn').forEach(b => b.disabled = true);
                const fb = document.getElementById(`fb-${idx}`);
                if (opt.correct) {
                    btn.classList.add('correct');
                    quizScore++;
                    fb.className = 'scenario-feedback show ok';
                    fb.textContent = opt.feedback;
                    fireConfetti();
                } else {
                    btn.classList.add('wrong');
                    wrongIndexes.push(idx);
                    fb.className = 'scenario-feedback show no';
                    fb.textContent = opt.feedback;
                    // Highlight correct
                    optsEl.querySelectorAll('.scenario-btn').forEach((b, bi) => {
                        if (s.options[bi].correct) b.classList.add('correct');
                    });
                }

                // Next button
                const nav = document.createElement('div');
                nav.className = 'scenario-nav';
                const nextBtn = document.createElement('button');
                nextBtn.className = 'btn-primary';
                const isLast = idx === scenarios.length - 1;
                nextBtn.textContent = isLast ? '🏆 Lihat Hasil!' : 'Lanjut →';
                nextBtn.addEventListener('click', () => {
                    if (isLast) showFinalScore();
                    else {
                        currentScenario++;
                        renderScenario(currentScenario);
                    }
                });
                nav.appendChild(nextBtn);
                document.querySelector('.scenario-card').appendChild(nav);
            });
            optsEl.appendChild(btn);
        });
    }

    function showFinalScore() {
        document.getElementById('scenario-area').style.display = 'none';
        const box = document.getElementById('final-score-box');
        box.style.display = 'block';
        document.getElementById('final-score-val').textContent = `${quizScore}/${scenarios.length}`;

        const labels = ['Yuk, coba belajar lagi! 💪', 'Kamu sudah berusaha! Terus berlatih! 🌱', 'Bagus! Sedikit lagi sempurna! 🎯', 'Kamu sudah sangat baik! ⭐', 'Luar biasa! Kamu juara! 🏆'];
        const labelIdx = Math.min(Math.floor(quizScore / (scenarios.length / labels.length)), labels.length - 1);
        document.getElementById('final-label').textContent = labels[labelIdx];

        // Badges
        const badges = [
            { icon: '🌟', name: 'Bintang Baik Hati', unlock: quizScore >= 1 },
            { icon: '🕊️', name: 'Pahlawan Damai', unlock: quizScore >= 3 },
            { icon: '🌈', name: 'Penjaga Keragaman', unlock: quizScore >= 5 },
            { icon: '🏆', name: 'Pemimpin Toleran', unlock: quizScore === 6 },
        ];

        const badgeRow = document.getElementById('badge-row');
        badgeRow.innerHTML = '';
        badges.forEach(b => {
            const div = document.createElement('div');
            div.className = 'badge' + (b.unlock ? '' : ' locked');
            div.innerHTML = `<span class="badge-icon">${b.icon}</span><div class="badge-name">${b.name}</div>`;
            badgeRow.appendChild(div);
        });

        if (quizScore >= 4) fireConfetti();
        renderProgressDots();
    }

    document.getElementById('restart-quiz')?.addEventListener('click', initScenarios);
    initScenarios();

    // ==================== CONFETTI (shared) ====================
    function fireConfetti() {
        const canvas = document.getElementById('confetti');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const shapes = ['square', 'circle', 'triangle'];
        const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF9F43', '#54A0FF', '#A29BFE'];
        const pieces = Array.from({ length: 150 }, () => ({
            x: canvas.width / 2,
            y: canvas.height * 0.55,
            vx: (Math.random() - 0.5) * 26,
            vy: (Math.random() - 0.9) * 24,
            size: Math.random() * 11 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 10,
            shape: shapes[Math.floor(Math.random() * shapes.length)],
            gravity: 0.55 + Math.random() * 0.35
        }));

        let frame;
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let active = false;
            pieces.forEach(p => {
                p.x += p.vx; p.y += p.vy; p.vy += p.gravity; p.rotation += p.rotSpeed;
                if (p.y < canvas.height + 50) {
                    active = true;
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.rotation * Math.PI / 180);
                    ctx.fillStyle = p.color;
                    if (p.shape === 'square') ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                    else if (p.shape === 'circle') { ctx.beginPath(); ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2); ctx.fill(); }
                    else { ctx.beginPath(); ctx.moveTo(0, -p.size / 2); ctx.lineTo(p.size / 2, p.size / 2); ctx.lineTo(-p.size / 2, p.size / 2); ctx.closePath(); ctx.fill(); }
                    ctx.restore();
                }
            });
            if (active) frame = requestAnimationFrame(animate);
            else ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        if (frame) cancelAnimationFrame(frame);
        animate();
    }

})();
