import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const seedPosts = [
  {
    title: 'Introduction au développement Nuxt 4',
    content:
      'Nuxt 4 apporte de nombreuses améliorations par rapport aux versions précédentes. Dans cet article, nous explorerons les nouvelles fonctionnalités comme la compilation plus rapide, les performances améliorées et la meilleure intégration TypeScript. Nous verrons également comment migrer vos projets existants vers cette nouvelle version majeure.'
  },
  {
    title: 'Guide complet de Vue.js Composition API',
    content:
      'La Composition API est devenue la méthode recommandée pour développer avec Vue.js. Elle offre une meilleure réutilisabilité du code, une logique plus organisée et un support TypeScript amélioré. Ce guide couvre les concepts fondamentaux comme ref, reactive, computed et watch, avec des exemples pratiques.'
  },
  {
    title: 'Optimisation des performances web en 2024',
    content:
      'Les performances web sont cruciales pour l\'expérience utilisateur et le SEO. Cet article explore les techniques modernes d\'optimisation : lazy loading, tree shaking, code splitting, optimisation des images, mise en cache efficace et mesure des Core Web Vitals. Des conseils pratiques pour améliorer votre score PageSpeed.'
  },
  {
    title: 'TypeScript : Types avancés et bonnes pratiques',
    content:
      'TypeScript offre un système de types puissant qui va bien au-delà des types primitifs. Découvrez les types utilitaires, les types génériques, les types conditionnels, l\'inférence de type et les techniques avancées pour créer des APIs type-safe et maintenables.'
  },
  {
    title: 'Architecture moderne avec Pinia',
    content:
      'Pinia est le nouveau standard pour la gestion d\'état dans Vue.js. Plus simple et plus performant que Vuex, il offre une API intuitive, un excellent support TypeScript et des devtools intégrés. Ce guide couvre la création de stores, la persistance et les bonnes pratiques.'
  },
  {
    title: 'Sécurité des applications web modernes',
    content:
      'La sécurité web évolue constamment avec de nouvelles menaces et solutions. Cet article couvre les vulnérabilités courantes (XSS, CSRF, injection SQL), les headers de sécurité essentiels, l\'authentification moderne (JWT, OAuth2) et les bonnes pratiques de sécurisation des APIs.'
  },
  {
    title: 'Tests automatisés avec Vitest et Playwright',
    content:
      'Une stratégie de test solide est essentielle pour maintenir la qualité du code. Découvrez comment mettre en place des tests unitaires avec Vitest, des tests d\'intégration et des tests E2E avec Playwright. Techniques de mocking, coverage et intégration CI/CD.'
  },
  {
    title: 'Déploiement et DevOps pour développeurs frontend',
    content:
      'Le déploiement moderne va au-delà du simple upload FTP. Explorez Docker, les pipelines CI/CD avec GitHub Actions, le déploiement automatisé, la surveillance des applications et les stratégies de rollback. Un guide pratique pour passer en production sereinement.'
  },
  {
    title: 'Design System et composants réutilisables',
    content:
      'Un design system cohérent améliore l\'expérience utilisateur et accélère le développement. Apprenez à créer des composants Vue.js réutilisables, à organiser votre système de design, à documenter vos composants et à maintenir la cohérence visuelle à grande échelle.'
  },
  {
    title: 'Progressive Web Apps (PWA) avec Nuxt',
    content:
      'Les PWA combinent le meilleur du web et du mobile. Découvrez comment transformer votre application Nuxt en PWA : service workers, mise en cache avancée, fonctionnement hors ligne, notifications push et installation sur l\'écran d\'accueil. L\'avenir du web mobile.'
  }
]

async function main() {
  // eslint-disable-next-line no-console
  console.log('🌱 Début du seeding de la base de données...')

  // Nettoyer les données existantes
  await prisma.post.deleteMany()
  // eslint-disable-next-line no-console
  console.log('✅ Données existantes supprimées')

  // Créer les nouveaux posts
  for (const post of seedPosts) {
    await prisma.post.create({
      data: post
    })
  }

  // eslint-disable-next-line no-console
  console.log(`✅ ${seedPosts.length} articles de test créés`)
  // eslint-disable-next-line no-console
  console.log('🎉 Seeding terminé avec succès !')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error('❌ Erreur lors du seeding :', e)
    await prisma.$disconnect()
    process.exit(1)
  })
