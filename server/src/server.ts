// 1. Importamos as ferramentas necessárias
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

// 2. Iniciamos as ferramentas
const app = express();
const prisma = new PrismaClient({ log: ['info'] });
// 3. Configurações básicas
app.use(express.json()); // Permite que o servidor entenda dados em formato JSON
app.use(cors()); // Permite que o Frontend (que roda em outra porta) acesse esse Backend

// 4. A Rota (O item do menu)
app.get('/relatorio', async (request, response) => {
  // O passo a passo do que acontece quando alguém acessa essa rota:
  
  // A. Vai no banco e busca TODAS as vendas (sales)
  const vendas = await prisma.sale.findMany({
    orderBy: {
      date: 'desc' // (Opcional) Já traz ordenado da mais recente para a mais antiga
    }
  });

  // B. Devolve as vendas para quem pediu
  return response.json(vendas);
});

// 5. Coloca o servidor para rodar "escutando" na porta 3333
app.listen(3333, () => {
  console.log('🚀 Servidor HTTP rodando em http://localhost:3333');
});