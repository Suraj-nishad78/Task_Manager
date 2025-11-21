import express from "express";
import  * as task from "./task.controller.js";
import auth from "../../middileware/authMiddleware.js";

const router = express.Router();

router.post("/createTask", auth,  task.createTask);
router.get("/getAllTask", auth,  task.getTasks);
router.patch("/updateTask", auth, task.updateTask);
router.delete("/deleteTask", auth, task.deleteTask);

router.get("/getAuditTask", auth, task.getAllTaskAudit);

export default router;
