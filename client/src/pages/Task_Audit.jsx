import React, { useState, useEffect } from "react";
import axios from "axios";

const Task_Audit = () => {
  const [audits, setAudit] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // show 5 audits per page

  // === Extract formatted date ===
  const extractDate = (isd) => {
    const date = new Date(isd);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  // === Convert updateContent ===
  const convertObjToArray = (item) => {
    if (item.action === "delete") {
      return item.updateContent;
    }

    return Object.entries(item.updateContent).map(([key, value]) => ({
      key,
      value,
    }));
  };

  // === Fetch audits ===
  const fetchAllAudit = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}tasks/getAuditTask`
      );

      const formatData = res.data.audits.map((item) => ({
        ...item,
        timestamp: extractDate(item.timestamp),
        updateContent: convertObjToArray(item),
      }));

      setAudit(formatData);
    } catch (e) {
      console.log("Error fetching audits:", e);
    }
  };

  useEffect(() => {
    fetchAllAudit();
  }, []);

  // === Pagination Logic ===
  const totalPages = Math.ceil(audits.length / pageSize);

  const paginatedData = audits.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <>
      <div className="tm-main">
        <div className="tm-table-wrapper">
          <p>Audit Logs</p>

          {audits.length > 0 ? (
            <table className="tm-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Action</th>
                  <th>Task ID</th>
                  <th>Updated Content</th>
                  <th>Notes</th>
                </tr>
              </thead>

              <tbody>
                {paginatedData.map((t) => (
                  <tr key={t._id}>
                    <td>{t.timestamp}</td>

                    <td className="actions-btn">
                      <button className={t.action}>{t.action}</button>
                    </td>

                    <td>#{t.taskId}</td>

                    <td className="upgrade-box">
                      {(t.action === "create" || t.action === "update") &&
                        t.updateContent.map((c, i) => (
                          <button key={i}>
                            {c.key}: "{c.value}"
                          </button>
                        ))}

                      {t.action === "delete" && <button>-</button>}
                    </td>

                    <td>-</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No Task Audits</p>
          )}
        </div>

        {/* Pagination */}
        <div className="tm-pagination">
          <span>
            Showing {paginatedData.length} of {audits.length} audit logs
          </span>

          <div className="tm-page-controls">
            <button disabled={currentPage === 1} onClick={prevPage}>
              Prev
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button disabled={currentPage === totalPages} onClick={nextPage}>
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Task_Audit;
