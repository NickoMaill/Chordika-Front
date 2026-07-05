import { spawn } from "child_process"
const isWindows = process.platform === 'win32';

// Get args passed to the script (after `--`)
const args = process.argv.slice(2);

const shell = isWindows ? 'powershell' : 'sh';
const script = isWindows ? './scripts/dev.ps1' : './scripts/dev.sh';

const child = spawn(shell, [script, ...args], {
  stdio: 'inherit',
  shell: true,
});

child.on('exit', (code) => {
  process.exit(code);
});