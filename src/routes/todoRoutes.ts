import { Router } from 'express';
import todoController from '../controllers/todoController';

const router = Router();

router.get('/test', (req, res) => {
  res.send('testing github actions');
});

// GET /api/todos/stats - Must be before /:id route to avoid conflicts
router.get('/stats', todoController.getTodoStats.bind(todoController));

// GET /api/todos/paginated - Get paginated todos
router.get('/paginated', todoController.getPaginatedTodos.bind(todoController));

// GET /api/todos - Get all todos with optional status filter
router.get('/', todoController.getAllTodos.bind(todoController));

// GET /api/todos/:id - Get todo by ID
router.get('/:id', todoController.getTodoById.bind(todoController));

// POST /api/todos - Create a new todo
router.post('/', todoController.createTodo.bind(todoController));

// PUT /api/todos/:id - Update todo
router.put('/:id', todoController.updateTodo.bind(todoController));

// PATCH /api/todos/:id/toggle - Toggle todo completion status
router.patch('/:id/toggle', todoController.toggleTodo.bind(todoController));

// DELETE /api/todos/:id - Delete todo
router.delete('/:id', todoController.deleteTodo.bind(todoController));

export default router; 