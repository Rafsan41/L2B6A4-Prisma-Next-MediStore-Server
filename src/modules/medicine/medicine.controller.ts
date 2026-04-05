import { Request, Response } from "express";
import { medicineService } from "./medicine.service";



const createMedicine = async (req: Request, res: Response) => {
    try {
        const result = await medicineService.createMedicine(req.body);
        res.status(200).json({
            success: true,
            message: "Medicine created successfully",
            data: result
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Failed to create medicine",
            error: error
        })
    }
}




export const medicineController = {
    createMedicine,



}