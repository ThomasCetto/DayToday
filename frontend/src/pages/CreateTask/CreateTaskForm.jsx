import { useState } from "react";
import { apiFetch } from "../../utils/wrappers";
import "./CreateTaskForm.css";

function CreateTaskForm() {
  const [selectedGapType, setSelectedGapType] = useState('none');
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent reload
    try {
      const formData = new FormData(e.target);
      const payload = Object.fromEntries(formData.entries());
      await apiFetch("/api/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
      });
      setSuccessMessage("Task created successfully!");
      e.target.reset(); // clear fields 
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const createSkipDayButton = (offset, text) => { 
    return (
      <button type='button' 
        onClick={() => {
          let datePicker = document.getElementById("date");
          let oldDate = datePicker.value;
          let newDate = new Date(oldDate);
          newDate.setHours(12);  // Prevents daylight savings problems
          newDate.setDate(newDate.getDate() + offset);
          datePicker.value = newDate.toISOString().slice(0, 10);
        }}
      > 
        {text}
      </button>
    )  
  };

  return (
    <>
      <h1>Add task</h1>
      <form className="create-task-form" method='POST' onSubmit={handleSubmit}>
        <label htmlFor='title'> Task title:</label>
        <input name='title' id='title' required/>

        <label htmlFor='description'> Task description:</label>
        <textarea name='description' id='description' className='large-text-field'/>

        <label htmlFor='date'> Task date:</label>
        <div className="date-row">
          {createSkipDayButton(-1, "<")}
          <input
            name="date"
            id="date"
            type="date"
            defaultValue={new Date().toISOString().slice(0, 10)}
            required
          />
          {createSkipDayButton(1, ">")}
        </div>
        

        <label htmlFor='gapType'> Repeat:</label>
        <select 
          name='gapType' 
          id='gapType'
          onChange={(e) => setSelectedGapType(e.target.value)}
        >
          <option value='none'>Don't repeat</option>
          <option value='day'>Every X days</option>
          <option value='week'>Every X weeks</option>
          <option value='month'>Every X months</option>
          <option value='year'>Every X years</option>
        </select>

        {selectedGapType !== "none" && (
          <>
            <label htmlFor='gapAmount'>Choose X:</label>
            <input name='gapAmount' id='gapAmount' />
          </>
        )}

        

        <button type="submit" className={"create-task-form-submit " + (successMessage ? "successful" : "")}>
          {(successMessage ? "Created!" : "Create")}
        </button>
          
      
      
      </form>
  </>
  )
}

export default CreateTaskForm;