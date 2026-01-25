import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Limpa o banco antes de popular (para não duplicar se rodar 2 vezes)
  await prisma.sale.deleteMany()

  // Cria os 10 registros
  await prisma.sale.createMany({
    data: [
      { product: "Notebook Dell", category: "Eletrônicos", quantity: 1, total: 3500.00, date: new Date("2023-10-01") },
      { product: "Mouse Logitech", category: "Periféricos", quantity: 2, total: 120.00, date: new Date("2023-10-02") },
      { product: "Monitor LG 24", category: "Eletrônicos", quantity: 1, total: 800.00, date: new Date("2023-10-03") },
      { product: "Teclado Mecânico", category: "Periféricos", quantity: 1, total: 250.00, date: new Date("2023-10-04") },
      { product: "Cadeira Gamer", category: "Móveis", quantity: 1, total: 1200.00, date: new Date("2023-10-05") },
      { product: "Headset HyperX", category: "Áudio", quantity: 1, total: 400.00, date: new Date("2023-10-06") },
      { product: "Webcam Full HD", category: "Periféricos", quantity: 1, total: 300.00, date: new Date("2023-10-07") },
      { product: "Mesa de Escritório", category: "Móveis", quantity: 1, total: 600.00, date: new Date("2023-10-08") },
      { product: "Suporte Notebook", category: "Acessórios", quantity: 3, total: 150.00, date: new Date("2023-10-09") },
      { product: "Cabo HDMI 2m", category: "Cabos", quantity: 5, total: 100.00, date: new Date("2023-10-10") },
    ]
  })

  console.log("Banco de dados populado com sucesso!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })