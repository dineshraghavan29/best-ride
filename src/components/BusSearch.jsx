import React, { useState } from "react";
import { Form } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Flatpickr from "react-flatpickr";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { getBusDetail } from "../services/busService";
import { ToastContainer, toast } from "react-toastify";

function BusSearch(props) {
  const [params, setParams] = useState({
    from: "",
    to: "",
    selectedDate: new Date(),
  });
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;

    setValidated(true);
    if (form.checkValidity()) {
      setLoading(true);
      getBusDetail(params)
        .then((res) => {
          if (res.error) toast.error(res.error.message);
          else props.handleBuses(res);
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

  function getInputElement(field, type, placeholder, feedback) {
    return (
      <Form.Group as={Col} md={3} className="mb-3" controlId={field}>
        <Form.Control
          required
          type={type}
          placeholder={placeholder}
          onChange={(e) => handleOnChange(field, e.target.value)}
        />
        <Form.Control.Feedback type="invalid">{feedback}</Form.Control.Feedback>
      </Form.Group>
    );
  }

  function getDatePicker() {
    return (
      <Form.Group as={Col} md={3} className="mb-3" controlId="selectedDate">
        <Flatpickr
          data-enable-time
          options={{
            enableTime: false,
            dateFormat: "d-M-Y",
            minDate: "today",
          }}
          value={params.selectedDate}
          onChange={([date]) => handleOnChange("selectedDate", date)}
          className="date-picker"
        />
      </Form.Group>
    );
  }

  function getButtonElement() {
    return (
      <Form.Group as={Col} md={3} className="mb-3" controlId="to">
        <Button variant="success" type="submit" className="w-100">
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              Loading
            </>
          ) : (
            "Search"
          )}
        </Button>
      </Form.Group>
    );
  }

  return (
    <>
      <Form.Label>
        <h2>Search Bus</h2>
      </Form.Label>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="mb-3">
          {getInputElement("from", "text", "From", "Please enter source")}
          {getInputElement("to", "text", "To", "Please enter destination")}
          {getDatePicker()}
          {getButtonElement()}
        </Row>
      </Form>
      <ToastContainer autoClose={2000} />
    </>
  );
}

export default BusSearch;
