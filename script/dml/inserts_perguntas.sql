INSERT INTO clientes (nome, cpf, telefone, email) VALUES 
('Roberto Magnata', '11111111111', '11999999999', 'roberto@vip.com'),
('Ana Onix', '22222222222', '11888888888', 'ana@onix.com'),
('Carlos Onix', '33333333333', '11777777777', 'carlos@onix.com'),
('Paulo Antigo', '44444444444', '11666666666', 'paulo@old.com'),
('Lucas Sem Casa', '55555555555', '11555555555', 'lucas@rua.com'),
('Maria Nômade', '66666666666', '11444444444', 'maria@mundo.com');

INSERT INTO endereco (id_cliente, estado, cidade, bairro, rua, numero, cep) VALUES
(1, 'SP', 'São Paulo', 'Jardins', 'Rua Rica', '100', '01000000'),
(2, 'SP', 'São Paulo', 'Centro', 'Rua Média', '50', '02000000'),
(3, 'RJ', 'Rio de Janeiro', 'Barra', 'Av Mar', '20', '03000000'),
(4, 'MG', 'Belo Horizonte', 'Savassi', 'Rua Pão de Queijo', '10', '04000000');

INSERT INTO veiculos (id_cliente, placa, marca, modelo, ano, km_atual, criado_em) VALUES
(1, 'BMW-9999', 'BMW', 'X6', 2023, 10000, GETDATE()),
(1, 'FER-0001', 'Ferrari', '488', 2022, 5000, GETDATE()),
(2, 'ONI-1111', 'Chevrolet', 'Onix', 2020, 40000, GETDATE()),
(3, 'ONI-2222', 'Chevrolet', 'Onix', 2021, 30000, GETDATE()),
(4, 'VEL-1980', 'Chevrolet', 'Opala', 1980, 200000, DATEADD(YEAR, -2, GETDATE())),
(5, 'GOL-1000', 'VW', 'Gol', 2010, 150000, GETDATE());

INSERT INTO funcionarios (nome, cargo) VALUES
('João Mecânico', 'Mecânico Chefe'),
('Pedro Ajudante', 'Auxiliar');

INSERT INTO servicos (descricao, preco_padrao) VALUES
('Troca de Óleo', 200.00),
('Retífica de Motor', 5000.00),
('Alinhamento', 100.00);

INSERT INTO pecas (descricao, preco_unitario, estoque) VALUES
('Turbina Garrett', 4500.00, 2),
('Módulo Injeção', 2500.00, 5),
('Filtro de Óleo', 50.00, 100),
('Pastilha de Freio', 150.00, 50),
('Aerofólio Tuning', 800.00, 10);

INSERT INTO ordens_servico (id_veiculo, data_entrada, status, orcamento, observacoes) VALUES
(2, GETDATE(), 'FINALIZADA', 10000.00, 'Revisão completa Ferrari'),
(1, GETDATE(), 'FINALIZADA', 5000.00, 'Manutenção BMW'),
(3, GETDATE(), 'FINALIZADA', 600.00, 'Revisão Onix Ana'),
(4, GETDATE(), 'ABERTA', 300.00, 'Barulho Onix Carlos'),
(5, DATEADD(YEAR, -1, GETDATE()), 'FINALIZADA', 200.00, 'Troca de óleo antiga'); 

INSERT INTO servicos_realizados (id_ordem, id_funcionario, id_servico, tempo_gasto) VALUES
(3, 1, 1, 1.5),
(3, 2, 3, 0.5),
(4, 1, 3, 1.0);

INSERT INTO itens_peca (id_ordem, id_peca, quantidade, preco_unitario, subtotal) VALUES
(1, 1, 2, 4500.00, 9000.00),
(3, 3, 1, 50.00, 50.00);
