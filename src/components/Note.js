// // // src/components/Notes.js
// import React, { useState, useEffect } from 'react';
// import { gun } from '../gun'; // import Gun.js instance

// export default function Notes() {
//   const [userId, setUserId] = useState('');
//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
//   const [notes, setNotes] = useState([]);
//   const [message, setMessage] = useState('');

//   // Load logged-in user from localStorage
//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem('peerixUser'));
//     if (stored?.username) {
//       setUserId(stored.username);
//     }
//   }, []);

//   // Real-time listener for notes
//   useEffect(() => {
//     if (!userId) return;

//     const userNotes = gun.get('notes').get(userId);
//     const updatedNotes = {};

//     userNotes.map().on((note, id) => {
//       if (note && note.title) {
//         updatedNotes[id] = note;

//         // Convert object to array
//         setNotes(Object.values(updatedNotes));
//       }
//     });

//     return () => {
//       userNotes.off(); // clean up listener
//     };
//   }, [userId]);

//   // Add new note
//   const addNote = (e) => {
//     e.preventDefault();
//     if (!title || !content) {
//       setMessage('Title and content are required');
//       return;
//     }

//     const note = {
//       title,
//       content,
//       timestamp: Date.now(),
//     };

//     gun.get('notes').get(userId).set(note);

//     setTitle('');
//     setContent('');
//     setMessage('Note added!');
//   };

//   return (
//     <div style={{ marginBottom: '2rem' }}>
//       <h2>Your Notes (Realtime)</h2>

//       {message && <p>{message}</p>}

//       <form onSubmit={addNote} style={{ marginBottom: '1rem' }}>
//         <div>
//           <input
//             type="text"
//             value={title}
//             onChange={e => setTitle(e.target.value)}
//             placeholder="Title"
//             style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
//           />
//         </div>
//         <div>
//           <textarea
//             value={content}
//             onChange={e => setContent(e.target.value)}
//             placeholder="Content"
//             rows={4}
//             style={{ width: '100%', padding: '8px' }}
//           />
//         </div>
//         <button type="submit" style={{ marginTop: '8px' }}>
//           Add Note
//         </button>
//       </form>

//       <ul>
//         {notes.map((n, i) => (
//           <li key={i} style={{ marginBottom: '8px' }}>
//             <strong>{n.title}</strong> <em>({new Date(n.timestamp).toLocaleString()})</em>
//             <p>{n.content}</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// src/components/Notes.js
// src/components/Notes.js
// // src/components/Notes.js
// import React, { useState, useEffect } from 'react';
// import { gun } from '../gun';

// export default function Notes() {
//   const [userId, setUserId] = useState('');
//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
//   const [notes, setNotes] = useState([]);
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem('peerixUser'));
//     if (stored?.username) {
//       setUserId(stored.username);
//     }
//   }, []);

//   useEffect(() => {
//     if (!userId) return;

//     const userNotes = gun.get('notes').get(userId);
//     const updatedNotes = {};

//     userNotes.map().on((note, id) => {
//       if (note && note.title) {
//         updatedNotes[id] = note;
//         const all = Object.values(updatedNotes).sort((a, b) => a.timestamp - b.timestamp);
//         setNotes(all);
//         localStorage.setItem(`notes-${userId}`, JSON.stringify(all));
//       }
//     });

//     return () => userNotes.off();
//   }, [userId]);

//   // 🧠 Restore notes from cache on page refresh (offline)
//   useEffect(() => {
//     const cached = localStorage.getItem(`notes-${userId}`);
//     if (cached) {
//       setNotes(JSON.parse(cached));
//     }
//   }, [userId]);

//   const addNote = (e) => {
//     e.preventDefault();
//     if (!title || !content) {
//       setMessage('Title and content are required');
//       return;
//     }

//     const note = {
//       title,
//       content,
//       timestamp: Date.now()
//     };

//     gun.get('notes').get(userId).set(note);

//     setTitle('');
//     setContent('');
//     setMessage('Note added!');
//   };

//   return (
//     <div style={{ marginBottom: '2rem' }}>
//       <h2>Your Notes (Offline Persistent)</h2>
//       {message && <p>{message}</p>}

//       <form onSubmit={addNote} style={{ marginBottom: '1rem' }}>
//         <input
//           value={title}
//           onChange={e => setTitle(e.target.value)}
//           placeholder="Title"
//           style={{ width: '100%', padding: '8px', marginBottom: '8px' }}
//         />
//         <textarea
//           value={content}
//           onChange={e => setContent(e.target.value)}
//           placeholder="Content"
//           rows={4}
//           style={{ width: '100%', padding: '8px' }}
//         />
//         <button type="submit" style={{ marginTop: '8px' }}>
//           Add Note
//         </button>
//       </form>

//       <ul>
//         {notes.map((n, i) => (
//           <li key={i}>
//             <strong>{n.title}</strong> <em>({new Date(n.timestamp).toLocaleString()})</em>
//             <p>{n.content}</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

//with encryption
// src/components/Note.js
// import React, { useState, useEffect } from 'react';
// import { gun } from '../gun';
// import { generateKey, encryptData, decryptData } from '../cryptoHelper';

// export default function Notes() {
//   const [userId, setUserId] = useState('');
//   const [key, setKey] = useState(null);
//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
//   const [notes, setNotes] = useState([]);
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem('peerixUser'));
//     if (stored?.username && stored?.password) {
//       setUserId(stored.username);
//       generateKey(stored.password).then(setKey);
//     }
//   }, []);

//   useEffect(() => {
//     if (!userId || !key) return;

//     const userNotes = gun.get('notes').get(userId);
//     const updatedNotes = {};

//     userNotes.map().on(async (note, id) => {
//       if (note?.iv && note?.data) {
//         const decrypted = await decryptData(note, key);
//         if (decrypted?.title) {
//           updatedNotes[id] = decrypted;
//           const all = Object.values(updatedNotes).sort((a, b) => a.timestamp - b.timestamp);
//           setNotes(all);
//           localStorage.setItem(`notes-${userId}`, JSON.stringify(all));
//         }
//       }
//     });

//     return () => gun.get('notes').get(userId).off();
//   }, [userId, key]);

//   useEffect(() => {
//     const cached = localStorage.getItem(`notes-${userId}`);
//     if (cached) setNotes(JSON.parse(cached));
//   }, [userId]);

//   const addNote = async (e) => {
//     e.preventDefault();
//     if (!title || !content || !key) return setMessage("Missing info or key");

//     const note = { title, content, timestamp: Date.now() };
//     const encrypted = await encryptData(note, key);

//     gun.get('notes').get(userId).set(encrypted);
//     setTitle('');
//     setContent('');
//     setMessage("Encrypted note saved!");
//   };

//   return (
//     <div>
//       <h2>Your Notes (Encrypted)</h2>
//       {message && <p>{message}</p>}
//       <form onSubmit={addNote}>
//         <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
//         <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Content" />
//         <button type="submit">Add Note</button>
//       </form>
//       <ul>
//         {notes.map((n, i) => (
//           <li key={i}><strong>{n.title}</strong> <em>({new Date(n.timestamp).toLocaleString()})</em><p>{n.content}</p></li>
//         ))}
//       </ul>
//     </div>
//   );
// }

//PerfectwithoutUI
// src/components/Note.js
// import React, { useState, useEffect } from 'react';
// import { gun } from '../gun';
// import { encryptData, decryptData } from '../cryptoHelper';

// export default function Notes() {
//   const [userId, setUserId] = useState('');
//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
//   const [notes, setNotes] = useState([]);
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem('peerixUser'));
//     if (stored?.username) {
//       setUserId(stored.username);
//     }
//   }, []);

//   useEffect(() => {
//     if (!userId) return;

//     const updatedNotes = {};
//     const userNotes = gun.get('notes').get(userId);

//     userNotes.map().on(async (note, id) => {
//       if (!note?.data) return;
//       try {
//         const decrypted = await decryptData(note.data);
//         if (decrypted?.title) {
//           updatedNotes[id] = decrypted;
//           const sorted = Object.values(updatedNotes).sort((a, b) => a.timestamp - b.timestamp);
//           setNotes(sorted);
//           localStorage.setItem(`notes-${userId}`, JSON.stringify(sorted));
//         }
//       } catch (err) {
//         console.warn('Note decryption failed:', err);
//       }
//     });

//     return () => userNotes.off();
//   }, [userId]);

//   useEffect(() => {
//     const cached = localStorage.getItem(`notes-${userId}`);
//     if (cached) setNotes(JSON.parse(cached));
//   }, [userId]);

//   const addNote = async (e) => {
//     e.preventDefault();
//     if (!title || !content) return setMessage('Missing title/content');

//     const note = { title, content, timestamp: Date.now() };
//     const encrypted = await encryptData(note);
//     gun.get('notes').get(userId).set({ data: encrypted });

//     setTitle('');
//     setContent('');
//     setMessage('Encrypted note saved!');
//   };

//   return (
//     <div style={{ marginBottom: '2rem' }}>
//       <h2>Your Notes (Encrypted + Offline)</h2>
//       {message && <p>{message}</p>}
//       <form onSubmit={addNote}>
//         <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
//         <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Content" />
//         <button type="submit">Add Encrypted Note</button>
//       </form>
//       <ul>
//         {notes.map((n, i) => (
//           <li key={i}>
//             <strong>{n.title}</strong> ({new Date(n.timestamp).toLocaleString()})
//             <p>{n.content}</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

//Along with Ui

import React, { useState, useEffect } from 'react';
import { gun } from '../gun';
import { encryptData, decryptData } from '../cryptoHelper';

export default function Notes() {
  const [userId, setUserId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState([]);
  const [message, setMessage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('peerixUser'));
    if (stored?.username) {
      setUserId(stored.username);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const updatedNotes = {};
    const userNotes = gun.get('notes').get(userId);

    userNotes.map().on(async (note, id) => {
      if (!note?.data) return;
      try {
        const decrypted = await decryptData(note.data);
        if (decrypted?.title) {
          updatedNotes[id] = { ...decrypted, id };
          const sorted = Object.values(updatedNotes).sort((a, b) => b.timestamp - a.timestamp);
          setNotes(sorted);
          localStorage.setItem(`notes-${userId}`, JSON.stringify(sorted));
        }
      } catch (err) {
        console.warn('Note decryption failed:', err);
      }
    });

    return () => userNotes.off();
  }, [userId]);

  useEffect(() => {
    const cached = localStorage.getItem(`notes-${userId}`);
    if (cached) setNotes(JSON.parse(cached));
  }, [userId]);

  const addNote = async (e) => {
    e.preventDefault();
    if (!title || !content) return setMessage('Missing title/content');

    const note = { title, content, timestamp: Date.now() };
    const encrypted = await encryptData(note);
    gun.get('notes').get(userId).set({ data: encrypted });

    setTitle('');
    setContent('');
    setShowAddForm(false);
    setMessage('Encrypted note saved!');
    setTimeout(() => setMessage(''), 3000);
  };

  const deleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    
    gun.get('notes').get(userId).get(noteId).put(null);
    setNotes(notes.filter(n => n.id !== noteId));
    localStorage.setItem(`notes-${userId}`, JSON.stringify(notes.filter(n => n.id !== noteId)));
    setMessage('Note deleted successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const startEdit = (note) => {
    setEditingNote(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const saveEdit = async () => {
    if (!editTitle || !editContent) return setMessage('Missing title/content');

    const updatedNote = { 
      title: editTitle, 
      content: editContent, 
      timestamp: Date.now(),
      edited: true 
    };
    const encrypted = await encryptData(updatedNote);
    gun.get('notes').get(userId).get(editingNote).put({ data: encrypted });

    setEditingNote(null);
    setEditTitle('');
    setEditContent('');
    setMessage('Note updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const cancelEdit = () => {
    setEditingNote(null);
    setEditTitle('');
    setEditContent('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Your Notes</h2>
          <p className="text-sm text-gray-500 mt-1">Encrypted & Offline Storage</p>
        </div>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-primary to-yellow-400 text-gray-900 font-semibold px-6 py-2.5 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Note</span>
          </button>
        )}
      </div>

      {/* Message */}
      {message && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl flex items-center space-x-2 animate-fade-in">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{message}</span>
        </div>
      )}

      {/* Add Note Form */}
      {showAddForm && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <span>Create New Note</span>
            </h3>
            <button
              onClick={() => {
                setShowAddForm(false);
                setTitle('');
                setContent('');
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={addNote} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter note title..."
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200 bg-gray-50/50"
                autoFocus
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Write your note content here..."
                rows={4}
                className="w-full p-3 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200 bg-gray-50/50"
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setTitle('');
                  setContent('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-primary to-yellow-400 text-gray-900 font-semibold px-6 py-2 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Add Encrypted Note
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notes List */}
      <div className="space-y-4">
        {notes.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">No encrypted notes yet</h3>
            <p className="text-gray-400">Create your first secure note above</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {notes.map((note, index) => (
              <div
                key={note.id || index}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 group"
              >
                {editingNote === note.id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-800 flex items-center space-x-2">
                        <div className="w-5 h-5 bg-sage/20 rounded flex items-center justify-center">
                          <svg className="w-3 h-3 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </div>
                        <span>Editing Note</span>
                      </h4>
                    </div>
                    
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage/20 focus:border-sage/50 transition-all duration-200 bg-gray-50/50 font-medium"
                        placeholder="Note title..."
                      />
                      <textarea
                        value={editContent}
                        onChange={e => setEditContent(e.target.value)}
                        rows={4}
                        className="w-full p-3 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-sage/20 focus:border-sage/50 transition-all duration-200 bg-gray-50/50"
                        placeholder="Note content..."
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={cancelEdit}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveEdit}
                        className="bg-gradient-to-r from-sage to-emerald-500 text-white font-semibold px-6 py-2 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {note.edited && (
                            <span className="px-2 py-1 bg-sage/10 text-sage text-xs rounded-full">Edited</span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{note.title}</h3>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{note.content}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-4">
                        <button
                          onClick={() => startEdit(note)}
                          className="p-2 text-gray-400 hover:text-sage hover:bg-sage/10 rounded-lg transition-all duration-200"
                          title="Edit note"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="p-2 text-gray-400 hover:text-terracotta hover:bg-terracotta/10 rounded-lg transition-all duration-200"
                          title="Delete note"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{new Date(note.timestamp).toLocaleString()}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-xs text-gray-400">encrypted</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}