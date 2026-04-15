"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("Guest");

  useEffect(() => {
    const user = localStorage.getItem("loggedUser");
    if (user) {
      setUserName(user);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans p-8 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-[2rem] shadow-xl overflow-hidden text-center p-12 border border-gray-100 transition-all hover:shadow-2xl">
         
         <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border-4 border-white ring-4 ring-blue-50">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
         </div>
         
         <h1 className="text-4xl font-extrabold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
           Welcome, {userName}!
         </h1>
         
         <p className="text-lg text-gray-500 font-medium mb-10 max-w-md mx-auto leading-relaxed">
           This dashboard is designated for standard individual users. You currently don't have any specific organizational tasks assigned to you.
         </p>
         
         <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
               onClick={() => router.push('/login')}
               className="bg-white text-gray-700 font-bold px-6 py-3 rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors w-full sm:w-auto"
            >
              Sign Out
            </button>
            <button 
               onClick={() => alert("Profile settings coming soon!")}
               className="bg-blue-600 text-white font-bold px-6 py-3 rounded-xl shadow-md hover:bg-blue-700 hover:-translate-y-0.5 transition-all w-full sm:w-auto"
            >
              Update Profile
            </button>
         </div>
         
      </div>
    </div>
  );
}