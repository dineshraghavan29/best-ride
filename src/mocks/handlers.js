import { rest } from "msw";
import { busList } from "./busMock";

export const handlers = [
  rest.post("/register", async (req, res, ctx) => {
    const user = await req.json();
    user.id = Math.random().toString();
    user.bus = [];

    //Persist user in localstorage
    const users = localStorage.getItem("users");
    if (users) {
      const userList = JSON.parse(users);
      userList.push(user);
      localStorage.setItem("users", JSON.stringify(userList));
    } else localStorage.setItem("users", JSON.stringify([user]));

    return res(
      ctx.delay(1000),
      ctx.status(200),
      ctx.json({ message: "User registered successfully" })
    );
  }),

  rest.post("/login", async (req, res, ctx) => {
    const { email, password } = await req.json();
    let user = null;

    const users = localStorage.getItem("users");
    if (users) {
      const userList = JSON.parse(users);
      user = userList.find(
        (rec) => rec.email === email && rec.password === password
      );
    }

    if (user) delete user.password;

    let status = user ? 200 : 404;
    let response = user ? user : { error: { message: "User not found" } };
    return res(ctx.delay(1000), ctx.status(status), ctx.json(response));
  }),

  rest.get("/getBusDetail", (req, res, ctx) => {
    let buses = localStorage.getItem("buses");
    if (buses) buses = JSON.parse(buses);
    else {
      localStorage.setItem("buses", JSON.stringify(busList));
      buses = busList;
    }

    let status = buses ? 200 : 404;
    let response = buses ? buses : { error: { message: "Buses not found" } };
    return res(ctx.delay(1000), ctx.status(status), ctx.json(response));
  }),

  rest.post("/bookTickets", async (req, res, ctx) => {
    const { user, bus, seats } = await req.json();
    let isUserUpdated = false;
    let isBusUpdated = false;

    //Update user
    const users = localStorage.getItem("users");
    if (users) {
      let userList = JSON.parse(users);

      const userInfo = userList.find((rec) => rec.id === user?.id);
      if (userInfo) {
        const data = {
          busId: bus.id,
          seats: { booked: [...seats], cancelled: [] },
        };
        userInfo["bus"].push(data);
        localStorage.setItem("users", JSON.stringify(userList));
        isUserUpdated = true;
      }
    }

    // Update Bus seats
    const buses = localStorage.getItem("buses");
    if (isUserUpdated && buses) {
      let busList = JSON.parse(buses);

      const busInfo = busList.find((rec) => rec.id === bus?.id);
      if (busInfo) {
        busInfo.seats.available = busInfo.seats.available.filter(
          (rec) => seats.indexOf(rec) === -1
        );
        busInfo.seats.booked.push(...seats);

        // console.log(busInfo);
        localStorage.setItem("buses", JSON.stringify(busList));
        isBusUpdated = true;
      }
    }

    let status = isUserUpdated && isBusUpdated ? 200 : 500;
    let response =
      status === 200
        ? { success: { message: "Tickets booked successfully" } }
        : { error: { message: "Bus not found" } };

    return res(ctx.delay(1000), ctx.status(status), ctx.json(response));
  }),
];
