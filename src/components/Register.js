// import React, { useState } from 'react';
// import { api } from '../api';
// import { gun } from '../gun';

// export default function Register() {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await api.post('/register', { username, password });

//       if (res.data.pub) {
//         // ✅ Store credentials for SEA decryption
//         localStorage.setItem('peerixUser', JSON.stringify({
//           username,
//           password,
//           pub: res.data.pub
//         }));

//         // ✅ Authenticate in Gun to initialize SEA context
//         const gunUser = gun.user();
//         gunUser.auth(username, password, (ack) => {
//           if (ack.err) {
//             console.error('Gun SEA auth failed:', ack.err);
//             setMessage("Gun auth failed after registration");
//           } else {
//             console.log("Gun auth success after register", ack);
//             setMessage(res.data.message);
//             setTimeout(() => window.location.reload(), 300);
//           }
//         });
//       } else {
//         setMessage('Registration succeeded but no pubkey returned');
//       }
//     } catch (err) {
//       if (err.response?.data?.error) {
//         setMessage(err.response.data.error);
//       } else {
//         setMessage("Something went wrong during registration");
//       }
//     }
//   };

//   return (
//     <div>
//       <h2>Register</h2>
//       <form onSubmit={handleRegister}>
//         <input
//           value={username}
//           onChange={e => setUsername(e.target.value)}
//           placeholder="Username"
//         />
//         <input
//           type="password"
//           value={password}
//           onChange={e => setPassword(e.target.value)}
//           placeholder="Password"
//         />
//         <button type="submit">Register</button>
//       </form>
//       <p>{message}</p>
//     </div>
//   );
// }

//WithoutUI

// src/components/Register.js 
// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { api } from '../api';
// import { gun } from '../gun';

// export default function Register({ setUser }) {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await api.post('/register', { username, password });

//       if (res.data.pub) {
//         const gunUser = gun.user();
//         gunUser.auth(username, password, (ack) => {
//           if (ack.err) {
//             console.error('Gun auth failed after register:', ack.err);
//             setMessage('Gun auth failed');
//             return;
//           }

//           localStorage.setItem('peerixUser', JSON.stringify({
//             username,
//             password,
//             pub: res.data.pub,
//             pair: gunUser._.sea || null
//           }));
//           setUser(username); 

//           setMessage(res.data.message);
//           setUser(username);
//           navigate('/'); // go to main chat panel
//         });
//       } else {
//         setMessage('Registration succeeded but no pubkey returned');
//       }
//     } catch (err) {
//       setMessage(err.response?.data?.error || 'Something went wrong');
//     }
//   };

//   return (
//     <div>
//       <h2>Register</h2>
//       <form onSubmit={handleRegister}>
//         <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
//         <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
//         <button type="submit">Register</button>
//       </form>
//       <p>{message}</p>
//       <p>
//         Already have an account? <Link to="/login" className="text-blue-600 underline">Login here</Link>
//       </p>
//     </div>
//   );
// }

//AlongWithUI
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import { gun } from '../gun';

export default function Register({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post('/register', { username, password });

      if (res.data.pub) {
        const gunUser = gun.user();
        gunUser.auth(username, password, (ack) => {
          if (ack.err) {
            console.error('Gun auth failed after register:', ack.err);
            setMessage('Gun auth failed');
            setIsLoading(false);
            return;
          }

          localStorage.setItem('peerixUser', JSON.stringify({
            username,
            password,
            pub: res.data.pub,
            pair: gunUser._.sea || null
          }));
          setUser(username);
          
          setMessage(res.data.message);
          setUser(username);
          navigate('/'); // go to main chat panel
        });
      } else {
        setMessage('Registration succeeded but no pubkey returned');
        setIsLoading(false);
      }
    } catch (err) {
      setMessage(err.response?.data?.error || 'Something went wrong');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage/20 via-white to-primary/10 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-terracotta rounded-full mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Join Peerix</h1>
          <p className="text-sage text-sm">Create your account to get started</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <form onSubmit={handleRegister} className="space-y-6">
            {/* Username Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 block">Username</label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full px-4 py-3 bg-white/50 border-2 border-sage/30 rounded-xl focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all duration-300 placeholder-gray-400"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="w-5 h-5 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 block">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full px-4 py-3 bg-white/50 border-2 border-sage/30 rounded-xl focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all duration-300 placeholder-gray-400"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="w-5 h-5 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-terracotta text-white py-3 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Message Display */}
          {message && (
            <div className={`mt-4 p-3 rounded-lg text-sm text-center ${
              message.includes('success') || message.includes('Welcome') 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-terracotta hover:text-primary font-semibold transition-colors duration-200 hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-sage">
            By creating an account, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
}