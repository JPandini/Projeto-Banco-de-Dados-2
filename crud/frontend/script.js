// Configuração da API
const API_BASE = 'http://localhost:3000';

// Função genérica para requisições
async function apiRequest(endpoint, method = 'GET', data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    if (data) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, options);
        if (!response.ok) {
            throw new Error(`Erro: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro: ' + error.message);
        throw error;
    }
}

// Gerenciamento de abas
function openTab(tabName, element) {
    // Esconde todas as abas
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active'));
    
    // Remove active de todos os botões
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Mostra a aba selecionada
    document.getElementById(tabName).classList.add('active');
    if (element) {
        element.classList.add('active');
    }
    
    // Carrega os dados da aba
    carregarDadosAba(tabName);
}

// Carrega dados quando uma aba é aberta
function carregarDadosAba(tabName) {
    switch(tabName) {
        case 'clientes':
            listarClientes();
            break;
        case 'veiculos':
            carregarClientesSelect('veiculos-id_cliente');
            listarVeiculos();
            break;
        case 'ordens_servico':
            carregarVeiculosSelect('ordens_servico-id_veiculo');
            listarOrdensServico();
            break;
        case 'endereco':
            carregarClientesSelect('endereco-id_cliente');
            listarEnderecos();
            break;
        case 'funcionarios':
            listarFuncionarios();
            break;
        case 'servicos':
            listarServicos();
            break;
        case 'pecas':
            listarPecas();
            break;
        case 'itens_servico':
            carregarOrdensSelect('itens_servico-id_ordem');
            carregarServicosSelect('itens_servico-id_servico');
            listarItensServico();
            break;
        case 'itens_peca':
            carregarOrdensSelect('itens_peca-id_ordem');
            carregarPecasSelect('itens_peca-id_peca');
            listarItensPeca();
            break;
        case 'servicos_realizados':
            carregarOrdensSelect('servicos_realizados-id_ordem');
            carregarFuncionariosSelect('servicos_realizados-id_funcionario');
            carregarServicosSelect('servicos_realizados-id_servico');
            listarServicosRealizados();
            break;
    }
}

// Função genérica para limpar formulário
function limparForm(tabela) {
    const form = document.getElementById(`form-${tabela}`);
    form.reset();
    document.getElementById(`${tabela}-id`).value = '';
}

// Mapeamento de nomes de tabela para nomes de funções
const funcoesTabela = {
    'clientes': { editar: 'editarCliente', deletar: 'deletarCliente' },
    'veiculos': { editar: 'editarVeiculo', deletar: 'deletarVeiculo' },
    'ordens_servico': { editar: 'editarOrdemServico', deletar: 'deletarOrdemServico' },
    'endereco': { editar: 'editarEndereco', deletar: 'deletarEndereco' },
    'funcionarios': { editar: 'editarFuncionario', deletar: 'deletarFuncionario' },
    'servicos': { editar: 'editarServico', deletar: 'deletarServico' },
    'pecas': { editar: 'editarPeca', deletar: 'deletarPeca' },
    'itens_servico': { editar: 'editarItemServico', deletar: 'deletarItemServico' },
    'itens_peca': { editar: 'editarItemPeca', deletar: 'deletarItemPeca' },
    'servicos_realizados': { editar: 'editarServicoRealizado', deletar: 'deletarServicoRealizado' }
};

// Função genérica para criar tabela HTML
function criarTabelaHTML(dados, colunas, tabela, idColumn) {
    if (!dados || dados.length === 0) {
        return '<p>Nenhum registro encontrado.</p>';
    }
    
    const funcoes = funcoesTabela[tabela] || { editar: 'editar', deletar: 'deletar' };
    
    let html = '<table><thead><tr>';
    colunas.forEach(col => {
        html += `<th>${col.label}</th>`;
    });
    html += '<th>Ações</th></tr></thead><tbody>';
    
    dados.forEach(item => {
        html += '<tr>';
        colunas.forEach(col => {
            let value = item[col.field];
            if (value === null || value === undefined) {
                value = '';
            } else if (typeof value === 'boolean') {
                value = value ? 'Sim' : 'Não';
            } else if (typeof value === 'number' && col.field.includes('preco') || col.field.includes('orcamento') || col.field.includes('subtotal')) {
                value = 'R$ ' + value.toFixed(2).replace('.', ',');
            }
            html += `<td>${value}</td>`;
        });
        html += `<td>
            <button class="btn-edit" onclick="${funcoes.editar}(${item[idColumn]})">Editar</button>
            <button class="btn-delete" onclick="${funcoes.deletar}(${item[idColumn]})">Deletar</button>
        </td></tr>`;
    });
    
    html += '</tbody></table>';
    return html;
}

// Funções para carregar selects
async function carregarClientesSelect(selectId) {
    try {
        const clientes = await apiRequest('/clientes');
        const select = document.getElementById(selectId);
        select.innerHTML = '<option value="">Selecione um cliente</option>';
        clientes.forEach(cliente => {
            select.innerHTML += `<option value="${cliente.id_cliente}">${cliente.nome} (${cliente.cpf})</option>`;
        });
    } catch (error) {
        console.error('Erro ao carregar clientes:', error);
    }
}

async function carregarVeiculosSelect(selectId) {
    try {
        const veiculos = await apiRequest('/veiculos');
        const select = document.getElementById(selectId);
        select.innerHTML = '<option value="">Selecione um veículo</option>';
        veiculos.forEach(veiculo => {
            select.innerHTML += `<option value="${veiculo.id_veiculo}">${veiculo.placa} - ${veiculo.marca} ${veiculo.modelo}</option>`;
        });
    } catch (error) {
        console.error('Erro ao carregar veículos:', error);
    }
}

async function carregarOrdensSelect(selectId) {
    try {
        const ordens = await apiRequest('/ordens_servico');
        const select = document.getElementById(selectId);
        select.innerHTML = '<option value="">Selecione uma ordem</option>';
        ordens.forEach(ordem => {
            select.innerHTML += `<option value="${ordem.id_ordem}">Ordem #${ordem.id_ordem} - ${ordem.status}</option>`;
        });
    } catch (error) {
        console.error('Erro ao carregar ordens:', error);
    }
}

async function carregarServicosSelect(selectId) {
    try {
        const servicos = await apiRequest('/servicos');
        const select = document.getElementById(selectId);
        select.innerHTML = '<option value="">Selecione um serviço</option>';
        servicos.forEach(servico => {
            select.innerHTML += `<option value="${servico.id_servico}">${servico.descricao}</option>`;
        });
    } catch (error) {
        console.error('Erro ao carregar serviços:', error);
    }
}

async function carregarPecasSelect(selectId) {
    try {
        const pecas = await apiRequest('/pecas');
        const select = document.getElementById(selectId);
        select.innerHTML = '<option value="">Selecione uma peça</option>';
        pecas.forEach(peca => {
            select.innerHTML += `<option value="${peca.id_peca}">${peca.descricao}</option>`;
        });
    } catch (error) {
        console.error('Erro ao carregar peças:', error);
    }
}

async function carregarFuncionariosSelect(selectId) {
    try {
        const funcionarios = await apiRequest('/funcionarios');
        const select = document.getElementById(selectId);
        select.innerHTML = '<option value="">Selecione um funcionário</option>';
        funcionarios.forEach(func => {
            select.innerHTML += `<option value="${func.id_funcionario}">${func.nome} - ${func.cargo}</option>`;
        });
    } catch (error) {
        console.error('Erro ao carregar funcionários:', error);
    }
}

// ========== CLIENTES ==========
async function listarClientes() {
    try {
        const clientes = await apiRequest('/clientes');
        const colunas = [
            { field: 'id_cliente', label: 'ID' },
            { field: 'nome', label: 'Nome' },
            { field: 'cpf', label: 'CPF' },
            { field: 'telefone', label: 'Telefone' },
            { field: 'email', label: 'Email' }
        ];
        document.getElementById('table-clientes').innerHTML = criarTabelaHTML(clientes, colunas, 'clientes', 'id_cliente');
    } catch (error) {
        console.error('Erro ao listar clientes:', error);
    }
}

async function salvarCliente(event) {
    event.preventDefault();
    const id = document.getElementById('clientes-id').value;
    const data = {
        nome: document.getElementById('clientes-nome').value,
        cpf: document.getElementById('clientes-cpf').value,
        telefone: document.getElementById('clientes-telefone').value,
        email: document.getElementById('clientes-email').value
    };
    
    try {
        if (id) {
            await apiRequest(`/clientes/${id}`, 'PUT', data);
            alert('Cliente atualizado com sucesso!');
        } else {
            await apiRequest('/clientes', 'POST', data);
            alert('Cliente criado com sucesso!');
        }
        limparForm('clientes');
        listarClientes();
    } catch (error) {
        console.error('Erro ao salvar cliente:', error);
    }
}

async function editarCliente(id) {
    try {
        const cliente = await apiRequest(`/clientes/${id}`);
        document.getElementById('clientes-id').value = cliente.id_cliente;
        document.getElementById('clientes-nome').value = cliente.nome || '';
        document.getElementById('clientes-cpf').value = cliente.cpf || '';
        document.getElementById('clientes-telefone').value = cliente.telefone || '';
        document.getElementById('clientes-email').value = cliente.email || '';
    } catch (error) {
        console.error('Erro ao editar cliente:', error);
    }
}

async function deletarCliente(id) {
    if (!confirm('Tem certeza que deseja deletar este cliente?')) return;
    try {
        await apiRequest(`/clientes/${id}`, 'DELETE');
        alert('Cliente deletado com sucesso!');
        listarClientes();
    } catch (error) {
        console.error('Erro ao deletar cliente:', error);
    }
}

// ========== VEÍCULOS ==========
async function listarVeiculos() {
    try {
        const veiculos = await apiRequest('/veiculos');
        const colunas = [
            { field: 'id_veiculo', label: 'ID' },
            { field: 'id_cliente', label: 'ID Cliente' },
            { field: 'placa', label: 'Placa' },
            { field: 'marca', label: 'Marca' },
            { field: 'modelo', label: 'Modelo' },
            { field: 'ano', label: 'Ano' },
            { field: 'km_atual', label: 'KM Atual' }
        ];
        document.getElementById('table-veiculos').innerHTML = criarTabelaHTML(veiculos, colunas, 'veiculos', 'id_veiculo');
    } catch (error) {
        console.error('Erro ao listar veículos:', error);
    }
}

async function salvarVeiculo(event) {
    event.preventDefault();
    const id = document.getElementById('veiculos-id').value;
    const data = {
        id_cliente: parseInt(document.getElementById('veiculos-id_cliente').value),
        placa: document.getElementById('veiculos-placa').value,
        marca: document.getElementById('veiculos-marca').value,
        modelo: document.getElementById('veiculos-modelo').value,
        ano: parseInt(document.getElementById('veiculos-ano').value),
        km_atual: parseInt(document.getElementById('veiculos-km_atual').value)
    };
    
    try {
        if (id) {
            await apiRequest(`/veiculos/${id}`, 'PUT', data);
            alert('Veículo atualizado com sucesso!');
        } else {
            await apiRequest('/veiculos', 'POST', data);
            alert('Veículo criado com sucesso!');
        }
        limparForm('veiculos');
        listarVeiculos();
    } catch (error) {
        console.error('Erro ao salvar veículo:', error);
    }
}

async function editarVeiculo(id) {
    try {
        const veiculo = await apiRequest(`/veiculos/${id}`);
        document.getElementById('veiculos-id').value = veiculo.id_veiculo;
        document.getElementById('veiculos-id_cliente').value = veiculo.id_cliente || '';
        document.getElementById('veiculos-placa').value = veiculo.placa || '';
        document.getElementById('veiculos-marca').value = veiculo.marca || '';
        document.getElementById('veiculos-modelo').value = veiculo.modelo || '';
        document.getElementById('veiculos-ano').value = veiculo.ano || '';
        document.getElementById('veiculos-km_atual').value = veiculo.km_atual || '';
    } catch (error) {
        console.error('Erro ao editar veículo:', error);
    }
}

async function deletarVeiculo(id) {
    if (!confirm('Tem certeza que deseja deletar este veículo?')) return;
    try {
        await apiRequest(`/veiculos/${id}`, 'DELETE');
        alert('Veículo deletado com sucesso!');
        listarVeiculos();
    } catch (error) {
        console.error('Erro ao deletar veículo:', error);
    }
}

// ========== ORDENS DE SERVIÇO ==========
async function listarOrdensServico() {
    try {
        const ordens = await apiRequest('/ordens_servico');
        const colunas = [
            { field: 'id_ordem', label: 'ID' },
            { field: 'id_veiculo', label: 'ID Veículo' },
            { field: 'data_entrada', label: 'Data Entrada' },
            { field: 'data_saida', label: 'Data Saída' },
            { field: 'status', label: 'Status' },
            { field: 'observacoes', label: 'Observações' },
            { field: 'orcamento', label: 'Orçamento' }
        ];
        document.getElementById('table-ordens_servico').innerHTML = criarTabelaHTML(ordens, colunas, 'ordens_servico', 'id_ordem');
    } catch (error) {
        console.error('Erro ao listar ordens:', error);
    }
}

async function salvarOrdemServico(event) {
    event.preventDefault();
    const id = document.getElementById('ordens_servico-id').value;
    const data = {
        id_veiculo: parseInt(document.getElementById('ordens_servico-id_veiculo').value),
        data_entrada: document.getElementById('ordens_servico-data_entrada').value,
        data_saida: document.getElementById('ordens_servico-data_saida').value || null,
        status: document.getElementById('ordens_servico-status').value,
        observacoes: document.getElementById('ordens_servico-observacoes').value || null,
        orcamento: document.getElementById('ordens_servico-orcamento').value ? parseFloat(document.getElementById('ordens_servico-orcamento').value) : null
    };
    
    try {
        if (id) {
            await apiRequest(`/ordens_servico/${id}`, 'PUT', data);
            alert('Ordem de serviço atualizada com sucesso!');
        } else {
            await apiRequest('/ordens_servico', 'POST', data);
            alert('Ordem de serviço criada com sucesso!');
        }
        limparForm('ordens_servico');
        listarOrdensServico();
    } catch (error) {
        console.error('Erro ao salvar ordem:', error);
    }
}

async function editarOrdemServico(id) {
    try {
        const ordem = await apiRequest(`/ordens_servico/${id}`);
        document.getElementById('ordens_servico-id').value = ordem.id_ordem;
        document.getElementById('ordens_servico-id_veiculo').value = ordem.id_veiculo || '';
        document.getElementById('ordens_servico-data_entrada').value = ordem.data_entrada ? ordem.data_entrada.split('T')[0] : '';
        document.getElementById('ordens_servico-data_saida').value = ordem.data_saida ? ordem.data_saida.split('T')[0] : '';
        document.getElementById('ordens_servico-status').value = ordem.status || '';
        document.getElementById('ordens_servico-observacoes').value = ordem.observacoes || '';
        document.getElementById('ordens_servico-orcamento').value = ordem.orcamento || '';
    } catch (error) {
        console.error('Erro ao editar ordem:', error);
    }
}

async function deletarOrdemServico(id) {
    if (!confirm('Tem certeza que deseja deletar esta ordem de serviço?')) return;
    try {
        await apiRequest(`/ordens_servico/${id}`, 'DELETE');
        alert('Ordem de serviço deletada com sucesso!');
        listarOrdensServico();
    } catch (error) {
        console.error('Erro ao deletar ordem:', error);
    }
}

// ========== ENDEREÇOS ==========
async function listarEnderecos() {
    try {
        const enderecos = await apiRequest('/endereco');
        const colunas = [
            { field: 'id_endereco', label: 'ID' },
            { field: 'id_cliente', label: 'ID Cliente' },
            { field: 'estado', label: 'Estado' },
            { field: 'cidade', label: 'Cidade' },
            { field: 'bairro', label: 'Bairro' },
            { field: 'rua', label: 'Rua' },
            { field: 'numero', label: 'Número' },
            { field: 'cep', label: 'CEP' }
        ];
        document.getElementById('table-endereco').innerHTML = criarTabelaHTML(enderecos, colunas, 'endereco', 'id_endereco');
    } catch (error) {
        console.error('Erro ao listar endereços:', error);
    }
}

async function salvarEndereco(event) {
    event.preventDefault();
    const id = document.getElementById('endereco-id').value;
    const data = {
        id_cliente: parseInt(document.getElementById('endereco-id_cliente').value),
        estado: document.getElementById('endereco-estado').value,
        cidade: document.getElementById('endereco-cidade').value,
        bairro: document.getElementById('endereco-bairro').value,
        rua: document.getElementById('endereco-rua').value,
        numero: document.getElementById('endereco-numero').value,
        cep: document.getElementById('endereco-cep').value
    };
    
    try {
        if (id) {
            await apiRequest(`/endereco/${id}`, 'PUT', data);
            alert('Endereço atualizado com sucesso!');
        } else {
            await apiRequest('/endereco', 'POST', data);
            alert('Endereço criado com sucesso!');
        }
        limparForm('endereco');
        listarEnderecos();
    } catch (error) {
        console.error('Erro ao salvar endereço:', error);
    }
}

async function editarEndereco(id) {
    try {
        const endereco = await apiRequest(`/endereco/${id}`);
        document.getElementById('endereco-id').value = endereco.id_endereco;
        document.getElementById('endereco-id_cliente').value = endereco.id_cliente || '';
        document.getElementById('endereco-estado').value = endereco.estado || '';
        document.getElementById('endereco-cidade').value = endereco.cidade || '';
        document.getElementById('endereco-bairro').value = endereco.bairro || '';
        document.getElementById('endereco-rua').value = endereco.rua || '';
        document.getElementById('endereco-numero').value = endereco.numero || '';
        document.getElementById('endereco-cep').value = endereco.cep || '';
    } catch (error) {
        console.error('Erro ao editar endereço:', error);
    }
}

async function deletarEndereco(id) {
    if (!confirm('Tem certeza que deseja deletar este endereço?')) return;
    try {
        await apiRequest(`/endereco/${id}`, 'DELETE');
        alert('Endereço deletado com sucesso!');
        listarEnderecos();
    } catch (error) {
        console.error('Erro ao deletar endereço:', error);
    }
}

// ========== FUNCIONÁRIOS ==========
async function listarFuncionarios() {
    try {
        const funcionarios = await apiRequest('/funcionarios');
        const colunas = [
            { field: 'id_funcionario', label: 'ID' },
            { field: 'nome', label: 'Nome' },
            { field: 'cargo', label: 'Cargo' }
        ];
        document.getElementById('table-funcionarios').innerHTML = criarTabelaHTML(funcionarios, colunas, 'funcionarios', 'id_funcionario');
    } catch (error) {
        console.error('Erro ao listar funcionários:', error);
    }
}

async function salvarFuncionario(event) {
    event.preventDefault();
    const id = document.getElementById('funcionarios-id').value;
    const data = {
        nome: document.getElementById('funcionarios-nome').value,
        cargo: document.getElementById('funcionarios-cargo').value
    };
    
    try {
        if (id) {
            await apiRequest(`/funcionarios/${id}`, 'PUT', data);
            alert('Funcionário atualizado com sucesso!');
        } else {
            await apiRequest('/funcionarios', 'POST', data);
            alert('Funcionário criado com sucesso!');
        }
        limparForm('funcionarios');
        listarFuncionarios();
    } catch (error) {
        console.error('Erro ao salvar funcionário:', error);
    }
}

async function editarFuncionario(id) {
    try {
        const funcionario = await apiRequest(`/funcionarios/${id}`);
        document.getElementById('funcionarios-id').value = funcionario.id_funcionario;
        document.getElementById('funcionarios-nome').value = funcionario.nome || '';
        document.getElementById('funcionarios-cargo').value = funcionario.cargo || '';
    } catch (error) {
        console.error('Erro ao editar funcionário:', error);
    }
}

async function deletarFuncionario(id) {
    if (!confirm('Tem certeza que deseja deletar este funcionário?')) return;
    try {
        await apiRequest(`/funcionarios/${id}`, 'DELETE');
        alert('Funcionário deletado com sucesso!');
        listarFuncionarios();
    } catch (error) {
        console.error('Erro ao deletar funcionário:', error);
    }
}

// ========== SERVIÇOS ==========
async function listarServicos() {
    try {
        const servicos = await apiRequest('/servicos');
        const colunas = [
            { field: 'id_servico', label: 'ID' },
            { field: 'descricao', label: 'Descrição' },
            { field: 'preco_padrao', label: 'Preço Padrão' },
            { field: 'ativo', label: 'Ativo' }
        ];
        document.getElementById('table-servicos').innerHTML = criarTabelaHTML(servicos, colunas, 'servicos', 'id_servico');
    } catch (error) {
        console.error('Erro ao listar serviços:', error);
    }
}

async function salvarServico(event) {
    event.preventDefault();
    const id = document.getElementById('servicos-id').value;
    const data = {
        descricao: document.getElementById('servicos-descricao').value,
        preco_padrao: parseFloat(document.getElementById('servicos-preco_padrao').value),
        ativo: document.getElementById('servicos-ativo').checked
    };
    
    try {
        if (id) {
            await apiRequest(`/servicos/${id}`, 'PUT', data);
            alert('Serviço atualizado com sucesso!');
        } else {
            await apiRequest('/servicos', 'POST', data);
            alert('Serviço criado com sucesso!');
        }
        limparForm('servicos');
        listarServicos();
    } catch (error) {
        console.error('Erro ao salvar serviço:', error);
    }
}

async function editarServico(id) {
    try {
        const servico = await apiRequest(`/servicos/${id}`);
        document.getElementById('servicos-id').value = servico.id_servico;
        document.getElementById('servicos-descricao').value = servico.descricao || '';
        document.getElementById('servicos-preco_padrao').value = servico.preco_padrao || '';
        document.getElementById('servicos-ativo').checked = servico.ativo || false;
    } catch (error) {
        console.error('Erro ao editar serviço:', error);
    }
}

async function deletarServico(id) {
    if (!confirm('Tem certeza que deseja deletar este serviço?')) return;
    try {
        await apiRequest(`/servicos/${id}`, 'DELETE');
        alert('Serviço deletado com sucesso!');
        listarServicos();
    } catch (error) {
        console.error('Erro ao deletar serviço:', error);
    }
}

// ========== PEÇAS ==========
async function listarPecas() {
    try {
        const pecas = await apiRequest('/pecas');
        const colunas = [
            { field: 'id_peca', label: 'ID' },
            { field: 'descricao', label: 'Descrição' },
            { field: 'preco_unitario', label: 'Preço Unitário' },
            { field: 'estoque', label: 'Estoque' }
        ];
        document.getElementById('table-pecas').innerHTML = criarTabelaHTML(pecas, colunas, 'pecas', 'id_peca');
    } catch (error) {
        console.error('Erro ao listar peças:', error);
    }
}

async function salvarPeca(event) {
    event.preventDefault();
    const id = document.getElementById('pecas-id').value;
    const data = {
        descricao: document.getElementById('pecas-descricao').value,
        preco_unitario: parseFloat(document.getElementById('pecas-preco_unitario').value),
        estoque: parseInt(document.getElementById('pecas-estoque').value)
    };
    
    try {
        if (id) {
            await apiRequest(`/pecas/${id}`, 'PUT', data);
            alert('Peça atualizada com sucesso!');
        } else {
            await apiRequest('/pecas', 'POST', data);
            alert('Peça criada com sucesso!');
        }
        limparForm('pecas');
        listarPecas();
    } catch (error) {
        console.error('Erro ao salvar peça:', error);
    }
}

async function editarPeca(id) {
    try {
        const peca = await apiRequest(`/pecas/${id}`);
        document.getElementById('pecas-id').value = peca.id_peca;
        document.getElementById('pecas-descricao').value = peca.descricao || '';
        document.getElementById('pecas-preco_unitario').value = peca.preco_unitario || '';
        document.getElementById('pecas-estoque').value = peca.estoque || '';
    } catch (error) {
        console.error('Erro ao editar peça:', error);
    }
}

async function deletarPeca(id) {
    if (!confirm('Tem certeza que deseja deletar esta peça?')) return;
    try {
        await apiRequest(`/pecas/${id}`, 'DELETE');
        alert('Peça deletada com sucesso!');
        listarPecas();
    } catch (error) {
        console.error('Erro ao deletar peça:', error);
    }
}

// ========== ITENS SERVIÇO ==========
async function listarItensServico() {
    try {
        const itens = await apiRequest('/itens_servico');
        const colunas = [
            { field: 'id_item', label: 'ID' },
            { field: 'id_ordem', label: 'ID Ordem' },
            { field: 'id_servico', label: 'ID Serviço' },
            { field: 'quantidade', label: 'Quantidade' },
            { field: 'preco_unitario', label: 'Preço Unitário' },
            { field: 'subtotal', label: 'Subtotal' }
        ];
        document.getElementById('table-itens_servico').innerHTML = criarTabelaHTML(itens, colunas, 'itens_servico', 'id_item');
    } catch (error) {
        console.error('Erro ao listar itens serviço:', error);
    }
}

async function salvarItemServico(event) {
    event.preventDefault();
    const id = document.getElementById('itens_servico-id').value;
    const data = {
        id_ordem: parseInt(document.getElementById('itens_servico-id_ordem').value),
        id_servico: parseInt(document.getElementById('itens_servico-id_servico').value),
        quantidade: parseInt(document.getElementById('itens_servico-quantidade').value),
        preco_unitario: parseFloat(document.getElementById('itens_servico-preco_unitario').value),
        subtotal: parseFloat(document.getElementById('itens_servico-subtotal').value)
    };
    
    try {
        if (id) {
            await apiRequest(`/itens_servico/${id}`, 'PUT', data);
            alert('Item serviço atualizado com sucesso!');
        } else {
            await apiRequest('/itens_servico', 'POST', data);
            alert('Item serviço criado com sucesso!');
        }
        limparForm('itens_servico');
        listarItensServico();
    } catch (error) {
        console.error('Erro ao salvar item serviço:', error);
    }
}

async function editarItemServico(id) {
    try {
        const item = await apiRequest(`/itens_servico/${id}`);
        document.getElementById('itens_servico-id').value = item.id_item;
        document.getElementById('itens_servico-id_ordem').value = item.id_ordem || '';
        document.getElementById('itens_servico-id_servico').value = item.id_servico || '';
        document.getElementById('itens_servico-quantidade').value = item.quantidade || '';
        document.getElementById('itens_servico-preco_unitario').value = item.preco_unitario || '';
        document.getElementById('itens_servico-subtotal').value = item.subtotal || '';
    } catch (error) {
        console.error('Erro ao editar item serviço:', error);
    }
}

async function deletarItemServico(id) {
    if (!confirm('Tem certeza que deseja deletar este item serviço?')) return;
    try {
        await apiRequest(`/itens_servico/${id}`, 'DELETE');
        alert('Item serviço deletado com sucesso!');
        listarItensServico();
    } catch (error) {
        console.error('Erro ao deletar item serviço:', error);
    }
}

// ========== ITENS PEÇA ==========
async function listarItensPeca() {
    try {
        const itens = await apiRequest('/itens_peca');
        const colunas = [
            { field: 'id_item_peca', label: 'ID' },
            { field: 'id_ordem', label: 'ID Ordem' },
            { field: 'id_peca', label: 'ID Peça' },
            { field: 'quantidade', label: 'Quantidade' },
            { field: 'preco_unitario', label: 'Preço Unitário' },
            { field: 'subtotal', label: 'Subtotal' }
        ];
        document.getElementById('table-itens_peca').innerHTML = criarTabelaHTML(itens, colunas, 'itens_peca', 'id_item_peca');
    } catch (error) {
        console.error('Erro ao listar itens peça:', error);
    }
}

async function salvarItemPeca(event) {
    event.preventDefault();
    const id = document.getElementById('itens_peca-id').value;
    const data = {
        id_ordem: parseInt(document.getElementById('itens_peca-id_ordem').value),
        id_peca: parseInt(document.getElementById('itens_peca-id_peca').value),
        quantidade: parseInt(document.getElementById('itens_peca-quantidade').value),
        preco_unitario: parseFloat(document.getElementById('itens_peca-preco_unitario').value),
        subtotal: parseFloat(document.getElementById('itens_peca-subtotal').value)
    };
    
    try {
        if (id) {
            await apiRequest(`/itens_peca/${id}`, 'PUT', data);
            alert('Item peça atualizado com sucesso!');
        } else {
            await apiRequest('/itens_peca', 'POST', data);
            alert('Item peça criado com sucesso!');
        }
        limparForm('itens_peca');
        listarItensPeca();
    } catch (error) {
        console.error('Erro ao salvar item peça:', error);
    }
}

async function editarItemPeca(id) {
    try {
        const item = await apiRequest(`/itens_peca/${id}`);
        document.getElementById('itens_peca-id').value = item.id_item_peca;
        document.getElementById('itens_peca-id_ordem').value = item.id_ordem || '';
        document.getElementById('itens_peca-id_peca').value = item.id_peca || '';
        document.getElementById('itens_peca-quantidade').value = item.quantidade || '';
        document.getElementById('itens_peca-preco_unitario').value = item.preco_unitario || '';
        document.getElementById('itens_peca-subtotal').value = item.subtotal || '';
    } catch (error) {
        console.error('Erro ao editar item peça:', error);
    }
}

async function deletarItemPeca(id) {
    if (!confirm('Tem certeza que deseja deletar este item peça?')) return;
    try {
        await apiRequest(`/itens_peca/${id}`, 'DELETE');
        alert('Item peça deletado com sucesso!');
        listarItensPeca();
    } catch (error) {
        console.error('Erro ao deletar item peça:', error);
    }
}

// ========== SERVIÇOS REALIZADOS ==========
async function listarServicosRealizados() {
    try {
        const servicos = await apiRequest('/servicos_realizados');
        const colunas = [
            { field: 'id_execucao', label: 'ID' },
            { field: 'id_ordem', label: 'ID Ordem' },
            { field: 'id_funcionario', label: 'ID Funcionário' },
            { field: 'id_servico', label: 'ID Serviço' },
            { field: 'tempo_gasto', label: 'Tempo Gasto' }
        ];
        document.getElementById('table-servicos_realizados').innerHTML = criarTabelaHTML(servicos, colunas, 'servicos_realizados', 'id_execucao');
    } catch (error) {
        console.error('Erro ao listar serviços realizados:', error);
    }
}

async function salvarServicoRealizado(event) {
    event.preventDefault();
    const id = document.getElementById('servicos_realizados-id').value;
    const data = {
        id_ordem: parseInt(document.getElementById('servicos_realizados-id_ordem').value),
        id_funcionario: parseInt(document.getElementById('servicos_realizados-id_funcionario').value),
        id_servico: parseInt(document.getElementById('servicos_realizados-id_servico').value),
        tempo_gasto: parseInt(document.getElementById('servicos_realizados-tempo_gasto').value)
    };
    
    try {
        if (id) {
            await apiRequest(`/servicos_realizados/${id}`, 'PUT', data);
            alert('Serviço realizado atualizado com sucesso!');
        } else {
            await apiRequest('/servicos_realizados', 'POST', data);
            alert('Serviço realizado criado com sucesso!');
        }
        limparForm('servicos_realizados');
        listarServicosRealizados();
    } catch (error) {
        console.error('Erro ao salvar serviço realizado:', error);
    }
}

async function editarServicoRealizado(id) {
    try {
        const servico = await apiRequest(`/servicos_realizados/${id}`);
        document.getElementById('servicos_realizados-id').value = servico.id_execucao;
        document.getElementById('servicos_realizados-id_ordem').value = servico.id_ordem || '';
        document.getElementById('servicos_realizados-id_funcionario').value = servico.id_funcionario || '';
        document.getElementById('servicos_realizados-id_servico').value = servico.id_servico || '';
        document.getElementById('servicos_realizados-tempo_gasto').value = servico.tempo_gasto || '';
    } catch (error) {
        console.error('Erro ao editar serviço realizado:', error);
    }
}

async function deletarServicoRealizado(id) {
    if (!confirm('Tem certeza que deseja deletar este serviço realizado?')) return;
    try {
        await apiRequest(`/servicos_realizados/${id}`, 'DELETE');
        alert('Serviço realizado deletado com sucesso!');
        listarServicosRealizados();
    } catch (error) {
        console.error('Erro ao deletar serviço realizado:', error);
    }
}

// Carregar dados iniciais quando a página carregar
window.addEventListener('DOMContentLoaded', () => {
    listarClientes();
});

