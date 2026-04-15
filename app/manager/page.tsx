"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ManagerDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [managerTasks, setManagerTasks] = useState<any[]>([]);
  const [editingTask, setEditingTask] = useState<any | null>(null);
  const router = useRouter();

  const handleSignOut = () => {
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("userRole"); 
    router.push("/");
  };

  const [form, setForm] = useState({
    name: "",
    assignedTo: "",
    priority: "Medium",
    dueDate: "",
  });

  // 🔥 LOAD USERS
  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.log("Users API not ready just yet.", err));
  }, []);

  const teamUsers = users.filter((u: any) => u.role?.toLowerCase() === "team");

  // 🔥 LOAD REQUESTS & TASKS
  useEffect(() => {
    const user = localStorage.getItem("loggedUser");
    const stored = JSON.parse(localStorage.getItem("tasks") || "[]");

    const req = stored.filter(
      (t: any) => t.assignedTo === user && t.type === "request"
    );
    
    const assignedByMe = stored.filter(
      (t: any) => t.assignedBy === user && t.type === "task"
    );

    setRequests(req);
    setManagerTasks(assignedByMe);
  }, []);

  // 🔥 ASSIGN TASK
  const addTask = () => {
    const stored = JSON.parse(localStorage.getItem("tasks") || "[]");

    const newTask = {
      id: Date.now(),
      name: form.name,
      priority: form.priority,
      dueDate: form.dueDate,
      status: "Pending",
      completed: false,
      assignedTo: form.assignedTo,
      assignedBy: localStorage.getItem("loggedUser") || "Manager",
      type: "task",
    };

    localStorage.setItem("tasks", JSON.stringify([...stored, newTask]));
    setForm({ name: "", assignedTo: "", priority: "Medium", dueDate: "" });
    window.location.reload();
  };

  // 🔥 TASK MANAGEMENT FUNCTIONS
  const pauseTask = (id: number) => {
    const all = JSON.parse(localStorage.getItem("tasks") || "[]");
    const updated = all.map((t: any) => {
      if (t.id === id) {
        return { ...t, status: t.status === "Paused" ? "Pending" : "Paused" };
      }
      return t;
    });
    localStorage.setItem("tasks", JSON.stringify(updated));
    window.location.reload();
  };

  const deleteAssignedTask = (id: number) => {
    const all = JSON.parse(localStorage.getItem("tasks") || "[]");
    const updated = all.filter((t: any) => t.id !== id);
    localStorage.setItem("tasks", JSON.stringify(updated));
    window.location.reload();
  };

  const updateTask = () => {
    const all = JSON.parse(localStorage.getItem("tasks") || "[]");
    const updated = all.map((t: any) =>
      t.id === editingTask.id ? { ...t, name: editingTask.name, priority: editingTask.priority, dueDate: editingTask.dueDate } : t
    );
    localStorage.setItem("tasks", JSON.stringify(updated));
    setEditingTask(null);
    window.location.reload();
  };

  // 🔥 REQUEST ACTIONS
  const acceptRequest = (id: number) => {
    const all = JSON.parse(localStorage.getItem("tasks") || "[]");
    const updated = all.map((t: any) =>
      t.id === id ? { ...t, type: "task" } : t
    );
    localStorage.setItem("tasks", JSON.stringify(updated));
    window.location.reload();
  };

  const rejectRequest = (id: number) => {
    const all = JSON.parse(localStorage.getItem("tasks") || "[]");
    const updated = all.filter((t: any) => t.id !== id);
    localStorage.setItem("tasks", JSON.stringify(updated));
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-800 text-gray-900 font-sans relative z-0 overflow-hidden">
      {/* Geometric Layers */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 border-[40px] border-slate-700/50 rounded-2xl transform rotate-45 z-[-1] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] border-[60px] border-slate-700/40 rounded-3xl transform rotate-45 z-[-1] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto p-8 relative z-10">
        
        {/* Header */}
        <header className="bg-slate-900 p-8 rounded-2xl shadow-lg mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Manager Dashboard</h1>
            <p className="text-gray-300 text-lg">Assign tasks, manage requests, and lead your team</p>
          </div>
          <button 
            onClick={handleSignOut}
            className="flex items-center px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl transition-colors shadow-md"
          >
            Sign Out
          </button>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-sky-50 rounded-xl shadow-[0_8px_30px_rgb(59,130,246,0.15)] hover:shadow-[0_8px_30px_rgb(59,130,246,0.3)] border border-blue-200 hover:border-blue-400 p-6 transform hover:-translate-y-2 transition-all duration-300 flex flex-col justify-center">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold uppercase">Pending Requests</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{requests.length}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-700 font-black">#</div>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="bg-sky-50 rounded-xl shadow-[0_8px_30px_rgb(59,130,246,0.15)] hover:shadow-[0_8px_30px_rgb(59,130,246,0.3)] border border-blue-200 hover:border-blue-400 p-8 mb-8 transform hover:-translate-y-2 transition-all duration-300 flex flex-col">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3 font-black text-green-700">
              <span className="text-lg">+</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Assign a New Task</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-5 items-end">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Task Details</label>
              <input
                type="text"
                placeholder="What's the task?"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Assign To</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                value={form.assignedTo}
                onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
              >
                <option value="" disabled>Select Member</option>
                {teamUsers.map((u: any, i) => (
                  <option key={i} value={u.email}>{u.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
            <div>
              <button 
                onClick={addTask}
                disabled={!form.name || !form.assignedTo}
                className="w-full bg-green-600 text-white font-semibold px-4 py-2.5 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                Assign Task
              </button>
            </div>
          </div>
        </div>

        {/* Manage Tasks List */}
        <div className="bg-sky-50 rounded-xl shadow-[0_8px_30px_rgb(59,130,246,0.15)] hover:shadow-[0_8px_30px_rgb(59,130,246,0.3)] border border-blue-200 hover:border-blue-400 p-8 mb-8 transform hover:-translate-y-2 transition-all duration-300 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Manage Assigned Tasks</h2>
              <p className="text-sm text-gray-500 mt-1">{managerTasks.length} task{managerTasks.length !== 1 ? 's' : ''} actively assigned</p>
            </div>
          </div>
          {managerTasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No tasks assigned yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {managerTasks.map((t, i) => (
                <div key={i} className={`flex justify-between items-center border p-5 rounded-lg transition-all ${t.completed ? 'bg-green-50 border-green-200' : t.status === 'Paused' ? 'bg-gray-50 border-gray-200 opacity-60' : 'bg-white border-gray-200 hover:shadow-sm'}`}>
                  <div className="flex-1">
                     <div className="flex items-center gap-3 mb-2">
                        <h3 className={`font-bold text-gray-900 ${t.completed ? 'line-through text-gray-500' : ''}`}>{t.name}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${t.status === 'Paused' ? 'bg-gray-200 text-gray-600' : t.priority === 'Urgent' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                          {t.status === 'Paused' ? 'Paused' : t.priority}
                        </span>
                        {t.completed && t.completionNote && (
                          <span className="text-xs text-green-700 font-semibold italic flex items-center">
                            Notes attached
                          </span>
                        )}
                     </div>
                     <p className="text-sm text-gray-600">Assigned To: <span className="font-semibold">{t.assignedTo}</span> {t.dueDate && <span className="ml-2 font-medium text-gray-400">| Due: {t.dueDate}</span>}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    {!t.completed && (
                      <>
                        <button onClick={() => setEditingTask(t)} className="bg-gray-100 text-gray-700 font-semibold px-4 py-2 text-sm rounded-lg hover:bg-gray-200 transition-colors">Edit</button>
                        <button onClick={() => pauseTask(t.id)} className="bg-amber-100 text-amber-700 font-semibold px-4 py-2 text-sm rounded-lg hover:bg-amber-200 transition-colors">{t.status === 'Paused' ? 'Resume' : 'Pause'}</button>
                      </>
                    )}
                    <button onClick={() => deleteAssignedTask(t.id)} className="bg-red-100 text-red-700 font-semibold px-4 py-2 text-sm rounded-lg hover:bg-red-200 transition-colors">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Requests List */}
        <div className="bg-sky-50 rounded-xl shadow-[0_8px_30px_rgb(59,130,246,0.15)] hover:shadow-[0_8px_30px_rgb(59,130,246,0.3)] border border-blue-200 hover:border-blue-400 p-8 transform hover:-translate-y-2 transition-all duration-300 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Pending Requests</h2>
              <p className="text-sm text-gray-500 mt-1">{requests.length} request{requests.length !== 1 ? 's' : ''} awaiting review</p>
            </div>
          </div>
          {requests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">All caught up!</p>
              <p className="text-gray-400 text-sm mt-1">No pending requests to review</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((r, i) => (
                <div key={i} className="flex justify-between items-center border border-gray-200 p-5 rounded-lg bg-gradient-to-r from-amber-50 to-white hover:shadow-md transition-shadow">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <h3 className="font-bold text-gray-900">{r.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600">Requested by: <span className="font-semibold">{r.assignedBy}</span></p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button 
                      onClick={() => acceptRequest(r.id)}
                      className="bg-green-100 text-green-700 font-semibold px-4 py-2 text-sm rounded-lg hover:bg-green-200 transition-colors"
                    >
                      ✓ Accept
                    </button>
                    <button 
                      onClick={() => rejectRequest(r.id)}
                      className="bg-red-100 text-red-700 font-semibold px-4 py-2 text-sm rounded-lg hover:bg-red-200 transition-colors"
                    >
                      ✕ Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="bg-slate-900 p-6 rounded-2xl shadow-lg mt-12 text-center">
           <p className="text-gray-400 font-medium">&copy; {new Date().getFullYear()} Task Management System. Manager Portal.</p>
        </footer>

      </div>

      {/* EDIT TASK MODAL */}
      {editingTask && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity">
          <div className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl transform scale-100 transition-all">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Edit Task</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Task Details</label>
                <input 
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                  value={editingTask.name} 
                  onChange={e => setEditingTask({...editingTask, name: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
                <input 
                  type="date" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                  value={editingTask.dueDate || ""} 
                  onChange={e => setEditingTask({...editingTask, dueDate: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                  value={editingTask.priority} 
                  onChange={e => setEditingTask({...editingTask, priority: e.target.value})}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button onClick={() => setEditingTask(null)} className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
                <button onClick={updateTask} className="px-5 py-2.5 rounded-lg text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}