export const getBusDetail = () => {
  return new Promise((resolve, reject) => {
    fetch("/getBusDetail", {
      method: "GET",
      headers: { "Content-type": "application/json;charset=UTF-8" },
    }).then((res) => {
      if (res.status === 200) resolve(res.json());
      else reject("Error while creating bus details");
    });
  });
};

export const bookTickets = (params) => {
  return new Promise((resolve) => {
    fetch("/bookTickets", {
      method: "POST",
      body: JSON.stringify(params),
      headers: { "Content-type": "application/json;charset=UTF-8" },
    }).then((res) => {
      if (res.status === 200) resolve(res.json());
      else resolve(res.json());
    });
  });
};
