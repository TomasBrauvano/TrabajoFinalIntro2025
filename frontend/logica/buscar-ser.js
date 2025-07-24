document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('input-busqueda');
    const boton = document.querySelector('.boton-busqueda');
    const mostrador = document.querySelector('.mostrador-de-contenido');

    boton.addEventListener('click', async () => {
        const valor = input.value.trim().toLowerCase();
        if (!valor) return;
        try {
            const res = await fetch('http://localhost:3000/api/series/buscar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre: valor })
            });
            if (res.status == 404) {
                mostrador.innerHTML = '<p>No hay series con ese nombre, <a href="crear.html">creala</a></p>';
                return
            } else if (!res.ok) throw new Error('Error en la búsqueda');
            const series = await res.json();

            mostrador.innerHTML = '';

            series.forEach(s => {
                const div = document.createElement('div');
                div.classList.add('serie-item');
                div.innerHTML = `
                    <img src="${s.imagen}" alt="${s.nombre}" width="200">
                    <h3>${s.nombre}</h3>
                    <p><strong>Año:</strong> ${s.anio}</p>
                    <p><strong>Director:</strong> ${s.director}</p>
                    <p>${s.sinopsis}</p>
                    <hr>
                `;
                mostrador.appendChild(div);
            });

        } catch (err) {
            console.error(err);
            mostrador.innerHTML = '<p>Error al buscar series.</p>';
        }
    });
});