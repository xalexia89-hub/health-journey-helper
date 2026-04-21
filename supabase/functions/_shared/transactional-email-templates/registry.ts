/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as newUserSignup } from './new-user-signup.tsx'
import { template as pilotWelcome } from './pilot-welcome.tsx'
import { template as appointmentConfirmed } from './appointment-confirmed.tsx'
import { template as appointmentReminder } from './appointment-reminder.tsx'
import { template as appointmentCancelled } from './appointment-cancelled.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'new-user-signup': newUserSignup,
  'pilot-welcome': pilotWelcome,
  'appointment-confirmed': appointmentConfirmed,
  'appointment-reminder': appointmentReminder,
  'appointment-cancelled': appointmentCancelled,
}
