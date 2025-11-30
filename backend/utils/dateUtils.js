export function timeGap(start, amount, type) {
    // Type can be either day, week, month, year 
  const out = [];
  const date = new Date(start);
  const addType = { day: "Date", week: "Date", month: "Month", year: "FullYear" }[type];

  for (let i = 0; i < 30; i++) {
    const newDate = new Date(date);
    const extra = type === "week" ? amount * 7 : amount;
    // Dinamically calls: setDate, setMonth, setFullYear and get
    newDate[`set${addType}`](newDate[`get${addType}`]() + extra * i);
    out.push(format(newDate));
  }
  return out;
}

function format(d) {
  const pad = x => String(x).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

