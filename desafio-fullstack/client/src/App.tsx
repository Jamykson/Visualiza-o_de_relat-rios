import { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Venda {
  id: number;
  produto: string;
  categoria: string;
  quantidade: number;
  valorTotal: number;
  data: string;
}

function App() {
  const API_URL = "https://sturdy-acorn-p5xrw5p5x65h6x4p-3001.app.github.dev"; 

  const [vendas, setVendas] = useState<Venda[]>([]);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const resposta = await axios.get(`${API_URL}/relatorio`);
      setVendas(resposta.data);
    } catch (erro) {
      console.error("Erro:", erro);
    }
  };

  const vendasFiltradas = vendas.filter(venda => 
    venda.produto.toLowerCase().includes(filtro.toLowerCase()) ||
    venda.categoria.toLowerCase().includes(filtro.toLowerCase())
  );

// DESIGN DO PDF
const gerarPDF = () => {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();

  //1. CABEÇALHO COM FAIXA
  doc.setFillColor("#c1e4c2"); //Verde
  doc.rect(0, 0, pageWidth, 30, "F");

  const imgLogo = new Image();
  imgLogo.src = "/favicon.png";
  doc.addImage(imgLogo, "PNG", 14, 8, 12, 12);

  doc.setTextColor("black");
  doc.setFontSize(20);
  doc.text("Relatório de Vendas", 30, 17);

  doc.setFontSize(10);
  doc.text(
    `Emitido em: ${new Date().toLocaleDateString("pt-BR")}`,
    pageWidth - 14,
    17,
    { align: "right" }
  );

  //2. CARDS DE RESUMO
  const faturamentoTotal = vendasFiltradas.reduce(
    (acc, v) => acc + v.valorTotal,
    0
  );
  const totalItens = vendasFiltradas.reduce(
    (acc, v) => acc + v.quantidade,
    0
  );
  const totalRegistros = vendasFiltradas.length;

  const startCardsY = 40;
  const cardWidth = (pageWidth - 40) / 3;

  const drawCard = (x, title, value) => {
    doc.setFillColor(245, 247, 255);
    doc.roundedRect(x, startCardsY, cardWidth, 20, 3, 3, "F");

    doc.setTextColor(55, 65, 81);
    doc.setFontSize(10);
    doc.text(title, x + 5, startCardsY + 7);

    doc.setFontSize(14);
    doc.setTextColor("#16a34a");
    doc.text(value, x + 5, startCardsY + 15);
  };

  drawCard(14, "Faturamento Total", `R$ ${faturamentoTotal.toFixed(2)}`);
  drawCard(14 + cardWidth + 6, "Itens Vendidos", totalItens.toString());
  drawCard(
    14 + (cardWidth + 6) * 2,
    "Registros",
    totalRegistros.toString()
  );

  //3. TABELA DE DADOS
  autoTable(doc, {
    startY: startCardsY + 30,
    head: [["Produto", "Categoria", "Qtd", "Valor (R$)", "Data"]],
    body: vendasFiltradas.map(v => [
      v.produto,
      v.categoria,
      v.quantidade,
      `R$ ${v.valorTotal.toFixed(2)}`,
      new Date(v.data).toLocaleDateString("pt-BR")
    ]),
    theme: "striped",
    headStyles: {
      fillColor: ["#16a34a"],
      textColor: 255,
      halign: "center",
      fontSize: 10
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [55, 65, 81]
    },
    columnStyles: {
      2: { halign: "center" }, // Qtd
      3: { halign: "right", fontStyle: "bold" }, // Valor
      4: { halign: "center" } // Data
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250]
    },
    margin: { left: 14, right: 14 }
  });

  //4. RODAPÉ
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Relatório gerado automaticamente • Página ${i} de ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  //5. ABRIR PDF
  doc.setProperties({
    title: "Relatório de Vendas", 
  });
  const pdfUrl = doc.output("bloburl");
  window.open(pdfUrl, "_blank");
};


  return (
    <div className="min-h-screen bg-[#f6fbf7] p-8 font-sans">
      <div className="max-w-5xl mx-auto bg-[#c1e4c2] shadow-xl rounded-lg p-8">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold text-black">
            <img src="/favicon.png" alt="favicon" width={60} className="inline-block align-middle mr-2" /> 
              Relatório de Vendas</h1>
          
          <button 
            onClick={gerarPDF} 
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded shadow transition"
          >
            Exportar PDF
          </button>
        </div>

        <div className="mb-6">
          <input 
            type="text"
            placeholder="🔎 Filtrar..."
            className="w-full p-3 border border-gray-300 rounded-lg outline-none"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Produto</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase">Qtd</th>
                <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase">Valor Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vendasFiltradas.map((venda) => (
                <tr key={venda.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">{venda.produto}</td>
                  <td className="py-4 px-6 text-sm text-gray-500">{venda.categoria}</td>
                  <td className="py-4 px-6 text-sm text-center text-gray-500">{venda.quantidade}</td>
                  <td className="py-4 px-6 text-sm text-right font-bold text-emerald-600">R$ {venda.valorTotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;