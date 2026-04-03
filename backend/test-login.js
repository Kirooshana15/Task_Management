const axios = require("axios");

async function test() {
  try {
    const res = await axios.post("http://localhost:5000/api/v1/auth/login", {
      email: "alex@serviceflow.com",
      password: "Coord@123"
    });
    console.log("Success:", res.data);
  } catch (err) {
    if (err.response) {
      console.log("Error status:", err.response.status);
      console.log("Error data:", err.response.data);
    } else {
      console.log("Other error:", err.message);
    }
  }
}

test();
