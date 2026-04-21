/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Medithos'

interface Props {
  recipientName?: string
  providerName?: string
  appointmentDate?: string
  appointmentTime?: string
  cancelledBy?: 'patient' | 'provider' | 'system'
  reason?: string
}

const AppointmentCancelledEmail = ({
  recipientName, providerName, appointmentDate, appointmentTime, cancelledBy, reason,
}: Props) => (
  <Html lang="el" dir="ltr">
    <Head />
    <Preview>Το ραντεβού σας ακυρώθηκε</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>❌ Ραντεβού Ακυρώθηκε</Heading>
        <Text style={text}>
          Γεια σας{recipientName ? ` ${recipientName}` : ''},
        </Text>
        <Text style={text}>
          Σας ενημερώνουμε ότι το παρακάτω ραντεβού στο {SITE_NAME} έχει ακυρωθεί
          {cancelledBy === 'provider' ? ' από τον πάροχο' : cancelledBy === 'patient' ? ' από τον ασθενή' : ''}.
        </Text>
        <Section style={card}>
          <Text style={cardLabel}>Πάροχος</Text>
          <Text style={cardValue}>{providerName}</Text>
          <Hr style={hr} />
          <Text style={cardLabel}>Ημερομηνία & Ώρα</Text>
          <Text style={cardValue}>{appointmentDate} · {appointmentTime}</Text>
          {reason && (
            <>
              <Hr style={hr} />
              <Text style={cardLabel}>Λόγος ακύρωσης</Text>
              <Text style={cardValue}>{reason}</Text>
            </>
          )}
        </Section>
        <Text style={text}>
          Μπορείτε να κλείσετε νέο ραντεβού οποιαδήποτε στιγμή μέσω της εφαρμογής Medithos.
        </Text>
        <Text style={footer}>Με εκτίμηση, η ομάδα του {SITE_NAME}</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: AppointmentCancelledEmail,
  subject: (d: Record<string, any>) =>
    `❌ Ραντεβού ακυρώθηκε — ${d?.providerName ?? ''}, ${d?.appointmentDate ?? ''}`,
  displayName: 'Ακύρωση ραντεβού',
  previewData: {
    recipientName: 'Μαρία',
    providerName: 'Δρ. Παπαδόπουλος',
    appointmentDate: '2026-04-25',
    appointmentTime: '10:30',
    cancelledBy: 'patient',
    reason: 'Προσωπικοί λόγοι',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px 24px', maxWidth: '560px' }
const h1 = { fontSize: '24px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 24px' }
const text = { fontSize: '15px', color: '#334155', lineHeight: '1.6', margin: '0 0 16px' }
const card = { backgroundColor: '#f8fafc', borderRadius: '12px', padding: '20px', margin: '20px 0' }
const cardLabel = { fontSize: '12px', color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '0.5px', margin: '0 0 4px' }
const cardValue = { fontSize: '15px', color: '#0f172a', fontWeight: '600', margin: '0 0 8px' }
const hr = { border: 'none', borderTop: '1px solid #e2e8f0', margin: '12px 0' }
const footer = { fontSize: '13px', color: '#94a3b8', margin: '24px 0 0' }
