// src/gun.js
// import Gun from 'gun';
// import 'gun/sea'; // ✅ Required for encryption (E2EE)
// import 'gun/lib/path'; // optional, for advanced data paths

// export const gun = Gun({
//   peers: ['http://localhost:9000/gun']
// });

// export { Gun }; // so you can use Gun.SEA in other files
// src/gun.js
import Gun from 'gun';
import 'gun/sea'; // SEA is still fine to keep (for future use if needed)
import 'gun/lib/path';
import 'gun/lib/radix';
import 'gun/lib/radisk';
import 'gun/lib/store';
import 'gun/lib/rindexed'; // ✅ For IndexedDB support (offline)

// ✅ Gun instance with localStorage and radisk (offline)
export const gun = Gun({
  peers: ['http://localhost:9000/gun'],
  localStorage: true,
  radisk: true
});

export { Gun }; // optional, in case you need Gun.SEA in future
