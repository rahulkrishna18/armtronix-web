export const INTERESTS = ["Integrated project", "Construction", "Engineering", "Transmission", "Technologies"] as const;

export type ContactPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  interest: string;
  details: string;
  company?: string; // honeypot — must stay empty
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Shared validation for the client form and the API route. Returns field → message. */
export function validateContact(p: Partial<ContactPayload>): Record<string, string> {
  const errors: Record<string, string> = {};
  const req = (k: keyof ContactPayload, label: string, max = 120) => {
    const v = (p[k] ?? "").toString().trim();
    if (!v) errors[k] = `${label} is required.`;
    else if (v.length > max) errors[k] = `${label} is too long.`;
  };
  req("firstName", "First name");
  req("lastName", "Last name");
  req("email", "Email address", 200);
  if (!errors.email && !EMAIL.test((p.email ?? "").trim())) errors.email = "Enter a valid email address.";
  const phone = (p.phone ?? "").trim();
  if (phone && !/^[+()\d\s-]{6,24}$/.test(phone)) errors.phone = "Enter a valid phone number.";
  if (p.interest && !INTERESTS.includes(p.interest as (typeof INTERESTS)[number])) errors.interest = "Choose an option.";
  req("details", "Project details", 4000);
  if (!errors.details && (p.details ?? "").trim().length < 10) errors.details = "Tell us a little more about the project.";
  return errors;
}

export function mailtoFor(p: ContactPayload, to: string) {
  const subject = `Project enquiry – ${p.interest || "Armtronix"}`;
  const body = `Name: ${p.firstName} ${p.lastName}\nEmail: ${p.email}\nPhone: ${p.phone || "-"}\nInterest: ${p.interest}\n\n${p.details}`;
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
