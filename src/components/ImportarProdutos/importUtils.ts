
import Papa from "papaparse";
import * as XLSX from "xlsx";

export interface ParseResult {
  data: any[];
  errors: { row: number; column: string; message: string }[];
  headers: string[];
}

export const EXPECTED_HEADERS = [
  "nome", "descricao", "categoria", "preco_venda", "estoque", "imagem_url"
];

// Identifica rapidamente se contém os headers esperados
function validateHeaders(headers: string[]): string[] {
  return EXPECTED_HEADERS.filter(h => !headers.includes(h));
}

// Faz leitura e validação genérica (retorna cabeçalhos, dados e erros)
export async function parseFile(file: File): Promise<ParseResult> {
  return new Promise((resolve, reject) => {
    const ext = file.name.toLowerCase().split(".").pop();
    if (ext === "csv") {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const headers = results.meta.fields ?? [];
          const missingHeaders = validateHeaders(headers);
          const data = results.data;
          const errors: ParseResult["errors"] = [];

          // Validação básica linha-a-linha:
          (data as any[]).forEach((row, rowIdx) => {
            EXPECTED_HEADERS.forEach((header) => {
              if (!row[header] || row[header] === "") {
                errors.push({
                  row: rowIdx + 2, // 1-index + header
                  column: header,
                  message: `Campo obrigatório ausente`
                });
              }
            });
            // validação preço
            if (row.preco_venda && isNaN(Number(row.preco_venda))) {
              errors.push({
                row: rowIdx + 2,
                column: "preco_venda",
                message: "Preço inválido"
              });
            }
            // validação estoque
            if (row.estoque && isNaN(Number(row.estoque))) {
              errors.push({
                row: rowIdx + 2,
                column: "estoque",
                message: "Estoque inválido"
              });
            }
          });

          if (missingHeaders.length > 0) {
            errors.unshift({
              row: 1,
              column: missingHeaders.join(", "),
              message: `Cabeçalhos ausentes: ${missingHeaders.join(", ")}`
            });
          }

          resolve({ data, errors, headers });
        },
        error: (err) => reject(err)
      });
    } else if (ext === "xls" || ext === "xlsx") {
      const reader = new FileReader();
      reader.onload = (evt: any) => {
        const data = evt.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });
        const headers = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0] as string[];
        const missingHeaders = validateHeaders(headers);
        const errors: ParseResult["errors"] = [];
        json.forEach((row: any, rowIdx: number) => {
          EXPECTED_HEADERS.forEach(header => {
            if (!row[header] || row[header] === "") {
              errors.push({
                row: rowIdx + 2,
                column: header,
                message: "Campo obrigatório ausente"
              });
            }
          });
          if (row.preco_venda && isNaN(Number(row.preco_venda))) {
            errors.push({
              row: rowIdx + 2,
              column: "preco_venda",
              message: "Preço inválido"
            });
          }
          if (row.estoque && isNaN(Number(row.estoque))) {
            errors.push({
              row: rowIdx + 2,
              column: "estoque",
              message: "Estoque inválido"
            });
          }
        });
        if (missingHeaders.length > 0) {
          errors.unshift({
            row: 1,
            column: missingHeaders.join(", "),
            message: `Cabeçalhos ausentes: ${missingHeaders.join(", ")}`
          });
        }
        resolve({ data: json, errors, headers });
      }
      reader.readAsBinaryString(file);
    } else {
      reject(new Error("Formato não suportado. Envie CSV ou Excel."));
    }
  });
}
