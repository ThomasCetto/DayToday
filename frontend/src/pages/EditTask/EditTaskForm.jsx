import { useState } from "react";
import { apiFetch } from "../../utils/wrappers";
import './EditTaskForm.css';

function EditTaskForm({id, title, description, date, gapType, gapAmount, parentOnSubmit }) {
  const [selectedGapType, setSelectedGapType] = useState(gapType);

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent reload
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());
    try {
      const response = await apiFetch("/api/tasks/" + id, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
      });
      if (response.ok) {
        parentOnSubmit(payload.title, payload.description, payload.date, payload.gapType, payload.gapAmount);
      }
    } catch (error) {
      console.error("Error while submitting task edits: ", error);
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
      <form method='PUT' onSubmit={handleSubmit} className="edit-task-form">
        <label htmlFor='title'> Task title:</label><br/>
        <input name='title' id='title' defaultValue={title}/><br/>

        <label htmlFor='description'> Task description:</label><br/>
        <textarea type="textarea" name='description' id='description' defaultValue={description}/><br/>

        <label htmlFor='date'> Task date:</label><br/>
        {createSkipDayButton(-1, "<")}
        <input name='date' id='date' type='date' defaultValue={date.toISOString().slice(0, 10)}/>
        {createSkipDayButton(1, ">")}<br/>

        <label htmlFor='gapType'> Repeat:</label><br/>
        <select 
          name='gapType' 
          id='gapType' 
          defaultValue={gapType} 
          onChange={(e) => setSelectedGapType(e.target.value)}
        >
          <option value='none'>Don't repeat</option>
          <option value='day'>Every X days</option>
          <option value='week'>Every X weeks</option>
          <option value='month'>Every X months</option>
          <option value='year'>Every X years</option>
        </select><br/>

        {selectedGapType !== "none" && (
          <>
            <label htmlFor='gapAmount'>Choose X:</label><br/>
            <input name='gapAmount' id='gapAmount' defaultValue={gapAmount} /><br/>
          </>
        )}
        
        <button type='submit'>Confirm edit</button> &nbsp;
        <button type="button" onClick={(e) => e.target.form.reset()}> Reset </button>
      </form>
  </>
  )
}

export default EditTaskForm;