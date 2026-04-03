/**
 * Seed Script — runs automatically on first server startup.
 * Inserts the 4 fixed users (Admin, Coordinator, 2 Developers) if they don't exist.
 * These users cannot be created/modified via API — they are initialization data only.
 */

const User = require("../models/User");

const SEED_USERS = [
  {
    name: "Sarah Chen",
    email: "sarah@gmail.com",
    password: "Admin@123",
    role: "admin",
    avatar: "SC",
  },
  {
    name: "Alex Rivera",
    email: "alex@gmail.com",
    password: "Coord@123",
    role: "coordinator",
    avatar: "AR",
  },
  {
    name: "Jordan Park",
    email: "jordan@gmail.com",
    password: "Dev@123",
    role: "developer",
    avatar: "JP",
  },
  {
    name: "Maya Singh",
    email: "maya@gmail.com",
    password: "Dev@123",
    role: "developer",
    avatar: "MS",
  },
  {
    name: "Aisha Khan",
    email: "aisha@gmail.com",
    password: "Dev@123",
    role: "developer",
    avatar: "AK",
  },
  {
    name: "Daniel Smith",
    email: "daniel@gmail.com",
    password: "Coord@123",
    role: "coordinator",
    avatar: "DS",
  },
  {
    name: "Michael Chen",
    email: "michael@gmail.com",
    password: "Dev@123",
    role: "developer",
    avatar: "MC",
  },
];

const seedUsers = async () => {
  try {
    const existingCount = await User.countDocuments();

    // If we have exactly 7 people, no need to seed!
    if (existingCount === SEED_USERS.length) {
      console.log(`Seed skipped — Found all ${SEED_USERS.length} personnel already.`);
      return;
    }

    // If it's anything else, clear the table and start over for a exact match.
    // This is safer during development when we are changing roster lists!
    await User.deleteMany({});

    // Use .create() so that the User model's pre("save") hook hashes the password!
    await User.create(SEED_USERS);

    console.log(`Seeded ${SEED_USERS.length} users successfully with correct password hashing.`);
    console.log("    Credentials (Domain: @gmail.com):");
    console.log("       sarah    → Admin@123  (admin)");
    console.log("       alex     → Coord@123  (coordinator)");
    console.log("       daniel   → Coord@123  (coordinator)");
    console.log("       jordan   → Dev@123    (developer)");
    console.log("       maya     → Dev@123    (developer)");
    console.log("       aisha    → Dev@123    (developer)");
    console.log("       michael  → Dev@123    (developer)");
  } catch (error) {
    console.error("Seed error:", error.message);
  }
};

module.exports = seedUsers;
