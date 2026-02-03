const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Limpa o banco antes de popular
  await prisma.venda.deleteMany({});

  const vendas = [
    { produto: "Notebook Dell", categoria: "Eletrônicos", quantidade: 1, valorTotal: 3500.00, data: new Date('2023-10-01') },
    { produto: "Mouse Logitech", categoria: "Periféricos", quantidade: 2, valorTotal: 150.00, data: new Date('2023-10-02') },
    { produto: "Teclado Mecânico", categoria: "Periféricos", quantidade: 1, valorTotal: 250.00, data: new Date('2023-10-03') },
    { produto: "Monitor Samsung", categoria: "Eletrônicos", quantidade: 1, valorTotal: 900.00, data: new Date('2023-10-04') },
    { produto: "Cadeira Gamer", categoria: "Móveis", quantidade: 1, valorTotal: 1200.00, data: new Date('2023-10-05') },
    { produto: "Headset HyperX", categoria: "Áudio", quantidade: 1, valorTotal: 400.00, data: new Date('2023-10-06') },
    { produto: "Cabo HDMI", categoria: "Acessórios", quantidade: 3, valorTotal: 60.00, data: new Date('2023-10-07') },
    { produto: "Webcam Logitech", categoria: "Periféricos", quantidade: 1, valorTotal: 300.00, data: new Date('2023-10-08') },
    { produto: "Mesa de Escritório", categoria: "Móveis", quantidade: 1, valorTotal: 500.00, data: new Date('2023-10-09') },
    { produto: "Suporte Monitor", categoria: "Acessórios", quantidade: 2, valorTotal: 100.00, data: new Date('2023-10-10') },
  ];

  for (const venda of vendas) {
    await prisma.venda.create({ data: venda });
  }
  console.log('Banco de dados populado com sucesso!');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());