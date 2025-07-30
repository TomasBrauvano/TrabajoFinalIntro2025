const usuario_id = JSON.parse(sessionStorage.getItem("usuario_id"));

document.addEventListener("DOMContentLoaded", () => {
    const boton = document.getElementById("crear");

    boton.addEventListener("click", async (e) => {
        e.preventDefault();

        const nombre = document.getElementById("nombre").value;
        const logo_url = document.getElementById("logo_url").value;
        const costo_mensual = document.getElementById("costo_mensual").value;
        const pagina_url = document.getElementById("pagina_url").value;
        const ceo = document.getElementById("ceo").value;
        const disponible_en_argentina = document.getElementById("disponible_en_argentina").value;
        const body = {
            nombre,
            logo_url,
            costo_mensual,
            pagina_url,
            ceo,
            disponible_en_argentina,
            creador_id: usuario_id
        }

        try {
            const respuesta = await fetch(`http://localhost:3000/api/plataformas/`, {
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