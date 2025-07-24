# StoryStack
Una página web en la que se puede crear una lista de películas, series o libros, y mostrar su estado de avance.
## Cómo levantar la página web
```
docker-compose up --build
```
## Cómo levantar el backend
```
docker-compose up backend
```
## Cómo levantar el frontend
```
docker-compose up frontend
```
## Frontend
El frontend incluye las paginas Login, Register, Inicio, MiPerfil, Peliculas, Series, Libros, Buscar peliculas, Buscar Libros, Buscar series y Crear.

## Backend
Se utilizo Postgresql para la base de datos y express para la API. cada entidad posee un CRUD para realizar todas las operaciones que necesita la pagina.
