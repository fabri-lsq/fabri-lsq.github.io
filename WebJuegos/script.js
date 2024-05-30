function filtrarImagenes() {
    // Verificar si el modal está abierto y cerrarlo si es así
    var modal = document.getElementById('modal');
    if (modal.style.display === "block") {
        modal.style.display = "none";
    }

    // Obtener el valor del campo de búsqueda
    var textoBusqueda = document.getElementById('buscador').value.toLowerCase();
    
    // Obtener todas las imágenes
    var imagenes = document.querySelectorAll('.gallery .imagen-contenedor');
    
    // Iterar sobre cada contenedor de imagen y mostrar u ocultar según el texto de búsqueda
    imagenes.forEach(function(contenedor) {
        var imagen = contenedor.querySelector('img');
        var alt = imagen.getAttribute('alt').toLowerCase();
        var horas = contenedor.querySelector('.img-horas');
        var logros = contenedor.querySelector('.img-horas2');
        var progreso = contenedor.querySelector('.progress-container2');
        
        var name = alt.replace(/([A-Z])/g, ' $1').trim();

        if (name.includes(textoBusqueda)) {
            contenedor.style.display = 'block'; // Mostrar el contenedor de la imagen
            if (horas) horas.style.display = 'flex'; // Mostrar las horas si existen
            if (logros) logros.style.display = 'flex'; // Mostrar los logros si existen
            if (progreso) progreso.style.display = 'flex'; // Mostrar la barra de progreso si existe
        } else {
            contenedor.style.display = 'none'; // Ocultar el contenedor de la imagen
            if (horas) horas.style.display = 'none'; // Ocultar las horas si existen
            if (logros) logros.style.display = 'none'; // Ocultar los logros si existen
            if (progreso) progreso.style.display = 'none'; // Ocultar la barra de progreso si existe
        }
    });

    // Si el campo de búsqueda está vacío, restaurar las propiedades CSS originales
    if (textoBusqueda === "") {
        restaurarPropiedadesCSS();
    } else {
        // Si hay texto de búsqueda, centrar las imágenes que se muestran después de la búsqueda
        centrarImagenesGaleria();
    }
}

function mostrarImagenesPorRuta(ruta, orden) {
    // Crear un conjunto para almacenar los nombres de las imágenes mostradas
    var nombresMostrados = new Set();
    var plataformasJuegos = {};
    var csv = "Juegos.csv"; // CSV fijo
    localStorage.setItem('ruta', ruta);
    // Parsear el archivo CSV
    Papa.parse(csv, {
        download: true,
        header: true,
        complete: function(results) {
            // Ordenar los resultados en función del parámetro 'orden'
            if (orden === 'nombre') {
                results.data.sort((a, b) => (a.Nombre > b.Nombre) ? 1 : -1);
                localStorage.setItem('nombre', 'true');
                localStorage.setItem('instalado', 'false');
                localStorage.setItem('horas', 'false');
                localStorage.setItem('logros', 'false');
                localStorage.setItem(ruta, 'nombre');
            } else if (orden === 'instalado') {
                results.data.sort((a, b) => (a.Nombre > b.Nombre) ? 1 : -1);
                // Filtrar los resultados que tienen "Si" en Instalado
                let filteredResults = results.data.filter(item => item.Instalado === 'Si');
                // Actualizar los resultados con los resultados filtrados
                results.data = filteredResults;
                localStorage.setItem('instalado', 'true');
                localStorage.setItem('nombre', 'false');
                localStorage.setItem('logros', 'false');
                localStorage.setItem('horas', 'false');
                localStorage.setItem(ruta, 'instalado');
            } else if (orden === 'horas') {
                results.data.sort((a, b) => b.Horas - a.Horas);
                localStorage.setItem('horas', 'true');
                localStorage.setItem('nombre', 'false');
                localStorage.setItem('instalado', 'false');
                localStorage.setItem('logros', 'false');
                localStorage.setItem(ruta, 'horas');
            } else if (orden === 'logros') {
                results.data.sort((a, b) => b.PromedioLogros - a.PromedioLogros);
                localStorage.setItem('logros', 'true');
                localStorage.setItem('nombre', 'false');
                localStorage.setItem('instalado', 'false');
                localStorage.setItem('horas', 'false');
                localStorage.setItem(ruta, 'logros');
            }

            // Iterar sobre cada fila del CSV
            results.data.forEach(function(row) {
                if (Object.values(row).every(value => !value)) {//Verifica si la linea esta vacia
                    // La línea está vacía, no hagas nada
                    return;
                } else {
                    // Verificar si la ruta coincide o si se deben mostrar todas las imágenes
                    if (row.Ruta === ruta || ruta === "index/") {
                        // Verificar si el nombre no ha sido mostrado antes
                        if (!nombresMostrados.has(row.Nombre)) {
                            // Agregar el nombre al conjunto de nombres mostrados
                            nombresMostrados.add(row.Nombre);
                            plataformasJuegos[row.Nombre] = [row.Ruta];
                            // Crear la ruta de la imagen
                            var rutaImagen = row.Ruta + row.Nombre + row.Extension;

                            // Crear el div contenedor para la imagen
                            var divContenedor = document.createElement('div');
                            divContenedor.setAttribute('class', 'imagen-contenedor');

                            // Crear la imagen
                            var img = document.createElement('img');
                            
                            img.src = rutaImagen;
                            img.setAttribute('juego', row.Nombre);
                            img.alt = row.Nombre.replace(/([A-Z])/g, ' $1').replace(/(\d)([A-Z])/g, '$1 $2').replace(/([A-Za-z])(\d)/g, '$1 $2').trim(); // Agregar alt para el buscador, con espacios
                            var hrefe = "https://youtube.com/results?search_query=" + row.Nombre + "+gameplay";
                            img.setAttribute('href', hrefe);
                            img.setAttribute('data-platform', plataformasJuegos[row.Nombre]); // Agregar atributo de datos para la plataforma
                            img.setAttribute('data-installed', row.Instalado); // Agregar atributo de instalacion
                            img.setAttribute('data-hours-played', row.Horas); // Agregar atributo de datos para las horas jugadas
                            img.setAttribute('data-achievements', row.MisLogros); // Agregar atributo de datos para los logros
                            img.setAttribute('data-total-achievements', row.LogrosTotal); 
                            img.setAttribute('data-promedio-achievements', row.PromedioLogros); 
                            img.setAttribute('loading','lazy');
                            divContenedor.appendChild(img); // Agregar la imagen al div contenedor

                            if (orden === "horas") {
                                // Crear contenedor de progreso
                                var hoursContainer = document.createElement('div');
                                hoursContainer.setAttribute('class', 'img-horas');
                                hoursContainer.textContent = row.Horas + "hs"; // Texto con las horas
                            
                                // Agregar el contenedor de progreso al div contenedor
                                divContenedor.appendChild(hoursContainer);
                            
                                // Agregar el div contenedor al contenedor principal de la grilla
                                var contenedor = document.querySelector('.gallery');
                                contenedor.appendChild(divContenedor);
                            } else if(orden === "logros"){

                                // Crear contenedor de progreso
                                var logrosContainer = document.createElement('div');
                                logrosContainer.setAttribute('class', 'img-horas2');
                                logrosContainer.textContent = row.PromedioLogros + "%"; // Texto con las horas
                            
                                divContenedor.style.marginBottom = "-23%";

                                // Crear contenedor de progreso
                                var progressContainer = document.createElement('div');
                                progressContainer.setAttribute('class', 'progress-container2');

                                // Crear contenedor de habilidad
                                var skillContainer = document.createElement('div');
                                skillContainer.setAttribute('class', 'skill2');

                                // Crear barra de progreso
                                var progress = document.createElement('div');
                                progress.setAttribute('class', 'progress2');
                                progress.setAttribute('style', '--wth:' + row.PromedioLogros + "%");
                                skillContainer.appendChild(progress); // Agregar la barra de progreso al contenedor de habilidad

                                // Crear elemento de texto del porcentaje
                                var percentageText = document.createElement('div');
                                percentageText.setAttribute('class', 'percentage-text');
                                percentageText.textContent = "Completado un " + row.PromedioLogros + "%"; // Texto con el porcentaje

                                // Agregar el texto al contenedor de habilidad
                                skillContainer.appendChild(percentageText);

                                // Agregar contenedor de habilidad al contenedor de progreso
                                progressContainer.appendChild(skillContainer);

                                // Agregar el contenedor de progreso al div contenedor
                                divContenedor.appendChild(progressContainer); // Agregar el código HTML de la barra de progreso al div contenedor

                                // Agregar el contenedor de progreso al div contenedor
                                divContenedor.appendChild(logrosContainer);

                                // Agregar el div contenedor al contenedor principal de la grilla
                                var contenedor = document.querySelector('.gallery');
                                contenedor.appendChild(divContenedor);
                            } else {
                                var contenedor = document.querySelector('.gallery');
                                contenedor.appendChild(divContenedor);
                            }
                        } else {
                            plataformasJuegos[row.Nombre] += [row.Ruta];
                        }
                    }
                }
            });

            // Llamar a la función para mostrar la cantidad de imágenes
            mostrarCantidadImagenes();

            // Agregar evento de clic a las imágenes para abrir el modal
            var imagenes = document.querySelectorAll('.gallery img');
            imagenes.forEach(function(imagen) {
                imagen.addEventListener('click', function() {
                    var imagenSrc = this.getAttribute('src');
                    var imagenAlt = this.getAttribute("alt");
                    var imagenhref = this.getAttribute('href');
                    var imagenJuego = this.getAttribute("juego");
                    var rutasDelJuego = plataformasJuegos[imagenJuego];
                    var imagenRuta = String(rutasDelJuego);
                    var imagenHoras = this.getAttribute("data-hours-played");
                    var imagenInstalado = this.getAttribute("data-installed");
                    var imagenMisLogros = this.getAttribute("data-achievements");

                    if(this.getAttribute("data-total-achievements") == 99){
                        var imagenLogrosTotales = " ";
                        var imagenMisLogros = "N/N";
                    } else {
                        var imagenLogrosTotales = "/" + this.getAttribute("data-total-achievements");
                    }
                    var imagenPromedioLogros = this.getAttribute("data-promedio-achievements");

                    var texto = "<a class='TittleGame'>" + imagenAlt + "</a><br>" + "<br>" + 
                                "<a class='Subtittle'>Horas: </a><a class='Datos'>" + imagenHoras + "hs</a>" + "<br>" + 
                                "<a class='Subtittle'>Instalado: </a><a class='Datos'>" + imagenInstalado + "</a><br>" +
                                "<a class='Subtittle'>Logros: </a><a class='Datos'>" + imagenMisLogros + imagenLogrosTotales + 
                                "</a><br><div class='progress-container'><div class='skill'><div class='progress' style='--wth:" + imagenPromedioLogros + "%'></div></div></div>"; // Añadir el texto al elemento de texto

                    abrirModal(imagenSrc, imagenRuta, texto);
                    abrirBlank(imagenhref);
                });
            });
        }
    });
}

// Array con las URLs de las imágenes a precargar
var imageUrls = [
    'steam.png',
    'xbox.png',
    'epicgames.png',
    'ubisoft.png',
    'steamxbox.png',
    'xboxepicgames.png',
    'steam_epicgames.png',
    'epicgames_ubisoft.png',
  ];
  
  // Función para cargar las imágenes
  function preloadImages(urls) {
    for (var i = 0; i < urls.length; i++) {
      var img = new Image();
      img.src = urls[i];
    }
  }
  
  // Llamada a la función de precarga de imágenes
  preloadImages(imageUrls);
  

// Función para centrar y distribuir equitativamente las imágenes en la galería
function centrarImagenesGaleria() {
    // Media query para detectar pantallas pequeñas
    var isMobile = window.matchMedia("(max-width: 500px)").matches;
    if (isMobile) {
    } else {
        var galeria = document.querySelector('.gallery');
        var contenedores = galeria.querySelectorAll('.imagen-contenedor');

        // Ajustar la distribución de las imágenes
        galeria.style.display = 'flex';
        galeria.style.flexWrap = 'wrap';
        galeria.style.justifyContent = 'center';
        galeria.style.alignItems = 'center';
        galeria.style.gridGap = '20px';
        

        // Ajustar el margen entre los contenedores de imágenes
        contenedores.forEach(function(contenedor) {

            contenedor.style.margin = '0px 1px 1% 10px'; // Margen para pantallas grandes

            var img = contenedor.querySelector('img');
            if (img) img.style.maxWidth = '207px'; // Ajustar el tamaño máximo de las imágenes

            var horas = contenedor.querySelector('.img-horas');
            if (horas) horas.style.maxWidth = '250px'; // Ajustar el tamaño máximo de las horas
            if (horas) horas.style.margin = '-95% 20%'; // Ajustar el tamaño máximo de los logros

            var logros = contenedor.querySelector('.img-horas2');
            if (logros) logros.style.maxWidth = '250px'; // Ajustar el tamaño máximo de los logros
            if (logros) logros.style.margin = '-110% 20%'; // Ajustar el tamaño máximo de los logros

            var progreso = contenedor.querySelector('.progress-container2');
            if (progreso) progreso.style.maxWidth = '250px'; // Ajustar el tamaño máximo de la barra de progreso
        });
    }
}

// Función para restaurar las propiedades CSS originales de la galería
function restaurarPropiedadesCSS() {
    var galeria = document.querySelector('.gallery');
    var contenedores = galeria.querySelectorAll('.imagen-contenedor');

    // Restaurar las propiedades CSS originales de la galería
    galeria.style.display = 'grid';
    galeria.style.gridTemplateColumns = 'repeat(auto-fit, minmax(190px, 1fr))';
    galeria.style.margin = '3%';
    galeria.style.gridGap = '30px';
    galeria.style.filter = 'drop-shadow(6px 6px 5px rgb(107, 64, 224))';
    galeria.style.position = 'relative';
    galeria.style.justifyContent = '';
    galeria.style.alignItems = '';
    galeria.style.flexWrap = '';

    // Restaurar las propiedades CSS originales de los contenedores de imágenes
    contenedores.forEach(function(contenedor) {
        contenedor.style.margin = ''; 
        

        var img = contenedor.querySelector('img');
        if (img) {img.style.maxWidth = 'fit-content';// Restaurar el tamaño máximo de las imágenes
        }

        var horas = contenedor.querySelector('.img-horas');
        if (horas) horas.style.maxWidth = ''; // Restaurar el tamaño máximo de las horas
        if (horas) horas.style.margin = ''; // Ajustar el tamaño máximo de los logros

        var logros = contenedor.querySelector('.img-horas2');
        if (logros) logros.style.maxWidth = ''; // Restaurar el tamaño máximo de los logros
        if (logros) logros.style.margin = ''; // Ajustar el tamaño máximo de los logros
        if (logros) contenedor.style.marginBottom = "-23%"; // Eliminar margen entre los contenedores

        var progreso = contenedor.querySelector('.progress-container2');
        if (progreso) progreso.style.maxWidth = ''; // Restaurar el tamaño máximo de la barra de progreso
    });
}
//Función para mostrar la cantidad de imágenes en la galería
function mostrarCantidadImagenes() {
   var cantidadImagenes = document.querySelectorAll('.gallery img').length;
   var contador = document.getElementById('contador-imagenes');
   contador.textContent = '' + cantidadImagenes;
}
function abrirModal(imagenSrc, juego, texto) {
    var modal = document.getElementById('modal');
    var modalContent = document.querySelector('.modal-content');
    var modalImage = document.getElementById('modal-image');
    var modalText = document.getElementById('modal-text'); // Nuevo elemento de texto

    // Limpiar el filtro antes de aplicar uno nuevo
    modalContent.style.filter = '';

    
    // Media query para detectar pantallas pequeñas
    var isMobile = window.matchMedia("(max-width: 500px)").matches;
    if (isMobile) {
        modalContent.style.setProperty('--right-value', '-5%');
    } else {
        // Restablecer la escala de la imagen
        modalContent.style.setProperty('--scale', '1');
        modalContent.style.setProperty('--right-value', '23%');
    }

    // Depuración: Verificar el valor de "juego"
    console.log("Valor de juego:", juego);

    if(juego==="steam/"){
        modalContent.style.filter = "drop-shadow(1px 1px 5px rgb(103, 220, 255))";
        modalContent.style.border = "1px solid rgb(103, 220, 255)";
    } else if(juego==="xbox/"){
        modalContent.style.filter = "drop-shadow(1px 1px 5px rgb(0, 255, 34))";
        modalContent.style.border = "1px solid rgb(0, 255, 34)";
    } else if(juego==="epicgames/"){
        modalContent.style.filter = "drop-shadow(1px 1px 5px rgb(255, 255, 255))";
        modalContent.style.border = "1px solid rgb(255, 255, 255)";
    } else if(juego==="ubisoft/"){
        modalContent.style.filter = "drop-shadow(1px 1px 5px rgb(0, 0, 0))";
        modalContent.style.border = "1px solid rgb(255, 255, 255)";
    } else if(juego==="epicgames/steam/" || juego==="steam/epicgames/"){
        modalContent.style.filter = "drop-shadow(1px 1px 5px rgb(103, 220, 255))";
        modalContent.style.border = "1px solid rgb(103, 220, 255)";
    } else if(juego==="epicgames/xbox/" || juego==="xbox/epicgames/"){
        modalContent.style.filter = "drop-shadow(1px 1px 5px rgb(0, 255, 34))";
        modalContent.style.border = "1px solid rgb(0, 255, 34)";
    } else if(juego==="ubisoft/epicgames/" || juego==="epicgames/ubisoft/"){
        modalContent.style.filter = "drop-shadow(1px 1px 5px rgb(255, 255, 255))";
        modalContent.style.border = "1px solid rgb(255, 255, 255)";
    } else if(juego==="xbox/steam/" || juego==="steam/xbox/"){
        modalContent.style.filter = "drop-shadow(1px 1px 5px rgb(255, 255, 255))";
        modalContent.style.border = "1px solid rgb(255, 255, 255)";
    } else {
        modalContent.style.border = "1px solid rgb(255, 255, 255)";
    }

    // Mapa de URLs de imágenes para cada valor de juego
    var urlImagenes = {
        "steam/": "url('steam.png')",
        "xbox/": "url('xbox.png')",
        "epicgames/": "url('epicgames.png')",
        "ubisoft/": "url('ubisoft.png')",
        "xbox/steam/": "url('steamxbox.png')",
        "steam/xbox/": "url('steamxbox.png')", // Inversión de las plataformas
        "epicgames/xbox/": "url('xboxepicgames.png')",
        "xbox/epicgames/": "url('xboxepicgames.png')", // Inversión de las plataformas
        "epicgames/steam/": "url('steam_epicgames.png')",
        "steam/epicgames/": "url('steam_epicgames.png')", // Inversión de las plataformas
        "ubisoft/epicgames/": "url('epicgames_ubisoft.png')",
        "epicgames/ubisoft/": "url('epicgames_ubisoft.png')", // Inversión de las plataformas
    };

    // Verificar si la combinación de plataformas requiere cambiar la escala de la imagen
    if (juego === "xbox/steam/" || 
    juego === "steam/xbox/" || 
    juego === "epicgames/xbox/" || 
    juego === "xbox/epicgames/" || 
    juego === "epicgames/steam/" || 
    juego === "steam/epicgames/" || 
    juego === "ubisoft/epicgames/" || 
    juego === "epicgames/ubisoft/") {

        // Media query para detectar pantallas pequeñas
        var isMobile = window.matchMedia("(max-width: 500px)").matches;
        if (isMobile) {
            modalContent.style.setProperty('--right-value', '-5%');
        } else {
            modalContent.classList.add('scale-large');
            modalContent.style.setProperty('--right-value', '41%');
        }
    } else {
        modalContent.classList.remove('scale-large');
    }

    // Obtener la URL de la imagen de fondo según el valor de juego
    var backgroundImageURL = urlImagenes[juego] || "url('steam.png')"; // Si el juego no está en el mapa, se usa una imagen por defecto
    
    // Aplicar la URL de la imagen de fondo al pseudo-elemento ::before
    modalContent.style.setProperty('--background-image-url', backgroundImageURL);
    
    

    modalImage.src = imagenSrc;
    modalText.innerHTML = texto;

    modal.style.display = "block";
}


function abrirBlank(referencia) {
    window.addEventListener('click', function(event) {
        if ((event.button === 1) || (event.ctrlKey && event.button === 0)) {
            window.open(referencia, '_blank'); // Redirigir a la URL del video en una nueva pestaña
            return false;
        }
    });
}




document.addEventListener('DOMContentLoaded', function() {
    // Obtener la ruta de la página actual
    var rutaActual = obtenerRutaActual();

    // Inicializar localStorage si no está configurado
    if (!localStorage.getItem('nombre') && !localStorage.getItem('horas') && !localStorage.getItem('logros')) {
        localStorage.setItem('nombre', 'true');
        localStorage.setItem('instalado', 'false');
        localStorage.setItem('horas', 'false');
        localStorage.setItem('logros', 'false');
        localStorage.setItem('index/', 'nombre');
        localStorage.setItem('steam/', 'nombre');
        localStorage.setItem('xbox/', 'nombre');
        localStorage.setItem('epicgames/', 'nombre');
        localStorage.setItem('ubisoft/', 'nombre');
    }


    // Seleccionar la opción correspondiente al criterio actual
    var selectOrdenar = document.getElementById("ordenar");
    


    // Comprobar el estado de localStorage y mostrar las imágenes según el criterio guardado
    if(localStorage.getItem(rutaActual) === 'nombre'){
        localStorage.setItem('nombre', 'true');
        if (localStorage.getItem('nombre') === 'true') {
            mostrarImagenesPorRuta(rutaActual, "nombre");
            selectOrdenar.value = "nombre";
        } else if (localStorage.getItem('instalado') === 'true') {
            mostrarImagenesPorRuta(rutaActual, "instalado");
            selectOrdenar.value = "instalado";
        } else if (localStorage.getItem('horas') === 'true') {
            mostrarImagenesPorRuta(rutaActual, "horas");
            selectOrdenar.value = "horas";
        } else if (localStorage.getItem('logros') === 'true') {
            mostrarImagenesPorRuta(rutaActual, "logros");
            selectOrdenar.value = "logros";
        }
    } else if(localStorage.getItem(rutaActual) === 'instalado'){
        localStorage.setItem('horas', 'true');
        if (localStorage.getItem('nombre') === 'true') {
            mostrarImagenesPorRuta(rutaActual, "nombre");
            selectOrdenar.value = "nombre";
        } else if (localStorage.getItem('instalado') === 'true') {
            mostrarImagenesPorRuta(rutaActual, "instalado");
            selectOrdenar.value = "instalado";
        } else if (localStorage.getItem('horas') === 'true') {
            mostrarImagenesPorRuta(rutaActual, "horas");
            selectOrdenar.value = "horas";
        } else if (localStorage.getItem('logros') === 'true') {
            mostrarImagenesPorRuta(rutaActual, "logros");
            selectOrdenar.value = "logros";
        }
    } else if(localStorage.getItem(rutaActual) === 'horas'){
        localStorage.setItem('horas', 'true');
        if (localStorage.getItem('nombre') === 'true') {
            mostrarImagenesPorRuta(rutaActual, "nombre");
            selectOrdenar.value = "nombre";
        } else if (localStorage.getItem('instalado') === 'true') {
            mostrarImagenesPorRuta(rutaActual, "instalado");
            selectOrdenar.value = "instalado";
        } else if (localStorage.getItem('horas') === 'true') {
            mostrarImagenesPorRuta(rutaActual, "horas");
            selectOrdenar.value = "horas";
        } else if (localStorage.getItem('logros') === 'true') {
            mostrarImagenesPorRuta(rutaActual, "logros");
            selectOrdenar.value = "logros";
        }
    } else if(localStorage.getItem(rutaActual) === 'logros'){
        localStorage.setItem('logros', 'true');
        if (localStorage.getItem('nombre') === 'true') {
            mostrarImagenesPorRuta(rutaActual, "nombre");
            selectOrdenar.value = "nombre";
        } else if (localStorage.getItem('instalado') === 'true') {
            mostrarImagenesPorRuta(rutaActual, "instalado");
            selectOrdenar.value = "instalado";
        } else if (localStorage.getItem('horas') === 'true') {
            mostrarImagenesPorRuta(rutaActual, "horas");
            selectOrdenar.value = "horas";
        } else if (localStorage.getItem('logros') === 'true') {
            mostrarImagenesPorRuta(rutaActual, "logros");
            selectOrdenar.value = "logros";
        }
    }
    // Agregar evento de clic al fondo del modal para cerrarlo si se hace clic fuera del contenido del modal
    var modal = document.getElementById('modal');
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Agregar evento de clic al botón de cerrar del modal
    var closeButton = document.querySelector('.close');
    closeButton.addEventListener('click', function() {
        modal.style.display = "none";
    });

    // Agregar evento de teclado para cerrar el modal con la tecla "Esc"
    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape") {
            modal.style.display = "none";
        }
    });

    // Agregar evento de navegación para cerrar el modal cuando el usuario utiliza el botón de retroceso del navegador móvil
    window.addEventListener('popstate', function(event) {
        // Verificar si el modal está abierto
        var modal = document.getElementById("tuModalId"); // Reemplaza "tuModalId" con el ID real de tu modal
        if (modal && modal.style.display !== "none") {
            // Cierra el modal si está abierto
            modal.style.display = "none";
        }
    });
});

// Función para obtener la ruta actual de la página
function obtenerRutaActual() {
    var rutaCompleta = window.location.pathname;
    var partesRuta = rutaCompleta.split('/');
    var paginaActual = partesRuta[partesRuta.length - 1];
    paginaActual = paginaActual.slice(0, -5) + "/";
    paginaActual.toLocaleLowerCase();

    // Aquí puedes realizar cualquier otro procesamiento necesario para obtener el filtro correcto
    return paginaActual;
}

function ordenarImagenes(criterio, ruta) {
    // Seleccionar el contenedor de galería
    var contenedorGaleria = document.querySelector('.gallery');
    var buscador = document.querySelector('.search-box');
    // Media query para detectar pantallas pequeñas
    var isMobile = window.matchMedia("(max-width: 500px)").matches;
    if (isMobile) {
    } else {
        restaurarPropiedadesCSS();
    }
    buscador.value = "";
    // Eliminar todas las imágenes existentes
    while (contenedorGaleria.firstChild) {
        contenedorGaleria.removeChild(contenedorGaleria.firstChild);
    }
    if(criterio== "nombre"){
        mostrarImagenesPorRuta(ruta, "nombre");
    } else if(criterio== "instalado"){
        mostrarImagenesPorRuta(ruta, "instalado");    
    } else if(criterio== "horas"){
        mostrarImagenesPorRuta(ruta, "horas");    
    } else if(criterio== "logros"){
        mostrarImagenesPorRuta(ruta, "logros");
    }   
}

// Obtener el elemento de la barra de progreso
var progressBar = document.getElementById("myProgressBar");

// Función para actualizar la barra de progreso
function updateProgressBar(percentage) {
  // Asegurarse de que el porcentaje esté entre 0 y 100
  percentage = Math.min(100, Math.max(0, percentage));
  // Establecer el ancho de la barra de progreso
  progressBar.style.width = percentage + "%";
}

function toggleMenu() {
    const menuItems = document.querySelector('.menu-items');
    menuItems.classList.toggle('active');
}
