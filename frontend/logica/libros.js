const mostrador = document.querySelector(".mostrador-de-contenido");
const usuario_id = JSON.parse(localStorage.getItem("usuario_id"));

async function cargarLibrosDelUsuario() {
    try {
        const res = await fetch(`http://localhost:3000/api/usuarios_libros/${usuario_id}`);
        if (!res.ok) throw new Error("Error al obtener libros");

        const libros = await res.json();

        if (libros.length === 0) {
            mostrador.innerHTML = '<p>Todavía no tenés libros agregados.</p>';
            return;
        }

        mostrador.innerHTML = "";
        for (const l of libros) {
            const resEstado = await fetch(`http://localhost:3000/api/estados/${l.estado}`);
            const estado = await resEstado.json();
            const div = document.createElement("div");
            div.classList.add("libro-item");
            div.innerHTML = `
            <section id="configuraciones">
                <label for="toggle-imagen"><img src="${l.imagen}" alt="${l.nombre}" width="200"></label>
                <label for="toggle-titulo">Título: ${l.nombre}</label>

                <label for="toggle-anio">Año: ${l.anio}</label>

                <label for="toggle-sinopsis">Sinopsis: ${l.sinopsis}</label>
               
                <label for="toggle-calificacion">Calificación: ${l.calificacion ?? 'Sin calificación'}</label>
                <input type="checkbox" id="toggle-calificacion">
                <div class="conf-input">
                    <label for="cambio-calificacion">Nueva Calificación:</label>
                    <select id="cambio-calificacion" name="cambio-calificacion">
                        <option value="">Todavía no tengo una calificación</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                    <button id="cambiar-calificacion">Cambiar</button>
                </div>

                <label for="toggle-estado">Estado: ${estado.nombre}</label>
                <input type="checkbox" id="toggle-estado">
                <div class="conf-input">
                    <label for="cambio-estado">Nuevo Estado:</label>
                    <select id="cambio-estado" name="cambio-estado">
                        <option value="1">Pendiente</option>
                        <option value="2">Viendo</option>
                        <option value="3">Vista</option>
                    </select>
                    <button id="cambiar-estado">Cambiar</button>
                </div>

                <div class="acciones-libro">
                    <button class="btn-eliminar" data-id="${l.id}">Eliminar</button>
                </div>
                
            </section>
            `;

            async function actualizarUsuarioLibro(cambios) {
                const body = {
                    usuario_id: usuario_id,
                    libro_id: l.id,
                    calificacion: l.calificacion,
                    estado: l.estado,
                    ...cambios
                };

                try {
                    const res = await fetch(`http://localhost:3000/api/usuarios_libros`, {
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

            div.querySelector(".btn-eliminar").addEventListener("click", async () => {
                const confirmar = confirm("¿Estás seguro de que querés eliminar este libro?");
                if (!confirmar) return;

                try {
                    const res = await fetch(`http://localhost:3000/api/usuarios_libros`, {
                        method: "DELETE",
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ usuario_id: usuario_id, libro_id: l.id })
                    });
                    if (res.ok) {
                        alert("Libro eliminado correctamente.");
                        cargarLibrosDelUsuario();
                    } else {
                        alert("Error al eliminar la libro.");
                    }
                } catch (err) {
                    console.error(err);
                    alert("Error al conectar con el servidor.");
                }
            });

            mostrador.appendChild(div);

            document.getElementById('cambiar-calificacion').addEventListener('click', () => {
                const nuevo = document.getElementById('cambio-calificacion').value;
                actualizarUsuarioLibro({ calificacion: nuevo });
            });

            document.getElementById('cambiar-estado').addEventListener('click', () => {
                const nuevo = document.getElementById('cambio-estado').value;
                actualizarUsuarioLibro({ estado: nuevo });
            });

        }
    } catch (err) {
        console.error(err);
        mostrador.innerHTML = '<p>Error al cargar tus libros</p>';
    }
}

cargarLibrosDelUsuario();