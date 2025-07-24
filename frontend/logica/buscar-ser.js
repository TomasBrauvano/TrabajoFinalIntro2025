document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('input-busqueda');
    const boton = document.querySelector('.boton-busqueda');
    const mostrador = document.querySelector('.mostrador-de-contenido');

    boton.addEventListener('click', async () => {
        const valor = input.value.trim().toLowerCase();
        if (!valor) return;
        try {
            const res = await fetch('http://localhost:3000/api/series/buscar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre: valor })
            });
            if (res.status == 404) {
                mostrador.innerHTML = '<p>No hay series con ese nombre, <a href="crear.html">creala</a></p>';
                return
            } else if (!res.ok) throw new Error('Error en la búsqueda');
            const series = await res.json();

            mostrador.innerHTML = '';

            series.forEach(s => {
                const div = document.createElement('div');
                div.classList.add('serie-item');
                div.innerHTML = `
                    <img src="${s.imagen}" alt="${s.nombre}" width="200">
                    <button class="boton-agregar-${s.id}">Agregar</button>
                    <button class="boton-eliminar-${s.id}">Eliminar</button>
                    <h3>${s.nombre}</h3>
                    <p><strong>Año:</strong> ${s.anio}</p>
                    <p><strong>Director:</strong> ${s.director}</p>
                    <p>${s.sinopsis}</p>
                    <hr>
                `;
                mostrador.appendChild(div);

                document.querySelector(`.boton-agregar-${s.id}`).addEventListener("click", async () => {

                    try {
                        const response = await fetch(`http://localhost:3000/api/usuarioSeries`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                usuario_id: usuario_id,
                                serie_id: s.id,
                                calificacion: "",
                                estado: "1"
                            })
                        });

                        if (response.ok) {
                            alert(`"${s.nombre}" se agrego a tu perfil de series.`);
                            location.reload();
                        } else {
                            const errorData = await response.json();
                            alert(`Ya tenes agregada la serie: ${s.nombre}`);
                        }
                    } catch (error) {
                        console.error("Error al enviar la solicitud para agregar:", error);
                        alert("Ocurrió un error en el servidor.");
                    }
                });

                document.querySelector(`.boton-eliminar-${s.id}`).addEventListener("click", async () => {
                    const confirmar = confirm('¿Estás seguro de que quieres eliminarlo de tu perfil de series?');
                    if(!confirmar) return;
                    
                    try{
                        const response = await fetch('http://localhost:3000/api/usuarioSeries',{
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        /*body: JSON.stringify({
                            usuario_id: usuario_id,
                            serie_id: s.id
                        })*/
                    });

                        if(response.ok){
                            alert(`"${s.nombre}" se eliminó de tu perfil de series.`);
                            location.reload();
                        }else{
                            const errorData = await response.json();
                            alert(errorData.error || `Error al eliminar la serie: ${s.nombre}`);
                        }
                    } catch (error){
                        console.error("Error al enviar la solicitud para eliminar:", error);
                        alert("Ocurrio un error en el servidor");
                    }
                });

            });

        } catch (err) {
            console.error(err);
            mostrador.innerHTML = '<p>Error al buscar series.</p>';
        }
    });
});