import type { Messages } from '..'

export const auth: Messages['auth'] = {
  meta: {
    title: 'Connexion',
    description:
      'Connecte-toi pour garder ta progression et continuer à pratiquer la communication bienveillante.',
  },
  welcomingIn: "On t'ouvre la porte...",
  protectedLoading: 'On prépare ton espace...',
  headings: {
    signIn: {
      title: 'Connexion',
      subtitle:
        'Tes conversations et ta progression sont gardées dans ton compte',
    },
    signUp: {
      title: 'Crée ton compte',
      subtitle: 'Ta pratique reste privée',
    },
    resetRequest: {
      title: 'Réinitialise ton mot de passe',
      subtitle: "On t'envoie un code par e-mail pour en choisir un nouveau",
    },
    resetVerify: {
      title: 'Choisis un nouveau mot de passe',
      subtitle: 'Saisis le code reçu par e-mail et ton nouveau mot de passe',
    },
  },
  welcome: {
    signIn:
      "Tes conversations d'entraînement sont gardées dans ton compte, pour que tu puisses y revenir. Première visite ? Crée un compte tout en bas, ça ne prend qu'un instant.",
    signUp:
      'Quel plaisir de te voir ici. Avec un compte, tu peux répéter chaque scénario autant de fois que tu veux.',
    resetRequest:
      "Ça arrive à tout le monde. Donne-moi l'adresse de ton inscription, et je t'envoie un code pour que tu puisses reprendre ta pratique.",
    resetVerify:
      "On y est presque. Saisis le code reçu par e-mail, choisis un nouveau mot de passe, et tu retrouves ta pratique là où tu l'avais laissée.",
  },
  errors: {
    codeMismatch:
      "Ce code ne correspond pas, ou il a expiré. Tu peux t'en envoyer un nouveau.",
    wrongCredentials:
      'Cet e-mail et ce mot de passe ne correspondent à aucun compte. Vérifie-les, ou crée un nouveau compte plus bas.',
    tooManyAttempts:
      'Trop de tentatives pour le moment. Attends un instant, puis réessaie.',
    passwordTooShort: "Choisis un mot de passe d'au moins 8 caractères.",
    accountExists:
      'Un compte existe déjà avec cet e-mail. Essaie plutôt de te connecter.',
    signUpFailed:
      'Impossible de créer ton compte. Cet e-mail en a peut-être déjà un, ou le mot de passe fait moins de 8 caractères.',
    resetRequestFailed:
      'Impossible de lancer la réinitialisation pour le moment. Réessaie dans un instant.',
    resetVerifyFailed:
      "Impossible de mettre à jour ton mot de passe. Le code ne correspond peut-être pas, ou il a expiré. Tu peux t'en envoyer un nouveau.",
    signInFailed:
      'Impossible de te connecter. Vérifie ton e-mail et ton mot de passe. Si tu as un doute sur ton mot de passe, tu peux le réinitialiser.',
  },
  codeSent:
    'Si un compte existe pour cette adresse, un code est en route. Il peut mettre un moment à arriver.',
  submit: {
    waiting: 'Un instant...',
    signUp: 'Créer un compte',
    resetRequest: "M'envoyer un code",
    resetVerify: 'Mettre à jour et se connecter',
    signIn: 'Se connecter',
  },
  github: {
    connecting: 'Connexion...',
    continue: 'Continuer avec GitHub',
  },
  orWithEmail: 'ou par e-mail',
  fields: {
    email: 'Adresse e-mail',
    emailPlaceholder: 'toi@exemple.com',
    password: 'Mot de passe',
    createPasswordPlaceholder: 'Crée un mot de passe',
    passwordPlaceholder: 'Saisis ton mot de passe',
    passwordHint: '8 caractères minimum, pour ta sécurité',
    forgotPassword: 'Mot de passe oublié ?',
    code: 'Code reçu par e-mail',
    codePlaceholder: '12345678',
    newPassword: 'Nouveau mot de passe',
    newPasswordPlaceholder: 'Choisis un nouveau mot de passe',
  },
  switchMode: {
    haveAccount: 'Tu as déjà un compte ? ',
    signIn: 'Se connecter',
    newHere: 'Tu découvres la communication bienveillante ? ',
    createAccount: 'Créer un compte',
  },
  reset: {
    noCode: 'Pas reçu de code ?',
    sendAnother: 'En renvoyer un',
    backToSignIn: 'Retour à la connexion',
  },
}
