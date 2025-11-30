# Sistemas Manutenção de Veículos - Grupo B

## Integrantes

João Vítor Pandini<br>
Danner Demetrio Anselmo<br>
Gabriel Ferrari Guidi<br>
Felipe Saturno da Silva<br>

## Modelo Físico 

A ferramenta [dbdiagram.io](https://dbdiagram.io/) foi utilizada para criação do modelo físico do projeto.

<img width="1301" height="916" alt="512992809-fb1a57f8-f89d-4e0e-a162-3850acd05fae" src="https://github.com/user-attachments/assets/2fab8ba7-b2e7-4c07-b5e3-5e134846daa4" />

## Scripts SQL

Os scripts estão organizados da seguinte maneira:

- **DDL** — Estrutura do banco  
  Localização: `script/ddl`

- **DML** — Inserção e manipulação de dados para testes  
  Localização: `script/dml`

## Índices<br>
Os índices abaixo otimizam junções, filtros e agregações.<br>
CREATE INDEX idx_veiculos_id_cliente<br>
ON veiculos (id_cliente);<br>
<br>
CREATE INDEX idx_ordens_servico_id_veiculo<br>
ON ordens_servico (id_veiculo);<br>
<br>
CREATE INDEX idx_pecas_estoque_preco<br>
ON pecas (estoque, preco_unitario)<br>
INCLUDE (descricao);<br>
<br>
CREATE INDEX idx_servicos_realizados_idordem<br>
ON servicos_realizados (id_ordem)<br>
INCLUDE (tempo_gasto);<br>
<br>
