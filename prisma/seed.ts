/* eslint-disable no-console */
import { PrismaClient, type User } from '@prisma/client'

const prisma = new PrismaClient()

// Test users with pre-hashed passwords (compatible with nuxt-auth-utils)
const seedUsers = [
  {
    email: 'admin@example.com',
    password:
      '$scrypt$n=16384,r=8,p=1$Nn8nVuIj5KB9Dlj/1DjECg$Nw69xt0a86YX3PWYf8bB3GCKijyvwyoiSRXKnCapI6qp7IxxE5xZEhfGbkZMzFKf9U4GPF6xFY/yfwaV1Emmtg', // admin123
    name: 'Admin User',
    emailVerified: true,
    emailVerifiedAt: new Date()
  },
  {
    email: 'author@example.com',
    password:
      '$scrypt$n=16384,r=8,p=1$P45lRBd44V/Ldl1xbS3QGQ$31lj2goYjRRwpniWfAEkC0ALpPVcu+C8rJLmforCMlm97E/I7ORkI2NWHT3qLVr/jaaOG1OP0uvuXugdirsnwQ', // author123
    name: 'Content Author',
    emailVerified: true,
    emailVerifiedAt: new Date()
  },
  {
    email: 'editor@example.com',
    password:
      '$scrypt$n=16384,r=8,p=1$SdRqhJlpopJJDIBR3Vq9aw$l3NIJ/EYWphnGB9uuAGn0ve9AF4N8ChpFC4dTvAleX+zkbSy68Ge27rx/Li8QvdgMCm3+lkahSgkgofVb6CWfw', // editor123
    name: 'Content Editor',
    emailVerified: true,
    emailVerifiedAt: new Date()
  },
  {
    email: 'demo@example.com',
    password:
      '$scrypt$n=16384,r=8,p=1$zW1Nt12sSTXq6PeflXZHlw$2vNZNORH2MHQBTq+zswcqeWj/Sc+hsaOlQ8taKgxA3KBoKmlXcaxRS/DVYGCgksh+qjH3iKvg7veP6wsZkFjeQ', // demo123
    name: 'Demo User',
    emailVerified: true,
    emailVerifiedAt: new Date()
  }
]

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
  await prisma.user.deleteMany()
  console.log('✅ Existing data deleted')

  // Create test users with pre-hashed passwords
  const createdUsers: User[] = []
  for (const userData of seedUsers) {
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: userData.password, // Already hashed
        name: userData.name,
        emailVerified: userData.emailVerified,
        emailVerifiedAt: userData.emailVerifiedAt
      }
    })
    createdUsers.push(user)
  }
  console.log(`✅ ${createdUsers.length} test users created`)

  // Create posts and associate them with random users
  for (let i = 0; i < seedPosts.length; i++) {
    const post = seedPosts[i]
    // Distribute posts among users (cycling through them)
    const authorIndex = i % createdUsers.length
    const authorId = createdUsers[authorIndex].id

    await prisma.post.create({
      data: {
        ...post,
        authorId
      }
    })
  }

  console.log(`✅ ${seedPosts.length} test posts created and associated with users`)
  console.log('🎉 Seeding completed successfully!')

  // Display created users for reference
  console.log('\n📋 Created users:')
  for (const user of createdUsers) {
    console.log(`   • ${user.name} (${user.email}) - ID: ${user.id}`)
  }
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
