
// import React, { useState, useEffect } from 'react';
// import Notes from './Note';
// import { gun } from '../gun';
// import { useNavigate } from 'react-router-dom';


// export default function Dashboard({ user }) {
//   const [displayName, setDisplayName] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (user?.username) {
//       setDisplayName(user.username);
//     } else {
//       const stored = JSON.parse(localStorage.getItem('peerixUser') || '{}');
//       if (stored.username) {
//         setDisplayName(stored.username);
//       } else {
//         setDisplayName('User');
//       }
//     }
//   }, [user]);

//   const handleLogout = () => {
//     localStorage.removeItem('peerixUser');
//     gun.user().leave();
//     // Navigate to login page or reload
//     navigate('/');
//     window.location.reload();  // optional to clear app state
//   };

//   return (
//     <div className="max-w-6xl mx-auto">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-sage">Welcome, {displayName}</h1>
//         <button onClick={handleLogout} className="bg-terracotta text-white px-4 py-2 rounded">
//           Logout
//         </button>
//       </div>

//       <Notes />

//       <div className="text-right mt-6">
//         <button
//           onClick={() => navigate('/chat')}
//           className="bg-primary text-black font-bold px-6 py-2 rounded hover:bg-yellow-400"
//         >
//           Chat with Others
//         </button>
//       </div>
//     </div>
//   );
// }

//AlongwithUi
import React, { useState, useEffect } from 'react';
import Notes from './Note';
import { gun } from '../gun';
import { useNavigate } from 'react-router-dom';

export default function Dashboard({ user }) {
  const [displayName, setDisplayName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.username) {
      setDisplayName(user.username);
    } else {
      const stored = JSON.parse(localStorage.getItem('peerixUser') || '{}');
      if (stored.username) {
        setDisplayName(stored.username);
      } else {
        setDisplayName('User');
      }
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('peerixUser');
    gun.user().leave();
    // Navigate to login page or reload
    navigate('/');
    window.location.reload();  // optional to clear app state
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-yellow-400 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
                  Welcome, <span className="text-sage">{displayName}</span>
                </h1>
                <p className="text-gray-500 mt-1">Manage your notes and collaborate with others</p>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="bg-gradient-to-r from-terracotta/10 to-terracotta/5 text-terracotta border border-terracotta/20 px-6 py-3 rounded-xl hover:bg-terracotta hover:text-white hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 group font-medium"
            >
              <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
{/* Chat Button Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-yellow-400/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Ready to Connect?</h3>
            <p className="text-gray-600 mb-4">Join the conversation and collaborate with others in real-time</p>
            <button
              onClick={() => navigate('/chat')}
              className="bg-gradient-to-r from-primary to-yellow-400 text-gray-900 font-bold px-8 py-3 rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 mx-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>Chat with Others</span>
            </button>
          </div>
        </div>
        {/* Notes Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden mb-6 mt-10">
          <div className="px-6 py-4 border-b border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-white/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-sage to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Your Notes</h2>
                <p className="text-sm text-gray-500">Create and manage your personal notes</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <Notes />
          </div>
        </div>

        

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-500 bg-white/40 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/30">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span>PeerIX • Real-time Collaboration Platform</span>
          </div>
        </div>
      </div>
    </div>
  );
}