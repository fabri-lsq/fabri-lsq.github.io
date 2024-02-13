<?php

//Ruta
$rutaArchivo = "prueba.csv";

if(($archivo = fopen($rutaArchivo, "r")) ==! false){

    while(($datos =fgetcsv($archivo, 1000, ";")) ==! false){
        
        list($class, $href, $data_title) = $datos;

        echo "<a class='$class' href='$href$data_title.jpg' data-lightbox='models' data-title='$data_title'>
        <img src='$href$data_title.jpg' alt=''>
        </a>"; //TD son columnas
        }
    } else {
    echo "No se ha podido abrir el archivo";
}
fclose($archivo);