# 📚 Biblioteca Virtual — Fabri LSQ

> Colección personal de mangas, juegos y libros. Diseño oscuro, portadas automáticas y base de datos en la nube.

&nbsp;

![Vista previa](https://img.shields.io/badge/estado-en%20desarrollo-c084fc?style=for-the-badge&labelColor=0e0e12)
![Netlify](https://img.shields.io/badge/hosting-Netlify-818cf8?style=for-the-badge&logo=netlify&logoColor=white&labelColor=0e0e12)
![Airtable](https://img.shields.io/badge/base%20de%20datos-Airtable-a3e635?style=for-the-badge&logo=airtable&logoColor=white&labelColor=0e0e12)

&nbsp;

## 🌐 [biblioteca-virtual-lsq.netlify.app](https://biblioteca-virtual-lsq.netlify.app)

&nbsp;

---

## ✨ Secciones

### 📖 Mangas
Seguimiento tomo a tomo de cada serie. Portadas automáticas via **MyAnimeList (Jikan API)**. Muestra qué tomos tenés, cuáles faltan y el progreso de cada serie con barra visual.

### 🎮 Juegos
Colección organizada por plataforma: Steam, Xbox, Epic Games y Ubisoft. Muestra horas jugadas, logros y porcentaje de completado. Portadas via **RAWG API**.

### 📚 Libros
Biblioteca literaria personal con estado de lectura, autor, año y género. Portadas via **Open Library**.

&nbsp;

---

## 🛠️ Stack técnico

| Capa | Tecnología |
|---|---|
| Frontend | HTML, CSS, JavaScript vanilla |
| Base de datos | Airtable |
| Hosting | Netlify |
| Portadas mangas | Jikan API (MyAnimeList) |
| Portadas juegos | RAWG API |
| Portadas libros | Open Library |
| Seguridad | Netlify Functions (proxy serverless) |

&nbsp;

---

## 🔒 Seguridad

El token de Airtable **nunca está expuesto en el frontend**. Todas las llamadas a la base de datos pasan por una función serverless en Netlify que actúa de proxy, manteniendo las credenciales en variables de entorno del servidor.

```
Navegador → /.netlify/functions/airtable → Airtable
                        ↑
              token seguro acá, invisible para el usuario
```

&nbsp;

---

## 📁 Estructura del proyecto

```
biblioteca-virtual/
├── netlify.toml                  # Configuración de Netlify
├── netlify/
│   └── functions/
│       └── airtable.js           # Proxy serverless (token seguro)
├── index.html                    # Home
├── WebMangas/
│   └── index.html                # Galería de mangas
├── WebJuegos/
│   └── index.html                # Galería de juegos
└── WebLibros/
    └── index.html                # Galería de libros
```

&nbsp;

---

## 🎨 Características del diseño

- Tema oscuro con gradientes y blur
- Tipografía **Bebas Neue** + **DM Sans**
- Cards con portada, barra de progreso y badges de estado
- Modal de detalle con grilla de tomos (mangas)
- Filtros y ordenamiento dinámico
- Búsqueda en tiempo real
- Responsive para celular y desktop
- Skeletons de carga

&nbsp;

---

## 🚧 En desarrollo

- [ ] Panel admin local para agregar/editar entradas
- [ ] Migración de datos históricos de juegos
- [ ] Soporte para ediciones alternativas de mangas
- [ ] Estadísticas globales de la colección

&nbsp;

---

<div align="center">
  <sub>Hecho con 🟣 por <a href="https://github.com/fabri-lsq">fabri-lsq</a></sub>
</div>
