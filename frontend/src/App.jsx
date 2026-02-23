import './App.css'

function App() {
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent reload
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());
    const response = await fetch("/api/tasks/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Success:", response.ok);
    console.log("Response body:", data);
  };




  return (
    <>
      <h1>Add task</h1>
      <form method='POST' onSubmit={handleSubmit}>
        <input name='title' placeholder='Task title'/><br/>
        <input name='description' placeholder='Task description'/><br/>
        <input name='date' placeholder='date' type='date'/><br/>
        <label>
          <input type='checkbox' value="Yes" />
          Repeat task
        </label><br/>
        
        <select name='gapType'>
          <option value='day' selected>Day</option>
          <option value='week'>Week</option>
          <option value='month'>Month</option>
          <option value='year'>Year</option>
        </select><br/>
        <input name='gapAmount' placeholder='Every how much'/><br/>
        <button type='submit'>Add task</button>


        {/* <input type='submit'>Add task</input> */}
      </form>
  </>
  )
}

export default App
