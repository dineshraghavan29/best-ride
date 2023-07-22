import React, { useState, useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Stack from "react-bootstrap/Stack";
import { Card } from "react-bootstrap";
import Summary from "./Summary";

function BusList(props) {
  const { buses } = props;
  const [busList, setBusList] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    setBusList(buses);
  }, [buses]);

  useEffect(() => {
    setSelectedSeats([]);
  }, [selectedBus]);

  function constructSeatMap(rec) {
    const seats = rec.available.length + rec.booked.length;
    const columns = seats % 4 === 0 ? seats / 4 : Math.floor(seats / 4) + 1;

    const columnsList = [];
    let seatNo = 1;

    for (let i = 0; i < columns; i++) {
      let column = [];

      for (let i = 0; i < 4; i++) {
        if (seatNo <= seats) {
          column.push(seatNo);
          seatNo++;
        }
      }
      columnsList.push(column);
    }

    return columnsList;
  }

  function toggleSeatSelection(seat) {
    if (selectedSeats.indexOf(seat) === -1)
      setSelectedSeats([...selectedSeats, seat]);
    else setSelectedSeats(selectedSeats.filter((rec) => rec !== seat));
  }

  function renderSeat(col, rec) {
    return (
      <>
        {col.map((seat, seatIdx) => {
          const isBooked = rec.booked.indexOf(seat) >= 0;
          const isSelected = selectedSeats.indexOf(seat) >= 0;
          const variant = isBooked
            ? "secondary"
            : isSelected
            ? "primary"
            : "outline-primary";

          return (
            <Button
              key={seatIdx}
              variant={variant}
              onClick={() => toggleSeatSelection(seat)}
              disabled={isBooked}
            >
              {seat}
            </Button>
          );
        })}
      </>
    );
  }

  function renderSeats(rec) {
    const cols = constructSeatMap(rec);

    return (
      <Card>
        <Card.Body>
          <Container>
            <Row>
              <Col>
                <Button disabled>Driver</Button>
              </Col>
              {cols.map((col, i) => {
                return (
                  <Col key={i}>
                    <Stack gap={3}>{renderSeat(col, rec)}</Stack>
                  </Col>
                );
              })}
            </Row>
          </Container>
        </Card.Body>
      </Card>
    );
  }

  function renderBus(rec, i) {
    return (
      <Accordion.Item
        eventKey={i.toString()}
        key={i.toString()}
        onClick={() => setSelectedBus(rec)}
      >
        <Accordion.Header>
          {`${rec.name} - Available Seats ${rec.seats.available.length}`}
        </Accordion.Header>
        <Accordion.Body>
          {renderSeats(rec.seats)}
          {selectedBus?.id === rec.id && selectedSeats.length ? (
            <Button
              style={{ marginTop: 10 }}
              variant="danger"
              onClick={handleShow}
            >
              Book Now
            </Button>
          ) : (
            ""
          )}
        </Accordion.Body>
      </Accordion.Item>
    );
  }

  return (
    <div>
      <Accordion>
        {busList.map((rec, i) => {
          if (rec.seats.available.length) return renderBus(rec, i);
          return null;
        })}
      </Accordion>
      {selectedSeats.length > 0 && (
        <Summary
          show={show}
          selectedBus={selectedBus}
          selectedSeats={selectedSeats}
          handleClose={handleClose}
        />
      )}
    </div>
  );
}

export default BusList;
