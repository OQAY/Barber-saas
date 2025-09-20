/**
 * Testes para Server Action create-booking
 * Testa todas as validações e cenários de criação de agendamento
 */

import { createBooking } from '../create-booking'
import { prismaMock, setupPrismaMocks, resetPrismaMocks, mockUser, mockBarber, mockService } from '../../_lib/__mocks__/prisma'
import { getServerSession } from 'next-auth'
import { Prisma } from '@prisma/client'

// Mock das dependências
jest.mock('next-auth')
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}))

// CRITICAL: Mock the actual Prisma client used by the action
jest.mock('../../_lib/prisma', () => ({
  db: require('../../_lib/__mocks__/prisma').prismaMock
}))

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>

// Valid UUIDs for testing
const VALID_SERVICE_ID = '550e8400-e29b-41d4-a716-446655440001'
const VALID_BARBER_ID = '550e8400-e29b-41d4-a716-446655440002'
const VALID_USER_ID = '550e8400-e29b-41d4-a716-446655440003'

describe('createBooking Server Action', () => {
  beforeEach(() => {
    resetPrismaMocks()
    setupPrismaMocks()

    // Mock session autenticada por padrão
    mockGetServerSession.mockResolvedValue({
      user: {
        id: VALID_USER_ID,
        email: 'test@example.com',
        name: 'Test User',
      },
    } as any)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Authentication', () => {
    test('should reject unauthenticated user', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const validData = {
        serviceId: VALID_SERVICE_ID,
        barberId: VALID_BARBER_ID,
        date: new Date(Date.now() + 86400000), // Amanhã
      }

      await expect(createBooking(validData)).rejects.toThrow('Usuário não autenticado')
    })

    test('should reject session without user ID', async () => {
      mockGetServerSession.mockResolvedValue({
        user: {
          email: 'test@example.com',
          name: 'Test User',
          // id ausente
        },
      } as any)

      const validData = {
        serviceId: VALID_SERVICE_ID,
        barberId: VALID_BARBER_ID,
        date: new Date(Date.now() + 86400000),
      }

      await expect(createBooking(validData)).rejects.toThrow('Usuário não autenticado')
    })
  })

  describe('Input Validation', () => {
    test('should reject invalid service ID', async () => {
      const invalidData = {
        serviceId: 'invalid-uuid',
        barberId: VALID_BARBER_ID,
        date: new Date(Date.now() + 86400000),
      }

      await expect(createBooking(invalidData)).rejects.toThrow('Dados inválidos')
    })

    test('should reject invalid barber ID', async () => {
      const invalidData = {
        serviceId: VALID_SERVICE_ID,
        barberId: 'invalid-uuid',
        date: new Date(Date.now() + 86400000),
      }

      await expect(createBooking(invalidData)).rejects.toThrow('Dados inválidos')
    })

    test('should reject past date', async () => {
      const invalidData = {
        serviceId: VALID_SERVICE_ID,
        barberId: VALID_BARBER_ID,
        date: new Date(Date.now() - 86400000), // Ontem
      }

      await expect(createBooking(invalidData)).rejects.toThrow('Dados inválidos')
    })

    test('should reject booking outside business hours', async () => {
      const tomorrow = new Date(Date.now() + 86400000)
      tomorrow.setHours(8, 0, 0, 0) // 8h da manhã

      const invalidData = {
        serviceId: VALID_SERVICE_ID,
        barberId: VALID_BARBER_ID,
        date: tomorrow,
      }

      await expect(createBooking(invalidData)).rejects.toThrow('Dados inválidos')
    })

    test('should sanitize notes', async () => {
      const tomorrow = new Date(Date.now() + 86400000)
      tomorrow.setHours(14, 0, 0, 0)

      const dataWithNotes = {
        serviceId: VALID_SERVICE_ID,
        barberId: VALID_BARBER_ID,
        date: tomorrow,
        notes: '  Corte   baixo   nas   laterais  ',
      }

      await createBooking(dataWithNotes)

      expect(prismaMock.booking.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            notes: 'Corte baixo nas laterais', // Sanitizado
          }),
        })
      )
    })
  })

  describe('Business Logic', () => {
    test('should reject booking for non-existent service', async () => {
      // Reset mocks for this specific test
      prismaMock.barbershopService.findUnique.mockResolvedValue(null)
      // Ensure barber exists for this test
      prismaMock.barber.findUnique.mockResolvedValue(mockBarber)

      const tomorrow = new Date(Date.now() + 86400000)
      tomorrow.setHours(14, 0, 0, 0)

      const validData = {
        serviceId: VALID_SERVICE_ID,
        barberId: VALID_BARBER_ID,
        date: tomorrow,
      }

      await expect(createBooking(validData)).rejects.toThrow('Serviço não encontrado')
    })

    test('should reject booking for non-existent barber', async () => {
      // Ensure service exists for this test
      prismaMock.barbershopService.findUnique.mockResolvedValue(mockService)
      // Set barber as non-existent
      prismaMock.barber.findUnique.mockResolvedValue(null)

      const tomorrow = new Date(Date.now() + 86400000)
      tomorrow.setHours(14, 0, 0, 0)

      const validData = {
        serviceId: VALID_SERVICE_ID,
        barberId: VALID_BARBER_ID,
        date: tomorrow,
      }

      await expect(createBooking(validData)).rejects.toThrow('Barbeiro não encontrado ou inativo')
    })

    test('should reject booking for inactive barber', async () => {
      // Ensure service exists for this test
      prismaMock.barbershopService.findUnique.mockResolvedValue(mockService)
      // Set barber as inactive
      prismaMock.barber.findUnique.mockResolvedValue({
        ...mockBarber,
        isActive: false,
      })

      const tomorrow = new Date(Date.now() + 86400000)
      tomorrow.setHours(14, 0, 0, 0)

      const validData = {
        serviceId: VALID_SERVICE_ID,
        barberId: VALID_BARBER_ID,
        date: tomorrow,
      }

      await expect(createBooking(validData)).rejects.toThrow('Barbeiro não encontrado ou inativo')
    })

    test('should reject booking for occupied time slot', async () => {
      // Ensure service and barber exist
      prismaMock.barbershopService.findUnique.mockResolvedValue(mockService)
      prismaMock.barber.findUnique.mockResolvedValue(mockBarber)

      // Mock existindo agendamento no mesmo horário
      prismaMock.booking.findFirst.mockResolvedValue({
        id: 'existing-booking-id',
        userId: 'other-user-id',
        serviceId: VALID_SERVICE_ID,
        barberId: VALID_BARBER_ID,
        date: new Date(),
        status: 'SCHEDULED',
        notes: null,
        totalPrice: new Prisma.Decimal(50),
        createAt: new Date(),
        updatedAt: new Date(),
      } as any)

      const tomorrow = new Date(Date.now() + 86400000)
      tomorrow.setHours(14, 0, 0, 0)

      const validData = {
        serviceId: VALID_SERVICE_ID,
        barberId: VALID_BARBER_ID,
        date: tomorrow,
      }

      await expect(createBooking(validData)).rejects.toThrow('Horário já está ocupado')
    })

    test('should allow booking when only cancelled bookings exist at same time', async () => {
      // Mock agendamento cancelado no mesmo horário
      prismaMock.booking.findFirst.mockResolvedValue(null) // Sem conflitos ativos

      const tomorrow = new Date(Date.now() + 86400000)
      tomorrow.setHours(14, 0, 0, 0)

      const validData = {
        serviceId: VALID_SERVICE_ID,
        barberId: VALID_BARBER_ID,
        date: tomorrow,
      }

      const result = await createBooking(validData)

      expect(result).toBeDefined()
      expect(prismaMock.booking.create).toHaveBeenCalled()
    })
  })

  describe('Successful Booking Creation', () => {
    test('should create booking with valid data', async () => {
      // Setup successful scenario mocks
      prismaMock.barbershopService.findUnique.mockResolvedValue(mockService)
      prismaMock.barber.findUnique.mockResolvedValue(mockBarber)
      prismaMock.booking.findFirst.mockResolvedValue(null) // No conflicts

      const tomorrow = new Date(Date.now() + 86400000)
      tomorrow.setHours(14, 0, 0, 0)

      const validData = {
        serviceId: VALID_SERVICE_ID,
        barberId: VALID_BARBER_ID,
        date: tomorrow,
      }

      const result = await createBooking(validData)

      expect(result).toBeDefined()
      expect(prismaMock.booking.create).toHaveBeenCalledWith({
        data: {
          serviceId: VALID_SERVICE_ID,
          barberId: VALID_BARBER_ID,
          date: tomorrow,
          userId: VALID_USER_ID,
          status: 'SCHEDULED',
          totalPrice: mockService.price,
          notes: undefined,
        },
        include: {
          service: true,
          barber: true,
        },
      })
    })

    test('should include notes when provided', async () => {
      const tomorrow = new Date(Date.now() + 86400000)
      tomorrow.setHours(14, 0, 0, 0)

      const validData = {
        serviceId: VALID_SERVICE_ID,
        barberId: VALID_BARBER_ID,
        date: tomorrow,
        notes: 'Corte baixo nas laterais',
      }

      await createBooking(validData)

      expect(prismaMock.booking.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            notes: 'Corte baixo nas laterais',
          }),
        })
      )
    })

    test('should set total price from service', async () => {
      const tomorrow = new Date(Date.now() + 86400000)
      tomorrow.setHours(14, 0, 0, 0)

      const validData = {
        serviceId: VALID_SERVICE_ID,
        barberId: VALID_BARBER_ID,
        date: tomorrow,
      }

      await createBooking(validData)

      expect(prismaMock.booking.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            totalPrice: mockService.price,
          }),
        })
      )
    })
  })

  describe('Error Handling', () => {
    test('should handle database errors gracefully', async () => {
      prismaMock.barbershopService.findUnique.mockRejectedValue(new Error('Database error'))

      const tomorrow = new Date(Date.now() + 86400000)
      tomorrow.setHours(14, 0, 0, 0)

      const validData = {
        serviceId: VALID_SERVICE_ID,
        barberId: VALID_BARBER_ID,
        date: tomorrow,
      }

      await expect(createBooking(validData)).rejects.toThrow('Erro interno do servidor')
    })

    test('should rethrow known business errors', async () => {
      prismaMock.barbershopService.findUnique.mockResolvedValue(null)

      const tomorrow = new Date(Date.now() + 86400000)
      tomorrow.setHours(14, 0, 0, 0)

      const validData = {
        serviceId: VALID_SERVICE_ID,
        barberId: VALID_BARBER_ID,
        date: tomorrow,
      }

      await expect(createBooking(validData)).rejects.toThrow('Serviço não encontrado')
    })
  })
})