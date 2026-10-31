import type { Messages } from '..'

export const layout: Messages['layout'] = {
  guideAlt: 'La girafe, ton guide',
  loader: {
    default: 'On prépare tout pour toi...',
  },
  backButton: {
    default: 'Retour',
  },
  errors: {
    routeError:
      "Un problème est survenu de notre côté. Tu n'y es pour rien, et ta progression est en sécurité.",
    notFound:
      'Impossible de trouver cette page. Elle a peut-être été déplacée, ou le lien est incomplet.',
    tryAgain: 'Réessayer',
    backToStart: "Retour à l'accueil",
  },
}
