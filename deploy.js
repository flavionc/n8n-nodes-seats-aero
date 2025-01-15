const { execSync } = require('child_process');
const path = require('path');

const userProfile = process.env.USERPROFILE;
const n8nPath = path.join(userProfile, '.n8n', 'custom', 'nodes');

try {
    execSync('npm run build', { stdio: 'inherit' });
    execSync('npm pack', { stdio: 'inherit' });
    execSync(`copy n8n-nodes-seats-aero-0.1.0.tgz "${n8nPath}"`, { stdio: 'inherit' });
    execSync(`cd "${n8nPath}" && npm install n8n-nodes-seats-aero-0.1.0.tgz`, { stdio: 'inherit' });
    console.log('Deployment successful!');
} catch (error) {
    console.error('Deployment failed:', error);
}