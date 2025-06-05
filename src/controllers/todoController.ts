import { Request, Response } from 'express';
import todoService from '../services/todoService';
import { CreateTodoRequest, UpdateTodoRequest, TodoStatus } from '../types/todo';

export class TodoController {
  // GET /api/todos - Get all todos with optional status filter
  async getAllTodos(req: Request, res: Response): Promise<void> {
    try {
      const status = req.query.status as TodoStatus;
      const todos = await todoService.getAllTodos(status);
      
      res.status(200).json({
        success: true,
        data: todos,
        count: todos.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch todos',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // GET /api/todos/:id - Get todo by ID
  async getTodoById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Todo ID is required'
        });
        return;
      }

      const todo = await todoService.getTodoById(id);

      if (!todo) {
        res.status(404).json({
          success: false,
          message: 'Todo not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: todo
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch todo',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // POST /api/todos - Create a new todo
  async createTodo(req: Request, res: Response): Promise<void> {
    try {
      const todoData: CreateTodoRequest = req.body;

      // Basic validation
      if (!todoData.title || todoData.title.trim().length === 0) {
        res.status(400).json({
          success: false,
          message: 'Title is required'
        });
        return;
      }

      const newTodo = await todoService.createTodo({
        title: todoData.title.trim(),
        description: todoData.description?.trim()
      });

      res.status(201).json({
        success: true,
        data: newTodo,
        message: 'Todo created successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create todo',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // PUT /api/todos/:id - Update todo
  async updateTodo(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData: UpdateTodoRequest = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Todo ID is required'
        });
        return;
      }

      // Basic validation
      if (updateData.title !== undefined && updateData.title.trim().length === 0) {
        res.status(400).json({
          success: false,
          message: 'Title cannot be empty'
        });
        return;
      }

      const updatedTodo = await todoService.updateTodo(id, {
        ...updateData,
        title: updateData.title?.trim(),
        description: updateData.description?.trim()
      });

      if (!updatedTodo) {
        res.status(404).json({
          success: false,
          message: 'Todo not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: updatedTodo,
        message: 'Todo updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update todo',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // DELETE /api/todos/:id - Delete todo
  async deleteTodo(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Todo ID is required'
        });
        return;
      }

      const deleted = await todoService.deleteTodo(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Todo not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Todo deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete todo',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // PATCH /api/todos/:id/toggle - Toggle todo completion status
  async toggleTodo(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Todo ID is required'
        });
        return;
      }

      const updatedTodo = await todoService.toggleTodo(id);

      if (!updatedTodo) {
        res.status(404).json({
          success: false,
          message: 'Todo not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: updatedTodo,
        message: `Todo marked as ${updatedTodo.completed ? 'completed' : 'pending'}`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to toggle todo',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // GET /api/todos/stats - Get todo statistics
  async getTodoStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await todoService.getTodosCount();
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch todo statistics',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // GET /api/todos/paginated - Get paginated todos
  async getPaginatedTodos(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as TodoStatus;

      // Validate pagination parameters
      if (page < 1 || limit < 1 || limit > 100) {
        res.status(400).json({
          success: false,
          message: 'Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 100'
        });
        return;
      }

      const result = await todoService.getTodosPaginated(page, limit, status);
      
      res.status(200).json({
        success: true,
        data: result.todos,
        pagination: {
          page: result.page,
          limit,
          total: result.total,
          totalPages: result.totalPages,
          hasNext: result.page < result.totalPages,
          hasPrev: result.page > 1
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch paginated todos',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export default new TodoController(); 