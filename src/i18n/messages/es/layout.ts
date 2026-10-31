import type { Messages } from '..'

export const layout: Messages['layout'] = {
  guideAlt: 'La jirafa, tu guía',
  loader: {
    default: 'Preparando todo para ti...',
  },
  backButton: {
    default: 'Volver',
  },
  errors: {
    routeError:
      'Algo falló por nuestra parte. No es nada que hayas hecho, y tu progreso está a salvo.',
    notFound:
      'No encontramos esa página. Puede que se haya movido o que el enlace esté incompleto.',
    tryAgain: 'Intentar de nuevo',
    backToStart: 'Volver al inicio',
  },
}
