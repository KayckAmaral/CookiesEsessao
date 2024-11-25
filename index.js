import express from 'express';

const app = express();

app.use(express.urlencoded({ extended: true }));

const porta = 3000;
const host = '0.0.0.0';

let listaEmpresas = [];

function cadastroEmpresaView(req, resp, errors = {}, valores = {}) {
    resp.send(`
        <html>
            <head>
                <title>Cadastro de Empresa</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body {
                        background-color: #f8f9fa;
                        font-family: Arial, sans-serif;
                    }
                    .container {
                        max-width: 800px;
                        margin-top: 50px;
                    }
                    h1 {
                        font-size: 2.5em;
                        color: #343a40;
                        margin-bottom: 20px;
                    }
                    .form-control, .form-select {
                        border-radius: 0.25rem;
                        padding: 10px;
                        font-size: 1rem;
                    }
                    .form-label {
                        font-weight: bold;
                        color: #495057;
                    }
                   
                    .btn-primary {
                        background-color: #007bff;
                        border: none;
                        padding: 10px 20px;
                        font-size: 1.1rem;
                        transition: background-color 0.3s ease;
                    }
                    .btn-primary:hover {
                        background-color: #0056b3;
                    }
                    .table {
                        margin-top: 30px;
                        border-collapse: separate;
                        border-spacing: 0 10px;
                    }
                    .table thead th {
                        background-color: #343a40;
                        color: #fff;
                        font-weight: bold;
                    }
                    .table tbody tr {
                        background-color: #fff;
                        transition: box-shadow 0.3s ease;
                    }
                    .table tbody tr:hover {
                        box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
                    }
                    .invalid-feedback {
                        display: block;
                        color: #dc3545;
                    }
                </style>
                <meta charset="utf-8">
            </head>
            <body>
                <div class="container text-center">
                    <h1>Cadastro de Empresa</h1>
                    <form method="POST" action="/cadastrarEmpresa" class="border p-4 row g-3 shadow-sm bg-white rounded" novalidate>
                        <div class="col-md-6">
                            <label for="cnpj" class="form-label">CNPJ</label>
                            <input type="text" class="form-control ${errors.cnpj ? 'is-invalid' : ''}" id="cnpj" name="cnpj" placeholder="Digite o CNPJ" value="${valores.cnpj || ''}">
                            <div class="invalid-feedback">${errors.cnpj || ''}</div>
                        </div>
                        <div class="col-md-6">
                            <label for="razaoSocial" class="form-label">Razão Social</label>
                            <input type="text" class="form-control ${errors.razaoSocial ? 'is-invalid' : ''}" id="razaoSocial" name="razaoSocial" placeholder="Ex: Moraes & Irmãos Ltda" value="${valores.razaoSocial || ''}">
                            <div class="invalid-feedback">${errors.razaoSocial || ''}</div>
                        </div>
                        <div class="col-md-6">
                            <label for="nomeFantasia" class="form-label">Nome Fantasia</label>
                            <input type="text" class="form-control ${errors.nomeFantasia ? 'is-invalid' : ''}" id="nomeFantasia" name="nomeFantasia" placeholder="Ex: Loja do 1,99" value="${valores.nomeFantasia || ''}">
                            <div class="invalid-feedback">${errors.nomeFantasia || ''}</div>
                        </div>
                        <div class="col-md-6">
                            <label for="endereco" class="form-label">Endereço</label>
                            <input type="text" class="form-control ${errors.endereco ? 'is-invalid' : ''}" id="endereco" name="endereco" placeholder="Rua, número, complemento" value="${valores.endereco || ''}">
                            <div class="invalid-feedback">${errors.endereco || ''}</div>
                        </div>
                        <div class="col-md-4">
                            <label for="cidade" class="form-label">Cidade</label>
                            <input type="text" class="form-control ${errors.cidade ? 'is-invalid' : ''}" id="cidade" name="cidade" placeholder="Digite a cidade" value="${valores.cidade || ''}">
                            <div class="invalid-feedback">${errors.cidade || ''}</div>
                        </div>
                        <div class="col-md-2">
                            <label for="uf" class="form-label">UF</label>
                            <select class="form-select ${errors.uf ? 'is-invalid' : ''}" id="uf" name="uf">
                                <option selected value="">Selecione</option>
                                <option value="SP" ${valores.uf === 'SP' ? 'selected' : ''}>São Paulo</option>
                                <option value="RJ" ${valores.uf === 'RJ' ? 'selected' : ''}>Rio de Janeiro</option>
                            </select>
                            <div class="invalid-feedback">${errors.uf || ''}</div>
                        </div>
                        <div class="col-md-4">
                            <label for="cep" class="form-label">CEP</label>
                            <input type="text" class="form-control ${errors.cep ? 'is-invalid' : ''}" id="cep" name="cep" value="${valores.cep || ''}">
                            <div class="invalid-feedback">${errors.cep || ''}</div>
                        </div>
                        <div class="col-md-6">
                            <label for="email" class="form-label">Email</label>
                            <input type="email" class="form-control ${errors.email ? 'is-invalid' : ''}" id="email" name="email" placeholder="exemplo@empresa.com" value="${valores.email || ''}">
                            <div class="invalid-feedback">${errors.email || ''}</div>
                        </div>
                        <div class="col-md-6">
                            <label for="telefone" class="form-label">Telefone</label>
                            <input type="text" class="form-control ${errors.telefone ? 'is-invalid' : ''}" id="telefone" name="telefone" placeholder="(XX) XXXXX-XXXX" value="${valores.telefone || ''}">
                            <div class="invalid-feedback">${errors.telefone || ''}</div>
                        </div>
                        <div class="col-12">
                            <button class="btn btn-primary" type="submit">Cadastrar</button>
                        </div>
                    </form>
                    <hr>
                    <h2>Empresas Cadastradas</h2>
                    <table class="table table-striped table-hover shadow-sm">
                        <thead>
                            <tr>
                                <th>CNPJ</th>
                                <th>Razão Social</th>
                                <th>Nome Fantasia</th>
                                <th>Endereço</th>
                                <th>Cidade</th>
                                <th>UF</th>
                                <th>CEP</th>
                                <th>Email</th>
                                <th>Telefone</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${listaEmpresas.map(empresa => `
                                <tr>
                                    <td>${empresa.cnpj}</td>
                                    <td>${empresa.razaoSocial}</td>
                                    <td>${empresa.nomeFantasia}</td>
                                    <td>${empresa.endereco}</td>
                                    <td>${empresa.cidade}</td>
                                    <td>${empresa.uf}</td>
                                    <td>${empresa.cep}</td>
                                    <td>${empresa.email}</td>
                                    <td>${empresa.telefone}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
        </html>
    `);
}

// Função para cadastrar a empresa e validar os dados
function cadastrarEmpresa(req, resp) {
    const { cnpj, razaoSocial, nomeFantasia, endereco, cidade, uf, cep, email, telefone } = req.body;
    
    // Validação de todos os campos
    const errors = {};
    if (!cnpj) errors.cnpj = "CNPJ é obrigatório.";
    if (!razaoSocial) errors.razaoSocial = "Razão Social é obrigatória.";
    if (!nomeFantasia) errors.nomeFantasia = "Nome Fantasia é obrigatório.";
    if (!endereco) errors.endereco = "Endereço é obrigatório.";
    if (!cidade) errors.cidade = "Cidade é obrigatória.";
    if (!uf) errors.uf = "UF é obrigatório.";
    if (!cep) errors.cep = "CEP é obrigatório.";
    if (!email) errors.email = "Email é obrigatório.";
    if (!telefone) errors.telefone = "Telefone é obrigatório.";
    
    if (Object.keys(errors).length > 0) {
        cadastroEmpresaView(req, resp, errors, req.body);
    } else {
        listaEmpresas.push({ cnpj, razaoSocial, nomeFantasia, endereco, cidade, uf, cep, email, telefone });
        cadastroEmpresaView(req, resp);
    }
}

app.get('/', (req, resp) => cadastroEmpresaView(req, resp));
app.post('/cadastrarEmpresa', cadastrarEmpresa);

app.listen(porta, host, () => {
    console.log(`Servidor iniciado em http://${host}:${porta}`);
});
