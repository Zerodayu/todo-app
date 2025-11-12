import { getTodos } from "@/server/get-todos";
import {
  IsLoggedIn,
  IsLoggedOut,
} from "./useSession"
import { TodoItem } from "./todo-item";
import AddTodoBtn from "./add-todo";

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
        <div className="flex flex-col w-full justify-center items-center gap-4">
          {todos?.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
          <AddTodoBtn />
        </div>
      </IsLoggedIn>
    </section>
  )
}
