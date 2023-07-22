import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import { login } from "../services/loginService";
import { ToastContainer, toast } from "react-toastify";
import Util from "../utils/Util";

function Login() {
  const [params, setParams] = useState({ email: "", password: "" });
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);

  let navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;

    setValidated(true);
    if (form.checkValidity() && !loading) {
      setLoading(true);
      login(params)
        .then((res) => {
          if (res.error) toast.error(res.error.message);
          else {
            sessionStorage.setItem("user", JSON.stringify(res));
            Util.setUserInfo(res);
            navigate("/bus");
          }
        })
        .catch((error) => toast.error(error))
        .finally(() => setLoading(false));
    }
  };

  const handleOnChange = (name, value) => {
    let tempParams = { ...params };
    tempParams[name] = value;

    setParams(tempParams);
  };

  const register = (event) => {
    event.preventDefault();
    event.stopPropagation();
    navigate("/register");
  };

  const getInputElement = (field, type, placeholder, feedback) => {
    return (
      <Form.Group className="mb-3" controlId={field}>
        <Form.Control
          required
          type={type}
          placeholder={placeholder}
          onChange={(e) => handleOnChange(field, e.target.value)}
        />
        <Form.Control.Feedback type="invalid">{feedback}</Form.Control.Feedback>
      </Form.Group>
    );
  };

  const getButtonElement = () => {
    return (
      <Button variant="success" type="submit" className="mb-2">
        {loading ? (
          <>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            Logging
          </>
        ) : (
          "Login"
        )}
      </Button>
    );
  };

  return (
    <div className="w-25">
      <Card>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Label>
              <h2>Login</h2>
            </Form.Label>

            {getInputElement(
              "email",
              "email",
              "Enter email",
              "Please enter email"
            )}
            {getInputElement(
              "password",
              "password",
              "Enter password",
              "Please enter password"
            )}
            {getButtonElement()}
          </Form>
          <div className="link-message">
            <span className="link-margin">{`Don't have an account?`}</span>
            <a href="" onClick={register}>
              Sign Up
            </a>
          </div>
        </Card.Body>
      </Card>
      <ToastContainer autoClose={2000} />
    </div>
  );
}

export default Login;
