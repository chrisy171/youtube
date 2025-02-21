# 📺 YouTube Title Updater – Automating Video Metadata Updates

### 🔥 **Dynamically updates YouTube video titles based on views, likes, comments, and top-viewing region**

![YouTube API](https://img.shields.io/badge/API-YouTube-blue?style=flat&logo=youtube)
![Node.js](https://img.shields.io/badge/Node.js-green?style=flat&logo=node.js)
![OAuth 2.0](https://img.shields.io/badge/Auth-OAuth2-red?style=flat)

## 🚀 **Project Overview**
This project automates **YouTube video title updates** by fetching real-time **video analytics** (views, likes, comments, and top-viewing country) using the **YouTube Data API and YouTube Analytics API**.

- **🎯 Goal:** Keep YouTube metadata **relevant & engaging** to improve viewer interaction.
- **⏳ Runs automatically** using `node-cron` (every minute or as scheduled).
- **🔐 Secure API Access** via OAuth 2.0 authentication.
- **📊 Dynamic metadata updates** to reflect the latest engagement statistics.

---

## ✨ **Features**
✅ Fetches **real-time video engagement data** (views, likes, comments).  
✅ Identifies **the top-viewing country** using YouTube Analytics.  
✅ Updates the **video title dynamically** to reflect engagement metrics.  
✅ Uses **OAuth 2.0** for secure API access.  
✅ Automates execution using **cron jobs**.  

### **📌 Example of Dynamic Title Updates**
| Before | After |
|--------|-------|
| `"🔥 10,000 Views - Watch Now!"` | `"🔥 25,000 Views from USA - Watch Now!"` |
| `"Must-See Video!"` | `"Must-See Video! 👍 5,000 Likes | 💬 500 Comments"` |

---

## ⚙️ **Tech Stack**
| **Technology** | **Purpose** |
|--------------|------------|
| **Node.js** | Backend execution |
| **YouTube Data API** | Fetching video details (views, likes, comments) |
| **YouTube Analytics API** | Identifying the top-viewing country |
| **OAuth 2.0** | Secure authentication for API requests |
| **`node-cron`** | Automating scheduled updates |

---

## 🛠 **Setup & Installation**
### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
