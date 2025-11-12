"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { addTodo } from "@/server/add-todo"
import { useState } from 'react'
import { z } from 'zod';

export default function AddTodoBtn() {
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleAddTodo = async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      await addTodo(title);
      setTitle("");
      setOpen(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.issues[0]?.message || "Validation failed");
      } else {
        setError("Failed to add todo");
        console.error("Failed to add todo:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="outline">Add Todo</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add Todo Item</AlertDialogTitle>
            <AlertDialogDescription>
              Enter the details for your new todo item below.
              <Input
                type="text"
                placeholder="Todo title"
                className="mt-4 w-full"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddTodo();
                  }
                }}
              />
              {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAddTodo} disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Todo"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
