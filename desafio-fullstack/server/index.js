const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors()); 

app.get('/relatorio', async (req, res) => {
  const { produto, categoria, dataInicio, dataFim } = req.query;

  try {
    const vendas = await prisma.venda.findMany({
      where: {
        
        produto: produto ? { contains: produto } : undefined,
        
        categoria: categoria ? { contains: categoria } : undefined,
        
        data: (dataInicio || dataFim) ? {
          gte: dataInicio ? new Date(dataInicio) : undefined,
          lte: dataFim ? new Date(dataFim) : undefined
        } : undefined
      },
      orderBy: {
        data: 'desc'
      }
    });

    res.json(vendas);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar vendas" });
  }
});

// Inicia o servidor na porta 3001
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});