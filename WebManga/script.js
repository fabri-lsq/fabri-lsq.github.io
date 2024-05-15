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
function mostrarImagenesPorRuta(ruta, orden, mostrar) {
    // Crear un conjunto para almacenar los nombres de las imágenes mostradas
    var nombresMostrados = new Set();
    var csv = "Mangas.csv"; // CSV fijo    
    var arrayCantidad = new Array(42).fill(0);
    var n = 0;

    // Parsear el archivo CSV
    Papa.parse(csv, {
        download: true,
        header: true,
        complete: function(results) {
            
            // Ordenar los resultados en función del parámetro 'orden'
            if (orden === 'nombre') {
                results.data.sort((a, b) => (a.Nombre > b.Nombre) ? 1 : -1);
            } else if(orden === 'nombre2'){
                results.data.sort((a, b) => (a.Nombre > b.Nombre) ? -1 : 1);
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
            }   else if (orden === '01') {
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

                                // Crear la ruta de la imagen
                                var rutaImagen = row.Ruta + row.Nombre + row.Extension;

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
                                    img.alt = dataActual; // Agregar alt para el buscador
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
                                cantidadTomos + "/" + imagenUltimoTomoARG + "</a></div><br><div class='progress-container'><div class='skill'><div class='progress' style='--wth:" + 
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
    var galeria = document.querySelector('.gallery');
    var imagenes = galeria.querySelectorAll('img');
    var divs = galeria.querySelectorAll('div');
    var cantidadImagenes = imagenes.length;

    // Ajustar la distribución de las imágenes
    galeria.style.display = 'flex';
    galeria.style.flexWrap = 'wrap';
    galeria.style.justifyContent = 'center';
    galeria.style.alignItems = 'center';

    // Ajustar el margen entre las imágenes
    imagenes.forEach(function(img) {
        img.style.margin = '10px';
    });
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
    contador.textContent = 'Tengo: ' + contadorConTengo + '| Faltan: ' + (contadorTotal-contadorConTengo) + '| Total: ' + contadorTotal;
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
    } 
}

// Función para restaurar las propiedades CSS originales de la galería
function restaurarPropiedadesCSS() {
    // Restaurar las propiedades CSS originales de la galería
    var galeria = document.querySelector('.gallery');
    galeria.style.display = "grid";
    galeria.style.flexWrap = "nowrap" ;
    galeria.style.justifyContent = "stretch";
    galeria.style.alignItems = "stretch";
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
