import { useState } from "react";
import "./EditTaskRow.css";
import DeleteButton from "./DeleteButton";
import { apiFetch } from "../../utils/wrappers";
import EditButton from "./EditButton";
import EditTaskForm from "./EditTaskForm";

function EditTaskRow({
  id,
  titleProp,
  descriptionProp,
  dateProp,
  gapTypeProp,
  gapAmountProp,
  completedCount,
  totalCount,
}) {
  const [deleted, setDeleted] = useState(false);
  const [editing, setEditing] = useState(false);

  const [title, setTitle] = useState(titleProp);
  const [description, setDescription] = useState(descriptionProp);
  const [date, setDate] = useState(dateProp);
  const [gapType, setGapType] = useState(gapTypeProp);
  const [gapAmount, setGapAmount] = useState(gapAmountProp);


  const deleteTask = async () => {
    try {
      console.log("Deleting: ", id);
      const endpoint = "api/tasks/" + id;
      await apiFetch(endpoint, { method: "DELETE" });
      setDeleted(true);
    } catch (error) {
      console.error("Error when deleting a task: ", error);
    }
  };

  const normalRow = (
    <div className="undeleted-task-row">
      <EditButton className="edit-button" onClick={() => setEditing(true) }  />
        &nbsp;
      <DeleteButton className="delete-button" onClick={deleteTask} />
    
      <span className="edit-task-title">
        <b>{title}</b>
      </span>
      <div className="edit-task-date">
        First scheduled at: {date.slice(0, 10)}
      </div>
      <div className="edit-task-gap">
        {gapType !== "none" && gapAmount != 0 ? (
          <span>
            Every {gapAmount} {gapType}s
          </span>
        ) : (
          <span>One-time task</span>
        )}
      </div>
      {description !== " " && (
        <div className="edit-task-description">
          Description: {description}
        </div>
      )}
      <div className="edit-task-count">
        Completed: {completedCount}/{totalCount}
      </div>
    </div>
  );

  const deletedRow = (
    <div className="deleted-task-row">
      <del>{title}</del>
    </div>
  );

  const editingRow = (
    <>
      <EditButton className="edit-button" onClick={() => setEditing(false) }  />
      <EditTaskForm 
        id={id}
        title={title}
        description={description}
        date={new Date(date)}
        gapType={gapType}
        gapAmount={gapAmount}
        parentOnSubmit={(tit, desc, dat, gapTyp, gapAm) => {
          setEditing(false);
          setTitle(tit);
          setDescription(desc);
          setDate(dat);
          setGapType(gapTyp);
          setGapAmount(gapAm);
        }}
      ></EditTaskForm>
    </>
  );

  return (
    <>
      <li className={"task-edit-row " + (editing ? "editing" : "")}>
        { deleted ? deletedRow : ( editing ? editingRow : normalRow) }
      </li>
    </>
  );
}

export default EditTaskRow;
