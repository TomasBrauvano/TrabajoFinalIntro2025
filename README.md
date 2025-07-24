# StoryStack
Una página web en la que se puede crear una lista de películas, series o libros, y mostrar su estado de avance.
## Requisitos para levantar la página web
1. Docker
2. Node.js
## Cómo levantar la página web

## Si todavia no estan construidos los contenedores, se puede usar
```
docker-compose up -d --build
```
## Si ya estan construidos, simplemente
```
docker-compose up -d
```
## Cómo levantar el backend
```
docker-compose up -d backend
```
## Cómo levantar el frontend
```
docker-compose up -d frontend
```
## Frontend
El frontend incluye las paginas Login, Register, Inicio, MiPerfil, Peliculas, Series, Libros, Buscar peliculas, Buscar Libros, Buscar series y Crear.

## Backend
Se utilizo Postgresql para la base de datos y express para la API. cada entidad posee un CRUD para realizar todas las operaciones que necesita la pagina.
