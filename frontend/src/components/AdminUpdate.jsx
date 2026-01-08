import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../utils/axiosClient";

const AdminUpdate = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "easy",
    tags: "array",
  });

  // 1️⃣ Fetch problem details
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axiosClient.get(`/problem/problemById/${problemId}`);

        setFormData({
          title: res.data.title,
          description: res.data.description,
          difficulty: res.data.difficulty,
          tags: res.data.tags,
        });

        setLoading(false);
      } catch (err) {
        alert("Failed to fetch problem");
        navigate("/admin/update");
      }
    };

    fetchProblem();
  }, [problemId, navigate]);

  // 2️⃣ Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 3️⃣ Submit update
  const handleUpdate = async () => {
    try {
      await axiosClient.put(`/problem/update/${problemId}`, formData);

      alert("Problem updated successfully");
      navigate("/admin");
    } catch (err) {
      alert("Update failed");
    }
  };

  if (loading) {
    return <p className="p-6">Loading problem details...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Update Problem</h1>

      {/* Title */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="input input-bordered w-full"
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="textarea textarea-bordered w-full h-32"
        />
      </div>

      {/* Difficulty */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Difficulty</label>
        <select
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          className="select select-bordered w-full"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {/* Tags */}
      <div className="mb-6">
        <label className="block mb-1 font-medium">Tag</label>
        <select
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          className="select select-bordered w-full"
        >
          <option value="array">Array</option>
          <option value="linkedlist">Linked List</option>
          <option value="graph">Graph</option>
          <option value="dp">DP</option>
        </select>
      </div>

      {/* Submit */}
      <button onClick={handleUpdate} className="btn btn-warning w-full">
        Update Problem
      </button>
    </div>
  );
};

export default AdminUpdate;
