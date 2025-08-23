import useLoginUser from "@/hooks/useLoginUser";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-gray-400"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

// Icon component for the user/email
const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-gray-400"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

export default function Login() {
  // State to hold form input values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const errorContainer = useRef<HTMLParagraphElement>();

  const { data, mutate, isPending, isSuccess, error } = useLoginUser();

  useEffect(() => {
    if (isSuccess && window) {
      window.location.reload();
    }
  }, [isSuccess]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormError("");
    if (!email || !password) {
      setFormError("Please enter both email and password.");
      return;
    }
    mutate({ username: email, password });
  };

  useEffect(() => {
    if (error && errorContainer.current) {
      errorContainer.current.innerHTML =
        axios.isAxiosError(error) && error.response.data.message;
    }
  }, [error, errorContainer.current]);

  return (
    <div className="flex items-center justify-center h-[calc(100vh-160px)] font-sans">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">
            Bem vindo ao Repositório
          </h1>
          <p className="mt-2 text-gray-400">
            Ensinamentos oferecidos por Lama Padma Samten, organizados por ano e
            repositório do youtube.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="relative">
            <div className="absolute top-1/2 left-3 -translate-y-1/2">
              <UserIcon />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full py-3 pl-12 pr-4 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              autoComplete="email"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className="absolute top-1/2 left-3 -translate-y-1/2">
              <LockIcon />
            </div>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full py-3 pl-12 pr-4 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              autoComplete="current-password"
            />
          </div>

          {/* Error and Success Messages */}
          {formError && (
            <p className="text-sm text-red-400 text-center">{formError}</p>
          )}
          <p
            className="text-sm text-red-400 text-center"
            ref={errorContainer}
          ></p>
          {isSuccess && (
            <p className="text-sm text-green-400 text-center">
              {data.data.message}
            </p>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-transform transform hover:not-disabled:scale-105 duration-300 disabled:bg-gray-500"
              disabled={isPending}
            >
              Log In
            </button>
          </div>
        </form>

        {/* Footer Link */}
        <div className="text-center">
          <a href="#" className="text-sm text-blue-400 hover:underline">
            Forgot password?
          </a>
        </div>
      </div>
    </div>
  );
}
