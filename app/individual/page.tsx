"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UserDashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const router = useRouter();

  const handleSignOut = () => {
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("userRole"); 
    router.push("/");
  };

  const [form, setForm] = useState({
    title: "",
    priority: "Medium",
    category: "General",
    dueDate: "",
    description: "",
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("userTasks") || "[]");
    setTasks(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem("userTasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!form.title.trim()) return;

    setTasks([
      ...tasks,
      {
        ...form,
        completed: false,
        status: "Pending",
        file: "",
      },
    ]);

    setForm({
      title: "",
      priority: "Medium",
      category: "General",
      dueDate: "",
      description: "",
    });
  };

  const cards = [
    { label: "Total Tasks", value: tasks.length, color: "text-blue-600", bg: "bg-blue-50" },
    {
      label: "Completed",
      value: tasks.filter((t) => t.completed).length,
      color: "text-green-600", bg: "bg-green-50"
    },
    {
      label: "Pending",
      value: tasks.filter((t) => !t.completed).length,
      color: "text-amber-600", bg: "bg-amber-50"
    },
  ];

  return (
    <div className="flex h-screen bg-slate-800 text-gray-900 font-sans overflow-hidden relative z-0">
      {/* Geometric Layers */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 border-[40px] border-slate-700/50 rounded-2xl transform rotate-45 z-[-1] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[15%] w-[500px] h-[500px] border-[60px] border-slate-700/40 rounded-3xl transform rotate-45 z-[-1] pointer-events-none"></div>

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col p-6 shadow-sm z-10 shrink-0">
        <div className="mb-8 text-center">
          <h2 className="text-xl font-bold text-gray-800 tracking-wide">User Panel</h2>
          <p className="text-sm text-gray-500 mt-2">Track your tasks and progress</p>
        </div>
        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={`w-full px-4 py-3 font-bold rounded-lg transition-colors shadow-sm ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-indigo-700 hover:bg-slate-100 hover:text-indigo-800'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab("tasks")}
            className={`w-full px-4 py-3 font-bold rounded-lg transition-colors shadow-sm ${activeTab === 'tasks' ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-indigo-700 hover:bg-slate-100 hover:text-indigo-800'}`}
          >
            My Tasks
          </button>
        </nav>
        <div className="mt-auto pt-6 border-t border-gray-200">
          <button 
            onClick={handleSignOut}
            className="w-full px-4 py-3 bg-sky-500 text-white font-bold hover:bg-sky-600 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-10">
        
        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div className="max-w-5xl mx-auto h-full flex flex-col justify-center pb-20">
            <header className="bg-slate-900 p-8 rounded-2xl shadow-lg mb-12">
              <h1 className="text-4xl font-extrabold text-white mb-2">Personal Dashboard</h1>
              <p className="text-gray-500 text-lg">No tasks assigned right now</p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cards.map((card, i) => (
                <div
                  key={i}
                  className="bg-slate-900 border rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-slate-800 flex flex-col justify-between"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-slate-400 font-bold uppercase tracking-wider text-sm">{card.label}</h4>
                    <span className={`w-10 h-10 rounded-full flex items-center justify-center ${card.bg} ${card.color} text-lg ring-2 ring-slate-800 font-bold`}>#</span>
                  </div>
                  <h1 className="text-5xl font-black text-white">
                    {card.value}
                  </h1>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tasks */}
        {activeTab === "tasks" && (
          <div className="max-w-6xl mx-auto">
             <header className="bg-slate-900 p-8 rounded-2xl shadow-lg mb-8">
               <h1 className="text-3xl font-bold text-white mb-2">My Tasks</h1>
               <p className="text-gray-300 text-lg">Create, track, and manage your daily items.</p>
             </header>

            {/* Task Creation Form */}
            <div className="bg-sky-50 p-6 rounded-2xl border border-blue-200 hover:border-blue-400 shadow-[0_8px_30px_rgb(59,130,246,0.15)] hover:shadow-[0_8px_30px_rgb(59,130,246,0.3)] mb-8 transform hover:-translate-y-2 transition-all duration-300 flex flex-col">
              <div className="flex flex-wrap md:flex-nowrap gap-4 mb-4">
                <input
                  placeholder="What needs to be done?"
                  className="flex-1 border bg-slate-50 border-gray-300 text-gray-900 font-semibold placeholder-gray-500 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
                <select
                  className="w-full md:w-36 border bg-slate-50 border-gray-300 text-gray-900 font-semibold rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
                <select
                  className="w-full md:w-36 border bg-slate-50 border-gray-300 text-gray-900 font-semibold rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option>General</option>
                  <option>Work</option>
                  <option>Study</option>
                  <option>Personal</option>
                </select>
                <input
                  type="date"
                  className="w-full md:w-40 border bg-slate-50 border-gray-300 text-gray-900 font-semibold rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                />
                <button
                  onClick={addTask}
                  disabled={!form.title.trim()}
                  className="w-full md:w-32 bg-indigo-600 text-white font-bold px-4 py-3 rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                >
                  + Add Task
                </button>
              </div>
              <textarea
                placeholder="Details or description (optional)"
                rows={2}
                className="w-full border bg-slate-50 border-gray-300 text-gray-900 font-semibold placeholder-gray-500 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none text-sm"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            {/* Tasks List */}
            <div className="bg-sky-50 rounded-2xl border border-blue-200 hover:border-blue-400 shadow-[0_8px_30px_rgb(59,130,246,0.15)] hover:shadow-[0_8px_30px_rgb(59,130,246,0.3)] overflow-hidden transform hover:-translate-y-2 transition-all duration-300 flex flex-col">
               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="bg-gray-100 border-b border-gray-300 text-xs text-gray-800 font-extrabold uppercase tracking-widest shadow-sm">
                       <th className="py-4 px-6 w-16 text-center">Status</th>
                       <th className="py-4 px-6 min-w-[200px]">Task List</th>
                       <th className="py-4 px-6">Priority</th>
                       <th className="py-4 px-6">Category</th>
                       <th className="py-4 px-6">Progress</th>
                       <th className="py-4 px-6">Due Date</th>
                       <th className="py-4 px-6 w-40">Attachment</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-200">
                     {tasks.length === 0 && (
                       <tr>
                         <td colSpan={7} className="py-12 text-center text-gray-800 font-semibold text-lg">No tasks added yet. Start planning!</td>
                       </tr>
                     )}
                     {tasks.map((task, i) => (
                       <tr key={i} className={`transition-all duration-200 border-b border-gray-100 ${task.completed ? 'bg-green-50 text-gray-600' : 'bg-white hover:bg-indigo-50/60 hover:-translate-y-1 hover:shadow-sm'}`}>
                         <td className="py-4 px-6 text-center align-middle">
                           <input
                             type="checkbox"
                             className="w-5 h-5 cursor-pointer accent-green-600"
                             checked={task.completed}
                             onChange={() => {
                               const updated = [...tasks];
                               updated[i].completed = !updated[i].completed;
                               updated[i].status = updated[i].completed ? "Completed" : "Pending";
                               setTasks(updated);
                             }}
                           />
                         </td>
                         <td className="py-4 px-6 align-middle">
                           <p className={`font-bold ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>{task.title}</p>
                           {task.description && <p className="text-sm text-gray-600 mt-1 truncate max-w-[250px] font-medium">{task.description}</p>}
                         </td>
                         <td className="py-4 px-6 align-middle">
                            <span className={`px-2 py-1 rounded-md text-xs font-extrabold shadow-sm ${
                              task.priority === 'High' ? 'bg-red-100 text-red-800 border border-red-200' :
                              task.priority === 'Medium' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                              'bg-green-100 text-green-800 border border-green-200'
                            }`}>
                               {task.priority}
                            </span>
                         </td>
                         <td className="py-4 px-6 align-middle">
                            <span className="px-2 py-1 rounded-md text-xs font-extrabold shadow-sm bg-indigo-50 text-indigo-800 border border-indigo-200">
                              {task.category}
                            </span>
                         </td>
                         <td className="py-4 px-6 align-middle">
                           <select
                             value={task.status}
                             disabled={task.completed}
                             onChange={(e) => {
                               const updated = [...tasks];
                               updated[i].status = e.target.value;
                               if(e.target.value === "Completed") updated[i].completed = true;
                               setTasks(updated);
                             }}
                             className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-white text-gray-900 font-bold focus:outline-none disabled:bg-transparent disabled:border-none disabled:appearance-none disabled:text-green-700"
                           >
                             <option>Pending</option>
                             <option>In Progress</option>
                             <option>Completed</option>
                           </select>
                         </td>
                         <td className="py-4 px-6 align-middle text-sm font-bold text-gray-700">
                           {task.dueDate || "—"}
                         </td>
                         <td className="py-4 px-6 align-middle">
                           {task.file ? (
                              <span className="text-xs text-blue-700 font-extrabold truncate block w-24" title={task.file}>📎 {task.file}</span>
                           ) : (
                             <label className="text-xs text-gray-700 hover:text-indigo-700 cursor-pointer font-extrabold transition-colors flex items-center bg-gray-100 hover:bg-indigo-100 px-2 py-1.5 rounded-lg w-max border border-gray-200 hover:border-indigo-300">
                               + Upload File
                               <input
                                 type="file"
                                 accept="*/*"
                                 className="hidden"
                                 onChange={(e) => {
                                   const file = e.target.files?.[0];
                                   if (!file) return;
                                   const updated = [...tasks];
                                   updated[i].file = file.name;
                                   setTasks(updated);
                                 }}
                               />
                             </label>
                           )}
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="bg-slate-900 p-6 rounded-2xl shadow-lg mt-12 mb-4 text-center max-w-6xl mx-auto">
           <p className="text-gray-400 font-medium">&copy; {new Date().getFullYear()} Task Management System. Personal Portal.</p>
        </footer>
      </main>
    </div>
  );
}