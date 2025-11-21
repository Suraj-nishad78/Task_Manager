import express from "express";
import  * as task from "./task.controller.js";
import auth from "../../middileware/authMiddleware.js";

const router = express.Router();

router.post("/createTask",  task.createTask);
router.get("/getAllTask",  task.getTasks);
router.patch("/updateTask", task.updateTask);
router.delete("/deleteTask", task.deleteTask);

router.get("/getAuditTask", task.getAllTaskAudit);

export default router;
