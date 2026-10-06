"use client";

import { useState } from "react";
import NextLink from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
} from "lucide-react";

import { Container } from "@/src/components/UI/Container";
import { SectionHeading } from "@/src/components/UI/Section";

type Topic = "Order help" | "Delivery & slots" | "Returns" | "Partnership" | "Feedback" | "Other";

const TOPICS: Topic[] = [
  "Order help",
  "Delivery & slots",
  "Returns",
  "Partnership",
  "Feedback",
  "Other",
];

const channels = [
  {
    icon: Phone,
    title: "Call support",
    lines: ["+880 1700 000000"],
    detail: "9am–9pm, every day",
    href: "tel:+8801700000000",
  },
  {
    icon: Mail,
    title: "Email us",
    lines: ["support@xmart.com", "partnerships@xmart.com"],
    detail: "Replies within one business day",
    href: "mailto:support@xmart.com",
  },
  {
    icon: MapPin,
    title: "Head office",
    lines: ["House 42, Road 11, Banani", "Dhaka 1213, Bangladesh"],
    detail: "Visits by appointment",
  },
  {
    icon: Clock,
    title: "Fulfilment hours",
    lines: ["Picking 6am–11pm", "Dispatch next-day after 4pm"],
    detail: "Same-day inside Dhaka",
  },
];

type Errors = Partial<Record<"name" | "email" | "message", string>>;

/**
 * Contact page.
 *
 * The form is a genuine progressive-enhancement pattern: it validates on the
 * client, but because there is no contact endpoint wired up yet it falls back
 * to a `mailto:` compose with the message pre-filled rather than silently
 * pretending to have sent something. That keeps the page honest — the earlier
 * version of this route was a "coming soon" stub.
 */
export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [values, setValues] = useState({ name: "", email: "", topic: TOPICS[0], message: "" });

  function update(field: keyof typeof values, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate() {
    const next: Errors = {};
    if (!values.name.trim()) next.name = "Please tell us your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()))
      next.email = "Enter a valid email address.";
    if (values.message.trim().length < 10)
      next.message = "Please add a little more detail (10+ characters).";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    const subject = `[${values.topic}] ${values.name}`;
    const body = `${values.message}\n\n—\n${values.name}\n${values.email}`;
    window.location.href = `mailto:support@xmart.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    setSent(true);
  }

  const fieldBase =
    "w-full rounded-md border bg-surface-sunken px-3.5 py-2.5 text-body-sm text-content placeholder:text-content-subtle transition-colors duration-fast ease-standard focus:outline-none";

  return (
    <>
      {/* ---- Intro ---- */}
      <Container className="pt-12 sm:pt-16">
        <div className="max-w-2xl">
          <p className="mb-3 flex items-center gap-2 text-overline font-semibold uppercase tracking-[0.14em] text-brand">
            <span aria-hidden className="h-px w-6 bg-brand/50" />
            Support
          </p>
          <h1 className="text-display-md font-bold text-content">Get in touch</h1>
          <p className="mt-4 text-body-lg text-content-muted">
            Questions about an order, a delivery window or a partnership? Pick
            whichever route suits you — a person reads every message.
          </p>
        </div>
      </Container>

      {/* ---- Channels ---- */}
      <Container className="mt-10">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map((channel) => {
            const Icon = channel.icon;
            const body = (
              <>
                <span className="grid size-10 shrink-0 place-items-center rounded-sm bg-brand-subtle text-brand">
                  <Icon aria-hidden size={18} />
                </span>
                <span className="mt-4 block text-body-sm font-semibold text-content">
                  {channel.title}
                </span>
                <span className="mt-1 block text-body-sm text-content-muted">
                  {channel.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
                <span className="mt-2 block text-label-sm text-content-subtle">
                  {channel.detail}
                </span>
              </>
            );

            return (
              <li key={channel.title}>
                {channel.href ? (
                  <a
                    className="flex h-full flex-col rounded-lg border border-line-hairline bg-surface-raised p-5 shadow-xs transition-all duration-base ease-standard hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md"
                    href={channel.href}
                  >
                    {body}
                  </a>
                ) : (
                  <div className="flex h-full flex-col rounded-lg border border-line-hairline bg-surface-raised p-5 shadow-xs">
                    {body}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </Container>

      {/* ---- Form + assurance ---- */}
      <Container className="py-14 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <SectionHeading
              description="Fill this in and we will reply to the address you give. No account needed."
              eyebrow="Send a message"
              title="How can we help?"
            />

            {sent ? (
              <div
                className="mt-8 flex flex-col items-start gap-4 rounded-lg border border-brand/30 bg-brand-subtle p-6"
                role="status"
              >
                <span className="grid size-11 place-items-center rounded-full bg-brand text-brand-contrast">
                  <CheckCircle2 aria-hidden size={22} />
                </span>
                <div>
                  <p className="text-title-md font-semibold text-content">
                    Your email client should be open
                  </p>
                  <p className="mt-1.5 max-w-prose text-body-sm text-content-muted">
                    If nothing happened, email us directly at{" "}
                    <a
                      className="font-medium text-brand underline underline-offset-2"
                      href="mailto:support@xmart.com"
                    >
                      support@xmart.com
                    </a>
                    .
                  </p>
                </div>
                <button
                  className="text-label-sm font-semibold text-brand underline underline-offset-2"
                  type="button"
                  onClick={() => setSent(false)}
                >
                  Write another message
                </button>
              </div>
            ) : (
              <form className="mt-8 flex flex-col gap-5" noValidate onSubmit={handleSubmit}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-label-sm font-medium text-content" htmlFor="contact-name">
                      Your name
                    </label>
                    <input
                      aria-describedby={errors.name ? "contact-name-error" : undefined}
                      aria-invalid={Boolean(errors.name)}
                      className={`${fieldBase} ${errors.name ? "border-danger" : "border-line-hairline"}`}
                      id="contact-name"
                      name="name"
                      placeholder="Jane Doe"
                      value={values.name}
                      onChange={(e) => update("name", e.target.value)}
                    />
                    {errors.name && (
                      <p className="mt-1.5 text-label-sm text-danger" id="contact-name-error">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-label-sm font-medium text-content" htmlFor="contact-email">
                      Email
                    </label>
                    <input
                      aria-describedby={errors.email ? "contact-email-error" : undefined}
                      aria-invalid={Boolean(errors.email)}
                      className={`${fieldBase} ${errors.email ? "border-danger" : "border-line-hairline"}`}
                      id="contact-email"
                      name="email"
                      placeholder="jane@example.com"
                      type="email"
                      value={values.email}
                      onChange={(e) => update("email", e.target.value)}
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-label-sm text-danger" id="contact-email-error">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <fieldset>
                  <legend className="mb-2 text-label-sm font-medium text-content">
                    What is this about?
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {TOPICS.map((topic) => {
                      const selected = values.topic === topic;
                      return (
                        <button
                          key={topic}
                          aria-pressed={selected}
                          className={[
                            "rounded-full border px-3.5 py-1.5 text-label-sm font-medium",
                            "transition-colors duration-fast ease-standard",
                            selected
                              ? "border-brand bg-brand text-brand-contrast"
                              : "border-line-hairline bg-surface-sunken text-content-muted hover:border-brand/40 hover:text-content",
                          ].join(" ")}
                          type="button"
                          onClick={() => update("topic", topic)}
                        >
                          {topic}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <div>
                  <label className="mb-1.5 block text-label-sm font-medium text-content" htmlFor="contact-message">
                    Message
                  </label>
                  <textarea
                    aria-describedby={errors.message ? "contact-message-error" : undefined}
                    aria-invalid={Boolean(errors.message)}
                    className={`${fieldBase} min-h-36 resize-y ${errors.message ? "border-danger" : "border-line-hairline"}`}
                    id="contact-message"
                    name="message"
                    placeholder="Include your order number if it is about a delivery."
                    value={values.message}
                    onChange={(e) => update("message", e.target.value)}
                  />
                  {errors.message && (
                    <p className="mt-1.5 text-label-sm text-danger" id="contact-message-error">
                      {errors.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <button
                    className="inline-flex h-12 items-center gap-2 rounded-md bg-brand px-6 text-body-sm font-semibold text-brand-contrast shadow-brand transition-colors duration-fast ease-standard hover:bg-brand-hover"
                    type="submit"
                  >
                    <Send aria-hidden size={16} />
                    Send message
                  </button>
                  <p className="text-label-sm text-content-subtle">
                    We reply within one business day.
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* ---- Reassurance rail ---- */}
          <aside className="lg:col-span-5">
            <div className="rounded-lg border border-line-hairline bg-surface-raised p-6 shadow-xs lg:sticky lg:top-32">
              <h2 className="flex items-center gap-2 text-title-md font-semibold text-content">
                <MessageSquare aria-hidden className="text-brand" size={18} />
                Faster than a form
              </h2>
              <p className="mt-2 text-body-sm text-content-muted">
                Most questions are already answered in the help centre — it is
                usually the quickest route.
              </p>
              <NextLink
                className="group mt-4 inline-flex items-center gap-1.5 text-body-sm font-semibold text-brand"
                href="/help"
              >
                Visit the help centre
                <ArrowRight
                  aria-hidden
                  className="size-4 transition-transform duration-fast group-hover:translate-x-0.5"
                />
              </NextLink>

              <hr className="my-6 border-line-hairline" />

              <h2 className="flex items-center gap-2 text-title-md font-semibold text-content">
                <Building2 aria-hidden className="text-brand" size={18} />
                For businesses
              </h2>
              <p className="mt-2 text-body-sm text-content-muted">
                Supplier onboarding, wholesale pricing and corporate gifting run
                through a dedicated desk.
              </p>
              <a
                className="group mt-4 inline-flex items-center gap-1.5 text-body-sm font-semibold text-brand"
                href="mailto:partnerships@xmart.com"
              >
                partnerships@xmart.com
                <ArrowRight
                  aria-hidden
                  className="size-4 transition-transform duration-fast group-hover:translate-x-0.5"
                />
              </a>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}