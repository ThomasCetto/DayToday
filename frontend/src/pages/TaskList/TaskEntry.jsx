import { useRef } from "react";
import { useEffect, useState } from "react"
import CustomCheckbox from "./CustomCheckbox";
import { apiFetch } from "../../utils/wrappers";
import "./TaskEntry.css";


function TaskEntry({ taskId, title, isCompleted, description }) {
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
                await apiFetch(endpoint, {
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
                <div className="tooltip-container">
                    <span className="tooltip-text">{description != " " ? description : "No description"}</span>
                    
                    <CustomCheckbox
                        checked={compl}
                        onChange={setCompl}
                        label={title}
                    />
                </div>
            </li>
            
        </>
    )
}

export default TaskEntry;