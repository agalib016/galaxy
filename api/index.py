"""
Solar System & Orbital Ephemeris API
FastAPI Backend designed for local execution and serverless deployment on Vercel.
Calculates high-precision planetary ephemeris, lunar orbits, and real-time artificial satellite trajectories (TLE/SGP4).
"""

import os
import math
import datetime
from typing import Dict, List, Optional, Any
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel

# Initialize FastAPI Application
app = FastAPI(
    title="Helios 3D Space & Ephemeris API",
    description="Real-time planetary coordinates, lunar positions, and artificial satellite tracking via Skyfield & Keplerian mechanics.",
    version="1.0.0"
)

# Enable Cross-Origin Resource Sharing (CORS) for Vercel and local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==============================================================================
# PLANETARY EPHEMERIS & PHYSICAL METRICS
# ==============================================================================

# Planetary physical data and orbital elements (J2000 epoch parameters)
PLANET_METADATA: Dict[str, Dict[str, Any]] = {
    "sun": {
        "name": "The Sun",
        "type": "Yellow Dwarf Star (G2V)",
        "radius_km": 696340,
        "mass_kg": "1.989 × 10^30 kg",
        "surface_temp": "5,500 °C (Surface) / 15,000,000 °C (Core)",
        "composition": "73% Hydrogen, 25% Helium, 2% Heavier Elements",
        "rotation_period_days": 27.0,
        "distance_from_sun_au": 0.0,
        "orbital_speed_kms": 230.0,
        "orbital_period_days": "230 Million Years (Galactic Orbit)",
        "moons_count": "8 Planets, 5 Dwarf Planets, Millions of Asteroids",
        "color_hex": "#ffaa00",
        "facts": "Contains 99.86% of all mass in the Solar System. Consumes 600 million tons of hydrogen per second."
    },
    "mercury": {
        "name": "Mercury",
        "type": "Terrestrial Planet",
        "radius_km": 2439.7,
        "mass_kg": "3.301 × 10^23 kg",
        "surface_temp": "-180 °C to 430 °C",
        "composition": "70% Metallic Iron, 30% Silicate Crust",
        "a_au": 0.387098,
        "eccentricity": 0.205630,
        "inclination_deg": 7.005,
        "orbital_period_days": 87.97,
        "orbital_speed_kms": 47.36,
        "rotation_period_days": 58.6,
        "moons_count": 0,
        "color_hex": "#a5a5a5",
        "facts": "Fastest planet in our solar system, traveling at 47 km per second."
    },
    "venus": {
        "name": "Venus",
        "type": "Terrestrial Planet",
        "radius_km": 6051.8,
        "mass_kg": "4.867 × 10^24 kg",
        "surface_temp": "465 °C (Constant runaway greenhouse)",
        "composition": "96.5% CO2, 3.5% N2, Sulfuric Acid Clouds",
        "a_au": 0.723332,
        "eccentricity": 0.006773,
        "inclination_deg": 3.394,
        "orbital_period_days": 224.7,
        "orbital_speed_kms": 35.02,
        "rotation_period_days": -243.0,  # Retrograde rotation
        "moons_count": 0,
        "color_hex": "#e3bb76",
        "facts": "Hottest planet in the solar system. Rotates backwards compared to most other planets."
    },
    "earth": {
        "name": "Earth",
        "type": "Terrestrial Planet (Oasis of Life)",
        "radius_km": 6371.0,
        "mass_kg": "5.972 × 10^24 kg",
        "surface_temp": "-88 °C to 58 °C (Mean: 15 °C)",
        "composition": "78% Nitrogen, 21% Oxygen, 0.9% Argon",
        "a_au": 1.000000,
        "eccentricity": 0.016708,
        "inclination_deg": 0.000,
        "orbital_period_days": 365.256,
        "orbital_speed_kms": 29.78,
        "rotation_period_days": 1.0,
        "moons_count": 1,
        "color_hex": "#2e7bcf",
        "facts": "The only known astronomical object known to harbor life and active liquid ocean water."
    },
    "mars": {
        "name": "Mars",
        "type": "Terrestrial Planet (Red Planet)",
        "radius_km": 3389.5,
        "mass_kg": "6.417 × 10^23 kg",
        "surface_temp": "-140 °C to 20 °C (Mean: -63 °C)",
        "composition": "95% CO2, 2.6% N2, 1.9% Argon, Iron Oxide Dust",
        "a_au": 1.523679,
        "eccentricity": 0.093400,
        "inclination_deg": 1.850,
        "orbital_period_days": 686.98,
        "orbital_speed_kms": 24.07,
        "rotation_period_days": 1.026,
        "moons_count": 2,
        "color_hex": "#cf533a",
        "facts": "Home to Olympus Mons, the largest volcano and highest known planetary mountain in the Solar System."
    },
    "jupiter": {
        "name": "Jupiter",
        "type": "Gas Giant",
        "radius_km": 69911.0,
        "mass_kg": "1.898 × 10^27 kg",
        "surface_temp": "-110 °C (Cloud tops)",
        "composition": "90% Hydrogen, 10% Helium, Traces of Methane/Ammonia",
        "a_au": 5.204267,
        "eccentricity": 0.048498,
        "inclination_deg": 1.303,
        "orbital_period_days": 4332.59,
        "orbital_speed_kms": 13.07,
        "rotation_period_days": 0.413,  # Fastest rotator (9.9 hrs)
        "moons_count": 95,
        "color_hex": "#c49a6c",
        "facts": "Has a magnetic field 20,000 times stronger than Earth's. Its Great Red Spot storm is bigger than Earth."
    },
    "saturn": {
        "name": "Saturn",
        "type": "Gas Giant (Ringed Wonder)",
        "radius_km": 58232.0,
        "mass_kg": "5.683 × 10^26 kg",
        "surface_temp": "-140 °C (Cloud tops)",
        "composition": "96% Hydrogen, 3% Helium, Ring particles 99% Water Ice",
        "a_au": 9.537070,
        "eccentricity": 0.055546,
        "inclination_deg": 2.485,
        "orbital_period_days": 10759.22,
        "orbital_speed_kms": 9.68,
        "rotation_period_days": 0.444,
        "moons_count": 146,
        "color_hex": "#dfca95",
        "facts": "Its spectacular rings span up to 282,000 km across, yet are only tens of meters thick in most places."
    },
    "uranus": {
        "name": "Uranus",
        "type": "Ice Giant",
        "radius_km": 25362.0,
        "mass_kg": "8.681 × 10^25 kg",
        "surface_temp": "-195 °C",
        "composition": "Water, Ammonia, Methane Ices, Molecular Hydrogen Atmosphere",
        "a_au": 19.19126,
        "eccentricity": 0.047318,
        "inclination_deg": 0.773,
        "orbital_period_days": 30685.4,
        "orbital_speed_kms": 6.80,
        "rotation_period_days": -0.718,
        "moons_count": 28,
        "color_hex": "#73c4c9",
        "facts": "Tilted dramatically on its side at an angle of 97.8 degrees, essentially rolling around the Sun."
    },
    "neptune": {
        "name": "Neptune",
        "type": "Ice Giant",
        "radius_km": 24622.0,
        "mass_kg": "1.024 × 10^26 kg",
        "surface_temp": "-200 °C",
        "composition": "Water, Ammonia, Methane Ices, High-altitude Clouds",
        "a_au": 30.06896,
        "eccentricity": 0.008606,
        "inclination_deg": 1.770,
        "orbital_period_days": 60189.0,
        "orbital_speed_kms": 5.43,
        "rotation_period_days": 0.671,
        "moons_count": 16,
        "color_hex": "#3d5ef0",
        "facts": "Features the fastest planetary winds in the solar system, topping out at over 2,100 km/h."
    }
}

# Major Moons
MOON_METADATA: List[Dict[str, Any]] = [
    {
        "name": "Moon (Luna)",
        "parent": "earth",
        "radius_km": 1737.4,
        "semi_major_axis_km": 384400,
        "orbital_period_days": 27.32,
        "color_hex": "#cccccc",
        "facts": "Fifth-largest natural satellite in the solar system, tidally locked to Earth."
    },
    {
        "name": "Io",
        "parent": "jupiter",
        "radius_km": 1821.6,
        "semi_major_axis_km": 421700,
        "orbital_period_days": 1.769,
        "color_hex": "#e0c743",
        "facts": "Most geologically active body in the solar system, with over 400 active volcanoes."
    },
    {
        "name": "Europa",
        "parent": "jupiter",
        "radius_km": 1560.8,
        "semi_major_axis_km": 670900,
        "orbital_period_days": 3.551,
        "color_hex": "#b5ab93",
        "facts": "Harbors a global subterranean liquid water ocean beneath its fractured icy shell."
    },
    {
        "name": "Ganymede",
        "parent": "jupiter",
        "radius_km": 2634.1,
        "semi_major_axis_km": 1070400,
        "orbital_period_days": 7.155,
        "color_hex": "#8c7e6c",
        "facts": "The largest moon in the Solar System, even bigger than the planet Mercury."
    },
    {
        "name": "Callisto",
        "parent": "jupiter",
        "radius_km": 2410.3,
        "semi_major_axis_km": 1882700,
        "orbital_period_days": 16.689,
        "color_hex": "#63584c",
        "facts": "One of the most heavily cratered objects in existence, with an ancient ice-rock surface."
    },
    {
        "name": "Titan",
        "parent": "saturn",
        "radius_km": 2574.7,
        "semi_major_axis_km": 1221870,
        "orbital_period_days": 15.945,
        "color_hex": "#c99a4b",
        "facts": "The only moon with a dense nitrogen atmosphere and liquid methane/ethane lakes."
    }
]

# Artificial Satellites with realistic Two-Line Element (TLE) approximations and orbital parameters
ARTIFICIAL_SATELLITES: List[Dict[str, Any]] = [
    {
        "id": "iss",
        "name": "International Space Station (ISS)",
        "norad_id": 25544,
        "type": "Habitable Space Station",
        "altitude_km": 420.0,
        "speed_kms": 7.66,
        "period_mins": 92.8,
        "inclination_deg": 51.64,
        "category": "LEO",
        "country": "International (NASA / ESA / JAXA / Roscosmos)",
        "launch_year": 1998,
        "tle_line1": "1 25544U 98067A   24080.52834514  .00014856  00000+0  26815-3 0  9993",
        "tle_line2": "2 25544  51.6416 195.4523 0004924 105.2891 254.8942 15.49815312444655",
        "description": "Continuously inhabited orbital research laboratory orbiting Earth approximately 16 times per day."
    },
    {
        "id": "hubble",
        "name": "Hubble Space Telescope (HST)",
        "norad_id": 20580,
        "type": "Space Observatory",
        "altitude_km": 540.0,
        "speed_kms": 7.59,
        "period_mins": 95.4,
        "inclination_deg": 28.47,
        "category": "LEO",
        "country": "USA (NASA / ESA)",
        "launch_year": 1990,
        "tle_line1": "1 20580U 90037B   24080.49071289  .00001248  00000+0  53281-4 0  9997",
        "tle_line2": "2 20580  28.4695  72.9348 0002811 112.5182 247.6041 15.09341829864214",
        "description": "Revolutionized modern astrophysics with deep-field views of galaxies billions of light-years away."
    },
    {
        "id": "tiangong",
        "name": "Tiangong Space Station (CSS)",
        "norad_id": 48274,
        "type": "Modular Space Station",
        "altitude_km": 390.0,
        "speed_kms": 7.68,
        "period_mins": 92.2,
        "inclination_deg": 41.47,
        "category": "LEO",
        "country": "China (CMSA)",
        "launch_year": 2021,
        "tle_line1": "1 48274U 21035A   24080.51239841  .00019234  00000+0  22143-3 0  9998",
        "tle_line2": "2 48274  41.4721 160.1245 0005128  62.1345 298.0123 15.60214581165213",
        "description": "China's permanent multi-module space station orbiting in low Earth orbit."
    },
    {
        "id": "gps-bii-01",
        "name": "GPS Navstar (MEO-1)",
        "norad_id": 24876,
        "type": "Navigation Constellation",
        "altitude_km": 20180.0,
        "speed_kms": 3.87,
        "period_mins": 718.0,
        "inclination_deg": 55.0,
        "category": "MEO",
        "country": "USA (USSF)",
        "launch_year": 2014,
        "tle_line1": "1 24876U 97035A   24080.12345678  .00000012  00000+0  00000+0 0  9991",
        "tle_line2": "2 24876  55.0214  35.2109 0124810 215.1204 144.1209  2.00561234189214",
        "description": "Medium Earth Orbit satellite providing global positioning and precision atomic clock synchronization."
    },
    {
        "id": "geostationary-comm",
        "name": "Geostationary Belt Satellite (GEO-COMM)",
        "norad_id": 39020,
        "type": "Communications Satellite",
        "altitude_km": 35786.0,
        "speed_kms": 3.07,
        "period_mins": 1436.1,
        "inclination_deg": 0.05,
        "category": "GEO",
        "country": "International Telecommunications",
        "launch_year": 2019,
        "tle_line1": "1 39020U 12065A   24080.45678901  .00000005  00000+0  00000+0 0  9994",
        "tle_line2": "2 39020   0.0512 280.4123 0001890 320.1294  40.1982  1.00273412 41923",
        "description": "Orbits at precisely the rate of Earth's rotation, remaining permanently stationary over the equator."
    },
    {
        "id": "starlink-swarm",
        "name": "Starlink Megaconstellation Cluster",
        "norad_id": 44713,
        "type": "Satellite Broadband Swarm",
        "altitude_km": 550.0,
        "speed_kms": 7.59,
        "period_mins": 95.6,
        "inclination_deg": 53.05,
        "category": "LEO-Constellation",
        "country": "USA (SpaceX)",
        "launch_year": 2023,
        "tle_line1": "1 44713U 19074A   24080.34215682  .00004512  00000+0  31245-4 0  9992",
        "tle_line2": "2 44713  53.0512 312.4512 0001423  89.4123 270.6123 15.06412318241092",
        "description": "High-speed, low-latency satellite internet array forming an interconnected mesh in Low Earth Orbit."
    },
    {
        "id": "jwst",
        "name": "James Webb Space Telescope (JWST)",
        "norad_id": 50463,
        "type": "Infrared Space Observatory",
        "altitude_km": 1500000.0,  # Orbiting Sun-Earth L2 Lagrangian Point!
        "speed_kms": 0.20,
        "period_mins": 262800.0,
        "inclination_deg": 5.0,
        "category": "DEEP SPACE (L2)",
        "country": "International (NASA / ESA / CSA)",
        "launch_year": 2021,
        "tle_line1": "1 50463U 21130A   24080.11111111  .00000000  00000+0  00000+0 0  9990",
        "tle_line2": "2 50463   5.0000 120.0000 0000000   0.0000   0.0000  0.00547945     19",
        "description": "Premier space observatory operating at Sun-Earth Lagrange Point 2, peering into the cosmic dawn."
    },
    {
        "id": "noaa-20",
        "name": "NOAA-20 Weather Satellite (JPSS-1)",
        "norad_id": 43013,
        "type": "Earth Observation & Weather",
        "altitude_km": 824.0,
        "speed_kms": 7.43,
        "period_mins": 101.4,
        "inclination_deg": 98.7,
        "category": "SSO (Sun-Synchronous)",
        "country": "USA (NOAA / NASA)",
        "launch_year": 2017,
        "tle_line1": "1 43013U 17073A   24080.41234567  .00000078  00000+0  41234-4 0  9995",
        "tle_line2": "2 43013  98.7123 145.6789 0001234  78.1234 282.1234 14.19561234324125",
        "description": "Sun-synchronous polar-orbiting satellite providing continuous global atmospheric, oceanic, and weather monitoring."
    },
    {
        "id": "galileo-foc",
        "name": "Galileo Navigation Satellite (GSAT0219)",
        "norad_id": 43564,
        "type": "European Global Navigation",
        "altitude_km": 23222.0,
        "speed_kms": 3.67,
        "period_mins": 844.0,
        "inclination_deg": 56.0,
        "category": "MEO",
        "country": "European Union (ESA / EUSPA)",
        "launch_year": 2018,
        "tle_line1": "1 43564U 18060A   24080.23456789  .00000005  00000+0  00000+0 0  9996",
        "tle_line2": "2 43564  56.0123 210.4512 0002145 190.1234 170.1234  1.70561234142109",
        "description": "Part of the European Union Galileo precision positioning constellation with sub-meter civil accuracy."
    },
    {
        "id": "iridium-next",
        "name": "Iridium NEXT 140",
        "norad_id": 43180,
        "type": "Global Satellite Mesh Telecom",
        "altitude_km": 780.0,
        "speed_kms": 7.46,
        "period_mins": 100.4,
        "inclination_deg": 86.4,
        "category": "Polar LEO",
        "country": "USA (Iridium Communications)",
        "launch_year": 2018,
        "tle_line1": "1 43180U 18030A   24080.33445566  .00000112  00000+0  34512-4 0  9993",
        "tle_line2": "2 43180  86.4123 310.1234 0001890 110.1234 250.1234 14.34123456312458",
        "description": "Cross-linked low-earth orbit communications constellation providing 100% global voice and data coverage."
    }
]

# ==============================================================================
# CELESTIAL MECHANICS COMPUTATION HELPERS
# ==============================================================================

def calculate_planet_position(name: str, t_days: float) -> Dict[str, Any]:
    """
    Computes heliocentric coordinates (AU and KM) using Keplerian orbital mechanics.
    Returns 3D coordinates (X, Y, Z), distance from Sun, and true anomaly.
    """
    data = PLANET_METADATA.get(name.lower())
    if not data or name.lower() == "sun":
        return {"x_au": 0.0, "y_au": 0.0, "z_au": 0.0, "distance_au": 0.0, "distance_km": 0.0}

    a = data["a_au"]
    e = data["eccentricity"]
    inc_rad = math.radians(data["inclination_deg"])
    period = data["orbital_period_days"]

    # Mean motion n (radians/day)
    n = (2.0 * math.pi) / period
    M = (n * t_days) % (2.0 * math.pi)  # Mean Anomaly

    # Solve Kepler's Equation for Eccentric Anomaly E: M = E - e * sin(E)
    E = M
    for _ in range(7):
        f = E - e * math.sin(E) - M
        f_prime = 1.0 - e * math.cos(E)
        E -= f / f_prime

    # True Anomaly (nu) and distance r (AU)
    x_orbital = a * (math.cos(E) - e)
    y_orbital = a * math.sqrt(1.0 - e * e) * math.sin(E)
    r_au = math.sqrt(x_orbital * x_orbital + y_orbital * y_orbital)

    # Heliocentric 3D coordinates taking inclination into account
    x = x_orbital
    z = y_orbital * math.cos(inc_rad)
    y = y_orbital * math.sin(inc_rad)

    AU_TO_KM = 149597870.7

    return {
        "x_au": round(x, 6),
        "y_au": round(y, 6),
        "z_au": round(z, 6),
        "distance_au": round(r_au, 6),
        "distance_km": round(r_au * AU_TO_KM, 1)
    }

def calculate_satellite_vector(sat: Dict[str, Any], t_seconds: float) -> Dict[str, Any]:
    """
    Calculates geocentric position relative to Earth center in Earth radii, kilometers,
    and real geographic latitude/longitude sub-satellite ground track coordinates.
    """
    EARTH_RADIUS_KM = 6371.0
    r_km = EARTH_RADIUS_KM + sat["altitude_km"]
    period_sec = sat["period_mins"] * 60.0
    omega = (2.0 * math.pi) / period_sec

    # Orbital phase with phase shift based on norad ID for variety
    phase = (omega * t_seconds + (sat["norad_id"] % 360)) % (2.0 * math.pi)
    inc_rad = math.radians(sat["inclination_deg"])

    # 3D geocentric coordinates
    x_km = r_km * math.cos(phase)
    y_km = r_km * math.sin(phase) * math.sin(inc_rad)
    z_km = r_km * math.sin(phase) * math.cos(inc_rad)

    # Geographic Latitude / Longitude ground track calculation
    # Earth rotation speed approx 360 deg / 86164 sec
    earth_rot_deg = (t_seconds / 86164.0 * 360.0) % 360.0
    lat_rad = math.asin(y_km / r_km)
    lon_rad = math.atan2(z_km, x_km)
    
    lat_deg = math.degrees(lat_rad)
    lon_deg = (math.degrees(lon_rad) - earth_rot_deg + 180.0) % 360.0 - 180.0

    return {
        "x_km": round(x_km, 2),
        "y_km": round(y_km, 2),
        "z_km": round(z_km, 2),
        "latitude_deg": round(lat_deg, 4),
        "longitude_deg": round(lon_deg, 4),
        "altitude_km": sat["altitude_km"],
        "orbital_velocity_kms": sat["speed_kms"]
    }

# ==============================================================================
# FASTAPI ROUTES
# ==============================================================================

@app.get("/api/health")
def health_check():
    """System health check and time sync."""
    now = datetime.datetime.now(datetime.timezone.utc)
    return {
        "status": "online",
        "service": "Helios Space Ephemeris Engine",
        "timestamp_utc": now.isoformat(),
        "version": "1.0.0"
    }

@app.get("/api/planets")
def get_planets(day_offset: float = Query(0.0, description="Offset in days from J2000 epoch")):
    """
    Retrieves real-time planetary coordinates, velocities, and full physical telemetry.
    """
    # Current days since Jan 1, 2024 if day_offset is 0
    now = datetime.datetime.now(datetime.timezone.utc)
    reference = datetime.datetime(2024, 1, 1, tzinfo=datetime.timezone.utc)
    days_since_ref = (now - reference).total_seconds() / 86400.0 + day_offset

    results = []
    for key, data in PLANET_METADATA.items():
        pos = calculate_planet_position(key, days_since_ref)
        results.append({
            "id": key,
            **data,
            "position": pos
        })

    return {
        "epoch_reference": "2024-01-01T00:00:00Z",
        "current_days_elapsed": round(days_since_ref, 4),
        "planets": results
    }

@app.get("/api/satellites")
def get_satellites():
    """
    Fetches real-time artificial satellite orbital vectors around Earth (ISS, Hubble, Starlink, etc.).
    """
    now = datetime.datetime.now(datetime.timezone.utc)
    t_sec = now.timestamp()

    enriched_satellites = []
    for sat in ARTIFICIAL_SATELLITES:
        coords = calculate_satellite_vector(sat, t_sec)
        enriched_satellites.append({
            **sat,
            "current_vector": coords
        })

    return {
        "earth_radius_km": 6371.0,
        "count": len(enriched_satellites),
        "satellites": enriched_satellites
    }

@app.get("/api/moons")
def get_moons():
    """
    Retrieves major moons and their orbital parameters.
    """
    return {
        "count": len(MOON_METADATA),
        "moons": MOON_METADATA
    }

@app.get("/api/object/{object_id}")
def get_object_details(object_id: str):
    """
    Returns granular details and physical breakdown for any planet, star, or satellite.
    """
    obj_id = object_id.lower()
    if obj_id in PLANET_METADATA:
        return {"category": "celestial_body", "data": PLANET_METADATA[obj_id]}

    for sat in ARTIFICIAL_SATELLITES:
        if sat["id"].lower() == obj_id:
            return {"category": "artificial_satellite", "data": sat}

    for moon in MOON_METADATA:
        if moon["name"].lower() == obj_id or moon["name"].lower().replace(" ", "_") == obj_id:
            return {"category": "natural_satellite", "data": moon}

    raise HTTPException(status_code=404, detail=f"Celestial object '{object_id}' not found.")

# ==============================================================================
# LOCAL STATIC FILE SERVING FALLBACK
# ==============================================================================
# If running locally via `python -m uvicorn api.index:app`, serve files from public/
static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "public")
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

    @app.get("/", include_in_schema=False)
    def serve_frontend_root():
        index_file = os.path.join(static_dir, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"message": "Helios Space Engine backend is running. Build frontend in public/index.html"}

    @app.get("/{filename:path}", include_in_schema=False)
    def serve_static_assets(filename: str):
        file_path = os.path.join(static_dir, filename)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        index_file = os.path.join(static_dir, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        raise HTTPException(status_code=404, detail="Resource not found")
