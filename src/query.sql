DROP TABLE IF EXISTS usuarios CASCADE;
CREATE TABLE usuarios (
  id serial PRIMARY KEY,
  nome text NOT NULL,
  email text UNIQUE NOT NULL,
  senha text NOT NULL
);

DROP TABLE IF EXISTS categorias CASCADE;
CREATE TABLE categorias (
  id serial PRIMARY KEY,
  descricao text NOT NULL
);

DROP TABLE IF EXISTS transacoes CASCADE;
CREATE TABLE transacoes (
  id serial PRIMARY KEY,
  descricao text,
  valor int NOT NULL,
  data date,
  categoria_id int NOT NULL,
  usuario_id int NOT NULL,
  tipo text NOT NULL,
  FOREIGN KEY (categoria_id) REFERENCES categorias (id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
);

INSERT INTO categorias (descricao) VALUES 
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