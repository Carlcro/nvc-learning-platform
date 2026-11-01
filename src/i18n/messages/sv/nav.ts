import type { Messages } from '..'

export const nav: Messages['nav'] = {
  links: {
    home: 'Hem',
    lessons: 'Lektioner',
    practice: 'Öva',
    daily: 'Dagens',
    feelings: 'Känslor',
    profile: 'Profil',
  },
  toggleMenu: 'Visa eller dölj menyn',
  userMenu: 'Användarmeny',
  learnerFallbackName: 'Deltagare',
  level: (level: number) => `Nivå ${level}`,
  stats: {
    level: 'Nivå',
    points: 'Poäng',
    streak: 'Svit',
  },
  tour: 'Rundtur i appen',
  admin: 'Admin',
  logOut: 'Logga ut',
  signIn: 'Logga in',
}
