import { app } from "./app";
import { env } from "./config/env";
import { connectDB } from "./db/pool";

const start = async () => {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log(`API listening on port ${env.PORT}`);
  });
};

start().catch((err) => {
  console.error("Failed to start API", err);
  process.exit(1);
});
