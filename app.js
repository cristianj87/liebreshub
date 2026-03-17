// ==========================================
// 1. LÓGICA DEL CLIMA (OpenWeather API)
// ==========================================
const weatherInfo = document.getElementById('weather-info');

// ⚠️ REEMPLAZA EL TEXTO ENTRE COMILLAS CON TU API KEY REAL DE OPENWEATHER
const API_KEY = '6279e9f8a92c95113a8a606343b3d52e'; 

function getWeather(lat, lon) {
    // Mostramos un mensaje de carga con un icono girando
    weatherInfo.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Consultando al cielo...';
    
    // URL de la API configurada en grados Celsius (metric) y en español (lang=es)
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${API_KEY}`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Error en la respuesta de la API');
            return response.json();
        })
        .then(data => {
            const temp = Math.round(data.main.temp);
            const desc = data.weather[0].description;
            let city = data.name;

// Filtro para corregir la geolocalización en la frontera
const ciudadesFronterizas = ["San Elizario", "El Paso", "Socorro", "Sunland Park"];
if (ciudadesFronterizas.some(frontera => city.includes(frontera))) {
    city = "Ciudad Juárez";
}
            
            // Lógica simple para cambiar el icono según el clima
            let iconCode = 'fa-cloud';
            const mainWeather = data.weather[0].main.toLowerCase();
            if (mainWeather.includes('clear')) iconCode = 'fa-sun';
            if (mainWeather.includes('cloud')) iconCode = 'fa-cloud-sun';
            if (mainWeather.includes('rain')) iconCode = 'fa-cloud-rain';
            
            // Inyectamos el resultado con el diseño moderno
            weatherInfo.innerHTML = `
                <div style="font-size: 2.8rem; color: var(--accent); margin-bottom: 5px;">
                    <i class="fa-solid ${iconCode}"></i> ${temp}°C
                </div>
                <div style="font-size: 0.9rem; text-transform: capitalize; color: var(--text-muted);">
                    ${desc} en ${city}
                </div>
            `;
        })
        .catch(err => {
            weatherInfo.innerHTML = '<div style="font-size: 0.9rem; color: #ff4757;"><i class="fa-solid fa-triangle-exclamation"></i> Error al cargar el clima. Verifica tu API Key.</div>';
            console.error(err);
        });
}

// Solicitar permisos de ubicación al usuario
if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
        (position) => getWeather(position.coords.latitude, position.coords.longitude),
        (error) => { 
            weatherInfo.innerHTML = '<div style="font-size: 0.9rem; color: var(--text-muted);"><i class="fa-solid fa-location-crosshairs"></i> Permiso de ubicación denegado.</div>'; 
        }
    );
} else {
    weatherInfo.innerHTML = "Tu navegador no soporta geolocalización.";
}


// ==========================================
// 2. LÓGICA DEL CHATBOT Y LA INTERFAZ
// ==========================================

// Función para abrir/cerrar la ventana flotante del chat
function toggleChat() {
    const chatWindow = document.getElementById('floating-chat-window');
    chatWindow.classList.toggle('hidden');
}

// Función para enviar mensajes en el chat
function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (!message) return;

    const chatBox = document.getElementById('chat-box');
    
    // Imprimir mensaje del usuario
    chatBox.innerHTML += `<div class="message user">${message}</div>`;
    input.value = '';
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll hacia abajo

    // Respuestas automáticas simuladas (Bot Mockup)
    // Respuestas automáticas simuladas (Bot Mockup enfocado en TI)
    setTimeout(() => {
        let reply = "Aún estoy aprendiendo, pero soy un asistente enfocado en Tecnologías de la Información. 🐇💻 Pregúntame sobre laboratorios, programación, inglés o retículas.";
        
        // Convertimos el mensaje a minúsculas y quitamos acentos para que sea más fácil encontrar las palabras clave
        const msgLower = message.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        
        // 1. Dudas sobre plataformas académicas
        if(msgLower.includes('moodle') || msgLower.includes('clase') || msgLower.includes('material')) {
            reply = "Puedes entrar a Moodle desde la pantalla principal. Ahí los maestros suben los recursos didácticos para tus materias de desarrollo web y programación.";
        } 
        // 2. Dudas sobre calificaciones y administración
        else if(msgLower.includes('sii') || msgLower.includes('calificacion') || msgLower.includes('reticula') || msgLower.includes('kardex')) {
            reply = "Revisa tu avance reticular, carga de materias y calificaciones directamente en el portal del SII en la sección de Accesos Rápidos.";
        } 
        // 3. Dudas sobre infraestructura (Laboratorios)
        else if(msgLower.includes('laboratorio') || msgLower.includes('computo') || msgLower.includes('practica') || msgLower.includes('equipo')) {
            reply = "Para tus proyectos y prácticas, los laboratorios del Centro de Cómputo están disponibles. Recuerda llevar tu credencial vigente y revisar los horarios de acceso libre en la entrada.";
        } 
        // 4. Importancia del Inglés Técnico
        else if(msgLower.includes('ingles') || msgLower.includes('idioma') || msgLower.includes('tecnico')) {
            reply = "¡El inglés técnico es indispensable para tu futuro! Gran parte de las oportunidades de TI en la industria maquiladora y de software en la frontera lo exigen. Asegúrate de practicarlo con aplicaciones web interactivas o en el Centro de Idiomas.";
        } 
        // 5. Dudas sobre programación y desarrollo
        else if(msgLower.includes('programacion') || msgLower.includes('codigo') || msgLower.includes('c ') || msgLower.includes('web')) {
            reply = "Si tienes un error de sintaxis en C o tu proyecto web no funciona, te sugiero revisar la documentación oficial, consultar el material de tus clases o formar un grupo de estudio en la biblioteca del Tec.";
        } 
        // 6. Saludo inicial
        else if(msgLower.includes('hola') || msgLower.includes('buenos dias') || msgLower.includes('que tal')) {
            reply = "¡Hola, futuro ingeniero! 💻 ¿En qué te puedo asesorar hoy con tus trámites o procesos de Tecnologías de la Información?";
        }
        
        // Imprimir la respuesta del bot en la interfaz
        chatBox.innerHTML += `<div class="message bot">${reply}</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 800); // Retardo de 0.8 segundos para simular que está "escribiendo"
}

// Permitir enviar el mensaje presionando la tecla "Enter"
document.getElementById('chat-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// ==========================================
// 3. LÓGICA DEL CARRUSEL AUTOMÁTICO
// ==========================================
const carousel = document.querySelector('.carousel');
let autoScrollTimer;

function startAutoScroll() {
    autoScrollTimer = setInterval(() => {
        if (carousel) {
            // Calculamos el desplazamiento: ancho de tarjeta (240px) + margen (15px)
            const step = 255; 
            
            // Si el scroll llega casi al final, lo regresamos al inicio
            if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 10) {
                carousel.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                carousel.scrollBy({ left: step, behavior: 'smooth' });
            }
        }
    }, 3000); // Cambia de noticia cada 3000 milisegundos (3 segundos)
}

function stopAutoScroll() {
    clearInterval(autoScrollTimer);
}

// Iniciar el carrusel al cargar la página
if (carousel) {
    startAutoScroll();
    
    // Pausar el movimiento si el usuario interactúa (toca o pone el mouse)
    carousel.addEventListener('mouseenter', stopAutoScroll);
    carousel.addEventListener('mouseleave', startAutoScroll);
    carousel.addEventListener('touchstart', stopAutoScroll, {passive: true});
    carousel.addEventListener('touchend', startAutoScroll);
}
