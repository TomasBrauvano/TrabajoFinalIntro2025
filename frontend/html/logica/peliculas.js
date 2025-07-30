const mostrador = document.querySelector(".mostrador-de-contenido");
const usuario_id = JSON.parse(localStorage.getItem("usuario_id"));
const listaDeContenido = document.querySelector(".lista-de-contenido");

const btnCrear = document.createElement("button");
btnCrear.textContent = "Crear Pelicula";
btnCrear.classList.add("boton-crear")

btnCrear.addEventListener("click", () => {
    window.location.href = "crear.html"
})

listaDeContenido.appendChild(btnCrear)

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
            const div = document.createElement("div");
            div.classList.add("pelicula");
            div.addEventListener("click", () => {
                window.location.href = `pelicula.html?id=${p.id}`
            })
            div.innerHTML = `
                <h3>${p.nombre}</h3>
                <img src="${p.imagen}" alt="${p.nombre}" width="200">
                <div class="personal">
                <div class="estado-pelicula">
                <span class="circulo-estado"></span>
                <span>${p.estado_nombre}</span>
                </div>
                ${p.calificacion ? `
                <div class="calificacion-pelicula">
                <span>${p.calificacion}</span>
                <span class="star"></span>
                </div>
                ` : ''}
                <div class="container-logo-actualizar">
                <img src="https://cdn-icons-png.flaticon.com/512/45/45406.png" class="logo-actualizar">
                </div>
                </div>
                <button class="btn-desagregar" data-id="${p.id}">Desagregar</button>
            `;

            const circulo = div.querySelector(".circulo-estado");
            const estadoPelicula = div.querySelector(".estado-pelicula");
            const logoActualizar = div.querySelector(".container-logo-actualizar");

            switch (p.estado_nombre) {
                case "pendiente":
                    circulo.style = "background-color: #fd7e14;"
                    break
                case "viendo":
                    circulo.style = "background-color: #007bff;"
                    break
                case "vista":
                    circulo.style = "background-color: #28a745;"
                    break
            }

            if (!p.calificacion) {
                estadoPelicula.style.border = "none"
            }

            logoActualizar.addEventListener("click", async (event) => {
                event.stopPropagation();
                window.location.href = `actualizar-calificacion-estado.html?id=${p.id}`
            });

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