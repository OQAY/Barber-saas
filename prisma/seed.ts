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

    // Lista completa de todos os serviços disponíveis
    const allServices = [
      "Corte de Cabelo",
      "Barba",
      "Corte e Barba",
      "Sobrancelha",
      "Bigode",
      "Cavanhaque",
      "Pézinho",
      "Pigmentação de Cabelo/Barba",
      "Hidratação",
      "Limpeza de Pele",
      "Luzes",
      "Visagismo"
    ]

    const barberData = [
      {
        name: "Lucas Silva",
        email: "lucas@barbeariapremiuem.com",
        phone: "(11) 99999-1111",
        bio: "Apaixonado por futebol e cortes modernos! Especialista em transformar ideias em visual. Adora conversar sobre os últimos jogos do Palmeiras enquanto cria o corte perfeito. Acredita que cada cliente merece sair daqui se sentindo mais confiante.",
        specialties: allServices, // Todos os serviços
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
        bio: "Mestre da navalha tradicional e amante de rock clássico! Coleciona vinis e tem as melhores histórias para contar. Especialista em barbas que impressionam, sempre com muito papo bom e trilha sonora dos anos 80.",
        specialties: allServices, // Todos os serviços
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
        bio: "Artista do visagismo e apaixonada por café! Formada em design, adora criar looks únicos que realçam a personalidade. Sempre com um sorriso no rosto e dicas de beleza que realmente funcionam. Seu latte art é tão bom quanto seu trabalho!",
        specialties: allServices, // Todos os serviços
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
        bio: "Pai de dois filhos e especialista em conquistar a confiança das crianças! Adora desenho animado, tem paciência infinita e transforma cada corte infantil em diversão. Seu segredo? Sempre ter pirulitos e muitas piadas na manga.",
        specialties: allServices, // Todos os serviços
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
        bio: "Colorista inovadora e fanática por K-pop! Especialista em transformações radicais e cores únicas. Adora experimentar tendências asiáticas de beleza e sempre está por dentro das últimas novidades. Prepare-se para uma experiência colorida e divertida!",
        specialties: allServices, // Todos os serviços
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
        bio: "Veterano da profissão e contador de histórias incríveis! 15 anos cortando cabelo e uma biblioteca de experiências. Especialista em cortes clássicos, adora pescar aos domingos e tem sempre um conselho sábio para compartilhar.",
        specialties: allServices, // Todos os serviços
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
        bio: "Perfeccionista das sobrancelhas e viciada em séries! Especialista em harmonia facial, adora conversar sobre o último episódio que assistiu. Seus clientes saem com o visual perfeito e várias dicas de séries para maratonar!",
        specialties: allServices, // Todos os serviços
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
        price: 40.0,
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
        name: "Corte e Barba",
        description: "Combo completo: corte moderno + barba modelada.",
        price: 70.0,
        imageUrl:
          "https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png",
      },
      {
        name: "Sobrancelha",
        description: "Expressão acentuada com modelagem precisa.",
        price: 10.0,
        imageUrl:
          "https://utfs.io/f/2118f76e-89e4-43e6-87c9-8f157500c333-b0ps0b.png",
      },
      {
        name: "Bigode",
        description: "Modelagem e aparagem precisa do bigode.",
        price: 10.0,
        imageUrl:
          "https://utfs.io/f/e6bdffb6-24a9-455b-aba3-903c2c2b5bde-1jo6tu.png",
      },
      {
        name: "Cavanhaque",
        description: "Estilo clássico com modelagem refinada.",
        price: 15.0,
        imageUrl:
          "https://utfs.io/f/e6bdffb6-24a9-455b-aba3-903c2c2b5bde-1jo6tu.png",
      },
      {
        name: "Pézinho",
        description: "Acabamento perfeito para um visual renovado.",
        price: 15.0,
        imageUrl:
          "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
      },
      {
        name: "Pigmentação de Cabelo/Barba",
        description: "Tingimento e correção de tons naturais.",
        price: 15.0,
        imageUrl:
          "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
      },
      {
        name: "Hidratação",
        description: "Tratamento hidratante para cabelo e barba.",
        price: 20.0,
        imageUrl:
          "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
      },
      {
        name: "Limpeza de Pele",
        description: "Tratamento completo de limpeza e revitalização facial.",
        price: 99.9,
        imageUrl:
          "https://utfs.io/f/c4919193-a675-4c47-9f21-ebd86d1c8e6a-4oen2a.png",
      },
      {
        name: "Luzes",
        description: "Mechas e reflexos profissionais (valor a partir de).",
        price: 100.0,
        imageUrl:
          "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
      },
      {
        name: "Visagismo",
        description: "Análise facial personalizada para o corte perfeito.",
        price: 120.0,
        imageUrl:
          "https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png",
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
