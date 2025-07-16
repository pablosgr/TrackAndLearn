'use client';

import { FormEvent, useState } from "react";
import { logIn, signUp } from "./actions";

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  
  const handleLogIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await logIn(formData);
    if (result.error) {
      setError(result.error);
    }
  }

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await signUp(formData);
    if (result.error) {
      setError(result.error);
    }
  }

  return (
    <div className="flex flex-row gap-12 items-center justify-center min-h-screen min-w-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <form className="flex flex-col gap-3 p-8 shadow-2xl h-fit rounded-xl" onSubmit={handleLogIn}>
        {
          error && <p className="text-red-500">{error}</p>
        }
        <input name="email" type="email" placeholder="Email" className="border-gray-400 border-1 p-2 rounded-lg" required />
        <input name="password" type="password" placeholder="Password" className="border-gray-400 border-1 p-2 rounded-lg" required />
        <button className="p-3 bg-gray-600 hover:cursor-pointer hover:bg-gray-400 text-white rounded-lg transition-colors">Log in</button>
      </form>
      <form className="flex flex-col gap-3 p-8 shadow-2xl h-fit rounded-xl" onSubmit={handleSignUp}>
        <input  name="name" type="text" placeholder="Your name" className="border-gray-400 border-1 p-2 rounded-lg" required />
        <input name="username" type="text" placeholder="Your username" className="border-gray-400 border-1 p-2 rounded-lg" required />
        <input name="email" type="email" placeholder="Your email" className="border-gray-400 border-1 p-2 rounded-lg" required />
        <input name="password" type="password" placeholder="Your password" className="border-gray-400 border-1 p-2 rounded-lg" required />
        <select name="role" className="border-gray-400 border-1 p-2 rounded-lg" required>
          <option value="">Choose your role</option>
          <option value="teacher">I'm a teacher</option>
          <option value="student">I'm a student</option>
        </select>
        <button className="p-3 bg-gray-600 hover:cursor-pointer hover:bg-gray-400 text-white rounded-lg transition-colors">Sign up</button>
      </form>
    </div>
  );
}
