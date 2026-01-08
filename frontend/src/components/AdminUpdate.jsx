import { useParams } from "react-router-dom";
import axios from "../utils/axiosClient";

const AdminUpdate = () => {
  const { id } = useParams();

  const handleUpdate = async () => {
    try {
      await axios.put(`/problem/update/${id}`, {
        title: "Updated title",
      });
      alert("Problem updated");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Update Problem</h2>
      <button onClick={handleUpdate}>Update</button>
    </div>
  );
};

export default AdminUpdate;
