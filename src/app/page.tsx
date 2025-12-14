"use client";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export default function Home() {
  const { data: session, isPending, error } = authClient.useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const signUp = async () => {
    await authClient.signUp.email(
      {
        email,
        password,
        name,
      },
      {
        onSuccess: () => {
          window.location.reload();
        },
        onError: (ctx) => {
          console.error("SignUp Error:", ctx.error.message);
        },
      }
    );
  };

  const signIn = async () => {
    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onSuccess: () => {
          window.location.reload();
        },
        onError: (ctx) => {
          console.error("SignIn Error:", ctx.error.message);
        },
      }
    );
  };

  const signOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.reload();
        },
      },
    });
  };

  if (isPending) {
    return <div className="p-10">Loading...</div>;
  }

  if (session) {
    return (
      <div className="p-10">
        <h1 className="text-2xl font-bold">Welcome, {session.user.name}</h1>
        <p>Email: {session.user.email}</p>
        <button
          onClick={signOut}
          className="bg-red-500 text-white px-4 py-2 mt-4 rounded"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="p-10 flex flex-col gap-4 max-w-sm mx-auto">
      <h1 className="text-2xl font-bold">Score Tracker Auth Test</h1>
      <input
        placeholder="Name (for signup)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded text-black"
      />
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded text-black"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded text-black"
      />
      <div className="flex gap-4">
        <button
          onClick={signIn}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Sign In
        </button>
        <button
          onClick={signUp}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
