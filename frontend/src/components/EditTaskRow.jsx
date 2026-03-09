
import { useState } from "react";
import "./EditTaskRow.css";
import DeleteButton from "./DeleteButton";
import { apiFetch } from "../utils/wrappers";


function EditTaskRow({ id, title, description, completedCount, totalCount }) {
    const [deleted, setDeleted] = useState(false);

    const deleteTask = async () => {
        try{
            console.log("Deleting: ", id);
            const endpoint = "api/tasks/" + id;
            const response = await apiFetch(endpoint, {method: "DELETE"});
            console.log(response);
            setDeleted(true);
        } catch (error) {
            console.error("Error when deleting a task: ", error);
        }
    }
            
    return (
        <>
            <li className="task-edit-row">
                {deleted ? 
                    // Deleted row
                    <div className="deleted-task-row">
                        <del>{title}</del>
                    </div>
                    :

                    // Normal row
                    <div className="undeleted-task-row">
                        <DeleteButton
                            className="delete-button"
                            onClick={deleteTask}
                        />
                        <span className="edit-task-title">
                            {title}   
                        </span> <br />
                        
                        {description !== " " ? 
                            <span className="edit-task-description">
                                {description}
                                <br />
                            </span>
                             : 
                            <></>
                        }
                        <span className="edit-task-count">
                            Completed: {completedCount}/{totalCount}
                        </span>
                    </div>
                }
            </li>
        </>
    )
}


export default EditTaskRow;