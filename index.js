// database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Configuração do banco de dados
const dbPath = path.join(__dirname, 'banco.db');
const db = new sqlite3.Database(dbPath);

// Função para inicializar o banco de dados
function inicializarBanco() {
    db.serialize(() => {
        console.log('Criando tabelas...');
        
        // Tabela de usuários
        db.run(`CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario TEXT NOT NULL UNIQUE,
            senha TEXT NOT NULL,
            nome TEXT NOT NULL,
            email TEXT,
            criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
            atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
        
        // Tabela de veículos
        db.run(`CREATE TABLE IF NOT EXISTS veiculos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            placa TEXT NOT NULL UNIQUE,
            modelo TEXT NOT NULL,
            cor TEXT NOT NULL,
            proprietario TEXT NOT NULL,
            telefone TEXT NOT NULL,
            observacoes TEXT,
            criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
            atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
        
        // Tabela de logs
        db.run(`CREATE TABLE IF NOT EXISTS logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER,
            acao TEXT NOT NULL,
            descricao TEXT,
            tabela_afetada TEXT,
            registro_id INTEGER,
            criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
        )`);
        
        // Inserir usuário admin padrão se não existir
        db.get("SELECT COUNT(*) as count FROM usuarios WHERE usuario = 'admin'", (err, row) => {
            if (row.count === 0) {
                db.run("INSERT INTO usuarios (usuario, senha, nome, email) VALUES ('admin', 'admin@@', 'Administrador', 'admin@fmp.com')");
                console.log('Usuário admin criado.');
            }
        });
        
        // Criar índices
        db.run("CREATE INDEX IF NOT EXISTS idx_veiculos_placa ON veiculos(placa)");
        db.run("CREATE INDEX IF NOT EXISTS idx_veiculos_proprietario ON veiculos(proprietario)");
        db.run("CREATE INDEX IF NOT EXISTS idx_usuarios_usuario ON usuarios(usuario)");
        
        console.log('Banco de dados inicializado com sucesso!');
    });
}

// Função para fechar a conexão com o banco
function fecharBanco() {
    db.close((err) => {
        if (err) {
            console.error('Erro ao fechar o banco:', err.message);
        } else {
            console.log('Conexão com o banco fechada.');
        }
    });
}

module.exports = {
    db,
    inicializarBanco,
    fecharBanco
};