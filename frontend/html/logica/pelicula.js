const peliculaContainer = document.querySelector(".container-info");
const container = document.querySelector(".container-container-pelicula")

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pelicula_id = urlParams.get('id');

    if (pelicula_id) {
        console.log("ID de la película:", pelicula_id);
        try {
            const response = await fetch(`http://localhost:3000/api/peliculas/${pelicula_id}`);
            if (response.ok) {
                const pelicula = await response.json();
                console.log("Detalles de la película:", pelicula);
                document.getElementById('imagen-pelicula').src = pelicula.imagen;
                document.getElementById('titulo-pelicula').textContent = `Titulo: ${pelicula.nombre}`;
                document.getElementById('anio-pelicula').textContent = `Año: ${pelicula.anio}`;
                document.getElementById('director-pelicula').textContent = `Director: ${pelicula.director}`;
                document.getElementById('sinopsis-pelicula').textContent = `Sinopsis: ${pelicula.sinopsis}`;
                document.getElementById('categoria-pelicula').textContent = `Categoria: ${pelicula.categoria}`;
            } else if (response.status === 404) {
                console.error('Error al obtener los detalles de la película:', response.statusText);
                container.innerHTML = `<p>Pelicula no encontrada</p>`;
            } else {
                console.error('Error al obtener los detalles de la película:', response.statusText);
                container.innerHTML = '<p>No se pudo cargar la película.</p>';
            }
        } catch (error) {
            console.error('Error de red al obtener detalles de la película:', error);
            container.innerHTML = '<p>Error de conexión.</p>';
        }
    } else {
        container.innerHTML = '<p>ID de película no proporcionado en la URL.</p>';
    }
});