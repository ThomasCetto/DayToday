import { useState, useEffect } from "react";
import { apiFetch } from "../utils/wrappers";
import EditTaskRow from "../components/EditTaskRow";


function EditTasksPage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch tasks 
        const fetchTasks = async () => {
            try {
                const endpoint = 'api/tasks';
                const response = await apiFetch(endpoint, {method: "GET"});
                
                if(response.status == 401 || response.status == 403) throw new Error("You must be logged in to use this page");
                if(!response.ok) throw new Error("Couldnt fetch tasks");
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

    if(loading) return <p>Loading...</p>;
    if(error) return <p>Error: {error}</p>;

    return (
        <>
            <h1>Tasks edit page</h1>

            <ul>
                {tasks.map((task) => (
                    <EditTaskRow
                        key={task.task._id}
                        id={task.task._id}
                        title={task.task.title}
                        completedCount={task.completed}
                        totalCount={task.total}
                    />
                ))}
            </ul>


        </>
    )
}

export default EditTasksPage;