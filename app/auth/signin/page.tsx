"use client"
import React, { useState } from 'react'
import { authClient } from '../../lib/auth-client';

export default function  Signin  () {
  const handleGoogleSignin = async () => {
    const res = await authClient.signIn.social(
      {provider:'google',callbackURL:''},
    
    )
  }
   return (
     <div className="flex items-center justify-center h-screen">
       <button
         onClick={handleGoogleSignin}
         className="px-6 py-3 border rounded-md text-lg font-medium"
       >
         Continue with Google
       </button>
     </div>
   );
}

