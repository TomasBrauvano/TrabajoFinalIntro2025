async function cargarRecomendaciones(usuario_id) {
    try {
        const res = await fetch(`http://localhost:3000/api/recomendaciones/${usuario_id}`);
        const data = await res.json();

        const contenedor = document.getElementById("horizontal-1");
        contenedor.innerHTML = "";

        const recomendaciones = [];
        if (data.length > 0) {
            data.forEach((pelicula) => recomendaciones.push(pelicula))
        }
        console.log(recomendaciones)

        if (recomendaciones.length > 0) {
            recomendaciones.forEach(pelicula => {
                const tarjeta = document.createElement("div");
                tarjeta.classList.add(`pelicula`);
                tarjeta.id = pelicula.id

                tarjeta.addEventListener("click", () => {
                    window.location.href = `pelicula.html?id=${pelicula.id}`
                })

                const imagen = document.createElement("img");
                imagen.src = pelicula.imagen;
                imagen.alt = pelicula.nombre;

                const titulo = document.createElement("h3");
                titulo.textContent = pelicula.nombre;

                const botonAgregar = document.createElement("button");
                botonAgregar.textContent = "Agregar";
                botonAgregar.classList.add("boton-agregar");

                botonAgregar.addEventListener("click", async (event) => {
                    event.stopPropagation();
                    const pelicula_id = pelicula.id;

                    try {
                        const response = await fetch(`http://localhost:3000/api/usuarios_peliculas`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                usuario_id,
                                pelicula_id,
                                calificacion: "",
                                estado: "1"
                            })
                        });

                        if (response.ok) {
                            alert(`"${pelicula.nombre}" se agrego a tu perfil de peliculas.`);
                            location.reload();
                        } else {
                            const errorData = await response.json();
                            alert(`Error al agregar "${pelicula.nombre}": ${errorData.message || response.statusText}`);
                        }
                    } catch (error) {
                        console.error("Error al enviar la solicitud para agregar:", error);
                        alert("Ocurrió un error de red al intentar agregar la recomendación.");
                    }
                });

                tarjeta.appendChild(imagen);
                tarjeta.appendChild(botonAgregar);
                tarjeta.appendChild(titulo);
                contenedor.appendChild(tarjeta);
            });

        } else {
            contenedor.innerHTML = "<p>No hay recomendaciones para tu categoria preferida.<p>";
        }
    } catch (err) {
        console.error("Error al cargar las recomendaciones", err);
        const contenedor = document.getElementById("horizontal-1");
        contenedor.innerHTML = "<p>Ha ocurrido un error al cargar las recomendaciones.</p>";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const usuario_id = localStorage.getItem("usuario_id");
    const btnLogin = document.getElementById("btn-login");
    const btnRegister = document.getElementById("btn-register");
    const elementosLogueado = document.querySelectorAll(".logeado");
    const logoutLink = document.getElementById("logoutLink");

    if (usuario_id) {
        btnLogin.style.display = "none";
        btnRegister.style.display = "none";

        elementosLogueado.forEach(el => el.style.display = "list-item");

        cargarRecomendaciones(usuario_id);
    } else {
        elementosLogueado.forEach(el => el.style.display = "none");
    }
    if (logoutLink) {
        logoutLink.addEventListener("click", (event) => {
            event.preventDefault();

            localStorage.clear();

            location.reload();
        });
    }
});