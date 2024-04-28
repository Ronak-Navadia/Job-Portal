import logo from "../../../assets/img/admin/grp-logo.png";
import FormControl from "../../shared/FormControl";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useMutation } from "@tanstack/react-query";
import { loginSchema } from "./validation";
import { login } from "./api";
import { toast } from "react-toastify";
import { LoginFormProps } from "../../shared/types";
import { useState } from "react";
import Loader from "../../shared/Loader";
import useStyleLoad from "../../../src/shared/hooks/useStyleLoad";
import Preloader from "../../../src/components/Preloader";
import FormError from "../../shared/FormError";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { stylesLoaded } = useStyleLoad();

  const { mutate: loginFn } = useMutation(
    (data: LoginFormProps) => login(data),
    {
      onSuccess: () => {
        toast.success("Login Successfully");
        navigate("/admin/job-category-list");
      },
      onError: () => {
        toast.error("Admin is Not Valid");
        setLoading(false);
      },
    }
  );

  const { handleSubmit, values, errors, handleChange } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values: LoginFormProps) => {
      setLoading(true);
      loginFn(values);
    },
    validateOnChange: false,
    validationSchema: loginSchema,
  });

  if (!stylesLoaded) {
    return <Preloader />
  }

  return (
    <div className="app-auth-wrapper">
      <div className="col-12 auth-main-col text-center p-5">
        <div className="d-flex flex-column align-content-end">
          <div className="app-auth-body mx-auto">
            <div className="app-auth-branding mb-4">
              <Link className="app-logo" to="#">
                <img className="logo-icon me-2" src={logo} alt="logo" />
              </Link>
            </div>
            <h2 className="auth-heading text-center mb-5">
              Admin Login to Job Portal
            </h2>
            <div className="auth-form-container text-start">
              <form className="auth-form login-form" onSubmit={handleSubmit}>
                <div className="email mb-3">
                  <FormControl
                    onChange={handleChange}
                    value={values.email}
                    id="signin-email"
                    type="text"
                    name="email"
                    placeholder="Email"
                  />
                  <FormError error={errors.email} />
                </div>
                <div className="password mb-3">
                  <FormControl
                    onChange={handleChange}
                    value={values.password}
                    id="signin-password"
                    type="password"
                    name="password"
                    placeholder="Password"
                  />
                  <FormError error={errors.password} />
                  {/* <div className="extra mt-3 row justify-content-between">
                    <div className="col-6">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="RememberPassword"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="RememberPassword"
                        >
                          Remember me
                        </label>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="forgot-password text-end">
                        <Link to="#0">Forgot password?</Link>
                      </div>
                    </div>
                  </div> */}
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="app-btn-primary w-100 theme-btn mx-auto"
                  >
                    {loading ? <Loader /> : "Log In"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
