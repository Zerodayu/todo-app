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
import React, { useState } from 'react'

export default function AddTodoBtn() {
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddTodo = async () => {
    if (!title.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      await addTodo(title);
      setTitle("");
      setOpen(false);
    } catch (error) {
      console.error("Failed to add todo:", error);
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
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddTodo();
                  }
                }}
              />
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
