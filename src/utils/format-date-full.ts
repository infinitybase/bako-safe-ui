interface FormatDateOptions {
  timeZone?: string;
}

function formatCreatedDate({
   date,
   options,
}: {
  date: string | Date;
  options?: FormatDateOptions;
}) {
  const d = typeof date === 'string' ? new Date(date) : date;

  function addOrdinal(day: number) {
    if (day > 3 && day < 21) return day + 'th';
    switch (day % 10) {
      case 1: return day + 'st';
      case 2: return day + 'nd';
      case 3: return day + 'rd';
      default: return day + 'th';
    }
  }

  const tz = options?.timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;

  const day = d.toLocaleString('en-US', { day: 'numeric', timeZone: tz });
  const dayWithOrdinal = addOrdinal(Number(day));
  const month = d.toLocaleString('en-US', { month: 'short', timeZone: tz });
  const weekday = d.toLocaleString('en-US', { weekday: 'short', timeZone: tz });
  const hourMinute = d.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: tz });

  return `${weekday}, ${dayWithOrdinal} ${month}, ${hourMinute}`;
}

export { formatCreatedDate };