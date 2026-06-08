/** Chemins de route utilisés dans toute l'application. */
export const ROUTES = {
  title:    '/',
  menu:     '/menu',
  gameplay: '/gameplay',
  rules:    '/rules',
  options:  '/options',
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]


