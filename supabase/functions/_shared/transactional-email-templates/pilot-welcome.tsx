/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Medithos'
const SITE_URL = 'https://medithos-healthhub.com'

interface PilotWelcomeProps {
  fullName?: string
  userNumber?: number
}

const PilotWelcomeEmail = ({ fullName, userNumber }: PilotWelcomeProps) => (
  <Html lang="el" dir="ltr">
    <Head />
    <Preview>Καλωσήρθες στο Medithos Pilot 🏥</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={brand}>MEDITHOS</Heading>
          <Text style={pilotBadge}>PILOT v1.0</Text>
        </Section>

        <Section style={content}>
          <Heading style={h1}>
            Καλωσήρθες{fullName ? `, ${fullName}` : ''}! 👋
          </Heading>

          {userNumber && (
            <Text style={highlight}>
              Είσαι ο/η <strong>#{userNumber}</strong> από τους 100 πρώτους χρήστες του Medithos Pilot.
            </Text>
          )}

          <Text style={text}>
            Το Medithos είναι το πρώτο AI σύστημα πλοήγησης υγείας που σκέφτεται ολιστικά για εσένα — διαβάζει τον ιατρικό σου φάκελο, το οικογενειακό σου ιστορικό και σε κατευθύνει στον σωστό γιατρό.
          </Text>

          <Section style={infoBox}>
            <Text style={listTitle}>Τι μπορείς να κάνεις τώρα:</Text>
            <Text style={listItem}>✓ Δημιούργησε το προφίλ υγείας σου</Text>
            <Text style={listItem}>✓ Μίλα με τον AI Health Navigator</Text>
            <Text style={listItem}>✓ Ανέβασε τα ιατρικά σου έγγραφα</Text>
            <Text style={listItem}>✓ Χτίσε το οικογενειακό σου δέντρο υγείας</Text>
          </Section>

          <Section style={{ textAlign: 'center', margin: '32px 0' }}>
            <Button href={SITE_URL} style={button}>
              Ξεκίνα τώρα →
            </Button>
          </Section>

          <Hr style={divider} />

          <Text style={disclaimer}>
            Το Medithos είναι εργαλείο πλοήγησης υγείας και δεν αποτελεί ιατρική συμβουλή.
          </Text>
        </Section>

        <Text style={footer}>
          {SITE_NAME} — AI Health Navigator · medithos-healthhub.com
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: PilotWelcomeEmail,
  subject: 'Καλωσήρθες στο Medithos Pilot 🏥',
  displayName: 'Καλωσόρισμα Pilot χρήστη',
  previewData: {
    fullName: 'Γιώργος Παπαδόπουλος',
    userNumber: 12,
  },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}
const container = { padding: '0', maxWidth: '600px', margin: '0 auto' }
const header = {
  backgroundColor: '#0f172a',
  padding: '32px 24px',
  textAlign: 'center' as const,
}
const brand = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  letterSpacing: '2px',
  margin: '0',
}
const pilotBadge = {
  color: '#fbbf24',
  fontSize: '12px',
  fontWeight: 600,
  letterSpacing: '1.5px',
  margin: '6px 0 0',
}
const content = { padding: '32px 28px' }
const h1 = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#0f172a',
  margin: '0 0 16px',
}
const highlight = {
  fontSize: '15px',
  color: '#0f766e',
  backgroundColor: '#f0fdfa',
  padding: '12px 16px',
  borderRadius: '8px',
  borderLeft: '3px solid #14b8a6',
  margin: '0 0 20px',
}
const text = {
  fontSize: '15px',
  color: '#334155',
  lineHeight: '1.6',
  margin: '0 0 20px',
}
const infoBox = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '10px',
  padding: '20px 24px',
  margin: '0 0 8px',
}
const listTitle = {
  fontSize: '14px',
  fontWeight: 600,
  color: '#0f172a',
  margin: '0 0 12px',
}
const listItem = {
  fontSize: '14px',
  color: '#334155',
  margin: '0 0 8px',
  lineHeight: '1.5',
}
const button = {
  backgroundColor: '#14b8a6',
  color: '#ffffff',
  padding: '14px 32px',
  borderRadius: '8px',
  fontSize: '15px',
  fontWeight: 600,
  textDecoration: 'none',
  display: 'inline-block',
}
const divider = { border: 'none', borderTop: '1px solid #e2e8f0', margin: '24px 0' }
const disclaimer = {
  fontSize: '12px',
  color: '#94a3b8',
  fontStyle: 'italic' as const,
  textAlign: 'center' as const,
  margin: '0',
}
const footer = {
  fontSize: '12px',
  color: '#94a3b8',
  textAlign: 'center' as const,
  padding: '16px 24px 24px',
  margin: '0',
}
