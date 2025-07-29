const mostrador = document.querySelector(".mostrador-de-contenido");
const usuario_id = JSON.parse(localStorage.getItem("usuario_id"));
const titulo = document.getElementById("titulo-plataforma");

async function cargarPeliculasDelUsuario() {
    const urlParams = new URLSearchParams(window.location.search);
    const plataforma_id = urlParams.get('id');

    if (plataforma_id) {
        try {
            const res = await fetch(`http://localhost:3000/api/peliculas/plataformas/${plataforma_id}`);
            const peliculas = await res.json();
            if (!res.ok) return alert(peliculas.error);

            if (peliculas.length === 0) {
                mostrador.innerHTML = '<p>Esta plataforma no tiene peliculas.</p>';
                return;
            }

            console.log(peliculas)

            titulo.textContent = `Peliculas de ${peliculas[0].nombre_plataforma}`;

            mostrador.innerHTML = "";

            for (const p of peliculas) {
                console.log(p)
                const div = document.createElement('div');
                div.addEventListener("click", () => {
                    window.location.href = `pelicula.html?id=${p.pelicula_id}`
                })
                let noAgregada = true;
                const pRes = await fetch(`http://localhost:3000/api/usuarios_peliculas/${usuario_id}/${p.pelicula_id}`);
                if (pRes.ok) {
                    noAgregada = false;
                }
                div.classList.add('pelicula-plataforma');
                div.innerHTML = `
                    <img src="${p.imagen}" alt="${p.nombre_pelicula}">
                    <h3>${p.nombre_pelicula}</h3>
                    ${noAgregada ? `
                    <button class="boton-agregar">Agregar</button>
                    `: ''}
                `;

                if (noAgregada) {
                    div.querySelector(`.boton-agregar`).addEventListener("click", async (event) => {
                        event.stopPropagation();

                        try {
                            const response = await fetch(`http://localhost:3000/api/usuarios_peliculas`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    usuario_id,
                                    pelicula_id: p.pelicula_id,
                                    calificacion: "",
                                    estado: "1"
                                })
                            });

                            if (response.ok) {
                                alert(`"${p.nombre_pelicula}" se agrego a tu perfil de peliculas.`);
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
                mostrador.appendChild(div);
            };
        } catch (err) {
            console.error(err);
            mostrador.innerHTML = '<p>Error al cargar tus películas</p>';
        }
    }

}

cargarPeliculasDelUsuario();