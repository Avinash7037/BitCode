import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { logoutUser } from "../authSlice";

function Homepage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: "all",
    tag: "all",
    status: "all",
  });

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get("/problem/getAllProblem");
        setProblems(data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get("/problem/problemSolvedByUser");
        setSolvedProblems(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProblems();
    if (user) fetchSolvedProblems();
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]);
  };

  const filteredProblems = problems.filter((problem) => {
    const difficultyMatch =
      filters.difficulty === "all" || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === "all" || problem.tags === filters.tag;
    const statusMatch =
      filters.status === "all" ||
      solvedProblems.some((sp) => sp._id === problem._id);
    return difficultyMatch && tagMatch && statusMatch;
  });

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navbar */}
      <nav className="navbar bg-base-100 shadow-md px-6">
        <div className="flex-1">
          <NavLink
            to="/"
            className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          >
            BitCode
          </NavLink>
          <span className="ml-3 text-sm text-gray-400 hidden md:block">
            Practice • Solve • Master
          </span>
        </div>

        <div className="dropdown dropdown-end">
          <div tabIndex={0} className="btn btn-ghost font-medium">
            {user?.firstName}
          </div>
          <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box shadow w-48 mt-3">
            {user?.role === "admin" && (
              <li>
                <NavLink to="/admin">Admin Panel</NavLink>
              </li>
            )}
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            className="select select-bordered"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">All</option>
            <option value="solved">Solved</option>
          </select>

          <select
            className="select select-bordered"
            value={filters.difficulty}
            onChange={(e) =>
              setFilters({ ...filters, difficulty: e.target.value })
            }
          >
            <option value="all">Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select
            className="select select-bordered"
            value={filters.tag}
            onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
          >
            <option value="all">Topic</option>
            <option value="array">Array</option>
            <option value="linkedList">Linked List</option>
            <option value="graph">Graph</option>
            <option value="dp">DP</option>
          </select>
        </div>

        {/* Table Header */}
        <div className="hidden md:grid grid-cols-4 text-sm font-semibold text-gray-500 px-6 mb-2">
          <div>Problem</div>
          <div>Difficulty</div>
          <div>Topic</div>
          <div>Status</div>
        </div>

        {/* Problem Cards */}
        <div className="space-y-3">
          {filteredProblems.map((problem) => {
            const isSolved = solvedProblems.some(
              (sp) => sp._id === problem._id
            );

            return (
              <div
                key={problem._id}
                className="grid grid-cols-1 md:grid-cols-4 items-center bg-base-100 px-6 py-4 rounded-xl shadow hover:shadow-lg transition"
              >
                {/* Title */}
                <NavLink
                  to={`/problem/${problem._id}`}
                  className="font-semibold hover:text-primary"
                >
                  {problem.title}
                </NavLink>

                {/* Difficulty */}
                <span
                  className={`badge ${getDifficultyBadgeColor(
                    problem.difficulty
                  )}`}
                >
                  {problem.difficulty.toUpperCase()}
                </span>

                {/* Topic */}
                <span className="badge badge-outline badge-info">
                  {problem.tags}
                </span>

                {/* Status */}
                {isSolved ? (
                  <span className="badge badge-success">Solved</span>
                ) : (
                  <span className="badge badge-ghost">Unsolved</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const getDifficultyBadgeColor = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "badge-success";
    case "medium":
      return "badge-warning";
    case "hard":
      return "badge-error";
    default:
      return "badge-neutral";
  }
};

export default Homepage;
