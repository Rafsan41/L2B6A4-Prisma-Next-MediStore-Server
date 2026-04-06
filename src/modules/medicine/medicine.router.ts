
import express, { Router } from "express";
import { medicineController } from "./medicine.controller";

const router = express.Router();

router.post(
    "/medicines", medicineController.createMedicine
)


router.get("/medicines", (req, res) => {
    res.send("Get all medicines with filters");
})

router.get("/medicines/:id", (req, res) => {
    res.send("Get medicine details");
})


export const medicineRouter: Router = router;