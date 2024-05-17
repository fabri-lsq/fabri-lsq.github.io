function filtrarImagenes() {

    // Verificar si el modal está abierto y cerrarlo si es así
    var modal = document.getElementById('modal');
    if (modal.style.display === "block") {
        modal.style.display = "none";
    }

    // Obtener el valor del campo de búsqueda
    var textoBusqueda = document.getElementById('buscador').value.toLowerCase();
    
    // Obtener todas las imágenes
    var imagenes = document.querySelectorAll('.gallery img');
    
    // Iterar sobre cada imagen y mostrar u ocultar según el texto de búsqueda
    imagenes.forEach(function(imagen) {
        var alt = imagen.getAttribute('alt').toLowerCase();
        if (alt.includes(textoBusqueda)) {
            imagen.style.display = 'block'; // Mostrar la imagen
        } else {
            imagen.style.display = 'none'; // Ocultar la imagen
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
                localStorage.setItem('horas', 'false');
                localStorage.setItem('logros', 'false');
                localStorage.setItem(ruta, 'nombre');
            } else if (orden === 'horas') {
                results.data.sort((a, b) => b.Horas - a.Horas);
                localStorage.setItem('horas', 'true');
                localStorage.setItem('nombre', 'false');
                localStorage.setItem('logros', 'false');
                localStorage.setItem(ruta, 'horas');
            } else if (orden === 'logros') {
                results.data.sort((a, b) => b.PromedioLogros - a.PromedioLogros);
                localStorage.setItem('logros', 'true');
                localStorage.setItem('nombre', 'false');
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
                            img.alt = row.Nombre; // Agregar alt para el buscador
                            var hrefe = "https://youtube.com/results?search_query=" + row.Nombre + "+gameplay";
                            img.setAttribute('class','imagen')
                            img.setAttribute('href', hrefe);
                            img.setAttribute('data-platform', row.Ruta); // Agregar atributo de datos para la plataforma
                            img.setAttribute('data-hours-played', row.Horas); // Agregar atributo de datos para las horas jugadas
                            img.setAttribute('data-achievements', row.MisLogros); // Agregar atributo de datos para los logros
                            img.setAttribute('data-total-achievements', row.LogrosTotal); 
                            img.setAttribute('data-promedio-achievements', row.PromedioLogros); 

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
                                contenedor.appendChild(img);
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
                    var rutasDelJuego = plataformasJuegos[imagenAlt];
                    var imagenRuta = rutasDelJuego;
                    var imagenHoras = this.getAttribute("data-hours-played");
                    var imagenMisLogros = this.getAttribute("data-achievements");

                    if(this.getAttribute("data-total-achievements") == 99){
                        var imagenLogrosTotales = " ";
                        var imagenMisLogros = "N/N";
                    } else {
                        var imagenLogrosTotales = "/" + this.getAttribute("data-total-achievements");
                    }
                    var imagenPromedioLogros = this.getAttribute("data-promedio-achievements");

                    var texto = "<a class='TittleGame'>" + imagenAlt + "</a><br>" + "<br>" + "<a class='Subtittle'>Plataforma: </a><a class='Datos'>" + imagenRuta + "</a><br>" + 
                                "<a class='Subtittle'>Horas: </a><a class='Datos'>" + imagenHoras + "hs</a>" + "<br>" + "<a class='Subtittle'>Logros: </a><a class='Datos'>" + 
                                imagenMisLogros + imagenLogrosTotales + "</a><br><div class='progress-container'><div class='skill'><div class='progress' style='--wth:" + 
                                imagenPromedioLogros + "%'></div></div></div>"; // Añadir el texto al elemento de texto

                    abrirModal(imagenSrc, texto);
                    abrirBlank(imagenhref);
                });
            });
        }
    });
}


// Función para centrar y distribuir equitativamente las imágenes en la galería
function centrarImagenesGaleria() {
    var galeria = document.querySelector('.gallery');
    var imagenes = galeria.querySelectorAll('img');
    var cantidadImagenes = imagenes.length;

    // Ajustar la distribución de las imágenes
    galeria.style.display = 'flex';
    galeria.style.flexWrap = 'wrap';
    galeria.style.justifyContent = 'center';
    galeria.style.alignItems = 'center';
    // Ajustar el margen entre las imágenes
    imagenes.forEach(function(img) {
        img.style.maxWidth = '250px'; // Cambiar el ancho máximo
    });
}
 //Función para mostrar la cantidad de imágenes en la galería
function mostrarCantidadImagenes() {
    var cantidadImagenes = document.querySelectorAll('.gallery img').length;
    var contador = document.getElementById('contador-imagenes');
    contador.textContent = '' + cantidadImagenes;
}
// Función para restaurar las propiedades CSS originales de la galería
function restaurarPropiedadesCSS() {
    // Restaurar las propiedades CSS originales de la galería
    var galeria = document.querySelector('.gallery');
    var imagenes = galeria.querySelectorAll('img');
    galeria.style.display = "grid";
    galeria.style.flexWrap = "nowrap" ;
    galeria.style.justifyContent = "stretch";
    galeria.style.alignItems = "stretch";
    imagenes.forEach(function(img) {
        img.style.maxWidth = '300px'; // Cambiar el ancho máximo
    });
}
function abrirModal(imagenSrc, texto) {
    var modal = document.getElementById('modal');
    var modalImage = document.getElementById('modal-image');
    var modalText = document.getElementById('modal-text'); // Nuevo elemento de texto

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

    // Eliminar todas las imágenes existentes
    while (contenedorGaleria.firstChild) {
        contenedorGaleria.removeChild(contenedorGaleria.firstChild);
    }
    if(criterio== "nombre"){
        mostrarImagenesPorRuta(ruta, "nombre");
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