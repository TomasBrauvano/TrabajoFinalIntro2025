const usuario_id = JSON.parse(sessionStorage.getItem("usuario_id"));

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const plataforma_id = urlParams.get('id');
    const container = document.querySelector(".cuadro-de-ingreso");
    const boton = document.getElementById("actualizar-plataforma");

    let plataforma;

    if (plataforma_id) {
        try {
            const respuesta = await fetch(`http://localhost:3000/api/plataformas/${plataforma_id}`);
            plataforma = await respuesta.json();
            if (respuesta.ok) {

                document.getElementById("nombre").value = plataforma.nombre || '';
                document.getElementById("logo_url").value = plataforma.logo_url || '';
                document.getElementById("costo_mensual").value = plataforma.costo_mensual || '';
                document.getElementById("pagina_url").value = plataforma.pagina_url || '';
                document.getElementById("ceo").value = plataforma.ceo || '';

                const disponibilidadSelect = document.getElementById("disponible_en_argentina");
                disponibilidadSelect.value = plataforma.disponible_en_argentina;
            } else {
                return container.innerHTML = `<p>${plataforma.error}</p>`;
            }
        } catch (error) {
            console.error("Error al cargar plataforma:", error);
            container.innerHTML = `<p>Error de conexión o de servidor al cargar la plataforma.</p>`;
            boton.disabled = true;
        }

        boton.addEventListener("click", async (e) => {
            e.preventDefault();

            if (!plataforma) {
                alert("No se pudo obtener la información original de la plataforma para actualizar.");
                return;
            }

            const nombre = document.getElementById("nombre").value;
            const logo_url = document.getElementById("logo_url").value;
            const costo_mensual = document.getElementById("costo_mensual").value;
            const pagina_url = document.getElementById("pagina_url").value;
            const ceo = document.getElementById("ceo").value;
            const disponible_en_argentina = document.getElementById("disponible_en_argentina").value;

            try {
                const res = await fetch(`http://localhost:3000/api/plataformas/${plataforma_id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        nombre: nombre || plataforma.nombre,
                        logo_url: logo_url || plataforma.logo_url,
                        costo_mensual: costo_mensual || plataforma.costo_mensual,
                        pagina_url: pagina_url || plataforma.pagina_url,
                        ceo: ceo || plataforma.ceo,
                        creador_id: usuario_id,
                        disponible_en_argentina: disponible_en_argentina,
                    }),
                });

                const data = await res.json();

                if (res.ok) {
                    alert("Plataforma actualizada correctamente");
                    window.location.href = "index.html";
                } else {
                    alert(`Error: ${data.error || 'Error desconocido'}`);
                }
            } catch (error) {
                console.error("Error en la solicitud PUT:", error);
                alert("Error en el servidor al actualizar la plataforma.");
            }
        });
    } else {
        container.innerHTML = '<p>ID de plataforma no proporcionado en la URL.</p>';
        boton.disabled = true;
    }
});

function cancelar() {
    window.location.href = "mis-plataformas.html"
};