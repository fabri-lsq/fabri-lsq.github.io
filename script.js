function filtrarImagenes() {
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


function mostrarImagenesPorRuta(ruta) {
    // Crear un conjunto para almacenar los nombres de las imágenes mostradas
    var nombresMostrados = new Set();

    // Parsear el archivo CSV
    Papa.parse('Juegos.csv', {
        download: true,
        header: true,
        complete: function(results) {
            // Iterar sobre cada fila del CSV
            results.data.forEach(function(row) {
                // Verificar si la ruta coincide o si se deben mostrar todas las imágenes
                if (row.Ruta === ruta || ruta === "all") {
                    // Verificar si el nombre no ha sido mostrado antes
                    if (!nombresMostrados.has(row.Nombre)) {
                        // Agregar el nombre al conjunto de nombres mostrados
                        nombresMostrados.add(row.Nombre);

                        // Crear la ruta de la imagen
                        var rutaImagen = row.Ruta + row.Nombre + row.Extension;

                        // Crear la imagen
                        var contenedor = document.querySelector('.gallery');
                        var img = document.createElement('img');
                        img.src = rutaImagen;
                        img.alt = row.Nombre; // Agregar alt para el buscador
                        img.setAttribute('data-platform', row.Plataformas); // Agregar atributo de datos para la plataforma
                        img.setAttribute('data-achievements', row.Logros); // Agregar atributo de datos para los logros
                        img.setAttribute('data-hours-played', row.Horas); // Agregar atributo de datos para las horas jugadas
                        contenedor.appendChild(img);
                    }
                }
            });

            // Llamar a la función para centrar y distribuir equitativamente las imágenes
            //centrarImagenesGaleria();

            // Llamar a la función para mostrar la cantidad de imágenes
            mostrarCantidadImagenes();

            // Agregar evento de clic a las imágenes para abrir el modal
            var imagenes = document.querySelectorAll('.gallery img');
            imagenes.forEach(function(imagen) {
                imagen.addEventListener('click', function() {
                    var imagenSrc = this.getAttribute('src');
                    abrirModal(imagenSrc);
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
        img.style.margin = '10px';
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
    galeria.style.display = "grid";
    galeria.style.flexWrap = "nowrap" ;
    galeria.style.justifyContent = "stretch";
    galeria.style.alignItems = "stretch";
}

// Función para abrir el modal y mostrar la imagen seleccionada
function abrirModal(imagenSrc) {
    var modal = document.getElementById('modal');
    var modalImage = document.getElementById('modal-image');
    modalImage.src = imagenSrc;
    modal.style.display = "block";
}

// Agregar evento de clic a las imágenes para abrir el modal
document.addEventListener('DOMContentLoaded', function() {
    var imagenes = document.querySelectorAll('.gallery img');
    imagenes.forEach(function(imagen) {
        imagen.addEventListener('click', function() {
            var imagenSrc = this.getAttribute('src');
            abrirModal(imagenSrc);
        });
    });

    // Agregar evento de clic al botón de cerrar del modal
    var closeButton = document.querySelector('.close');
    closeButton.addEventListener('click', function() {
        var modal = document.getElementById('modal');
        modal.style.display = "none";
    });
});
