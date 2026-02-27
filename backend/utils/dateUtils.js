export function timeGap(start, amount, type) {
  // date is accepted as yyyy-mm-dd String type
  // Type can be either "day", "week", "month", "year"
  const out = [];

  const date = new Date(new Date(start).toUTCString());
  const addType = { day: "Date", week: "Date", month: "Month", year: "FullYear" }[type];

  for (let i = 0; i < 30; i++) {
    const newDate = new Date(date);
    const extra = type === "week" ? amount * 7 : amount;
    // Dinamically calls: newDate.setDate(...), setMonth, setFullYear, with getDate, ...
    newDate[`set${addType}`](newDate[`get${addType}`]() + extra * i);
    out.push(newDate);
  }
  return out;
}

function format(d) {
  const pad = x => String(x).padStart(2, "0");
  return `${pad(d.getFullYear())}/${pad(d.getMonth() + 1)}/${d.getDate()}`;
}

