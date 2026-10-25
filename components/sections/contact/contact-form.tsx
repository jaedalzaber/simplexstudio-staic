"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef, useState, type FormEvent } from "react";
import { PillButton } from "@/components/ui/pill-link";
import { submitContact } from "@/lib/contact/client";
import styles from "./contact.module.css";

type Field = "name" | "email" | "message";
type Errors = Partial<Record<Field, string>>;

const ease = [0.16, 1, 0.3, 1] as const;

function validate(values: Record<Field, string>): Errors {
  const errors: Errors = {};
  if (values.name.trim().length < 2) errors.name = "Enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = "Enter a valid email address.";
  if (values.message.trim().length < 10) errors.message = "Use at least 10 characters.";
  return errors;
}

export function ContactForm({ messageLimit }: { messageLimit: number }) {
  const [values, setValues] = useState<Record<Field, string>>({ name: "", email: "", message: "" });
  const [nda, setNda] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [formError, setFormError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  function update(field: Field, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    setFormError("");
    const first = (Object.keys(found) as Field[])[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus("sending");
    const website = new FormData(event.currentTarget).get("website");
    const result = await submitContact({ ...values, nda, website: typeof website === "string" ? website : "" });
    if (result.ok) {
      setStatus("sent");
      return;
    }
    setStatus("idle");
    setFormError(result.error);
    if (result.fieldErrors) {
      setErrors({
        name: result.fieldErrors.name?.[0],
        email: result.fieldErrors.email?.[0],
        message: result.fieldErrors.message?.[0],
      });
    }
  }

  function reset() {
    setValues({ name: "", email: "", message: "" });
    setNda(false);
    setStatus("idle");
  }

  const describe = (field: Field) => (errors[field] ? `contact-${field}-error` : undefined);

  return (
    <div className={styles.formArea}>
      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" ? (
          <motion.div
            key="sent"
            className={styles.sent}
            role="status"
            initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.7, ease }}
          >
            <span className={styles.sentIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24" width={28} height={28} fill="none"><path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            <h2>Thank you, {values.name.trim().split(" ")[0]}!</h2>
            <p>Your message is on its way. We’ll get back to you at {values.email.trim()} soon.</p>
            <button type="button" className={styles.textButton} onClick={reset}>Send another message</button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            className={styles.form}
            noValidate
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease }}
            aria-describedby={formError ? "contact-form-error" : undefined}
          >
            <div className={styles.row}>
              <div className={styles.field} data-invalid={Boolean(errors.name)}>
                <label htmlFor="contact-name">Your name<span aria-hidden="true">*</span></label>
                <input id="contact-name" name="name" autoComplete="name" required maxLength={100} placeholder="Enter your name" value={values.name} onChange={(event) => update("name", event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={describe("name")} />
                <span className={styles.underline} aria-hidden="true" />
                {errors.name && <p id="contact-name-error" className={styles.error}>{errors.name}</p>}
              </div>
              <div className={styles.field} data-invalid={Boolean(errors.email)}>
                <label htmlFor="contact-email">Your email<span aria-hidden="true">*</span></label>
                <input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="Enter your email" value={values.email} onChange={(event) => update("email", event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={describe("email")} />
                <span className={styles.underline} aria-hidden="true" />
                {errors.email && <p id="contact-email-error" className={styles.error}>{errors.email}</p>}
              </div>
            </div>

            <div className={styles.field} data-invalid={Boolean(errors.message)}>
              <label htmlFor="contact-message">Message</label>
              <textarea id="contact-message" name="message" required rows={2} maxLength={messageLimit} placeholder="Tell us more about your project" value={values.message} onChange={(event) => update("message", event.target.value)} aria-invalid={Boolean(errors.message)} aria-describedby={["contact-message-count", describe("message")].filter(Boolean).join(" ")} />
              <span id="contact-message-count" className={styles.counter}>{values.message.length}/{messageLimit}</span>
              <span className={styles.underline} aria-hidden="true" />
              {errors.message && <p id="contact-message-error" className={styles.error}>{errors.message}</p>}
            </div>

            {/* Honeypot: hidden from people and assistive technology. */}
            <div className={styles.honeypot} aria-hidden="true">
              <label htmlFor="contact-website">Website</label>
              <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" />
            </div>

            {formError && <p id="contact-form-error" className={styles.formError} role="alert">{formError}</p>}

            <div className={styles.actions}>
              <label className={styles.switch}>
                <input type="checkbox" role="switch" checked={nda} onChange={(event) => setNda(event.target.checked)} />
                <span className={styles.track} aria-hidden="true"><span /></span>
                Send me an NDA
              </label>
              <PillButton type="submit" size="sm" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Send a message"}
              </PillButton>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
