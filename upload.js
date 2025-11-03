import fs from "fs";
import path from "path";
import ftp from "basic-ftp";

const __dirname = process.cwd();

// Recursively delete all files and folders from a remote directory
async function clearRemoteDirectory(client, remoteDir) {
  try {
    await client.cd(remoteDir);
    const list = await client.list();

    for (const item of list) {
      const fullPath = path.posix.join(remoteDir, item.name);
      if (item.isDirectory) {
        console.log(`🗑️ Removing remote directory: ${fullPath}`);
        await clearRemoteDirectory(client, fullPath);
        await client.removeDir(fullPath);
      } else {
        console.log(`🗑️ Deleting remote file: ${fullPath}`);
        await client.remove(fullPath);
      }
    }
  } catch (err) {
    console.warn(`⚠️ Could not clear remote directory ${remoteDir}:`, err.message);
  }
}

// Recursively upload all files and folders from local to remote
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
  const configPath = path.join(__dirname, "ftp_config.json");

  if (!fs.existsSync(configPath)) {
    console.error("❌ ftp_config.json not found!");
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  const { host, user, password, secure, remoteDir, localDir } = config.ftp;

  if (!localDir) {
    console.error("❌ 'localDir' not defined in ftp_config.json");
    process.exit(1);
  }

  const localPath = path.join(__dirname, localDir);
  if (!fs.existsSync(localPath)) {
    console.error(`❌ Local directory not found: ${localPath}`);
    process.exit(1);
  }

  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    await client.access({ host, user, password, secure });
    console.log(`✅ Connected to ${host}`);

    console.log(`🚮 Clearing remote directory: ${remoteDir}`);
    await clearRemoteDirectory(client, remoteDir);

    console.log(`📤 Uploading local directory: ${localDir}`);
    await uploadDirectory(client, localPath, remoteDir);

    console.log("🎉 Upload complete!");
  } catch (err) {
    console.error("🚨 FTP Upload failed:", err);
  } finally {
    client.close();
  }
}

main();
