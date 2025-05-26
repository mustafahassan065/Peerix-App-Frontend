// import React, { useEffect, useState } from 'react';
// import Register from './components/Register';
// import Login from './components/Login';
// import Notes from './components/Note';
// import Chat from './components/Chat';

// function App() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem('peerixUser'));
//     if (stored?.username) {
//       setUser(stored.username);
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('peerixUser');
//     window.location.reload();
//   };

//   return (
//     <div style={{ padding: '40px' }}>
//       <h1>Peerix App</h1>

//       {!user ? (
//         <>
//           <Register />
//           <hr />
//           <Login />
//         </>
//       ) : (
//         <>
//           <p>Welcome, <strong>{user}</strong>!</p>
//           <button onClick={handleLogout} style={{ marginBottom: '20px' }}>Logout</button>
//           <Notes />
//           <hr />
//           <Chat />
//         </>
//       )}
//     </div>
//   );
// }

// export default App;

// src/App.js
// src/App.js
// src/App.js

//without UI
// import React, { useEffect, useState } from 'react';
// import Register from './components/Register';
// import Login from './components/Login';
// import Notes from './components/Note';
// import Chat from './components/Chat';
// import { gun } from './gun';

// function App() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem('peerixUser'));
//     const gunUser = gun.user();

//     // ✅ CASE 1: Already authenticated (session active)
//     if (gunUser.is && gunUser.is.alias) {
//       setUser(gunUser.is.alias);
//       return;
//     }

//     // ✅ CASE 2: Restore session from localStorage using pair
//     if (stored?.username && stored?.pair) {
//       gunUser.auth(stored.username, stored.pair, (ack) => {
//         if (!ack.err) {
//           console.log('Web3 auto-login success');
//           setUser(stored.username);
//         } else {
//           console.warn('Web3 auto-login failed:', ack.err);
//         }
//       });
//     } else if (stored?.username) {
//       // fallback — if pair not available, just set username
//       setUser(stored.username);
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('peerixUser');
//     gun.user().leave(); // ✅ clear Gun session
//     window.location.reload();
//   };

//   return (
//     <div style={{ padding: '40px' }}>
//       <h1>Peerix App</h1>

//       {!user ? (
//         <>
//           <Register />
//           <hr />
//           <Login />
//         </>
//       ) : (
//         <>
//           <p>Welcome, <strong>{user}</strong>!</p>
//           <button onClick={handleLogout} style={{ marginBottom: '20px' }}>Logout</button>
//           <Notes />
//           <hr />
//           <Chat />
//         </>
//       )}
//     </div>
//   );
// }

// export default App;


//with UI
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ChatPanel from './components/ChatPanel';  // Import ChatPanel

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('peerixUser');
    if (stored) setUser(JSON.parse(stored).username);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} setUser={setUser} /> : <Navigate to="/" />} />
        {/* Add Chat route here */}
        <Route path="/chat" element={user ? <ChatPanel user={user} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
