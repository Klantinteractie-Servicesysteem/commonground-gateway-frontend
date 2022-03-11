import * as React from "react";
import "./login.css";
import APIService from "../../apiService/apiService";
import { isLoggedIn, setUser } from "../../services/auth";
import { navigate } from "gatsby-link";
import Footer from "../../components/footer/footer";
import Particles from "react-tsparticles";

const Login: React.FC = () => {
  const [username, setUsername] = React.useState<string>(null);
  const [password, setPassword] = React.useState<string>(null);
  const [error, setError] = React.useState<string>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const API: APIService = new APIService("");

  React.useEffect(() => {
    isLoggedIn() && navigate("/");
  }, [API]);

  const handleLogin = (): void => {
    setLoading(true);

    const body = { ...{ username, password } };

    API.Login.login(body)
      .then((res) => {
        const user = { username: res.data.username };

        setUser(user);
        sessionStorage.setItem("jwt", res.data.jwtToken);
        sessionStorage.setItem("user", JSON.stringify(user));

        navigate("/");
      })
      .catch((err) => {
        setError(err.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="login">
      <Particles
        options={{
          fpsLimit: 60,
          particles: {
            color: {
              value: "#ffffff",
            },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            collisions: {
              enable: true,
            },
            move: {
              direction: "none",
              enable: true,
              outMode: "bounce",
              random: false,
              speed: 2,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle",
            },
            size: {
              random: true,
              value: 5,
            },
          },
          detectRetina: true,
        }}
      />

      <div className="login-container">
        <h1>Welcome to Conductor!</h1>

        <form className="login-form">
          <h2>Login</h2>

          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            required
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />

          {error && <span className="login-form-error">{error}</span>}

          <button onClick={handleLogin} disabled={loading || !username || !password}>
            {!loading ? "Login" : "Loading..."}
          </button>
        </form>
      </div>

      <Footer layoutClassName="login-footer" />
    </div>
  );
};

export default Login;
