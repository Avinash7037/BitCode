import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import { loginUser } from "../authSlice";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const loginSchema = z.object({
  emailId: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Login successful");
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const onSubmit = (data) => {
    dispatch(loginUser(data));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-3xl font-bold text-center mb-6">BitCode Login</h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div className="form-control">
              <label className="label">Email</label>
              <input
                className="input input-bordered"
                {...register("emailId")}
                placeholder="john@example.com"
              />
              {errors.emailId && (
                <p className="text-error text-sm">{errors.emailId.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="form-control mt-4">
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pr-12"
                  {...register("password")}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  👁
                </button>
              </div>
              {errors.password && (
                <p className="text-error text-sm">{errors.password.message}</p>
              )}
            </div>

            <button
              className={`btn btn-primary w-full mt-6 ${loading && "loading"}`}
              disabled={loading}
            >
              Login
            </button>
          </form>

          <p className="text-center mt-4">
            Don't have an account?{" "}
            <NavLink className="link link-primary" to="/signup">
              Sign up
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
