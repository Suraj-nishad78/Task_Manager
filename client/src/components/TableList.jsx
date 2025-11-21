import React from "react";

const TableList = ({task}) => {
  return (
    <>
      <tbody>
        {task.map((t) => (
          <tr key={t.id}>
            <td>#{t.id}</td>
            <td>{t.title}</td>
            <td>{t.description}</td>
            <td>
              <span id="createAt">{t.date}</span>
            </td>
            <td className="tm-actions">
              <button className="tm-edit" onClick={handleEditForm}>
                Edit
              </button>
              <button className="tm-delete" onClick={handleDeleteTask}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </>
  );
};

export default TableList;
