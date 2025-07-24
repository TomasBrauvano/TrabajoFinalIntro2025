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

INSERT INTO peliculas (nombre, anio, director, sinopsis, imagen, creador_id, categoria) VALUES
('El conjuro', 2013, 'James Wan', 'Una pareja de investigadores paranormales ayuda a una familia aterrorizada.', 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEil91uWcWktClfvIvmV6qtU11ZipAlkALkCOXzyuqv0XH8vNgmE_YErlx8nKvxP2nO6VWaJOw8Rgvgwm6XjILiH2jrbY6tZAG3QCrI8eYOwoUVOKYxXRPdRAV82UOmAx9R9nOwalinXt0Dg/s1600/the-conjuring-poster.jpg', 1, 1),
('Indiana Jones y los cazadores del arca perdida', 1981, 'Steven Spielberg', 'Un arqueólogo se embarca en una aventura para recuperar un artefacto.', 'https://m.media-amazon.com/images/M/MV5BNjEwNjY0ZTAtMjk0MS00MDhkLTkwYWUtMjM3ZmI2M2JhYjJhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg', 1, 2),
('Orgullo y prejuicio', 2005, 'Joe Wright', 'Una historia de amor entre Elizabeth Bennet y Mr. Darcy.', 'https://m.media-amazon.com/images/M/MV5BZjBlODgwZWEtODcxMi00OTY5LWEyOTItODE2MDBjZjU0ZDU3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg', 1, 3),
('Interestelar', 2014, 'Christopher Nolan', 'Un grupo de astronautas busca un nuevo hogar para la humanidad.', 'https://m.media-amazon.com/images/S/pv-target-images/79194981293eabf6620ece96eb5a9c1fffa04d3374ae12986e0748800b37b9cf.jpg', 1, 4),
('El señor de los anillos: La comunidad del anillo', 2001, 'Peter Jackson', 'Un hobbit emprende un viaje para destruir un anillo maligno.', 'https://es.web.img3.acsta.net/medias/nmedia/18/89/67/45/20061512.jpg', 1, 5);

INSERT INTO libros (nombre, anio, autor, sinopsis, imagen, creador_id, categoria) VALUES
('It', 1986, 'Stephen King', 'Un grupo de niños enfrenta una entidad maligna que toma la forma de un payaso.', 'https://images.cdn2.buscalibre.com/fit-in/360x360/3c/a0/3ca0d5641108924db725e1d9b5971d52.jpg', 1, 1),
('La isla del tesoro', 1883, 'Robert Louis Stevenson', 'Un joven se une a una expedición para encontrar un tesoro enterrado.', 'https://images.cdn3.buscalibre.com/fit-in/360x360/ab/25/ab257042248996457bbdb1f4e3b31c9b.jpg', 1, 2),
('Bajo la misma estrella', 2012, 'John Green', 'Dos adolescentes con cáncer se enamoran mientras enfrentan sus enfermedades.', 'https://images.cdn2.buscalibre.com/fit-in/360x360/dc/77/dc77d1b54b6a7ebd3f26ce0a68847f88.jpg', 1, 3),
('Dune', 1965, 'Frank Herbert', 'Un joven noble lucha por el control de un planeta desértico y su recurso más valioso.', 'https://acdn-us.mitiendanube.com/stores/001/542/126/products/9789877254112-72a56b8b885f4bba5b16944491880484-480-0.jpg', 1, 4),
('Harry Potter y la piedra filosofal', 1997, 'J.K. Rowling', 'Un niño descubre que es mago y asiste a una escuela de magia.', 'https://acdn-us.mitiendanube.com/stores/001/542/126/products/9789878000107-b82c22cfb174dca93016944484618644-1024-1024.jpg', 1, 5);

INSERT INTO series (nombre, anio, director, sinopsis, imagen, creador_id, categoria) VALUES
('The Haunting of Hill House', 2018, 'Mike Flanagan', 'Una familia enfrenta recuerdos de su antigua casa embrujada.', 'https://m.media-amazon.com/images/M/MV5BMTU4NzA4MDEwNF5BMl5BanBnXkFtZTgwMTQxODYzNjM@._V1_FMjpg_UX1000_.jpg', 1, 1),
('One Piece', 1999, 'Eiichiro Oda', 'Un joven pirata busca el tesoro legendario para convertirse en el rey de los piratas.', 'https://m.media-amazon.com/images/M/MV5BMTNjNGU4NTUtYmVjMy00YjRiLTkxMWUtNzZkMDNiYjZhNmViXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg', 1, 2),
('Outlander', 2014, 'Ronald D. Moore', 'Una enfermera viaja en el tiempo y se enamora de un guerrero escocés.', 'https://es.web.img3.acsta.net/pictures/14/05/09/11/16/481757.jpg', 1, 3),
('Black Mirror', 2011, 'Charlie Brooker', 'Episodios independientes que exploran las consecuencias de la tecnología.', 'https://m.media-amazon.com/images/M/MV5BODcxMWI2NDMtYTc3NC00OTZjLWFmNmUtM2NmY2I1ODkxYzczXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg', 1, 4),
('Game of Thrones', 2011, 'David Benioff y D. B. Weiss', 'Nobles luchan por el control de los Siete Reinos.', 'https://m.media-amazon.com/images/M/MV5BMTNhMDJmNmYtNDQ5OS00ODdlLWE0ZDAtZTgyYTIwNDY3OTU3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg', 1, 5);