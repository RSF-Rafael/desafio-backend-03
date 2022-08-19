DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
  id serial PRIMARY KEY,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  password text NOT NULL
);

DROP TABLE IF EXISTS categories CASCADE;
CREATE TABLE categories (
  id serial PRIMARY KEY,
  description text NOT NULL
);

DROP TABLE IF EXISTS transactions CASCADE;
CREATE TABLE transactions (
  id serial PRIMARY KEY,
  type text NOT NULL,
  description text,
  value int NOT NULL,
  date timestamptz default NOW(),
  user_id int NOT NULL,
  category_id int NOT NULL,
  FOREIGN KEY (category_id) REFERENCES categories (id),
  FOREIGN KEY (user_id) REFERENCES users (id)
);

INSERT INTO categories (description) VALUES 
('Alimentação'),
('Assinaturas e Serviços'),
('Casa'),
('Mercado'),
('Cuidados Pessoais'),
('Educação'),
('Família'),
('Lazer'),
('Pets'),
('Presentes'),
('Roupas'),
('Saúde'),
('Transporte'),
('Salário'),
('Vendas'),
('Outras receitas'),
('Outras despesas');