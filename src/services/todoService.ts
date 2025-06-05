import Todo, { ITodo } from '../models/Todo';
import { CreateTodoRequest, UpdateTodoRequest, TodoStatus } from '../types/todo';
import mongoose from 'mongoose';

class TodoService {
  // Get all todos with optional filtering
  async getAllTodos(status?: TodoStatus): Promise<ITodo[]> {
    try {
      let filter = {};
      
      if (status === TodoStatus.COMPLETED) {
        filter = { completed: true };
      } else if (status === TodoStatus.PENDING) {
        filter = { completed: false };
      }
      
      const todos = await Todo.find(filter).sort({ createdAt: -1 });
      return todos;
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw new Error('Failed to fetch todos');
    }
  }

  // Get todo by ID
  async getTodoById(id: string): Promise<ITodo | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
      }
      
      const todo = await Todo.findById(id);
      return todo;
    } catch (error) {
      console.error('Error fetching todo by ID:', error);
      throw new Error('Failed to fetch todo');
    }
  }

  // Create a new todo
  async createTodo(todoData: CreateTodoRequest): Promise<ITodo> {
    try {
      const newTodo = new Todo({
        title: todoData.title,
        description: todoData.description,
        completed: false
      });

      const savedTodo = await newTodo.save();
      return savedTodo;
    } catch (error) {
      console.error('Error creating todo:', error);
      if (error instanceof mongoose.Error.ValidationError) {
        throw new Error(`Validation error: ${Object.values(error.errors).map(e => e.message).join(', ')}`);
      }
      throw new Error('Failed to create todo');
    }
  }

  // Update an existing todo
  async updateTodo(id: string, updateData: UpdateTodoRequest): Promise<ITodo | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
      }

      const updatedTodo = await Todo.findByIdAndUpdate(
        id,
        { 
          ...updateData,
          updatedAt: new Date()
        },
        { 
          new: true, // Return the updated document
          runValidators: true // Run schema validators
        }
      );

      return updatedTodo;
    } catch (error) {
      console.error('Error updating todo:', error);
      if (error instanceof mongoose.Error.ValidationError) {
        throw new Error(`Validation error: ${Object.values(error.errors).map(e => e.message).join(', ')}`);
      }
      throw new Error('Failed to update todo');
    }
  }

  // Delete a todo
  async deleteTodo(id: string): Promise<boolean> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return false;
      }

      const deletedTodo = await Todo.findByIdAndDelete(id);
      return deletedTodo !== null;
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw new Error('Failed to delete todo');
    }
  }

  // Toggle todo completion status
  async toggleTodo(id: string): Promise<ITodo | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
      }

      const todo = await Todo.findById(id);
      if (!todo) {
        return null;
      }

      todo.completed = !todo.completed;
      const updatedTodo = await todo.save();
      return updatedTodo;
    } catch (error) {
      console.error('Error toggling todo:', error);
      throw new Error('Failed to toggle todo');
    }
  }

  // Get todos count
  async getTodosCount(): Promise<{ total: number; completed: number; pending: number }> {
    try {
      const [total, completed] = await Promise.all([
        Todo.countDocuments(),
        Todo.countDocuments({ completed: true })
      ]);

      const pending = total - completed;

      return { total, completed, pending };
    } catch (error) {
      console.error('Error getting todos count:', error);
      throw new Error('Failed to get todos statistics');
    }
  }

  // Additional utility methods for MongoDB

  // Clear all todos (useful for testing)
  async clearAllTodos(): Promise<void> {
    try {
      await Todo.deleteMany({});
    } catch (error) {
      console.error('Error clearing todos:', error);
      throw new Error('Failed to clear todos');
    }
  }

  // Get todos with pagination
  async getTodosPaginated(
    page: number = 1, 
    limit: number = 10, 
    status?: TodoStatus
  ): Promise<{ todos: ITodo[]; total: number; page: number; totalPages: number }> {
    try {
      let filter = {};
      
      if (status === TodoStatus.COMPLETED) {
        filter = { completed: true };
      } else if (status === TodoStatus.PENDING) {
        filter = { completed: false };
      }

      const skip = (page - 1) * limit;
      
      const [todos, total] = await Promise.all([
        Todo.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Todo.countDocuments(filter)
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        todos,
        total,
        page,
        totalPages
      };
    } catch (error) {
      console.error('Error fetching paginated todos:', error);
      throw new Error('Failed to fetch paginated todos');
    }
  }
}

export default new TodoService(); 