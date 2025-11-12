import { Button } from "./ui/button"
import { Badge } from "./ui/badge"

const todos = [
  { id: 1, title: "First Todo", isDone: true },
  { id: 2, title: "Second Todo", isDone: false },
]

export default function ShowTodos() {
  return (
    <section className="flex w-xl flex-col gap-4">
      {todos.map((todo) => (
        <div key={todo.id} className="flex items-center justify-between p-4 border rounded-lg">
          <span className="flex flex-col">
            <Badge {...(todo.isDone ? {} : { variant: "outline" })}>
              {todo.isDone ? "Done" : "Pending"}
            </Badge>
            <p>{todo.title}</p>
          </span>
          <Button>{todo.isDone ? "Mark as Undone" : "Mark as Done"}</Button>
        </div>
      ))}
    </section>
  )
}
