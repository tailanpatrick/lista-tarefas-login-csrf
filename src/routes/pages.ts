import express from 'express';
import path from 'path';

const router = express.Router();

router.get('*', (req, res) => {
	// Envia o arquivo HTML principal para todas as requisições
	res.sendFile(path.resolve(__dirname, '../../public', 'index.html'));
});

module.exports = router;
