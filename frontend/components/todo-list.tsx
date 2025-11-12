import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { getTodos } from "@/api/get-todos-api";
import {
  IsLoggedIn,
  IsLoggedOut,
} from "./useSession"

const todoList = [
  { id: 1, title: "First Todo", isDone: true },
  { id: 2, title: "Second Todo", isDone: false },
]

export default async function ShowTodos() {
  const todos = await getTodos();
  console.log('Todos in page:', todos);

  return (
    <section className="flex w-xl flex-col gap-4">
      <IsLoggedOut>
        <p className="text-center text-muted-foreground">
          Please login to see your todos.
        </p>
      </IsLoggedOut>
      <IsLoggedIn>
        {todos.map((todo) => (
          <div key={todo.id} className="flex items-center justify-between p-4 border rounded-lg">
            <span className="flex flex-col">
              <Badge {...(todo.is_done ? {} : { variant: "outline" })}>
                {todo.is_done ? "Done" : "Pending"}
              </Badge>
              <p>{todo.title}</p>
            </span>
            <Button>{todo.is_done ? "Mark as Undone" : "Mark as Done"}</Button>
          </div>
        ))}
      </IsLoggedIn>
    </section>
  )
}
