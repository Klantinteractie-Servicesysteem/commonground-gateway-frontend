import * as React from "react";
import "./login.css";
import APIService from "../../apiService/apiService";
import { setUser } from "../../services/auth";
import { navigate } from "gatsby-link";
import Footer from "../../components/footer/footer";
import Particles from "react-tsparticles";
import { isLoggedIn } from "../../services/auth";
import { useForm } from "react-hook-form";
import { InputPassword, InputText } from "../../components/formFields";

const Login: React.FC = () => {
  const [error, setError] = React.useState<string>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const API: APIService = new APIService("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = (data): void => {
    setLoading(true);

    API.Login.login(data)
      .then((res) => {
        const user = { username: res.data.username };

        setUser(user);
        sessionStorage.setItem("jwt", res.data.jwtToken);
        sessionStorage.setItem("user", JSON.stringify(user));

        navigate("/");
      })
      .catch((err) => {
        setValue("username", "");
        setValue("password", "");
        setError(err.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  React.useEffect(() => {
    if (isLoggedIn() && window.location.pathname.includes("login")) {
      navigate("/");
    }
  }, [isLoggedIn()]);

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

        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          <h2>Login</h2>

          <InputText label="Username" name="username" {...{ register, errors }} validation={{ required: true }} />
          <InputPassword label="Password" name="password" {...{ register, errors }} validation={{ required: true }} />

          {error && <span className="login-form-error">{error}</span>}

          <button>{!loading ? "Login" : "Loading..."}</button>
        </form>
      </div>

      <Footer layoutClassName="login-footer" />
    </div>
  );
};

export default Login;
