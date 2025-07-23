document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('input-busqueda');
    const boton = document.querySelector('.boton-busqueda');
    const mostrador = document.querySelector('.mostrador-de-contenido');

    boton.addEventListener('click', async () => {
        const valor = input.value.trim().toLowerCase();
        if (!valor) return;
        try {
            const res = await fetch('http://localhost:3000/api/peliculas/buscar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre: valor })
            });
            if (res.status == 404) {
                mostrador.innerHTML = '<p>No hay peliculas con ese nombre, <a href="crear.html">creala</a></p>';
                return
            } else if (!res.ok) throw new Error('Error en la búsqueda');
            const peliculas = await res.json();

            mostrador.innerHTML = '';

            peliculas.forEach(p => {
                const div = document.createElement('div');
                div.classList.add('pelicula-item');
                div.innerHTML = `
                    <h3>${p.nombre}</h3>
                    <p><strong>Año:</strong> ${p.anio}</p>
                    <p><strong>Director:</strong> ${p.director}</p>
                    <p>${p.sinopsis}</p>
                    <img src="${p.imagen}" alt="${p.nombre}" width="200">
                    <hr>
                `;
                mostrador.appendChild(div);
            });

        } catch (err) {
            console.error(err);
            mostrador.innerHTML = '<p>Error al buscar películas.</p>';
        }
    });
});