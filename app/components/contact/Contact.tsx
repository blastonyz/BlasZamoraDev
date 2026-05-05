'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { orbitron, colors } from '../../lib/theme';

const CONTACT_LINKS = [
  { icon: '@', label: 'EMAIL', value: 'hello@blasz.dev', href: 'mailto:hello@blasz.dev' },
  { icon: '</>', label: 'GITHUB', value: 'github.com/blasz', href: 'https://github.com/blaszkj', target: '_blank' },
  { icon: 'in', label: 'LINKEDIN', value: 'linkedin.com/in/blasz', href: 'https://linkedin.com/in/blasz', target: '_blank' },
  { icon: '𝕏', label: 'TWITTER / X', value: '@blaszdev', href: '#' },
];

const FORM_FIELDS: { label: string; name: string; type?: string; placeholder: string; isTextarea?: boolean }[] = [
  { label: '// YOUR_NAME', name: 'name', type: 'text', placeholder: 'John Doe' },
  { label: '// EMAIL_ADDRESS', name: 'email', type: 'email', placeholder: 'john@domain.com' },
  { label: '// PROJECT_TYPE', name: 'project', type: 'text', placeholder: 'Web3 DApp / Frontend / Full Stack' },
  { label: '// MESSAGE', name: 'message', placeholder: 'Tell me about your project...', isTextarea: true },
];

const border = 'rgba(0,255,178,0.12)';
const borderBright = 'rgba(0,255,178,0.35)';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    project: '',
    message: '',
  });
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleFieldChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSending(true);
    setStatus('idle');
    setStatusMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Could not send your message');
      }

      setStatus('success');
      setStatusMessage('Message sent successfully. I will get back to you soon.');
      setFormData({ name: '', email: '', project: '', message: '' });
    } catch (error) {
      setStatus('error');
      setStatusMessage(
        error instanceof Error
          ? error.message
          : 'Unexpected error while sending the form'
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* ═══ CONTACT ═══════════════════════════════════════ */}
      <section
        id="contact"
        className="relative w-full px-8 py-20 md:px-20 md:py-[120px]"
        style={{ background: 'linear-gradient(180deg, #030D0A 0%, #071410 100%)' }}
      >
        {/* Section header */}
        <div className="mb-16 text-center">
          <span className="mb-3 block font-mono text-[11px] tracking-[0.35em]" style={{ color: colors.green }}>
            // 05 · ESTABLISH_CONNECTION
          </span>
          <h2 className={`text-3xl font-bold md:text-[clamp(28px,4vw,44px)] text-[#C8F0E8] ${orbitron.className}`}>
            Get in <span style={{ color: colors.green }}>Touch</span>
          </h2>
          <div
            className="mx-auto mt-5 h-[2px] w-20"
            style={{ background: `linear-gradient(90deg, transparent, ${colors.green}, transparent)` }}
          />
        </div>

        {/* Grid */}
        <div className="mx-auto grid max-w-[1000px] grid-cols-1 gap-12 md:grid-cols-2 md:gap-20">
          {/* Left — info */}
          <div>
            <div className={`mb-4 text-2xl font-bold text-[#C8F0E8] ${orbitron.className}`}>
              Let&apos;s build<br />
              <span style={{ color: colors.green }}>something great</span>
            </div>
            <p className="mb-10 text-[15px] leading-[1.7] text-[#5A8A7A]">
              Available for freelance projects, consulting and full-time positions. Let&apos;s discuss how I can help you build high-impact digital experiences.
            </p>

            <div className="flex flex-col gap-5">
              {CONTACT_LINKS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  {...(item.target ? { target: item.target, rel: 'noopener noreferrer' } : {})}
                  className="flex items-center gap-4 border p-4 text-[#C8F0E8] no-underline transition-colors"
                  style={{
                    borderColor: border,
                    background: '#0A1F19',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = borderBright)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = border)}
                >
                  <div
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center border font-mono text-sm"
                    style={{ borderColor: borderBright, color: colors.green }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <span className="mb-1 block font-mono text-[9px] tracking-[0.3em] text-[#2A4A40]">
                      {item.label}
                    </span>
                    <div className="text-sm text-[#C8F0E8]">{item.value}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit}
          >
            {FORM_FIELDS.map((field) => (
              <div key={field.name} className="flex flex-col gap-2">
                <label className="font-mono text-[9px] tracking-[0.3em]" style={{ color: colors.green }}>
                  {field.label}
                </label>
                {field.isTextarea ? (
                  <textarea
                    name={field.name}
                    placeholder={field.placeholder}
                    rows={5}
                    value={formData[field.name as keyof typeof formData]}
                    onChange={handleFieldChange}
                    className="resize-none border bg-[#0A1F19] px-[18px] py-[14px] text-[15px] text-[#C8F0E8] outline-none transition-colors placeholder:text-[#2A4A40]"
                    style={{ borderColor: border }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = borderBright)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = border)}
                  />
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name as keyof typeof formData]}
                    onChange={handleFieldChange}
                    className="border bg-[#0A1F19] px-[18px] py-[14px] text-[15px] text-[#C8F0E8] outline-none transition-colors placeholder:text-[#2A4A40]"
                    style={{ borderColor: border }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = borderBright)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = border)}
                  />
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={isSending}
              className={`w-full border-none py-4 text-[11px] font-bold tracking-[0.3em] text-[#030D0A] transition-all hover:-translate-y-0.5 hover:bg-white ${orbitron.className}`}
              style={{
                background: colors.green,
                clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
                opacity: isSending ? 0.7 : 1,
                cursor: isSending ? 'wait' : 'pointer',
              }}
            >
              {isSending ? 'SENDING...' : 'INITIATE TRANSMISSION →'}
            </button>

            {status !== 'idle' && (
              <p
                className="text-sm"
                style={{ color: status === 'success' ? colors.green : '#FF8A8A' }}
              >
                {statusMessage}
              </p>
            )}
          </form>
        </div>
      </section>

      {/* ═══ FOOTER ═══════════════════════════════════════ */}
      <footer
        className="relative z-10 flex flex-col items-center justify-between gap-4 border-t px-8 py-8 text-center md:flex-row md:px-20 md:py-[32px]"
        style={{ borderColor: border }}
      >
        <div className="font-mono text-[10px] tracking-[0.2em] text-[#2A4A40]">
          © 2026 BLASZ.DEV · ALL SYSTEMS OPERATIONAL
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-[#5A8A7A]">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              background: colors.green,
              boxShadow: `0 0 6px ${colors.green}`,
              animation: 'pulse 2s ease-in-out infinite',
            }}
          />
          AVAILABLE FOR HIRE
        </div>
      </footer>
    </>
  );
}
