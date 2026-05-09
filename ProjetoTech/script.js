// ========================================
// FUNCIONALIDADES INTERATIVAS
// ========================================

// Aguardar o carregamento do DOM
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
    initializeScrollEffects();
    initializeSmoothScroll();
});

// ========================================
// BUSCA DE JOGOS
// ========================================

function initializeSearch() {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const dateInput = document.getElementById('dateInput');

    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const searchTerm = searchInput.value.trim().toLowerCase();
            const selectedDate = dateInput.value;

            if (!searchTerm && !selectedDate) {
                alert('Por favor, digite um time/campeonato ou selecione uma data');
                return;
            }

            performSearch(searchTerm, selectedDate);
        });
    }
}

function performSearch(term, date) {
    const gameCards = document.querySelectorAll('.game-card');
    let resultsFound = 0;

    gameCards.forEach(card => {
        const cardText = card.textContent.toLowerCase();
        const isVisible = (!term || cardText.includes(term)) && 
                         (!date || cardText.includes(formatDate(date)));
        
        if (isVisible) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.3s ease-in';
            resultsFound++;
        } else {
            card.style.display = 'none';
        }
    });

    if (resultsFound === 0) {
        console.log('Nenhum resultado encontrado para: ' + term + ' ' + date);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return day + '/' + month;
}

// ========================================
// EFEITOS DE SCROLL
// ========================================

function initializeScrollEffects() {
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// ========================================
// SCROLL SUAVE
// ========================================

function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// ANIMAÇÃO DE CARREGAMENTO
// ========================================

function addLoadingAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes pulse {
            0%, 100% {
                opacity: 1;
            }
            50% {
                opacity: 0.5;
            }
        }

        .fade-in {
            animation: fadeIn 0.6s ease-in-out;
        }

        .slide-in-up {
            animation: slideInUp 0.8s ease-out;
        }
    `;
    document.head.appendChild(style);
}

// Chamar função de animação
addLoadingAnimation();

// ========================================
// INTERATIVIDADE DOS BOTÕES
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Efeito de ripple
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });
});

// Adicionar estilos para ripple effect
const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }

    .ripple {
        position: absolute;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: rippleAnimation 0.6s ease-out;
        pointer-events: none;
    }

    @keyframes rippleAnimation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyles);

// ========================================
// INTERATIVIDADE DOS CARDS
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const gameCards = document.querySelectorAll('.game-card');
    
    gameCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 20px 25px -5px rgba(34, 197, 94, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        });
    });
});

// ========================================
// CONTADOR DE RESULTADOS
// ========================================

function updateResultsCounter() {
    const visibleCards = document.querySelectorAll('.game-card:not([style*="display: none"])').length;
    console.log('Jogos encontrados: ' + visibleCards);
    return visibleCards;
}

// ========================================
// FUNÇÃO AUXILIAR - VALIDAÇÃO DE ENTRADA
// ========================================

function validateSearchInput(input) {
    // Remove caracteres especiais perigosos
    return input.replace(/[<>]/g, '').trim();
}

// ========================================
// NOTIFICAÇÕES (Exemplo básico)
// ========================================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification notification-' + type;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background-color: ${type === 'success' ? '#22c55e' : '#3b82f6'};
        color: white;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========================================
// EVENT LISTENERS PARA PLATAFORMAS
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const platformLinks = document.querySelectorAll('.platform');
    
    platformLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const platformName = this.textContent.trim();
            showNotification('Abrindo ' + platformName + '...', 'success');
            console.log('Redirecionando para: ' + platformName);
        });
    });
});

// ========================================
// CONTROLE DE VISIBILIDADE DE HEADER
// ========================================

let lastScrollTop = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    if (currentScroll > lastScrollTop) {
        // Scroll down - esconder header
        header.style.transform = 'translateY(-100%)';
        header.style.transition = 'transform 0.3s ease';
    } else {
        // Scroll up - mostrar header
        header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});

// ========================================
// LOG DE INICIALIZAÇÃO
// ========================================

console.log('🎉 Onde Assistir - Plataforma de Transmissão de Futebol carregada com sucesso!');
console.log('📺 Pronto para exibir transmissões de jogos');
