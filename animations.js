// --- CONFIGURAÇÃO THREE.JS (FUNDO) ---
const canvas = document.querySelector('#particles-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 50;

const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const group = new THREE.Group();
scene.add(group);

const particleCount = 600;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i++) { positions[i] = (Math.random() - 0.5) * 150; }
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const pMaterial = new THREE.PointsMaterial({ color: 0x7d5fff, size: 0.4, transparent: true, opacity: 0.8 });
const particles = new THREE.Points(geometry, pMaterial);
group.add(particles);

const lineGeo = new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(60, 1));
const lineMat = new THREE.LineBasicMaterial({ color: 0x00d2ff, transparent: true, opacity: 0.05 });
const lines = new THREE.LineSegments(lineGeo, lineMat);
group.add(lines);

let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.001;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.001;
});

function animate() {
    requestAnimationFrame(animate);
    group.rotation.y += 0.001; group.rotation.x += 0.0005;
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

// --- ANIMAÇÕES GSAP ---
document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Troca de Fundos
    gsap.set("#bg-1", { opacity: 1 }); gsap.set("#bg-2", { opacity: 0 }); gsap.set("#bg-3", { opacity: 0 }); gsap.set("#bg-4", { opacity: 0 });
    let tl1 = gsap.timeline({ scrollTrigger: { trigger: "#live-demo", start: "top bottom", end: "center center", scrub: true } });
    tl1.to("#bg-1", { opacity: 0 }).to("#bg-2", { opacity: 1 }, "<");
    let tl_mobile = gsap.timeline({ scrollTrigger: { trigger: "#mobile-app", start: "top bottom", end: "center center", scrub: true } });
    tl_mobile.to("#bg-2", { opacity: 0 }).to("#bg-4", { opacity: 1 }, "<");
    let tl2 = gsap.timeline({ scrollTrigger: { trigger: "#contact", start: "top bottom", end: "center center", scrub: true } });
    tl2.to("#bg-4", { opacity: 0 }).to("#bg-3", { opacity: 1 }, "<");

    // Reveal Elements
    const revealSettings = { y: 80, opacity: 0, duration: 0.8, ease: "power3.out" };
    const scrollConfig = (trigger) => ({ trigger: trigger, start: "top 85%", end: "bottom 15%", toggleActions: "play reverse play reverse" });

    gsap.from(".dashboard-wrapper", { scrollTrigger: scrollConfig(".dashboard-wrapper"), ...revealSettings, scale: 0.9 });
    gsap.from(".cube-container", { scrollTrigger: scrollConfig(".cube-container"), ...revealSettings, y: -100, delay: 0.2 });
    gsap.from(".mobile-text", { scrollTrigger: scrollConfig(".mobile-text"), ...revealSettings, x: -50 });
    gsap.from(".phone-card", { scrollTrigger: scrollConfig(".phone-card"), ...revealSettings, x: 50, delay: 0.1 });
    gsap.from(".offer-header", { scrollTrigger: scrollConfig(".offer-header"), ...revealSettings, y: 40 });
    gsap.utils.toArray('.offer-card').forEach((card, i) => { card.style.transition = "none"; gsap.from(card, { scrollTrigger: scrollConfig(card), ...revealSettings, y: 100, delay: i * 0.1 }); });
    gsap.from(".offer-cta-premium", { scrollTrigger: scrollConfig(".offer-cta-premium"), ...revealSettings, scale: 0.9 });
    gsap.from(".contact-text", { scrollTrigger: scrollConfig(".contact-text"), ...revealSettings, x: -50 });
    gsap.from(".flip-card-container", { scrollTrigger: scrollConfig(".flip-card-container"), ...revealSettings, x: 50, rotateY: 30 });

    // Efeitos de Mouse
    gsap.from(".btn-content .letter", { y: 20, opacity: 0, duration: 0.5, stagger: 0.1, ease: "back.out(1.7)", delay: 1 });
    
    const btn3d = document.querySelector('.btn-budget-3d');
    const btnGlow = document.querySelector('.btn-glow');
    if(btn3d) {
        btn3d.addEventListener('mousemove', (e) => {
            const rect = btn3d.getBoundingClientRect();
            const x = e.clientX - rect.left; const y = e.clientY - rect.top;
            const centerX = rect.width / 2; const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -20; const rotateY = ((x - centerX) / centerX) * 20;
            btn3d.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.1)`;
            btnGlow.style.background = `radial-gradient(circle at ${x}px ${y}px, var(--neon-blue), transparent 70%)`;
        });
        btn3d.addEventListener('mouseleave', () => {
            btn3d.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
            btnGlow.style.background = `radial-gradient(circle at center, var(--neon-blue), transparent 70%)`;
        });
    }

    document.querySelectorAll('.service-card-modern').forEach(card => {
        card.addEventListener('mousemove', e => {
            // Se quiser efeito 3D nos cards novos tbm (opcional)
        });
    });
});