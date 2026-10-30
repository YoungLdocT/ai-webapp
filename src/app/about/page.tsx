"use client";
import { signIn, signUp } from "@/lib/auth-client";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSignUp = async () => {
    const { data, error } = await signUp.email({
      email,
      password,
      name,
    });
    if (error) {
      console.log(error.message);
    } else {
      console.log(data);
    }
  };

  const [signEmail, setSignEmail] = useState("");
  const [signPassword, setSignPassword] = useState("");

  const handleSignIn = async () => {
    const { data, error } = await signIn.email({
      email: signEmail,
      password: signPassword,
    });
    if (error) {
      console.log(error.message);
    } else {
      console.log(data.user);
    }
  };
  const handleGithubLogin = async () => {
    const { data, error } = await signIn.social({
      provider: "github",
    });
    if (error) {
      console.log(error.message);
    } else {
      console.log(data);
    }
  };

  return (
    <div>
      <div>
        <h1>注册</h1>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="button" onClick={() => handleSignUp()}>
          Sign Up
        </button>
      </div>
      <hr />
      <div>
        <h1>登录</h1>
        <input
          value={signEmail}
          onChange={(e) => setSignEmail(e.target.value)}
          type="text"
          placeholder="Email"
        />
        <input
          value={signPassword}
          onChange={(e) => setSignPassword(e.target.value)}
          type="password"
          placeholder="Password"
        />
        <button type="button" onClick={() => handleSignIn()}>
          Sign In
        </button>
      </div>
      <hr />
      <button type="button" onClick={() => handleGithubLogin()}>
        GitHub 登录
      </button>
      ;
    </div>
  );
}
