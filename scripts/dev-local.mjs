import { spawn } from 'node:child_process';

// Projeto fictício e emuladores são forçados pelo firebaseClient neste modo.
const child = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', ...process.argv.slice(2)], {
  stdio: 'inherit', env: { ...process.env, VITE_USE_FIREBASE_EMULATORS: 'true' },
});
child.on('error', error => { console.error(error); process.exitCode = 1; });
child.on('exit', code => { process.exitCode = code ?? 1; });
