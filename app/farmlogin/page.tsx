"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function FarmLoginPage(){

  const router = useRouter();

  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");

  async function login(){

    const { data,error } = await supabase
      .from("farms")
      .select("*")
      .eq("username",username)
      .eq("password",password)
      .single();

    if(error || !data){
      alert("Wrong Login");
      return;
    }

    localStorage.setItem(
      "farm",
      JSON.stringify(data)
    );

    router.push("/farmdashboard");
  }

  return(
    <div
      style={{
        minHeight:"100vh",
        background:"#06071A",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        padding:"20px"
      }}
    >

      <div
        style={{
          width:"100%",
          maxWidth:"420px",
          background:"rgba(255,255,255,0.05)",
          padding:"30px",
          borderRadius:"24px"
        }}
      >

        <h1
          style={{
            color:"white",
            fontSize:"36px",
            fontWeight:"900",
            marginBottom:"25px",
            textAlign:"center"
          }}
        >
          Farm Login
        </h1>

        <input
          placeholder="Username"
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          style={inputStyle}
        />

        <button
          onClick={login}
          style={buttonStyle}
        >
          Login
        </button>

      </div>

    </div>
  );
}

const inputStyle = {
  width:"100%",
  padding:"14px",
  marginBottom:"15px",
  borderRadius:"12px",
  border:"none",
  background:"rgba(255,255,255,0.08)",
  color:"white"
};

const buttonStyle = {
  width:"100%",
  padding:"14px",
  borderRadius:"12px",
  border:"none",
  background:"#C9A96E",
  color:"#06071A",
  fontWeight:"900",
  cursor:"pointer"
};