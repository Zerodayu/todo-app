import { getTodos } from "@/server/get-todos";
import {
  IsLoggedIn,
  IsLoggedOut,
} from "./useSession"
import { TodoItem } from "./todo-item";

export default async function ShowTodos() {
  const todos = await getTodos();

  return (
    <section className="flex w-xl flex-col gap-4">
      <IsLoggedOut>
        <p className="text-center text-muted-foreground">
          Please login to see your todos.
        </p>
      </IsLoggedOut>
      <IsLoggedIn>
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </IsLoggedIn>
    </section>
  )
}
