import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'el' | 'en';

interface Translations {
  [key: string]: {
    el: string;
    en: string;
  };
}

const translations: Translations = {
  // Common
  'app.name': { el: 'Medithos', en: 'Medithos' },
  'app.version': { el: 'MediConnect v1.0.0', en: 'MediConnect v1.0.0' },
  
  // Navigation
  'nav.home': { el: 'Αρχική', en: 'Home' },
  'nav.news': { el: 'Νέα', en: 'News' },
  'nav.appointments': { el: 'Ραντεβού', en: 'Appointments' },
  'nav.records': { el: 'Ιστορικό', en: 'Records' },
  
  // Settings
  'settings.title': { el: 'Ρυθμίσεις', en: 'Settings' },
  'settings.subtitle': { el: 'Διαχειριστείτε τις προτιμήσεις της εφαρμογής', en: 'Manage your app preferences' },
  
  // Notifications
  'settings.notifications': { el: 'Ειδοποιήσεις', en: 'Notifications' },
  'settings.notifications.desc': { el: 'Διαμορφώστε πώς θέλετε να ειδοποιείστε', en: 'Configure how you want to be notified' },
  'settings.notifications.appointments': { el: 'Υπενθυμίσεις Ραντεβού', en: 'Appointment Reminders' },
  'settings.notifications.appointments.desc': { el: 'Ειδοποίηση πριν τα ραντεβού σας', en: 'Get notified before your appointments' },
  'settings.notifications.health': { el: 'Υπενθυμίσεις Υγείας', en: 'Health Reminders' },
  'settings.notifications.health.desc': { el: 'Υπενθυμίσεις φαρμάκων και ελέγχων', en: 'Medication and check-up reminders' },
  'settings.notifications.marketing': { el: 'Ενημερωτικές Επικοινωνίες', en: 'Marketing Communications' },
  'settings.notifications.marketing.desc': { el: 'Λήψη συμβουλών υγείας και προσφορών', en: 'Receive health tips and offers' },
  'settings.notifications.updated': { el: 'Ρυθμίσεις Ενημερώθηκαν', en: 'Settings Updated' },
  'settings.notifications.saved': { el: 'Οι προτιμήσεις ειδοποιήσεων αποθηκεύτηκαν.', en: 'Notification preferences saved.' },
  
  // Communication Channels
  'settings.channels': { el: 'Κανάλια Επικοινωνίας', en: 'Communication Channels' },
  'settings.channels.email': { el: 'Ειδοποιήσεις Email', en: 'Email Notifications' },
  'settings.channels.sms': { el: 'Ειδοποιήσεις SMS', en: 'SMS Notifications' },
  
  // Appearance
  'settings.appearance': { el: 'Εμφάνιση', en: 'Appearance' },
  'settings.appearance.dark': { el: 'Σκοτεινό Θέμα', en: 'Dark Mode' },
  'settings.appearance.dark.desc': { el: 'Εναλλαγή μεταξύ φωτεινού και σκοτεινού θέματος', en: 'Toggle between light and dark theme' },
  'settings.appearance.light.enabled': { el: 'Ενεργοποιήθηκε το Φωτεινό Θέμα', en: 'Light Mode Enabled' },
  'settings.appearance.dark.enabled': { el: 'Ενεργοποιήθηκε το Σκοτεινό Θέμα', en: 'Dark Mode Enabled' },
  'settings.appearance.updated': { el: 'Οι προτιμήσεις εμφάνισης ενημερώθηκαν.', en: 'Appearance preferences updated.' },
  
  // Privacy & Security
  'settings.privacy': { el: 'Απόρρητο & Ασφάλεια', en: 'Privacy & Security' },
  'settings.privacy.password': { el: 'Αλλαγή Κωδικού', en: 'Change Password' },
  'settings.privacy.2fa': { el: 'Ταυτοποίηση Δύο Παραγόντων', en: 'Two-Factor Authentication' },
  'settings.privacy.data': { el: 'Ρυθμίσεις Απορρήτου Δεδομένων', en: 'Data Privacy Settings' },
  
  // Help & Legal
  'settings.help': { el: 'Βοήθεια & Νομικά', en: 'Help & Legal' },
  'settings.help.about': { el: 'Σχετικά με το Medithos', en: 'About Medithos' },
  'settings.help.center': { el: 'Κέντρο Βοήθειας', en: 'Help Center' },
  'settings.help.terms': { el: 'Όροι Χρήσης', en: 'Terms of Use' },
  'settings.help.privacy': { el: 'Πολιτική Απορρήτου', en: 'Privacy Policy' },
  
  // Language
  'settings.language': { el: 'Γλώσσα', en: 'Language' },
  'settings.language.greek': { el: 'Ελληνικά', en: 'Greek' },
  'settings.language.english': { el: 'Αγγλικά', en: 'English' },
  'settings.language.changed': { el: 'Η γλώσσα άλλαξε', en: 'Language changed' },
  'settings.language.updated': { el: 'Η γλώσσα της εφαρμογής ενημερώθηκε.', en: 'App language has been updated.' },
  
  // Sign Out
  'settings.signout': { el: 'Αποσύνδεση', en: 'Sign Out' },
  'settings.signout.confirm': { el: 'Είστε σίγουροι ότι θέλετε να αποσυνδεθείτε από τον λογαριασμό σας;', en: 'Are you sure you want to sign out of your account?' },
  'settings.signout.cancel': { el: 'Ακύρωση', en: 'Cancel' },

  // Dashboard
  'dashboard.welcome': { el: 'Γεια σου', en: 'Hello' },
  'dashboard.symptoms': { el: 'Συμπτώματα', en: 'Symptoms' },
  'dashboard.providers': { el: 'Πάροχοι', en: 'Providers' },
  'dashboard.appointments': { el: 'Ραντεβού', en: 'Appointments' },
  'dashboard.records': { el: 'Ιστορικό', en: 'Records' },
  'dashboard.reminders': { el: 'Υπενθυμίσεις', en: 'Reminders' },
  'dashboard.settings': { el: 'Ρυθμίσεις', en: 'Settings' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('app-language');
    return (saved as Language) || 'el';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app-language', lang);
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
