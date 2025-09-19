const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { query, inicializarBanco } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

inicializarBanco();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Listar veículos
app.get('/veiculos', async (req, res) => {
    try {
        const result = await query('SELECT * FROM veiculos ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Adicionar veículo
app.post('/veiculos', async (req, res) => {
    const { placa, modelo, cor, proprietario, telefone, observacoes } = req.body;
    try {
        const result = await query(
            `INSERT INTO veiculos (placa, modelo, cor, proprietario, telefone, observacoes)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [placa, modelo, cor, proprietario, telefone, observacoes]
        );
        res.json({ message: 'Veículo adicionado', veiculo: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Servir index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
