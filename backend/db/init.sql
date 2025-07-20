CREATE TABLE IF NOT EXISTS categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    contrasenia VARCHAR(50) NOT NULL,
    categoria_preferida INT REFERENCES categorias(id)
);

CREATE TABLE IF NOT EXISTS peliculas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    anio SMALLINT NOT NULL,
    director VARCHAR(50) NOT NULL,
    sinopsis TEXT NOT NULL,
    categoria INT REFERENCES categorias(id)
);

CREATE TABLE IF NOT EXISTS series (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    anio SMALLINT NOT NULL,
    director VARCHAR(50) NOT NULL,
    sinopsis TEXT NOT NULL,
    categoria INT REFERENCES categorias(id)
);

CREATE TABLE IF NOT EXISTS libros (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    anio SMALLINT NOT NULL,
    autor VARCHAR(50) NOT NULL,
    categoria INT REFERENCES categorias(id)
);

CREATE TABLE IF NOT EXISTS usuario_pelicula (
    usuario_id INT REFERENCES usuarios(id) NOT NULL,
    pelicula_id INT REFERENCES peliculas(id) NOT NULL,
    calificacion VARCHAR(50) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    PRIMARY KEY (usuario_id, pelicula_id)
);

CREATE TABLE IF NOT EXISTS usuario_serie (
    usuario_id INT REFERENCES usuarios(id) NOT NULL,
    serie_id INT REFERENCES series(id) NOT NULL,
    calificacion VARCHAR(50) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    PRIMARY KEY (usuario_id, serie_id)
);

CREATE TABLE IF NOT EXISTS usuario_libro (
    usuario_id INT REFERENCES usuarios(id) NOT NULL,
    libro_id INT REFERENCES libros(id) NOT NULL,
    calificacion VARCHAR(50) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    PRIMARY KEY (usuario_id, libro_id)
);

INSERT INTO categorias (nombre) VALUES 
    ('terror'),
    ('aventura'),
    ('romance'),
    ('ciencia ficción'),
    ('fantasía')
ON CONFLICT (nombre) DO NOTHING;