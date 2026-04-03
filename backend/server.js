const app = require("./src/app");
const connectDB = require("./src/config/db");
const seedUsers = require("./src/seeders/seed");
const { PORT } = require("./src/config/env");

const startServer = async () => {
  await connectDB();
  await seedUsers();

  app.listen(PORT, () => {
    console.log("");
    console.log("╔══════════════════════════════════════════════╗");
    console.log("║        ServiceFlow API Server Started        ║");
    console.log("╠══════════════════════════════════════════════╣");
    console.log(`║  🚀  http://localhost:${PORT}                   ║`);
    console.log(`║  📦  Environment: ${process.env.NODE_ENV}           ║`);
    console.log("║  📋  API Base:   /api/v1                     ║");
    console.log("╚══════════════════════════════════════════════╝");
    console.log("");
  });
};

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.message);
  process.exit(1);
});

startServer();
