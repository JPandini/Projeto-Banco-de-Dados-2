---- COLOQUEI ISSO PQ SE O USUARIO TIVER EM OUTRO BANCO
-- NAO TEM PERIGO DE DA CONFLITO 
USE master;
GO

-- VERIFICA SE O BANCO JA TEM, SE NAO TEM CRIA
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'OficinaDB')
BEGIN
    CREATE DATABASE OficinaDB;
END
GO

-- USA O BANCO CRIADO
USE OficinaDB;
GO

--DELETA AS TABELA TUDO PRA CRIAR DE NOVO
DROP TABLE IF EXISTS servicos_realizados;
DROP TABLE IF EXISTS itens_peca;
DROP TABLE IF EXISTS itens_servico;
DROP TABLE IF EXISTS ordens_servico;
DROP TABLE IF EXISTS pecas;
DROP TABLE IF EXISTS servicos;
DROP TABLE IF EXISTS funcionarios;
DROP TABLE IF EXISTS veiculos;
DROP TABLE IF EXISTS endereco;
DROP TABLE IF EXISTS clientes;
GO

----------------------- CREATE TABLES ----------------------
CREATE TABLE [clientes] (
  [id_cliente] int PRIMARY KEY IDENTITY(1, 1),
  [nome] varchar(100) NOT NULL,
  [cpf] char(11),
  [telefone] varchar(20),
  [email] varchar(255),
  [criado_em] datetime DEFAULT (CURRENT_TIMESTAMP),
  [atualizado_em] datetime DEFAULT (CURRENT_TIMESTAMP)
)
GO

CREATE TABLE [endereco] (
  [id_endereco] int PRIMARY KEY IDENTITY(1, 1),
  [id_cliente] int NOT NULL,
  [estado] varchar(20),
  [cidade] varchar(40),
  [bairro] varchar(40),
  [rua] varchar(100),
  [numero] varchar(20),
  [cep] char(8),
  [criado_em] datetime DEFAULT (CURRENT_TIMESTAMP)
)
GO

CREATE TABLE [veiculos] (
  [id_veiculo] int PRIMARY KEY IDENTITY(1, 1),
  [id_cliente] int NOT NULL,
  [placa] varchar(8) UNIQUE NOT NULL,
  [marca] varchar(50),
  [modelo] varchar(50),
  [ano] smallint,
  [km_atual] int DEFAULT (0),
  [criado_em] datetime DEFAULT (CURRENT_TIMESTAMP)
)
GO

CREATE TABLE [funcionarios] (
  [id_funcionario] int PRIMARY KEY IDENTITY(1, 1),
  [nome] varchar(100) NOT NULL,
  [cargo] varchar(50),
  [criado_em] datetime DEFAULT (CURRENT_TIMESTAMP)
)
GO

CREATE TABLE [servicos] (
  [id_servico] int PRIMARY KEY IDENTITY(1, 1),
  [descricao] varchar(150) NOT NULL,
  [preco_padrao] decimal(10,2) DEFAULT (0),
  [ativo] tinyint DEFAULT (1)
)
GO

CREATE TABLE [pecas] (
  [id_peca] int PRIMARY KEY IDENTITY(1, 1),
  [descricao] varchar(150) NOT NULL,
  [preco_unitario] decimal(10,2) DEFAULT (0),
  [estoque] int DEFAULT (0)
)
GO

CREATE TABLE [ordens_servico] (
  [id_ordem] int PRIMARY KEY IDENTITY(1, 1),
  [id_veiculo] int NOT NULL,
  [data_entrada] datetime DEFAULT (CURRENT_TIMESTAMP),
  [data_saida] datetime,
  [status] varchar(20) DEFAULT 'ABERTA',
  [observacoes] varchar(max),
  [orcamento] decimal(12,2) DEFAULT (0),
  [criado_em] datetime DEFAULT (CURRENT_TIMESTAMP),
  [atualizado_em] datetime DEFAULT (CURRENT_TIMESTAMP)
)
GO

CREATE TABLE [itens_servico] (
  [id_item] int PRIMARY KEY IDENTITY(1, 1),
  [id_ordem] int NOT NULL,
  [id_servico] int NOT NULL,
  [quantidade] int DEFAULT (1),
  [preco_unitario] decimal(10,2) DEFAULT (0),
  [subtotal] decimal(12,2)
)
GO

CREATE TABLE [itens_peca] (
  [id_item_peca] int PRIMARY KEY IDENTITY(1, 1),
  [id_ordem] int NOT NULL,
  [id_peca] int NOT NULL,
  [quantidade] int DEFAULT (1),
  [preco_unitario] decimal(10,2) DEFAULT (0),
  [subtotal] decimal(12,2)
)
GO

CREATE TABLE [servicos_realizados] (
  [id_execucao] int PRIMARY KEY IDENTITY(1, 1),
  [id_ordem] int NOT NULL,
  [id_funcionario] int NOT NULL,
  [id_servico] int NOT NULL,
  [tempo_gasto] decimal(6,2) DEFAULT (0),
  [criado_em] datetime DEFAULT (CURRENT_TIMESTAMP)
)
GO

ALTER TABLE [endereco] ADD FOREIGN KEY ([id_cliente]) REFERENCES [clientes] ([id_cliente])
GO

ALTER TABLE [veiculos] ADD FOREIGN KEY ([id_cliente]) REFERENCES [clientes] ([id_cliente])
GO

ALTER TABLE [ordens_servico] ADD FOREIGN KEY ([id_veiculo]) REFERENCES [veiculos] ([id_veiculo])
GO

ALTER TABLE [itens_servico] ADD FOREIGN KEY ([id_ordem]) REFERENCES [ordens_servico] ([id_ordem])
GO

ALTER TABLE [itens_peca] ADD FOREIGN KEY ([id_ordem]) REFERENCES [ordens_servico] ([id_ordem])
GO

ALTER TABLE [itens_servico] ADD FOREIGN KEY ([id_servico]) REFERENCES [servicos] ([id_servico])
GO

ALTER TABLE [itens_peca] ADD FOREIGN KEY ([id_peca]) REFERENCES [pecas] ([id_peca])
GO

ALTER TABLE [servicos_realizados] ADD FOREIGN KEY ([id_ordem]) REFERENCES [ordens_servico] ([id_ordem])
GO

ALTER TABLE [servicos_realizados] ADD FOREIGN KEY ([id_funcionario]) REFERENCES [funcionarios] ([id_funcionario])
GO

ALTER TABLE [servicos_realizados] ADD FOREIGN KEY ([id_servico]) REFERENCES [servicos] ([id_servico])
GO

----------------------- INSERTS ----------------------
--CLIENTES 
INSERT INTO clientes (nome, cpf, telefone, email)
VALUES
('João Silva', '12345678901', '11999990001', 'joao1@email.com'),
('Maria Santos', '12345678902', '11999990002', 'maria2@email.com'),
('Carlos Pereira', '12345678903', '11999990003', 'carlos3@email.com'),
('Ana Souza', '12345678904', '11999990004', 'ana4@email.com'),
('Pedro Almeida', '12345678905', '11999990005', 'pedro5@email.com'),
('Luciana Rocha', '12345678906', '11999990006', 'luciana6@email.com'),
('Ricardo Moreira', '12345678907', '11999990007', 'ricardo7@email.com'),
('Patrícia Lima', '12345678908', '11999990008', 'patricia8@email.com'),
('Fernando Oliveira', '12345678909', '11999990009', 'fernando9@email.com'),
('Juliana Castro', '12345678910', '11999990010', 'juliana10@email.com');
GO

--ENDEREÇOS
INSERT INTO endereco (id_cliente, estado, cidade, bairro, rua, numero, cep)
VALUES
(1,'SP','São Paulo','Centro','Rua A','100','01001000'),
(2,'SP','São Paulo','Bela Vista','Rua B','200','01002000'),
(3,'SP','São Paulo','Mooca','Rua C','300','01003000'),
(4,'RJ','Rio de Janeiro','Copacabana','Rua D','400','22040000'),
(5,'RJ','Rio de Janeiro','Botafogo','Rua E','500','22250000'),
(6,'MG','Belo Horizonte','Centro','Rua F','600','30110000'),
(7,'MG','Belo Horizonte','Savassi','Rua G','700','30120000'),
(8,'PR','Curitiba','Centro','Rua H','800','80010000'),
(9,'PR','Curitiba','Água Verde','Rua I','900','80020000'),
(10,'RS','Porto Alegre','Centro','Rua J','1000','90010000');
GO

--VEICULOS
INSERT INTO veiculos (id_cliente, placa, marca, modelo, ano, km_atual)
VALUES
(1,'ABC1A11','Ford','Fiesta',2012,120000),
(2,'ABC1A12','Chevrolet','Onix',2018,50000),
(3,'ABC1A13','Volkswagen','Gol',2015,80000),
(4,'ABC1A14','Hyundai','HB20',2019,40000),
(5,'ABC1A15','Honda','Civic',2017,70000),
(6,'ABC1A16','Toyota','Corolla',2016,90000),
(7,'ABC1A17','Fiat','Argo',2020,20000),
(8,'ABC1A18','Ford','Ka',2014,85000),
(9,'ABC1A19','Renault','Sandero',2013,110000),
(10,'ABC1A20','Jeep','Renegade',2021,15000);
GO

--FUNCIONÁRIOS
INSERT INTO funcionarios (nome, cargo)
VALUES
('Paulo Mecânico','Mecânico'),
('Rafael Souza','Eletricista'),
('João Batista','Funileiro'),
('Marcos Castro','Pintor'),
('Roberto Lima','Mecânico'),
('Eduardo Melo','Gerente'),
('Tiago Alves','Atendente'),
('Maurício Dias','Mecânico'),
('Henrique Lopes','Lavador'),
('Fábio Duarte','Mecânico');
GO

--SERVIÇOS
INSERT INTO servicos (descricao, preco_padrao, ativo)
VALUES
('Troca de óleo',120,1),
('Alinhamento e Balanceamento',180,1),
('Revisão completa',500,1),
('Troca de freios',300,1),
('Diagnóstico eletrônico',150,1),
('Troca de correia dentada',450,1),
('Troca de bateria',350,1),
('Troca de filtro de ar',80,1),
('Troca de vela',100,1),
('Limpeza de bicos',200,1);
GO

--PEÇAS 
INSERT INTO pecas (descricao, preco_unitario, estoque)
VALUES
('Óleo 5W30',35,50),
('Filtro de óleo',20,40),
('Pastilha de freio',150,25),
('Correia dentada',120,30),
('Bateria 60A',450,15),
('Filtro de ar',25,60),
('Vela de ignição',30,100),
('Lâmpada H7',15,80),
('Pneu Aro 15',350,20),
('Aditivo de radiador',20,70);
GO

--ORDENS DE SERVIÇO
INSERT INTO ordens_servico (id_veiculo, status, observacoes)
VALUES
(1,'ABERTA','Cliente relatou barulho estranho'),
(2,'ABERTA','Revisão preventiva'),
(3,'ABERTA','Troca de óleo e filtros'),
(4,'ABERTA','Luz da injeção acesa'),
(5,'ABERTA','Checar sistema de freio'),
(6,'ABERTA','Trocar bateria'),
(7,'ABERTA','Limpeza geral'),
(8,'ABERTA','Diagnóstico completo'),
(9,'ABERTA','Troca da correia'),
(10,'ABERTA','Vibração ao dirigir');
GO

--ITENS DE SERVIÇO
INSERT INTO itens_servico (id_ordem, id_servico, quantidade, preco_unitario, subtotal)
VALUES
(1,1,1,120,120),
(2,3,1,500,500),
(3,1,1,120,120),
(4,5,1,150,150),
(5,4,1,300,300),
(6,7,1,350,350),
(7,2,1,180,180),
(8,10,1,200,200),
(9,6,1,450,450),
(10,2,1,180,180);
GO


--ITENS PEÇA
INSERT INTO itens_peca (id_ordem, id_peca, quantidade, preco_unitario, subtotal)
VALUES
(1,1,1,35,35),
(2,9,1,350,350),
(3,2,1,20,20),
(4,8,2,15,30),
(5,3,1,150,150),
(6,5,1,450,450),
(7,6,1,25,25),
(8,7,4,30,120),
(9,4,1,120,120),
(10,1,1,35,35);
GO

--SERVIÇOS REALIZADOS
INSERT INTO servicos_realizados (id_ordem, id_funcionario, id_servico, tempo_gasto)
VALUES
(1,1,1,1.5),
(2,2,3,4),
(3,3,1,1),
(4,4,5,2),
(5,5,4,3),
(6,6,7,1),
(7,7,2,1.2),
(8,8,10,2.5),
(9,9,6,3.5),
(10,10,2,1.5);
GO

--------- SELECTS DE TESTE ---------
SELECT * FROM clientes;
SELECT * FROM endereco;
SELECT * FROM veiculos;
SELECT * FROM funcionarios;
SELECT * FROM servicos;
SELECT * FROM pecas;
SELECT * FROM ordens_servico;
SELECT * FROM itens_servico;
SELECT * FROM itens_peca;
SELECT * FROM servicos_realizados;
