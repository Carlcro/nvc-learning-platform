import { achievements } from './achievements'
import { auth } from './auth'
import { challenges } from './challenges'
import { common } from './common'
import { errors } from './errors'
import { feelings } from './feelings'
import { home } from './home'
import { layout } from './layout'
import { learn } from './learn'
import { nav } from './nav'
import { practice } from './practice'
import { profile } from './profile'
import { results } from './results'
import { roleplay } from './roleplay'

/**
 * The English dictionary: the source of truth for every string in the UI.
 * Its shape is the `Messages` type every other language is checked against.
 */
export const en = {
  common,
  nav,
  errors,
  achievements,
  home,
  auth,
  layout,
  practice,
  roleplay,
  results,
  learn,
  feelings,
  profile,
  challenges,
}
