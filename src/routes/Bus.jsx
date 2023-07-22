import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import BusSearch from "../components/BusSearch";
import BusList from "../components/BusList";

function Bus() {
  const [buses, setBuses] = useState([]);

  return (
    <div className="w-75">
      <Card>
        <Card.Body>
          <BusSearch handleBuses={(value) => setBuses(value)} />
          <BusList buses={buses} />
        </Card.Body>
      </Card>
    </div>
  );
}

export default Bus;
