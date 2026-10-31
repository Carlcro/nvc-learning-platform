import type { Messages } from '..'

export const nav: Messages['nav'] = {
  links: {
    home: 'Accueil',
    lessons: 'Leçons',
    practice: 'Pratique',
    daily: 'Défi',
    feelings: 'Sentiments',
    profile: 'Profil',
  },
  toggleMenu: 'Ouvrir ou fermer le menu',
  userMenu: 'Menu du compte',
  learnerFallbackName: 'Élève',
  level: (level: number) => `Niveau ${level}`,
  stats: {
    level: 'Niveau',
    points: 'Points',
    streak: 'Série',
  },
  admin: 'Admin',
  logOut: 'Se déconnecter',
  signIn: 'Se connecter',
}
