import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.route.js";
import dotenv from "dotenv";
import { dbConnection } from "./config/dbConnect.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRoutes);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    dbConnection();
});
export default app;
