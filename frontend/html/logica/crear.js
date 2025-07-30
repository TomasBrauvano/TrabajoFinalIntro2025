const usuario_id = JSON.parse(sessionStorage.getItem("usuario_id"));

async function cargarCategorias() {
    try {
        const res = await fetch("http://localhost:3000/api/categorias");
        const categorias = await res.json();

        const select = document.getElementById("categorias");
        select.innerHTML = "";

        categorias.forEach(categoria => {
            const option = document.createElement("option");
            option.value = categoria.id;
            option.textContent = categoria.nombre;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar categorías:", error);
        const select = document.getElementById("categorias");
        select.innerHTML = `<option value="">No se pudieron cargar las categorías</option>`;
    }
}

async function cargarPlataformas() {
    try {
        const res = await fetch("http://localhost:3000/api/plataformas");
        const plataformas = await res.json();

        const select = document.getElementById("plataformas");
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

document.addEventListener("DOMContentLoaded", () => {
    cargarCategorias();
    cargarPlataformas();
    const boton = document.getElementById("crear");

    boton.addEventListener("click", async (e) => {
        e.preventDefault();

        const nombre = document.getElementById("titulo").value;
        const anio = document.getElementById("anio").value;
        const director = document.getElementById("director").value;
        const sinopsis = document.getElementById("sinopsis").value;
        const imagen = document.getElementById("url-imagen").value;
        const categoria = document.getElementById("categorias").value;
        const plataforma = document.getElementById("plataformas").value;
        const estado = document.getElementById("estado").value;
        const calificacion = document.getElementById("calificacion").value;
        const body = {
            nombre,
            anio,
            director,
            sinopsis,
            imagen,
            creador_id: usuario_id,
            categoria,
            plataforma,
            calificacion,
            estado
        }

        try {
            const respuesta = await fetch(`http://localhost:3000/api/peliculas/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body)
            });

            const data = await respuesta.json();

            if (respuesta.ok) {
                alert("Pelicula Creada correctamente");
                window.location.href = "index.html";
            } else {
                alert(`Error: ${data.error || "No se pudo crear la pelicula"}`);
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            alert("Error en el servidor");
        }
    });
});