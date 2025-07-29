const peliculaContainer = document.querySelector(".container-info");
const container = document.querySelector(".container-container-pelicula")
const botones = document.querySelector(".botones");
const usuario_id = localStorage.getItem("usuario_id");

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pelicula_id = urlParams.get('id');

    if (pelicula_id) {
        console.log("ID de la película:", pelicula_id);
        try {
            const response = await fetch(`http://localhost:3000/api/peliculas/${pelicula_id}`);
            if (response.ok) {
                const pelicula = await response.json();
                try {
                    const res = await fetch(`http://localhost:3000/api/categorias/${pelicula.categoria}`);
                    if (res.ok) {
                        categoria = await res.json()
                    } else {
                        const errorData = await response.json();
                        console.error(`Error al obtener categoría ${categoriaId}: ${errorData.message || response.statusText}`);
                    }
                } catch (error) {
                    console.error(`Error de red al obtener categoría ${categoriaId}:`, error);
                }
                try {
                    const resp = await fetch(`http://localhost:3000/api/plataformas/${pelicula.plataforma}`)
                    if (resp.ok) {
                        plataforma = await resp.json();
                    } else {
                        const errorData = await response.json()
                        console.error(`Error al obtener plataforma ${pelicula.plataforma}: ${errorData.message || response.statusText}`);
                    }
                } catch(error) {
                    console.error(`Error de red al obtener plataforma ${plataforma}:`, error);
                }
                document.getElementById('imagen-pelicula').src = pelicula.imagen;
                document.getElementById('titulo-pelicula').textContent = `Titulo: ${pelicula.nombre}`;
                document.getElementById('anio-pelicula').textContent = `Año: ${pelicula.anio}`;
                document.getElementById('director-pelicula').textContent = `Director: ${pelicula.director}`;
                document.getElementById('sinopsis-pelicula').textContent = `Sinopsis: ${pelicula.sinopsis}`;
                document.getElementById('categoria-pelicula').textContent = `Categoria: ${categoria.nombre}`;
                document.getElementById('plataforma-pelicula').textContent = `Disponible en: ${plataforma.nombre}`;

                if (pelicula.creador_id === parseInt(usuario_id)) {
                    const btnActualizar = document.createElement("button");
                    const btnEliminar = document.createElement("button");
                    btnActualizar.textContent = "Actualizar";
                    btnEliminar.textContent = "Eliminar";
                    btnActualizar.classList.add("boton-actualizar")
                    btnEliminar.classList.add("boton-eliminar")

                    btnActualizar.addEventListener("click", () => {
                        window.location.href = `actualizar-pelicula.html?id=${pelicula_id}`
                    })

                    btnEliminar.addEventListener("click", async () => {
                        const confirmar = confirm('¿Estás seguro de que quieres eliminar esta pelicula?');
                        if (!confirmar) return;

                        try {
                            const response = await fetch(`http://localhost:3000/api/peliculas/${pelicula_id}`, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            });

                            if (response.ok) {
                                alert(`"${pelicula.nombre}" se eliminó.`);
                                window.location.href = 'index.html';
                            } else {
                                const errorData = await response.json();
                                alert(errorData.error || `Error al eliminar la pelicula: ${pelicula.nombre}`);
                            }
                        } catch (error) {
                            console.error("Error al enviar la solicitud para eliminar:", error);
                            alert("Ocurrio un error en el servidor");
                        }
                    });

                    botones.appendChild(btnActualizar);
                    botones.appendChild(btnEliminar);
                }
            } else if (response.status === 404) {
                console.error('Error al obtener los detalles de la película:', response.statusText);
                container.innerHTML = `<p>Pelicula no encontrada</p>`;
            } else {
                console.error('Error al obtener los detalles de la película:', response.statusText);
                container.innerHTML = '<p>No se pudo cargar la película.</p>';
            }
        } catch (error) {
            console.error('Error de red al obtener detalles de la película:', error);
            container.innerHTML = '<p>Error de conexión.</p>';
        }
    } else {
        container.innerHTML = '<p>ID de película no proporcionado en la URL.</p>';
    }
});