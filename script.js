// Variables globales para almacenar referencias a elementos DOM y datos del slideshow
// Se inicializan como null y se asignan dentro de DOMContentLoaded
let gameDetailPage = null;
let slideshowPage = null;
let gameDetailTitle = null;
let gameDetailMenuButtonsContainer = null;
let slideshowTitle = null;
let slideCurrentTitle = null;
let slideCurrentImageContainer = null;
let slideCurrentImage = null;
let slideCurrentText = null;
let slideshowPrevBtn = null;
let slideshowNextBtn = null;
let backFromSlideshowBtn = null;

let currentSlideshowContent = [];
let currentSlideIndex = 0;
let currentContentId = null; // Para seguir el contenido actual (ej. "ttr-rules")

// Función para mostrar una página específica y ocultar otras dentro del HTML actual del juego
function showPage(pageId) {
    console.log(`showPage llamada para: ${pageId}`);
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        if (page.id === pageId) {
            console.log(`Añadiendo 'active' a: ${page.id}`);
            page.classList.add('active');
        } else {
            console.log(`Quitando 'active' de: ${page.id}`);
            page.classList.remove('active');
        }
    });
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        console.log(`Elemento de página destino encontrado: ${targetPage.id}`);
    } else {
        console.error(`Error: La página con ID '${pageId}' no fue encontrada.`);
    }
}

// Renderiza el menú para el juego específico
// Esta función espera que 'window.gameData' esté definido globalmente en el HTML que la llama.
function renderGameMenu() {
    if (!gameDetailTitle || !gameDetailMenuButtonsContainer || !window.gameData) {
        console.error("Error: Elementos DOM o window.gameData no disponibles para renderGameMenu.");
        return;
    }

    gameDetailTitle.textContent = window.gameData.name;
    gameDetailMenuButtonsContainer.innerHTML = ''; // Limpia botones previos

    window.gameData.menu.forEach(menuItem => {
        const button = document.createElement('button');
        button.className = 'btn-primary';
        button.textContent = menuItem.label;
        button.onclick = () => {
            currentContentId = menuItem.id;
            renderSlideshow(menuItem.id);
            showPage('slideshow-page');
        };
        gameDetailMenuButtonsContainer.appendChild(button);
    });
}

// Renderiza el slideshow para el contenido específico
// Esta función espera que 'window.gameData' esté definido globalmente en el HTML que la llama.
function renderSlideshow(contentId) {
    if (!window.gameData || !window.gameData.content[contentId]) {
        console.error(`Error: Datos de contenido para '${contentId}' no disponibles.`);
        return;
    }
    currentSlideshowContent = window.gameData.content[contentId];
    currentSlideIndex = 0; // Empieza desde la primera diapositiva

    // Establece el título basado en el contenido seleccionado
    const menuItem = window.gameData.menu.find(item => item.id === contentId);
    slideshowTitle.textContent = `${window.gameData.name} - ${menuItem ? menuItem.label : 'Contenido'}`;

    updateSlideshowDisplay();
}

// Actualiza el contenido de la diapositiva actual
function updateSlideshowDisplay() {
    if (!slideCurrentTitle || !slideCurrentText || !slideCurrentImageContainer || !slideCurrentImage) {
        console.error("Error: Elementos DOM del slideshow no disponibles para updateSlideshowDisplay.");
        return;
    }

    const currentSlide = currentSlideshowContent[currentSlideIndex];
    if (currentSlide) {
        slideCurrentTitle.textContent = currentSlide.title;
        slideCurrentText.textContent = currentSlide.text;

        // Comprueba si hay una imagen para la diapositiva actual
        if (currentSlide.imageUrl) {
            slideCurrentImage.src = currentSlide.imageUrl;
            slideCurrentImage.alt = currentSlide.title || "Imagen de ejemplo";
            slideCurrentImageContainer.style.display = 'flex'; // Muestra el contenedor de la imagen
        } else {
            slideCurrentImage.src = ''; // Limpia la fuente de la imagen
            slideCurrentImage.alt = '';
            slideCurrentImageContainer.style.display = 'none'; // Oculta el contenedor de la imagen
        }

    } else {
        slideCurrentTitle.textContent = "No hay contenido disponible.";
        slideCurrentText.textContent = "";
        slideCurrentImage.src = '';
        slideCurrentImage.alt = '';
        slideCurrentImageContainer.style.display = 'none';
    }

    // Muestra/oculta los botones de navegación
    if (slideshowPrevBtn) slideshowPrevBtn.style.display = currentSlideIndex > 0 ? 'block' : 'none';
    if (slideshowNextBtn) slideshowNextBtn.style.display = currentSlideIndex < currentSlideshowContent.length - 1 ? 'block' : 'none';
}

// Inicializa la página del juego al cargar
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded disparado en script.js (lógica de juego).");

    // Obtener referencias a los elementos DOM al inicio del DOMContentLoaded
    gameDetailPage = document.getElementById('game-detail-page');
    slideshowPage = document.getElementById('slideshow-page');
    gameDetailTitle = document.getElementById('game-detail-title');
    gameDetailMenuButtonsContainer = document.getElementById('game-detail-menu-buttons');
    slideshowTitle = document.getElementById('slideshow-title');
    slideCurrentTitle = document.getElementById('slide-current-title');
    slideCurrentImageContainer = document.getElementById('slide-current-image-container');
    slideCurrentImage = document.getElementById('slide-current-image');
    slideCurrentText = document.getElementById('slide-current-text');
    slideshowPrevBtn = document.getElementById('slideshow-prev-btn');
    slideshowNextBtn = document.getElementById('slideshow-next-btn');
    backFromSlideshowBtn = document.getElementById('back-from-slideshow-btn');

    // Lógica de inicialización específica para páginas de juego
    // Se comprueba que los elementos clave de una página de juego y window.gameData existan.
    if (gameDetailPage && slideshowPage && gameDetailTitle && gameDetailMenuButtonsContainer && typeof window.gameData !== 'undefined') {
        console.log("Detectada página de juego. Inicializando lógica.");
        console.log("window.gameData.name:", window.gameData.name);

        // Inicializar el menú del juego al cargar la página
        renderGameMenu();
        showPage('game-detail-page'); // Muestra la página de detalle del juego por defecto

        // Event Listeners para los botones de navegación del slideshow
        if (slideshowPrevBtn) {
            slideshowPrevBtn.addEventListener('click', () => {
                console.log("Botón 'Anterior' de Slideshow clicado!");
                if (currentSlideIndex > 0) {
                    currentSlideIndex--;
                    updateSlideshowDisplay();
                }
            });
        }
        if (slideshowNextBtn) {
            slideshowNextBtn.addEventListener('click', () => {
                console.log("Botón 'Siguiente' de Slideshow clicado!");
                if (currentSlideIndex < currentSlideshowContent.length - 1) {
                    currentSlideIndex++;
                    updateSlideshowDisplay();
                }
            });
        }
        if (backFromSlideshowBtn) {
            backFromSlideshowBtn.addEventListener('click', () => {
                console.log("Botón 'Volver del Slideshow' clicado!");
                showPage('game-detail-page'); // Volver al menú de este juego
            });
        }
    } else {
        console.warn("script.js (lógica de juego) cargado en una página que no es de juego o faltan elementos clave.");
        console.log("Información de depuración para script.js (juego):");
        console.log("gameDetailPage (existe?):", !!document.getElementById('game-detail-page'));
        console.log("slideshowPage (existe?):", !!document.getElementById('slideshow-page'));
        console.log("gameDetailTitle (existe?):", !!document.getElementById('game-detail-title'));
        console.log("gameDetailMenuButtonsContainer (existe?):", !!document.getElementById('game-detail-menu-buttons'));
        console.log("window.gameData (definido?):", typeof window.gameData !== 'undefined');
    }
});
