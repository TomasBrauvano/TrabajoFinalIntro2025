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

            peliculas.forEach(p => {
                const div = document.createElement('div');
                const esCreador = parseInt(usuario_id) === p.creador_id;
                div.classList.add('pelicula-item');
                div.innerHTML = `
                <section id="configuraciones">
                <label for="toggle-imagen"><img src="${p.imagen}" alt="${p.nombre}" width="200"></label>
                ${esCreador ? `    
                    <input type="checkbox" id="toggle-imagen">
                    <div class="conf-input">
                        <label for="cambio-imagen-${p.id}">URL Imagen Nueva:</label>
                        <input type="text" id="cambio-imagen-${p.id}" name="cambio-imagen-${p.id}">
                        <button id="cambiar-imagen-${p.id}">Cambiar</button>
                    </div>
                    `: ''}  
                <label for="toggle-titulo">Título: ${p.nombre}</label>
                ${esCreador ? `
                    <input type="checkbox" id="toggle-titulo">
                <div class="conf-input">
                    <label for="cambio-titulo-${p.id}">Título Nuevo:</label>
                    <input type="text" id="cambio-titulo-${p.id}" name="cambio-titulo-${p.id}">
                    <button id="cambiar-titulo-${p.id}">Cambiar</button>
                </div>
                    `: ''}

                <label for="toggle-anio">Año: ${p.anio}</label>
                ${esCreador ? `
                    <input type="checkbox" id="toggle-anio">
                    <div class="conf-input">
                        <label for="cambio-anio-${p.id}">Año Nuevo:</label>
                        <input type="text" id="cambio-anio-${p.id}" name="cambio-anio-${p.id}">
                        <button id="cambiar-anio-${p.id}">Cambiar</button>
                    </div>
                    `: ''}

                <label for="toggle-director">Director: ${p.director}</label>
                ${esCreador ? `
                    <input type="checkbox" id="toggle-director">
                    <div class="conf-input">
                        <label for="cambio-director-${p.id}">Director Nuevo:</label>
                        <input type="text" id="cambio-director-${p.id}" name="cambio-director-${p.id}">
                        <button id="cambiar-director-${p.id}">Cambiar</button>
                    </div>
                    `: ''}    

                <label for="toggle-sinopsis">Sinopsis: ${p.sinopsis}</label>
                ${esCreador ? `    
                    <input type="checkbox" id="toggle-sinopsis">
                    <div class="conf-input">
                        <label for="cambio-sinopsis-${p.id}">Sinopsis Nueva:</label>
                        <textarea id="cambio-sinopsis-${p.id}" name="cambio-sinopsis-${p.id}"></textarea>
                        <button id="cambiar-sinopsis-${p.id}">Cambiar</button>
                    </div>
                    `: ''}   

                <div class="acciones-libro">
                    <button class="boton-agregar-${p.id}">Agregar</button>
                </div>
                
            </section>
            `;
                mostrador.appendChild(div);

                async function actualizarPelicula(cambios) {
                    const body = {
                        nombre: p.nombre,
                        anio: p.anio,
                        director: p.director,
                        sinopsis: p.sinopsis,
                        imagen: p.imagen,
                        creador_id: usuario_id,
                        categoria: p.categoria,
                        ...cambios
                    };

                    try {
                        const res = await fetch(`http://localhost:3000/api/peliculas/${p.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(body)
                        });

                        const data = await res.json();
                        if (res.ok) {
                            alert("Datos actualizados correctamente");
                            location.reload();
                        } else {
                            alert(data.error || 'Error al actualizar');
                        }
                    } catch (err) {
                        console.error(err);
                        alert('Error al conectar con el servidor');
                    }
                }

                document.getElementById(`cambiar-imagen-${p.id}`).addEventListener('click', () => {
                    const nuevo = document.getElementById(`cambio-imagen-${p.id}`).value;
                    actualizarPelicula({ imagen: nuevo });
                });

                document.getElementById(`cambiar-titulo-${p.id}`).addEventListener('click', () => {
                    const nuevo = document.getElementById(`cambio-titulo-${p.id}`).value;
                    actualizarPelicula({ nombre: nuevo });
                });

                document.getElementById(`cambiar-anio-${p.id}`).addEventListener('click', () => {
                    const nuevo = document.getElementById(`cambio-anio-${p.id}`).value;
                    actualizarPelicula({ anio: nuevo });
                });

                document.getElementById(`cambiar-director-${p.id}`).addEventListener('click', () => {
                    const nuevo = document.getElementById(`cambio-director-${p.id}`).value;
                    actualizarPelicula({ director: nuevo });
                });

                document.getElementById(`cambiar-sinopsis-${p.id}`).addEventListener('click', () => {
                    const nuevo = document.getElementById(`cambio-sinopsis-${p.id}`).value;
                    actualizarPelicula({ sinopsis: nuevo });
                });

                document.querySelector(`.boton-agregar-${p.id}`).addEventListener("click", async () => {

                    try {
                        const response = await fetch(`http://localhost:3000/api/usuarios_peliculas`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                usuario_id: usuario_id,
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
                            alert(`Ya tenes agregada la pelicula: ${p.nombre}`);
                        }
                    } catch (error) {
                        console.error("Error al enviar la solicitud para agregar:", error);
                        alert("Ocurrió un error en el servidor.");
                    }
                });
            });

        } catch (err) {
            console.error(err);
            mostrador.innerHTML = '<p>Error al buscar películas.</p>';
        }
    });
});