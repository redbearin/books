DROP TABLE IF EXISTS books;
CREATE TABLE books(
  id SERIAL PRIMARY KEY,
  authors VARCHAR(255),
  title VARCHAR(255),
  description TEXT,
  isbn VARCHAR(50),
  thumbnail VARCHAR(255)
);

INSERT INTO books (authors, title, description, isbn, thumbnail)
VALUES('John Wright', 'Mushrooms', '"In the first of the River Cottage Handbook series, mycologist John Wright uncovers the secret habits and habitats of Britains thriving mushrooms - and the team at River Cottage explain how to cook them to perfection.', '9781408896273', 'http://books.google.com/books/content?id=wP5DDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api');

INSERT INTO books (authors, title, description, isbn, thumbnail)
VALUES('Emily K. Green', 'Goats', '"The hairiest animal on the farm might be the goat. Goats have long beards that hang below their chins! This book introduces children to how goats look and how they live on the farm.', '9781408896273', 'https://books.google.com/books/content?id=bs_m8WmmnMkC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api');