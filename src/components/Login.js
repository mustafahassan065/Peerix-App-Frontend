// import React, { useState } from 'react';
// import { api } from '../api';
// import { gun } from '../gun';

// export default function Login() {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await api.post('/login', { username, password });

//       localStorage.setItem('peerixUser', JSON.stringify({
//         username,
//         password,
//         pub: res.data.pub
//       }));

//       // ✅ Authenticate into Gun to unlock SEA context
//       const gunUser = gun.user();
//       gunUser.auth(username, password, (ack) => {
//         if (ack.err) {
//           console.error("Gun login failed:", ack.err);
//           setMessage("Gun login failed");
//         } else {
//           console.log("Gun login success:", ack);
//           setMessage(res.data.message);
//           setTimeout(() => window.location.reload(), 300);
//         }
//       });
//     } catch (err) {
//       if (err.response?.data?.error) {
//         setMessage(err.response.data.error);
//       } else {
//         setMessage("Something went wrong during login");
//       }
//     }
//   };

//   return (
//     <div>
//       <h2>Login</h2>
//       <form onSubmit={handleLogin}>
//         <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
//         <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
//         <button type="submit">Login</button>
//       </form>
//       <p>{message}</p>
//     </div>
//   );
// }
// // src/components/Login.js 
// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { api } from '../api';
// import { gun } from '../gun';

// export default function Login({ setUser }) {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await api.post('/login', { username, password });

//       const gunUser = gun.user();
//       gunUser.auth(username, password, (ack) => {
//         if (ack.err) {
//           console.error("Gun login failed:", ack.err);
//           setMessage("Gun login failed");
//           return;
//         }

//         localStorage.setItem('peerixUser', JSON.stringify({
//           username,
//           password,
//           pub: res.data.pub,
//           pair: gunUser._.sea || null
//         }));
//         setUser(username); 

//         setMessage(res.data.message);
//         setUser(username);
//         navigate('/'); // go to main chat panel
//       });
//     } catch (err) {
//       setMessage(err.response?.data?.error || 'Something went wrong');
//     }
//   };

//   return (
//     <div>
//       <h2>Login</h2>
//       <form onSubmit={handleLogin}>
//         <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
//         <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
//         <button type="submit">Login</button>
//       </form>
//       <p>{message}</p>
//       <p>
//         Don't have an account? <Link to="/register" className="text-blue-600 underline">Register here</Link>
//       </p>
//     </div>
//   );
// }

//Along with Ui

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import { gun } from '../gun';

export default function Login({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post('/login', { username, password });

      const gunUser = gun.user();
      gunUser.auth(username, password, (ack) => {
        if (ack.err) {
          console.error("Gun login failed:", ack.err);
          setMessage("Gun login failed");
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
    } catch (err) {
      setMessage(err.response?.data?.error || 'Something went wrong');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-terracotta/20 via-white to-sage/10 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-terracotta to-primary rounded-full mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-sage text-sm">Sign in to continue to Peerix</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 block">Username</label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full px-4 py-3 bg-white/50 border-2 border-sage/30 rounded-xl focus:border-terracotta focus:outline-none focus:ring-4 focus:ring-terracotta/20 transition-all duration-300 placeholder-gray-400"
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
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-white/50 border-2 border-sage/30 rounded-xl focus:border-terracotta focus:outline-none focus:ring-4 focus:ring-terracotta/20 transition-all duration-300 placeholder-gray-400"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="w-5 h-5 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <a href="#" className="text-sm text-terracotta hover:text-primary transition-colors duration-200 hover:underline">
                Forgot your password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-terracotta to-primary text-white py-3 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                'Sign In'
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

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-primary hover:text-terracotta font-semibold transition-colors duration-200 hover:underline"
              >
                Create one here
              </Link>
            </p>
          </div>
        </div>

        {/* Additional Options */}
        <div className="mt-6 space-y-4">
          {/* Social Login Options */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-sage/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gradient-to-br from-terracotta/20 via-white to-sage/10 text-sage">
                Quick & Secure Login
              </span>
            </div>
          </div>
          
          {/* Security Note */}
          <div className="text-center">
            <p className="text-xs text-sage flex items-center justify-center space-x-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Your data is encrypted and secure</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}