# 🌌 Helios 3D — Interactive Solar System & Satellite Orbital Simulator

Production-ready 3D interactive Space and Solar System web application. Powered by **Python (FastAPI)** on the backend and **Three.js (WebGL)** on the frontend, pre-configured for free serverless deployment on **Vercel**.

---

## 🚀 Features

- **3D Space & WebGL Environment:**
  - High-resolution Milky Way celestial skydome and a 20,000-particle deep-space starfield colored by real stellar spectral types (O, B, A, F, G, K, M).
  - High-performance `OrbitControls` with smooth damping, zoom boundaries, and free 360-degree rotation.
  - Logarithmic depth buffer (`logarithmicDepthBuffer: true`) preventing z-fighting across astronomical scales.
- **The Celestial Bodies:**
  - **The Sun:** Central star with dynamic animated corona shader, additive blending glow, and realistic point-light shadow casting.
  - **8 Major Planets:** Mercury, Venus, Earth (with independent rotating cloud layer), Mars, Jupiter, Saturn (with double-sided transparent Cassini-gap rings), Uranus, and Neptune.
  - **Natural Satellites:** Earth's Moon (Luna), Jupiter's Galilean moons (Io, Europa, Ganymede, Callisto), and Saturn's Titan orbiting their parent bodies.
  - **Balanced Logarithmic Scaling:** Scaled distances and sizes so all planets remain visible and easily navigable.
- **Artificial Satellites & Space Stations:**
  - Detailed 3D model of the **International Space Station (ISS)** in Low Earth Orbit (LEO) with solar arrays and pulsing navigation beacon.
  - **Starlink Constellation Swarm:** Animated orbital plane cluster.
  - **GPS Navstar Constellation Ring** (MEO, 20,180 km, 55° inclination).
  - **Geostationary Telecommunications Belt** (GEO, 35,786 km).
- **Interactive Raycasting & Camera Tracking:**
  - Dynamic cursor reticle tracking celestial bodies on hover.
  - Click any body or satellite to initiate smooth camera tweening and lock-on focus.
  - Glassmorphic aerospace HUD card displaying real-time distance, orbital velocity, equatorial radius, surface temperature, composition, and physical metrics.
  - Time-warp slider (Freeze, 0.2x, 1x Real-Time, 5x, 25x, 100x).
  - Radar toggles for Orbits, Satellites, Moons, and Cinematic Auto-Tour mode.
- **Python FastAPI Backend:**
  - Real-time Keplerian ephemeris calculation (`/api/planets`).
  - Two-Line Element (TLE) satellite vector propagation (`/api/satellites`).
  - CORS-enabled for serverless Vercel execution and local dev.
  - Zero-asset resilience: Built-in 2K/4K procedural canvas texture generators with seamless fallback for user-provided textures.

---

## 📁 Repository Structure

```
galaxy/
├── api/
│   ├── __init__.py
│   └── index.py            # FastAPI backend (Ephemeris, TLE Satellite API, CORS)
├── public/
│   ├── index.html          # HTML5 aerospace HUD & Three.js canvas container
│   ├── style.css           # Glassmorphism dark mode styling & animations
│   ├── main.js             # Three.js 3D engine, Raycasting, Shaders & Controls
│   └── textures/           # Directory for custom planetary texture maps
│       └── README.md
├── requirements.txt        # Python backend dependencies (FastAPI, Uvicorn, Skyfield)
├── vercel.json             # Vercel serverless routing configuration
└── README.md
```

---

## 🛠️ Local Development & Testing

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run the Development Server
```bash
uvicorn api.index:app --reload --port 8000
```
Open your browser at **`http://localhost:8000`**. The FastAPI backend automatically serves both the API endpoints (`/api/...`) and the interactive frontend (`public/`).

---

## ☁️ Free Deployment to Vercel

### Method A: Deploy via Vercel CLI
1. Install Vercel CLI (if not already installed):
   ```bash
   npm i -g vercel
   ```
2. Log in and deploy:
   ```bash
   vercel
   ```
3. To deploy directly to production:
   ```bash
   vercel --prod
   ```

### Method B: Deploy via GitHub
1. Push this directory to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Helios 3D Solar System"
   git branch -M main
   git remote add origin https://github.com/<your-username>/helios-3d-space.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Keep the default settings (Vercel will detect `vercel.json` and Python automatically).
5. Click **Deploy**. Your app will be live with a free SSL domain (e.g., `https://helios-3d-space.vercel.app`)!

---

## 🎨 Adding Custom High-Resolution Textures

You can place any `.jpg` or `.png` surface maps into `public/textures/`:
- `sun.jpg`, `earth_texture.jpg`, `earth_clouds.jpg`, `moon.jpg`, `mars.jpg`, `jupiter.jpg`, `saturn.jpg`, `saturn_rings.png`, `uranus.jpg`, `neptune.jpg`, `mercury.jpg`, `venus.jpg`, `milkyway.jpg`.

Free 4K and 8K planetary maps are available directly from [NASA Visible Earth](https://visibleearth.nasa.gov/) and [Solar System Scope](https://www.solarsystemscope.com/textures/).
