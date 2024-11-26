const express = require('express');
const session = require('express-session');

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(process.cwb(),'./pages/public')));

const porta = 3000;
const host = '0.0.0.0';

let listaProdutos = [];

// Função para exibir o formulário de cadastro de produtos
function cadastroProdutoView(req, resp, errors = {}, valores = {}) {
    resp.send(`
        <html>
            <head>
                <title>Cadastro de Produto</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body {
                        background-color: #f8f9fa;
                        font-family: Arial, sans-serif;
                    }
                    .container {
                        display: flex;
                        justify-content: space-between;
                        margin-top: 50px;
                        gap: 20px;
                    }
                    .form-section, .table-section {
                        flex: 1;
                        background-color: white;
                        padding: 20px;
                        border-radius: 5px;
                        box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                        font-size: 2.5em;
                        color: #343a40;
                        margin-bottom: 20px;
                        text-align: center;
                    }
                    .form-control {
                        border-radius: 0.25rem;
                        padding: 10px;
                        font-size: 1rem;
                    }
                    .form-label {
                        font-weight: bold;
                        color: #495057;
                    }
                    .btn-primary, .btn-secondary {
                        border: none;
                        padding: 10px 20px;
                        font-size: 1.1rem;
                        transition: background-color 0.3s ease;
                    }
                    .btn-primary {
                        background-color: #007bff;
                    }
                    .btn-primary:hover {
                        background-color: #0056b3;
                    }
                    .btn-secondary {
                        background-color: #6c757d;
                    }
                    .btn-secondary:hover {
                        background-color: #5a6268;
                    }
                    .table {
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
                <div class="container">
                    <!-- Formulário -->
                    <div class="form-section">
                        <h1>Cadastro de Produto</h1>
                        <form method="POST" action="/cadastrarProduto" class="row g-3" novalidate>
                            <div class="col-md-6">
                                <label for="codigoBarras" class="form-label">Código de Barras</label>
                                <input type="text" class="form-control ${errors.codigoBarras ? 'is-invalid' : ''}" id="codigoBarras" name="codigoBarras" placeholder="Código de barras" value="${valores.codigoBarras || ''}">
                                <div class="invalid-feedback">${errors.codigoBarras || ''}</div>
                            </div>
                            <div class="col-md-6">
                                <label for="descricao" class="form-label">Descrição do Produto</label>
                                <input type="text" class="form-control ${errors.descricao ? 'is-invalid' : ''}" id="descricao" name="descricao" placeholder="Descrição" value="${valores.descricao || ''}">
                                <div class="invalid-feedback">${errors.descricao || ''}</div>
                            </div>
                            <div class="col-md-4">
                                <label for="precoCusto" class="form-label">Preço de Custo</label>
                                <input type="number" class="form-control ${errors.precoCusto ? 'is-invalid' : ''}" id="precoCusto" name="precoCusto" step="0.01" placeholder="Preço de custo" value="${valores.precoCusto || ''}">
                                <div class="invalid-feedback">${errors.precoCusto || ''}</div>
                            </div>
                            <div class="col-md-4">
                                <label for="precoVenda" class="form-label">Preço de Venda</label>
                                <input type="number" class="form-control ${errors.precoVenda ? 'is-invalid' : ''}" id="precoVenda" name="precoVenda" step="0.01" placeholder="Preço de venda" value="${valores.precoVenda || ''}">
                                <div class="invalid-feedback">${errors.precoVenda || ''}</div>
                            </div>
                            <div class="col-md-4">
                                <label for="dataValidade" class="form-label">Data de Validade</label>
                                <input type="date" class="form-control ${errors.dataValidade ? 'is-invalid' : ''}" id="dataValidade" name="dataValidade" value="${valores.dataValidade || ''}">
                                <div class="invalid-feedback">${errors.dataValidade || ''}</div>
                            </div>
                            <div class="col-md-6">
                                <label for="quantidadeEstoque" class="form-label">Quantidade em Estoque</label>
                                <input type="number" class="form-control ${errors.quantidadeEstoque ? 'is-invalid' : ''}" id="quantidadeEstoque" name="quantidadeEstoque" placeholder="Qtd em estoque" value="${valores.quantidadeEstoque || ''}">
                                <div class="invalid-feedback">${errors.quantidadeEstoque || ''}</div>
                            </div>
                            <div class="col-md-6">
                                <label for="fabricante" class="form-label">Nome do Fabricante</label>
                                <input type="text" class="form-control ${errors.fabricante ? 'is-invalid' : ''}" id="fabricante" name="fabricante" placeholder="Fabricante" value="${valores.fabricante || ''}">
                                <div class="invalid-feedback">${errors.fabricante || ''}</div>
                            </div>
                            <div class="col-12">
                                <button class="btn btn-primary" type="submit">Cadastrar</button>
                                <a href="/" class="btn btn-secondary">Voltar para o Menu</a>
                            </div>
                        </form>
                    </div>
                    <!-- Tabela -->
                    <div class="table-section">
                        <h2>Produtos Cadastrados</h2>
                        <table class="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>Código de Barras</th>
                                    <th>Descrição</th>
                                    <th>Preço de Custo</th>
                                    <th>Preço de Venda</th>
                                    <th>Data de Validade</th>
                                    <th>Qtd em Estoque</th>
                                    <th>Fabricante</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${listaProdutos.map(produto => `
                                    <tr>
                                        <td>${produto.codigoBarras}</td>
                                        <td>${produto.descricao}</td>
                                        <td>${produto.precoCusto}</td>
                                        <td>${produto.precoVenda}</td>
                                        <td>${produto.dataValidade}</td>
                                        <td>${produto.quantidadeEstoque}</td>
                                        <td>${produto.fabricante}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
        </html>
    `);
}



// Função para cadastrar o produto e validar os dados
function cadastrarProduto(req, resp) {
    const { codigoBarras, descricao, precoCusto, precoVenda, dataValidade, quantidadeEstoque, fabricante } = req.body;

    // Validação de todos os campos
    const errors = {};
    if (!codigoBarras) errors.codigoBarras = "Código de Barras é obrigatório.";
    if (!descricao) errors.descricao = "Descrição do Produto é obrigatória.";
    if (!precoCusto) errors.precoCusto = "Preço de Custo é obrigatório.";
    if (!precoVenda) errors.precoVenda = "Preço de Venda é obrigatório.";
    if (!dataValidade) errors.dataValidade = "Data de Validade é obrigatória.";
    if (!quantidadeEstoque) errors.quantidadeEstoque = "Quantidade em Estoque é obrigatória.";
    if (!fabricante) errors.fabricante = "Nome do Fabricante é obrigatório.";

    if (Object.keys(errors).length > 0) {
        cadastroProdutoView(req, resp, errors, req.body);
    } else {
        listaProdutos.push({ codigoBarras, descricao, precoCusto, precoVenda, dataValidade, quantidadeEstoque, fabricante });
        cadastroProdutoView(req, resp);
    }
}


function menuView(req, resp) {
    const ultimoAcesso = req.cookies['ultimoAcesso'];
    if(!ultimoAcesso){
        ultimoAcesso='';
    }
    resp.send(`
        <html>
            <head>
                <title>Menu</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body { display: flex; min-height: 100vh; background-color: #f8f9fa; }
                    .sidebar { width: 250px; background-color: #343a40; color: white; padding-top: 20px; }
                    .sidebar a { color: white; padding: 15px; text-decoration: none; display: block; font-weight: 500; }
                    .sidebar a:hover { background-color: #495057; }
                    .content { flex-grow: 1; padding: 20px; }
                    .navbar-brand { font-weight: 600; font-size: 18px; padding-left: 15px; }
                    .logout-btn { margin: 15px; background-color: #dc3545; color: white; border: none; padding: 10px 20px; text-align: center; border-radius: 5px; cursor: pointer; }
                    .logout-btn:hover { background-color: #bb2d3b; }
                </style>
            </head>
            <body>
                <div class="sidebar">
                    <a class="navbar-brand" href="#">MENU</a>
                    <a class="nav-link" href="/cadastrarProduto">Cadastrar Produto</a>
                    <form action="/logout" method="POST" class="mt-3">
                        <button type="submit" class="logout-btn">Sair</button>
                    </form>
                </div>
                <div class="content">
                    <h2>Bem-vindo ao sistema de gerenciamento de produtos</h2>
                    <p>Seu último acesso foi realizado em: ${ultimoAcesso}</p>
                </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
        </html>
    `);
}



app.use(session({
    secret: 'chave-secreta',
    resave: false,
    saveUninitialized: true,
}));


// Validação de login
app.post('/login', (req, resp) => {
    const { usuario, senha } = req.body;
    if (usuario === 'admin' && senha === '123') { // Exemplo de autenticação
        req.session.usuario = usuario;
        resp.cookie('dataHoraUltimoLogin', new Date().toLocaleString(), {maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true});
        resp.redirect('/');
    } else {
        resp.send(`<html>
        <head>
            <title>Login Inválido</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body {
                    background-color: #f8f9fa;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    font-family: Arial, sans-serif;
                }
                .message-box {
                    text-align: center;
                    background-color: white;
                    border: 1px solid #dee2e6;
                    padding: 30px;
                    border-radius: 8px;
                    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    font-size: 2rem;
                    color: #dc3545;
                    margin-bottom: 20px;
                }
                p {
                    font-size: 1.2rem;
                    color: #495057;
                    margin-bottom: 30px;
                }
                .btn-primary {
                    background-color: #007bff;
                    border: none;
                    padding: 10px 20px;
                    font-size: 1rem;
                    text-decoration: none;
                    color: white;
                    border-radius: 5px;
                    transition: background-color 0.3s ease;
                }
                .btn-primary:hover {
                    background-color: #0056b3;
                }
            </style>
            <meta charset="utf-8">
        </head>
        <body>
            <div class="message-box">
                <h1>Login Inválido</h1>
                <p>O nome de usuário ou senha está incorreto. Por favor, tente novamente.</p>
                <a href="/login.html" class="btn btn-primary">Tentar Novamente</a>
            </div>
        </body>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    </html>`);
    }
});

// Middleware para verificar login
function verificarAutenticacao(req, resp, next) {
    if (req.session.usuario) {
        next();
    } else {
        resp.redirect('/login.html');
    }
}

function logout(req, resp) {
    // Limpa os cookies e redireciona para a página de login
    resp.clearCookie('ultimoAcesso');
    resp.redirect('/login.html');
}

// Proteger rotas com middleware
app.use(verificarAutenticacao);

app.use(cookieParser());

// Middleware para registrar último acesso
app.use((req, resp, next) => {
    const ultimoAcesso = req.cookies.ultimoAcesso || 'Primeiro acesso';
    console.log(`Último acesso: ${ultimoAcesso}`);
    const agora = new Date().toLocaleString();
    resp.cookie('ultimoAcesso', agora, { maxAge: 24 * 60 * 60 * 1000 }); // 1 dia
    next();
});

app.get('/', verificarAutenticacao, menuView);

// Rota para a página de cadastro de produtos
app.get('/cadastrarProduto', verificarAutenticacao, cadastroProdutoView);
// POST para cadastrar um produto
app.post('/cadastrarProduto', verificarAutenticacao, cadastrarProduto);
// POST de login
app.post('/login', verificarAutenticacao, menuView);
//POST PARA SAIR
app.post('/logout', logout);

app.listen(porta, host, () => {
    console.log(`Servidor iniciado em http://${host}:${porta}`);
});
