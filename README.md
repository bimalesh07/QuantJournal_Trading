# 📈 TradeTrack PRO — Quantitative Trade Logging & PnL Analytics Engine

[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-5.0-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_Cloud-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)
[![Deployment](https://img.shields.io/badge/Hosted_On-Vercel_%26_Render-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

**TradeTrack PRO** is an executive-grade, full-stack quantitative trade logging and analytics platform engineered for professional traders, prop firm funding candidates, and quantitative analysts. It provides real-time portfolio health tracking, psychological leak identification, setup strategy rankings, interactive PnL calendars, and automated PDF executive performance report generation.

---

## 🌟 Key Features

* **⚡ Executive 3D Aerogel Glassmorphic Interface:** State-of-the-art dark and light mode UI with 3D tilt interactions, crystal badges, and sleek floating navigation.
* **📱 100% Mobile Native Responsiveness:** Dedicated Glassmorphic Hamburger Drawer navigation, touch-friendly tab switching, and zero text/table clipping across all mobile viewports.
* **📊 Quantitative Analytics Engine:** Real-time calculation of Net PnL, Win Rate %, Profit Factor, Risk-to-Reward Ratio (RRR), total trade executions, and win/loss breakdowns.
* **🧠 Psychological Leak & Mindset Analysis:** Track emotional discipline per trade (*Disciplined, Patient, FOMO, Revenge, Fearful, Greedy*) to eliminate trading flaws.
* **📅 Interactive PnL Calendar:** Visual daily PnL breakdown with win/loss color-coded heatmaps and instant date filtering.
* **🎯 Setup Strategy Ranking & Management:** Create, manage, and evaluate win rates and profitability across custom trading strategies and setup tags.
* **🔐 Bank-Grade Security & Auth:** Token-based Django REST Framework authentication, strict CORS origin protection, dynamic host header verification, and environment variable isolation.
* **📄 Automated PDF Executive Report Generator:** Export detailed, professional quantitative analytics reports in one click using client-side PDF synthesis.
* **💾 Data Backup & CSV Import/Export:** Full trade history export to CSV and automated backup import capability.

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

## 🛠️ Technology Stack

### Frontend
* **Framework:** React 18 with Vite
* **Styling:** TailwindCSS, Vanilla CSS Tokens, Custom Glassmorphism
* **Icons:** Lucide React Icons
* **PDF Engine:** jsPDF
* **HTTP Client:** Axios with Dynamic API Interceptors

### Backend
* **Framework:** Python 3.10+ & Django 5.0
* **API Engine:** Django REST Framework (DRF)
* **Web Server:** Gunicorn & WhiteNoise
* **Database Driver:** Psycopg 3 & dj-database-url
* **Security:** Corsheaders, Django Security Middleware, Token Authentication

---

## 🚀 Local Installation & Setup Guide

### Prerequisites
* **Python 3.10+**
* **Node.js 18+** & `npm`
* **Git**

---

### 1. Clone Repository
```bash
git clone https://github.com/bimalesh07/QuantJournal_Trading.git
cd QuantJournal_Trading
```

---

### 2. Backend Setup (Django)

```bash
# Navigate to backend directory
cd backend

# Create & activate virtual environment
python -m venv venv

# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# Create a superuser (Admin)
python manage.py createsuperuser

# Start local Django development server
python manage.py runserver 8000
```
> The Django backend will run at `http://localhost:8000/api/`

---

### 3. Frontend Setup (React / Vite)

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Vite local development server
npm run dev
```
> The React frontend will run at `http://localhost:5173/`

---

## 🔑 Environment Variables Configuration

### Backend `.env` (`backend/.env`)
```env
SECRET_KEY=your_custom_django_secret_key
DEBUG=True
DATABASE_URL=postgresql://user:password@ep-neon-db.neon.tech/dbname?sslmode=require
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://your-vercel-app.vercel.app
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

### Deploying Backend on Render
1. Create a new **Web Service** on [Render](https://render.com/).
2. Set **Root Directory** to `backend`.
3. Set **Build Command** to `./build.sh`.
4. Set **Start Command** to `gunicorn trading_journal.wsgi --bind 0.0.0.0:$PORT`.
5. Add Environment Variables:
   * `PYTHON_VERSION`: `3.11.9`
   * `SECRET_KEY`: *Your Django secret key*
   * `DATABASE_URL`: *Your Neon PostgreSQL connection string*

### Deploying Frontend on Vercel
1. Import repository on [Vercel](https://vercel.com/).
2. Set **Root Directory** to `frontend`.
3. Set Environment Variable:
   * `VITE_API_URL`: `https://your-render-service.onrender.com/api`
4. Click **Deploy**.

---

## 👤 System Owner & Author

* **Developer & Owner:** Bimalesh Yadav
* **GitHub:** [@bimalesh07](https://github.com/bimalesh07)
* **Project Name:** TradeTrack PRO Systems

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more details.
