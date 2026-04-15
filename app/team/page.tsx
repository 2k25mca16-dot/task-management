"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TeamDashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("tasks"); // 'tasks', 'directory'
  const [form, setForm] = useState({ name: "", assignedTo: "" });
  const router = useRouter();

  const handleSignOut = () => {
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("userRole"); 
    router.push("/");
  };
  
  const [completingTask, setCompletingTask] = useState<any | null>(null);
  const [completionForm, setCompletionForm] = useState({ note: "", file: null as File | null });

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.log("Users API not ready.", err));
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("loggedUser");
    const stored = JSON.parse(localStorage.getItem("tasks") || "[]");

    const filtered = stored.filter(
      (t: any) => t.assignedTo === user && t.type !== "request"
    );

    setTasks(filtered);
  }, []);

  const managerUsers = users.filter((u: any) => u.role?.toLowerCase() === "manager");

  const sendRequest = () => {
    const stored = JSON.parse(localStorage.getItem("tasks") || "[]");

    const newTask = {
      id: Date.now(),
      name: form.name,
      assignedTo: form.assignedTo,
      assignedBy: localStorage.getItem("loggedUser") || "Team Member",
      type: "request",
      status: "Pending",
    };

    localStorage.setItem("tasks", JSON.stringify([...stored, newTask]));
    setForm({ name: "", assignedTo: "" });
    window.location.reload();
  };

  const submitCompletion = () => {
    if (!completingTask) return;
    
    const stored = JSON.parse(localStorage.getItem("tasks") || "[]");
    const updated = stored.map((t: any) =>
      t.id === completingTask.id 
        ? { ...t, status: "Completed", completed: true, completionNote: completionForm.note, hasFile: !!completionForm.file } 
        : t
    );
    localStorage.setItem("tasks", JSON.stringify(updated));
    setCompletingTask(null);
    setCompletionForm({ note: "", file: null });
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-800 text-gray-900 font-sans relative z-0 overflow-hidden">
      {/* Geometric Layers */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 border-[40px] border-slate-700/50 rounded-2xl transform rotate-45 z-[-1] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] border-[60px] border-slate-700/40 rounded-3xl transform rotate-45 z-[-1] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto p-8 relative z-10">
        
      
        <div className="mb-8">
          <header className="bg-slate-900 p-8 rounded-2xl shadow-lg mb-6 flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Team Dashboard</h1>
              <p className="text-gray-300 text-lg">Manage your tasks and collaborate with your team</p>
            </div>
            <button 
              onClick={handleSignOut}
              className="flex items-center px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl transition-colors shadow-md"
            >
              Sign Out
            </button>
          </header>
          <nav className="flex gap-2 border-b border-gray-300">
             <button 
               onClick={() => setActiveTab('tasks')}
               className={`px-4 py-3 font-semibold transition-all border-b-2 ${activeTab === 'tasks' ? 'border-blue-600 text-blue-600 bg-blue-50 -mb-0.5' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
             >
               My Tasks & Requests
             </button>
             <button 
               onClick={() => setActiveTab('directory')}
               className={`px-4 py-3 font-semibold transition-all border-b-2 ${activeTab === 'directory' ? 'border-blue-600 text-blue-600 bg-blue-50 -mb-0.5' : 'border-transparent text-gray-600 hover:text-gray-900'}`}
             >
               Team Directory
             </button>
          </nav>
        </div>

        
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            
           
            <div className="bg-sky-50 rounded-xl shadow-[0_8px_30px_rgb(59,130,246,0.15)] hover:shadow-[0_8px_30px_rgb(59,130,246,0.3)] border border-blue-200 hover:border-blue-400 p-8 transform hover:-translate-y-2 transition-all duration-300 flex flex-col">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 font-black text-blue-700">
                  <span className="text-lg">+</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Send a Request</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Request Details</label>
                  <input
                    type="text"
                    placeholder="What do you need help with?"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Send To</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    value={form.assignedTo}
                    onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                  >
                    <option value="" disabled>Select a Manager</option>
                    {managerUsers.map((u: any, i) => (
                      <option key={i} value={u.email}>{u.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <button 
                    onClick={sendRequest}
                    disabled={!form.name || !form.assignedTo}
                    className="w-full bg-blue-600 text-white font-semibold px-4 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                  >
                    Send Request
                  </button>
                </div>
              </div>
            </div>

            
            <div className="bg-sky-50 rounded-xl shadow-[0_8px_30px_rgb(59,130,246,0.15)] hover:shadow-[0_8px_30px_rgb(59,130,246,0.3)] border border-blue-200 hover:border-blue-400 p-8 transform hover:-translate-y-2 transition-all duration-300 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-3 font-black text-amber-700">
                    <span className="text-lg">#</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Your Tasks</h2>
                    <p className="text-sm text-gray-500">{tasks.length} task{tasks.length !== 1 ? 's' : ''} assigned</p>
                  </div>
                </div>
              </div>
              {tasks.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No tasks assigned right now</p>
                  <p className="text-gray-400 text-sm mt-1">Great work staying on top of everything!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task, i) => (
                    <div key={i} className={`flex flex-col p-5 rounded-lg border border-gray-200 transition-all ${task.completed ? 'bg-green-50 border-green-200' : task.status === 'Paused' ? 'bg-gray-100 opacity-70' : 'bg-gray-50 hover:bg-gray-100 hover:border-gray-300'}`}>
                      <div className="flex justify-between items-center w-full">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                              {task.completed && <span className="text-white text-xs">✓</span>}
                            </div>
                            <div>
                              <h3 className={`font-semibold text-gray-900 ${task.completed ? 'line-through text-gray-400' : ''}`}>{task.name}</h3>
                              <p className="text-sm text-gray-500">
                                Assigned by: <span className="font-semibold">{task.assignedBy}</span>
                                {task.dueDate && <span className={`ml-3 inline-block px-2 py-0.5 rounded-md text-xs font-bold ${task.completed ? 'bg-gray-100 text-gray-500' : 'bg-red-100 text-red-700'}`}>Due: {task.dueDate}</span>}
                                {task.status === 'Paused' && <span className="ml-3 inline-block px-2 py-0.5 rounded-md text-xs font-bold bg-gray-200 text-gray-700">Paused by Manager</span>}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div>
                          {!task.completed && task.status !== 'Paused' ? (
                            <button 
                              onClick={() => setCompletingTask(task)}
                              className="bg-blue-100 text-blue-700 font-semibold px-4 py-2 text-sm rounded-lg hover:bg-blue-200 transition-colors"
                            >
                              Complete Task
                            </button>
                          ) : task.completed ? (
                            <span className="text-sm bg-green-100 text-green-700 font-semibold px-4 py-2 rounded-lg">✓ Completed</span>
                          ) : null}
                        </div>
                      </div>
                      
                      {/* Completion Notes Rendered */}
                      {task.completed && (task.completionNote || task.hasFile) && (
                        <div className="mt-4 pt-4 border-t border-green-200/60 ml-8 text-sm">
                           {task.completionNote && <p className="text-gray-700 mb-2 whitespace-pre-wrap">"{task.completionNote}"</p>}
                           {task.hasFile && (
                             <div className="flex items-center gap-2 text-blue-600 font-medium">
                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
                               File Attached
                             </div>
                           )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
          </div>
        )}

        
        {activeTab === 'directory' && (
          <div className="bg-sky-50 rounded-xl shadow-[0_8px_30px_rgb(59,130,246,0.15)] hover:shadow-[0_8px_30px_rgb(59,130,246,0.3)] border border-blue-200 hover:border-blue-400 p-8 transform hover:-translate-y-2 transition-all duration-300 flex flex-col">
             <div className="flex items-center mb-6">
               <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3 font-black text-purple-700">
                 <span className="text-lg">#</span>
               </div>
               <div>
                 <h2 className="text-2xl font-bold text-gray-900">Team Directory</h2>
                 <p className="text-sm text-gray-500">{users.length} member{users.length !== 1 ? 's' : ''} in your organization</p>
               </div>
             </div>
             {users.length === 0 ? (
               <p className="text-gray-500 text-center py-8">No users found.</p>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {users.map((u, i) => (
                    <div key={i} className="border border-gray-200 p-5 rounded-lg bg-gradient-to-br from-gray-50 to-white hover:shadow-md transition-shadow">
                       <div className="flex items-start justify-between">
                         <div>
                           <p className="font-bold text-lg text-gray-900">{u.name}</p>
                           <p className="text-xs font-semibold text-gray-500 uppercase mt-1">{u.role || 'Member'}</p>
                         </div>
                         <div className={`w-2 h-2 rounded-full ${u.role?.toLowerCase() === 'manager' ? 'bg-blue-500' : u.role?.toLowerCase() === 'team' ? 'bg-amber-500' : 'bg-gray-400'}`} />
                       </div>
                       <p className="text-sm text-gray-600 mt-4 break-all">{u.email}</p>
                    </div>
                 ))}
               </div>
             )}
          </div>
        )}

        
        <footer className="bg-slate-900 p-6 rounded-2xl shadow-lg mt-12 mb-4 text-center">
           <p className="text-gray-400 font-medium">&copy; {new Date().getFullYear()} Task Management System. Team Portal.</p>
        </footer>
      </div>

      
      {completingTask && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity">
          <div className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl transform scale-100 transition-all">
            <div className="flex items-center mb-6">
               <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3 text-green-700">✓</div>
               <h2 className="text-2xl font-bold text-gray-900">Complete Task</h2>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-100">
               <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">Submitting Work For</span>
               <h3 className="font-semibold text-base text-gray-900 mt-1">{completingTask.name}</h3>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Completion Notes (Optional)</label>
                <textarea 
                  rows={3}
                  placeholder="Any context or updates for your manager?"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none resize-none transition-all"
                  value={completionForm.note}
                  onChange={e => setCompletionForm({...completionForm, note: e.target.value})}
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Add Attachments (Optional)</label>
                <input 
                  type="file"
                  className="w-full border border-gray-300 border-dashed rounded-lg px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200 transition-all cursor-pointer"
                  onChange={e => setCompletionForm({...completionForm, file: e.target.files ? e.target.files[0] : null})}
                />
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button 
                  onClick={() => { setCompletingTask(null); setCompletionForm({note: "", file: null}); }} 
                  className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={submitCompletion} 
                  className="px-5 py-2.5 rounded-lg text-sm font-bold bg-green-600 text-white hover:bg-green-700 shadow-sm transition-colors"
                >
                  Confirm Completion
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}