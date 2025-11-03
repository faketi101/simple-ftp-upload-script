# FTP Upload Automation Script

This Node.js script uploads a local directory (like `dist`) to an FTP server defined in your configuration file.  
It automatically **clears the remote directory** before uploading new files — ensuring your server always has the latest version.

---

## ⚙️ Features

- ✅ Reads FTP credentials from `ftp_config.json`
- ✅ Automatically clears the target directory on the FTP server before uploading
- ✅ Uploads everything recursively from your local folder (like `dist`)
- ✅ Clean and minimal configuration

---

## 🧩 Project Structure

```
project-root/
│
├── ftp_config.json
├── upload.js
└── README.md
```

---

## 🛠️ Example `ftp_config.json`

```json
{
  "host": "ftp.example.com",
  "user": "ftp_username",
  "password": "ftp_password",
  "remoteDir": "/public_html/your_project_folder"
}
```

---

## 🚀 Example `upload.js`

```js
import fs from "fs";
import ftp from "basic-ftp";

async function uploadDirectory(localDir) {
  const config = JSON.parse(fs.readFileSync("ftp_config.json", "utf8"));
  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    await client.access({
      host: config.host,
      user: config.user,
      password: config.password,
      secure: false,
    });

    console.log("Connected to FTP server");

    // Clear remote directory first
    console.log("Clearing remote directory:", config.remoteDir);
    await client.ensureDir(config.remoteDir);
    await client.clearWorkingDir();

    // Upload local directory
    console.log("Uploading directory:", localDir);
    await client.uploadFromDir(localDir);

    console.log("✅ Upload completed successfully!");
  } catch (err) {
    console.error("❌ Error:", err);
  }

  client.close();
}

// Take directory name from command-line argument
const localDir = process.argv[2];
if (!localDir) {
  console.error("Usage: node upload.js <local_directory>");
  process.exit(1);
}

uploadDirectory(localDir);
```

---

## 💻 Usage

1. Place your `ftp_config.json` file in the same folder as `upload.js`  
2. Run the script with:
   ```bash
   node upload.js dist
   ```
   > The script will read the `dist` folder and upload it to the remote directory specified in `ftp_config.json`.

---

## 👨‍💻 Author

**Tarikul Islam**  
Frontend Developer & Web Enthusiast  
🌐 [tarikul-islam.dev](https://tarikul-islam.dev)  
💼 [LinkedIn](https://www.linkedin.com/in/tarikul-islam)

---

**⭐ Tip:** Keep your FTP credentials private. Never commit `ftp_config.json` to GitHub.
