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
