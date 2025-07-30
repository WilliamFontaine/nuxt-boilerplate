/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const seedPosts = [
  {
    title: 'Introduction to Nuxt 4 Development',
    content:
      'Nuxt 4 brings many improvements over previous versions. In this article, we will explore new features like faster compilation, better performance, and improved TypeScript integration. We will also look at how to migrate your existing projects to this major new version.'
  },
  {
    title: 'Comprehensive Guide to Vue.js Composition API',
    content:
      'The Composition API has become the recommended method for developing with Vue.js. It offers better code reusability, more organized logic, and improved TypeScript support. This guide covers key concepts such as ref, reactive, computed, and watch, with practical examples.'
  },
  {
    title: 'Web Performance Optimization in 2024',
    content:
      'Web performance is critical for user experience and SEO. This article explores modern optimization techniques: lazy loading, tree shaking, code splitting, image optimization, effective caching, and measuring Core Web Vitals. Practical tips to improve your PageSpeed score.'
  },
  {
    title: 'TypeScript: Advanced Types and Best Practices',
    content:
      'TypeScript offers a powerful type system that goes beyond primitive types. Discover utility types, generics, conditional types, type inference, and advanced techniques for building type-safe and maintainable APIs.'
  },
  {
    title: 'Modern Architecture with Pinia',
    content:
      'Pinia is the new standard for state management in Vue.js. Simpler and more performant than Vuex, it offers an intuitive API, excellent TypeScript support, and integrated devtools. This guide covers store creation, persistence, and best practices.'
  },
  {
    title: 'Security for Modern Web Applications',
    content:
      'Web security is constantly evolving with new threats and solutions. This article covers common vulnerabilities (XSS, CSRF, SQL injection), essential security headers, modern authentication (JWT, OAuth2), and best practices for securing APIs.'
  },
  {
    title: 'Automated Testing with Vitest and Playwright',
    content:
      'A solid testing strategy is essential for maintaining code quality. Learn how to set up unit tests with Vitest, integration tests, and E2E tests with Playwright. Mocking techniques, coverage, and CI/CD integration are also covered.'
  },
  {
    title: 'Deployment and DevOps for Frontend Developers',
    content:
      'Modern deployment goes beyond simple FTP uploads. Explore Docker, CI/CD pipelines with GitHub Actions, automated deployment, application monitoring, and rollback strategies. A practical guide for smooth production releases.'
  },
  {
    title: 'Design Systems and Reusable Components',
    content:
      'A consistent design system improves user experience and speeds up development. Learn how to create reusable Vue.js components, organize your design system, document your components, and maintain visual consistency at scale.'
  },
  {
    title: 'Progressive Web Apps (PWA) with Nuxt',
    content:
      'PWAs combine the best of web and mobile. Learn how to turn your Nuxt app into a PWA: service workers, advanced caching, offline functionality, push notifications, and home screen installation. The future of mobile web.'
  }
]

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clean up existing data
  await prisma.post.deleteMany()
  console.log('✅ Existing data deleted')

  // Create new posts
  for (const post of seedPosts) {
    await prisma.post.create({
      data: post
    })
  }

  console.log(`✅ ${seedPosts.length} test posts created`)
  console.log('🎉 Seeding completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error during seeding:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
