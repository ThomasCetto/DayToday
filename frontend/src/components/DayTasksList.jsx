import React, { useState, useEffect } from "react";
import SingleTaskInfo from "./SingleTaskInfo";

function DayTasksList() {
    const [tasks, setTasks] = useState([]);
    const [date, setDate] = useState(new Date());  // Today's date
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
                const response = await fetch(endpoint, {method: "GET"});

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
        let yesterday = new Date();
        yesterday.setDate(date.getDate() - 1);
        setDate(yesterday);
    }

    function setTomorrow() {
        let tomorrow = new Date();
        tomorrow.setDate(date.getDate() + 1);
        setDate(tomorrow);
    }



    return (
        <>
        <button onClick={setYesterday}>Go to yesterday</button>
        <button onClick={() => {setDate(new Date())}}>Go to today</button>
        
        <h1>Today's tasks</h1>
        <h3>({date.toISOString().slice(0, 10)})</h3>
        <ul>
            {tasks.tasks.map(
                task => (
                    <li key={task._id}>{task.title}</li>
                )
            )}
        </ul>
        <button onClick={setTomorrow}>Go to tomorrow</button>
        </>
    );
}


export default DayTasksList;