const usuario_id = JSON.parse(localStorage.getItem("usuario_id"));

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

document.addEventListener("DOMContentLoaded", () => {
    cargarCategorias();
    const boton = document.getElementById("crear");

    boton.addEventListener("click", async (e) => {
        e.preventDefault();

        const tipo = document.getElementById("tipo-de-contenido").value;
        const nombre = document.getElementById("titulo").value;
        const anio = document.getElementById("anio").value;
        const director_autor = document.getElementById("director-autor").value;
        const sinopsis = document.getElementById("sinopsis").value;
        const imagen = document.getElementById("url-imagen").value;
        const categoria = document.getElementById("categorias").value;
        const estado = document.getElementById("estado").value;
        const calificacion = document.getElementById("calificacion").value;
        let body;

        if (tipo === "libro") {
            body = {
                nombre,
                anio,
                autor: director_autor,
                sinopsis,
                imagen,
                creador_id: usuario_id,
                categoria,
                calificacion,
                estado
            }
        } else {
            body = {
                nombre,
                anio,
                director: director_autor,
                sinopsis,
                imagen,
                creador_id: usuario_id,
                categoria,
                calificacion,
                estado
            }
        }

        try {
            console.log(`http://localhost:3000/api/${tipo}s/`)
            const respuesta = await fetch(`http://localhost:3000/api/${tipo}s/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body)
            });

            const data = await respuesta.json();

            if (respuesta.ok) {
                alert("Creado correctamente");
                window.location.href = "index.html";
            } else {
                alert(`Error: ${data.error || "No se pudo crear"}`);
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            alert("Error en el servidor");
        }
    });
});