import { useRef } from "react";
import { useEffect, useState } from "react"
import FancyCheckbox from "./CustomCheckbox";


function TaskEntry({ taskId, title, isCompleted }) {
    const [compl, setCompl] = useState(isCompleted);
    const didMount = useRef(false);
    
    useEffect(() => {
        if (!didMount.current) {  // No need to run it when mounting
            didMount.current = true;
            return;
        }

        const updateDB = async () => {
            try{
                const endpoint = "api/taskInstances/" + taskId;
                const payload = { "isCompleted": compl };
                await fetch(endpoint, {
                    method: "PATCH", 
                    body: JSON.stringify(payload),
                    headers: {"Content-Type": "application/json"}
                });
            } catch(err) {
                console.error("Error: ", err);
            }
        };
        updateDB();
    }, [compl, taskId]);

    return (
        <>
            <li className="task-entry">
                <FancyCheckbox
                    checked={compl}
                    onChange={setCompl}
                    label={title}
                />
            </li>
            
        </>
    )
}

export default TaskEntry;