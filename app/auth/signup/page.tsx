"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function Signup() {
  const [role, setRole] = useState("patient");
  const router = useRouter();

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";

    const signupRes = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        role,
      }),
    });

    if (!signupRes.ok) {
      const message = await signupRes.text();
      alert(message || "Signup failed");
      return;
    }

    const loginRes = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!loginRes?.ok) {
      alert("Account created. Please login.");
      router.push("/auth/login");
      return;
    }

    router.push(role === "doctor" ? "/dashboard/doctor" : "/dashboard/patient");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <form onSubmit={handleSignup} className="bg-white p-8 rounded-xl w-96">
        <h2 className="text-xl font-bold text-center text-green-600">
          Create Account
        </h2>

        <input name="name" placeholder="Name" className="input" />
        <input name="email" placeholder="Email" className="input" />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="input"
        />

        <select onChange={(e) => setRole(e.target.value)} className="input">
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>

        <button className="w-full bg-green-600 text-white p-2 mt-4 rounded">
          Sign Up
        </button>
      </form>
    </div>
  );
}
