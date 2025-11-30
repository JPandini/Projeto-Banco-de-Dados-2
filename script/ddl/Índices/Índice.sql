CREATE INDEX  idx_veiculos_id_cliente
ON veiculos (id_cliente);


CREATE INDEX idx_ordens_servico_id_veiculo
ON ordens_servico (id_veiculo);
