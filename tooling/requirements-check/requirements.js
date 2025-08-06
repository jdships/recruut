import { execSync } from 'child_process';

function checkPnpmVersion() {
  const requiredPnpmVersion = '>=9.12.0';
  const currentPnpmVersion = execSync('pnpm --version').toString().trim();
  const [major, minor] = currentPnpmVersion.split('.').map(Number);

  if (!currentPnpmVersion) {
    console.error(
      `\x1b[31m%s\x1b[0m`,
      `You are running the application from a directory that does not have pnpm installed. Please install pnpm and run "pnpm install" in your project directory.`,
    );

    process.exit(1);
  }

  if (major < 9) {
    console.error(
      `\x1b[31m%s\x1b[0m`,
      `You are running pnpm ${currentPnpmVersion}. The application requires pnpm ${requiredPnpmVersion}.`,
    );

    process.exit(1);
  }

  if (major === 9 && minor < 12) {
    console.warn(
      `\x1b[33m%s\x1b[0m`,
      `You are running pnpm ${currentPnpmVersion}. Recommendation is pnpm 9.12.0 or higher.`,
    );
  } else {
    console.log(
      `\x1b[32m%s\x1b[0m`,
      `You are running pnpm ${currentPnpmVersion}.`,
    );
  }
}

function checkNodeVersion() {
  const requiredNodeVersion = '>=v20';
  const currentNodeVersion = process.versions.node;
  const [major] = currentNodeVersion.split('.').map(Number);

  if (major < 20) {
    console.error(
      `\x1b[31m%s\x1b[0m`,
      `You are running Node ${currentNodeVersion}. Application requires Node ${requiredNodeVersion}.`,
    );

    process.exit(1);
  } else {
    console.log(
      `\x1b[32m%s\x1b[0m`,
      `You are running Node ${currentNodeVersion}.`,
    );
  }
}

function checkPathNotOneDrive() {
  const path = process.cwd();

  if (path.includes('OneDrive')) {
    console.error(
      `\x1b[31m%s\x1b[0m`,
      `You are running the application from OneDrive. Please move your project to a local folder.`,
    );

    process.exit(1);
  }
}

function checkRequirements() {
  checkNodeVersion();
  checkPathNotOneDrive();
  checkPnpmVersion();
}

void checkRequirements();
