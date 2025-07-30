const usuario_id = JSON.parse(localStorage.getItem("usuario_id"));

async function cargarCategorias() {
    try {
        const res = await fetch("http://localhost:3000/api/categorias");
        const categorias = await res.json();

        const select = document.getElementById("categoria");
        select.innerHTML = "";

        categorias.forEach(categoria => {
            const option = document.createElement("option");
            option.value = categoria.id;
            option.textContent = categoria.nombre;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar categorías:", error);
        const select = document.getElementById("categoria");
        select.innerHTML = `<option value="">No se pudieron cargar las categorías</option>`;
    }
}

async function cargarPlataformas() {
    try {
        const res = await fetch("http://localhost:3000/api/plataformas");
        const plataformas = await res.json();

        const select = document.getElementById("plataforma");
        select.innerHTML = "";

        const optionNula = document.createElement("option");
        optionNula.value = "";
        optionNula.textContent = "No se encuentra en ninguna de estas plataformas";
        select.appendChild(optionNula);

        plataformas.forEach(plataforma => {
            const option = document.createElement("option");
            option.value = plataforma.id;
            option.textContent = plataforma.nombre;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar plataformas:", error);
        const select = document.getElementById("plataformas");
        select.innerHTML = `<option value="">No se pudieron cargar las plataformas</option>`;
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pelicula_id = urlParams.get('id');

    await cargarCategorias();
    await cargarPlataformas();

    const container = document.querySelector(".cuadro-de-ingreso");
    const boton = document.getElementById("actualizar-pelicula");

    let pelicula;

    if (pelicula_id) {
        try {
            const respuesta = await fetch(`http://localhost:3000/api/peliculas/${pelicula_id}`);
            if (respuesta.ok) {
                pelicula = await respuesta.json();

                document.getElementById("nombre").value = pelicula.nombre || '';
                document.getElementById("anio").value = pelicula.anio || '';
                document.getElementById("director").value = pelicula.director || '';
                document.getElementById("sinopsis").value = pelicula.sinopsis || '';
                document.getElementById("imagen").value = pelicula.imagen || '';

                const categoriaSelect = document.getElementById("categoria");
                categoriaSelect.value = pelicula.categoria;

                const plataformaSelect = document.getElementById("plataforma");
                plataformaSelect.value = pelicula.plataforma;

            } else if (respuesta.status === 404) {
                container.innerHTML = "<h2>La pelicula no existe</h2>";
            } else if (respuesta.status === 400) {
                container.innerHTML = "<h2>La id tiene que ser un numero entero positivo</h2>";
            } else {
                console.error(`Error al cargar película: ${respuesta.status} ${respuesta.statusText}`);
                container.innerHTML = `<h2>Error al cargar película: ${respuesta.statusText}</h2>`;
                boton.disabled = true;
            }
        } catch (error) {
            console.error("Error al cargar película:", error);
            container.innerHTML = `<p>Error de conexión o de servidor al cargar la película.</p>`;
            boton.disabled = true;
        }

        boton.addEventListener("click", async (e) => {
            e.preventDefault();

            if (!pelicula) {
                alert("No se pudo obtener la información original de la película para actualizar.");
                return;
            }

            const nombre = document.getElementById("nombre").value;
            const anio = document.getElementById("anio").value;
            const director = document.getElementById("director").value;
            const sinopsis = document.getElementById("sinopsis").value;
            const imagen = document.getElementById("imagen").value;
            const categoria = document.getElementById("categoria").value;
            const plataforma = document.getElementById("plataforma").value;

            try {
                const res = await fetch(`http://localhost:3000/api/peliculas/${pelicula_id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        nombre: nombre || pelicula.nombre,
                        anio: anio || pelicula.anio,
                        director: director || pelicula.director,
                        sinopsis: sinopsis || pelicula.sinopsis,
                        imagen: imagen || pelicula.imagen,
                        creador_id: usuario_id,
                        categoria: categoria,
                        plataforma: plataforma
                    }),
                });

                const data = await res.json();

                if (res.ok) {
                    alert("Pelicula actualizada correctamente");
                    window.location.href = "index.html";
                } else {
                    alert(`Error: ${data.error || 'Error desconocido'}`);
                }
            } catch (error) {
                console.error("Error en la solicitud PUT:", error);
                alert("Error en el servidor al actualizar la película.");
            }
        });
    } else {
        container.innerHTML = '<p>ID de película no proporcionado en la URL.</p>';
        boton.disabled = true;
    }
});