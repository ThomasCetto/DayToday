import { useRef } from "react";
import { useEffect, useState } from "react"


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
            <li> {title}
                <input 
                    type="checkbox" 
                    checked={compl} 
                    onChange={(e) => {
                        setCompl(e.target.checked);
                    }}
                />   
            </li>
            
        </>
    )
}

export default TaskEntry;