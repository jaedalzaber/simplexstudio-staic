import { CalendarIcon, ClockIcon } from "@/components/ui/icons";
import { classes } from "@/lib/classes";
import { formatDate } from "@/lib/format";
import styles from "./blog.module.css";

export function PostMeta({ date, readMinutes, className }: { date: string; readMinutes: number; className?: string }) {
  return (
    <ul className={classes(styles.meta, className)}>
      <li><CalendarIcon /><time dateTime={date}>{formatDate(date)}</time></li>
      <li><ClockIcon />{readMinutes} min read</li>
    </ul>
  );
}
