document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('input-busqueda');
    const boton = document.querySelector('.boton-busqueda');
    const mostrador = document.querySelector('.mostrador-de-contenido');

    boton.addEventListener('click', async () => {
        const valor = input.value.trim().toLowerCase();
        if (!valor) return;
        try {
            const res = await fetch('http://localhost:3000/api/libros/buscar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre: valor })
            });
            if (res.status == 404) {
                mostrador.innerHTML = '<p>No hay libros con ese nombre, <a href="crear.html">crealo</a></p>';
                return
            } else if (!res.ok) throw new Error('Error en la búsqueda');
            const libros = await res.json();

            mostrador.innerHTML = '';

            libros.forEach(l => {
                const div = document.createElement('div');
                div.classList.add('libro-item');
                div.innerHTML = `
                    <img src="${l.imagen}" alt="${l.nombre}" width="200">
                    <button class="boton-agregar">Agregar</button>
                    <h3>${l.nombre}</h3>
                    <p><strong>Año:</strong> ${l.anio}</p>
                    <p><strong>Autor:</strong> ${l.autor}</p>
                    <p>${l.sinopsis}</p>
                    <hr>
                `;
                mostrador.appendChild(div);
            });

        } catch (err) {
            console.error(err);
            mostrador.innerHTML = '<p>Error al buscar libros.</p>';
        }
    });
});