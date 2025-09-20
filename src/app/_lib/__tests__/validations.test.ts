/**
 * Testes para validações Zod
 * Garante que as validações funcionam corretamente
 */

import {
  createBookingSchema,
  cancelBookingSchema,
  registerUserSchema,
  loginSchema,
  emailSchema,
  passwordSchema,
  nameSchema,
  validateData,
  isValidBookingTime,
  sanitizeString,
} from '../validations'

describe('Email Validation', () => {
  test('should accept valid email', () => {
    const result = validateData(emailSchema, 'test@example.com')
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toBe('test@example.com')
    }
  })

  test('should reject invalid email format', () => {
    const result = validateData(emailSchema, 'invalid-email')
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.errors).toContain('Email inválido')
    }
  })

  test('should reject empty email', () => {
    const result = validateData(emailSchema, '')
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.errors).toContain('Email é obrigatório')
    }
  })
})

describe('Password Validation', () => {
  test('should accept valid password', () => {
    const result = validateData(passwordSchema, 'password123')
    expect(result.success).toBe(true)
  })

  test('should reject short password', () => {
    const result = validateData(passwordSchema, '123')
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.errors).toContain('Senha deve ter pelo menos 6 caracteres')
    }
  })

  test('should reject very long password', () => {
    const longPassword = 'a'.repeat(101)
    const result = validateData(passwordSchema, longPassword)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.errors).toContain('Senha muito longa')
    }
  })
})

describe('Name Validation', () => {
  test('should accept valid name', () => {
    const result = validateData(nameSchema, 'João Silva')
    expect(result.success).toBe(true)
  })

  test('should accept name with accents', () => {
    const result = validateData(nameSchema, 'José María')
    expect(result.success).toBe(true)
  })

  test('should reject short name', () => {
    const result = validateData(nameSchema, 'A')
    expect(result.success).toBe(false)
  })

  test('should reject name with numbers', () => {
    const result = validateData(nameSchema, 'João123')
    expect(result.success).toBe(false)
  })

  test('should reject name with special characters', () => {
    const result = validateData(nameSchema, 'João@Silva')
    expect(result.success).toBe(false)
  })
})

describe('Create Booking Validation', () => {
  const validBookingData = {
    serviceId: '123e4567-e89b-12d3-a456-426614174000',
    barberId: '123e4567-e89b-12d3-a456-426614174001',
    date: new Date(Date.now() + 86400000), // Amanhã às 10h
  }

  beforeEach(() => {
    // Set tomorrow at 10 AM
    const tomorrow = new Date(Date.now() + 86400000)
    tomorrow.setHours(10, 0, 0, 0)
    validBookingData.date = tomorrow
  })

  test('should accept valid booking data', () => {
    const result = validateData(createBookingSchema, validBookingData)
    expect(result.success).toBe(true)
  })

  test('should reject invalid service ID', () => {
    const invalidData = { ...validBookingData, serviceId: 'invalid-uuid' }
    const result = validateData(createBookingSchema, invalidData)
    expect(result.success).toBe(false)
  })

  test('should reject invalid barber ID', () => {
    const invalidData = { ...validBookingData, barberId: 'invalid-uuid' }
    const result = validateData(createBookingSchema, invalidData)
    expect(result.success).toBe(false)
  })

  test('should reject past date', () => {
    const pastDate = new Date(Date.now() - 86400000) // Ontem
    const invalidData = { ...validBookingData, date: pastDate }
    const result = validateData(createBookingSchema, invalidData)
    expect(result.success).toBe(false)
  })

  test('should reject booking less than 1 hour in advance', () => {
    const tooSoon = new Date(Date.now() + 1800000) // 30 minutos
    const invalidData = { ...validBookingData, date: tooSoon }
    const result = validateData(createBookingSchema, invalidData)
    expect(result.success).toBe(false)
  })

  test('should reject booking on Sunday', () => {
    const sunday = new Date()
    sunday.setDate(sunday.getDate() + (7 - sunday.getDay())) // Próximo domingo
    sunday.setHours(10, 0, 0, 0)
    const invalidData = { ...validBookingData, date: sunday }
    const result = validateData(createBookingSchema, invalidData)
    expect(result.success).toBe(false)
  })

  test('should reject booking outside business hours', () => {
    const tomorrow = new Date(Date.now() + 86400000)
    tomorrow.setHours(8, 0, 0, 0) // 8h da manhã (antes das 9h)
    const invalidData = { ...validBookingData, date: tomorrow }
    const result = validateData(createBookingSchema, invalidData)
    expect(result.success).toBe(false)
  })

  test('should accept valid notes', () => {
    const dataWithNotes = {
      ...validBookingData,
      notes: 'Corte baixo nas laterais'
    }
    const result = validateData(createBookingSchema, dataWithNotes)
    expect(result.success).toBe(true)
  })

  test('should reject very long notes', () => {
    const dataWithLongNotes = {
      ...validBookingData,
      notes: 'a'.repeat(501) // 501 caracteres
    }
    const result = validateData(createBookingSchema, dataWithLongNotes)
    expect(result.success).toBe(false)
  })
})

describe('Cancel Booking Validation', () => {
  test('should accept valid booking ID', () => {
    const validData = {
      bookingId: '123e4567-e89b-12d3-a456-426614174000'
    }
    const result = validateData(cancelBookingSchema, validData)
    expect(result.success).toBe(true)
  })

  test('should reject invalid booking ID', () => {
    const invalidData = { bookingId: 'invalid-uuid' }
    const result = validateData(cancelBookingSchema, invalidData)
    expect(result.success).toBe(false)
  })

  test('should reject empty booking ID', () => {
    const invalidData = { bookingId: '' }
    const result = validateData(cancelBookingSchema, invalidData)
    expect(result.success).toBe(false)
  })
})

describe('User Registration Validation', () => {
  const validUserData = {
    name: 'João Silva',
    email: 'joao@example.com',
    password: 'password123',
    phone: '(11) 99999-9999'
  }

  test('should accept valid user data', () => {
    const result = validateData(registerUserSchema, validUserData)
    expect(result.success).toBe(true)
  })

  test('should accept user data without phone', () => {
    const { phone, ...dataWithoutPhone } = validUserData
    const result = validateData(registerUserSchema, dataWithoutPhone)
    expect(result.success).toBe(true)
  })

  test('should reject invalid phone format', () => {
    const invalidData = { ...validUserData, phone: '11999999999' }
    const result = validateData(registerUserSchema, invalidData)
    expect(result.success).toBe(false)
  })
})

describe('Login Validation', () => {
  test('should accept valid login data', () => {
    const validData = {
      email: 'test@example.com',
      password: 'password123'
    }
    const result = validateData(loginSchema, validData)
    expect(result.success).toBe(true)
  })

  test('should reject empty password', () => {
    const invalidData = {
      email: 'test@example.com',
      password: ''
    }
    const result = validateData(loginSchema, invalidData)
    expect(result.success).toBe(false)
  })
})

describe('Booking Time Validation Helper', () => {
  test('should accept valid booking time', () => {
    const tomorrow = new Date(Date.now() + 86400000)
    tomorrow.setHours(14, 0, 0, 0) // 14h de uma terça-feira
    const isValid = isValidBookingTime(tomorrow)
    expect(isValid).toBe(true)
  })

  test('should reject past time', () => {
    const yesterday = new Date(Date.now() - 86400000)
    const isValid = isValidBookingTime(yesterday)
    expect(isValid).toBe(false)
  })

  test('should reject booking too soon', () => {
    const tooSoon = new Date(Date.now() + 1800000) // 30 minutos
    const isValid = isValidBookingTime(tooSoon)
    expect(isValid).toBe(false)
  })
})

describe('String Sanitization', () => {
  test('should trim whitespace', () => {
    const result = sanitizeString('  hello world  ')
    expect(result).toBe('hello world')
  })

  test('should remove extra spaces', () => {
    const result = sanitizeString('hello    world')
    expect(result).toBe('hello world')
  })

  test('should remove dangerous characters', () => {
    const result = sanitizeString('hello<script>alert("xss")</script>world')
    expect(result).toBe('helloscriptalert("xss")/scriptworld')
  })

  test('should handle empty string', () => {
    const result = sanitizeString('')
    expect(result).toBe('')
  })
})