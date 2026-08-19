export function formatPhone(phone: string): string {
  return phone.replace(/\D/g, "").replace(/(\d{2})(\d{5})(\d{5})/, "+$1 $2 $3");
}
