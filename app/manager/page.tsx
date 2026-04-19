"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ManagerDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [managerTasks, setManagerTasks] = useState<any[]>([]);
  const [editingTask, setEditingTask] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    assignedTo: "",
    priority: "Medium",
    dueDate: "",
  });

  const loggedUser =
    typeof window !== "undefined"
      ? localStorage.getItem("loggedUser")
      : null;

  const handleSignOut = () => {
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("userRole");
    router.push("/");
  };

  // ✅ LOAD USERS
  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const teamUsers = users.filter(
    (u: any) => u.role?.toLowerCase() === "team"
  );

  // ✅ LOAD TASKS FROM API
  const loadTasks = () => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => {
        const req = data.filter(
          (t: any) =>
            t.assignedTo === loggedUser && t.type === "request"
        );

        const assignedByMe = data.filter(
          (t: any) =>
            t.assignedBy === loggedUser && t.type === "task"
        );

        setRequests(req);
        setManagerTasks(assignedByMe);
      });
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // ✅ ADD TASK
  const addTask = async () => {
    const newTask = {
      id: Date.now(),
      name: form.name,
      priority: form.priority,
      dueDate: form.dueDate,
      status: "Pending",
      completed: false,
      assignedTo: form.assignedTo,
      assignedBy: loggedUser,
      type: "task",
    };

    await fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify(newTask),
    });

    setForm({ name: "", assignedTo: "", priority: "Medium", dueDate: "" });
    loadTasks();
  };

  // ✅ DELETE
  const deleteAssignedTask = async (id: number) => {
    await fetch("/api/tasks", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });

    loadTasks();
  };

  // ✅ UPDATE
  const updateTask = async () => {
    await fetch("/api/tasks", {
      method: "PUT",
      body: JSON.stringify(editingTask),
    });

    setEditingTask(null);
    loadTasks();
  };

  // ✅ PAUSE / RESUME
  const pauseTask = async (task: any) => {
    const updated = {
      ...task,
      status: task.status === "Paused" ? "Pending" : "Paused",
    };

    await fetch("/api/tasks", {
      method: "PUT",
      body: JSON.stringify(updated),
    });

    loadTasks();
  };

  // ✅ ACCEPT REQUEST
  const acceptRequest = async (task: any) => {
    const updated = { ...task, type: "task" };

    await fetch("/api/tasks", {
      method: "PUT",
      body: JSON.stringify(updated),
    });

    loadTasks();
  };

  // ✅ REJECT REQUEST
  const rejectRequest = async (id: number) => {
    await fetch("/api/tasks", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });

    loadTasks();
  };

  const dashboardCards = [
    { label: "Total Tasks Assigned", value: managerTasks.length, color: "text-blue-600", bg: "bg-blue-50" },
    {
      label: "Completed Tasks",
      value: managerTasks.filter((t) => t.completed).length,
      color: "text-green-600", bg: "bg-green-50"
    },
    {
      label: "Pending Requests",
      value: requests.length,
      color: "text-amber-600", bg: "bg-amber-50"
    },
    {
      label: "Team Members",
      value: teamUsers.length,
      color: "text-purple-600", bg: "bg-purple-50"
    },
  ];

  return (
    <div className="flex h-screen bg-slate-800 text-gray-900 font-sans overflow-hidden relative z-0">
      
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 border-[40px] border-slate-700/50 rounded-2xl transform rotate-45 z-[-1] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[15%] w-[500px] h-[500px] border-[60px] border-slate-700/40 rounded-3xl transform rotate-45 z-[-1] pointer-events-none"></div>

     
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col p-6 shadow-sm z-10 shrink-0">
        <h2 className="text-xl font-bold mb-8 flex items-center justify-center text-gray-800 tracking-wide">
          Manager Panel
        </h2>
        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center justify-center text-center w-full px-4 py-3 font-bold rounded-lg transition-colors shadow-sm ${activeTab === 'dashboard' ? 'bg-green-600 text-white' : 'bg-emerald-50 text-green-700 hover:bg-green-100 hover:text-green-800'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab("tasks")}
            className={`flex items-center justify-center text-center w-full px-4 py-3 font-bold rounded-lg transition-colors shadow-sm ${activeTab === 'tasks' ? 'bg-green-600 text-white' : 'bg-emerald-50 text-green-700 hover:bg-green-100 hover:text-green-800'}`}
          >
            Manage Tasks
          </button>
          <button 
            onClick={() => setActiveTab("requests")}
            className={`flex items-center justify-center text-center w-full px-4 py-3 font-bold rounded-lg transition-colors shadow-sm ${activeTab === 'requests' ? 'bg-green-600 text-white' : 'bg-emerald-50 text-green-700 hover:bg-green-100 hover:text-green-800'}`}
          >
            Requests
          </button>
          <button 
            onClick={() => setActiveTab("team")}
            className={`flex items-center justify-center text-center w-full px-4 py-3 font-bold rounded-lg transition-colors shadow-sm ${activeTab === 'team' ? 'bg-green-600 text-white' : 'bg-emerald-50 text-green-700 hover:bg-green-100 hover:text-green-800'}`}
          >
            Team
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
                <h1 className="text-4xl font-bold text-white">Manager Dashboard</h1>
                <p className="text-gray-300 mt-2 text-lg">Overview of team performance and task management.</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {dashboardCards.map((card, i) => (
                  <div
                    key={i}
                    className="bg-emerald-50 p-8 py-10 rounded-3xl border-2 border-green-100 hover:border-green-400 hover:shadow-[0_8px_30px_rgb(34,197,94,0.2)] cursor-pointer transition-all flex flex-col justify-center transform hover:-translate-y-2"
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
                <h1 className="text-4xl font-bold text-white">Task Management</h1>
                <p className="text-gray-300 mt-2 text-lg">Assign and manage tasks for your team members.</p>
              </header>

              {/* Assign Task Form */}
              <div className="bg-emerald-50 p-6 rounded-2xl border border-green-200 hover:border-green-400 shadow-[0_8px_30px_rgb(34,197,94,0.15)] hover:shadow-[0_8px_30px_rgb(34,197,94,0.3)] mb-8 transform hover:-translate-y-2 transition-all duration-300 flex flex-col">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:items-end mb-4">
                  <input
                    placeholder="Task name"
                    className="md:col-span-2 border bg-slate-50 border-gray-300 text-gray-900 font-semibold placeholder-gray-500 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <select
                    className="md:col-span-1 border bg-slate-50 border-gray-300 text-gray-900 font-semibold rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    value={form.assignedTo}
                    onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                  >
                    <option value="">Select Team Member</option>
                    {teamUsers.map((u: any, i) => (
                      <option key={i} value={u.email}>{u.name}</option>
                    ))}
                  </select>
                  <select
                    className="md:col-span-1 border bg-slate-50 border-gray-300 text-gray-900 font-semibold rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                  <input
                    type="date"
                    className="md:col-span-1 border bg-slate-50 border-gray-300 text-gray-900 font-semibold rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  />
                  <button
                    onClick={addTask}
                    disabled={!form.name.trim() || !form.assignedTo}
                    className="w-full md:col-span-1 bg-green-600 text-white font-bold px-4 py-3 rounded-lg hover:bg-green-700 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    + Assign Task
                  </button>
                </div>
              </div>

              {/* Tasks List */}
              <div className="bg-emerald-50 rounded-2xl border border-green-200 hover:border-green-400 shadow-[0_8px_30px_rgb(34,197,94,0.15)] hover:shadow-[0_8px_30px_rgb(34,197,94,0.3)] overflow-hidden transform hover:-translate-y-2 transition-all duration-300 flex flex-col">
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                   <h3 className="text-xl font-bold text-gray-900">Assigned Tasks <span className="text-green-600 ml-2 text-base">({managerTasks.length})</span></h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white border-b border-gray-200 text-sm text-gray-500 font-bold uppercase tracking-wider bg-gray-50/50">
                        <th className="py-4 px-6 font-semibold">Task</th>
                        <th className="py-4 px-6 font-semibold">Assigned To</th>
                        <th className="py-4 px-6 font-semibold">Priority</th>
                        <th className="py-4 px-6 font-semibold">Status</th>
                        <th className="py-4 px-6 font-semibold">Due Date</th>
                        <th className="py-4 px-6 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {managerTasks.length === 0 && (
                         <tr>
                           <td colSpan={6} className="py-12 text-center text-gray-500 text-lg">No tasks assigned yet.</td>
                         </tr>
                      )}
                      {managerTasks.map((task: any) => (
                        <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-6 font-semibold text-gray-900">{task.name}</td>
                          <td className="py-4 px-6 text-gray-600">{task.assignedTo}</td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              task.priority === 'High' ? 'bg-red-100 text-red-700 border border-red-200' :
                              task.priority === 'Medium' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                              'bg-green-100 text-green-700 border border-green-200'
                            }`}>
                              {task.priority}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              task.status === 'Completed' ? 'bg-green-100 text-green-700 border border-green-200' :
                              task.status === 'Paused' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                              'bg-blue-100 text-blue-700 border border-blue-200'
                            }`}>
                              {task.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-gray-500 font-medium">{task.dueDate || "—"}</td>
                          <td className="py-4 px-6">
                            <div className="flex gap-2">
                              <button 
                                onClick={() => setEditingTask(task)} 
                                className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded hover:bg-blue-600 transition-colors"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => pauseTask(task)} 
                                className={`px-3 py-1 text-xs font-bold rounded transition-colors ${
                                  task.status === 'Paused' ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-yellow-500 text-white hover:bg-yellow-600'
                                }`}
                              >
                                {task.status === 'Paused' ? 'Resume' : 'Pause'}
                              </button>
                              <button 
                                onClick={() => deleteAssignedTask(task.id)} 
                                className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded hover:bg-red-600 transition-colors"
                              >
                                Delete
                              </button>
                            </div>
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
                <h1 className="text-4xl font-bold text-white">Team Requests</h1>
                <p className="text-gray-300 mt-2 text-lg">Review and respond to team member requests.</p>
              </header>

              <div className="bg-emerald-50 rounded-2xl border border-green-200 hover:border-green-400 shadow-[0_8px_30px_rgb(34,197,94,0.15)] hover:shadow-[0_8px_30px_rgb(34,197,94,0.3)] overflow-hidden transform hover:-translate-y-2 transition-all duration-300 flex flex-col">
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                   <h3 className="text-xl font-bold text-gray-900">Pending Requests <span className="text-green-600 ml-2 text-base">({requests.length})</span></h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white border-b border-gray-200 text-sm text-gray-500 font-bold uppercase tracking-wider bg-gray-50/50">
                        <th className="py-4 px-6 font-semibold">Request</th>
                        <th className="py-4 px-6 font-semibold">From</th>
                        <th className="py-4 px-6 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {requests.length === 0 && (
                         <tr>
                           <td colSpan={3} className="py-12 text-center text-gray-500 text-lg">No pending requests.</td>
                         </tr>
                      )}
                      {requests.map((request: any) => (
                        <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-6 font-semibold text-gray-900">{request.name}</td>
                          <td className="py-4 px-6 text-gray-600">{request.assignedBy}</td>
                          <td className="py-4 px-6">
                            <div className="flex gap-2">
                              <button 
                                onClick={() => acceptRequest(request)} 
                                className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded hover:bg-green-600 transition-colors"
                              >
                                Accept
                              </button>
                              <button 
                                onClick={() => rejectRequest(request.id)} 
                                className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded hover:bg-red-600 transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "team" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header className="bg-slate-900 p-8 rounded-2xl shadow-lg mb-10">
                <h1 className="text-4xl font-bold text-white">Team Directory</h1>
                <p className="text-gray-300 mt-2 text-lg">View and manage your team members.</p>
              </header>

              <div className="bg-emerald-50 rounded-2xl border border-green-200 hover:border-green-400 shadow-[0_8px_30px_rgb(34,197,94,0.15)] hover:shadow-[0_8px_30px_rgb(34,197,94,0.3)] overflow-hidden transform hover:-translate-y-2 transition-all duration-300 flex flex-col">
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                   <h3 className="text-xl font-bold text-gray-900">Team Members <span className="text-green-600 ml-2 text-base">({teamUsers.length})</span></h3>
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
                      {teamUsers.length === 0 && (
                         <tr>
                           <td colSpan={3} className="py-12 text-center text-gray-500 text-lg">No team members found.</td>
                         </tr>
                      )}
                      {teamUsers.map((user: any) => (
                        <tr key={user.email} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-6 font-semibold text-gray-900">{user.name}</td>
                          <td className="py-4 px-6 text-gray-600">{user.email}</td>
                          <td className="py-4 px-6">
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
                              Team Member
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
             <p className="text-gray-400 font-medium">&copy; {new Date().getFullYear()} Task Management System. Manager Portal.</p>
          </footer>
        </div>
      </main>

      {/* EDIT MODAL */}
      {editingTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Edit Task</h2>
            <input
              value={editingTask.name}
              onChange={(e) =>
                setEditingTask({ ...editingTask, name: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Task name"
            />
            <div className="flex gap-2">
              <button 
                onClick={updateTask} 
                className="flex-1 bg-green-600 text-white font-bold px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Save Changes
              </button>
              <button 
                onClick={() => setEditingTask(null)} 
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