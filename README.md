# 📈 TradeTrack PRO — Quantitative Trade Logging & PnL Analytics Engine

[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-5.0-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_Cloud-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)
[![Deployment](https://img.shields.io/badge/Hosted_On-Vercel_%26_Render-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

**TradeTrack PRO** is an executive-grade, full-stack quantitative trade logging and analytics platform engineered for professional traders, prop firm candidates, and quantitative analysts. It provides real-time portfolio health tracking, psychological leak identification, setup strategy rankings, interactive PnL calendars, and automated PDF executive performance report generation.

---

## 🌟 Key Features

* **⚡ Executive 3D Aerogel Glassmorphic Interface:** Dark and light mode UI with 3D tilt interaction cards, crystal badges, and floating navigation.
* **⚡ 1-Click Double-Click Local Launcher (`run_project.bat`):** Launch backend, frontend, and open local browser automatically with zero manual terminal commands.
* **📊 Quantitative Analytics Engine:** Accurate calculation of Net PnL, Win Rate %, Profit Factor, Risk-to-Reward Ratio (RRR), total trade executions, and win/loss breakdowns.
* **🧠 Psychological Leak & Mindset Analysis:** Track emotional discipline per trade (*Disciplined, Patient, FOMO, Revenge, Fearful, Greedy*) to eliminate trading flaws.
* **📅 Interactive PnL Calendar:** Visual daily PnL breakdown with win/loss color-coded heatmaps and instant date filtering.
* **🎯 Setup Strategy Ranking & Management:** Create, manage, and evaluate win rates and profitability across custom trading strategies and setup tags.
* **🔐 Bank-Grade Security & Auth:** Token-based Django REST Framework authentication, strict CORS origin protection, dynamic host header verification, and environment variable isolation.
* **📄 Automated PDF Executive Report Generator:** Export detailed, professional quantitative analytics reports in one click using client-side PDF synthesis.
* **💾 Data Backup & CSV Import/Export:** Full trade history export to CSV and automated backup import capability.
* **💓 Keep-Alive Health Ping Endpoint (`/api/health/`):** Lightweight endpoint for 10-minute cron pings to keep cloud services awake 24/7.

---

## 🏗️ System Architecture

```mermaid
graph TD
    User([📱 / 💻 Client Browser]) -->|HTTPS Requests| Vercel[⚡ Vercel Frontend Host - React 18 / Vite]
    Vercel -->|REST API Calls| Render[🐍 Render Backend Web Service - Django REST Framework]
    Render -->|SQL Queries| NeonDB[(🐘 Neon Cloud PostgreSQL Database)]
    Render -->|Media Assets| Cloudinary[☁️ Cloudinary Media Storage]
```

---

## 🚀 Quick Setup & Installation Guide

### Prerequisites
* **Python 3.10+**
* **Node.js 18+** & `npm`
* **Git**

---

### ⚡ Method 1: 1-Click Starter (Windows Recommended)

1. **Clone Repository:**
   ```bash
   git clone https://github.com/bimalesh07/QuantJournal_Trading.git
   cd QuantJournal_Trading
   ```

2. **Double-Click `run_project.bat`:**
   - Double-click **`run_project.bat`** in the project folder.
   - It will automatically launch the Django Backend (`http://localhost:8000`), Vite Frontend (`http://localhost:3000`), and open your default browser!

3. **Double-Click `save_and_backup.bat` to sync changes:**
   - Double-click **`save_and_backup.bat`** to stage, commit, and push all project changes to GitHub in 1 click!

---

### 💻 Method 2: Manual Terminal Setup (Windows / Mac / Linux)

#### 1. Backend Setup (Django)

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# Start local Django server
python manage.py runserver 8000
```
> Backend active at: `http://localhost:8000/api/`

#### 2. Frontend Setup (React / Vite)

Open a new terminal tab:

```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Vite dev server
npm run dev
```
> Frontend active at: `http://localhost:3000/`

---

## 💓 24/7 Keep-Alive Cron Job Setup (Render / Free Hosting)

To keep your free cloud backend web service awake 24/7 without cold-start delays:

1. Sign up for free at **[cron-job.org](https://cron-job.org/)** or **[uptimerobot.com](https://uptimerobot.com/)**.
2. Create a new cron job with the following parameters:
   - **Title:** `TradeTrack Backend Ping`
   - **URL:** `https://your-backend-service.onrender.com/api/health/`
   - **Interval:** Every `10 minutes` (`*/10 * * * *`)
3. Save the cron job! Your backend will stay active 24/7 with zero spin-up delays.

---

## 🔑 Environment Variables Configuration

### Backend `.env` (`backend/.env`)
```env
SECRET_KEY=your_custom_django_secret_key
DEBUG=True
DATABASE_URL=postgresql://user:password@ep-neon-db.neon.tech/dbname?sslmode=require
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,https://your-vercel-app.vercel.app
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend `.env` (`frontend/.env`)
```env
VITE_API_URL=http://localhost:8000/api
```

---

## 🌐 Production Deployment Guide

### Backend on Render
1. Create a new **Web Service** on [Render](https://render.com/).
2. Root Directory: `backend`
3. Build Command: `./build.sh`
4. Start Command: `gunicorn trading_journal.wsgi --bind 0.0.0.0:$PORT`
5. Environment Variables:
   - `PYTHON_VERSION`: `3.11.9`
   - `SECRET_KEY`: *Your Django secret key*
   - `DATABASE_URL`: *Your Neon PostgreSQL connection string*

### Frontend on Vercel
1. Import repository on [Vercel](https://vercel.com/).
2. Root Directory: `frontend`
3. Environment Variable:
   - `VITE_API_URL`: `https://your-render-service.onrender.com/api`
4. Click **Deploy**.

---

## 👤 Author & Owner

* **Owner & Lead Developer:** Bimalesh Yadav
* **GitHub Repository:** [@bimalesh07/QuantJournal_Trading](https://github.com/bimalesh07/QuantJournal_Trading)
* **System Name:** TradeTrack PRO Quantitative Analytics Engine

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for details.
