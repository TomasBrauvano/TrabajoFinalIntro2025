const usuario_id = localStorage.getItem("usuario_id");
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
                const esCreador = parseInt(usuario_id) === l.creador_id;
                div.classList.add('libro-item');
                div.innerHTML = `
                <section id="configuraciones">
                <label for="toggle-imagen"><img src="${l.imagen}" alt="${l.nombre}" width="200"></label>
                ${esCreador ? `    
                    <input type="checkbox" id="toggle-imagen">
                    <div class="conf-input">
                        <label for="cambio-imagen-${l.id}">URL Imagen Nueva:</label>
                        <input type="text" id="cambio-imagen-${l.id}" name="cambio-imagen-${l.id}">
                        <button id="cambiar-imagen-${l.id}">Cambiar</button>
                    </div>
                    `: ''}  
                <label for="toggle-titulo">Título: ${l.nombre}</label>
                ${esCreador ? `
                    <input type="checkbox" id="toggle-titulo">
                <div class="conf-input">
                    <label for="cambio-titulo-${l.id}">Título Nuevo:</label>
                    <input type="text" id="cambio-titulo-${l.id}" name="cambio-titulo-${l.id}">
                    <button id="cambiar-titulo-${l.id}">Cambiar</button>
                </div>
                    `: ''}

                <label for="toggle-anio">Año: ${l.anio}</label>
                ${esCreador ? `
                    <input type="checkbox" id="toggle-anio">
                    <div class="conf-input">
                        <label for="cambio-anio-${l.id}">Año Nuevo:</label>
                        <input type="text" id="cambio-anio-${l.id}" name="cambio-anio-${l.id}">
                        <button id="cambiar-anio-${l.id}">Cambiar</button>
                    </div>
                    `: ''}

                <label for="toggle-autor">Autor: ${l.autor}</label>
                ${esCreador ? `
                    <input type="checkbox" id="toggle-autor">
                    <div class="conf-input">
                        <label for="cambio-autor-${l.id}">Autor Nuevo:</label>
                        <input type="text" id="cambio-autor-${l.id}" name="cambio-autor-${l.id}">
                        <button id="cambiar-autor-${l.id}">Cambiar</button>
                    </div>
                    `: ''}    

                <label for="toggle-sinopsis">Sinopsis: ${l.sinopsis}</label>
                ${esCreador ? `    
                    <input type="checkbox" id="toggle-sinopsis">
                    <div class="conf-input">
                        <label for="cambio-sinopsis-${l.id}">Sinopsis Nueva:</label>
                        <textarea id="cambio-sinopsis-${l.id}" name="cambio-sinopsis-${l.id}"></textarea>
                        <button id="cambiar-sinopsis-${l.id}">Cambiar</button>
                    </div>
                    `: ''}

                <div class="acciones-libro">
                    <button class="boton-agregar-${l.id}">Agregar</button>
                    ${esCreador ? `
                    <button class="boton-eliminar-${l.id}">Eliminar</button>
                    `: ''}
                </div>
                
            </section>
            `;

                mostrador.appendChild(div);

                async function actualizarLibro(cambios) {
                    const body = {
                        nombre: l.nombre,
                        anio: l.anio,
                        autor: l.autor,
                        sinopsis: l.sinopsis,
                        imagen: l.imagen,
                        creador_id: usuario_id,
                        categoria: l.categoria,
                        ...cambios
                    };

                    try {
                        const res = await fetch(`http://localhost:3000/api/libros/${l.id}`, {
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

                if (esCreador) {
                    document.getElementById(`cambiar-imagen-${l.id}`).addEventListener('click', () => {
                        const nuevo = document.getElementById(`cambio-imagen-${l.id}`).value;
                        actualizarLibro({ imagen: nuevo });
                    });

                    document.getElementById(`cambiar-titulo-${l.id}`).addEventListener('click', () => {
                        const nuevo = document.getElementById(`cambio-titulo-${l.id}`).value;
                        actualizarLibro({ nombre: nuevo });
                    });

                    document.getElementById(`cambiar-anio-${l.id}`).addEventListener('click', () => {
                        const nuevo = document.getElementById(`cambio-anio-${l.id}`).value;
                        actualizarLibro({ anio: nuevo });
                    });

                    document.getElementById(`cambiar-autor-${l.id}`).addEventListener('click', () => {
                        const nuevo = document.getElementById(`cambio-autor-${l.id}`).value;
                        actualizarLibro({ autor: nuevo });
                    });

                    document.getElementById(`cambiar-sinopsis-${l.id}`).addEventListener('click', () => {
                        const nuevo = document.getElementById(`cambio-sinopsis-${l.id}`).value;
                        actualizarLibro({ sinopsis: nuevo });
                    });

                    document.querySelector(`.boton-eliminar-${l.id}`).addEventListener("click", async () => {
                        const confirmar = confirm('¿Estás seguro de que quieres eliminar este libro?');
                        if (!confirmar) return;

                        try {
                            const response = await fetch(`http://localhost:3000/api/libros/${l.id}`, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            });

                            if (response.ok) {
                                alert(`"${l.nombre}" se eliminó.`);
                                location.reload();
                            } else {
                                const errorData = await response.json();
                                alert(errorData.error || `Error al eliminar el libro: ${l.nombre}`);
                            }
                        } catch (error) {
                            console.error("Error al enviar la solicitud para eliminar:", error);
                            alert("Ocurrio un error en el servidor");
                        }
                    });
                }



                document.querySelector(`.boton-agregar-${l.id}`).addEventListener("click", async () => {

                    try {
                        const response = await fetch(`http://localhost:3000/api/usuarios_libros`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                usuario_id: usuario_id,
                                libro_id: l.id,
                                calificacion: "",
                                estado: "1"
                            })
                        });

                        if (response.ok) {
                            alert(`"${l.nombre}" se agrego a tu perfil de libros.`);
                            location.reload();
                        } else {
                            const errorData = await response.json();
                            alert(`Ya tenes agregado el libro: ${l.nombre}`);
                        }
                    } catch (error) {
                        console.error("Error al enviar la solicitud para agregar:", error);
                        alert("Ocurrió un error en el servidor.");
                    }
                });



            });

        } catch (err) {
            console.error(err);
            mostrador.innerHTML = '<p>Error al buscar libros.</p>';
        }
    });
});