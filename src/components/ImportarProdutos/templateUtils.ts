
const CSV_HEADERS = [
  "nome", "descricao", "categoria", "preco_venda", "estoque", "imagem_url"
];

const EXAMPLE_ROW = [
  "Sabonete Natural", "Sabonete biodegradável artesanal", "Higiene", "8.90", "15", "https://exemplo.com/foto.jpg"
];

export function downloadTemplateCSV() {
  const content =
    CSV_HEADERS.join(",") + "\n" +
    EXAMPLE_ROW.join(",") + "\n";
  const blob = new Blob([content], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "modelo_import_produtos.csv";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
