import React from "react";
import { Plus, Edit, Trash2, Video } from "lucide-react";
import { NavLink } from "react-router-dom";

function Admin() {
  const adminOptions = [
    {
      id: "create",
      title: "Create Problem",
      description: "Add a new coding problem to the platform",
      icon: Plus,
      color: "btn-success",
      bgColor: "bg-success/10",
      route: "/admin/create",
    },
    {
      id: "update",
      title: "Update Problem",
      description: "Edit existing problems and their details",
      icon: Edit,
      color: "btn-warning",
      bgColor: "bg-warning/10",
      route: "/admin/update", // ✅ THIS IS CORRECT NOW
    },
    {
      id: "delete",
      title: "Delete Problem",
      description: "Remove problems from the platform",
      icon: Trash2,
      color: "btn-error",
      bgColor: "bg-error/10",
      route: "/admin/delete",
    },
    {
      id: "video",
      title: "Video Problem",
      description: "Upload And Delete Videos",
      icon: Video,
      color: "btn-success",
      bgColor: "bg-success/10",
      route: "/admin/video",
    },
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Admin Panel</h1>
          <p className="text-lg opacity-70">
            Manage coding problems on your platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {adminOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div key={option.id} className="card bg-base-100 shadow-xl">
                <div className="card-body items-center text-center">
                  <div className={`${option.bgColor} p-4 rounded-full`}>
                    <Icon size={32} />
                  </div>

                  <h2 className="card-title mt-4">{option.title}</h2>
                  <p className="opacity-70">{option.description}</p>

                  <NavLink
                    to={option.route}
                    className={`btn ${option.color} btn-wide mt-4`}
                  >
                    {option.title}
                  </NavLink>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Admin;
