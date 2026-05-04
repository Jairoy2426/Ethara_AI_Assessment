import { app } from "../src/app";
import { connectDB } from "../src/db/pool";

// Ensure database is connected before handling requests
let isDbConnected = false;

export default async function handler(req: any, res: any) {
  if (!isDbConnected) {
    await connectDB();
    isDbConnected = true;
  }
  
  // Vercel serverless functions work by wrapping the express app
  return app(req, res);
}
