import { useEffect, useState } from "react";

function App() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/hello")
      .then(res => res.json())
      .then(data => setMsg(data.msg));
  }, []);

  return (
    <div>
      <h1>Haloi {msg}</h1>
    </div>
  );
}

export default App;
