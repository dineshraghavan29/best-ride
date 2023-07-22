import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Menu from "./components/Menu";
import ErrorPage from "./routes/ErrorPage";
import Login from "./routes/Login";
import Registration from "./routes/Registration";
import Bus from "./routes/Bus";
import { getBusDetail } from "./services/busService";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Menu />,
    errorElement: <ErrorPage />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Registration /> },
      { path: "bus", element: <Bus /> },
    ],
  },
]);

function App() {
  //Initialize bus detail
  useEffect(() => {
    getBusDetail().then(() => console.log("Bus detail loaded successfully"));
  }, []);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
