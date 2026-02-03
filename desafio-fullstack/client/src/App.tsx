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
  // ⬇️ ATUALIZE COM SUA URL NOVA AQUI
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

  // 🎨 AQUI É ONDE CONFIGURAMOS O DESIGN DO PDF
  const gerarPDF = () => {
    const doc = new jsPDF();

    // 1. Cabeçalho limpo
    doc.setFontSize(20);
    doc.text("Relatório de Vendas", 14, 22);
    
    doc.setFontSize(10);
    doc.text(`Data de emissão: ${new Date().toLocaleDateString('pt-BR')}`, 14, 28);

    // 2. Tabela apenas com os dados
    autoTable(doc, {
      startY: 35,
      head: [['Produto', 'Categoria', 'Qtd', 'Valor (R$)', 'Data']], // Nomes das colunas
      body: vendasFiltradas.map(v => [
        v.produto,
        v.categoria,
        v.quantidade,
        v.valorTotal.toFixed(2),
        new Date(v.data).toLocaleDateString('pt-BR')
      ]),
      // Estilização (Opcional - para ficar bonito)
      headStyles: { fillColor: [63, 81, 181] }, // Cor azul no cabeçalho
      styles: { fontSize: 10 }, // Tamanho da letra
    });

    // 3. Salvar
    doc.save("relatorio_limpo.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-lg p-8">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800">📊 Relatório de Vendas</h1>
          
          {/* O botão agora chama a nossa função customizada, não o print do navegador */}
          <button 
            onClick={gerarPDF} 
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded shadow transition"
          >
            Baixar PDF Limpo
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