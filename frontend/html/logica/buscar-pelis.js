const usuario_id = localStorage.getItem("usuario_id");
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

            for (const p of peliculas) {
                const div = document.createElement('div');
                let noAgregada = true;
                const pRes = await fetch(`http://localhost:3000/api/usuarios_peliculas/${usuario_id}/${p.id}`);
                if (pRes.ok) {
                    noAgregada = false;
                }
                div.classList.add('pelicula-item');
                div.innerHTML = `
                    <img src="${p.imagen}" alt="${p.nombre}" width="200">
                    <h3>Título: ${p.nombre}</h3>
                    ${noAgregada ? `
                    <button class="boton-agregar">Agregar</button>
                    `: ''}
                `;

                mostrador.appendChild(div);

                if (noAgregada) {
                    document.querySelector(`.boton-agregar`).addEventListener("click", async () => {

                        try {
                            const response = await fetch(`http://localhost:3000/api/usuarios_peliculas`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    usuario_id,
                                    pelicula_id: p.id,
                                    calificacion: "",
                                    estado: "1"
                                })
                            });

                            if (response.ok) {
                                alert(`"${p.nombre}" se agrego a tu perfil de peliculas.`);
                                location.reload();
                            } else {
                                const errorData = await response.json();
                                alert(`Ocurrio un error al agregar la pelicula: ${p.nombre}`);
                            }
                        } catch (error) {
                            console.error("Error al enviar la solicitud para agregar:", error);
                            alert("Ocurrió un error en el servidor.");
                        }
                    });
                }
            };

        } catch (err) {
            console.error(err);
            mostrador.innerHTML = '<p>Error al buscar películas.</p>';
        }
    });
});