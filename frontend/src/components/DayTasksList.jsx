import React, { useState, useEffect } from "react";
import "./DayTasksList.css";
import TaskEntry from "./TaskEntry";
import { apiFetch } from "../utils/wrappers";


function DayTasksList() {
    const [tasks, setTasks] = useState([]);
    const [date, setDate] = useState(new Date());  // Today's date as default
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch data when component loads
        const fetchTasks = async () => {
            try {
                let nextDay = new Date(date);
                nextDay.setDate(date.getDate() + 1);
                nextDay = nextDay.toISOString().slice(0, 10);
                const dateRangeString = date.toISOString().slice(0, 10) + '&to=' + nextDay;
                const endpoint = 'api/taskInstances?from=' + dateRangeString;
                const response = await apiFetch(endpoint, {method: "GET"});
                
                if(response.status == 401 || response.status == 403) throw new Error("You must be logged in to use this page");
                if(!response.ok) throw new Error("Couldnt fetch tasks");
                const data = await response.json();
                setTasks(data);
            } catch (err) {
				setError(err.message); 
			} finally {
				setLoading(false);
			}
        };
        fetchTasks();
    }, [date]);

    if(loading) return <p>Loading...</p>;
    if(error) return <p>Error: {error}</p>;

    function setYesterday() {
        let yesterday = new Date(date);
        yesterday.setDate(date.getDate() - 1);
        setDate(yesterday);
    }
    function setTomorrow() {
        let tomorrow = new Date(date);
        tomorrow.setDate(date.getDate() + 1);
        setDate(tomorrow);
    }

    const dayOfMonth = date.getDate();
    const dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][date.getDay()];
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][date.getMonth()];
    
    return (
        <>
            <div className="page">
                <div className='side left' onClick={setYesterday}>←</div>
                <div className="main">
                    <div className="mainHeader">
                        <h3>{dayOfWeek}, {dayOfMonth} {month}</h3>
                        <input 
                            type="date" 
                            id="datePicker" 
                            value={date.toISOString().slice(0, 10)} 
                            onChange={(e) => {
                                if (e.target.value === "") return; 
                                setDate(new Date(e.target.value));
                            }} 
                        />
                        
                    </div>
                    <ul className="task-list">
                        {tasks.tasks.map(
                            task => (
                                <TaskEntry 
                                    key={task._id}
                                    taskId={task._id} 
                                    title={task.title} 
                                    isCompleted={task.isCompleted} 
                                    description={task.description}
                                />
                            )
                        )}
                    </ul>
                </div>
                <div className='side right' onClick={setTomorrow}>→</div>
            </div>
        </>
    );
}


export default DayTasksList;