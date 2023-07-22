import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import { register } from "../services/loginService";
import { ToastContainer, toast } from "react-toastify";

function Registration() {
  const [params, setParams] = useState({ name: "", email: "", password: "" });
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);

  let navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;

    setValidated(true);
    if (form.checkValidity() && !loading) {
      setLoading(true);
      register(params)
        .then((res) => {
          setDisableBtn(true);
          toast.success(res.message);
          toast.onChange((payload) => {
            if (payload.status === "removed") navigate("/login");
          });
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

  const login = (event) => {
    event.preventDefault();
    event.stopPropagation();
    navigate("/login");
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
      <Button
        variant="success"
        type="submit"
        className="mb-2"
        disabled={disableBtn}
      >
        {loading ? (
          <>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            Registering
          </>
        ) : (
          "Register"
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
              <h2>Create an account</h2>
            </Form.Label>

            {getInputElement("name", "text", "Enter name", "Please enter name")}
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
            <span className="link-margin">Already have an account?</span>
            <a href="" onClick={login}>
              Login
            </a>
          </div>
        </Card.Body>
      </Card>
      <ToastContainer autoClose={2000} />
    </div>
  );
}

export default Registration;
