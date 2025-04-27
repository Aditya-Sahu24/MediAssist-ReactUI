import React, { useState } from "react";
import { motion } from "framer-motion";
import Logo from "../assets/images/logo.png";
import BgImage from "../assets/images/Bgimage.png";
import api from "../utils/Url";

type Props = {
  type: "login" | "signup";
  onLogin: () => void;
};

const AuthForm: React.FC<Props> = ({ type, onLogin }) => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [submitError, setSubmitError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    let valid = true;
    const newErrors = { username: "", email: "", password: "" };

    if (type === "signup" && !form.username.trim()) {
      newErrors.username = "Username is required";
      valid = false;
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
      valid = false;
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!validate()) return;

    try {
      const endpoint = type === "login" ? "/login" : "/signup";
      const payload =
        type === "login"
          ? { email: form.email, password: form.password }
          : { username: form.username, email: form.email, password: form.password };

      const { data } = await api.post(`auth/${endpoint}`, payload);

      if (data.success) {
        sessionStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        onLogin();
      } else {
        setSubmitError(data.message || "Something went wrong");
      }
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || "Error occurred");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen px-4 py-12"
      style={{
        backgroundImage: `url(${BgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white/30 backdrop-blur-md border border-white/20 p-6 sm:p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-sm flex flex-col gap-4 text-gray-800"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Logo and MediAssist Title */}
        <div className="flex flex-col items-center mb-4">
          <img src={Logo} alt="MediAssist Logo" className="w-16 h-16 mb-2" />
          <h2 className="text-3xl font-bold text-blue-700 tracking-wide">
            MediAssist
          </h2>
          <p className="text-lg font-medium text-gray-700 mt-1">
            {type === "login" ? "Welcome Back! 👋" : "Join Us Now 🚀"}
          </p>
        </div>

        {/* Username (Signup Only) */}
        {type === "signup" && (
          <InputField
            name="username"
            value={form.username}
            onChange={handleChange}
            error={errors.username}
            placeholder="Username"
          />
        )}

        {/* Email */}
        <InputField
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="Email"
        />

        {/* Password */}
        <InputField
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Password"
        />

        {/* Submission Error */}
        {submitError && (
          <p className="text-center text-red-600 text-sm font-semibold">
            {submitError}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 w-full rounded-lg transition font-semibold"
        >
          {type === "login" ? "Login" : "Sign Up"}
        </button>

        {/* Footer Link */}
        <p className="mt-3 text-center text-sm text-gray-600">
          {type === "login" ? (
            <>
              Don’t have an account?{" "}
              <a href="/signup" className="text-blue-800 hover:underline">
                Sign Up
              </a>
            </>
          ) : (
            <>
              Already a user?{" "}
              <a href="/login" className="text-blue-800 hover:underline">
                Login
              </a>
            </>
          )}
        </p>
      </motion.form>
    </div>
  );
};

// Reusable Input Field Component
type InputFieldProps = {
  name: string;
  value: string;
  placeholder: string;
  error: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
};

const InputField: React.FC<InputFieldProps> = ({
  name,
  value,
  placeholder,
  error,
  onChange,
  type = "text",
}) => (
  <div className="flex flex-col">
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-2 bg-white/90 placeholder-gray-600 text-gray-900 border ${
        error ? "border-red-500" : "border-gray-300"
      } rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm`}
    />
    {error && (
      <span className="text-sm text-red-600 font-semibold mt-1">{error}</span>
    )}
  </div>
);

export default AuthForm;
