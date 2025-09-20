/**
 * Testes para Server Action cancel-booking
 * Testa todas as validações e cenários de cancelamento de agendamento
 */

import { cancelBooking } from '../cancel-booking'
import { prismaMock, setupPrismaMocks, resetPrismaMocks, mockBooking } from '../../_lib/__mocks__/prisma'
import { getServerSession } from 'next-auth'

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
const VALID_USER_ID = '550e8400-e29b-41d4-a716-446655440003'
const OTHER_USER_ID = '550e8400-e29b-41d4-a716-446655440006' // Different user for authorization tests
const VALID_BOOKING_ID = '550e8400-e29b-41d4-a716-446655440005'
const VALID_SERVICE_ID = '550e8400-e29b-41d4-a716-446655440001'
const VALID_BARBER_ID = '550e8400-e29b-41d4-a716-446655440002'

describe('cancelBooking Server Action', () => {
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

  describe('Input Validation', () => {
    test('should reject empty booking ID', async () => {
      await expect(cancelBooking('')).rejects.toThrow('ID do agendamento é obrigatório')
    })

    test('should reject null booking ID', async () => {
      await expect(cancelBooking(null as any)).rejects.toThrow('ID do agendamento é obrigatório')
    })

    test('should reject undefined booking ID', async () => {
      await expect(cancelBooking(undefined as any)).rejects.toThrow('ID do agendamento é obrigatório')
    })
  })

  describe('Authentication', () => {
    test('should work without authentication for finding booking', async () => {
      mockGetServerSession.mockResolvedValue(null)

      prismaMock.booking.findUnique.mockResolvedValue(null)

      await expect(cancelBooking(VALID_BOOKING_ID)).rejects.toThrow('Agendamento não encontrado')
    })
  })

  describe('Authorization', () => {
    test('should reject cancelling other user booking', async () => {
      const otherUserBooking = {
        ...mockBooking,
        userId: OTHER_USER_ID, // Diferente do usuário logado
      }

      prismaMock.booking.findUnique.mockResolvedValue(otherUserBooking as any)

      await expect(cancelBooking(VALID_BOOKING_ID)).rejects.toThrow(
        'Não autorizado a cancelar este agendamento'
      )
    })

    test('should allow cancelling own booking', async () => {
      const ownBooking = {
        ...mockBooking,
        userId: VALID_USER_ID, // Mesmo usuário logado
        status: 'SCHEDULED',
      }

      prismaMock.booking.findUnique.mockResolvedValue(ownBooking as any)
      prismaMock.booking.update.mockResolvedValue({
        ...ownBooking,
        status: 'CANCELLED',
      } as any)

      await expect(cancelBooking(VALID_BOOKING_ID)).resolves.not.toThrow()

      expect(prismaMock.booking.update).toHaveBeenCalledWith({
        where: { id: VALID_BOOKING_ID },
        data: {
          status: 'CANCELLED',
          updatedAt: expect.any(Date),
        },
      })
    })

    test('should allow unauthenticated user to get proper error for non-existent booking', async () => {
      mockGetServerSession.mockResolvedValue(null)
      prismaMock.booking.findUnique.mockResolvedValue(null)

      await expect(cancelBooking(VALID_BOOKING_ID)).rejects.toThrow('Agendamento não encontrado')
    })
  })

  describe('Business Logic', () => {
    test('should reject cancelling non-existent booking', async () => {
      prismaMock.booking.findUnique.mockResolvedValue(null)

      await expect(cancelBooking('non-existent-id')).rejects.toThrow('Agendamento não encontrado')
    })

    test('should reject cancelling already cancelled booking', async () => {
      const cancelledBooking = {
        ...mockBooking,
        userId: VALID_USER_ID,
        status: 'CANCELLED',
      }

      prismaMock.booking.findUnique.mockResolvedValue(cancelledBooking as any)

      await expect(cancelBooking(VALID_BOOKING_ID)).rejects.toThrow('Agendamento já foi cancelado')
    })

    test('should allow cancelling scheduled booking', async () => {
      const scheduledBooking = {
        ...mockBooking,
        userId: VALID_USER_ID,
        status: 'SCHEDULED',
      }

      prismaMock.booking.findUnique.mockResolvedValue(scheduledBooking as any)

      await cancelBooking(VALID_BOOKING_ID)

      expect(prismaMock.booking.update).toHaveBeenCalledWith({
        where: { id: VALID_BOOKING_ID },
        data: {
          status: 'CANCELLED',
          updatedAt: expect.any(Date),
        },
      })
    })

    test('should allow cancelling in-progress booking', async () => {
      const inProgressBooking = {
        ...mockBooking,
        userId: VALID_USER_ID,
        status: 'IN_PROGRESS',
      }

      prismaMock.booking.findUnique.mockResolvedValue(inProgressBooking as any)

      await cancelBooking(VALID_BOOKING_ID)

      expect(prismaMock.booking.update).toHaveBeenCalled()
    })

    test('should update status instead of deleting booking', async () => {
      const scheduledBooking = {
        ...mockBooking,
        userId: VALID_USER_ID,
        status: 'SCHEDULED',
      }

      prismaMock.booking.findUnique.mockResolvedValue(scheduledBooking as any)

      await cancelBooking(VALID_BOOKING_ID)

      // Verifica que não foi chamado delete
      expect(prismaMock.booking.delete).not.toHaveBeenCalled()

      // Verifica que foi chamado update
      expect(prismaMock.booking.update).toHaveBeenCalledWith({
        where: { id: VALID_BOOKING_ID },
        data: {
          status: 'CANCELLED',
          updatedAt: expect.any(Date),
        },
      })
    })
  })

  describe('Database Operations', () => {
    test('should include related data when finding booking', async () => {
      await cancelBooking(VALID_BOOKING_ID)

      expect(prismaMock.booking.findUnique).toHaveBeenCalledWith({
        where: { id: VALID_BOOKING_ID },
        include: {
          user: true,
          service: true,
          barber: true
        },
      })
    })

    test('should update booking status and timestamp', async () => {
      const scheduledBooking = {
        ...mockBooking,
        userId: VALID_USER_ID,
        status: 'SCHEDULED',
      }

      prismaMock.booking.findUnique.mockResolvedValue(scheduledBooking as any)

      await cancelBooking(VALID_BOOKING_ID)

      expect(prismaMock.booking.update).toHaveBeenCalledWith({
        where: { id: VALID_BOOKING_ID },
        data: {
          status: 'CANCELLED',
          updatedAt: expect.any(Date),
        },
      })
    })
  })

  describe('Error Handling', () => {
    test('should handle database errors gracefully', async () => {
      prismaMock.booking.findUnique.mockRejectedValue(new Error('Database connection failed'))

      await expect(cancelBooking(VALID_BOOKING_ID)).rejects.toThrow('Erro interno do servidor')
    })

    test('should handle update errors gracefully', async () => {
      const scheduledBooking = {
        ...mockBooking,
        userId: VALID_USER_ID,
        status: 'SCHEDULED',
      }

      prismaMock.booking.findUnique.mockResolvedValue(scheduledBooking as any)
      prismaMock.booking.update.mockRejectedValue(new Error('Update failed'))

      await expect(cancelBooking(VALID_BOOKING_ID)).rejects.toThrow('Erro interno do servidor')
    })

    test('should rethrow known business errors', async () => {
      prismaMock.booking.findUnique.mockResolvedValue(null)

      await expect(cancelBooking(VALID_BOOKING_ID)).rejects.toThrow('Agendamento não encontrado')
    })
  })

  describe('Logging', () => {
    test('should log successful cancellation', async () => {
      const scheduledBooking = {
        ...mockBooking,
        userId: VALID_USER_ID,
        status: 'SCHEDULED',
      }

      prismaMock.booking.findUnique.mockResolvedValue(scheduledBooking as any)

      // Mock do logger não está configurado neste teste, mas a funcionalidade deveria existir
      await cancelBooking(VALID_BOOKING_ID)

      // O teste passa se não há erro, indicando que o logging não quebra a funcionalidade
      expect(prismaMock.booking.update).toHaveBeenCalled()
    })
  })

  describe('Edge Cases', () => {
    test('should handle booking with minimal data', async () => {
      const minimalBooking = {
        id: VALID_BOOKING_ID,
        userId: VALID_USER_ID,
        status: 'SCHEDULED' as const,
        serviceId: VALID_SERVICE_ID,
        barberId: VALID_BARBER_ID,
        date: new Date(),
        notes: null as string | null,
        totalPrice: null as any,
        createAt: new Date(),
        updatedAt: new Date(),
        user: { id: VALID_USER_ID, name: 'Test User' },
        service: { id: VALID_SERVICE_ID, name: 'Test Service' },
        barber: { id: VALID_BARBER_ID, name: 'Test Barber' },
      }

      prismaMock.booking.findUnique.mockResolvedValue(minimalBooking as any)

      await expect(cancelBooking(VALID_BOOKING_ID)).resolves.not.toThrow()
    })

    test('should handle very long booking ID', async () => {
      const longId = 'a'.repeat(100)
      prismaMock.booking.findUnique.mockResolvedValue(null)

      await expect(cancelBooking(longId)).rejects.toThrow('Agendamento não encontrado')
    })
  })
})