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
📦 ftp-uploader
┣ 📜 ftp_config.json
┣ 📜 upload.js
┗ 📁 dist/ ← your local directory (example)

---

## 🧩 1. Install Dependencies

```bash
npm install basic-ftp
