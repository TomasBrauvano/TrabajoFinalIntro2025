async function cargarRecomendaciones(usuario_id) {
    try {
        const res = await fetch(`http://localhost:3000/api/recomendaciones/${usuario_id}`);
        const data = await res.json();

        const contenedor = document.getElementById("horizontal-1");
        contenedor.innerHTML = "";

        const recomendaciones = [];

        if (data.pelicula) recomendaciones.push({ ...data.pelicula, tipo: 'Pelicula' });
        if (data.serie) recomendaciones.push({ ...data.serie, tipo: 'Serie' });
        if (data.libro) recomendaciones.push({ ...data.libro, tipo: 'Libro' });

        if (recomendaciones.length > 0) {
            recomendaciones.forEach(item => {
                const tarjeta = document.createElement("div");
                tarjeta.classList.add("tarjeta");

                const imagen = document.createElement("img");
                imagen.src = item.imagen;
                imagen.alt = item.nombre;
                imagen.classList.add("recomendacion-imagen");

                const titulo = document.createElement("p");
                titulo.classList.add("recomendacion-titulo");
                titulo.textContent = item.nombre;

                const botonAgregar = document.createElement("button");
                botonAgregar.textContent = "Agregar";
                botonAgregar.classList.add("boton-agregar");

                botonAgregar.addEventListener("click", async () => {
                    const itemId = item.id;
                    const itemTipo = item.tipo;

                    let endpoint = '';
                    switch (itemTipo) {
                        case 'Pelicula':
                            endpoint = 'api/usuarios_peliculas';
                            break;
                        case 'Serie':
                            endpoint = 'api/usuarioSeries';
                            break;
                        case 'Libro':
                            endpoint = 'api/usuarios_libros';
                            break;
                        default:
                            console.error("Tipo de recomendación desconocido:", itemTipo);
                            alert("No se pudo agregar la recomendación: tipo desconocido.");
                            return;
                    }

                    try {
                        const response = await fetch(`http://localhost:3000/${endpoint}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                usuario_id: usuario_id,
                                [`${itemTipo.toLowerCase()}_id`]: itemId,
                                calificacion: "",
                                estado: "1"
                            })
                        });

                        if (response.ok) {
                            alert(`"${item.nombre}" se agrego a tu perfil de ${itemTipo}s.`);
                            location.reload();
                            botonAgregar.textContent = "Agregado";
                            botonAgregar.disabled = true;
                        } else {
                            const errorData = await response.json();
                            alert(`Error al agregar "${item.nombre}": ${errorData.message || response.statusText}`);
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

    if (usuario_id) {
        btnLogin.style.display = "none";
        btnRegister.style.display = "none";

        elementosLogueado.forEach(el => el.style.display = "list-item");

        cargarRecomendaciones(usuario_id);
    } else {
        elementosLogueado.forEach(el => el.style.display = "none");
    }
});