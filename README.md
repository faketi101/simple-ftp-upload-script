# 🚀 FTP Uploader Script (by Tarikul Islam)

A simple and efficient **Node.js** script that uploads a local directory to an FTP server automatically.  
It reads all FTP credentials and directory info from a **`ftp_config.json`** file — no manual commands needed!

---

## ⚙️ Features
- 📁 Uploads all files and subfolders recursively  
- ⚡ Reads FTP info and directory path from `ftp_config.json`  
- 🔒 Supports secure (FTPS) or standard FTP connections  
- 🧹 Automatically ensures remote directories exist  
- 🧰 Simple one-command deployment  

---

## 📄 Project Structure

```
📦 ftp-uploader
 ┣ 📜 ftp_config.json
 ┣ 📜 upload.js
 ┗ 📁 dist/                ← your local directory (example)
```

---

## 🧩 1. Install Dependencies as Dev

```bash
npm install basic-ftp -D
```

---

## ⚙️ 2. Configure FTP Settings

Create a file named **`ftp_config.json`** in the same directory as your `upload.js` file:

```json
{
  "ftp": {
    "host": "ftp.yourdomain.com",
    "user": "yourusername",
    "password": "yourpassword",
    "secure": false,
    "remoteDir": "/",
    "localDir": "dist"
  }
}
```

> 📝 **Tip:** You can rename the folder (`dist`) or remote path as needed.

---

## 💻 3. The Upload Script

Click the button below to **copy the full upload script** 👇  

<a href="https://gist.github.com/" target="_blank">
  <img src="https://img.shields.io/badge/📋%20Click%20to%20Copy-Upload%20Script-blue?style=for-the-badge">
</a>

```js
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

    await uploadDirectory(client, localPath, remoteDir);

    console.log("🎉 Upload complete!");
  } catch (err) {
    console.error("🚨 FTP Upload failed:", err);
  } finally {
    client.close();
  }
}

main();
```

---

## ▶️ 4. Run the Script

Simply run:

```bash
node upload.js
```

✅ The script will:
- Read FTP info from `ftp_config.json`
- Upload all files in the specified `localDir` to the `remoteDir`

---

## 🧑‍💻 Author

**Tarikul Islam**   
🌐 [Personal Website](https://tarikul.dev)  
💼 [LinkedIn](https://linkedin.com/in/its-tarikul-islam)  

---

## 📜 License

MIT License © 2025 — Tarikul Islam  
Feel free to modify and distribute for personal or commercial projects.
