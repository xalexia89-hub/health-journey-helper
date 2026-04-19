/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body,
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
const ADMIN_EMAIL = 'info@medithos-healthhub.com'

interface NewUserSignupProps {
  userEmail?: string
  userName?: string
  signupDate?: string
  userId?: string
}

const NewUserSignupEmail = ({
  userEmail,
  userName,
  signupDate,
  userId,
}: NewUserSignupProps) => (
  <Html lang="el" dir="ltr">
    <Head />
    <Preview>Νέα εγγραφή χρήστη στο {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>🎉 Νέα Εγγραφή Χρήστη</Heading>
        <Text style={text}>
          Ένας νέος χρήστης μόλις εγγράφηκε στο <strong>{SITE_NAME}</strong>.
        </Text>

        <Section style={infoBox}>
          <Text style={label}>Όνομα</Text>
          <Text style={value}>{userName || '—'}</Text>

          <Hr style={divider} />

          <Text style={label}>Email</Text>
          <Text style={value}>{userEmail || '—'}</Text>

          <Hr style={divider} />

          <Text style={label}>Ημερομηνία Εγγραφής</Text>
          <Text style={value}>{signupDate || new Date().toLocaleString('el-GR')}</Text>

          {userId && (
            <>
              <Hr style={divider} />
              <Text style={label}>User ID</Text>
              <Text style={valueMono}>{userId}</Text>
            </>
          )}
        </Section>

        <Text style={footer}>
          Αυτή η ειδοποίηση στάλθηκε αυτόματα από το {SITE_NAME}.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: NewUserSignupEmail,
  subject: 'Νέα εγγραφή χρήστη στο Medithos',
  to: ADMIN_EMAIL,
  displayName: 'Ειδοποίηση νέας εγγραφής (admin)',
  previewData: {
    userEmail: 'jane.doe@example.com',
    userName: 'Jane Doe',
    signupDate: new Date().toLocaleString('el-GR'),
    userId: '00000000-0000-0000-0000-000000000000',
  },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}
const container = { padding: '32px 28px', maxWidth: '560px' }
const h1 = {
  fontSize: '22px',
  fontWeight: 'bold',
  color: '#0f172a',
  margin: '0 0 20px',
}
const text = {
  fontSize: '15px',
  color: '#334155',
  lineHeight: '1.6',
  margin: '0 0 24px',
}
const infoBox = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '10px',
  padding: '20px 24px',
  margin: '0 0 28px',
}
const label = {
  fontSize: '12px',
  color: '#64748b',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: '0 0 4px',
  fontWeight: 600,
}
const value = {
  fontSize: '15px',
  color: '#0f172a',
  margin: '0 0 12px',
  fontWeight: 500,
}
const valueMono = {
  fontSize: '13px',
  color: '#0f172a',
  margin: '0',
  fontFamily: 'ui-monospace, SFMono-Regular, monospace',
}
const divider = {
  border: 'none',
  borderTop: '1px solid #e2e8f0',
  margin: '12px 0',
}
const footer = {
  fontSize: '12px',
  color: '#94a3b8',
  margin: '24px 0 0',
  textAlign: 'center' as const,
}
