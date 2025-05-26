// // // src/components/Chat.js
// import React, { useState, useEffect } from 'react';
// import { api } from '../api';
// import { gun } from '../gun'; // ✅ Gun instance

// export default function Chat() {
//   const [from, setFrom] = useState('');
//   const [to, setTo] = useState('');
//   const [text, setText] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem('peerixUser'));
//     if (stored?.username) {
//       setFrom(stored.username);
//       loadUsers(stored.username);
//     }
//   }, []);

//   const loadUsers = async (currentUser) => {
//     const res = await api.get('/users');
//     const others = res.data.filter(u => u !== currentUser);
//     setUsers(others);
//     if (others.length > 0) setTo(others[0]); // default select
//   };

//   const chatId = [from, to].sort().join('-');

//   // ✅ Real-time chat sync using Gun
//   useEffect(() => {
//     if (!from || !to) return;

//     const chat = gun.get('messages').get(chatId);
//     const liveMessages = {};

//     chat.map().on((m, id) => {
//       if (m && m.text) {
//         liveMessages[id] = m;
//         setMessages(Object.values(liveMessages));
//       }
//     });

//     return () => {
//       chat.off();
//     };
//   }, [from, to]);

//   const sendMessage = (e) => {
//     e.preventDefault();
//     if (!text) return;

//     const msg = {
//       from,
//       to,
//       text,
//       time: Date.now()
//     };

//     gun.get('messages').get(chatId).set(msg);
//     setText('');
//   };

//   return (
//     <div style={{ marginTop: '2rem' }}>
//       <h2>Chat</h2>

//       <label>Send to:</label>
//       <select value={to} onChange={e => setTo(e.target.value)} style={{ marginLeft: '8px' }}>
//         {users.map((u, i) => (
//           <option key={i} value={u}>{u}</option>
//         ))}
//       </select>

//       <form onSubmit={sendMessage} style={{ marginTop: '1rem', marginBottom: '1rem' }}>
//         <input
//           value={text}
//           onChange={e => setText(e.target.value)}
//           placeholder="Type message..."
//           style={{ padding: '8px', width: '60%' }}
//         />
//         <button type="submit" style={{ padding: '8px 16px', marginLeft: '8px' }}>Send</button>
//       </form>

//       <ul>
//         {messages
//           .sort((a, b) => a.time - b.time)
//           .map((m, i) => (
//             <li key={i}>
//               <strong>{m.from}</strong>: {m.text}
//             </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// src/components/Chat.js
// src/components/Chat.
// // src/components/Chat.js
// import React, { useState, useEffect } from 'react';
// import { api } from '../api';
// import { gun } from '../gun';

// export default function Chat() {
//   const [from, setFrom] = useState('');
//   const [to, setTo] = useState('');
//   const [text, setText] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem('peerixUser'));
//     if (stored?.username) {
//       setFrom(stored.username);
//       loadUsers(stored.username);
//     }

//     // Restore last selected receiver
//     const lastTo = localStorage.getItem('peerixTo');
//     if (lastTo) setTo(lastTo);
//   }, []);

//   const loadUsers = async (currentUser) => {
//     try {
//       const res = await api.get('/users');
//       const others = res.data.filter(u => u !== currentUser);
//       setUsers(others);
//       localStorage.setItem('peerixUsers', JSON.stringify(others)); // 🧠 Save user list locally
//       if (others.length > 0) setTo(others[0]);
//     } catch (err) {
//       console.warn('Offline or backend down: loading users from localStorage...');
//       const cachedUsers = localStorage.getItem('peerixUsers');
//       if (cachedUsers) {
//         const others = JSON.parse(cachedUsers).filter(u => u !== currentUser);
//         setUsers(others);
//         if (others.length > 0) setTo(others[0]);
//       }
//     }
//   };

//   const chatId = [from, to].sort().join('-');

//   useEffect(() => {
//     if (!from || !to) return;

//     const chat = gun.get('messages').get(chatId);
//     const liveMessages = {};

//     chat.map().on((m, id) => {
//       if (m?.text) {
//         liveMessages[id] = m;
//         const updated = Object.values(liveMessages).sort((a, b) => a.time - b.time);
//         setMessages(updated);
//         localStorage.setItem(`chat-${chatId}`, JSON.stringify(updated));
//       }
//     });

//     return () => chat.off();
//   }, [from, to]);

//   useEffect(() => {
//     const cached = localStorage.getItem(`chat-${chatId}`);
//     if (cached) {
//       setMessages(JSON.parse(cached));
//     }
//   }, [chatId]);

//   const sendMessage = (e) => {
//     e.preventDefault();
//     if (!text) return;

//     const msg = {
//       from,
//       to,
//       text,
//       time: Date.now()
//     };

//     gun.get('messages').get(chatId).set(msg);
//     setText('');
//     localStorage.setItem('peerixTo', to); // persist receiver
//   };

//   return (
//     <div style={{ marginTop: '2rem' }}>
//       <h2>Chat (Offline + Persistent + Users)</h2>

//       <label>Send to:</label>
//       <select value={to} onChange={e => setTo(e.target.value)} style={{ marginLeft: '8px' }}>
//         {users.map((u, i) => (
//           <option key={i} value={u}>{u}</option>
//         ))}
//       </select>

//       <form onSubmit={sendMessage} style={{ marginTop: '1rem', marginBottom: '1rem' }}>
//         <input
//           value={text}
//           onChange={e => setText(e.target.value)}
//           placeholder="Type message..."
//           style={{ padding: '8px', width: '60%' }}
//         />
//         <button type="submit" style={{ padding: '8px 16px', marginLeft: '8px' }}>Send</button>
//       </form>

//       <ul>
//         {messages.map((m, i) => (
//           <li key={i}><strong>{m.from}</strong>: {m.text}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }


// src/components/Chat.js
// src/components/Chat.js
import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { gun } from '../gun';
import { encryptData, decryptData } from '../cryptoHelper';

export default function Chat() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('peerixUser'));
    if (stored?.username) {
      setFrom(stored.username);
      loadUsers(stored.username);
    }
    const lastTo = localStorage.getItem('peerixTo');
    if (lastTo) setTo(lastTo);
  }, []);

  const loadUsers = async (currentUser) => {
    try {
      const res = await api.get('/users');
      const others = res.data.filter(u => u !== currentUser);
      setUsers(others);
      localStorage.setItem('peerixUsers', JSON.stringify(others));
      if (others.length > 0) setTo(others[0]);
    } catch (err) {
      const cached = localStorage.getItem('peerixUsers');
      if (cached) {
        const others = JSON.parse(cached).filter(u => u !== currentUser);
        setUsers(others);
        if (others.length > 0) setTo(others[0]);
      }
    }
  };

  const chatId = [from, to].sort().join('-');

  useEffect(() => {
    if (!from || !to) return;

    const chat = gun.get('messages').get(chatId);
    const liveMessages = {};

    chat.map().on(async (m, id) => {
      if (!m?.data) return;
      try {
        const decrypted = await decryptData(m.data);
        if (decrypted?.text) {
          liveMessages[id] = decrypted;
          const sorted = Object.values(liveMessages).sort((a, b) => a.time - b.time);
          setMessages(sorted);
          localStorage.setItem(`chat-${chatId}`, JSON.stringify(sorted));
        }
      } catch (err) {
        console.warn('Message decryption failed:', err);
      }
    });

    return () => chat.off();
  }, [from, to]);

  useEffect(() => {
    const cached = localStorage.getItem(`chat-${chatId}`);
    if (cached) setMessages(JSON.parse(cached));
  }, [chatId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text) return;

    const msg = { from, to, text, time: Date.now() };
    try {
      const encrypted = await encryptData(msg);
      gun.get('messages').get(chatId).set({ data: encrypted });
      localStorage.setItem('peerixTo', to);
      setText('');
    } catch (err) {
      console.error('Encryption failed:', err);
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>Chat (E2EE + Offline)</h2>
      <label>Send to:</label>
      <select value={to} onChange={e => setTo(e.target.value)}>
        {users.map((u, i) => (
          <option key={i} value={u}>{u}</option>
        ))}
      </select>

      <form onSubmit={sendMessage}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type encrypted message"
        />
        <button type="submit">Send</button>
      </form>

      <ul>
        {messages.map((m, i) => (
          <li key={i}><strong>{m.from}</strong>: {m.text}</li>
        ))}
      </ul>
    </div>
  );
}



