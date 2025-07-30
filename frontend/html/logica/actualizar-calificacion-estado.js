const usuario_id = JSON.parse(sessionStorage.getItem("usuario_id"));

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pelicula_id = urlParams.get('id');

    const container = document.querySelector(".cuadro-de-ingreso");
    const boton = document.getElementById("actualizar-pelicula");

    let pelicula;

    if (pelicula_id) {
        try {
            const respuesta = await fetch(`http://localhost:3000/api/peliculas/${pelicula_id}`);
            if (respuesta.ok) {
                pelicula = await respuesta.json();

                document.getElementById("titulo").textContent = pelicula.nombre || '';

            } else if (respuesta.status === 404) {
                container.innerHTML = "<h2>La pelicula no existe</h2>";
                return;
            } else if (respuesta.status === 400) {
                container.innerHTML = "<h2>La id tiene que ser un numero entero positivo</h2>";
                return;
            } else {
                console.error(`Error al cargar película: ${respuesta.status} ${respuesta.statusText}`);
                container.innerHTML = `<h2>Error al cargar película: ${respuesta.statusText}</h2>`;
                boton.disabled = true;
                return;
            }
        } catch (error) {
            console.error("Error al cargar película:", error);
            container.innerHTML = `<p>Error de conexión o de servidor al cargar la película.</p>`;
            boton.disabled = true;
        }

        try {
            const respuesta = await fetch(`http://localhost:3000/api/usuarios_peliculas/${usuario_id}/${pelicula_id}`);
            usuario_pelicula = await respuesta.json();
            if (respuesta.ok) {
                document.getElementById("estado").value = usuario_pelicula.estado || '';
                document.getElementById("calificacion").value = usuario_pelicula.calificacion || '';

            } else if (respuesta.status === 404) {
                container.innerHTML = "<h2>No tenes la pelicula agregada</h2>";
                return;
            } else if (respuesta.status === 400) {
                alert(usuario_pelicula.error);
                return;
            } else {
                console.error(`Error al cargar película: ${respuesta.status} ${respuesta.statusText}`);
                container.innerHTML = `<h2>Error al cargar película: ${respuesta.statusText}</h2>`;
                boton.disabled = true;
                return;
            }
        } catch (err) {
            console.error(err);
            alert('Error al conectar con el servidor');
            return;
        }

        boton.addEventListener("click", async (e) => {
            e.preventDefault();

            const estado = document.getElementById("estado").value;
            const calificacion = document.getElementById("calificacion").value;

            try {
                const res = await fetch(`http://localhost:3000/api/usuarios_peliculas`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        usuario_id,
                        pelicula_id,
                        calificacion,
                        estado
                    })
                });

                const data = await res.json();
                if (res.ok) {
                    alert("Datos actualizados correctamente");
                    window.location.href = `peliculas.html`;
                } else {
                    alert(data.error || 'Error al actualizar');
                }
            } catch (err) {
                console.error(err);
                alert('Error al conectar con el servidor');
            }
        });
    } else {
        container.innerHTML = '<p>ID de película no proporcionado en la URL.</p>';
        boton.disabled = true;
    }
});