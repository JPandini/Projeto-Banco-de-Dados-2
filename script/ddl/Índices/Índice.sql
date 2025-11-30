CREATE INDEX  idx_veiculos_id_cliente
ON veiculos (id_cliente);


CREATE INDEX idx_ordens_servico_id_veiculo
ON ordens_servico (id_veiculo);


CREATE INDEX idx_pecas_estoque_preco
ON pecas (estoque, preco_unitario)
INCLUDE (descricao);


CREATE INDEX idx_veiculos_modelo_id
ON veiculos (modelo, id_veiculo)
INCLUDE (placa);


CREATE INDEX idx_ordens_servico_idveiculo_idordem

CREATE INDEX idx_ordens_servico_idveiculo_idordem
ON ordens_servico (id_veiculo, id_ordem)
INCLUDE (orcamento);


CREATE INDEX idx_servicos_realizados_idordem
ON servicos_realizados (id_ordem)
INCLUDE (tempo_gasto);


CREATE INDEX idx_endereco_id_cliente
ON endereco (id_cliente);


CREATE INDEX idx_itenspeca_id_peca
ON itens_peca (id_peca);



CREATE INDEX idx_pecas_estoque
ON pecas (estoque)
INCLUDE (descricao);



CREATE INDEX idx_ordens_servico_veiculo_data
ON ordens_servico (id_veiculo, data_entrada);


CREATE INDEX idx_veiculos_criadoem
ON veiculos (criado_em)
INCLUDE (placa, marca, modelo);
