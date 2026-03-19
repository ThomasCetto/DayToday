import { useState, useEffect } from "react";
import { apiFetch } from "../../utils/wrappers";
import EditTaskRow from "./EditTaskRow";
import "./EditTaskPage.css";

function EditTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
	// Fetch tasks
	const fetchTasks = async () => {
	  try {
		const endpoint = "api/tasks";
		const response = await apiFetch(endpoint, { method: "GET" });

		if (response.status == 401 || response.status == 403)
		  throw new Error("You must be logged in to use this page");
		if (!response.ok) throw new Error("Couldnt fetch tasks");
		const data = await response.json();
		setTasks(data.tasks);
	  } catch (err) {
		setError(err.message);
	  } finally {
		setLoading(false);
	  }
	};
	fetchTasks();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const repetitiveTasks = tasks.filter((task => task.task.gapType != "none"));
  const oneTimeTasks = tasks.filter((task => task.task.gapType == "none"));
  

  return (
	<>
		<h1>Tasks edit page</h1>

		<div className="tasks-page">
			{/* LEFT */}
			<div className="tasks-column">
				<h2>Repetitive</h2>
				<ul>
					{repetitiveTasks.map((task) => (
						<EditTaskRow
							key={task.task._id}
							id={task.task._id}
							titleProp={task.task.title}
							descriptionProp={task.task.description}
							dateProp={task.task.date}
							gapTypeProp={task.task.gapType}
							gapAmountProp={task.task.gapAmount}
							completedCount={task.completed}
							totalCount={task.total}
						/>
					))}
				</ul>
			</div>

			{/* RIGHT */}
			<div className="tasks-column">
				<h2>One-time</h2>
				<ul>
					{oneTimeTasks.map((task) => (
						<EditTaskRow
							key={task.task._id}
							id={task.task._id}
							titleProp={task.task.title}
							descriptionProp={task.task.description}
							dateProp={task.task.date}
							gapTypeProp={task.task.gapType}
							gapAmountProp={task.task.gapAmount}
							completedCount={task.completed}
							totalCount={task.total}
						/>
					))}
				</ul>
			</div>
		</div>
	</>
);
}

export default EditTasksPage;
