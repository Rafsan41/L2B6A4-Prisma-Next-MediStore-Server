
import expess, { Router } from "express";
import { medicineController } from "./medicine.controller";

const router = expess.Router();

router.post(
    "/medicines", medicineController.createMedicine
)


router.get("/medicines", (req, res) => {
    res.send("Get all medicines with filters");
})

router.get("/medicines/:id", (req, res) => {
    res.send("Get medicine details");
})

router.get("/categories", (req, res) => {
    res.send("Get all categories");
})

export const medicineRouter: Router = router;