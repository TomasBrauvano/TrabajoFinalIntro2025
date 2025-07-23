async function cargarCategorias() {
    try {
        const res = await fetch("http://localhost:3000/api/categorias");
        const categorias = await res.json();

        const select = document.getElementById("categoria_preferida");
        select.innerHTML = "";

        categorias.forEach(categoria => {
            const option = document.createElement("option");
            option.value = categoria.id;
            option.textContent = categoria.nombre;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar categorías:", error);
        const select = document.getElementById("categoria_preferida");
        select.innerHTML = `<option value="">No se pudieron cargar las categorías</option>`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    cargarCategorias();
    const boton = document.getElementById("crear-cuenta");

    boton.addEventListener("click", async (e) => {
        e.preventDefault();

        const nombre_usuario = document.getElementById("nombreusuario").value;
        const nombre = document.getElementById("nombre").value;
        const apellido = document.getElementById("apellido").value;
        const contrasenia = document.getElementById("contrasenia").value;
        const confirmar = document.getElementById("confirmar_contrasenia").value;
        const categoria_preferida = document.getElementById("categoria_preferida").value;

        if (contrasenia !== confirmar) {
            alert("Las contraseñas no coinciden");
            return;
        }

        console.log(categoria_preferida)

        try {
            const respuesta = await fetch("http://localhost:3000/api/usuarios/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre_usuario,
                    nombre,
                    apellido,
                    contrasenia,
                    categoria_preferida: categoria_preferida
                }),
            });

            const data = await respuesta.json();

            if (respuesta.ok) {
                alert("Usuario registrado correctamente");
                window.location.href = "login.html";
            } else {
                alert(`Error: ${data.error || "No se pudo crear el usuario"}`);
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            alert("Error en el servidor");
        }
    });
});