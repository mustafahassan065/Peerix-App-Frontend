// src/api.js
import axios from 'axios';

export const api = axios.create({
  //baseURL: 'http://localhost:9000/api', // backend URL
  baseURL: 'https://4af047bf-3f87-407d-a16b-b1f02ba7699b-00-1hjhdns8hkv6.sisko.replit.dev/'
});
