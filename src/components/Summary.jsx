import { useState } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import Card from "react-bootstrap/Card";
import { Spinner } from "react-bootstrap";
import Util from "../utils/Util";
import { bookTickets } from "../services/busService";
import { ToastContainer, toast } from "react-toastify";

function Summary(props) {
  const { show, selectedBus, selectedSeats, handleClose } = props;
  const [loading, setLoading] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);

  const pay = () => {
    const params = {
      user: Util.getUserInfo(),
      bus: selectedBus,
      seats: selectedSeats,
    };

    if (!loading) {
      setLoading(true);
      bookTickets(params)
        .then((res) => {
          setDisableBtn(true);
          if (res.success) {
            toast.success(res.success.message);
          } else {
            toast.error(res.error.message);
          }
          toast.onChange((payload) => {
            if (payload.status === "removed") {
              handleClose();
              if (res.success) window.location.reload();
            }
          });
        })
        .finally(() => setLoading(false));
    }
  };

  function getButtonElement() {
    return (
      <Button variant="success" onClick={pay} disabled={disableBtn}>
        {loading ? (
          <>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            Payment Inprogress
          </>
        ) : (
          "Proceed to Pay"
        )}
      </Button>
    );
  }

  function renderSummary() {
    const { name, fare } = selectedBus;

    return (
      <Card style={{ width: "18rem" }}>
        <Card.Body>
          <Card.Title>{name}</Card.Title>
          <Card.Text>Selected Seats: {selectedSeats.length}</Card.Text>
          <Card.Text>Total fare: {selectedSeats.length * fare}</Card.Text>
          {/* <Button variant="info">Proceed to Pay</Button> */}
          {getButtonElement()}
        </Card.Body>
      </Card>
    );
  }

  return (
    <>
      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Summary</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>{renderSummary()}</Offcanvas.Body>
      </Offcanvas>
      <ToastContainer autoClose={2000} />
    </>
  );
}

export default Summary;
