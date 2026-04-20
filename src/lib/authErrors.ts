/**
 * Μεταφράζει συνηθισμένα μηνύματα σφαλμάτων του Supabase Auth στα Ελληνικά.
 */
export function translateAuthError(message: string | undefined | null): string {
  if (!message) return "Κάτι πήγε στραβά. Δοκιμάστε ξανά.";

  const msg = message.toLowerCase();

  if (msg.includes("password is known to be weak") || msg.includes("pwned") || msg.includes("weak_password")) {
    return "Ο κωδικός που επιλέξατε έχει εντοπιστεί σε γνωστές διαρροές δεδομένων και θεωρείται μη ασφαλής. Παρακαλώ επιλέξτε έναν διαφορετικό, πιο ισχυρό κωδικό (συνδυασμός γραμμάτων, αριθμών και συμβόλων).";
  }
  if (msg.includes("password should be at least")) {
    return "Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες.";
  }
  if (msg.includes("user already registered") || msg.includes("already been registered") || msg.includes("already exists")) {
    return "Υπάρχει ήδη λογαριασμός με αυτό το email. Παρακαλώ συνδεθείτε.";
  }
  if (msg.includes("invalid login credentials") || msg.includes("invalid credentials")) {
    return "Λανθασμένο email ή κωδικός πρόσβασης.";
  }
  if (msg.includes("email not confirmed")) {
    return "Δεν έχετε επιβεβαιώσει το email σας. Ελέγξτε τα εισερχόμενά σας.";
  }
  if (msg.includes("invalid email")) {
    return "Μη έγκυρη διεύθυνση email.";
  }
  if (msg.includes("rate limit") || msg.includes("too many requests")) {
    return "Υπερβολικά πολλές προσπάθειες. Δοκιμάστε ξανά σε λίγα λεπτά.";
  }
  if (msg.includes("network") || msg.includes("fetch")) {
    return "Πρόβλημα σύνδεσης. Ελέγξτε το internet σας και δοκιμάστε ξανά.";
  }

  return message;
}
