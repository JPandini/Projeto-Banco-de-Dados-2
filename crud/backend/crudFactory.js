const express = require('express');
const { sql, pool, poolConnect } = require('./db'); // <--- Importamos o 'pool' aqui

const createCrud = (tableName, idColumn) => {
    const router = express.Router();

    // 1. GET ALL
    router.get('/', async (req, res) => {
        try {
            await poolConnect; // Garante que conectou
            // CORREÇÃO: Usamos pool.request() em vez de new sql.Request()
            const result = await pool.request().query(`SELECT * FROM ${tableName}`);
            res.json(result.recordset);
        } catch (err) {
            console.error(err);
            res.status(500).send(err.message);
        }
    });

    // 2. GET BY ID
    router.get('/:id', async (req, res) => {
        try {
            await poolConnect;
            const request = pool.request(); // <--- CORREÇÃO
            request.input('id', sql.Int, req.params.id);
            const result = await request.query(`SELECT * FROM ${tableName} WHERE ${idColumn} = @id`);
            res.json(result.recordset[0]);
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // 3. CREATE (POST)
    router.post('/', async (req, res) => {
        try {
            await poolConnect;
            const request = pool.request(); // <--- CORREÇÃO
            
            const keys = Object.keys(req.body);
            keys.forEach(key => request.input(key, req.body[key]));

            const columns = keys.join(', ');
            const values = keys.map(key => `@${key}`).join(', ');

            const query = `INSERT INTO ${tableName} (${columns}) VALUES (${values}); SELECT SCOPE_IDENTITY() AS id;`;
            
            const result = await request.query(query);
            res.status(201).json({ message: 'Criado', id: result.recordset[0].id });
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // 4. UPDATE (PUT)
    router.put('/:id', async (req, res) => {
        try {
            await poolConnect;
            const request = pool.request(); // <--- CORREÇÃO
            request.input('id', sql.Int, req.params.id);
            
            const keys = Object.keys(req.body);
            keys.forEach(key => request.input(key, req.body[key]));

            const sets = keys.map(key => `${key} = @${key}`).join(', ');

            const query = `UPDATE ${tableName} SET ${sets} WHERE ${idColumn} = @id`;
            
            await request.query(query);
            res.json({ message: 'Atualizado com sucesso' });
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    // 5. DELETE
    router.delete('/:id', async (req, res) => {
        try {
            await poolConnect;
            const request = pool.request(); // <--- CORREÇÃO
            request.input('id', sql.Int, req.params.id);
            await request.query(`DELETE FROM ${tableName} WHERE ${idColumn} = @id`);
            res.json({ message: 'Deletado com sucesso' });
        } catch (err) {
            res.status(500).send(err.message);
        }
    });

    return router;
};

module.exports = createCrud;

