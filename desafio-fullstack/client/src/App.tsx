import { useState, useEffect } from 'react';
import axios from 'axios';

interface Venda {
  id: number;
  produto: string;
  categoria: string;
  quantidade: number;
  valorTotal: number;
  data: string;
}

function App() {
  
  const API_URL = "https://cautious-eureka-57wqr7x7wrv2vw94-3001.app.github.dev"; 

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
      console.error("Erro ao buscar vendas:", erro);
      alert("Erro ao conectar! Verifique se a URL está correta e o servidor ligado.");
    }
  };

  const vendasFiltradas = vendas.filter(venda => 
    venda.produto.toLowerCase().includes(filtro.toLowerCase()) ||
    venda.categoria.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-lg p-8">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800">📊 Relatório de Vendas</h1>
          <button 
            onClick={() => window.print()} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded shadow transition"
          >
            Exportar PDF
          </button>
        </div>

        <div className="mb-6">
          <input 
            type="text"
            placeholder="🔎 Filtrar por produto ou categoria..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Qtd</th>
                <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Total</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vendasFiltradas.map((venda) => (
                <tr key={venda.id} className="hover:bg-gray-50 transition">
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">{venda.produto}</td>
                  <td className="py-4 px-6 text-sm text-gray-500">{venda.categoria}</td>
                  <td className="py-4 px-6 text-sm text-center text-gray-500">{venda.quantidade}</td>
                  <td className="py-4 px-6 text-sm text-right font-bold text-emerald-600">
                    R$ {venda.valorTotal.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500">
                    {new Date(venda.data).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {vendasFiltradas.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              Nenhuma venda encontrada.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;