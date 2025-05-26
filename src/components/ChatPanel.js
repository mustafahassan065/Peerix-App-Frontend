// import React, { useEffect, useState } from 'react';
// import { api } from '../api';
// import { gun } from '../gun';

// export default function ChatPanel({ user }) {
//   const [users, setUsers] = useState([]);
//   const [selected, setSelected] = useState('');
//   const [text, setText] = useState('');
//   const [messages, setMessages] = useState([]);

//   const chatId = [user, selected].sort().join('-');

//   useEffect(() => {
//     const loadUsers = async () => {
//       try {
//         const res = await api.get('/users');
//         const others = res.data.filter(u => u !== user);
//         setUsers(others);
//         if (others.length > 0) setSelected(others[0]);
//       } catch (err) {
//         console.error('Failed to load users:', err);
//       }
//     };

//     loadUsers();
//   }, [user]);

//   useEffect(() => {
//     if (!selected) return;
//     setMessages([])
//     const chat = gun.get('messages').get(chatId);
//     const liveMessages = {};

//     chat.map().on((m, id) => {
//       if (m?.text) {
//         liveMessages[id] = m;
//         const all = Object.values(liveMessages).sort((a, b) => a.time - b.time);
//         setMessages(all);
//       }
//     });

//     return () => chat.off();
//   }, [chatId, selected]);

//   const sendMessage = (e) => {
//     e.preventDefault();
//     if (!text || !selected) return;

//     const msg = {
//       from: user,
//       to: selected,
//       text,
//       time: Date.now()
//     };

//     gun.get('messages').get(chatId).set(msg);
//     setText('');
//   };

//   return (
//     <div className="border rounded-lg shadow p-4 bg-white">
//       <div className="flex">
//         {/* Left Sidebar */}
//         <div className="w-1/3 border-r pr-4">
//           <h3 className="font-bold mb-4">Users</h3>
//           <ul className="space-y-2">
//             {users.map((u, i) => (
//               <li
//                 key={i}
//                 className={`cursor-pointer px-3 py-2 rounded ${selected === u ? 'bg-sage text-white' : 'hover:bg-gray-200'}`}
//                 onClick={() => setSelected(u)}
//               >
//                 {u}
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Right Chat Window */}
//         <div className="w-2/3 pl-4">
//           <h3 className="font-bold mb-4">Chat with {selected}</h3>

//           <div className="h-64 overflow-y-auto border rounded p-2 bg-gray-50 mb-4">
//             {messages.map((m, i) => (
//               <div key={i} className={`mb-2 ${m.from === user ? 'text-right' : 'text-left'}`}>
//                 <p className="text-sm">
//                   <strong>{m.from}</strong>: {m.text}
//                 </p>
//               </div>
//             ))}
//           </div>

//           <form onSubmit={sendMessage} className="flex">
//             <input
//               value={text}
//               onChange={e => setText(e.target.value)}
//               placeholder="Type your message..."
//               className="flex-grow border p-2 rounded-l"
//             />
//             <button type="submit" className="bg-primary px-4 py-2 rounded-r text-black font-bold">
//               Send
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

//AlongWith UI
import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { gun } from '../gun';

// User Avatar Component with beautiful icons
const UserAvatar = ({ username, isOnline = true }) => {
  const colors = ['bg-primary', 'bg-sage', 'bg-terracotta'];
  const colorIndex = username.length % colors.length;
  
  return (
    <div className="relative">
      <div className={`w-12 h-12 ${colors[colorIndex]} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
        {username.charAt(0).toUpperCase()}
      </div>
      {isOnline && (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
      )}
    </div>
  );
};

// Message Bubble Component
const MessageBubble = ({ message, isOwnMessage, user, showDate }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  return (
    <>
      {showDate && (
        <div className="flex justify-center my-4">
          <div className="bg-sage/20 px-4 py-2 rounded-full">
            <span className="text-xs text-sage font-medium">{formatDate(message.time)}</span>
          </div>
        </div>
      )}
      <div className={`flex items-end mb-4 animate-fadeIn ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
        {!isOwnMessage && (
          <div className="mr-3">
            <UserAvatar username={message.from} />
          </div>
        )}
        
        <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 ${
          isOwnMessage 
            ? 'bg-gradient-to-br from-primary to-yellow-400 text-gray-800 rounded-br-sm' 
            : 'bg-gradient-to-br from-white to-gray-50 text-gray-800 rounded-bl-sm border border-gray-200'
        }`}>
          {!isOwnMessage && (
            <p className="text-xs font-semibold text-sage mb-1">{message.from}</p>
          )}
          <p className="text-sm leading-relaxed">{message.text}</p>
          <p className={`text-xs mt-2 ${isOwnMessage ? 'text-gray-600' : 'text-gray-500'}`}>
            {formatTime(message.time)}
          </p>
        </div>
        
        {isOwnMessage && (
          <div className="ml-3">
            <UserAvatar username={user} />
          </div>
        )}
      </div>
    </>
  );
};

// Encryption Notice Component
const EncryptionNotice = () => (
  <div className="flex items-center justify-center py-3 px-4 bg-gradient-to-r from-sage/10 to-primary/10 border-b border-sage/20">
    <svg className="w-4 h-4 text-sage mr-2 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    </svg>
    <span className="text-xs text-sage font-medium">Your chats are encrypted</span>
  </div>
);

export default function ChatPanel({ user }) {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState('');
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [userLastMessage, setUserLastMessage] = useState({});
  const [allMessages, setAllMessages] = useState({});
  const [readMessages, setReadMessages] = useState({});

  const chatId = [user, selected].sort().join('-');

  const getLatestMessageTime = (username) => {
    let latestTime = 0;
    Object.keys(allMessages).forEach(chatKey => {
      if (chatKey.includes(username)) {
        const chatMessages = allMessages[chatKey] || [];
        chatMessages.forEach(msg => {
          if ((msg.from === username || msg.to === username) && msg.time > latestTime) {
            latestTime = msg.time;
          }
        });
      }
    });
    return latestTime;
  };

  const sortedUsers = [...users].sort((a, b) => {
    const timeA = getLatestMessageTime(a);
    const timeB = getLatestMessageTime(b);
    return timeB - timeA;
  });

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await api.get('/users');
        const others = res.data.filter(u => u !== user);
        setUsers(others);
        localStorage.setItem('peerixUsers', JSON.stringify(others));
        if (others.length > 0 && !selected) setSelected(others[0]);

        others.forEach(otherUser => loadChatMessages(otherUser));
      } catch (err) {
        console.warn('API failed, using local user cache...');
        const cached = localStorage.getItem('peerixUsers');
        if (cached) {
          const others = JSON.parse(cached).filter(u => u !== user);
          setUsers(others);
          if (others.length > 0 && !selected) setSelected(others[0]);

          others.forEach(otherUser => loadChatMessages(otherUser));
        }
      }
    };

    const loadChatMessages = (otherUser) => {
      const chatKey = [user, otherUser].sort().join('-');
      const chat = gun.get('messages').get(chatKey);
      const liveMessages = {};
      chat.map().on((m, id) => {
        if (m?.text) {
          liveMessages[id] = m;
          const all = Object.values(liveMessages).sort((a, b) => a.time - b.time);

          setAllMessages(prev => ({
            ...prev,
            [chatKey]: all
          }));

          if (m.from === otherUser && m.from !== user) {
            const lastReadTime = readMessages[otherUser] || 0;
            setUserLastMessage(prev => ({
              ...prev,
              [otherUser]: {
                time: m.time,
                hasNew: m.time > lastReadTime
              }
            }));
          }
        }
      });
    };

    loadUsers();
  }, [user, selected]);

  useEffect(() => {
    if (!selected) return;

    const currentChatMessages = allMessages[chatId] || [];
    setMessages(currentChatMessages);

    const latestMessageTime = getLatestMessageTime(selected);
    if (latestMessageTime > 0) {
      setReadMessages(prev => ({
        ...prev,
        [selected]: latestMessageTime
      }));

      setUserLastMessage(prev => ({
        ...prev,
        [selected]: { ...prev[selected], hasNew: false }
      }));
    }
  }, [selected, allMessages, chatId]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() || !selected) return;

    const msg = {
      from: user,
      to: selected,
      text: text.trim(),
      time: Date.now()
    };

    gun.get('messages').get(chatId).set(msg);
    setText('');
    setIsTyping(false);
  };

  const handleInputChange = (e) => {
    setText(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  return (
    <div className="h-screen max-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col md:flex-row shadow-2xl">
      
      {/* Left Sidebar - Users List */}
      <div className="w-full md:w-1/3 lg:w-1/4 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-primary/10 to-sage/10">
          <div className="flex items-center space-x-3">
            <UserAvatar username={user} />
            <div>
              <h2 className="text-xl font-bold text-gray-800">Messages</h2>
              <p className="text-sm text-sage">@{user}</p>
            </div>
          </div>
        </div>

        {/* Users List with Scrollbar */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-sage/30 scrollbar-track-transparent hover:scrollbar-thumb-sage/50">
          <div className="p-4 space-y-2">
            {sortedUsers.map((u, i) => {
              const hasNewMessage = userLastMessage[u]?.hasNew && selected !== u;
              return (
                <div
                  key={i}
                  className={`group cursor-pointer p-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                    selected === u 
                      ? 'bg-gradient-to-r from-primary/20 to-sage/20 shadow-md border-l-4 border-primary' 
                      : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100'
                  }`}
                  onClick={() => {
                    setSelected(u);
                    setUserLastMessage(prev => ({
                      ...prev,
                      [u]: { ...prev[u], hasNew: false }
                    }));
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <UserAvatar username={u} />
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold truncate ${selected === u ? 'text-gray-800' : 'text-gray-700 group-hover:text-gray-800'}`}>
                        {u}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {hasNewMessage && (
                        <div className="w-3 h-3 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-bold">!</span>
                        </div>
                      )}
                      {selected === u && (
                        <div className="w-3 h-3 bg-sage rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Chat Window */}
      <div className="flex-1 flex flex-col bg-gradient-to-b from-gray-50 to-white">
        {selected ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <UserAvatar username={selected} />
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{selected}</h3>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Encryption Notice */}
            <EncryptionNotice />

            {/* Messages Area with Scrollbar */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-sage/30 scrollbar-track-transparent hover:scrollbar-thumb-sage/50 p-4 space-y-2 bg-gradient-to-b from-gray-50/50 to-white/50">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-sage/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <svg className="w-12 h-12 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-lg">Start a conversation with {selected}</p>
                    <p className="text-gray-400 text-sm mt-2">Send a message to begin chatting</p>
                  </div>
                </div>
              ) : (
                messages.map((message, i) => (
                  <MessageBubble
                    key={i}
                    message={message}
                    isOwnMessage={message.from === user}
                    user={user}
                  />
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 bg-gradient-to-r from-white to-gray-50 border-t border-gray-200">
              <form onSubmit={sendMessage} className="flex items-end space-x-3">
                <div className="flex-1 relative">
                  <input
                    value={text}
                    onChange={handleInputChange}
                    placeholder={`Message ${selected}...`}
                    className="w-full px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-full focus:outline-none focus:border-primary focus:shadow-lg transition-all duration-300 text-gray-800 placeholder-gray-500"
                    maxLength={500}
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                    <button type="button" className="p-1 rounded-full hover:bg-gray-200 transition-colors duration-200">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={!text.trim()}
                  className={`p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-primary/30 ${
                    text.trim()
                      ? 'bg-gradient-to-r from-primary to-yellow-400 text-gray-800 hover:shadow-xl active:scale-95'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
            </div>
          </>
        ) : (
          // No chat selected state
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-sage/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <svg className="w-16 h-16 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Your Chat</h3>
              <p className="text-gray-500">Select a user from the sidebar to start chatting</p>
            </div>
          </div>
        )}
      </div>

      {/* Custom Styles for Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        
        .scrollbar-thumb-sage\/30::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-thumb-sage\/30::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .scrollbar-thumb-sage\/30::-webkit-scrollbar-thumb {
          background-color: rgba(178, 172, 136, 0.3);
          border-radius: 3px;
        }
        
        .scrollbar-thumb-sage\/30:hover::-webkit-scrollbar-thumb {
          background-color: rgba(178, 172, 136, 0.5);
        }
      `}</style>
    </div>
  );
}