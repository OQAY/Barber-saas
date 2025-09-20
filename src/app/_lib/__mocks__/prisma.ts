/**
 * Mock do Prisma para testes
 * Simula todas as operações do banco de dados
 */

import { PrismaClient, Prisma } from '@prisma/client'
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'

export const prismaMock = mockDeep<PrismaClient>()

// Valid UUIDs for consistent testing
const MOCK_USER_ID = '550e8400-e29b-41d4-a716-446655440003'
const MOCK_BARBER_ID = '550e8400-e29b-41d4-a716-446655440002'
const MOCK_BARBERSHOP_ID = '550e8400-e29b-41d4-a716-446655440004'
const MOCK_SERVICE_ID = '550e8400-e29b-41d4-a716-446655440001'
const MOCK_BOOKING_ID = '550e8400-e29b-41d4-a716-446655440005'

// Mock data para testes
export const mockUser = {
  id: MOCK_USER_ID,
  firstName: 'Test',
  lastName: 'User',
  name: 'Test User',
  email: 'test@example.com',
  phone: '(11) 99999-9999',
  password: '$2b$10$hashedPasswordExample123456',
  emailVerified: null as Date | null,
  image: null as string | null,
  provider: 'email',
  isVerified: true,
  role: 'USER' as const,
  createdAt: new Date('2024-01-01T00:00:00Z'), // User model uses 'createdAt'
  updatedAt: new Date('2024-01-01T00:00:00Z'),
}

export const mockBarbershop = {
  id: MOCK_BARBERSHOP_ID,
  name: 'Test Barbershop',
  email: 'shop@example.com',
  address: 'Test Address 123',
  phones: ['(11) 77777-7777'],
  description: 'Test barbershop description',
  imageUrl: 'https://example.com/shop.jpg',
  createdAt: new Date('2024-01-01T00:00:00Z'), // Barbershop model uses 'createdAt'
  updatedAt: new Date('2024-01-01T00:00:00Z'),
}

export const mockBarber = {
  id: MOCK_BARBER_ID,
  name: 'Test Barber',
  slug: 'test-barber',
  email: 'barber@example.com',
  phone: '(11) 88888-8888',
  photo: 'https://example.com/photo.jpg',
  bio: 'Test barber bio',
  specialties: ['Corte', 'Barba'],
  workingHours: {},
  isActive: true,
  role: 'BARBER' as const,
  barbershopId: MOCK_BARBERSHOP_ID,
  createdAt: new Date('2024-01-01T00:00:00Z'), // Barber model uses 'createdAt'
  updatedAt: new Date('2024-01-01T00:00:00Z'),
  barbershop: mockBarbershop, // Include the relation
}

export const mockService = {
  id: MOCK_SERVICE_ID,
  name: 'Corte de Cabelo',
  description: 'Corte moderno e estiloso',
  imageUrl: 'https://example.com/service.jpg',
  price: new Prisma.Decimal(50.0),
  barbershopId: MOCK_BARBERSHOP_ID,
  barbershop: mockBarbershop,
}

export const mockBooking = {
  id: MOCK_BOOKING_ID,
  userId: MOCK_USER_ID,
  serviceId: MOCK_SERVICE_ID,
  barberId: MOCK_BARBER_ID,
  date: new Date(Date.now() + 86400000), // Amanhã
  status: 'SCHEDULED' as const,
  notes: 'Test booking notes' as string | null,
  totalPrice: new Prisma.Decimal(50.0) as Prisma.Decimal | null,
  createAt: new Date('2024-01-01T00:00:00Z'), // Note: schema uses 'createAt' not 'createdAt'
  updatedAt: new Date('2024-01-01T00:00:00Z'),
  user: mockUser,
  service: mockService,
  barber: mockBarber,
}

// Setup padrão dos mocks
export function setupPrismaMocks() {
  // User operations
  prismaMock.user.findUnique.mockResolvedValue(mockUser)
  prismaMock.user.create.mockResolvedValue(mockUser)
  prismaMock.user.update.mockResolvedValue(mockUser)

  // Barber operations
  prismaMock.barber.findUnique.mockResolvedValue(mockBarber)
  prismaMock.barber.findMany.mockResolvedValue([mockBarber])
  prismaMock.barber.count.mockResolvedValue(1)

  // Barbershop operations
  prismaMock.barbershop.findUnique.mockResolvedValue(mockBarbershop)
  prismaMock.barbershop.findMany.mockResolvedValue([mockBarbershop])

  // Service operations
  prismaMock.barbershopService.findUnique.mockResolvedValue(mockService)
  prismaMock.barbershopService.findMany.mockResolvedValue([mockService])

  // Booking operations
  prismaMock.booking.create.mockResolvedValue(mockBooking)
  prismaMock.booking.findUnique.mockResolvedValue(mockBooking)
  prismaMock.booking.findMany.mockResolvedValue([mockBooking])
  prismaMock.booking.update.mockResolvedValue({ ...mockBooking, status: 'CANCELLED' })
  prismaMock.booking.delete.mockResolvedValue(mockBooking)
  prismaMock.booking.count.mockResolvedValue(1)
  prismaMock.booking.findFirst.mockResolvedValue(null) // Sem conflitos por padrão

  // Aggregate operations
  prismaMock.booking.aggregate.mockResolvedValue({
    _sum: { totalPrice: new Prisma.Decimal(150.0) },
    _avg: { totalPrice: new Prisma.Decimal(50.0) },
    _count: { id: 3 },
    _max: { totalPrice: new Prisma.Decimal(50.0) },
    _min: { totalPrice: new Prisma.Decimal(50.0) },
  })
}

// Reset mocks
export function resetPrismaMocks() {
  mockReset(prismaMock)
  setupPrismaMocks()
}

// Mock the db export
jest.mock('../prisma', () => ({
  db: prismaMock,
}))

export { prismaMock as db }