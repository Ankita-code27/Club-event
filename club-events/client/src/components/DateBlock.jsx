import "./DateBlock.css";

/** Compact ticket-style date block: month abbreviation over day number. */
export default function DateBlock({ date, size = "md" }) {
  const d = date instanceof Date ? date : new Date(date);
  const valid = !Number.isNaN(d.getTime());
  const month = valid ? d.toLocaleDateString("en-US", { month: "short" }) : "—";
  const day = valid ? d.getDate() : "--";

  return (
    <div className={`date-block date-block--${size}`}>
      <span className="date-block__month">{month}</span>
      <span className="date-block__day">{day}</span>
    </div>
  );
}
