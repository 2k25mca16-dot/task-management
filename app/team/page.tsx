"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TeamDashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("tasks");
  const [form, setForm] = useState({ name: "", assignedTo: "" });
  const router = useRouter();

  const [completingTask, setCompletingTask] = useState<any | null>(null);
  const [completionForm, setCompletionForm] = useState({
    note: "",
    file: null as File | null,
  });

  const handleSignOut = () => {
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("userRole");
    router.push("/");
  };

  const loggedUser =
    typeof window !== "undefined"
      ? localStorage.getItem("loggedUser")
      : null;

  // ✅ LOAD USERS
  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch(() => {});
  }, []);

  // ✅ LOAD TASKS FROM API
  const loadTasks = () => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (t: any) =>
            t.assignedTo === loggedUser && t.type !== "request"
        );
        setTasks(filtered);
      });
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const managerUsers = users.filter(
    (u: any) => u.role?.toLowerCase() === "manager"
  );

  // ✅ SEND REQUEST (API)
  const sendRequest = async () => {
    const newTask = {
      id: Date.now(),
      name: form.name,
      assignedTo: form.assignedTo,
      assignedBy: loggedUser,
      type: "request",
      status: "Pending",
    };

    await fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify(newTask),
    });

    setForm({ name: "", assignedTo: "" });
    loadTasks();
  };

  // ✅ COMPLETE TASK (API)
  const submitCompletion = async () => {
    if (!completingTask) return;

    const updated = {
      ...completingTask,
      status: "Completed",
      completed: true,
      completionNote: completionForm.note,
      hasFile: !!completionForm.file,
    };

    await fetch("/api/tasks", {
      method: "PUT",
      body: JSON.stringify(updated),
    });

    setCompletingTask(null);
    setCompletionForm({ note: "", file: null });
    loadTasks();
  };

  const dashboardCards = [
    { label: "Total Tasks", value: tasks.length, color: "text-blue-600", bg: "bg-blue-50" },
    {
      label: "Completed",
      value: tasks.filter((t) => t.completed).length,
      color: "text-green-600", bg: "bg-green-50"
    },
    {
      label: "In Progress",
      value: tasks.filter((t) => !t.completed && t.status === "In Progress").length,
      color: "text-amber-600", bg: "bg-amber-50"
    },
    {
      label: "Pending",
      value: tasks.filter((t) => !t.completed && t.status === "Pending").length,
      color: "text-purple-600", bg: "bg-purple-50"
    },
  ];

  return (
    <div className="flex h-screen bg-slate-800 text-gray-900 font-sans overflow-hidden relative z-0">
      
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 border-[40px] border-slate-700/50 rounded-2xl transform rotate-45 z-[-1] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[15%] w-[500px] h-[500px] border-[60px] border-slate-700/40 rounded-3xl transform rotate-45 z-[-1] pointer-events-none"></div>

     
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col p-6 shadow-sm z-10 shrink-0">
        <h2 className="text-xl font-bold mb-8 flex items-center justify-center text-gray-800 tracking-wide">
          Team Panel
        </h2>
        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center justify-center text-center w-full px-4 py-3 font-bold rounded-lg transition-colors shadow-sm ${activeTab === 'dashboard' ? 'bg-purple-600 text-white' : 'bg-violet-50 text-purple-700 hover:bg-purple-100 hover:text-purple-800'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab("tasks")}
            className={`flex items-center justify-center text-center w-full px-4 py-3 font-bold rounded-lg transition-colors shadow-sm ${activeTab === 'tasks' ? 'bg-purple-600 text-white' : 'bg-violet-50 text-purple-700 hover:bg-purple-100 hover:text-purple-800'}`}
          >
            My Tasks
          </button>
          <button 
            onClick={() => setActiveTab("requests")}
            className={`flex items-center justify-center text-center w-full px-4 py-3 font-bold rounded-lg transition-colors shadow-sm ${activeTab === 'requests' ? 'bg-purple-600 text-white' : 'bg-violet-50 text-purple-700 hover:bg-purple-100 hover:text-purple-800'}`}
          >
            Send Request
          </button>
          <button 
            onClick={() => setActiveTab("directory")}
            className={`flex items-center justify-center text-center w-full px-4 py-3 font-bold rounded-lg transition-colors shadow-sm ${activeTab === 'directory' ? 'bg-purple-600 text-white' : 'bg-violet-50 text-purple-700 hover:bg-purple-100 hover:text-purple-800'}`}
          >
            Directory
          </button>
        </nav>
        <div className="mt-auto pt-6 border-t border-gray-200">
          <button 
            onClick={handleSignOut}
            className="flex items-center text-left w-full px-4 py-3 bg-sky-500 text-white font-bold hover:bg-sky-600 rounded-lg transition-colors justify-center"
          >
            Sign Out
          </button>
        </div>
      </aside>

      
      <main className="flex-1 overflow-y-auto p-10">
        <div className="max-w-6xl mx-auto">
          
          {activeTab === "dashboard" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header className="bg-slate-900 p-8 rounded-2xl shadow-lg mb-10">
                <h1 className="text-4xl font-bold text-white">Team Dashboard</h1>
                <p className="text-gray-300 mt-2 text-lg">Overview of your tasks and progress.</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {dashboardCards.map((card, i) => (
                  <div
                    key={i}
                    className="bg-violet-50 p-8 py-10 rounded-3xl border-2 border-purple-100 hover:border-purple-400 hover:shadow-[0_8px_30px_rgb(147,51,234,0.2)] cursor-pointer transition-all flex flex-col justify-center transform hover:-translate-y-2"
                  >
                    <p className="text-gray-500 text-base font-bold uppercase tracking-widest mb-3">{card.label}</p>
                    <h2 className="text-6xl font-black text-gray-900">{card.value}</h2>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "tasks" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header className="bg-slate-900 p-8 rounded-2xl shadow-lg mb-10">
                <h1 className="text-4xl font-bold text-white">My Tasks</h1>
                <p className="text-gray-300 mt-2 text-lg">View and manage your assigned tasks.</p>
              </header>

              <div className="bg-violet-50 rounded-2xl border border-purple-200 hover:border-purple-400 shadow-[0_8px_30px_rgb(147,51,234,0.15)] hover:shadow-[0_8px_30px_rgb(147,51,234,0.3)] overflow-hidden transform hover:-translate-y-2 transition-all duration-300 flex flex-col">
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                   <h3 className="text-xl font-bold text-gray-900">Task List <span className="text-purple-600 ml-2 text-base">({tasks.length})</span></h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white border-b border-gray-200 text-sm text-gray-500 font-bold uppercase tracking-wider bg-gray-50/50">
                        <th className="py-4 px-6 font-semibold">Task</th>
                        <th className="py-4 px-6 font-semibold">Priority</th>
                        <th className="py-4 px-6 font-semibold">Status</th>
                        <th className="py-4 px-6 font-semibold">Due Date</th>
                        <th className="py-4 px-6 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {tasks.length === 0 && (
                         <tr>
                           <td colSpan={5} className="py-12 text-center text-gray-500 text-lg">No tasks assigned yet.</td>
                         </tr>
                      )}
                      {tasks.map((task: any) => (
                        <tr key={task.id} className={`transition-all duration-200 border-b border-gray-100 ${task.completed ? 'bg-green-50 text-gray-600' : 'bg-white hover:bg-purple-50/60 hover:-translate-y-1 hover:shadow-sm'}`}>
                          <td className="py-4 px-6 align-middle">
                            <p className={`font-bold ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>{task.name}</p>
                          </td>
                          <td className="py-4 px-6 align-middle">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              task.priority === 'High' ? 'bg-red-100 text-red-700 border border-red-200' :
                              task.priority === 'Medium' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                              'bg-green-100 text-green-700 border border-green-200'
                            }`}>
                              {task.priority}
                            </span>
                          </td>
                          <td className="py-4 px-6 align-middle">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              task.status === 'Completed' ? 'bg-green-100 text-green-700 border border-green-200' :
                              task.status === 'In Progress' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                              'bg-gray-100 text-gray-700 border border-gray-200'
                            }`}>
                              {task.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 align-middle text-sm font-bold text-gray-700">
                            {task.dueDate || "—"}
                          </td>
                          <td className="py-4 px-6 align-middle">
                            {!task.completed && task.status !== "Paused" && (
                              <button
                                onClick={() => setCompletingTask(task)}
                                className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded hover:bg-green-600 transition-colors"
                              >
                                Complete
                              </button>
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

          {activeTab === "requests" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header className="bg-slate-900 p-8 rounded-2xl shadow-lg mb-10">
                <h1 className="text-4xl font-bold text-white">Send Request</h1>
                <p className="text-gray-300 mt-2 text-lg">Submit requests to your manager.</p>
              </header>

              <div className="bg-violet-50 p-6 rounded-2xl border border-purple-200 hover:border-purple-400 shadow-[0_8px_30px_rgb(147,51,234,0.15)] hover:shadow-[0_8px_30px_rgb(147,51,234,0.3)] mb-8 transform hover:-translate-y-2 transition-all duration-300 flex flex-col">
                <div className="flex flex-wrap md:flex-nowrap gap-4 mb-4">
                  <input
                    placeholder="Request description"
                    className="flex-1 border bg-slate-50 border-gray-300 text-gray-900 font-semibold placeholder-gray-500 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <select
                    className="w-full md:w-48 border bg-slate-50 border-gray-300 text-gray-900 font-semibold rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    value={form.assignedTo}
                    onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                  >
                    <option value="">Select Manager</option>
                    {managerUsers.map((u: any, i) => (
                      <option key={i} value={u.email}>{u.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={sendRequest}
                    disabled={!form.name.trim() || !form.assignedTo}
                    className="w-full md:w-32 bg-purple-600 text-white font-bold px-4 py-3 rounded-lg hover:bg-purple-700 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    Send Request
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "directory" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header className="bg-slate-900 p-8 rounded-2xl shadow-lg mb-10">
                <h1 className="text-4xl font-bold text-white">Team Directory</h1>
                <p className="text-gray-300 mt-2 text-lg">View all team members and managers.</p>
              </header>

              <div className="bg-violet-50 rounded-2xl border border-purple-200 hover:border-purple-400 shadow-[0_8px_30px_rgb(147,51,234,0.15)] hover:shadow-[0_8px_30px_rgb(147,51,234,0.3)] overflow-hidden transform hover:-translate-y-2 transition-all duration-300 flex flex-col">
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                   <h3 className="text-xl font-bold text-gray-900">Team Members <span className="text-purple-600 ml-2 text-base">({users.length})</span></h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white border-b border-gray-200 text-sm text-gray-500 font-bold uppercase tracking-wider bg-gray-50/50">
                        <th className="py-4 px-6 font-semibold">Name</th>
                        <th className="py-4 px-6 font-semibold">Email</th>
                        <th className="py-4 px-6 font-semibold">Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {users.length === 0 && (
                         <tr>
                           <td colSpan={3} className="py-12 text-center text-gray-500 text-lg">No team members found.</td>
                         </tr>
                      )}
                      {users.map((user: any) => (
                        <tr key={user.email} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-6 font-semibold text-gray-900">{user.name}</td>
                          <td className="py-4 px-6 text-gray-600">{user.email}</td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              user.role?.toLowerCase() === 'admin' ? 'bg-red-100 text-red-700 border border-red-200' :
                              user.role?.toLowerCase() === 'manager' ? 'bg-green-100 text-green-700 border border-green-200' :
                              user.role?.toLowerCase() === 'team' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                              'bg-gray-100 text-gray-700 border border-gray-200'
                            }`}>
                              {user.role || 'Guest'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          <footer className="bg-slate-900 p-6 rounded-2xl shadow-lg mt-12 mb-4 text-center">
             <p className="text-gray-400 font-medium">&copy; {new Date().getFullYear()} Task Management System. Team Portal.</p>
          </footer>
        </div>
      </main>

      {/* COMPLETION MODAL */}
      {completingTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Complete Task</h2>
            <textarea
              value={completionForm.note}
              onChange={(e) =>
                setCompletionForm({ ...completionForm, note: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
              rows={3}
              placeholder="Completion notes (optional)"
            />
            <input
              type="file"
              onChange={(e) =>
                setCompletionForm({
                  ...completionForm,
                  file: e.target.files?.[0] || null,
                })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
            <div className="flex gap-2">
              <button 
                onClick={submitCompletion} 
                className="flex-1 bg-purple-600 text-white font-bold px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Submit Completion
              </button>
              <button 
                onClick={() => setCompletingTask(null)} 
                className="flex-1 bg-gray-500 text-white font-bold px-4 py-3 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}