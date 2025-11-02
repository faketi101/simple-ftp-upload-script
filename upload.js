import fs from "fs";
import path from "path";
import ftp from "basic-ftp";

const __dirname = process.cwd();

async function uploadDirectory(client, localDir, remoteDir) {
  await client.ensureDir(remoteDir);

  const items = fs.readdirSync(localDir);

  for (const item of items) {
    const localPath = path.join(localDir, item);
    const remotePath = path.posix.join(remoteDir, item);
    const stat = fs.statSync(localPath);

    if (stat.isFile()) {
      console.log(`📤 Uploading file: ${localPath} -> ${remotePath}`);
      await client.uploadFrom(localPath, remotePath);
    } else if (stat.isDirectory()) {
      console.log(`📁 Entering directory: ${localPath}`);
      await uploadDirectory(client, localPath, remotePath);
    }
  }
}

async function main() {
  // Step 1: Load config
  const configPath = path.join(__dirname, "ftp_config.json");
  if (!fs.existsSync(configPath)) {
    console.error("❌ config.json not found!");
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  const { host, user, password, secure, remoteDir, localDir } = config.ftp;

  if (!localDir) {
    console.error("❌ 'localDir' not defined in config.json");
    process.exit(1);
  }

  const localPath = path.join(__dirname, localDir);
  if (!fs.existsSync(localPath)) {
    console.error(`❌ Local directory not found: ${localPath}`);
    process.exit(1);
  }

  // Step 2: Connect to FTP
  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    await client.access({ host, user, password, secure });
    console.log(`✅ Connected to ${host}`);

    // Step 3: Upload recursively
    await uploadDirectory(client, localPath, remoteDir);

    console.log("🎉 Upload complete!");
  } catch (err) {
    console.error("🚨 FTP Upload failed:", err);
  } finally {
    client.close();
  }
}

main();
