// --- 1. CONFIGURAÇÃO THREE.JS (FUNDO COM PARTÍCULAS E LINHAS) ---
const canvas = document.querySelector('#particles-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 50;

const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const group = new THREE.Group();
scene.add(group);

// Geometria das Partículas
const particleCount = 600;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 150;
}
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

// Material das partículas
const pMaterial = new THREE.PointsMaterial({
    color: 0x7d5fff,
    size: 0.4,
    transparent: true,
    opacity: 0.8,
});
const particles = new THREE.Points(geometry, pMaterial);
group.add(particles);

// Linhas conectando
const lineGeo = new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(60, 1));
const lineMat = new THREE.LineBasicMaterial({ color: 0x00d2ff, transparent: true, opacity: 0.05 });
const lines = new THREE.LineSegments(lineGeo, lineMat);
group.add(lines);

let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.001;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.001;
});

function animate() {
    requestAnimationFrame(animate);
    group.rotation.y += 0.001;
    group.rotation.x += 0.0005;
    group.rotation.y += 0.05 * (mouseX - group.rotation.y);
    group.rotation.x += 0.05 * (mouseY - group.rotation.x);
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


// --- 2. SISTEMA DE NOTIFICAÇÃO 3D ---
function showCustomNotification(message, type = 'success') {
    const container = document.getElementById('notification-container');
    const card = document.createElement('div');
    card.className = `notify-card ${type}`;
    
    let icon = type === 'success' ? '<i class="fa-solid fa-circle-check" style="color:#00ff9d"></i>' : '<i class="fa-solid fa-circle-exclamation" style="color:#ff4757"></i>';
    let title = type === 'success' ? 'Sucesso!' : 'Atenção!';

    card.innerHTML = `
        <div class="notify-icon">${icon}</div>
        <div class="notify-content">
            <h4>${title}</h4>
            <p>${message}</p>
        </div>
    `;

    container.appendChild(card);
    setTimeout(() => { card.classList.add('show'); }, 10);
    setTimeout(() => {
        card.classList.remove('show');
        setTimeout(() => { card.remove(); }, 400);
    }, 3000);
}


// --- 3. SIMULADOR FINANCEIRO ---
let currentType = 'income';
let transactions = [];
let myChart;

function initChart() {
    const ctx = document.getElementById('demoChart').getContext('2d');
    Chart.defaults.color = '#888';
    Chart.defaults.font.family = 'Montserrat';
    
    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Entradas', 'Saídas'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['#00ff9d', '#ff4757'],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } } },
            animation: { animateScale: true, animateRotate: true }
        }
    });
}

window.setType = function(type) {
    currentType = type;
    document.querySelectorAll('.t-opt').forEach(el => el.classList.remove('active'));
    if(type === 'income') {
        document.getElementById('btn-inc').classList.add('active');
    } else {
        document.getElementById('btn-exp').classList.add('active');
    }
};

window.addTransaction = function() {
    const desc = document.getElementById('descInput').value;
    const amount = parseFloat(document.getElementById('amountInput').value);
    const cat = document.getElementById('catInput').value;

    if(!desc || isNaN(amount) || amount <= 0) {
        showCustomNotification("Preencha a descrição e um valor válido.", "error");
        return;
    }

    const transaction = { id: Date.now(), desc, amount, category: cat, type: currentType };
    transactions.unshift(transaction);
    updateUI();
    
    showCustomNotification("Registro adicionado com sucesso!", "success");
    document.getElementById('descInput').value = '';
    document.getElementById('amountInput').value = '';
};

window.deleteTransaction = function(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateUI();
    showCustomNotification("Registro removido.", "error");
};

window.editTransaction = function(id) {
    const item = transactions.find(t => t.id === id);
    if(item) {
        document.getElementById('descInput').value = item.desc;
        document.getElementById('amountInput').value = item.amount;
        document.getElementById('catInput').value = item.category;
        window.setType(item.type);
        transactions = transactions.filter(t => t.id !== id);
        updateUI();
        document.getElementById('descInput').focus();
        showCustomNotification("Editando: Finalize e clique em adicionar.", "success");
    }
};

function updateUI() {
    const list = document.getElementById('historyList');
    list.innerHTML = '';
    let inc = 0, exp = 0;

    transactions.forEach(t => {
        if(t.type === 'income') inc += t.amount; else exp += t.amount;
        
        const div = document.createElement('div');
        div.className = 'tx-row';
        div.innerHTML = `
            <div class="tx-info">
                <strong>${t.desc}</strong> 
                <span style="color:#666; font-size:0.7rem">(${t.category})</span>
            </div>
            <div class="tx-actions">
                <span class="${t.type === 'income' ? 'inc' : 'exp'}">
                    ${t.type==='income' ? '+' : '-'} R$ ${t.amount.toFixed(2)}
                </span>
                <div class="action-btns">
                    <button onclick="editTransaction(${t.id})" class="act-btn edit"><i class="fa-solid fa-pen"></i></button>
                    <button onclick="deleteTransaction(${t.id})" class="act-btn del"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        `;
        list.appendChild(div);
    });

    document.getElementById('displayIncome').innerText = `R$ ${inc.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
    document.getElementById('displayExpense').innerText = `R$ ${exp.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;

    if(myChart) {
        myChart.data.datasets[0].data = [inc, exp];
        if(inc === 0 && exp === 0) {
             myChart.data.datasets[0].backgroundColor = ['#222', '#222'];
        } else {
             myChart.data.datasets[0].backgroundColor = ['#00ff9d', '#ff4757'];
        }
        myChart.update();
    }
}

// --- 4. ANIMAÇÕES GSAP (SCROLL REVEAL "INFINITO") ---
document.addEventListener('DOMContentLoaded', () => {
    initChart();
    gsap.registerPlugin(ScrollTrigger);
    
    // --- A. TROCA DE FUNDOS ---
    gsap.set("#bg-1", { opacity: 1 });
    gsap.set("#bg-2", { opacity: 0 });
    gsap.set("#bg-3", { opacity: 0 });
    gsap.set("#bg-4", { opacity: 0 });

    let tl1 = gsap.timeline({ scrollTrigger: { trigger: "#live-demo", start: "top bottom", end: "center center", scrub: true } });
    tl1.to("#bg-1", { opacity: 0 }).to("#bg-2", { opacity: 1 }, "<");

    let tl_mobile = gsap.timeline({ scrollTrigger: { trigger: "#mobile-app", start: "top bottom", end: "center center", scrub: true } });
    tl_mobile.to("#bg-2", { opacity: 0 }).to("#bg-4", { opacity: 1 }, "<");

    let tl2 = gsap.timeline({ scrollTrigger: { trigger: "#contact", start: "top bottom", end: "center center", scrub: true } });
    tl2.to("#bg-4", { opacity: 0 }).to("#bg-3", { opacity: 1 }, "<");


    // --- B. LÓGICA DE ANIMAÇÃO DE ELEMENTOS (CORRIGIDA) ---
    const revealSettings = {
        y: 80,              
        opacity: 0,         
        duration: 0.8,      
        ease: "power3.out"
    };

    // FUNÇÃO MÁGICA: "play reverse play reverse"
    // Garante que o item anime ao entrar e inverta (suma) ao sair, em QUALQUER direção.
    // start: "top 85%" -> Começa a aparecer quando o topo do item entra em 85% da tela.
    // end: "bottom 15%" -> Começa a sumir quando o fundo do item passa os 15% do topo da tela.
    const scrollConfig = (trigger) => ({
        trigger: trigger,
        start: "top 85%", 
        end: "bottom 15%",
        toggleActions: "play reverse play reverse" 
    });

    // 1. Simulador (Demo)
    gsap.from(".dashboard-wrapper", {
        scrollTrigger: scrollConfig(".dashboard-wrapper"),
        ...revealSettings,
        scale: 0.9 
    });

    // 2. Cubo 3D
    gsap.from(".cube-container", {
        scrollTrigger: scrollConfig(".cube-container"),
        ...revealSettings,
        y: -100, 
        delay: 0.2
    });

    // 3. Mobile Text
    gsap.from(".mobile-text", {
        scrollTrigger: scrollConfig(".mobile-text"),
        ...revealSettings,
        x: -50
    });
    
    // 4. Celular 3D
    gsap.from(".phone-card", {
        scrollTrigger: scrollConfig(".phone-card"),
        ...revealSettings,
        x: 50,
        delay: 0.1
    });

    // 5. Título Serviços
    gsap.from(".offer-header", {
        scrollTrigger: scrollConfig(".offer-header"),
        ...revealSettings,
        y: 40
    });

    // 6. Cards de Serviço (Individual para reagir melhor ao subir/descer)
    gsap.utils.toArray('.offer-card').forEach((card, i) => {
        card.style.transition = "none"; // Evita conflito CSS
        gsap.from(card, {
            scrollTrigger: scrollConfig(card),
            ...revealSettings,
            y: 100,
            delay: i * 0.1 
        });
    });

    // 7. Botão CTA
    gsap.from(".offer-cta-premium", {
        scrollTrigger: scrollConfig(".offer-cta-premium"),
        ...revealSettings,
        scale: 0.9
    });

    // 8. Texto Contato
    gsap.from(".contact-text", {
        scrollTrigger: scrollConfig(".contact-text"),
        ...revealSettings,
        x: -50
    });

    // 9. Flip Card Social
    gsap.from(".flip-card-container", {
        scrollTrigger: scrollConfig(".flip-card-container"),
        ...revealSettings,
        x: 50,
        rotateY: 30
    });


    // --- C. EFEITOS DE MOUSE ---
    gsap.from(".btn-content .letter", {
        y: 20, opacity: 0, duration: 0.5, stagger: 0.1, ease: "back.out(1.7)", delay: 1
    });

    const btn3d = document.querySelector('.btn-budget-3d');
    const btnGlow = document.querySelector('.btn-glow');

    if(btn3d) {
        btn3d.addEventListener('mousemove', (e) => {
            const rect = btn3d.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;  
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -20; 
            const rotateY = ((x - centerX) / centerX) * 20;  

            btn3d.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.1)`;
            btnGlow.style.background = `radial-gradient(circle at ${x}px ${y}px, var(--neon-blue), transparent 70%)`;
        });

        btn3d.addEventListener('mouseleave', () => {
            btn3d.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
            btnGlow.style.background = `radial-gradient(circle at center, var(--neon-blue), transparent 70%)`;
        });
    }

    document.querySelectorAll('.offer-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10; 
            const rotateY = ((x - centerX) / centerX) * 10; 

            // Restaura transição para o efeito 3D suave do mouse
            card.style.transition = "transform 0.1s ease-out";
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = ''; 
        });
    });
});


// --- 5. ANIMAÇÃO DE INTRODUÇÃO (LOAD) ---
window.addEventListener('load', () => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Navbar
    tl.from(".logo img", { y: -50, opacity: 0, duration: 1, ease: "back.out(1.7)" })
    .from(".nav-links li", { y: -30, opacity: 0, duration: 0.8, stagger: 0.1 }, "-=0.8")
    .from(".tilt-button-wrapper", { y: -30, opacity: 0, duration: 0.8, ease: "back.out(1.7)" }, "-=0.6");

    // Hero
    tl.from(".hero-content > *", {
        y: 50, opacity: 0, duration: 1, stagger: 0.2, ease: "back.out(1.7)", clearProps: "all"
    }, "-=1");
});