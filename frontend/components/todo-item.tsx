'use client';

import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { updateTodo } from "@/server/update-todo";
import { deleteTodo } from "@/server/del-todo";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Todo {
  id: number;
  user_id: number;
  title: string;
  is_done: boolean;
  created_at: string;
}

export function TodoItem({ todo }: { todo: Todo }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      await updateTodo(todo.id, !todo.is_done);
      router.refresh();
    } catch (error) {
      console.error("Failed to update todo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteTodo(todo.id);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete todo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <span className="flex flex-col">
        <Badge {...(todo.is_done ? {} : { variant: "outline" })}>
          {todo.is_done ? "Done" : "Pending"}
        </Badge>
        <p>{todo.title}</p>
      </span>
      <span className="flex gap-2">
        <Button onClick={handleToggle} disabled={isLoading}>
          {todo.is_done ? "Mark as Undone" : "Mark as Done"}
        </Button>
        <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
          Delete
        </Button>
      </span>
    </div>
  );
}