import https from 'https';
import http from 'http';

function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const opts = {
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
      path: parsed.pathname + parsed.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    };
    const mod = parsed.protocol === 'https:' ? https : http;
    const req = mod.request(opts, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, headers: res.headers, body: data });
      });
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

const args = process.argv.slice(2);
const action = args[0];

if (action === 'create-repo') {
  const token = args[1];
  const body = JSON.stringify({ name: 'aif-driftlens-75e9d737', description: 'DriftLens', private: false });
  const result = await request('https://api.github.com/user/repos', {
    method: 'POST',
    headers: {
      'Authorization': `token ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'Node.js',
      'Content-Length': Buffer.byteLength(body),
    },
    body,
  });
  console.log(result.status);
  console.log(result.body);
} else if (action === 'check-push') {
  const token = args[1];
  const result = await request('https://api.github.com/repos/runsmlee/aif-driftlens-75e9d737/commits/main', {
    headers: {
      'Authorization': `token ${token}`,
      'User-Agent': 'Node.js',
    },
  });
  console.log(result.status);
} else if (action === 'connect-vercel') {
  const teamId = args[1];
  const token = args[2];
  const body = JSON.stringify({ gitRepository: { type: 'github', repo: 'runsmlee/aif-driftlens-75e9d737' } });
  const result = await request(`https://api.vercel.com/v9/projects/75e9d737-2faa-4171-92a8-729693c88f79?teamId=${teamId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'Node.js',
      'Content-Length': Buffer.byteLength(body),
    },
    body,
  });
  console.log(result.status);
  console.log(result.body);
} else if (action === 'poll-deployments') {
  const teamId = args[1];
  const token = args[2];
  const result = await request(`https://api.vercel.com/v13/deployments?projectId=75e9d737-2faa-4171-92a8-729693c88f79&teamId=${teamId}&limit=1`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'User-Agent': 'Node.js',
    },
  });
  console.log(result.status);
  console.log(result.body);
} else if (action === 'verify-url') {
  const url = args[1];
  const result = await request(url, {
    headers: { 'User-Agent': 'Node.js' },
  });
  console.log(result.status);
} else if (action === 'get-project') {
  const teamId = args[1];
  const token = args[2];
  const result = await request(`https://api.vercel.com/v9/projects/75e9d737-2faa-4171-92a8-729693c88f79?teamId=${teamId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'User-Agent': 'Node.js',
    },
  });
  console.log(result.status);
  console.log(result.body);
}
