// src/GunAuthHelper.js
import { gun } from './gun';

export const safeGunAuth = (username, password) => {
  return new Promise((resolve, reject) => {
    const user = gun.user();

    // 🔄 If already authenticated with same user, return
    if (user.is && user.is.alias === username) {
      return resolve(user);
    }

    // 🧹 Clear internal state (most aggressive reset)
    user.leave();
    gun._.user = null; // ← THIS is the missing line

    // ⏱ wait for cleanup
    setTimeout(() => {
      user.auth(username, password, (ack) => {
        if (ack.err) return reject(ack.err);
        resolve(user);
      });
    }, 500);
  });
};
