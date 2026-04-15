"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    try {
      const res = await fetch("/api/users");
      const users = await res.json();

      const user = users.find((u: any) => {
        const dbEmail = u.email?.trim().toLowerCase();
        const inputEmail = form.email.trim().toLowerCase();

        const dbPassword = u.password?.trim();
        const inputPassword = form.password.trim();

        return dbEmail === inputEmail && dbPassword === inputPassword;
      });

      if (user) {
        alert("Login Successful ✅");

        localStorage.setItem("loggedUser", user.email);

        const role = user.role?.trim().toLowerCase();

        if (role === "admin") router.push("/admin");
        else if (role === "manager") router.push("/manager");
        else if (role === "team") router.push("/team");
        else router.push("/individual");
      } else {
        alert("Invalid Credentials ❌");
      }
    } catch (error) {
      console.error(error);
      alert("Login failed ❌ Check console");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ color: "#fff" }}>Login</h2>

        {/* Email */}
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          style={styles.input}
          onFocus={(e) => {
            e.currentTarget.style.transform = "scale(1.03)";
            e.currentTarget.style.boxShadow =
              "0 0 12px rgba(59,130,246,0.6)";
            e.currentTarget.style.border = "1px solid #3b82f6";
          }}
          onBlur={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.border = "1px solid #475569";
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
          }}
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
          onFocus={(e) => {
            e.currentTarget.style.transform = "scale(1.03)";
            e.currentTarget.style.boxShadow =
              "0 0 12px rgba(59,130,246,0.6)";
            e.currentTarget.style.border = "1px solid #3b82f6";
          }}
          onBlur={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.border = "1px solid #475569";
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
          }}
        />

        {/* Button */}
        <button
          onClick={handleLogin}
          style={styles.btn}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow =
              "0 10px 20px rgba(59,130,246,0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          Login
        </button>

        <p
          onClick={() => router.push("/signup")}
          style={styles.link}
        >
          New user? Signup
        </p>
      </div>
    </div>
  );
}

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
    borderRadius: "24px",
    padding: "50px",
    width: "550px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "24px",

    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.37)",
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
    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
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