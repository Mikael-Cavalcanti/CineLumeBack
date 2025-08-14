import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Limpar dados anteriores
  console.log('🧹 Limpando dados anteriores...')
  await prisma.profileVideoWatchtime.deleteMany({})
  console.log('✅ ProfileVideoWatchtime limpo')
  await prisma.videoGenre.deleteMany({})
  console.log('✅ VideoGenre limpo')
  await prisma.video.deleteMany({})
  console.log('✅ Videos limpos')
  await prisma.genre.deleteMany({})
  console.log('✅ Genres limpos')

  // Seed para Genres
  const genres = [
    'Ação',
    'Aventura',
    'Comédia',
    'Drama',
    'Terror',
    'Ficção Científica',
    'Romance',
    'Suspense',
    'Fantasia',
    'Documentário',
    'Animação',
    'Crime',
    'Guerra',
    'História',
    'Musical',
    'Mistério',
    'Família',
    'Biografia',
    'Esporte',
    'Western'
  ]

  console.log('📚 Criando gêneros...')
  const createdGenres: Array<{ id: number; name: string }> = []
  for (const genreName of genres) {
    const genre = await prisma.genre.upsert({
      where: { name: genreName },
      update: {},
      create: { name: genreName }
    })
    createdGenres.push(genre)
    console.log(`✅ Gênero criado: ${genre.name}`)
  }

  // Seed para Videos - usando vídeos reais e gratuitos
  const videos = [
    {
      title: 'Big Buck Bunny',
      description: 'Um coelho gigante com um coração ainda maior procura por diversão na floresta, mas em vez disso encontra problemas quando seus novos amigos acabam sofrendo bullying.',
      releaseYear: 2008,
      duration: 596, // 9 min 56 segundos
      type: 'filme',
      ageRating: 'Livre',
      thumbnailUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      genreNames: ['Animação', 'Comédia', 'Família']
    },
    {
      title: 'Elephant\'s Dream',
      description: 'Uma jornada surrealista através de um mundo onírico com dois personagens explorando uma realidade alternativa cheia de máquinas bizarras.',
      releaseYear: 2006,
      duration: 654, // 10 min 54 segundos
      type: 'filme',
      ageRating: 'Livre',
      thumbnailUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      genreNames: ['Animação', 'Fantasia', 'Ficção Científica']
    },
    {
      title: 'For Bigger Blazes',
      description: 'Um vídeo promocional que mostra efeitos visuais impressionantes de fogo e explosões em alta qualidade.',
      releaseYear: 2015,
      duration: 15, // 15 segundos
      type: 'filme',
      ageRating: 'Livre',
      thumbnailUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      genreNames: ['Ação', 'Documentário']
    },
    {
      title: 'For Bigger Escape',
      description: 'Uma sequência de fuga emocionante filmada em paisagens deslumbrantes, perfeito para testar qualidade de vídeo.',
      releaseYear: 2015,
      duration: 15, // 15 segundos
      type: 'filme',
      ageRating: 'Livre',
      thumbnailUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      genreNames: ['Aventura', 'Ação']
    },
    {
      title: 'For Bigger Fun',
      description: 'Um vídeo divertido e colorido com música animada, ideal para demonstrações de streaming de vídeo.',
      releaseYear: 2015,
      duration: 15, // 15 segundos
      type: 'filme',
      ageRating: 'Livre',
      thumbnailUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      genreNames: ['Comédia', 'Musical', 'Família']
    },
    {
      title: 'For Bigger Joyrides',
      description: 'Uma aventura emocionante de carro com paisagens incríveis, perfeito para testes de streaming em alta velocidade.',
      releaseYear: 2015,
      duration: 15, // 15 segundos
      type: 'filme',
      ageRating: 'Livre',
      thumbnailUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerJoyrides.jpg',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      genreNames: ['Ação', 'Aventura']
    },
    {
      title: 'For Bigger Meltdowns',
      description: 'Efeitos visuais impressionantes mostrando derretimento e transformação, ideal para testar capacidades de rendering.',
      releaseYear: 2015,
      duration: 15, // 15 segundos
      type: 'filme',
      ageRating: 'Livre',
      thumbnailUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerMeltdowns.jpg',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      genreNames: ['Ficção Científica', 'Documentário']
    },
    {
      title: 'Sintel',
      description: 'Uma jovem guerreira embarca em uma jornada perigosa para salvar seu companheiro dragão em um mundo fantástico.',
      releaseYear: 2010,
      duration: 888, // 14 min 48 segundos
      type: 'filme',
      ageRating: '10',
      thumbnailUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      genreNames: ['Animação', 'Aventura', 'Fantasia']
    },
    {
      title: 'Tears of Steel',
      description: 'Em um mundo pós-apocalíptico, um grupo de guerreiros luta contra robôs em uma batalha épica pela sobrevivência da humanidade.',
      releaseYear: 2012,
      duration: 734, // 12 min 14 segundos
      type: 'filme',
      ageRating: '12',
      thumbnailUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      genreNames: ['Ficção Científica', 'Ação', 'Drama']
    },
    {
      title: 'Subaru Outback On Street And Dirt',
      description: 'Demonstração das capacidades do Subaru Outback em diferentes terrenos, tanto em estradas quanto em trilhas.',
      releaseYear: 2015,
      duration: 15, // 15 segundos
      type: 'filme',
      ageRating: 'Livre',
      thumbnailUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/SubaruOutbackOnStreetAndDirt.jpg',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
      genreNames: ['Documentário', 'Esporte']
    }
  ]

  console.log('🎬 Criando vídeos...')
  const createdVideos: Array<any> = []
  for (const videoData of videos) {
    const { genreNames, ...videoInfo } = videoData
    const video = await prisma.video.create({
      data: videoInfo
    })
    createdVideos.push({ ...video, genreNames })
    console.log(`✅ Vídeo criado: ${video.title}`)
  }

  // Seed para VideoGenre (relacionamento many-to-many)
  console.log('🔗 Criando relacionamentos Video-Genre...')
  for (const video of createdVideos) {
    for (const genreName of video.genreNames) {
      const genre = createdGenres.find(g => g.name === genreName)
      if (genre) {
        await prisma.videoGenre.create({
          data: {
            videoId: video.id,
            genreId: genre.id
          }
        })
        console.log(`✅ Relacionamento criado: ${video.title} -> ${genre.name}`)
      }
    }
  }

  // Seed para ProfileVideoWatchtime - buscar perfis existentes e linkar a vídeos aleatórios
  console.log('⏱️ Criando dados de tempo assistido...')
  
  const existingProfiles = await prisma.profile.findMany()
  console.log(`📊 Encontrados ${existingProfiles.length} perfis existentes`)
  
  if (existingProfiles.length > 0) {
    const profileWatchtimeData: Array<any> = []
    
    for (const profile of existingProfiles) {
      // Selecionar 2 vídeos aleatórios para cada perfil
      const shuffledVideos = [...createdVideos].sort(() => 0.5 - Math.random())
      const selectedVideos = shuffledVideos.slice(0, 2)
      
      for (const video of selectedVideos) {
        // Gerar tempo assistido aleatório (entre 10% e 90% do vídeo)
        const minWatch = Math.floor(video.duration * 0.1)
        const maxWatch = Math.floor(video.duration * 0.9)
        const watchTime = Math.floor(Math.random() * (maxWatch - minWatch + 1)) + minWatch
        
        const watchData = {
          profileId: profile.id,
          videoId: video.id,
          totalWatch: watchTime
        }
        
        profileWatchtimeData.push(watchData)
        
        await prisma.profileVideoWatchtime.create({
          data: watchData
        })
        
        const watchPercentage = Math.round((watchTime / video.duration) * 100)
        console.log(`✅ ${profile.name} assistiu ${watchPercentage}% de "${video.title}"`)
      }
    }
    
    console.log(`📊 ${profileWatchtimeData.length} registros de tempo assistido criados`)
  } else {
    console.log('⚠️ Nenhum perfil encontrado - pulando criação de ProfileVideoWatchtime')
  }

  console.log('🎉 Seed concluído com sucesso!')
  console.log(`📊 Resumo:`)
  console.log(`   - ${createdGenres.length} gêneros criados`)
  console.log(`   - ${createdVideos.length} vídeos criados`)
  
  const totalRelations = createdVideos.reduce((acc, video) => acc + video.genreNames.length, 0)
  console.log(`   - ${totalRelations} relacionamentos Video-Genre criados`)
  
  if (existingProfiles.length > 0) {
    console.log(`   - ${existingProfiles.length * 2} registros de tempo assistido criados`)
  }
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })