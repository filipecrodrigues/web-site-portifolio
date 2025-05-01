/**
 * Portfolio Website JavaScript
 * 
 * Este arquivo contém todas as funcionalidades para:
 * 1. Menu de navegação responsivo
 * 2. Animações de entrada de elementos
 * 3. Carrossel de projetos
 */

// Esperar que o DOM esteja completamente carregado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas as funcionalidades
    initNavigation();
    initAnimations();
    initCarousel();
});

/**
 * NAVEGAÇÃO RESPONSIVA
 * Controla o comportamento do menu em dispositivos móveis
 */
function initNavigation() {
    const menuToggle = document.querySelector('.navbar-toggle');
    const menuItems = document.querySelector('.menu-items');
    
    if (menuToggle && menuItems) {
        menuToggle.addEventListener('click', function() {
            menuItems.classList.toggle('show');
        });
    }
}

/**
 * ANIMAÇÕES DE ENTRADA
 * Anima elementos conforme aparecem na tela durante a rolagem
 */
function initAnimations() {
    // Elementos que animarão da esquerda para a direita
    const elementosDaEsquerda = [
        '.social-midias',
        '.about-me',
        '.skills-container',
        '.form-container',
        '#projects h2',
        '.project-box:nth-child(odd)' // Elementos de índice ímpar
    ];
    
    // Elementos que animarão da direita para a esquerda
    const elementosDaDireita = [
        '.profile-img',
        '.carousel-nav',
        '.localization',
        '.project-box:nth-child(even)' // Elementos de índice par
    ];
    
    // Adicionar estilos de animação ao documento
    adicionarEstilosAnimacao();
    
    // Aplicar classes iniciais aos elementos
    aplicarClassesIniciais(elementosDaEsquerda, 'da-esquerda');
    aplicarClassesIniciais(elementosDaDireita, 'da-direita');
    
    // Configurar detecção de elementos visíveis durante rolagem
    animarElementosVisiveis();
    window.addEventListener('scroll', animarElementosVisiveis);
    window.addEventListener('resize', animarElementosVisiveis);
}

function adicionarEstilosAnimacao() {
    const folhaDeEstilo = document.createElement('style');
    folhaDeEstilo.textContent = `
        .da-esquerda {
            opacity: 0;
            transform: translateX(-100px);
            transition: all 1s ease-out;
        }
        
        .da-direita {
            opacity: 0;
            transform: translateX(100px);
            transition: all 1s ease-out;
        }
        
        .aparecer {
            opacity: 1;
            transform: translateX(0);
        }
    `;
    document.head.appendChild(folhaDeEstilo);
}

function aplicarClassesIniciais(seletores, classe) {
    seletores.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.classList.add(classe);
        });
    });
}

function estaVisivel(elemento) {
    const posicao = elemento.getBoundingClientRect();
    const alturaJanela = window.innerHeight;
    
    // O elemento está visível se sua parte superior estiver abaixo do topo da janela
    // e sua parte inferior estiver acima da parte inferior da janela
    return (posicao.top < alturaJanela - 100 && posicao.bottom > 0);
}

function animarElementosVisiveis() {
    // Selecionar todos os elementos com classes da-esquerda e da-direita
    const elementosAnimados = document.querySelectorAll('.da-esquerda, .da-direita');
    
    elementosAnimados.forEach(elemento => {
        if (estaVisivel(elemento) && !elemento.classList.contains('aparecer')) {
            // Adicionar a classe aparecer com um pequeno atraso para criar um efeito em cascata
            setTimeout(() => {
                elemento.classList.add('aparecer');
            }, 150);
        }
    });
}

/**
 * CARROSSEL DE PROJETOS
 * Controla a navegação e exibição do carrossel de projetos
 */
function initCarousel() {
    // Verificar se o carrossel existe na página
    const carousel = document.getElementById('carousel');
    if (!carousel) return;
    
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const indicatorsContainer = document.getElementById('indicators');
    
    // Configurações
    const projects = document.querySelectorAll('.project-box');
    let currentSlide = 0;
    let slidesToShow = getSlidesToShow();
    let totalSlides = Math.ceil(projects.length / slidesToShow);
    let autoplayInterval = null;
    
    // Inicialização
    setupCarousel();
    createIndicators();
    updateCarousel();
    startAutoplay();
    
    // Event listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    window.addEventListener('resize', handleResize);
    
    // Pausa o autoplay ao passar o mouse
    carousel.parentElement.addEventListener('mouseenter', stopAutoplay);
    // Retoma o autoplay ao retirar o mouse
    carousel.parentElement.addEventListener('mouseleave', startAutoplay);
    
    function setupCarousel() {
        // Define a largura inicial dos slides baseada no número de slides visíveis
        updateSlideWidth();
    }
    
    function getSlidesToShow() {
        // Número de slides a mostrar baseado na largura da tela
        if (window.innerWidth < 768) {
            return 1;
        } else if (window.innerWidth < 992) {
            return 2;
        } else {
            return 3;
        }
    }
    
    function updateSlideWidth() {
        const containerWidth = carousel.parentElement.clientWidth;
        const margin = 30; // Margem total (15px de cada lado)
        const slideWidth = (containerWidth / slidesToShow) - margin;
        
        projects.forEach(project => {
            project.style.flex = `0 0 ${slideWidth}px`;
        });
    }
    
    function createIndicators() {
        // Limpa indicadores existentes
        indicatorsContainer.innerHTML = '';
        
        // Cria novos indicadores baseado no número total de slides
        for (let i = 0; i < totalSlides; i++) {
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            if (i === 0) indicator.classList.add('active');
            
            indicator.addEventListener('click', () => {
                currentSlide = i;
                updateCarousel();
            });
            
            indicatorsContainer.appendChild(indicator);
        }
    }
    
    function updateCarousel() {
        // Calcula a posição de deslocamento
        const slideWidth = projects[0].offsetWidth + 30; // Largura + margem
        const offset = -currentSlide * slideWidth * slidesToShow;
        
        // Aplica a transformação
        carousel.style.transform = `translateX(${offset}px)`;
        
        // Atualiza os indicadores
        document.querySelectorAll('.indicator').forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
        
        // Ativa/desativa botões de navegação
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === totalSlides - 1;
        
        // Ajusta a opacidade visual dos botões
        prevBtn.style.opacity = currentSlide === 0 ? 0.5 : 1;
        nextBtn.style.opacity = currentSlide === totalSlides - 1 ? 0.5 : 1;
    }
    
    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateCarousel();
        }
    }
    
    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            updateCarousel();
        }
    }
    
    function handleResize() {
        const newSlidesToShow = getSlidesToShow();
        
        // Se o número de slides visíveis mudar, reconfigure o carrossel
        if (newSlidesToShow !== slidesToShow) {
            slidesToShow = newSlidesToShow;
            totalSlides = Math.ceil(projects.length / slidesToShow);
            
            // Ajusta o slide atual se necessário
            if (currentSlide >= totalSlides) {
                currentSlide = totalSlides - 1;
            }
            
            updateSlideWidth();
            createIndicators();
        } else {
            // Caso contrário, apenas atualize a largura dos slides
            updateSlideWidth();
        }
        
        updateCarousel();
    }
    
    function startAutoplay() {
        // Limpa qualquer intervalo existente para evitar múltiplos
        stopAutoplay();
        
        // Inicia um novo intervalo
        autoplayInterval = setInterval(() => {
            if (currentSlide < totalSlides - 1) {
                currentSlide++;
            } else {
                currentSlide = 0;
            }
            updateCarousel();
        }, 5000);
    }
    
    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    }
}




/* Fuções para envio de e-mails */
window.addEventListener('load', function() {
  // Inicializa o EmailJS com sua chave pública
  emailjs.init("pgCeqwicSK5h_v6ZJ");
  
  const form = document.getElementById('contact-form');
  const sendButton = document.getElementById('send-button');
  
  if (!form || !sendButton) {
    console.error('Formulário ou botão não encontrado');
    return;
  }
  
  // Controle anti-spam/rate limiting
  let lastSubmitTime = 0;
  const SUBMIT_COOLDOWN = 60000; // 1 minuto entre envios
  
  sendButton.addEventListener('click', function() {
    // Verificar cooldown
    const now = Date.now();
    if (now - lastSubmitTime < SUBMIT_COOLDOWN) {
      alert('Por favor, aguarde um momento antes de enviar outra mensagem.');
      return;
    }
    
    // Verificar reCAPTCHA
    const recaptchaResponse = grecaptcha.getResponse();

    const isLocalhost = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';
    
    if (!recaptchaResponse && !isLocalhost) {
    alert('Por favor, confirme que você não é um robô.');
    return;
}
    if (!recaptchaResponse) {
      alert('Por favor, confirme que você não é um robô.');
      return;
    }
    
    // Obter e validar inputs
    const name = sanitizeInput(document.getElementById('name').value.trim());
    const cel = sanitizeInput(document.getElementById('cel').value.trim());
    const email = sanitizeInput(document.getElementById('email').value.trim());
    const message = sanitizeInput(document.getElementById('text').value.trim());
    
    // Validações básicas
    if (!name || !cel || !email || !message) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    
    // Validação de e-mail
    if (!isValidEmail(email)) {
      alert('Por favor, informe um e-mail válido.');
      return;
    }
    
    // Validação de telefone
    if (!isValidPhone(cel)) {
      alert('Por favor, informe um número de telefone válido.');
      return;
    }
    
    // Preparar parâmetros
    const templateParams = {
      name: name,
      cel: cel,
      email: email,
      message: message,
      'g-recaptcha-response': recaptchaResponse // Incluir resposta do reCAPTCHA
    };
    
    // Desabilitar botão durante o envio
    sendButton.disabled = true;
    sendButton.value = "Enviando...";
    
    // Enviar e-mail
    emailjs.send('service_wb6f7wl', 'template_5hzasyr', templateParams)
      .then(function(response) {
        console.log('Sucesso:', response);
        alert('Mensagem enviada com sucesso!');
        form.reset();
        lastSubmitTime = Date.now(); // Atualizar tempo do último envio
        grecaptcha.reset(); // Resetar o reCAPTCHA
      }, function(error) {
        console.error('Erro:', error);
        alert('Erro ao enviar. Tente novamente mais tarde.');
      })
      .finally(function() {
        // Reabilitar botão
        sendButton.disabled = false;
        sendButton.value = "Enviar";
      });
  });
  
  // Funções auxiliares
  function sanitizeInput(input) {
    // Sanitização básica para prevenir XSS
    return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  
  function isValidEmail(email) {
    // Expressão regular para validação de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  function isValidPhone(phone) {
    // Validação básica de formato de telefone brasileiro
    return /^[0-9]{10,11}$/.test(phone.replace(/\D/g, ''));
  }
});

/*Função para esconder wapp durante a rolagem */
let whatsapp = document.getElementById('whatsapp');
whatsapp.style.transition = "right 0.5s ease-out";
let scrollTimeout;
window.addEventListener("scroll", () => {
  clearTimeout(scrollTimeout);
  whatsapp.style.right = "-110px";
  scrollTimeout = setTimeout(() => { whatsapp.style.right = "20px"; }, 1000);
});

/*Funções para funcionalidade de banner cookies */
document.addEventListener('DOMContentLoaded', function() {
    // Funções para manipular cookies
    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) {
                return decodeURIComponent(c.substring(nameEQ.length, c.length));
            }
        }
        return null;
    }

    // Elementos do banner
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieSettings = document.getElementById('cookie-settings');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    const rejectCookiesBtn = document.getElementById('reject-cookies');
    const customizeCookiesBtn = document.getElementById('customize-cookies');
    const savePreferencesBtn = document.getElementById('save-preferences');
    const closeSettingsBtn = document.getElementById('close-settings');
    const analyticsCookies = document.getElementById('analytics-cookies');
    const marketingCookies = document.getElementById('marketing-cookies');

    // Verificar se o usuário já fez uma escolha de cookies
    if (!getCookie('cookies-preference')) {
        // Se não fez escolha, mostrar o banner
        cookieBanner.style.display = 'block';
    }

    // Aceitar todos os cookies
    acceptCookiesBtn.addEventListener('click', function() {
        setCookie('cookies-preference', 'accept-all', 365);
        setCookie('cookies-analytics', 'true', 365);
        setCookie('cookies-marketing', 'true', 365);
        cookieBanner.style.display = 'none';
        
    });

    // Rejeitar cookies não essenciais
    rejectCookiesBtn.addEventListener('click', function() {
        setCookie('cookies-preference', 'essential-only', 365);
        setCookie('cookies-analytics', 'false', 365);
        setCookie('cookies-marketing', 'false', 365);
        cookieBanner.style.display = 'none';
    });

    // Abrir configurações personalizadas
        customizeCookiesBtn.addEventListener('click', function() {
        cookieSettings.classList.remove('hidden');
        
        // Preencher checkboxes com valores atuais (se existirem)
        const analyticsValue = getCookie('cookies-analytics');
        const marketingValue = getCookie('cookies-marketing');
        
        if (analyticsValue === 'true') {
            analyticsCookies.checked = true;
        } else if (analyticsValue === 'false') {
            analyticsCookies.checked = false;
        }
        
        if (marketingValue === 'true') {
            marketingCookies.checked = true;
        } else if (marketingValue === 'false') {
            marketingCookies.checked = false;
        }
    });

    // Salvar preferências personalizadas
    savePreferencesBtn.addEventListener('click', function() {
        setCookie('cookies-preference', 'custom', 365);
        setCookie('cookies-analytics', analyticsCookies.checked, 365);
        setCookie('cookies-marketing', marketingCookies.checked, 365);
        
        cookieSettings.classList.add('hidden');
        cookieBanner.style.display = 'none';
        
        // Carregar scripts com base nas preferências
        if (analyticsCookies.checked) {
            loadAnalytics();
        }
        
        if (marketingCookies.checked) {
            loadMarketing();
        }
    });

    // Fechar configurações sem salvar
    closeSettingsBtn.addEventListener('click', function() {
        cookieSettings.classList.add('hidden');
    });


    // Verificar e carregar scripts com base nas preferências salvas
   /* const cookiePreference = getCookie('cookies-preference');
   if (cookiePreference === 'accept-all') {
        loadMarketing();
    } else if (cookiePreference === 'custom') {
        if (getCookie('cookies-analytics') === 'true') {
            loadAnalytics();
        }
        if (getCookie('cookies-marketing') === 'true') {
            loadMarketing();
        }
    }*/
});