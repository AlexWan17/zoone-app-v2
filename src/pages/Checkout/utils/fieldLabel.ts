
export function formatFieldLabel(field: string) {
  // Exemplo simples: capitalize first letter, substitui _ por espaço.
  return field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, ' ');
}
