document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('input-busqueda');
    const boton = document.querySelector('.boton-busqueda');
    const mostrador = document.querySelector('.mostrador-de-contenido');

    boton.addEventListener('click', async () => {
        const valor = input.value.trim().toLowerCase();
        if (!valor) return;
        try {
            const res = await fetch('http://localhost:3000/api/libros/buscar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre: valor })
            });
            if (res.status == 404) {
                mostrador.innerHTML = '<p>No hay libros con ese nombre, <a href="crear.html">crealo</a></p>';
                return
            } else if (!res.ok) throw new Error('Error en la búsqueda');
            const libros = await res.json();

            mostrador.innerHTML = '';

            libros.forEach(l => {
                const div = document.createElement('div');
                div.classList.add('libro-item');
                div.innerHTML = `
                    <img src="${l.imagen}" alt="${l.nombre}" width="200">
                    <button class="boton-agregar-${l.id}">Agregar</button>
                    <button class="boton-eliminar-${l.id}">Eliminar</button> <h3>${l.nombre}</h3>
                    <p><strong>Año:</strong> ${l.anio}</p>
                    <p><strong>Autor:</strong> ${l.autor}</p>
                    <p>${l.sinopsis}</p>
                    <hr>
                `;
                mostrador.appendChild(div);

                document.querySelector(`.boton-agregar-${l.id}`).addEventListener("click", async () => {

                    try {
                        const response = await fetch(`http://localhost:3000/api/usuarios_libros`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                usuario_id: usuario_id,
                                libro_id: l.id,
                                calificacion: "",
                                estado: "1"
                            })
                        });

                        if (response.ok) {
                            alert(`"${l.nombre}" se agrego a tu perfil de libros.`);
                            location.reload();
                        } else {
                            const errorData = await response.json();
                            alert(`Ya tenes agregado el libro: ${l.nombre}`);
                        }
                    } catch (error) {
                        console.error("Error al enviar la solicitud para agregar:", error);
                        alert("Ocurrió un error en el servidor.");
                    }
                });

                document.querySelector(`.boton-eliminar-${l.id}`).addEventListener("click", async () => {
                    const confirmar = confirm('¿Estás seguro de que quieres eliminarlo de tu perfil de libros?');
                    if(!confirmar) return;
                    
                    try{
                        const response = await fetch('http://localhost:3000/api/usuarios_libros',{
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            usuario_id: usuario_id,
                            libro_id: l.id
                        })
                    });

                        if(response.ok){
                            alert(`"${l.nombre}" se eliminó de tu perfil de libros.`);
                            location.reload();
                        }else{
                            const errorData = await response.json();
                            alert(errorData.error || `Error al eliminar el libro: ${l.nombre}`);
                        }
                    } catch (error){
                        console.error("Error al enviar la solicitud para eliminar:", error);
                        alert("Ocurrio un error en el servidor");
                    }
                });
            });

        } catch (err) {
            console.error(err);
            mostrador.innerHTML = '<p>Error al buscar libros.</p>';
        }
    });
});