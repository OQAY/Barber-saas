const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function seedDatabase() {
  try {
    // Create the main barbershop
    const barbershopData = {
      name: "Barbearia Premium",
      email: "contato@barbeariapremiuem.com",
      address: "Rua dos Barbeiros, 123 - Centro",
      phones: ["(11) 99999-1234", "(11) 3333-5678"],
      description: "Bem-vindo à Barbearia Premium, onde tradição e modernidade se encontram para proporcionar a você uma experiência de cuidado pessoal incomparável. Desde 2020, temos nos dedicado a oferecer serviços de barbearia de alta qualidade, com um toque de autenticidade e estilo.",
      imageUrl: "https://utfs.io/f/c97a2dc9-cf62-468b-a851-bfd2bdde775f-16p.png",
    }

    // Barber photos and data
    const barberImages = [
      "https://utfs.io/f/45331760-899c-4b4b-910e-e00babb6ed81-16q.png",
      "https://utfs.io/f/5832df58-cfd7-4b3f-b102-42b7e150ced2-16r.png",
      "https://utfs.io/f/7e309eaa-d722-465b-b8b6-76217404a3d3-16s.png",
      "https://utfs.io/f/178da6b6-6f9a-424a-be9d-a2feb476eb36-16t.png",
      "https://utfs.io/f/2f9278ba-3975-4026-af46-64af78864494-16u.png",
      "https://utfs.io/f/988646ea-dcb6-4f47-8a03-8d4586b7bc21-16v.png",
      "https://utfs.io/f/60f24f5c-9ed3-40ba-8c92-0cd1dcd043f9-16w.png",
    ]

    const barberData = [
      {
        name: "Lucas Silva",
        email: "lucas@barbeariapremiuem.com",
        phone: "(11) 99999-1111",
        bio: "Especialista em cortes modernos e clássicos. 8 anos de experiência no ramo.",
        specialties: ["Cabelo", "Barba", "Acabamento"],
        workingHours: {
          monday: { start: "09:00", end: "18:00" },
          tuesday: { start: "09:00", end: "18:00" },
          wednesday: { start: "09:00", end: "18:00" },
          thursday: { start: "09:00", end: "18:00" },
          friday: { start: "09:00", end: "18:00" },
          saturday: { start: "08:00", end: "17:00" },
          sunday: null
        }
      },
      {
        name: "Pedro Santos",
        email: "pedro@barbeariapremiuem.com",
        phone: "(11) 99999-2222",
        bio: "Expert em barba e bigode. Técnicas tradicionais com navalha.",
        specialties: ["Barba", "Sobrancelha", "Massagem"],
        workingHours: {
          monday: { start: "10:00", end: "19:00" },
          tuesday: { start: "10:00", end: "19:00" },
          wednesday: { start: "10:00", end: "19:00" },
          thursday: { start: "10:00", end: "19:00" },
          friday: { start: "10:00", end: "19:00" },
          saturday: { start: "09:00", end: "18:00" },
          sunday: null
        }
      },
      {
        name: "Maria Oliveira",
        email: "maria@barbeariapremiuem.com",
        phone: "(11) 99999-3333",
        bio: "Especialista em cortes femininos e design de sobrancelhas.",
        specialties: ["Cabelo", "Sobrancelha", "Hidratação"],
        workingHours: {
          monday: { start: "09:00", end: "17:00" },
          tuesday: { start: "09:00", end: "17:00" },
          wednesday: { start: "09:00", end: "17:00" },
          thursday: { start: "09:00", end: "17:00" },
          friday: { start: "09:00", end: "17:00" },
          saturday: { start: "08:00", end: "16:00" },
          sunday: null
        }
      },
      {
        name: "Carlos Mendes",
        email: "carlos@barbeariapremiuem.com",
        phone: "(11) 99999-4444",
        bio: "Especialista em cortes infantis e barbas estilizadas.",
        specialties: ["Cabelo", "Barba", "Massagem"],
        workingHours: {
          monday: { start: "08:00", end: "17:00" },
          tuesday: { start: "08:00", end: "17:00" },
          wednesday: { start: "08:00", end: "17:00" },
          thursday: { start: "08:00", end: "17:00" },
          friday: { start: "08:00", end: "17:00" },
          saturday: { start: "07:00", end: "15:00" },
          sunday: null
        }
      },
      {
        name: "Ana Costa",
        email: "ana@barbeariapremiuem.com",
        phone: "(11) 99999-5555",
        bio: "Master em coloração e tratamentos capilares avançados.",
        specialties: ["Corte de Cabelo", "Hidratação", "Sobrancelha"],
        workingHours: {
          monday: { start: "12:00", end: "20:00" },
          tuesday: { start: "12:00", end: "20:00" },
          wednesday: { start: "12:00", end: "20:00" },
          thursday: { start: "12:00", end: "20:00" },
          friday: { start: "12:00", end: "20:00" },
          saturday: { start: "10:00", end: "18:00" },
          sunday: null
        }
      },
      {
        name: "Roberto Lima",
        email: "roberto@barbeariapremiuem.com",
        phone: "(11) 99999-6666",
        bio: "Barbeiro tradicional com 15 anos de experiência.",
        specialties: ["Cabelo", "Barba", "Acabamento"],
        workingHours: {
          monday: { start: "07:00", end: "16:00" },
          tuesday: { start: "07:00", end: "16:00" },
          wednesday: { start: "07:00", end: "16:00" },
          thursday: { start: "07:00", end: "16:00" },
          friday: { start: "07:00", end: "16:00" },
          saturday: { start: "06:00", end: "14:00" },
          sunday: null
        }
      },
      {
        name: "Fernanda Alves",
        email: "fernanda@barbeariapremiuem.com",
        phone: "(11) 99999-7777",
        bio: "Especialista em design de sobrancelhas e estética facial.",
        specialties: ["Sobrancelha", "Hidratação", "Massagem"],
        workingHours: {
          monday: { start: "13:00", end: "21:00" },
          tuesday: { start: "13:00", end: "21:00" },
          wednesday: { start: "13:00", end: "21:00" },
          thursday: { start: "13:00", end: "21:00" },
          friday: { start: "13:00", end: "21:00" },
          saturday: { start: "11:00", end: "19:00" },
          sunday: null
        }
      }
    ]

    const services = [
      {
        name: "Corte de Cabelo",
        description: "Estilo personalizado com as últimas tendências.",
        price: 60.0,
        imageUrl:
          "https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png",
      },
      {
        name: "Barba",
        description: "Modelagem completa para destacar sua masculinidade.",
        price: 40.0,
        imageUrl:
          "https://utfs.io/f/e6bdffb6-24a9-455b-aba3-903c2c2b5bde-1jo6tu.png",
      },
      {
        name: "Pézinho",
        description: "Acabamento perfeito para um visual renovado.",
        price: 35.0,
        imageUrl:
          "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
      },
      {
        name: "Sobrancelha",
        description: "Expressão acentuada com modelagem precisa.",
        price: 20.0,
        imageUrl:
          "https://utfs.io/f/2118f76e-89e4-43e6-87c9-8f157500c333-b0ps0b.png",
      },
      {
        name: "Massagem",
        description: "Relaxe com uma massagem revigorante.",
        price: 50.0,
        imageUrl:
          "https://utfs.io/f/c4919193-a675-4c47-9f21-ebd86d1c8e6a-4oen2a.png",
      },
      {
        name: "Hidratação",
        description: "Hidratação profunda para cabelo e barba.",
        price: 25.0,
        imageUrl:
          "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
      },
    ]

    // Check if the barbershop already exists
    const existingBarbershop = await prisma.barbershop.findUnique({
      where: { email: barbershopData.email },
    })

    let barbershop
    if (existingBarbershop) {
      // Update existing barbershop
      barbershop = await prisma.barbershop.update({
        where: { email: barbershopData.email },
        data: barbershopData,
      })
      console.log(`Barbershop ${barbershopData.name} updated.`)
    } else {
      // Create new barbershop
      barbershop = await prisma.barbershop.create({
        data: barbershopData,
      })
      console.log(`Barbershop ${barbershopData.name} created.`)
    }

    // Create services for the barbershop
    for (const service of services) {
      const existingService = await prisma.barbershopService.findFirst({
        where: {
          name: service.name,
          barbershopId: barbershop.id,
        },
      })

      if (!existingService) {
        await prisma.barbershopService.create({
          data: {
            name: service.name,
            description: service.description,
            price: service.price,
            imageUrl: service.imageUrl,
            barbershopId: barbershop.id,
          },
        })
        console.log(`Service ${service.name} created.`)
      }
    }

    // Create barbers for the barbershop
    for (let i = 0; i < barberData.length; i++) {
      const barber = barberData[i]
      const photo = barberImages[i]
      
      const existingBarber = await prisma.barber.findUnique({
        where: { email: barber.email },
      })

      if (!existingBarber) {
        await prisma.barber.create({
          data: {
            name: barber.name,
            email: barber.email,
            phone: barber.phone,
            photo: photo,
            bio: barber.bio,
            specialties: barber.specialties,
            workingHours: barber.workingHours,
            barbershopId: barbershop.id,
          },
        })
        console.log(`Barber ${barber.name} created.`)
      } else {
        console.log(`Barber ${barber.name} already exists.`)
      }
    }

    await prisma.$disconnect()
  } catch (error) {
    console.error("Erro ao criar as barbearias:", error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

seedDatabase()
