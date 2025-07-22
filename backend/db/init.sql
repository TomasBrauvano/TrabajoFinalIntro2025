CREATE TABLE estados (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE
);

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
    categoria_preferida INT REFERENCES categorias(id) NOT NULL
);

CREATE TABLE IF NOT EXISTS peliculas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    anio SMALLINT NOT NULL,
    director VARCHAR(50) NOT NULL,
    sinopsis TEXT NOT NULL,
    imagen TEXT NOT NULL,
    creador_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    categoria INT REFERENCES categorias(id) NOT NULL
);

CREATE TABLE IF NOT EXISTS series (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    anio SMALLINT NOT NULL,
    director VARCHAR(50) NOT NULL,
    sinopsis TEXT NOT NULL,
    imagen TEXT NOT NULL,
    creador_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    categoria INT REFERENCES categorias(id) NOT NULL
);

CREATE TABLE IF NOT EXISTS libros (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    anio SMALLINT NOT NULL,
    autor VARCHAR(50) NOT NULL,
    sinopsis TEXT NOT NULL,
    imagen TEXT NOT NULL,
    creador_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    categoria INT REFERENCES categorias(id) NOT NULL
);

CREATE TABLE IF NOT EXISTS usuario_pelicula (
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    pelicula_id INT NOT NULL REFERENCES peliculas(id) ON DELETE CASCADE,
    calificacion INT,
    estado INT REFERENCES estados(id) NOT NULL,
    PRIMARY KEY (usuario_id, pelicula_id)
);

CREATE TABLE IF NOT EXISTS usuario_serie (
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    serie_id INT NOT NULL REFERENCES series(id) ON DELETE CASCADE,
    calificacion INT,
    estado INT REFERENCES estados(id) NOT NULL,
    PRIMARY KEY (usuario_id, serie_id)
);

CREATE TABLE IF NOT EXISTS usuario_libro (
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    libro_id INT NOT NULL REFERENCES libros(id) ON DELETE CASCADE,
    calificacion INT,
    estado INT REFERENCES estados(id) NOT NULL,
    PRIMARY KEY (usuario_id, libro_id)
);

INSERT INTO categorias (nombre) VALUES 
    ('terror'),
    ('aventura'),
    ('romance'),
    ('ciencia ficción'),
    ('fantasía')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO usuarios (nombre_usuario,nombre,apellido,contrasenia,categoria_preferida) 
VALUES ('admin','admin','admin','admin',1)
ON CONFLICT (nombre_usuario) DO NOTHING;

INSERT INTO estados (nombre) VALUES
  ('pendiente'),
  ('viendo'),
  ('vista')
ON CONFLICT (nombre) DO NOTHING;  