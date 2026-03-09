
import { useState } from "react";
import "./EditTaskRow.css";
import DeleteButton from "./DeleteButton";
import { apiFetch } from "../utils/wrappers";


function EditTaskRow({ id, title, description, date, gapType, gapAmount, completedCount, totalCount }) {
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
                    <div className="undeleted-task-row">                               	{/* Delete button*/}
                        <DeleteButton
                            className="delete-button"
                            onClick={deleteTask}
                        />
                        <span className="edit-task-title"><b>{title}</b></span>         {/* Title */}

                        <div className="edit-task-date">                                {/* Date */}
                            First scheduled at: {date.slice(0, 10)}
                        </div>
                        
                        <div className="edit-task-gap">                                 {/* Gap */}
                            {
                                (gapType !== "none" && gapAmount != 0) ?
                                <span>Every {gapAmount} {gapType}s </span>
                                :
                                <span>One-time task</span>
                            }
                        </div> 
                                                                             
                        {                                                               
                            (description !== " ") && 
                            <div className="edit-task-description">                     {/* Description */}
                                Description: {description}
                            </div>
                        }
                        <div className="edit-task-count">
                            Completed: {completedCount}/{totalCount}                    {/* Stats */}
                        </div>
                    </div>
                }
            </li>
        </>
    )
}


export default EditTaskRow;