const mostrador = document.querySelector(".mostrador-de-contenido");
const usuario_id = JSON.parse(localStorage.getItem("usuario_id"));

async function cargarSeriesDelUsuario() {
    try {
        const res = await fetch(`http://localhost:3000/api/usuarioSeries/${usuario_id}`);
        if (!res.ok) throw new Error("Error al obtener series");

        const series = await res.json();

        if (series.length === 0) {
            mostrador.innerHTML = '<p>Todavía no tenés películas agregadas.</p>';
            return;
        }

        mostrador.innerHTML = "";
        for (const s of series) {
            const resEstado = await fetch(`http://localhost:3000/api/estados/${s.estado}`);
            const estado = await resEstado.json();
            const div = document.createElement("div");
            div.classList.add("serie-item");
            div.innerHTML = `
            <section id="configuraciones">
                <label for="toggle-imagen"><img src="${s.imagen}" alt="${s.nombre_serie}" width="200"></label>
                <label for="toggle-titulo">Título: ${s.nombre_serie}</label>

                <label for="toggle-anio">Año: ${s.anio}</label>

                <label for="toggle-sinopsis">Sinopsis: ${s.sinopsis}</label>
               
                <label for="toggle-calificacion">Calificación: ${s.calificacion ?? 'Sin calificación'}</label>
                <input type="checkbox" id="toggle-calificacion">
                <div class="conf-input">
                    <label for="cambio-calificacion-${s.serie_id}">Nueva Calificación:</label>
                    <select id="cambio-calificacion-${s.serie_id}" name="cambio-calificacion-${s.serie_id}">
                        <option value="">Todavía no tengo una calificación</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                    <button id="cambiar-calificacion-${s.serie_id}">Cambiar</button>
                </div>

                <label for="toggle-estado">Estado: ${estado.nombre}</label>
                <input type="checkbox" id="toggle-estado">
                <div class="conf-input">
                    <label for="cambio-estado-${s.serie_id}">Nuevo Estado:</label>
                    <select id="cambio-estado-${s.serie_id}" name="cambio-estado-${s.serie_id}">
                        <option value="1">Pendiente</option>
                        <option value="2">Viendo</option>
                        <option value="3">Vista</option>
                    </select>
                    <button id="cambiar-estado-${s.serie_id}">Cambiar</button>
                </div>

                <div class="acciones-pelicula">
                    <button class="btn-eliminar-${s.serie_id}">Eliminar</button>
                </div>
                
            </section>
            `;

            console.log(s)

            async function actualizarUsuarioSerie(cambios) {
                const body = {
                    usuario_id: usuario_id,
                    serie_id: s.serie_id,
                    calificacion: s.calificacion,
                    estado: s.estado,
                    ...cambios
                };

                try {
                    const res = await fetch(`http://localhost:3000/api/usuarioSeries`, {
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

            mostrador.appendChild(div);

            div.querySelector(`.btn-eliminar-${s.serie_id}`).addEventListener("click", async () => {
                const confirmar = confirm("¿Estás seguro de que querés eliminar esta serie?");
                if (!confirmar) return;

                try {
                    const res = await fetch(`http://localhost:3000/api/usuarioSeries/${s.usuario_id}/${s.serie_id}`, {
                        method: "DELETE"
                    });
                    if (res.ok) {
                        alert("Serie eliminada correctamente.");
                        cargarSeriesDelUsuario();
                    } else {
                        alert("Error al eliminar la serie.");
                    }
                } catch (err) {
                    console.error(err);
                    alert("Error al conectar con el servidor.");
                }
            });

            document.getElementById(`cambiar-calificacion-${s.serie_id}`).addEventListener('click', () => {
                const nuevo = document.getElementById(`cambio-calificacion-${s.serie_id}`).value;
                actualizarUsuarioSerie({ calificacion: nuevo });
            });

            document.getElementById(`cambiar-estado-${s.serie_id}`).addEventListener('click', () => {
                const nuevo = document.getElementById(`cambio-estado-${s.serie_id}`).value;
                actualizarUsuarioSerie({ estado: nuevo });
            });

        }
    } catch (err) {
        console.error(err);
        mostrador.innerHTML = '<p>Error al cargar tus series</p>';
    }
}

cargarSeriesDelUsuario();