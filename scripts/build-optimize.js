#!/usr/bin/env node

/**
 * Build Optimization Script
 * Analyzes and optimizes the Miraa Transport build
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting Miraa Transport Build Optimization...\n');

// 1. Clean previous builds
console.log('🧹 Cleaning previous builds...');
try {
  if (fs.existsSync('build')) {
    execSync('rm -rf build', { stdio: 'inherit' });
  }
  console.log('✅ Build directory cleaned\n');
} catch (error) {
  console.log('⚠️  Build cleanup skipped (not found)\n');
}

// 2. Run TypeScript check
console.log('🔍 Running TypeScript checks...');
try {
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log('✅ TypeScript checks passed\n');
} catch (error) {
  console.log('❌ TypeScript errors found - check output above\n');
  process.exit(1);
}

// 3. Run ESLint
console.log('📝 Running ESLint...');
try {
  execSync('npm run lint', { stdio: 'inherit' });
  console.log('✅ Linting passed\n');
} catch (error) {
  console.log('⚠️  Linting issues found - check output above\n');
}

// 4. Build the application
console.log('🔨 Building application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully\n');
} catch (error) {
  console.log('❌ Build failed - check output above\n');
  process.exit(1);
}

// 5. Analyze bundle (if bundle analyzer is installed)
console.log('📊 Analyzing bundle size...');
try {
  execSync('npx bundle-analyzer build/static/js/*.js', { stdio: 'inherit' });
  console.log('✅ Bundle analysis completed\n');
} catch (error) {
  console.log('⚠️  Bundle analyzer not available\n');
}

// 6. Generate build info
console.log('📋 Generating build information...');
const buildInfo = {
  timestamp: new Date().toISOString(),
  version: process.env.REACT_APP_VERSION || '1.0.0',
  gitCommit: execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim(),
  gitBranch: execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim(),
  nodeVersion: process.version,
  platform: process.platform
};

fs.writeFileSync(
  path.join('build', 'build-info.json'),
  JSON.stringify(buildInfo, null, 2)
);

console.log('✅ Build info generated\n');

// 7. Size analysis
console.log('📏 Analyzing build size...');
try {
  const buildSize = execSync('du -sh build', { encoding: 'utf8' });
  console.log(`📦 Total build size: ${buildSize.trim()}`);
} catch (error) {
  console.log('⚠️  Size analysis not available on this platform\n');
}

console.log('🎉 Build optimization completed successfully!');
console.log('📍 Build output available in: ./build/');
