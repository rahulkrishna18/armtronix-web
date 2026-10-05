"use client";

import { useState, type FormEvent } from "react";
import { CONTACT } from "@/content/site";
import { INTERESTS, mailtoFor, validateContact, type ContactPayload } from "@/lib/contact";
import { CircuitButton } from "@/components/ui/CircuitButton";
import { StatusDot } from "@/components/ui/StatusDot";
import { cn } from "@/lib/cn";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "fallback"; href: string } | { kind: "error"; message: string };

const empty: ContactPayload = { firstName: "", lastName: "", email: "", phone: "", interest: INTERESTS[0], details: "", company: "" };

function Field({
  id,
  label,
  error,
  optional,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="group relative">
      <label htmlFor={id} className="flex items-center justify-between font-mono text-[10.5px] uppercase tracking-[0.14em] text-mute">
        {label}
        {optional && <span className="text-dim normal-case tracking-normal">optional</span>}
      </label>
      <div className="relative mt-2">
        {children}
        <span aria-hidden className={cn("absolute inset-x-0 bottom-0 h-px origin-left transition-transform duration-500 group-focus-within:scale-x-100", error ? "scale-x-100 bg-red" : "scale-x-0 bg-cyan")} />
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-2 font-mono text-[11px] text-red">
          {error}
        </p>
      )}
    </div>
  );
}

const inputCls =
  "w-full border-0 border-b border-steel-2 bg-transparent px-0 py-3 text-[16px] text-white placeholder:text-dim focus:border-steel-2 focus:outline-none focus:ring-0 focus-visible:outline-none";

export function ContactForm({ defaultInterest }: { defaultInterest?: string }) {
  const [values, setValues] = useState<ContactPayload>({ ...empty, interest: defaultInterest ?? empty.interest });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const set = (k: keyof ContactPayload) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: "" }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validateContact(values);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(Object.keys(found)[0])?.focus();
      return;
    }
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus({ kind: "sent" });
        setValues({ ...empty, interest: values.interest });
      } else if (data.errors) {
        setErrors(data.errors);
        setStatus({ kind: "idle" });
      } else {
        setStatus({ kind: "fallback", href: mailtoFor(values, CONTACT.email) });
      }
    } catch {
      setStatus({ kind: "fallback", href: mailtoFor(values, CONTACT.email) });
    }
  };

  if (status.kind === "sent") {
    return (
      <div className="flex min-h-[420px] flex-col justify-center border border-green/40 bg-green/[0.04] p-8" role="status">
        <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-green">
          <StatusDot tone="green" /> Transmission received
        </p>
        <p className="display mt-6 text-[clamp(1.8rem,3vw,2.6rem)]">Thank you — your enquiry is with our team.</p>
        <p className="mt-4 text-[15px] text-mute">We’ll be in touch shortly. For anything urgent, call {CONTACT.phone}.</p>
        <button type="button" onClick={() => setStatus({ kind: "idle" })} className="mt-8 w-fit font-mono text-[11px] uppercase tracking-[0.14em] text-mute hover:text-cyan">
          ← Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="relative grid gap-8" aria-describedby="form-note">
      <div className="grid gap-8 sm:grid-cols-2">
        <Field id="firstName" label="First name" error={errors.firstName}>
          <input id="firstName" name="firstName" autoComplete="given-name" value={values.firstName} onChange={set("firstName")} aria-invalid={!!errors.firstName} aria-describedby={errors.firstName ? "firstName-error" : undefined} className={inputCls} />
        </Field>
        <Field id="lastName" label="Last name" error={errors.lastName}>
          <input id="lastName" name="lastName" autoComplete="family-name" value={values.lastName} onChange={set("lastName")} aria-invalid={!!errors.lastName} aria-describedby={errors.lastName ? "lastName-error" : undefined} className={inputCls} />
        </Field>
        <Field id="email" label="Email address" error={errors.email}>
          <input id="email" name="email" type="email" autoComplete="email" inputMode="email" value={values.email} onChange={set("email")} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} className={inputCls} />
        </Field>
        <Field id="phone" label="Phone number" optional error={errors.phone}>
          <input id="phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" value={values.phone} onChange={set("phone")} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "phone-error" : undefined} className={inputCls} />
        </Field>
      </div>

      <fieldset>
        <legend className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-mute">Area of interest</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {INTERESTS.map((opt) => (
            <label key={opt} className={cn("cursor-pointer border px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-cyan", values.interest === opt ? "border-cyan bg-cyan/10 text-cyan" : "border-steel-2/80 text-mute hover:text-white")}>
              <input type="radio" name="interest" value={opt} checked={values.interest === opt} onChange={set("interest")} className="sr-only" />
              {opt}
            </label>
          ))}
        </div>
      </fieldset>

      <Field id="details" label="Project details" error={errors.details}>
        <textarea id="details" name="details" rows={5} value={values.details} onChange={set("details")} aria-invalid={!!errors.details} aria-describedby={errors.details ? "details-error" : undefined} placeholder="Facility type, location, scope, timeline…" className={cn(inputCls, "resize-y")} />
      </Field>

      {/* Honeypot */}
      <div aria-hidden className="absolute -left-[9999px] size-px overflow-hidden">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" value={values.company} onChange={set("company")} />
      </div>

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <CircuitButton type="submit" size="lg" disabled={status.kind === "sending"} className="disabled:opacity-60">
          {status.kind === "sending" ? "Transmitting…" : "Request a Free Consultation"}
        </CircuitButton>
        <p id="form-note" className="font-mono text-[10.5px] tracking-[0.06em] text-dim">
          Or email <a className="text-mute underline-offset-4 hover:text-cyan hover:underline" href={CONTACT.emailHref}>{CONTACT.email}</a>
        </p>
      </div>

      {status.kind === "fallback" && (
        <div role="alert" className="border border-amber/40 bg-amber/[0.05] p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-amber">Online submission unavailable</p>
          <p className="mt-2 text-[14.5px] text-white/85">
            Your details are ready to send by email instead.{" "}
            <a href={status.href} className="text-cyan underline underline-offset-4">
              Open in your email app
            </a>{" "}
            or call {CONTACT.phone}.
          </p>
        </div>
      )}
    </form>
  );
}
