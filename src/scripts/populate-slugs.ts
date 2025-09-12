import { db } from "../app/_lib/prisma"

// Função para criar slug a partir do nome
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .trim()
}

// Função para gerar slug único
async function generateUniqueSlug(name: string): Promise<string> {
  const baseSlug = createSlug(name)
  let slug = baseSlug
  let counter = 1
  
  while (await db.barber.findUnique({ where: { slug } })) {
    counter++
    slug = `${baseSlug}-${counter}`
  }
  
  return slug
}

// Popular slugs para barbeiros existentes
async function populateSlugs() {
  console.log("🔄 Iniciando população de slugs...")
  
  try {
    // Buscar todos os barbeiros sem slug
    const barbers = await db.barber.findMany({
      where: { slug: null }
    })
    
    console.log(`📋 Encontrados ${barbers.length} barbeiros sem slug`)
    
    // Atualizar cada barbeiro com um slug único
    for (const barber of barbers) {
      const slug = await generateUniqueSlug(barber.name)
      
      await db.barber.update({
        where: { id: barber.id },
        data: { slug }
      })
      
      console.log(`✅ ${barber.name} -> ${slug}`)
    }
    
    console.log("✨ Todos os slugs foram populados com sucesso!")
    
  } catch (error) {
    console.error("❌ Erro ao popular slugs:", error)
  } finally {
    await db.$disconnect()
  }
}

// Executar a função
populateSlugs()