const mostrador = document.querySelector(".mostrador-de-contenido");
const usuario_id = JSON.parse(localStorage.getItem("usuario_id"));

async function cargarPeliculasDelUsuario() {
    try {
        const res = await fetch(`http://localhost:3000/api/usuarios_peliculas/${usuario_id}`);
        if (!res.ok) throw new Error("Error al obtener películas");

        const peliculas = await res.json();

        if (peliculas.length === 0) {
            mostrador.innerHTML = '<p>Todavía no tenés películas agregadas.</p>';
            return;
        }

        mostrador.innerHTML = "";
        for (const p of peliculas) {
            const resEstado = await fetch(`http://localhost:3000/api/estados/${p.estado}`);
            const estado = await resEstado.json();
            const div = document.createElement("div");
            div.classList.add("pelicula-item");
            div.addEventListener("click", () => {
                window.location.href = `pelicula.html?id=${p.id}`
            })
            div.innerHTML = `
                <img src="${p.imagen}" alt="${p.nombre}" width="200">
                <h3>${p.nombre}</h3>
                <button class="btn-desagregar" data-id="${p.id}">Desagregar</button>
            `;

            div.querySelector(".btn-desagregar").addEventListener("click", async (event) => {
                event.stopPropagation();
                const confirmar = confirm("¿Estás seguro de que querés desagregar esta película de tu lista?");
                if (!confirmar) return;

                try {
                    const res = await fetch(`http://localhost:3000/api/usuarios_peliculas`, {
                        method: "DELETE",
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ usuario_id: usuario_id, pelicula_id: p.id })
                    });
                    if (res.ok) {
                        alert("Película desagregada correctamente.");
                        cargarPeliculasDelUsuario();
                    } else {
                        alert("Error al desagregar la película.");
                    }
                } catch (err) {
                    console.error(err);
                    alert("Error al conectar con el servidor.");
                }
            });

            mostrador.appendChild(div);

        }
    } catch (err) {
        console.error(err);
        mostrador.innerHTML = '<p>Error al cargar tus películas</p>';
    }
}

cargarPeliculasDelUsuario();