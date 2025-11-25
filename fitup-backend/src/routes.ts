import { Router } from "express";
import { AuthController } from "./controllers/AuthController";
import { PlanController } from "./controllers/PlanController";
import { EnrollmentController } from "./controllers/EnrollmentController";
import { WorkoutController } from "./controllers/WorkoutController";
import { CheckInController } from "./controllers/CheckInController";
import { authMiddleware, roleMiddleware } from "./middlewares/authMiddleware";

const router = Router();

const authController = new AuthController();
const planController = new PlanController();
const enrollmentController = new EnrollmentController();
const workoutController = new WorkoutController();
const checkInController = new CheckInController();

/**
 * @swagger
 * tags:
 * - name: Auth
 * description: Rotas de Autenticação
 * - name: Users
 * description: Rotas de Usuários
 * - name: Plans
 * description: Gerenciamento de Planos (Admin)
 * - name: Enrollments
 * description: Gerenciamento de Matrículas
 * - name: Workouts
 * description: Gerenciamento de Treinos
 * - name: CheckIns
 * description: Check-ins e Histórico
 */

// --- Rotas Públicas ---

/**
 * @swagger
 * /auth/register:
 *  post:
 *      summary: Registra um novo usuário
 *      tags: [Auth]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *              schema:
 *              type: object
 *              required:
 *              name
 *              email
 *              password
 *              properties:
 *              name:
 *                  type: string
 *              email:
 *                  type: string
 *              format: email
 *                  password:
 *                      type: string
 *                      minLength: 6
 *              role:
 *                  type: string
 *              enum: [ADMIN, INSTRUCTOR, STUDENT]
 *                  default: STUDENT
 *         responses:
 *          '201':
 *              description: Usuário criado com sucesso.
 *          '409':
 *              description: Email já está em uso.
 */
router.post("/auth/register", authController.register);

/**
 * @swagger
 * /auth/login:
 *  post:
 *      summary: Autentica um usuário e retorna o token JWT
 *      tags: [Auth]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          email
 *                          password
 *                      properties:
 *                          email:
 *                              type: string
 *                          password:
 *                              type: string
 *      responses:
 *          '200':
 *              description: Login realizado com sucesso.
 *              content:
 *               application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          token:
 *                              type: string
 *                          user:
 *                              type: object
 *                      properties:
 *                              id:
 *                                  type: string
 *                              name:
 *                                  type: string
 *                              email:
 *                                  type: string
 *                              role:
 *                                  type: string
 *          '401':
 *              description: Credenciais inválidas.
 */
router.post("/auth/login", authController.login);

// --- Rotas Privadas (Todas abaixo exigem login) ---
router.use(authMiddleware);

/**
 * @swagger
 * /me:
 *  get:
 *      summary: Retorna os dados do usuário logado
 *      tags: [Users]
 *      security:
 *         bearerAuth: []
 *      responses:
 *          '200':
 *              description: Dados do perfil.
 */
router.get("/me", async (req, res) => {
  return res.json({ user: req.user });
});

// --- Planos ---

/**
 * @swagger
 * /plans:
 *  post:
 *      summary: Cria um novo plano (Apenas ADMIN)
 *      tags: [Plans]
 *      security:
 *          bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          name
 *                          price
 *                          duration
 *                      properties:
 *                          name:
 *                              type: string
 *                          price:
 *                              type: number
 *                          duration:
 *                              type: integer
 *                      description: Duração em meses
 *      responses:
 *          '201':
 *              description: Plano criado com sucesso.
 *          '403':
 *              description: Acesso negado.
 *  get:
 *      summary: Lista todos os planos disponíveis
 *      tags: [Plans]
 *      security:
 *         bearerAuth: []
 *      responses:
 *          '200':
 *              description: Lista de planos.
 */
router.post("/plans", roleMiddleware(["ADMIN"]), planController.create);
router.get("/plans", planController.list);

// --- Matrículas ---

/**
 * @swagger
 * /enrollments:
 *  post:
 * summary: Matricula um aluno em um plano (Apenas ADMIN)
 * tags: [Enrollments]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - userId
 * - planId
 * properties:
 * userId:
 * type: string
 * format: uuid
 * planId:
 * type: string
 * format: uuid
 * responses:
 * '201':
 * description: Matrícula realizada com sucesso.
 * '404':
 * description: Plano não encontrado.
 */
router.post("/enrollments", roleMiddleware(["ADMIN"]), enrollmentController.create);

// --- Treinos ---

/**
 * @swagger
 * /workouts:
 * post:
 * summary: Cria uma ficha de treino para um aluno (Instrutor ou Admin)
 * tags: [Workouts]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - name
 * - studentId
 * - exercises
 * properties:
 * name:
 * type: string
 * example: "Treino A - Peito e Tríceps"
 * description:
 * type: string
 * studentId:
 * type: string
 * format: uuid
 * exercises:
 * type: array
 * items:
 * type: object
 * properties:
 * name:
 * type: string
 * sets:
 * type: integer
 * reps:
 * type: integer
 * notes:
 * type: string
 * responses:
 * '201':
 * description: Treino criado com sucesso.
 */
router.post("/workouts", roleMiddleware(["INSTRUCTOR", "ADMIN"]), workoutController.create);

/**
 * @swagger
 * /workouts/my:
 * get:
 * summary: Lista os treinos do aluno logado
 * tags: [Workouts]
 * security:
 * - bearerAuth: []
 * responses:
 * '200':
 * description: Lista de treinos do aluno.
 */
router.get("/workouts/my", workoutController.listMyWorkouts);

// --- Check-ins ---

/**
 * @swagger
 * /check-ins:
 * post:
 * summary: Realiza o check-in na academia (Apenas Aluno)
 * tags: [CheckIns]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - workoutId
 * properties:
 * workoutId:
 * type: string
 * */
export { router };