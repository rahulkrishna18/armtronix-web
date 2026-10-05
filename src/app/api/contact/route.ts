import { NextResponse } from "next/server";
import { validateContact, type ContactPayload } from "@/lib/contact";

/**
 * Receives project enquiries. If CONTACT_WEBHOOK_URL is configured (e.g. a CRM,
 * Slack or automation endpoint), the validated payload is forwarded there.
 * Without it, the client falls back to the visitor's email client — nothing is
 * silently dropped.
 */
export async function POST(req: Request) {
  let data: Partial<ContactPayload>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields. Pretend success, do nothing.
  if (data.company) return NextResponse.json({ ok: true });

  const errors = validateContact(data);
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (!webhook) {
    return NextResponse.json({ ok: false, fallback: "mailto" }, { status: 503 });
  }

  const payload = {
    firstName: data.firstName!.trim(),
    lastName: data.lastName!.trim(),
    email: data.email!.trim(),
    phone: (data.phone ?? "").trim(),
    interest: data.interest ?? "",
    details: data.details!.trim(),
    source: "armtronix.com/contact",
    receivedAt: new Date().toISOString(),
  };

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] forwarding failed", err);
    return NextResponse.json({ ok: false, fallback: "mailto" }, { status: 502 });
  }
}
