import type { ReactNode } from "react";
import styles from "./app-window.module.css";

export { styles as windowStyles };

/** A sample application window: title bar, optional navigation and action. Read as one image. */
export function AppWindow({ label, title, nav, action, children, className }: {
  /** Describes the whole screen for assistive technology. */
  label: string;
  title: string;
  nav?: { items: readonly string[]; active: string };
  action?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`${styles.window} ${className ?? ""}`} role="img" aria-label={label}>
      <div className={styles.windowBar}>
        <span className={styles.dots}><i /><i /><i /></span>
        <strong>{title}</strong>
        {nav && (
          <span className={styles.windowNav}>
            {nav.items.map((item) => <span key={item} data-active={item === nav.active || undefined}>{item}</span>)}
          </span>
        )}
        {action && <span className={styles.windowAction}>{action}</span>}
      </div>
      {children}
    </div>
  );
}
