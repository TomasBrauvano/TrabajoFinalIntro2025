const usuario_id = localStorage.getItem("usuario_id");
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
                const esCreador = parseInt(usuario_id) === s.creador_id;
                div.classList.add('serie-item');
                div.innerHTML = `
                <section id="configuraciones">
                <label for="toggle-imagen"><img src="${s.imagen}" alt="${s.nombre}" width="200"></label>
                ${esCreador ? `    
                    <input type="checkbox" id="toggle-imagen">
                    <div class="conf-input">
                        <label for="cambio-imagen-${s.id}">URL Imagen Nueva:</label>
                        <input type="text" id="cambio-imagen-${s.id}" name="cambio-imagen-${s.id}">
                        <button id="cambiar-imagen-${s.id}">Cambiar</button>
                    </div>
                    `: ''}  
                <label for="toggle-titulo">Título: ${s.nombre}</label>
                ${esCreador ? `
                    <input type="checkbox" id="toggle-titulo">
                <div class="conf-input">
                    <label for="cambio-titulo-${s.id}">Título Nuevo:</label>
                    <input type="text" id="cambio-titulo-${s.id}" name="cambio-titulo-${s.id}">
                    <button id="cambiar-titulo-${s.id}">Cambiar</button>
                </div>
                    `: ''}

                <label for="toggle-anio">Año: ${s.anio}</label>
                ${esCreador ? `
                    <input type="checkbox" id="toggle-anio">
                    <div class="conf-input">
                        <label for="cambio-anio-${s.id}">Año Nuevo:</label>
                        <input type="text" id="cambio-anio-${s.id}" name="cambio-anio-${s.id}">
                        <button id="cambiar-anio-${s.id}">Cambiar</button>
                    </div>
                    `: ''}

                <label for="toggle-director">Director: ${s.director}</label>
                ${esCreador ? `
                    <input type="checkbox" id="toggle-director">
                    <div class="conf-input">
                        <label for="cambio-director-${s.id}">Director Nuevo:</label>
                        <input type="text" id="cambio-director-${s.id}" name="cambio-director-${s.id}">
                        <button id="cambiar-director-${s.id}">Cambiar</button>
                    </div>
                    `: ''}    

                <label for="toggle-sinopsis">Sinopsis: ${s.sinopsis}</label>
                ${esCreador ? `    
                    <input type="checkbox" id="toggle-sinopsis">
                    <div class="conf-input">
                        <label for="cambio-sinopsis-${s.id}">Sinopsis Nueva:</label>
                        <textarea id="cambio-sinopsis-${s.id}" name="cambio-sinopsis-${s.id}"></textarea>
                        <button id="cambiar-sinopsis-${s.id}">Cambiar</button>
                    </div>
                    `: ''}

                <div class="acciones-libro">
                    <button class="boton-agregar-${s.id}">Agregar</button>
                </div>
                
            </section>
            `;
                mostrador.appendChild(div);

                async function actualizarSerie(cambios) {
                    const body = {
                        nombre: s.nombre,
                        anio: s.anio,
                        director: s.director,
                        sinopsis: s.sinopsis,
                        imagen: s.imagen,
                        creador_id: usuario_id,
                        categoria: s.categoria,
                        ...cambios
                    };

                    try {
                        const res = await fetch(`http://localhost:3000/api/series/${s.id}`, {
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

                document.getElementById(`cambiar-imagen-${s.id}`).addEventListener('click', () => {
                    const nuevo = document.getElementById(`cambio-imagen-${s.id}`).value;
                    actualizarSerie({ imagen: nuevo });
                });

                document.getElementById(`cambiar-titulo-${s.id}`).addEventListener('click', () => {
                    const nuevo = document.getElementById(`cambio-titulo-${s.id}`).value;
                    actualizarSerie({ nombre: nuevo });
                });

                document.getElementById(`cambiar-anio-${s.id}`).addEventListener('click', () => {
                    const nuevo = document.getElementById(`cambio-anio-${s.id}`).value;
                    actualizarSerie({ anio: nuevo });
                });

                document.getElementById(`cambiar-director-${s.id}`).addEventListener('click', () => {
                    const nuevo = document.getElementById(`cambio-director-${s.id}`).value;
                    actualizarSerie({ director: nuevo });
                });

                document.getElementById(`cambiar-sinopsis-${s.id}`).addEventListener('click', () => {
                    const nuevo = document.getElementById(`cambio-sinopsis-${s.id}`).value;
                    actualizarSerie({ sinopsis: nuevo });
                });

                document.querySelector(`.boton-agregar-${s.id}`).addEventListener("click", async () => {

                    try {
                        const response = await fetch(`http://localhost:3000/api/usuarioSeries`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                usuario_id: usuario_id,
                                serie_id: s.id,
                                calificacion: "",
                                estado: "1"
                            })
                        });

                        if (response.ok) {
                            alert(`"${s.nombre}" se agrego a tu perfil de series.`);
                            location.reload();
                        } else {
                            const errorData = await response.json();
                            alert(`Ya tenes agregada la serie: ${s.nombre}`);
                        }
                    } catch (error) {
                        console.error("Error al enviar la solicitud para agregar:", error);
                        alert("Ocurrió un error en el servidor.");
                    }
                });

            });

        } catch (err) {
            console.error(err);
            mostrador.innerHTML = '<p>Error al buscar series.</p>';
        }
    });
});