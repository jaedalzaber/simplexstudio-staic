import type { ComponentProps, ReactNode } from "react";
import { classes } from "@/lib/classes";

type FieldProps = { id: string; label: string; description?: string; error?: string };

function Field({ id, label, description, error, children }: FieldProps & { children: ReactNode }) {
  return (
    <div className="field">
      <label htmlFor={id} className="field-label">{label}</label>
      {children}
      {description && <p id={`${id}-description`} className="field-description">{description}</p>}
      {error && <p id={`${id}-error`} className="field-error" role="alert">{error}</p>}
    </div>
  );
}

function describedBy(id: string, description?: string, error?: string, extra?: string) {
  return [description && `${id}-description`, error && `${id}-error`, extra].filter(Boolean).join(" ") || undefined;
}

export function TextField({ id, label, description, error, className, "aria-describedby": extra, ...props }: ComponentProps<"input"> & FieldProps) {
  return (
    <Field id={id} label={label} description={description} error={error}>
      <input {...props} id={id} className={classes("field-control", className)} aria-invalid={error ? true : props["aria-invalid"]} aria-describedby={describedBy(id, description, error, extra)} />
    </Field>
  );
}

export function TextAreaField({ id, label, description, error, className, "aria-describedby": extra, ...props }: ComponentProps<"textarea"> & FieldProps) {
  return (
    <Field id={id} label={label} description={description} error={error}>
      <textarea {...props} id={id} className={classes("field-control", className)} aria-invalid={error ? true : props["aria-invalid"]} aria-describedby={describedBy(id, description, error, extra)} />
    </Field>
  );
}
