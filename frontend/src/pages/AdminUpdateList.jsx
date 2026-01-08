import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../utils/axiosClient";

const AdminUpdateList = () => {
  const [problems, setProblems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosClient
      .get("/problem/getAllProblem")
      .then((res) => setProblems(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Select Problem to Update</h1>

      {problems.map((problem) => (
        <div
          key={problem._id}
          className="flex justify-between items-center p-4 border rounded mb-3"
        >
          <span>{problem.title}</span>

          <button
            className="btn btn-warning btn-sm"
            onClick={() => navigate(`/admin/update/${problem._id}`)}
          >
            Update
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminUpdateList;
