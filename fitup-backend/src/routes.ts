import { Router } from "express";
import { UserController } from "./controllers/UserController";
import { PlanController } from "./controllers/PlanController";
import { EnrollmentController } from "./controllers/EnrollmentController";
import { WorkoutController } from "./controllers/WorkoutController";
import { CheckInController } from "./controllers/CheckInController";

const router = Router();

const userController = new UserController();
const planController = new PlanController();
const enrollmentController = new EnrollmentController();
const workoutController = new WorkoutController();
const checkInController = new CheckInController();

// === USUÁRIOS ===
router.post("/users", userController.create);
router.get("/users", userController.list);
router.get("/users/:id", userController.show);     // NOVO: Ver um user
router.put("/users/:id", userController.update);   // NOVO: Editar
router.delete("/users/:id", userController.delete); // NOVO: Deletar

// === PLANOS ===
router.post("/plans", planController.create);
router.get("/plans", planController.list);
router.put("/plans/:id", planController.update);    // NOVO
router.delete("/plans/:id", planController.delete); // NOVO

// === MATRÍCULAS ===
router.post("/enrollments", enrollmentController.create);
// Idealmente teria um PUT /enrollments/:id para cancelar/trancar

// === TREINOS ===
router.post("/workouts", workoutController.create);
router.get("/workouts/student/:studentId", workoutController.listByStudent);
router.delete("/workouts/:id", workoutController.delete); // NOVO

// === CHECK-INS ===
router.post("/check-ins", checkInController.create);
router.get("/check-ins/history/:userId", checkInController.history);

export { router };