import express, { Application } from "express";
import { medicineRouter } from "./modules/medicine/medicine.router";
import { categoryRouter } from "./modules/category/category.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

const app: Application = express();

app.use(express.json());
app.all('/api/auth/*splat', toNodeHandler(auth));

app.get("/", (req, res) => {
    res.send("MediStore Server is running");
})
app.use("/api", categoryRouter);

app.use("/api", medicineRouter);


export default app;