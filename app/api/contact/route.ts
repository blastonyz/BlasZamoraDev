import { NextResponse } from 'next/server';
import { Resend } from 'resend';

import { connectToDatabase } from '@/app/lib/mongodb';
import ContactMessageModel from '@/app/lib/models/ContactMessage';

type ContactPayload = {
  name: string;
  email: string;
  project: string;
  message: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validatePayload(payload: ContactPayload): string | null {
  if (!payload.name || payload.name.length < 2 || payload.name.length > 120) {
    return 'Invalid name';
  }
  if (!EMAIL_REGEX.test(payload.email) || payload.email.length > 160) {
    return 'Invalid email';
  }
  if (payload.project.length > 160) {
    return 'Invalid project type';
  }
  if (payload.message.length > 4000) {
    return 'Invalid message';
  }
  return null;
}

function sanitizePayload(body: unknown): ContactPayload {
  const payload = body as Record<string, unknown>;
  return {
    name: String(payload.name ?? '').trim(),
    email: String(payload.email ?? '').trim().toLowerCase(),
    project: String(payload.project ?? '').trim(),
    message: String(payload.message ?? '').trim(),
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CONTACT_FROM_EMAIL || 'Blas Portfolio <onboarding@resend.dev>';
  const ownerEmail = process.env.CONTACT_OWNER_EMAIL;

  if (!apiKey || !ownerEmail) {
    return NextResponse.json(
      {
        ok: false,
        error:
          'Missing required environment variables: RESEND_API_KEY, CONTACT_OWNER_EMAIL',
      },
      { status: 500 }
    );
  }

  let createdDoc: {
    _id: string;
    status: string;
    ownerEmailId: string | null;
    senderEmailId: string | null;
    errorMessage: string | null;
    save: () => Promise<unknown>;
  } | null = null;

  try {
    const body = await request.json();
    const payload = sanitizePayload(body);
    const validationError = validatePayload(payload);

    if (validationError) {
      return NextResponse.json({ ok: false, error: validationError }, { status: 400 });
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null;
    const userAgent = request.headers.get('user-agent') || null;

    await connectToDatabase();

    createdDoc = await ContactMessageModel.create({
      ...payload,
      ip,
      userAgent,
      status: 'received',
    });

    const safeName = escapeHtml(payload.name);
    const safeEmail = escapeHtml(payload.email);
    const safeProject = escapeHtml(payload.project || 'Not specified');
    const safeMessage = escapeHtml(payload.message || 'No message provided').replace(/\n/g, '<br />');

    const resend = new Resend(apiKey);

    if (!createdDoc) {
      throw new Error('Failed to persist contact message');
    }

    const ownerEmailResponse = await resend.emails.send({
      from: fromEmail,
      to: ownerEmail,
      replyTo: payload.email,
      subject: `New contact submission: ${safeName}${safeProject ? ` - ${safeProject}` : ''}`,
      html: `
        <h2>New message from portfolio</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Project:</strong> ${safeProject}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
      `,
    });

    const senderEmailResponse = await resend.emails.send({
      from: fromEmail,
      to: payload.email,
      subject: 'Message received - Blas Portfolio',
      html: `
        <p>Hi ${safeName},</p>
        <p>Thanks for reaching out. I received your message about: <strong>${safeProject}</strong>.</p>
        <p>I will get back to you soon via this same email thread.</p>
        <br />
        <p>- Blas</p>
      `,
    });

    createdDoc.status = 'emailed';
    createdDoc.ownerEmailId = ownerEmailResponse.data?.id ?? null;
    createdDoc.senderEmailId = senderEmailResponse.data?.id ?? null;
    await createdDoc.save();

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    if (createdDoc) {
      try {
        createdDoc.status = 'failed';
        createdDoc.errorMessage = message;
        await createdDoc.save();
      } catch {
        // Ignore secondary persistence errors from error handling branch.
      }
    }

    return NextResponse.json(
      {
        ok: false,
        error: 'Failed to process contact request',
        detail: message,
      },
      { status: 500 }
    );
  }
}
