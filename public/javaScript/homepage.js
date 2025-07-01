// Carrossel Grid Animado
document.addEventListener('DOMContentLoaded', function() {
    const carrosselGrid = document.querySelector('.carrossel-grid');
    const cards = document.querySelectorAll('.depoimento-grid-card');
    const bullets = document.querySelectorAll('.carrossel-grid-bullet');
    const prevBtn = document.querySelector('.carrossel-grid-prev');
    const nextBtn = document.querySelector('.carrossel-grid-next');
    let currentIndex = 0;
    const cardsPerSlide = 3;
    let intervalId;
    
    // Configuração inicial
    function updateCarrossel() {
        const translateX = -currentIndex * (100 / cardsPerSlide);
        carrosselGrid.style.transform = `translateX(${translateX}%)`;
        
        // Atualizar bullets
        bullets.forEach((bullet, i) => {
            bullet.classList.toggle('active', i === currentIndex);
        });
    }
    
    // Navegação
    function goToSlide(index) {
        currentIndex = index;
        updateCarrossel();
        resetInterval();
    }
    
    prevBtn.addEventListener('click', () => {
        currentIndex = Math.max(0, currentIndex - 1);
        updateCarrossel();
        resetInterval();
    });
    
    nextBtn.addEventListener('click', () => {
        const maxIndex = Math.ceil(cards.length / cardsPerSlide) - 1;
        currentIndex = Math.min(maxIndex, currentIndex + 1);
        updateCarrossel();
        resetInterval();
    });
    
    // Bullets
    bullets.forEach((bullet, index) => {
        bullet.addEventListener('click', () => {
            goToSlide(index);
        });
    });
    
    // Auto-play
    function startInterval() {
        intervalId = setInterval(() => {
            const maxIndex = Math.ceil(cards.length / cardsPerSlide) - 1;
            currentIndex = (currentIndex + 1) % (maxIndex + 1);
            updateCarrossel();
        }, 5000);
    }
    
    function resetInterval() {
        clearInterval(intervalId);
        startInterval();
    }
    
    // Pausar ao interagir
    const container = document.querySelector('.carrossel-grid-container');
    container.addEventListener('mouseenter', () => {
        clearInterval(intervalId);
    });
    
    container.addEventListener('mouseleave', () => {
        startInterval();
    });
    
    // Inicializar
    updateCarrossel();
    startInterval();
    
    // Responsividade
    function handleResize() {
        if (window.innerWidth <= 992) {
            carrosselGrid.style.transform = 'none';
        } else {
            updateCarrossel();
        }
    }
    
    window.addEventListener('resize', handleResize);
    handleResize();
});