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
  meetingType?: 'in_person' | 'video'
  address?: string
  city?: string
  reasonForVisit?: string
}

const AppointmentConfirmedEmail = ({
  recipientName, providerName, appointmentDate, appointmentTime, meetingType, address, city, reasonForVisit,
}: Props) => (
  <Html lang="el" dir="ltr">
    <Head />
    <Preview>Το ραντεβού σας με {providerName} επιβεβαιώθηκε</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>✅ Ραντεβού Επιβεβαιωμένο</Heading>
        <Text style={text}>
          Γεια σας{recipientName ? ` ${recipientName}` : ''},
        </Text>
        <Text style={text}>
          Το ραντεβού σας στο {SITE_NAME} έχει καταχωρηθεί επιτυχώς.
        </Text>
        <Section style={card}>
          <Text style={cardLabel}>Πάροχος</Text>
          <Text style={cardValue}>{providerName}</Text>
          <Hr style={hr} />
          <Text style={cardLabel}>Ημερομηνία & Ώρα</Text>
          <Text style={cardValue}>{appointmentDate} · {appointmentTime}</Text>
          <Hr style={hr} />
          <Text style={cardLabel}>Τύπος συνάντησης</Text>
          <Text style={cardValue}>
            {meetingType === 'video' ? '🎥 Βιντεοκλήση' : '🏥 Δια ζώσης'}
          </Text>
          {address && (
            <>
              <Hr style={hr} />
              <Text style={cardLabel}>Διεύθυνση</Text>
              <Text style={cardValue}>{address}{city ? `, ${city}` : ''}</Text>
            </>
          )}
          {reasonForVisit && (
            <>
              <Hr style={hr} />
              <Text style={cardLabel}>Λόγος επίσκεψης</Text>
              <Text style={cardValue}>{reasonForVisit}</Text>
            </>
          )}
        </Section>
        <Text style={smallNote}>
          Μπορείτε να ακυρώσετε ή να διαχειριστείτε το ραντεβού σας από την εφαρμογή Medithos
          στην ενότητα "Τα Ραντεβού μου". Το Medithos είναι εργαλείο πλοήγησης υγείας —
          δεν αντικαθιστά την επίσημη ιατρική φροντίδα.
        </Text>
        <Text style={footer}>Με εκτίμηση, η ομάδα του {SITE_NAME}</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: AppointmentConfirmedEmail,
  subject: (d: Record<string, any>) =>
    `✅ Ραντεβού επιβεβαιωμένο — ${d?.providerName ?? 'Πάροχος'}, ${d?.appointmentDate ?? ''} ${d?.appointmentTime ?? ''}`,
  displayName: 'Επιβεβαίωση ραντεβού',
  previewData: {
    recipientName: 'Μαρία',
    providerName: 'Δρ. Παπαδόπουλος',
    appointmentDate: '2026-04-25',
    appointmentTime: '10:30',
    meetingType: 'in_person',
    address: 'Λ. Κηφισίας 120',
    city: 'Αθήνα',
    reasonForVisit: 'Ετήσιος προληπτικός έλεγχος',
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
const smallNote = { fontSize: '13px', color: '#64748b', lineHeight: '1.5', margin: '20px 0', fontStyle: 'italic' as const }
const footer = { fontSize: '13px', color: '#94a3b8', margin: '24px 0 0' }
