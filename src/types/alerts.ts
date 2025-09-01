import { ReactNode } from 'react'

export type AlertColor = 'success' | 'warning' | 'danger' | 'neutral' | string

export type TAlert = {
  title?: string
  // short user-facing message/body
  message?: string
  // semantic color used by UI primitives
  color?: AlertColor
  // milliseconds before auto-dismiss; optional
  duration?: number
  // icon is intentionally part of the runtime UI representation and not required in Redux payloads
  icon?: ReactNode
}
