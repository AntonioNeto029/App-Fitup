import { Router } from "express";
import { AuthController } from "./controllers/AuthController";
import { PlanController } from "./controllers/PlanController";
import { EnrollmentController } from "./controllers/EnrollmentController";
import { WorkoutController } from "./controllers/WorkoutController";
import { CheckInController } from "./controllers/CheckInController";
import { authMiddleware, roleMiddleware } from "./middlewares/authMiddleware";
import { UserController } from "./controllers/UserController";

const router = Router();

const authController = new AuthController();
const planController = new PlanController();
const enrollmentController = new EnrollmentController();
const workoutController = new WorkoutController();
const checkInController = new CheckInController();
const userController = new UserController();

router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.use(authMiddleware);

router.get("/me", async (req, res) => {
  return res.json({ user: req.user });
});

router.post("/plans", roleMiddleware(["ADMIN"]), planController.create);
router.get("/plans", planController.list);

router.post(
  "/enrollments",
  roleMiddleware(["ADMIN"]),
  enrollmentController.create
);

router.post(
  "/workouts",
  roleMiddleware(["INSTRUCTOR", "ADMIN"]),
  workoutController.create
);
router.get("/workouts/my", workoutController.listMyWorkouts);

router.post(
  "/check-ins",
  roleMiddleware(["STUDENT"]),
  checkInController.create
);
router.get(
  "/check-ins/history",
  roleMiddleware(["STUDENT"]),
  checkInController.history
);

router.get(
  "/users",
  roleMiddleware(["ADMIN", "INSTRUCTOR"]),
  userController.list
);

export { router };
