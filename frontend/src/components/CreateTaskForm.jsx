

function CreateTaskForm() {
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent reload
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());
    await fetch("/api/tasks/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
  };

  return (
    <>
      <h1>Add task</h1>
      <form method='POST' onSubmit={handleSubmit}>
        <label htmlFor='title'> Task title:</label><br/>
        <input name='title' placeholder='Insert the title of the task'/><br/>
        <label htmlFor='description'> Task description:</label><br/>
        <input name='description' placeholder='Insert the description of the task'/><br/>
        <label htmlFor='date'> Task date:</label><br/>
        <input name='date' type='date'/><br/>
        <label htmlFor='gapType'> Repeat:</label><br/>
        <select name='gapType'>
          <option value='none'>Don't repeat</option>
          <option value='day'>Every X days</option>
          <option value='week'>Every X weeks</option>
          <option value='month'>Every X months</option>
          <option value='year'>Every X years</option>
        </select><br/>
        <label htmlFor='gapAmount'>Choose X:</label><br/>
        <input name='gapAmount' placeholder='Choose a value for X'/><br/><br/>
        <button type='submit'>Add task</button>
      </form>
  </>
  )
}

export default CreateTaskForm;