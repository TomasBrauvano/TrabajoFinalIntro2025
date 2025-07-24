const usuario_id = localStorage.getItem("usuario_id");
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('input-busqueda');
    const boton = document.querySelector('.boton-busqueda');
    const mostrador = document.querySelector('.mostrador-de-contenido');

    boton.addEventListener('click', async () => {
        const valor = input.value.trim().toLowerCase();
        if (!valor) return;
        try {
            const res = await fetch('http://localhost:3000/api/peliculas/buscar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre: valor })
            });
            if (res.status == 404) {
                mostrador.innerHTML = '<p>No hay peliculas con ese nombre, <a href="crear.html">creala</a></p>';
                return
            } else if (!res.ok) throw new Error('Error en la búsqueda');
            const peliculas = await res.json();

            mostrador.innerHTML = '';

            peliculas.forEach(p => {
                const div = document.createElement('div');
                div.classList.add('pelicula-item');
                div.innerHTML = `
                    <img src="${p.imagen}" alt="${p.nombre}" width="200">
                    <button class="boton-agregar-${p.id}">Agregar</button>
                    <button class="boton-eliminar-${p.id}">Eliminar</button> <h3>${p.nombre}</h3>
                    <p><strong>Año:</strong> ${p.anio}</p>
                    <p><strong>Director:</strong> ${p.director}</p>
                    <p>${p.sinopsis}</p>
                    <hr>
                `;
                mostrador.appendChild(div);

                document.querySelector(`.boton-agregar-${p.id}`).addEventListener("click", async () => {

                    try {
                        const response = await fetch(`http://localhost:3000/api/usuarios_peliculas`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                usuario_id: usuario_id,
                                pelicula_id: p.id,
                                calificacion: "",
                                estado: "1"
                            })
                        });

                        if (response.ok) {
                            alert(`"${p.nombre}" se agrego a tu perfil de peliculas.`);
                            location.reload();
                        } else {
                            const errorData = await response.json();
                            alert(`Ya tenes agregada la pelicula: ${p.nombre}`);
                        }
                    } catch (error) {
                        console.error("Error al enviar la solicitud para agregar:", error);
                        alert("Ocurrió un error en el servidor.");
                    }
                });

                document.querySelector(`.boton-eliminar-${p.id}`).addEventListener("click", async () => {
                    const confirmar = confirm('¿Estás seguro de que quieres eliminarlo de tu perfil de peliculas?');
                    if(!confirmar) return;
                    
                    try{
                        const response = await fetch('http://localhost:3000/api/usuarios_peliculas',{
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            usuario_id: usuario_id,
                            pelicula_id: p.id
                        })
                    });

                        if(response.ok){
                            alert(`"${p.nombre}" se eliminó de tu perfil de peliculas.`);
                            location.reload();
                        }else{
                            const errorData = await response.json();
                            alert(errorData.error || `Error al eliminar la pelicula: ${p.nombre}`);
                        }
                    } catch (error){
                        console.error("Error al enviar la solicitud para eliminar:", error);
                        alert("Ocurrio un error en el servidor");
                    }
                });
            });

        } catch (err) {
            console.error(err);
            mostrador.innerHTML = '<p>Error al buscar películas.</p>';
        }
    });
});