"use client"
import React, { useState } from 'react'
import { authClient } from '../../lib/auth-client';
import { redirect } from 'next/navigation';

const Signin = () => {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const handleSubmit = async (e:any) => {
      e.preventDefault();
        const { data, error } = await authClient.signIn.email(
          {
            /**
             * The user email
             */
            email,
            /**
             * The user password
             */
            password,
            /**
             * A URL to redirect to after the user verifies their email (optional)
             */
            callbackURL: "/dashboard",
            /**
             * remember the user session after the browser is closed.
             * @default true
             */
            rememberMe: false,
          },
          {
            //callbacks
            onSuccess:(ctx) => {
              redirect("/dashboard")
            }
          }
        );
    }
  return (
    <form onSubmit={handleSubmit} className='flex w-full h-full flex-col items-center justify-center gap-y-4 '>
      <input
        type="email"
        value={email}
        placeholder="name"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" className='border-2 px-10'>Submit</button>
    </form>
  );
}

export default Signin
