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

CREATE TABLE IF NOT EXISTS plataformas (
	id SERIAL PRIMARY KEY,
	nombre VARCHAR(50) NOT NULL,
	logo_url TEXT NOT NULL,
	costo_mensual NUMERIC(10,2) NOT NULL,
	pagina_url TEXT NOT NULL,
	ceo VARCHAR(50) NOT NULL,
	disponible_en_argentina BOOLEAN NOT NULL,
    creador_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS peliculas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    anio SMALLINT NOT NULL,
    director VARCHAR(50) NOT NULL,
    sinopsis TEXT NOT NULL,
    imagen TEXT NOT NULL,
    creador_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    categoria INT REFERENCES categorias(id) NOT NULL,
    plataforma INT REFERENCES plataformas(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS usuario_pelicula (
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    pelicula_id INT NOT NULL REFERENCES peliculas(id) ON DELETE CASCADE,
    calificacion INT,
    estado INT NOT NULL DEFAULT 1 REFERENCES estados(id),
    PRIMARY KEY (usuario_id, pelicula_id)
);

CREATE TABLE IF NOT EXISTS pelicula_plataforma (
	pelicula_id INT NOT NULL REFERENCES peliculas(id) ON DELETE CASCADE,
	plataforma_id INT NOT NULL REFERENCES plataformas(id) ON DELETE CASCADE,
	calif_general NUMERIC(2,2),
	PRIMARY KEY (pelicula_id, plataforma_id)
);

INSERT INTO categorias (nombre) VALUES 
    ('terror'),
    ('aventura'),
    ('romance'),
    ('ciencia ficción'),
    ('fantasía'),
    ('drama'),
    ('comedia'),
    ('acción')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO usuarios (nombre_usuario,nombre,apellido,contrasenia,categoria_preferida) 
VALUES ('admin','admin','admin','admin',1)
ON CONFLICT (nombre_usuario) DO NOTHING;

INSERT INTO estados (nombre) VALUES
  ('pendiente'),
  ('viendo'),
  ('vista')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO plataformas (nombre,logo_url,costo_mensual,pagina_url,ceo,disponible_en_argentina,creador_id)
VALUES ('Netflix', 'https://images.ctfassets.net/y2ske730sjqp/1aONibCke6niZhgPxuiilC/2c401b05a07288746ddf3bd3943fbc76/BrandAssets_Logos_01-Wordmark.jpg?w=940', 7.99, 'https://www.netflix.com', 'Wilmot Reed Hastings Jr', true, 1),
('Disney+', 'https://i.pinimg.com/736x/2b/fc/f1/2bfcf1f53b5d6fc10998509152011368.jpg', 17, 'https://www.disneyplus.com', 'Robert A. Iger', true, 1);

INSERT INTO peliculas (nombre, anio, director, sinopsis, imagen, creador_id, categoria, plataforma) VALUES
('El conjuro', 2013, 'James Wan', 'Una pareja de investigadores paranormales ayuda a una familia aterrorizada.', 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEil91uWcWktClfvIvmV6qtU11ZipAlkALkCOXzyuqv0XH8vNgmE_YErlx8nKvxP2nO6VWaJOw8Rgvgwm6XjILiH2jrbY6tZAG3QCrI8eYOwoUVOKYxXRPdRAV82UOmAx9R9nOwalinXt0Dg/s1600/the-conjuring-poster.jpg', 1, 1, 1),
('It', 1986, 'Stephen King', 'Un grupo de niños enfrenta una entidad maligna que toma la forma de un payaso.', 'https://images.cdn2.buscalibre.com/fit-in/360x360/3c/a0/3ca0d5641108924db725e1d9b5971d52.jpg', 1, 1, 1),
('The Haunting of Hill House', 2018, 'Mike Flanagan', 'Una familia enfrenta recuerdos de su antigua casa embrujada.', 'https://m.media-amazon.com/images/M/MV5BMTU4NzA4MDEwNF5BMl5BanBnXkFtZTgwMTQxODYzNjM@._V1_FMjpg_UX1000_.jpg', 1, 1, 1),
('Indiana Jones y los cazadores del arca perdida', 1981, 'Steven Spielberg', 'Un arqueólogo se embarca en una aventura para recuperar un artefacto.', 'https://m.media-amazon.com/images/M/MV5BNjEwNjY0ZTAtMjk0MS00MDhkLTkwYWUtMjM3ZmI2M2JhYjJhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg', 1, 2, 1),
('La isla del tesoro', 1883, 'Robert Louis Stevenson', 'Un joven se une a una expedición para encontrar un tesoro enterrado.', 'https://images.cdn3.buscalibre.com/fit-in/360x360/ab/25/ab257042248996457bbdb1f4e3b31c9b.jpg', 1, 2, 1),
('One Piece', 1999, 'Eiichiro Oda', 'Un joven pirata busca el tesoro legendario para convertirse en el rey de los piratas.', 'https://m.media-amazon.com/images/M/MV5BMTNjNGU4NTUtYmVjMy00YjRiLTkxMWUtNzZkMDNiYjZhNmViXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg', 1, 2, 1),
('Bajo la misma estrella', 2012, 'John Green', 'Dos adolescentes con cáncer se enamoran mientras enfrentan sus enfermedades.', 'https://images.cdn2.buscalibre.com/fit-in/360x360/dc/77/dc77d1b54b6a7ebd3f26ce0a68847f88.jpg', 1, 3, 1),
('Outlander', 2014, 'Ronald D. Moore', 'Una enfermera viaja en el tiempo y se enamora de un guerrero escocés.', 'https://es.web.img3.acsta.net/pictures/14/05/09/11/16/481757.jpg', 1, 3, 1),
('Orgullo y prejuicio', 2005, 'Joe Wright', 'Una historia de amor entre Elizabeth Bennet y Mr. Darcy.', 'https://m.media-amazon.com/images/M/MV5BZjBlODgwZWEtODcxMi00OTY5LWEyOTItODE2MDBjZjU0ZDU3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg', 1, 3, 1),
('Interestelar', 2014, 'Christopher Nolan', 'Un grupo de astronautas busca un nuevo hogar para la humanidad.', 'https://m.media-amazon.com/images/S/pv-target-images/79194981293eabf6620ece96eb5a9c1fffa04d3374ae12986e0748800b37b9cf.jpg', 1, 4, 1),
('Dune', 1965, 'Frank Herbert', 'Un joven noble lucha por el control de un planeta desértico y su recurso más valioso.', 'https://acdn-us.mitiendanube.com/stores/001/542/126/products/9789877254112-72a56b8b885f4bba5b16944491880484-480-0.jpg', 1, 4, 1),
('Black Mirror', 2011, 'Charlie Brooker', 'Episodios independientes que exploran las consecuencias de la tecnología.', 'https://m.media-amazon.com/images/M/MV5BODcxMWI2NDMtYTc3NC00OTZjLWFmNmUtM2NmY2I1ODkxYzczXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg', 1, 4, 1),
('El señor de los anillos: La comunidad del anillo', 2001, 'Peter Jackson', 'Un hobbit emprende un viaje para destruir un anillo maligno.', 'https://es.web.img3.acsta.net/medias/nmedia/18/89/67/45/20061512.jpg', 1, 5, 2),
('Harry Potter y la piedra filosofal', 1997, 'J.K. Rowling', 'Un niño descubre que es mago y asiste a una escuela de magia.', 'https://acdn-us.mitiendanube.com/stores/001/542/126/products/9789878000107-b82c22cfb174dca93016944484618644-1024-1024.jpg', 1, 5, 2),
('Game of Thrones', 2011, 'David Benioff y D. B. Weiss', 'Nobles luchan por el control de los Siete Reinos.', 'https://m.media-amazon.com/images/M/MV5BMTNhMDJmNmYtNDQ5OS00ODdlLWE0ZDAtZTgyYTIwNDY3OTU3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg', 1, 5, 2),
('La Lista de Schindler', 1993, 'Steven Spielberg', 'Un empresario salva a cientos de judíos durante el Holocausto.', 'https://es.web.img3.acsta.net/pictures/19/02/12/18/49/4078948.jpg', 1, 6, 2),
('Los Miserables', 1862, 'Victor Hugo', 'La redención de un exconvicto perseguido por la ley.', 'https://images.cdn2.buscalibre.com/fit-in/360x360/57/77/577751a0acc49c10b9a6a9b96270dbe6.jpg', 1, 6, 2),
('The Crown', 2016, 'Peter Morgan', 'Crónica de la vida de la reina Isabel II.', 'https://m.media-amazon.com/images/M/MV5BMGU2MjdjODQtZDk5Ny00NzgwLWI2MTMtYzViNDU5MDNjMGU2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg', 1, 6, 2),
('El Dictador', 2012, 'Larry Charles', 'Un dictador excéntrico visita Estados Unidos y vive situaciones ridículas.', 'https://m.media-amazon.com/images/S/pv-target-images/95df6af83a949c53078666663510af758a2423e5567f275a3dbd63f166a9ae16.jpg', 1, 7, 2),
('Buenos Presagios', 1990, 'Terry Pratchett y Neil Gaiman', 'Un ángel y un demonio intentan evitar el Apocalipsis.', 'https://images.cdn2.buscalibre.com/fit-in/520x520/0d/c6/0dc6942c3cf441bca1769def52320170.jpg', 1, 7, 2),
('The Office', 2005, 'Greg Daniels', 'Documental ficticio sobre una oficina de ventas de papel.', 'https://es.web.img3.acsta.net/pictures/14/02/04/13/20/128334.jpg', 1, 7, 2),
('Misión Imposible', 1996, 'Brian De Palma', 'Un agente secreto es acusado injustamente y debe limpiar su nombre.', 'https://es.web.img2.acsta.net/pictures/14/02/24/11/10/117666.jpg', 1, 8, 2),
('Los Juegos del Hambre', 2008, 'Suzanne Collins', 'Una joven lucha por sobrevivir en un juego mortal.', 'https://images.cdn3.buscalibre.com/fit-in/360x360/12/d4/12d48178474f8ab70263bafa6aed8931.jpg', 1, 8, 2),
('Jack Ryan', 2018, 'Carlton Cuse', 'Un analista de la CIA se ve envuelto en operaciones de alto riesgo.', 'https://m.media-amazon.com/images/M/MV5BNGYxNzgzNTQtY2U0OC00NzU2LTgxZmYtNmZkMmVlMjgyMzM3XkEyXkFqcGc@._V1_.jpg', 1, 8, 2);