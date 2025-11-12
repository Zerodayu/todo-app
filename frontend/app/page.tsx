import Navbar from "@/components/navbar";
import ShowTodos from "@/components/todo-list";

export default function Home() {
  return (
    <section>
        <Navbar />
      <div className="flex w-full h-screen flex-col items-center p-6 md:p-10">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold">Welcome to the Todo App</h1>
          <p className="text-lg text-gray-600">
            Manage your tasks efficiently and stay organized.
          </p>
        </div>
          <ShowTodos />
      </div>
    </section>
  );
}
