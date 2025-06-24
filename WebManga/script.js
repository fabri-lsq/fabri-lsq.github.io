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
        var alt = imagen.getAttribute('alt').toLowerCase().replace(/[^\w\s]/gi, '');
        if (alt.includes(textoBusqueda)) {
            imagen.style.display = 'block'; // Mostrar la imagen
        } else {
            imagen.style.display = 'none'; // Ocultar la imagen
        }
    })
    // Si el campo de búsqueda está vacío, restaurar las propiedades CSS originales
    if (textoBusqueda === "") {
        restaurarPropiedadesCSS();
    } else {
        // Si hay texto de búsqueda, centrar las imágenes que se muestran después de la búsqueda
        centrarImagenesGaleria();
    }
}
function mostrarImagenesPorRuta(ruta, orden, mostrar) {
    localStorage.setItem('mostrarImagenes', 'grid');

    // Crear un conjunto para almacenar los nombres de las imágenes mostradas
    var nombresMostrados = new Set();
    var csv = "Mangas.csv"; // CSV fijo    
    var arrayCantidad = new Array(42).fill(0);
    var n = 0;
    var contenedor = document.querySelector('.gallery');

    // Eliminar cualquier contenido existente en el contenedor
    contenedor.innerHTML = '';

    var isMobile = window.matchMedia("(max-width: 500px)").matches;
    if (isMobile) {
        contenedor.style.gridTemplateColumns = 'repeat(auto-fit, minmax(140px, 1fr))';
    } else {
        contenedor.style.gridTemplateColumns = 'repeat(auto-fit, minmax(190px, 1fr))';
    }

    contenedor.style.display = 'grid';
    contenedor.style.margin = '3%';
    contenedor.style.gridGap = '30px';
    contenedor.style.filter = 'drop-shadow(6px 6px 5px rgb(107, 64, 224))';
    contenedor.style.position = 'relative';

    var container = document.querySelector('.container');
    container.style.margin = '';
    container.style.maxWidth = '';
    container.style.width = '';

    // Parsear el archivo CSV
    Papa.parse(csv, {
        download: true,
        header: true,
        complete: function(results) {
            
            // Ordenar los resultados en función del parámetro 'orden'
            if (orden === 'nombre') {
                results.data.sort((a, b) => {
                    return a.Nombre.localeCompare(b.Nombre, undefined, { numeric: true, sensitivity: 'base' });
                });
            } else if(orden === 'nombre2'){
                results.data.sort((a, b) => {
                    return b.Nombre.localeCompare(a.Nombre, undefined, { numeric: true, sensitivity: 'base' });
            });
            } else if (orden === 'tenencia') {
                results.data.sort((a, b) => {
                    if (a.LoTengo === b.LoTengo) {
                        return 0;
                    } else if (a.LoTengo === "Si") {
                        return -1;
                    } else {
                        return 1;
                    }
                });
            } else if (orden === '01') {
                // Filtrar los resultados que contienen "01" en el nombre
                let filteredResults = results.data.filter(item => item.Nombre.includes('01'));
                // Ordenar los resultados filtrados por nombre
                filteredResults.sort((a, b) => a.Nombre.localeCompare(b.Nombre));
                // Actualizar los resultados con los resultados filtrados y ordenados
                results.data = filteredResults;
            } else if (orden === 'lotengo') {
                // Filtrar los resultados que tienen "Si" en LoTengo
                let filteredResults = results.data.filter(item => item.LoTengo === 'Si');
                // Actualizar los resultados con los resultados filtrados
                results.data = filteredResults;
            } else if (orden === 'nolotengoA-Z') {
                // Filtrar los resultados que tienen "No" en LoTengo
                let filteredResults = results.data.filter(item => item.LoTengo === 'No');
                // Actualizar los resultados con los resultados filtrados
                results.data = filteredResults;
                results.data.sort((a, b) => (a.Nombre > b.Nombre) ? 1 : -1);
            } else if (orden === 'nolotengoZ-A') {
                // Filtrar los resultados que tienen "No" en LoTengo
                let filteredResults = results.data.filter(item => item.LoTengo === 'No');
                // Actualizar los resultados con los resultados filtrados
                results.data = filteredResults;
                results.data.sort((a, b) => (a.Nombre > b.Nombre) ? -1 : 1);
            } else if (orden === 'siguiendo') {
                // Filtrar los resultados que tienen "No" en LoTengo
                let filteredResults = results.data.filter(item => item.Siguiendo === 'Si');
                // Actualizar los resultados con los resultados filtrados
                results.data = filteredResults;
                results.data.sort((a, b) => (a.Nombre > b.Nombre) ? 1 : -1);
            } else if (orden === 'siguiendo2') {
                // Filtrar los resultados que tienen "No" en LoTengo
                let filteredResults = results.data.filter(item => item.Siguiendo === 'Si');
                // Actualizar los resultados con los resultados filtrados
                results.data = filteredResults;
                results.data.sort((a, b) => (a.Nombre > b.Nombre) ? -1 : 1);
            }
            // Iterar sobre cada fila del CSV
            results.data.forEach(function(row, index) {
                if (Object.values(row).every(value => !value)) {//Verifica si la linea esta vacia
                    // La línea está vacía, no hagas nada
                    return;
                } else {
                        // Verificar si la ruta coincide o si se deben mostrar todas las imágenes
                        if (row.Ruta === ruta || ruta === "all") {
                            // Verificar si el nombre no ha sido mostrado antes
                            if (!nombresMostrados.has(row.Nombre)) {
                                // Agregar el nombre al conjunto de nombres mostrados
                                nombresMostrados.add(row.Nombre);
                                if (ruta === "Mangas/TomosUnicos/"){
                                    // Media query para detectar pantallas pequeñas
                                    var isMobile = window.matchMedia("(max-width: 500px)").matches;
                                    if (isMobile) {
                                        let titulo = document.querySelector('h2');
                                        titulo.style.marginBottom = "0.2%";
                                    }
                                }
                                // Crear la ruta de la imagen
                                var rutaImagen = row.Ruta + row.Nombre + row.Extension;
                                rutaImagen = rutaImagen.toLowerCase();
                                //Contador de cuantos tengo
                                if (index + 1 < results.data.length) {
                                    var nextElement = results.data[index + 1];

                                    let dataActual = row.Nombre.replace(/[0-9]/g, '');
                                    let serieSiguiente = nextElement.Nombre.replace(/[0-9]/g, '');
                                    let alternativasActual = dataActual.slice(-4);
                                    let alternativasSiguiente = serieSiguiente.slice(-4);

                                    if(dataActual===serieSiguiente){
                                        if (row.LoTengo === "Si") {
                                            arrayCantidad[n]++;
                                        }
                                    } else if(alternativasActual == "_alt"){
                                        dataActual = dataActual.slice(0, -4);
                                        if(dataActual===serieSiguiente){
                                            if (row.LoTengo === "Si") {
                                                arrayCantidad[n]++;
                                            }
                                        }
                                    } else if(alternativasSiguiente == "_alt"){
                                        serieSiguiente = serieSiguiente.slice(0, -4);
                                        if(dataActual===serieSiguiente){
                                            if (row.LoTengo === "Si") {
                                                arrayCantidad[n]++;
                                            }
                                        }
                                    }
                                    // Crear la imagen
                                    var contenedor = document.querySelector('.gallery');
                                    var img = document.createElement('img');
                                    img.src = rutaImagen;
                                    img.alt = row.Nombre.replace(/([A-Za-z]+)(\d+)/g, '$1 $2');; // Agregar alt para el buscador
                                    var hrefe = "https://youtube.com/results?search_query=" + row.Nombre + "+gameplay";
                                    img.setAttribute('href', hrefe);
                                    img.setAttribute('data-tenencia', row.LoTengo); // Agregar atributo de datos para los logros
                                    img.setAttribute('data-editorial', row.Editorial); // Agregar atributo de datos para la plataforma
                                    img.setAttribute('data-estadoARG', row.EstadoARG); // Agregar atributo de datos para las horas jugadas
                                    img.setAttribute('data-estadoJPN', row.EstadoJPN); // Agregar atributo de datos para las horas jugadas
                                    img.setAttribute('data-UltimoTomoARG', row.UltimoTomoARG); // Agregar atributo de datos para las horas jugadas
                                    img.setAttribute('data-UltimoTomoJPN', row.UltimoTomoJPN); // Agregar atributo de datos para las horas jugadas
                                    img.setAttribute('posicionCantidad', n);

                                    if (row.LoTengo === "No") {
                                        img.classList.add('nolotengo'); // Aplicar filtro de escala de grises si no tienes la imagen
                                    }
                                    contenedor.appendChild(img);
                                    if(dataActual!==serieSiguiente){
                                        if (row.LoTengo === "Si") {
                                            arrayCantidad[n]++;
                                        }
                                        n++;
                                    }
                                } else {
                                    n++;
                                    if (row.LoTengo === "Si") {
                                        arrayCantidad[n]++;
                                    }
                                    // Crear la imagen
                                    var contenedor = document.querySelector('.gallery');
                                    var img = document.createElement('img');
                                    img.src = rutaImagen;
                                    img.alt = row.Nombre; // Agregar alt para el buscador
                                    var hrefe = "https://youtube.com/results?search_query=" + row.Nombre + "+gameplay";
                                    img.setAttribute('href', hrefe);
                                    img.setAttribute('data-tenencia', row.LoTengo); // Agregar atributo de datos para los logros
                                    img.setAttribute('data-editorial', row.Editorial); // Agregar atributo de datos para la plataforma
                                    img.setAttribute('data-estadoARG', row.EstadoARG); // Agregar atributo de datos para las horas jugadas
                                    img.setAttribute('data-estadoJPN', row.EstadoJPN); // Agregar atributo de datos para las horas jugadas
                                    img.setAttribute('data-UltimoTomoARG', row.UltimoTomoARG); // Agregar atributo de datos para las horas jugadas
                                    img.setAttribute('data-UltimoTomoJPN', row.UltimoTomoJPN); // Agregar atributo de datos para las horas jugadas
                                    img.setAttribute('posicionCantidad', n);
                                    if (row.LoTengo === "No") {
                                        img.classList.add('nolotengo'); // Aplicar filtro de escala de grises si no tienes la imagen
                                    }
                                    
                                    contenedor.appendChild(img);
                                }
                            }
                        }
                        
                    }
                    
            });
            
            // Llamar a la función para centrar y distribuir equitativamente las imágenes
            //centrarImagenesGaleria();

            // Llamar a la función para mostrar la cantidad de imágenes
            if(mostrar === "si"){
                mostrarCantidadImagenes();
            }

            // Agregar evento de clic a las imágenes para abrir el modal
            var imagenes = document.querySelectorAll('.gallery img');
            imagenes.forEach(function(imagen) {
                imagen.addEventListener('click', function() {
                    var imagenSrc = this.getAttribute('src');
                    var imagenAlt = this.getAttribute("alt");
                    var imagenhref = this.getAttribute('href');
                    var ImagenEditorial = this.getAttribute('data-editorial');
                    var imagenTenencia = this.getAttribute("data-tenencia");
                    var imagenEstadoARG = this.getAttribute("data-estadoARG");
                    var imagenEstadoJPN = this.getAttribute("data-estadoJPN");
                    var imagenUltimoTomoARG = this.getAttribute("data-UltimoTomoARG");
                    var imagenUltimoTomoJPN = this.getAttribute("data-UltimoTomoJPN");
                    var imagenhref = this.getAttribute('href');
                    var nimage = this.getAttribute('posicionCantidad');
                    var cantidadTomos = arrayCantidad[nimage];

                    var texto = "<a class='TittleGame'>" + imagenAlt + "</a><br>" + "<br>" + "<div class='bloque'><a class='Subtittle'>Editorial: </a><a class='Datos'>" + ImagenEditorial + "</a></div><br>" + 
                                "<div class='bloque'><a class='Subtittle'>LoTengo: </a><a class='Datos'>" + imagenTenencia + "</a></div>" + "<br>"+ "<div class='bloque'><a class='Subtittle'>Estadoᴬᴿ: </a><a class='Datos'>" + imagenEstadoARG + "</a></div><br>" +
                                "<div class='bloque'><a class='Subtittle'>Estadoᴶᴾ: </a><a class='Datos'>" + imagenEstadoJPN + "</a></div><br>" + "<div class='bloque'><a class='Subtittle'>Completoᴬᴿ: </a><a class='Datos'>" + 
                                cantidadTomos + "/" + imagenUltimoTomoARG + "</a></div><br><div class='progress-container'><div class='skill'><div class='progress' id='completoAR' style='--wth:" + 
                                (cantidadTomos * 100 / imagenUltimoTomoARG) + "%'></div></div></div>" + "<div class='bloque2'><a class='Subtittle'>Completoᴶᴾ: </a><a class='Datos'>" + 
                                cantidadTomos + "/" + imagenUltimoTomoJPN + "</a></div><br><div class='progress-container3'><div class='skill3'><div class='progress3' style='--wth:" + 
                                (cantidadTomos * 100 / imagenUltimoTomoJPN) + "%'></div></div></div>" ; // Añadir el texto al elemento de texto

                    abrirModal(imagenSrc, texto);
                    abrirBlank(imagenhref);
                });
            });
        }
    });
}
// Función para centrar y distribuir equitativamente las imágenes en la galería
function centrarImagenesGaleria() {
    // Media query para detectar pantallas pequeñas
    var isMobile = window.matchMedia("(max-width: 500px)").matches;
    if (isMobile) {    
    } else {
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
            img.style.maxWidth = '200px'; // Cambiar el ancho máximo
        });
    }
}

function mostrarCantidadImagenes() {
    
    var todasLasImagenes = document.querySelectorAll('.gallery img');
    var contadorTotal = todasLasImagenes.length;

    var imagenesConTengo = document.querySelectorAll('.gallery img:not(.nolotengo)');
    var contadorConTengo = imagenesConTengo.length;

    var contador = document.getElementById('contador-imagenes');
    if(contadorConTengo === contadorTotal){
        contador.textContent = "Completa";
        contador.style.backgroundColor = "rgb(37, 203, 57)";
    } else{
    contador.textContent = 'Tengo: ' + contadorConTengo + ' | Faltan: ' + (contadorTotal-contadorConTengo) + ' | Total: ' + contadorTotal;
    }
    //centrarImagenesGaleria();
}

function ordenarImagenes(ruta, criterio, mostrar) {
    // Seleccionar el contenedor de galería
    var contenedorGaleria = document.querySelector('.gallery');

    // Eliminar todas las imágenes existentes
    while (contenedorGaleria.firstChild) {
        contenedorGaleria.removeChild(contenedorGaleria.firstChild);
    }
    if(localStorage.getItem('mostrarImagenes') === 'grid'){
        if(criterio== "nombre"){
            mostrarImagenesPorRuta(ruta, "nombre", mostrar);
        } else if(criterio== "nombre2"){
            mostrarImagenesPorRuta(ruta, "nombre2", mostrar);
        } else if(criterio== "lotengo"){
            mostrarImagenesPorRuta(ruta, "lotengo", mostrar);    
        } else if(criterio== "nolotengoA-Z"){
            mostrarImagenesPorRuta(ruta, "nolotengoA-Z", mostrar);
        } else if(criterio== "nolotengoZ-A"){
            mostrarImagenesPorRuta(ruta, "nolotengoZ-A", mostrar);
        } else if(criterio== "tenencia"){
            mostrarImagenesPorRuta(ruta, "tenencia", mostrar);
        } else if(criterio== "siguiendo"){
            mostrarImagenesPorRuta(ruta, "siguiendo", mostrar);
        } else if(criterio== "siguiendo2"){
            mostrarImagenesPorRuta(ruta, "siguiendo2", mostrar);
        } 
    } else if(localStorage.getItem('mostrarImagenes') === 'horizontal'){
        if(criterio== "nombre"){
            mostrarImagenesPorRutaHorizontal(ruta, "nombre", mostrar);
        } else if(criterio== "nombre2"){
            mostrarImagenesPorRutaHorizontal(ruta, "nombre2", mostrar);
        } else if(criterio== "lotengo"){
            mostrarImagenesPorRutaHorizontal(ruta, "lotengo", mostrar);    
        } else if(criterio== "nolotengoA-Z"){
            mostrarImagenesPorRutaHorizontal(ruta, "nolotengoA-Z", mostrar);
        } else if(criterio== "nolotengoZ-A"){
            mostrarImagenesPorRutaHorizontal(ruta, "nolotengoZ-A", mostrar);
        } else if(criterio== "tenencia"){
            mostrarImagenesPorRutaHorizontal(ruta, "tenencia", mostrar);
        } else if(criterio== "siguiendo"){
            mostrarImagenesPorRutaHorizontal(ruta, "siguiendo", mostrar);
        } else if(criterio== "siguiendo2"){
            mostrarImagenesPorRutaHorizontal(ruta, "siguiendo2", mostrar);
        } 
    }
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
    // Inicializar localStorage si no está configurado
    if (!localStorage.getItem('nombre') && !localStorage.getItem('horas') && !localStorage.getItem('logros')) {
        localStorage.setItem('Mangas/alternativas/', 'lotengo');
        localStorage.setItem('all', 'nolotengoA-Z');
        localStorage.setItem('all', 'nombre');
        localStorage.setItem('all', 'siguiendo');
        localStorage.setItem('Mangas/TomosUnicos/', 'lotengo');
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

function mostrarImagenesPorRutaHorizontal(ruta, orden, mostrar) {
    localStorage.setItem('mostrarImagenes', 'horizontal');

    var contenedor = document.querySelector('.gallery');
    contenedor.innerHTML = '';

    contenedor.style.display = '';
    contenedor.style.gridTemplateColumns = '';
    contenedor.style.margin = '0 auto';
    contenedor.style.gridGap = '';
    contenedor.style.filter = '';
    contenedor.style.position = '';

    var container = document.querySelector('.container');
    container.style.margin = '0 auto';
    container.style.maxWidth = '1280px';
    container.style.width = '90%';

    var arrayCantidad = new Array(42).fill(0); // Inicializar el array de cantidad de tomos
    var n = 0; // Contador para la posición en arrayCantidad

    Papa.parse("Mangas.csv", {
        download: true,
        header: true,
        complete: function(results) {
            // Ordenar los resultados en función del parámetro 'orden'
            if (orden === 'nombre') {
                let filteredResults = results.data.filter(item => item.Name === 'Si');
                results.data = filteredResults;
                results.data.sort((a, b) => (a.Nombre > b.Nombre) ? 1 : -1);
            } else if (orden === 'nombre2') {
                let filteredResults = results.data.filter(item => item.Name === 'Si');
                results.data = filteredResults;
                results.data.sort((a, b) => (b.Nombre > a.Nombre) ? 1 : -1);
            } else if (orden === 'tenencia') {
                results.data.sort((a, b) => {
                    if (a.LoTengo === b.LoTengo) {
                        return 0;
                    } else if (a.LoTengo === "Si") {
                        return -1;
                    } else {
                        return 1;
                    }
                });
            } else if (orden === '01') {
                let filteredResults = results.data.filter(item => item.Nombre.includes('01'));
                filteredResults.sort((a, b) => a.Nombre.localeCompare(b.Nombre));
                results.data = filteredResults;
            } else if (orden === 'lotengo') {
                let filteredResults = results.data.filter(item => item.LoTengo === 'Si');
                results.data = filteredResults;
            } else if (orden === 'nolotengoA-Z') {
                let filteredResults = results.data.filter(item => item.LoTengo === 'No');
                results.data = filteredResults;
                results.data.sort((a, b) => (a.Nombre > b.Nombre) ? 1 : -1);
            } else if (orden === 'nolotengoZ-A') {
                let filteredResults = results.data.filter(item => item.LoTengo === 'No');
                results.data = filteredResults;
                results.data.sort((a, b) => (a.Nombre > b.Nombre) ? -1 : 1);
            } else if (orden === 'siguiendo') {
                let filteredResults = results.data.filter(item => item.Siguiendo === 'Si');
                results.data = filteredResults;
                results.data.sort((a, b) => (a.Nombre > b.Nombre) ? 1 : -1);
            } else if (orden === 'siguiendo2') {
                let filteredResults = results.data.filter(item => item.Siguiendo === 'Si');
                results.data = filteredResults;
                results.data.sort((a, b) => (a.Nombre > b.Nombre) ? -1 : 1);
            }

            // Objeto para almacenar las imágenes agrupadas por serie
            var series = {};

            results.data.forEach(function(row, index) {
                // Obtener el nombre de la serie eliminando los números
                var serieNombre = row.Nombre.replace(/\d+/g, '');

                if (row.Ruta === ruta || ruta === "all") {
                    if (!series[serieNombre]) {
                        series[serieNombre] = [];
                    }

                    var imagen = {
                        src: (row.Ruta + row.Nombre + row.Extension).toLowerCase(),
                        alt: row.Nombre.replace(/([A-Za-z]+)(\d+)/g, '$1 $2'),
                        loTengo: row.LoTengo,
                        editorial: row.Editorial,
                        estadoARG: row.EstadoARG,
                        estadoJPN: row.EstadoJPN,
                        ultimoTomoARG: row.UltimoTomoARG,
                        ultimoTomoJPN: row.UltimoTomoJPN,
                        posicionCantidad: n // Añadir la posición en el array de cantidad
                    };

                    // Contador de cuantos tengo
                    if (index + 1 < results.data.length) {
                        var nextElement = results.data[index + 1];

                        let dataActual = row.Nombre.replace(/[0-9]/g, '');
                        let serieSiguiente = nextElement.Nombre.replace(/[0-9]/g, '');
                        let alternativasActual = dataActual.slice(-4);
                        let alternativasSiguiente = serieSiguiente.slice(-4);

                        if (dataActual === serieSiguiente) {
                            if (row.LoTengo === "Si") {
                                arrayCantidad[n]++;
                            }
                        } else if (alternativasActual == "_alt") {
                            dataActual = dataActual.slice(0, -4);
                            if (dataActual === serieSiguiente) {
                                if (row.LoTengo === "Si") {
                                    arrayCantidad[n]++;
                                }
                            }
                        } else if (alternativasSiguiente == "_alt") {
                            serieSiguiente = serieSiguiente.slice(0, -4);
                            if (dataActual === serieSiguiente) {
                                if (row.LoTengo === "Si") {
                                    arrayCantidad[n]++;
                                }
                            }
                        }

                        if (dataActual !== serieSiguiente) {
                            if (row.LoTengo === "Si") {
                                arrayCantidad[n]++;
                            }
                            n++;
                        }
                    } else {
                        n++;
                        if (row.LoTengo === "Si") {
                            arrayCantidad[n]++;
                        }
                    }

                    series[serieNombre].push(imagen);
                }
            });

            Object.keys(series).forEach(function(serieNombre) {
                var carouselDiv = document.createElement('div');
                carouselDiv.className = 'carousel center-align';

                series[serieNombre].forEach(function(imagen) {
                    var carouselItemDiv = document.createElement('div');
                    carouselItemDiv.className = 'carousel-item';

                    var img = document.createElement('img');
                    img.src = imagen.src;
                    img.alt = imagen.alt;
                    img.dataset.tenencia = imagen.loTengo;
                    img.dataset.editorial = imagen.editorial;
                    img.dataset.estadoArg = imagen.estadoARG;
                    img.dataset.estadoJpn = imagen.estadoJPN;
                    img.dataset.ultimoTomoArg = imagen.ultimoTomoARG;
                    img.dataset.ultimoTomoJpn = imagen.ultimoTomoJPN;
                    img.dataset.posicionCantidad = imagen.posicionCantidad; // Añadir la posición al dataset

                    if (imagen.loTengo === 'No') {
                        img.className = 'nolotengo';
                    }

                    carouselItemDiv.appendChild(img);
                    carouselDiv.appendChild(carouselItemDiv);
                });

                contenedor.appendChild(carouselDiv);
            });

            if (mostrar === "si") {
                mostrarCantidadImagenes();
            }

            var elems = document.querySelectorAll('.carousel');
            elems.forEach(function(carousel) {
                var images = carousel.querySelectorAll('.carousel-item');
                var numImages = images.length;
                var numVisible = 7;

                var clonesNeeded = Math.ceil(numVisible / numImages);
                for (var i = 0; i < clonesNeeded; i++) {
                    images.forEach(function(image) {
                        var clone = image.cloneNode(true);
                        carousel.appendChild(clone);
                    });
                }

                M.Carousel.init(carousel, {
                    duration: 100,
                    dist: 0,
                    shift: 0,
                    padding: 10,
                    numVisible: numVisible,
                    indicators: false,
                    noWrap: false,
                    interval: 100,
                });
            });

            var imagenes = document.querySelectorAll('.carousel img');
            imagenes.forEach(function(imagen) {
                imagen.addEventListener('click', function() {
                    var imagenSrc = this.src;
                    var imagenAlt = this.alt;
                    var ImagenEditorial = this.dataset.editorial;
                    var imagenTenencia = this.dataset.tenencia;
                    var imagenEstadoARG = this.dataset.estadoArg;
                    var imagenEstadoJPN = this.dataset.estadoJpn;
                    var imagenUltimoTomoARG = this.dataset.ultimoTomoArg;
                    var imagenUltimoTomoJPN = this.dataset.ultimoTomoJpn;
                    var nimage = this.dataset.posicionCantidad; // Obtener la posición desde el dataset
                    var cantidadTomos = arrayCantidad[nimage];

                    var texto = "<a class='TittleGame'>" + imagenAlt + "</a><br>" + "<br>" + "<div class='bloque'><a class='Subtittle'>Editorial: </a><a class='Datos'>" + ImagenEditorial + "</a></div><br>" + 
                                "<div class='bloque'><a class='Subtittle'>LoTengo: </a><a class='Datos'>" + imagenTenencia + "</a></div>" + "<br>"+ "<div class='bloque'><a class='Subtittle'>Estadoᴬᴿ: </a><a class='Datos'>" + imagenEstadoARG + "</a></div><br>" +
                                "<div class='bloque'><a class='Subtittle'>Estadoᴶᴾ: </a><a class='Datos'>" + imagenEstadoJPN + "</a></div><br>" + "<div class='bloque'><a class='Subtittle'>Completoᴬᴿ: </a><a class='Datos'>" + 
                                cantidadTomos + "/" + imagenUltimoTomoARG + "</a></div><br><div class='progress-container'><div class='skill'><div class='progress' id='completoAR' style='--wth:" + 
                                (cantidadTomos * 100 / imagenUltimoTomoARG) + "%'></div></div></div>" + "<div class='bloque2'><a class='Subtittle'>Completoᴶᴾ: </a><a class='Datos'>" + 
                                cantidadTomos + "/" + imagenUltimoTomoJPN + "</a></div><br><div class='progress-container3'><div class='skill3'><div class='progress3' style='--wth:" + 
                                (cantidadTomos * 100 / imagenUltimoTomoJPN) + "%'></div></div></div>" ; // Añadir el texto al elemento de texto

                    abrirModal(imagenSrc, texto);
                });
            });
        }
    });
}


