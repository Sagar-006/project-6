"use client";
import React, { useState } from "react";
import { authClient } from "../../lib/auth-client";
import Image from "next/image";

export default function Signin() {
  const callbackURL = window.location.href;
  const handleGoogleSignin = async () => {
    const res = await authClient.signIn.social({
      provider: "google",
      callbackURL:callbackURL,
    });
  };
  return (
    <div className="flex items-center justify-center h-screen">
      <button
        onClick={handleGoogleSignin}
        className="px-6 py-3 border rounded-md text-lg font-medium flex gap-x-1 cursor-pointer"
      >
        <Image
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google"
          width={16}
          height={16}
        />
        <span>Continue with Google</span>
      </button>
    </div>
  );
}
