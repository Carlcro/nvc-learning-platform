import type { Messages } from '..'

export const nav: Messages['nav'] = {
  links: {
    home: 'Inicio',
    lessons: 'Lecciones',
    practice: 'Práctica',
    daily: 'Diario',
    feelings: 'Sentimientos',
    profile: 'Perfil',
  },
  toggleMenu: 'Abrir o cerrar el menú',
  userMenu: 'Menú de usuario',
  learnerFallbackName: 'Aprendiz',
  level: (level: number) => `Nivel ${level}`,
  stats: {
    level: 'Nivel',
    points: 'Puntos',
    streak: 'Racha',
  },
  admin: 'Admin',
  logOut: 'Cerrar sesión',
  signIn: 'Iniciar sesión',
}
