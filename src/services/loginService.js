export const register = (params) => {
  return new Promise((resolve, reject) => {
    fetch("/register", {
      method: "POST",
      body: JSON.stringify(params),
      headers: { "Content-type": "application/json;charset=UTF-8" },
    }).then((response) => {
      if (response.status === 200) resolve(response.json());
      else reject("Error while registering user");
    });
  });
};

export const login = (params) => {
  return new Promise((resolve) => {
    fetch("/login", {
      method: "POST",
      body: JSON.stringify(params),
      headers: { "Content-type": "application/json;charset=UTF-8" },
    }).then((response) => {
      if (response.status === 200) resolve(response.json());
      else resolve(response.json());
    });
  });
};
