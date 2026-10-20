# Runner Records – Landing page

Sitio estático (HTML + CSS + JS, sin dependencias ni build) de la productora, editora de sonido y sala de ensayo Runner Records.

## Estructura (todo en la raíz del repositorio)

```
index.html      Contenido y estructura
styles.css      Estilos (colores y tipografías en :root)
main.js         Medidor de audio, testimonios, formulario, galería ampliada
logo.png        Logo
*.jpg           Fotos de la sala
README.md
```

Importante: todos los archivos van **juntos en la raíz**, sin subcarpetas. Las rutas del sitio están escritas para esa estructura.

## Publicar en GitHub Pages

*Settings → Pages →* rama `main`, carpeta `/ (root)`.

## Cómo editar

- **Colores y tipografías:** variables al comienzo de `styles.css` (`:root`).
- **Textos:** directamente en `index.html`.
- **Testimonios:** arreglo `T` dentro de `main.js`.
- **Fotos:** reemplazá el archivo manteniendo el nombre.

## Formulario

Envía las consultas con Formspree al endpoint configurado en el atributo `action` del `<form id="form">` de `index.html`. Para cambiar el email que las recibe, hacelo desde el panel de Formspree.

## Pendientes antes de lanzar

- Reemplazar los testimonios de ejemplo por reales.
- Confirmar marcas y modelos de la sección Equipamiento.
- Cambiar el email de contacto y los enlaces de redes del footer.
- La foto `pedalera-en-vivo.jpg` tiene marca de agua del fotógrafo.
- Las tipografías se cargan desde Google Fonts (requiere conexión).
