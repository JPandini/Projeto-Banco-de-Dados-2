# Sistemas Manutenção de Veículos - Grupo B

## Integrantes

João Vítor Pandini<br>
Danner Demetrio Anselmo<br>
Gabriel Ferrari Guidi<br>
Felipe Saturno da Silva<br>

## Modelo Físico 

A ferramenta [dbdiagram.io](https://dbdiagram.io/) foi utilizada para criação do modelo físico do projeto.

<img width="1301" height="916" alt="512992809-fb1a57f8-f89d-4e0e-a162-3850acd05fae" src="https://github.com/user-attachments/assets/2fab8ba7-b2e7-4c07-b5e3-5e134846daa4" />

## 
Toda a documentação das tabelas e indices pode ser encontrada em [Dicionario](Dicionario)

## Scripts SQL

Os scripts estão organizados da seguinte maneira:

- **Tabelas**: [create_tabels](script/ddl/create_tabels)
  
- **Índices**: [Índices](script/ddl/Índices)
  
- **Gatilhos**: [trigger](script/ddl/trigger)
  
- **Procedimentos armazenados**: [procedure](script/ddl/procedure)
  
- **Funções**: [function](script/ddl/function)

- **DML**: [dml](script/dml)

## CRUD

### Visão geral
O backend é uma API REST simples construída com **Node.js + Express** que expõe operações CRUD genéricas para as tabelas do banco de dados do sistema. A fábrica de rotas ([crudFactory.js](crud/backend/crudFactory.js)) cria dinamicamente endpoints para GET (lista), GET por id, POST, PUT e DELETE para cada tabela registrada.

A conexão com o SQL Server é feita via pacote `mssql` e gerenciada por um pool de conexões em [db.js](crud/backend/db.js).

### Rotas registradas
As rotas são automaticamente registradas em [index.js](crud/backend/index.js) com os respectivos nomes de recurso e coluna de id:

- `/clientes` — `id_cliente`  
- `/endereco` — `id_endereco`  
- `/veiculos` — `id_veiculo`  
- `/funcionarios` — `id_funcionario`  
- `/servicos` — `id_servico`  
- `/pecas` — `id_peca`  
- `/ordens_servico` — `id_ordem`  
- `/itens_servico` — `id_item`  
- `/itens_peca` — `id_item_peca`  
- `/servicos_realizados` — `id_execucao`  

Cada rota suporta:
- `GET /` — lista todos os registros  
- `GET /:id` — busca por id  
- `POST /` — cria novo registro (corpo JSON)  
- `PUT /:id` — atualiza por id (corpo JSON)  
- `DELETE /:id` — remove por id  
Veja a implementação em [index.js](crud/backend/index.js) e em [crudFactory.js](crud/backend/crudFactory.js).

INCLUDE (tempo_gasto);<br>
<br>
[***Código Fonte***](crud)

## Relatório Final

O relatório final está disponível no arquivo [Relatório_Final](Relatório_Final.pdf)
