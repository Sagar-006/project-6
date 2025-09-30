"use client";
import React, { useState } from "react";
import { authClient } from "../../lib/auth-client";
import { redirect } from "next/navigation";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const { data, error } = await authClient.signUp.email(
      {
        name: name,
        email: email,
        password: password,
        callbackURL: "/dashboard",
      },
      {
        onRequest: (ctx) => {
          console.log("Loading...");
        },
        onSuccess: (ctx) => {
          redirect("/dashboard");
        },
        onError: (ctx) => {
          console.log(ctx.error.message);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className='flex w-full h-full flex-col items-center justify-center gap-y-4 '>
      <Input
        type="text"
        value={name}
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
        className={` w-32 `}
      />
      <input
        type="email"
        value={email}
        placeholder="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" className="border-2 px-10">Submit</button>
    </form>
  );
};

export default Signup;
