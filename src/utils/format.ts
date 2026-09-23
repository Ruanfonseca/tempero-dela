export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '')
}

/** Máscara de celular brasileiro: (21) 96923-2991 */
export function maskPhone(value: string): string {
  const digits = onlyDigits(value).slice(0, 11)
  if (digits.length === 0) return ''
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export function isValidPhone(value: string): boolean {
  const digits = onlyDigits(value)
  // Celular: DDD (2) + 9 dígitos começando com 9
  return digits.length === 11 && digits[2] === '9'
}

/** Máscara de CEP: 20000-000 */
export function maskCep(value: string): string {
  const digits = onlyDigits(value).slice(0, 8)
  if (digits.length <= 5) return digits
  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}

export function isValidCep(value: string): boolean {
  return onlyDigits(value).length === 8
}
