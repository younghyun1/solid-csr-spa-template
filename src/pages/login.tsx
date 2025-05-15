import { createSignal } from "solid-js";

function LoginPage() {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");

  return (
    <div style={{
      display: "flex",
      "justify-content": "center",
      "align-items": "center",
      height: "100vh",
      background: "#f5f5f5"
    }}>
      <div style={{
        padding: "2rem",
        "border-radius": "8px",
        background: "white",
        "box-shadow": "0 2px 8px rgba(0, 0, 0, 0.12)",
        "min-width": "350px",
        display: "flex",
        "flex-direction": "column",
        "align-items": "center"
      }}>
        <h2 style={{ "margin-bottom": "1.5rem" }}>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email()}
          onInput={e => setEmail(e.currentTarget.value)}
          style={{
            width: "100%",
            padding: "0.75rem",
            "margin-bottom": "1rem",
            "font-size": "1rem",
            "border-radius": "4px",
            border: "1px solid #ccc"
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password()}
          onInput={e => setPassword(e.currentTarget.value)}
          style={{
            width: "100%",
            padding: "0.75rem",
            "margin-bottom": "1.5rem",
            "font-size": "1rem",
            "border-radius": "4px",
            border: "1px solid #ccc"
          }}
        />
        <div style={{
          display: "flex",
          "justify-content": "space-between",
          width: "100%",
          "margin-bottom": "1.5rem"
        }}>
          <button
            style={{
              "background": "none",
              "border": "none",
              "color": "#428bca",
              "cursor": "pointer",
              "font-size": "0.95rem",
              "padding": 0
            }}
            tabIndex={-1}
          >
            Find Account
          </button>
          <button
            style={{
              "background": "none",
              "border": "none",
              "color": "#428bca",
              "cursor": "pointer",
              "font-size": "0.95rem",
              "padding": 0
            }}
            tabIndex={-1}
          >
            Find Password
          </button>
        </div>
        <button
          style={{
            width: "100%",
            padding: "0.75rem",
            "font-size": "1rem",
            "background": "#428bca",
            color: "white",
            border: "none",
            "border-radius": "4px",
            "cursor": "pointer",
            "margin-bottom": "1rem"
          }}
        >
          Login
        </button>
        <button
          style={{
            width: "100%",
            padding: "0.75rem",
            "font-size": "1rem",
            "background": "#eaeaea",
            color: "#428bca",
            border: "none",
            "border-radius": "4px",
            "cursor": "pointer"
          }}
        >
          Register
        </button>
      </div>
    </div>
  );
}

export default LoginPage;