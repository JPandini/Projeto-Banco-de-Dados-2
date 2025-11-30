// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const createCrud = require('./crudFactory');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// --- ROTAS AUTOMÁTICAS ---
// Mapeando Tabela -> Nome da Coluna ID (baseado no seu SQL)

app.use('/clientes',            createCrud('clientes', 'id_cliente'));
app.use('/endereco',            createCrud('endereco', 'id_endereco'));
app.use('/veiculos',            createCrud('veiculos', 'id_veiculo'));
app.use('/funcionarios',        createCrud('funcionarios', 'id_funcionario'));
app.use('/servicos',            createCrud('servicos', 'id_servico'));
app.use('/pecas',               createCrud('pecas', 'id_peca'));
app.use('/ordens_servico',      createCrud('ordens_servico', 'id_ordem'));
app.use('/itens_servico',       createCrud('itens_servico', 'id_item'));
app.use('/itens_peca',          createCrud('itens_peca', 'id_item_peca'));
app.use('/servicos_realizados', createCrud('servicos_realizados', 'id_execucao'));

// Rota raiz para teste
app.get('/', (req, res) => res.send('API Oficina Rodando!'));

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
    console.log('Rotas disponíveis para todas as tabelas!');
});

