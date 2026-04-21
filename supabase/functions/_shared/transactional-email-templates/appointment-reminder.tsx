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
}

const AppointmentReminderEmail = ({
  recipientName, providerName, appointmentDate, appointmentTime, meetingType, address, city,
}: Props) => (
  <Html lang="el" dir="ltr">
    <Head />
    <Preview>Υπενθύμιση: το αυριανό σας ραντεβού με {providerName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>⏰ Υπενθύμιση Ραντεβού</Heading>
        <Text style={text}>
          Γεια σας{recipientName ? ` ${recipientName}` : ''},
        </Text>
        <Text style={text}>
          Σας υπενθυμίζουμε ότι έχετε ραντεβού <strong>αύριο</strong> στο {SITE_NAME}.
        </Text>
        <Section style={card}>
          <Text style={cardLabel}>Πάροχος</Text>
          <Text style={cardValue}>{providerName}</Text>
          <Hr style={hr} />
          <Text style={cardLabel}>Ημερομηνία & Ώρα</Text>
          <Text style={cardValue}>{appointmentDate} · {appointmentTime}</Text>
          <Hr style={hr} />
          <Text style={cardLabel}>Τύπος</Text>
          <Text style={cardValue}>
            {meetingType === 'video' ? '🎥 Βιντεοκλήση' : '🏥 Δια ζώσης'}
          </Text>
          {address && meetingType !== 'video' && (
            <>
              <Hr style={hr} />
              <Text style={cardLabel}>Διεύθυνση</Text>
              <Text style={cardValue}>{address}{city ? `, ${city}` : ''}</Text>
            </>
          )}
        </Section>
        <Text style={smallNote}>
          Αν χρειαστεί να αλλάξετε ή να ακυρώσετε το ραντεβού σας, παρακαλούμε
          ενημερώστε όσο νωρίτερα γίνεται μέσω της εφαρμογής Medithos.
        </Text>
        <Text style={footer}>Με εκτίμηση, η ομάδα του {SITE_NAME}</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: AppointmentReminderEmail,
  subject: (d: Record<string, any>) =>
    `⏰ Υπενθύμιση: αύριο ${d?.appointmentTime ?? ''} με ${d?.providerName ?? 'τον πάροχο σας'}`,
  displayName: 'Υπενθύμιση ραντεβού',
  previewData: {
    recipientName: 'Μαρία',
    providerName: 'Δρ. Παπαδόπουλος',
    appointmentDate: '2026-04-25',
    appointmentTime: '10:30',
    meetingType: 'in_person',
    address: 'Λ. Κηφισίας 120',
    city: 'Αθήνα',
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
