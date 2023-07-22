import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Util from "../utils/Util";
import { busList } from "../mocks/busMock";

function Menu() {
  const user = Util.getUserInfo();
  let navigate = useNavigate();

  useEffect(() => validateUserLogin(), []);

  const validateUserLogin = () => {
    let user = sessionStorage.getItem("user");

    if (user) {
      Util.setUserInfo(JSON.parse(user));
      navigate("/bus");
    } else login();
  };

  const login = () => navigate("/login");

  const logout = () => {
    Util.setUserInfo({});
    sessionStorage.removeItem("user");
    login();
  };

  const reset = () => {
    //Reset user booking history
    let users = localStorage.getItem("users");
    if (users) {
      users = JSON.parse(users);
      users.forEach((rec) => (rec.bus = []));
      localStorage.setItem("users", JSON.stringify(users));
    }

    //Reset bus data
    localStorage.setItem("buses", JSON.stringify(busList));
    logout();
  };

  return (
    <>
      <Navbar className="navBar" fixed="top">
        <Container>
          <Navbar.Brand
            onClick={validateUserLogin}
            style={{ cursor: "pointer" }}
          >
            <h1>Best Ride</h1>
          </Navbar.Brand>
          <Navbar.Toggle />
          {user?.name && (
            <Navbar.Collapse className="justify-content-end">
              <NavDropdown title={user?.name} id="basic-nav-dropdown">
                <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={reset}>Reset App</NavDropdown.Item>
              </NavDropdown>
            </Navbar.Collapse>
          )}
        </Container>
      </Navbar>
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}

export default Menu;
