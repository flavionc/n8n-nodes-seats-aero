const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const userProfile = process.env.USERPROFILE;
const n8nPath = path.join(userProfile, '.n8n', 'custom', 'nodes');
const packageName = 'n8n-nodes-seats-aero-0.1.0.tgz';

try {
    // Build the project
    console.log('Building project...');
    execSync('npm run build', { stdio: 'inherit' });
    
    // Create package
    console.log('Creating package...');
    execSync('npm pack', { stdio: 'inherit' });
    
    // Verify if package was created
    if (!fs.existsSync(packageName)) {
        throw new Error('Package file not found after npm pack');
    }

    // Create destination directory if it doesn't exist
    if (!fs.existsSync(n8nPath)) {
        console.log('Creating custom nodes directory...');
        fs.mkdirSync(n8nPath, { recursive: true });
    }

    // Copy package to n8n custom nodes directory
    console.log('Copying package...');
    fs.copyFileSync(packageName, path.join(n8nPath, packageName));
    
    // Install package in n8n custom nodes directory
    console.log('Installing package...');
    execSync(`cd "${n8nPath}" && npm install ${packageName}`, { stdio: 'inherit' });
    
    console.log('Deployment successful!');
} catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
}
