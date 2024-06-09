export const KEYWORDS = {
  BACKEND: [
    '.net',
    'asp.net',
    'django',
    'express',
    'go',
    'java',
    'laravel',
    'nest.js',
    'nestjs',
    'node.js',
    'php',
  ],
  DATABASES: ['mysql', 'cassandra', 'firebase', 'mongodb', 'postgres', 'redis', 'sqlite'],
  DEVOPS: ['ansible', 'jenkins', 'docker', 'kubernetes', 'terraform'],
  get FRONTEND() {
    return [
      ...new Set([
        ...this.FRONTEND_FRAMEWORK,
        ...this.STYLES,
        ...this.STATE_MANAGEMENT,
        ...this.TESTING,
        'fsd',
      ]),
    ]
  },
  FRONTEND_FRAMEWORK: [
    'angular',
    'jquery',
    'next.js',
    'nextjs',
    'nuxt',
    'react',
    'remix',
    'svelte',
    'vue',
  ],
  MOBILE: ['flutter', 'kotlin', 'swift', 'react native', 'xamarin'],
  ORM: ['prisma', 'sequelize', 'drizzle', 'typeorm'],
  STATE_MANAGEMENT: [
    'effector',
    'mobx',
    'react-query',
    'redux toolkit query',
    'redux toolkit',
    'redux',
    'rtk',
  ],
  STYLES: ['material ui', 'mui', 'styled-components', 'tailwind', 'bootstrap', 'css', 'sass'],
  TESTING: ['cypress', 'jasmine', 'playwright', 'puppeteer', 'selenium', 'vitest', 'jest', 'mocha'],
} as const

export const ALL_KEYWORDS = [...new Set(Object.values(KEYWORDS).flat().sort())]

export type Keyword = (typeof ALL_KEYWORDS)[number]
