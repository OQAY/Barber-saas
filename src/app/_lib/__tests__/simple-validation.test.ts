/**
 * Teste simples para verificar se o Jest está funcionando
 */

import { sanitizeString } from '../validations'

describe('Simple Validation Tests', () => {
  test('sanitizeString should work correctly', () => {
    expect(sanitizeString('  hello world  ')).toBe('hello world')
    expect(sanitizeString('hello    world')).toBe('hello world')
    expect(sanitizeString('')).toBe('')
  })

  test('basic math should work', () => {
    expect(2 + 2).toBe(4)
    expect(Math.max(1, 2, 3)).toBe(3)
  })

  test('string methods should work', () => {
    expect('hello'.toUpperCase()).toBe('HELLO')
    expect('  trim  '.trim()).toBe('trim')
  })
})