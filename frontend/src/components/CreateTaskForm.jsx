import { apiFetch } from "../utils/wrappers";

function CreateTaskForm() {
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent reload
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());
    const response = await apiFetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
    console.log(response)
  };

  return (
    <>
      <h1>Add task</h1>
      <form method='POST' onSubmit={handleSubmit}>
        <label htmlFor='title'> Task title:</label><br/>
        <input name='title' id='title' placeholder='Insert the title of the task'/><br/>
        <label htmlFor='description'> Task description:</label><br/>
        <input name='description' id='description' placeholder='Insert the description of the task'/><br/>
        <label htmlFor='date'> Task date:</label><br/>
        
        {/* Date picker with buttons */}
        <button type='button' onClick={() => {
            let datePicker = document.getElementById("date");
            let oldDate = datePicker.value;
            let newDate = new Date(oldDate);
            newDate.setHours(12);  // Prevents daylight savings problems
            newDate.setDate(newDate.getDate() - 1);
            datePicker.value = newDate.toISOString().slice(0, 10);
          } 
        }> &lt; </button>
        <input name='date' id='date' type='date' defaultValue={new Date().toISOString().slice(0, 10)}/>
        <button type='button' onClick={() => {
            let datePicker = document.getElementById("date");
            let oldDate = datePicker.value;
            let newDate = new Date(oldDate);
            newDate.setHours(12);  // Prevents daylight savings problems
            newDate.setDate(newDate.getDate() + 1);
            datePicker.value = newDate.toISOString().slice(0, 10);
          } 
        }> &gt; </button>
        <br/>
        {/* End date picker */}

        <label htmlFor='gapType'> Repeat:</label><br/>
        <select name='gapType' id='gapType'>
          <option value='none'>Don't repeat</option>
          <option value='day'>Every X days</option>
          <option value='week'>Every X weeks</option>
          <option value='month'>Every X months</option>
          <option value='year'>Every X years</option>
        </select><br/>
        <label htmlFor='gapAmount'>Choose X:</label><br/>
        <input name='gapAmount' id='gapAmount' placeholder='Choose a value for X'/><br/><br/>
        <button type='submit'>Add task</button>
      </form>
  </>
  )
}

export default CreateTaskForm;