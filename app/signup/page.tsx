"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    role: "individual",
    email: "",
    password: "",
  });

  const handleSignup = async () => {
    try {
      if (!form.email || !form.password || !form.name) {
        alert("Fill all fields");
        return;
      }

      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          role: form.role?.toLowerCase().trim(),
        }),
      });

      if (!res.ok) throw new Error("API failed");

      alert("Signup Successful ✅");
      router.push("/login");
    } catch (error) {
      console.error(error);
      alert("Signup failed ❌");
    }
  };

  /* 🔥 Input Effects (Reusable) */
  const handleFocus = (e: any) => {
    e.currentTarget.style.transform = "scale(1.03)";
    e.currentTarget.style.boxShadow =
      "0 0 12px rgba(59,130,246,0.6)";
    e.currentTarget.style.border = "1px solid #3b82f6";
  };

  const handleBlur = (e: any) => {
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.boxShadow = "none";
    e.currentTarget.style.border = "1px solid #475569";
  };

  const handleEnter = (e: any) => {
    e.currentTarget.style.transform = "translateY(-2px)";
  };

  const handleLeave = (e: any) => {
    e.currentTarget.style.transform = "translateY(0)";
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ color: "#fff" }}>Signup</h2>

        {/* Name */}
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          style={styles.input}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        />

        {/* Role */}
        <select
          value={form.role}
          onChange={(e) =>
            setForm({ ...form, role: e.target.value })
          }
          style={styles.input}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="team">Team</option>
          <option value="individual">Individual</option>
        </select>

        {/* Email */}
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          style={styles.input}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          style={styles.input}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        />

        {/* Button */}
        <button
          onClick={handleSignup}
          style={styles.btn}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow =
              "0 10px 20px rgba(34,197,94,0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          Signup
        </button>

        <p
          onClick={() => router.push("/login")}
          style={styles.link}
        >
          Already have account? Login
        </p>
      </div>
    </div>
  );
}

/* 🎨 Styles */
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage:
      "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('5137774.webp')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },

  card: {
    background: "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    padding: "50px",
    borderRadius: "24px",
    width: "550px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "24px",

    border: "1px solid rgba(255,255,255,0.2)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.37)",
  },

  input: {
    padding: "12px",
    border: "1px solid #475569",
    borderRadius: "8px",
    background: "#020617",
    color: "#fff",
    transition: "all 0.25s ease",
    outline: "none",
  },

  btn: {
    padding: "12px",
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "all 0.3s ease",
  },

  link: {
    textAlign: "center" as const,
    cursor: "pointer",
    color: "#38bdf8",
  },
};