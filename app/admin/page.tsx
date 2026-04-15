"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import usersData from "../../data/users.json";

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("dashboard");
  const router = useRouter();

  const handleSignOut = () => {
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("userRole"); 
    router.push("/");
  };

  useEffect(() => {
    const local = JSON.parse(localStorage.getItem("users") || "[]");
    setUsers([...usersData, ...local]);
  }, []);

  const filteredUsers =
    filter === "all"
      ? users
      : users.filter((u) => u.role?.toLowerCase() === filter);

  return (
    <div className="flex h-screen bg-slate-800 text-gray-900 font-sans overflow-hidden relative z-0">
      
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 border-[40px] border-slate-700/50 rounded-2xl transform rotate-45 z-[-1] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[15%] w-[500px] h-[500px] border-[60px] border-slate-700/40 rounded-3xl transform rotate-45 z-[-1] pointer-events-none"></div>

     
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col p-6 shadow-sm z-10 shrink-0">
        <h2 className="text-xl font-bold mb-8 flex items-center justify-center text-gray-800 tracking-wide">
          Admin Panel
        </h2>
        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center justify-center text-center w-full px-4 py-3 font-bold rounded-lg transition-colors shadow-sm ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-sky-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab("users")}
            className={`flex items-center justify-center text-center w-full px-4 py-3 font-bold rounded-lg transition-colors shadow-sm ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-sky-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800'}`}
          >
            Users
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
                <h1 className="text-4xl font-bold text-white">System Dashboard</h1>
                <p className="text-gray-300 mt-2 text-lg">High-level overview of organization metrics.</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                <div
                  className="bg-sky-50 p-8 py-10 rounded-3xl border-2 border-blue-100 hover:border-blue-400 hover:shadow-[0_8px_30px_rgb(59,130,246,0.2)] cursor-pointer transition-all flex flex-col justify-center transform hover:-translate-y-2"
                  onClick={() => { setFilter("all"); setActiveTab("users"); }}
                >
                  <p className="text-gray-500 text-base font-bold uppercase tracking-widest mb-3">Total Users</p>
                  <h2 className="text-6xl font-black text-gray-900">{users.length}</h2>
                </div>
                <div
                  className="bg-sky-50 p-8 py-10 rounded-3xl border-2 border-blue-100 hover:border-blue-400 hover:shadow-[0_8px_30px_rgb(59,130,246,0.2)] cursor-pointer transition-all flex flex-col justify-center transform hover:-translate-y-2"
                  onClick={() => { setFilter("admin"); setActiveTab("users"); }}
                >
                  <p className="text-gray-500 text-base font-bold uppercase tracking-widest mb-3">Admins</p>
                  <h2 className="text-6xl font-black text-gray-900">{users.filter(u => u.role?.toLowerCase() === "admin").length}</h2>
                </div>
                <div
                  className="bg-sky-50 p-8 py-10 rounded-3xl border-2 border-blue-100 hover:border-blue-400 hover:shadow-[0_8px_30px_rgb(59,130,246,0.2)] cursor-pointer transition-all flex flex-col justify-center transform hover:-translate-y-2"
                  onClick={() => { setFilter("manager"); setActiveTab("users"); }}
                >
                  <p className="text-gray-500 text-base font-bold uppercase tracking-widest mb-3">Managers</p>
                  <h2 className="text-6xl font-black text-gray-900">{users.filter(u => u.role?.toLowerCase() === "manager").length}</h2>
                </div>
                <div
                   className="bg-sky-50 p-8 py-10 rounded-3xl border-2 border-blue-100 hover:border-blue-400 hover:shadow-[0_8px_30px_rgb(59,130,246,0.2)] cursor-pointer transition-all flex flex-col justify-center transform hover:-translate-y-2"
                  onClick={() => { setFilter("team"); setActiveTab("users"); }}
                >
                  <p className="text-gray-500 text-base font-bold uppercase tracking-widest mb-3">Team Members</p>
                  <h2 className="text-6xl font-black text-gray-900">{users.filter(u => u.role?.toLowerCase() === "team").length}</h2>
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header className="bg-slate-900 p-8 rounded-2xl shadow-lg mb-10 flex justify-between items-center">
                <div>
                  <h1 className="text-4xl font-bold text-white">User Directory</h1>
                  <p className="text-gray-300 mt-2 text-lg">Manage all internal organization users.</p>
                </div>
                <select 
                  className="bg-white text-gray-900 font-bold px-4 py-3 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admins</option>
                  <option value="manager">Managers</option>
                  <option value="team">Team Members</option>
                </select>
              </header>

              <div className="bg-sky-50 rounded-2xl shadow-[0_8px_30px_rgb(59,130,246,0.15)] hover:shadow-[0_8px_30px_rgb(59,130,246,0.3)] border border-blue-200 hover:border-blue-400 overflow-hidden transform hover:-translate-y-2 transition-all duration-300 flex flex-col">
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                   <h3 className="text-xl font-bold text-gray-900">User List <span className="text-blue-600 ml-2 text-base">({filter.toUpperCase()})</span></h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white border-b border-gray-200 text-sm text-gray-500 font-bold uppercase tracking-wider bg-gray-50/50">
                        <th className="py-4 px-6 font-semibold">Name</th>
                        <th className="py-4 px-6 font-semibold">Age</th>
                        <th className="py-4 px-6 font-semibold">Role</th>
                        <th className="py-4 px-6 font-semibold">Email</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredUsers.map((u, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-6 font-semibold text-gray-900">{u.name}</td>
                          <td className="py-4 px-6 text-gray-600">{u.age}</td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              u.role?.toLowerCase() === 'admin' ? 'bg-green-100 text-green-700 border border-green-200' :
                              u.role?.toLowerCase() === 'manager' ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' :
                              u.role?.toLowerCase() === 'team' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                              'bg-gray-100 text-gray-700 border border-gray-200'
                            }`}>
                              {u.role || 'Guest'}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-gray-500 font-medium">{u.email}</td>
                        </tr>
                      ))}
                      {filteredUsers.length === 0 && (
                         <tr>
                           <td colSpan={4} className="py-12 text-center text-gray-500 text-lg">No users found for this role.</td>
                         </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          <footer className="bg-slate-900 p-6 rounded-2xl shadow-lg mt-12 mb-4 text-center">
             <p className="text-gray-400 font-medium">&copy; {new Date().getFullYear()} Task Management System. Admin Portal.</p>
          </footer>
        </div>
      </main>
    </div>
  );
}