/**
 * HELIOS 3D — ASTROPHYSICALLY REALISTIC COSMIC & SATELLITE SIMULATOR
 * Designed & Developed by Asadullahil Galib
 *
 * FEATURING:
 * - Multi-Galaxy Cosmic Realm (Milky Way, Andromeda M31, Triangulum M33, Sombrero M104, Whirlpool M51)
 * - 38-Object Universal System Navigator with Real-Time Search & Instant Zoom
 * - Advanced Interactive Time Warp Flight Deck (Continuous scrubber, ⏪ Reverse, ⏸ Pause, ⏩ +1 Day step, Presets)
 * - Authentic 3D Spacecraft: Tiangong CSS, Voyager 1 & 2 (Interstellar), Parker Solar Probe (Touching the Sun),
 *   ISS (Sun-tracking solar wings), JWST (L2), Hubble (HST), Starlink Swarm, GPS & Geostationary Belts
 * - Photorealistic Planetary Shaders (Earth Day/Night & Ocean Glint, Cassini Rings with Shadow, Solar Convection)
 * - Crystal Crisp View / HDR Tone Mapping Mode
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ==============================================================================
// 1. CONFIGURATION & ASTROPHYSICAL SCALES
// ==============================================================================

const DISTANCE_SCALE = 38.0;      // AU to Scene Units multiplier
const MOON_DISTANCE_SCALE = 4.2;  // Moon orbit radius multiplier

// Cosmic Camera Viewpoints
const INITIAL_COSMIC_POS = new THREE.Vector3(0, 1850, 2900);
const SOLAR_SYSTEM_OVERVIEW_POS = new THREE.Vector3(0, 75, 185);

// Galaxy Realm Layout Coordinates
const GALAXY_CONFIGS = [
  {
    id: 'milkyway',
    name: 'Milky Way Galaxy',
    type: 'Barred Spiral Galaxy (SBbc)',
    position: new THREE.Vector3(0, 0, 0),
    rotationSpeed: 0.0003,
    starCount: 55000,
    radius: 1400,
    arms: 4,
    colorCore: '#fff4cc',
    colorArm: '#38bdf8',
    colorHII: '#f43f5e',
    colorDust: '#1e1b4b',
    hasCentralBar: true,
    barLength: 380,
    barWidth: 75,
    tiltX: 0,
    tiltZ: 0,
    hitRadius: 1300,
    cameraOffset: new THREE.Vector3(0, 1600, 2400)
  },
  {
    id: 'andromeda',
    name: 'Andromeda Galaxy (M31)',
    type: 'Grand Spiral Galaxy (SA(s)b)',
    position: new THREE.Vector3(-3600, 550, -1800),
    rotationSpeed: -0.00025,
    starCount: 26000,
    radius: 1100,
    arms: 2,
    colorCore: '#ffeaa7',
    colorArm: '#74b9ff',
    colorHII: '#fd79a8',
    colorDust: '#2d3436',
    hasCentralBar: false,
    tiltX: THREE.MathUtils.degToRad(77),
    tiltZ: THREE.MathUtils.degToRad(35),
    hitRadius: 1050,
    cameraOffset: new THREE.Vector3(-3600, 1100, -600)
  },
  {
    id: 'triangulum',
    name: 'Triangulum Galaxy (M33)',
    type: 'Pinwheel Spiral Galaxy (SA(s)cd)',
    position: new THREE.Vector3(3200, -450, -3000),
    rotationSpeed: 0.0004,
    starCount: 16000,
    radius: 750,
    arms: 3,
    colorCore: '#81ecec',
    colorArm: '#00cec9',
    colorHII: '#e84393',
    colorDust: '#2d3436',
    hasCentralBar: false,
    tiltX: THREE.MathUtils.degToRad(54),
    tiltZ: THREE.MathUtils.degToRad(-20),
    hitRadius: 700,
    cameraOffset: new THREE.Vector3(3200, 450, -2100)
  },
  {
    id: 'sombrero',
    name: 'Sombrero Galaxy (M104)',
    type: 'Unbarred Spiral Galaxy (SA(s)a)',
    position: new THREE.Vector3(-2400, -1100, 3600),
    rotationSpeed: 0.0002,
    starCount: 20000,
    radius: 700,
    arms: 1,
    colorCore: '#fff2cc',
    colorArm: '#e2e8f0',
    colorHII: '#f59e0b',
    colorDust: '#0f172a',
    hasCentralBar: false,
    isEdgeOnWithDustRing: true,
    tiltX: THREE.MathUtils.degToRad(84),
    tiltZ: THREE.MathUtils.degToRad(12),
    hitRadius: 650,
    cameraOffset: new THREE.Vector3(-2400, -500, 4600)
  },
  {
    id: 'whirlpool',
    name: 'Whirlpool Galaxy (M51)',
    type: 'Grand-Design Spiral Galaxy (SA(s)bc pec)',
    position: new THREE.Vector3(3800, 1100, 2400),
    rotationSpeed: 0.00035,
    starCount: 22000,
    radius: 850,
    arms: 2,
    colorCore: '#fed330',
    colorArm: '#0984e3',
    colorHII: '#eb3b5a',
    colorDust: '#192a56',
    hasCentralBar: false,
    hasCompanion: true,
    companionOffset: new THREE.Vector3(310, 45, -140),
    tiltX: THREE.MathUtils.degToRad(20),
    tiltZ: THREE.MathUtils.degToRad(15),
    hitRadius: 850,
    cameraOffset: new THREE.Vector3(3800, 1900, 3400)
  },
  {
    id: 'pinwheel',
    name: 'Pinwheel Galaxy (M101)',
    type: 'Face-On Grand-Design Spiral (SA(s)cd)',
    position: new THREE.Vector3(2600, 1600, -2600),
    rotationSpeed: 0.00028,
    starCount: 24000,
    radius: 950,
    arms: 5,
    colorCore: '#fff7ed',
    colorArm: '#60a5fa',
    colorHII: '#f43f5e',
    colorDust: '#1e293b',
    hasCentralBar: false,
    tiltX: THREE.MathUtils.degToRad(18),
    tiltZ: THREE.MathUtils.degToRad(-15),
    hitRadius: 900,
    cameraOffset: new THREE.Vector3(2600, 2400, -1600)
  },
  {
    id: 'cartwheel',
    name: 'Cartwheel Galaxy (ESO 350-40)',
    type: 'Collisional Ring Galaxy',
    position: new THREE.Vector3(-4400, -900, 2100),
    rotationSpeed: 0.00022,
    starCount: 22000,
    radius: 850,
    colorCore: '#fed7aa',
    colorArm: '#38bdf8',
    colorHII: '#fb7185',
    colorDust: '#0f172a',
    hasCentralBar: false,
    isRingGalaxy: true,
    tiltX: THREE.MathUtils.degToRad(42),
    tiltZ: THREE.MathUtils.degToRad(-30),
    hitRadius: 820,
    cameraOffset: new THREE.Vector3(-4400, -100, 3100)
  },
  {
    id: 'cigar',
    name: 'Cigar Galaxy (M82 / NGC 3034)',
    type: 'Starburst Galaxy with Bipolar Plumes',
    position: new THREE.Vector3(2100, -1900, 4000),
    rotationSpeed: 0.0003,
    starCount: 18000,
    radius: 750,
    colorCore: '#fef08a',
    colorArm: '#cbd5e1',
    colorHII: '#ef4444',
    colorDust: '#1e1b4b',
    hasCentralBar: false,
    isStarburstWithPlumes: true,
    tiltX: THREE.MathUtils.degToRad(80),
    tiltZ: THREE.MathUtils.degToRad(45),
    hitRadius: 720,
    cameraOffset: new THREE.Vector3(2100, -1200, 5000)
  },
  {
    id: 'blackeye',
    name: 'Black Eye Galaxy (M64)',
    type: 'Sleeping Beauty / Evil Eye Spiral',
    position: new THREE.Vector3(-3800, 1700, 1100),
    rotationSpeed: 0.00032,
    starCount: 19000,
    radius: 800,
    arms: 2,
    colorCore: '#fef3c7',
    colorArm: '#a78bfa',
    colorHII: '#fb923c',
    colorDust: '#020617',
    hasCentralBar: false,
    hasDarkEyeBand: true,
    tiltX: THREE.MathUtils.degToRad(58),
    tiltZ: THREE.MathUtils.degToRad(-25),
    hitRadius: 760,
    cameraOffset: new THREE.Vector3(-3800, 2400, 2100)
  },
  {
    id: 'centaurus_a',
    name: 'Centaurus A (NGC 5128)',
    type: 'Peculiar Galaxy with Relativistic Jets',
    position: new THREE.Vector3(3600, -1300, -1100),
    rotationSpeed: 0.0002,
    starCount: 23000,
    radius: 900,
    colorCore: '#fed7aa',
    colorArm: '#94a3b8',
    colorHII: '#38bdf8',
    colorDust: '#0f172a',
    hasCentralBar: false,
    hasRelativisticJets: true,
    tiltX: THREE.MathUtils.degToRad(35),
    tiltZ: THREE.MathUtils.degToRad(50),
    hitRadius: 880,
    cameraOffset: new THREE.Vector3(3600, -500, -100)
  },
  {
    id: 'tadpole',
    name: 'Tadpole Galaxy (Arp 188)',
    type: 'Disrupted Spiral with Massive Tidal Tail',
    position: new THREE.Vector3(-2500, 2300, -3300),
    rotationSpeed: 0.00025,
    starCount: 21000,
    radius: 850,
    arms: 2,
    colorCore: '#fde68a',
    colorArm: '#38bdf8',
    colorHII: '#ec4899',
    colorDust: '#1e293b',
    hasCentralBar: true,
    barLength: 200,
    barWidth: 40,
    hasTidalTail: true,
    tiltX: THREE.MathUtils.degToRad(40),
    tiltZ: THREE.MathUtils.degToRad(-35),
    hitRadius: 950,
    cameraOffset: new THREE.Vector3(-2500, 3100, -2300)
  }
];

// Fallback Scientific Metadata for Galaxies
const GALAXY_METADATA_FALLBACK = {
  milkyway: {
    id: 'milkyway',
    name: 'Milky Way Galaxy',
    type: 'Barred Spiral Galaxy (SBbc)',
    distance_ly: '0 (Our Cosmic Home)',
    diameter_ly: '100,000 light-years',
    stars_count: '100 to 400 Billion',
    mass_solar: '1.5 × 10^12 M☉',
    central_black_hole: 'Sagittarius A* (4.15 × 10^6 M☉)',
    location: 'Orion Arm (Local Spur)',
    rotation_period_years: '230 Million Years (Galactic Year)',
    composition: 'Interstellar Medium, Hydrogen Gas, Dark Matter Halo, Old Yellow Core, Electric Blue Spiral Arms',
    facts: 'Our home galaxy containing the Solar System. Rotates at ~220 km/s around Sagittarius A* supermassive black hole.'
  },
  andromeda: {
    id: 'andromeda',
    name: 'Andromeda Galaxy (M31)',
    type: 'Grand Spiral Galaxy (SA(s)b)',
    distance_ly: '2.537 Million light-years',
    diameter_ly: '220,000 light-years',
    stars_count: 'Approximately 1 Trillion',
    mass_solar: '1.23 × 10^12 M☉',
    central_black_hole: 'Supermassive Black Hole (1.4 × 10^8 M☉)',
    location: 'Local Group Giant',
    rotation_period_years: '250 Million Years',
    composition: 'Massive Stellar Bulge, Dual Dust Arms, Satellite Galaxies (M32, M110)',
    facts: 'The largest galaxy in the Local Group. Heading toward the Milky Way at 110 km/s; the two will collide in 4.5 billion years to form "Milkomeda".'
  },
  triangulum: {
    id: 'triangulum',
    name: 'Triangulum Galaxy (M33)',
    type: 'Pinwheel Spiral Galaxy (SA(s)cd)',
    distance_ly: '2.73 Million light-years',
    diameter_ly: '60,000 light-years',
    stars_count: '40 Billion',
    mass_solar: '5.0 × 10^10 M☉',
    central_black_hole: 'Under 3,000 M☉ (No Supermassive Core)',
    location: 'Third-Largest Local Group Member',
    rotation_period_years: '180 Million Years',
    composition: 'Abundant Gas/Dust, Giant Glowing H-II Emission Nebulae (NGC 604)',
    facts: 'Known as the Pinwheel Galaxy, hosting NGC 604—one of the largest known star formation regions spanning 1,500 light-years.'
  },
  sombrero: {
    id: 'sombrero',
    name: 'Sombrero Galaxy (M104)',
    type: 'Unbarred Spiral Galaxy (SA(s)a)',
    distance_ly: '31.1 Million light-years',
    diameter_ly: '50,000 light-years',
    stars_count: '800 Billion to 1 Trillion',
    mass_solar: '8.0 × 10^11 M☉',
    central_black_hole: 'Ultramassive Black Hole (1.0 × 10^9 M☉)',
    location: 'Virgo-Corvus Border',
    rotation_period_years: '200 Million Years',
    composition: 'Extraordinarily Large Core Bulge, Prominent Circumstellar Absorption Dust Lane',
    facts: 'Resembles a wide-brimmed Mexican sombrero hat. Its central supermassive black hole is 250 times more massive than Sagittarius A*.'
  },
  whirlpool: {
    id: 'whirlpool',
    name: 'Whirlpool Galaxy (M51)',
    type: 'Grand-Design Spiral Galaxy (SA(s)bc pec)',
    distance_ly: '23.5 Million light-years',
    diameter_ly: '76,000 light-years',
    stars_count: '100 Billion',
    mass_solar: '1.6 × 10^11 M☉',
    central_black_hole: 'Active Galactic Nucleus (AGN)',
    location: 'Canes Venatici Constellation',
    rotation_period_years: '160 Million Years',
    composition: 'Striking Symmetrical Spiral Arms, Tidal Bridge, Interacting Companion NGC 5195',
    facts: 'First galaxy ever recognized as having a spiral structure (Lord Rosse in 1845). Gravitational interaction with NGC 5195 triggers intense star formation.'
  },
  pinwheel: {
    id: 'pinwheel',
    name: 'Pinwheel Galaxy (M101)',
    type: 'Face-On Grand-Design Spiral (SA(s)cd)',
    distance_ly: '20.9 Million light-years',
    diameter_ly: '170,000 light-years',
    stars_count: '1 Trillion',
    mass_solar: '1.0 × 10^12 M☉',
    central_black_hole: 'Intermediate/Supermassive Black Hole (~2.5 × 10^7 M☉)',
    location: 'Ursa Major Constellation',
    rotation_period_years: '260 Million Years',
    composition: 'Asymmetric Spiral Arms, 3,000+ Giant H-II Starburst Regions, Dense Molecular Clouds',
    facts: 'Nearly twice the size of the Milky Way, containing thousands of energetic H-II emission nebulae where massive stars ignite continuously.'
  },
  cartwheel: {
    id: 'cartwheel',
    name: 'Cartwheel Galaxy (ESO 350-40)',
    type: 'Collisional Ring Galaxy',
    distance_ly: '500 Million light-years',
    diameter_ly: '150,000 light-years',
    stars_count: '200 to 400 Billion',
    mass_solar: '3.8 × 10^11 M☉',
    central_black_hole: 'Luminous Core Black Hole (~1.2 × 10^8 M☉)',
    location: 'Sculptor Constellation',
    rotation_period_years: '180 Million Years (Ring Expansion ~217,000 km/h)',
    composition: 'Inner Core Ring, Gaseous Radiating Spokes, Expanding Compression Starburst Ring',
    facts: 'Formed through a direct bullseye collision when a smaller companion galaxy pierced right through its center, sending high-speed density shockwaves outwards like ripples in a pond.'
  },
  cigar: {
    id: 'cigar',
    name: 'Cigar Galaxy (M82 / NGC 3034)',
    type: 'Prototype Starburst Galaxy (I0 sp)',
    distance_ly: '12.0 Million light-years',
    diameter_ly: '37,000 light-years',
    stars_count: '30 to 50 Billion',
    mass_solar: '5.0 × 10^10 M☉',
    central_black_hole: 'Intermediate-Mass Black Hole (3 × 10^7 M☉)',
    location: 'Ursa Major Constellation (M81 Group)',
    rotation_period_years: '100 Million Years',
    composition: 'Bipolar Superwind Gas Plumes, Ionized Hydrogen (H-alpha), Hot Dust, 100+ Young Super Star Clusters',
    facts: 'Star formation occurs 10 times faster than in the Milky Way. Massive superwinds blast ionized hydrogen plumes 20,000 light-years perpendicular into intergalactic space.'
  },
  blackeye: {
    id: 'blackeye',
    name: 'Black Eye Galaxy (M64 / NGC 4826)',
    type: 'Sleeping Beauty / Evil Eye Spiral ((R)SA(rs)ab)',
    distance_ly: '17.3 Million light-years',
    diameter_ly: '54,000 light-years',
    stars_count: '100 Billion',
    mass_solar: '1.0 × 10^11 M☉',
    central_black_hole: 'Supermassive Black Hole (~1.0 × 10^7 M☉)',
    location: 'Coma Berenices Constellation',
    rotation_period_years: '140 Million Years',
    composition: 'Spectacular Dark Obscuring Dust Band, Dual Counter-Rotating Gas Disks',
    facts: 'Has two counter-rotating disks: interstellar gas in its outer regions rotates in the opposite direction from gas and stars in its inner regions, created by a catastrophic collision with a satellite galaxy.'
  },
  centaurus_a: {
    id: 'centaurus_a',
    name: 'Centaurus A (NGC 5128)',
    type: 'Peculiar Radio Galaxy / Lenticular with Relativistic Jets',
    distance_ly: '13.0 Million light-years',
    diameter_ly: '60,000 light-years',
    stars_count: '200 Billion',
    mass_solar: '1.0 × 10^12 M☉',
    central_black_hole: 'Supermassive Black Hole (5.5 × 10^7 M☉)',
    location: 'Centaurus Constellation',
    rotation_period_years: '200 Million Years',
    composition: 'Giant Elliptical Stellar Body, Warped Bisecting Dust Lane, Dual Relativistic Plasma Jets',
    facts: 'One of the closest radio galaxies to Earth. Its supermassive black hole expels colossal relativistic plasma jets extending hundreds of thousands of light-years that emit intense X-ray and radio radiation.'
  },
  tadpole: {
    id: 'tadpole',
    name: 'Tadpole Galaxy (Arp 188)',
    type: 'Disrupted Barred Spiral (SB(s)c pec)',
    distance_ly: '420 Million light-years',
    diameter_ly: '300,000 light-years (Including 280,000 ly Tail)',
    stars_count: '100 to 150 Billion',
    mass_solar: '3.5 × 10^11 M☉',
    central_black_hole: 'Supermassive Black Hole (~4.0 × 10^7 M☉)',
    location: 'Draco Constellation',
    rotation_period_years: '220 Million Years',
    composition: 'Compact Galactic Head, 280,000-light-year Tidal Debris Stream, Massive Blue Star Clusters',
    facts: 'A compact intruder galaxy swung past Arp 188, pulling out a colossal 280,000-light-year tidal tail of stars and gas that resembles a cosmic tadpole, studded with newborn bright blue star clusters.'
  }
};

// Fallback Planetary & Moons Data
const CELESTIAL_CONFIG = {
  sun: {
    id: 'sun',
    name: 'The Sun',
    category: 'STAR / G2V (YELLOW DWARF)',
    radius: 7.2,
    color: 0xffaa00,
    rotationSpeed: 0.002,
    textureFile: 'textures/sun.jpg'
  },
  mercury: {
    id: 'mercury',
    name: 'Mercury',
    category: 'TERRESTRIAL PLANET',
    a_au: 0.387,
    radius: 0.75,
    orbitalPeriodDays: 87.97,
    eccentricity: 0.205,
    inclinationDeg: 7.0,
    rotationSpeed: 0.004,
    color: 0x999999,
    textureFile: 'textures/mercury.jpg',
    bumpFile: 'textures/mercury_bump.jpg',
    bumpScale: 0.06
  },
  venus: {
    id: 'venus',
    name: 'Venus',
    category: 'TERRESTRIAL PLANET',
    a_au: 0.723,
    radius: 1.35,
    orbitalPeriodDays: 224.7,
    eccentricity: 0.006,
    inclinationDeg: 3.39,
    rotationSpeed: -0.002,
    color: 0xe3bb76,
    textureFile: 'textures/venus.jpg',
    atmosphereColor: 0xf5e6ba
  },
  earth: {
    id: 'earth',
    name: 'Earth',
    category: 'TERRESTRIAL PLANET (OASIS OF LIFE)',
    a_au: 1.000,
    radius: 1.5,
    orbitalPeriodDays: 365.25,
    eccentricity: 0.016,
    inclinationDeg: 0.0,
    axialTiltDeg: 23.44,
    rotationSpeed: 0.015,
    color: 0x2277bb,
    textureFile: 'textures/earth_texture.jpg',
    nightFile: 'textures/earth_night.jpg',
    cloudsFile: 'textures/earth_clouds.jpg',
    specularFile: 'textures/earth_specular.jpg',
    bumpFile: 'textures/earth_bump.jpg',
    bumpScale: 0.08
  },
  mars: {
    id: 'mars',
    name: 'Mars',
    category: 'TERRESTRIAL PLANET (RED PLANET)',
    a_au: 1.524,
    radius: 0.95,
    orbitalPeriodDays: 686.98,
    eccentricity: 0.093,
    inclinationDeg: 1.85,
    axialTiltDeg: 25.19,
    rotationSpeed: 0.014,
    color: 0xcf533a,
    textureFile: 'textures/mars.jpg',
    bumpFile: 'textures/mars_bump.jpg',
    bumpScale: 0.06,
    atmosphereColor: 0xdf8464
  },
  jupiter: {
    id: 'jupiter',
    name: 'Jupiter',
    category: 'GAS GIANT (KING OF PLANETS)',
    a_au: 2.85,
    radius: 4.2,
    orbitalPeriodDays: 4332.59,
    eccentricity: 0.048,
    inclinationDeg: 1.3,
    axialTiltDeg: 3.13,
    rotationSpeed: 0.035,
    color: 0xd6a97a,
    textureFile: 'textures/jupiter.jpg'
  },
  saturn: {
    id: 'saturn',
    name: 'Saturn',
    category: 'GAS GIANT (RINGED JEWEL)',
    a_au: 4.15,
    radius: 3.5,
    orbitalPeriodDays: 10759.22,
    eccentricity: 0.055,
    inclinationDeg: 2.48,
    axialTiltDeg: 26.73,
    rotationSpeed: 0.032,
    color: 0xe0cda9,
    textureFile: 'textures/saturn.jpg',
    ringsFile: 'textures/saturn_ring_alpha.png'
  },
  uranus: {
    id: 'uranus',
    name: 'Uranus',
    category: 'ICE GIANT',
    a_au: 5.65,
    radius: 2.4,
    orbitalPeriodDays: 30685.4,
    eccentricity: 0.047,
    inclinationDeg: 0.77,
    axialTiltDeg: 97.77,
    rotationSpeed: -0.02,
    color: 0x73c4c9,
    textureFile: 'textures/uranus.jpg'
  },
  neptune: {
    id: 'neptune',
    name: 'Neptune',
    category: 'ICE GIANT (WINDSWEPT)',
    a_au: 7.10,
    radius: 2.3,
    orbitalPeriodDays: 60189.0,
    eccentricity: 0.008,
    inclinationDeg: 1.77,
    axialTiltDeg: 28.32,
    rotationSpeed: 0.022,
    color: 0x3d5ef0,
    textureFile: 'textures/neptune.jpg'
  }
};

// ==============================================================================
// 2. MAIN SIMULATION ENGINE
// ==============================================================================

class HeliosCosmicApplication {
  constructor() {
    window.helios = this;
    this.container = document.getElementById('canvas-container');
    this.galaxies = new Map();
    this.planets = new Map();
    this.moons = [];
    this.satellites = [];
    this.orbitLines = [];

    // State Variables
    this.currentScaleLevel = 'GALAXY';
    this.timeScale = 1.0;
    this.simulationDays = 0.0;
    this.isPaused = false;
    this.isCrispMode = false;
    this.clock = new THREE.Clock();

    // Camera & Tweening
    this.focusedObject = null;
    this.targetCameraPosition = INITIAL_COSMIC_POS.clone();
    this.targetLookAt = new THREE.Vector3(0, 0, 0);
    this.isTransitioningCamera = false;
    this.isAutoTourActive = false;
    this.autoTourIndex = 0;
    this.autoTourTimer = 0.0;

    // Raycasting & Interaction
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-999, -999);
    this.interactiveObjects = [];
    this.textureLoader = new THREE.TextureLoader();

    // Shared particle texture for galaxies
    this.sharedParticleTexture = this.generateParticleTexture();

    // Build Scene Graph
    this.initThree();
    this.initLights();
    this.initDeepSkyMilkyWay();
    this.initGalaxiesRealm();
    this.initSun();
    this.initPlanetsAndMoons();
    this.initArtificialSatellites();
    this.initUIEvents();
    this.initNavigatorDropdown();
    this.initTimeControls();
    this.initClarityControl();
    this.fetchBackendTelemetry();

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);

    setTimeout(() => {
      const loader = document.getElementById('loading-screen');
      if (loader) loader.classList.add('fade-out');
    }, 600);
  }

  // ----------------------------------------------------------------------------
  // Three.js Scene, Camera, High-Precision WebGL Renderer
  // ----------------------------------------------------------------------------
  initThree() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      150000
    );
    this.camera.position.copy(INITIAL_COSMIC_POS);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      logarithmicDepthBuffer: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxDistance = 12000;
    this.controls.minDistance = 2.0;

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  // ----------------------------------------------------------------------------
  // Lighting: Sunlight & Cosmic Contrast
  // ----------------------------------------------------------------------------
  initLights() {
    this.sunLight = new THREE.PointLight(0xfff8ee, 3.2, 0, 0);
    this.sunLight.position.set(0, 0, 0);
    this.sunLight.castShadow = true;
    this.scene.add(this.sunLight);

    this.ambientLight = new THREE.AmbientLight(0x1a2638, 0.75);
    this.scene.add(this.ambientLight);
  }

  // ----------------------------------------------------------------------------
  // Deep Sky Skydome (360 Equirectangular Star Background)
  // ----------------------------------------------------------------------------
  initDeepSkyMilkyWay() {
    const skydomeGeo = new THREE.SphereGeometry(65000, 64, 32);
    const skydomeMat = new THREE.MeshBasicMaterial({ side: THREE.BackSide, color: 0x03050c });
    const skydome = new THREE.Mesh(skydomeGeo, skydomeMat);
    this.scene.add(skydome);

    this.textureLoader.load('textures/milkyway.jpg', (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      skydomeMat.map = tex;
      skydomeMat.color.setHex(0xffffff);
      skydomeMat.needsUpdate = true;
    });
  }

  // ----------------------------------------------------------------------------
  // Helper: Glow Particle Texture Generator
  // ----------------------------------------------------------------------------
  generateParticleTexture() {
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const pCtx = pCanvas.getContext('2d');
    const grad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(210, 235, 255, 0.85)');
    grad.addColorStop(0.7, 'rgba(100, 180, 255, 0.25)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    pCtx.fillStyle = grad;
    pCtx.fillRect(0, 0, 32, 32);
    const tex = new THREE.CanvasTexture(pCanvas);
    tex.generateMipmaps = true;
    return tex;
  }

  // ----------------------------------------------------------------------------
  // Multi-Galaxy Cosmic Realm (Milky Way, Andromeda, Triangulum, Sombrero, Whirlpool)
  // ----------------------------------------------------------------------------
  initGalaxiesRealm() {
    this.galaxiesGroup = new THREE.Group();

    GALAXY_CONFIGS.forEach((cfg) => {
      const galaxyObj = this.buildIndividualGalaxy(cfg);
      this.galaxies.set(cfg.id, galaxyObj);
      this.galaxiesGroup.add(galaxyObj.group);
    });

    this.scene.add(this.galaxiesGroup);
  }

  buildIndividualGalaxy(cfg) {
    const group = new THREE.Group();
    group.position.copy(cfg.position);

    if (cfg.tiltX) group.rotation.x = cfg.tiltX;
    if (cfg.tiltZ) group.rotation.z = cfg.tiltZ;

    const starCount = cfg.starCount;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    const colorCore = new THREE.Color(cfg.colorCore);
    const colorArm = new THREE.Color(cfg.colorArm);
    const colorHII = new THREE.Color(cfg.colorHII);
    const colorDust = new THREE.Color(cfg.colorDust);

    for (let i = 0; i < starCount; i++) {
      let x, y, z;
      const mixedColor = colorCore.clone();

      if (cfg.isRingGalaxy) {
        // Cartwheel Galaxy: Inner Ring + Spokes + Outer High-Speed Compression Ring
        const pType = Math.random();
        if (pType < 0.22) {
          // Inner core ring
          const r = cfg.radius * (0.12 + Math.random() * 0.16);
          const theta = Math.random() * Math.PI * 2;
          x = Math.cos(theta) * r + (Math.random() - 0.5) * 12;
          y = (Math.random() - 0.5) * 15;
          z = Math.sin(theta) * r + (Math.random() - 0.5) * 12;
          mixedColor.copy(colorCore);
        } else if (pType < 0.42) {
          // Radiating Spokes
          const spokeIdx = Math.floor(Math.random() * 8);
          const spokeAngle = (spokeIdx / 8) * Math.PI * 2 + (Math.random() - 0.5) * 0.15;
          const r = cfg.radius * (0.28 + Math.random() * 0.48);
          x = Math.cos(spokeAngle) * r + (Math.random() - 0.5) * 20;
          y = (Math.random() - 0.5) * 18;
          z = Math.sin(spokeAngle) * r + (Math.random() - 0.5) * 20;
          mixedColor.copy(colorArm).lerp(colorDust, Math.random() * 0.5);
        } else {
          // Massive Expanding Outer Starburst Ring
          const r = cfg.radius * (0.76 + Math.random() * 0.24);
          const theta = Math.random() * Math.PI * 2;
          x = Math.cos(theta) * r + (Math.random() - 0.5) * 24;
          y = (Math.random() - 0.5) * 22;
          z = Math.sin(theta) * r + (Math.random() - 0.5) * 24;
          if (Math.random() < 0.45) {
            mixedColor.copy(colorHII); // Brilliant pink H-II starburst knot
          } else {
            mixedColor.copy(colorArm); // Searing hot young blue stars
          }
        }
      } else if (cfg.isStarburstWithPlumes) {
        // Cigar Galaxy (M82): Edge-on dense disk + vertical bipolar ionized gas outflow plumes
        if (Math.random() < 0.45) {
          // Bipolar vertical gas plumes blasting in ±Y
          const plumeDir = Math.random() < 0.5 ? 1 : -1;
          const distY = (Math.pow(Math.random(), 1.4) * cfg.radius * 0.65) * plumeDir;
          const coneRadius = Math.abs(distY) * 0.35 + 15;
          const angle = Math.random() * Math.PI * 2;
          const spreadR = Math.random() * coneRadius;
          x = Math.cos(angle) * spreadR + (Math.random() - 0.5) * 40;
          y = distY;
          z = Math.sin(angle) * spreadR + (Math.random() - 0.5) * 40;
          mixedColor.copy(colorHII).lerp(new THREE.Color('#f97316'), Math.random() * 0.5);
        } else {
          // Dense elongated edge-on galactic disk
          const len = (Math.random() - 0.5) * cfg.radius * 1.5;
          const wid = (Math.random() - 0.5) * 45;
          x = len;
          y = (Math.random() - 0.5) * 16;
          z = wid;
          mixedColor.copy(colorCore).lerp(colorArm, Math.abs(len) / (cfg.radius * 0.75));
        }
      } else if (cfg.hasDarkEyeBand) {
        // Black Eye Galaxy (M64): Inner disk + dense dark absorbing dust band + counter-rotating outer disk
        const r = Math.pow(Math.random(), 1.8) * cfg.radius;
        const theta = Math.random() * Math.PI * 2 + Math.log(r + 1.0) * 1.5;
        const spread = (Math.random() - 0.5) * 18;
        x = Math.cos(theta) * r + spread;
        y = (Math.random() - 0.5) * (r * 0.06 + 8);
        z = Math.sin(theta) * r + spread;

        // Dark absorbing dust band wrapping around the inner nucleus
        if (r > cfg.radius * 0.22 && r < cfg.radius * 0.42 && Math.sin(theta) > -0.2) {
          mixedColor.copy(colorDust);
        } else if (r < cfg.radius * 0.22) {
          mixedColor.copy(colorCore);
        } else {
          mixedColor.copy(colorArm).lerp(colorHII, Math.random() * 0.3);
        }
      } else if (cfg.hasRelativisticJets) {
        // Centaurus A (NGC 5128): Giant Elliptical Halo + Warped Dust Lane + Relativistic Jets
        const pType = Math.random();
        if (pType < 0.15) {
          // Dual Relativistic Polar Jets shooting along Y axis
          const jetSign = Math.random() < 0.5 ? 1 : -1;
          const jetY = (Math.pow(Math.random(), 1.2) * cfg.radius * 0.85) * jetSign;
          const jetSpread = Math.abs(jetY) * 0.12 + 6;
          const jetTheta = Math.random() * Math.PI * 2;
          const jr = Math.random() * jetSpread;
          x = Math.cos(jetTheta) * jr;
          y = jetY;
          z = Math.sin(jetTheta) * jr;
          mixedColor.set('#38bdf8'); // High energy synchrotron radiation
        } else if (pType < 0.40) {
          // Warped bisecting dark dust lane
          const r = Math.pow(Math.random(), 1.2) * cfg.radius * 0.75;
          const theta = Math.random() * Math.PI * 2;
          x = Math.cos(theta) * r;
          y = Math.sin(theta * 2.0) * 22; // Warped saddle shape
          z = Math.sin(theta) * r;
          mixedColor.copy(colorDust);
        } else {
          // Giant Ellipsoidal Stellar Halo
          const r = Math.pow(Math.random(), 1.6) * cfg.radius * 0.85;
          const u = Math.random() * 2 - 1;
          const phi = Math.random() * Math.PI * 2;
          const sinU = Math.sqrt(1 - u * u);
          x = r * sinU * Math.cos(phi);
          y = r * u * 0.75;
          z = r * sinU * Math.sin(phi);
          mixedColor.copy(colorCore).lerp(colorArm, r / (cfg.radius * 0.85));
        }
      } else if (cfg.hasTidalTail && Math.random() < 0.38) {
        // Tadpole Galaxy (Arp 188): Massive 280,000-light-year sweeping tidal tail
        const progress = Math.random();
        const tailDist = progress * cfg.radius * 2.4;
        const curveAngle = progress * 1.6;
        const spread = (Math.random() - 0.5) * (30 + progress * 60);

        x = -Math.cos(curveAngle) * tailDist + spread;
        y = (Math.random() - 0.5) * 20;
        z = -Math.sin(curveAngle) * tailDist + spread;

        // Studded with bright blue super star clusters
        if (Math.random() < 0.3) {
          mixedColor.set('#60a5fa');
        } else if (Math.random() < 0.15) {
          mixedColor.copy(colorHII);
        } else {
          mixedColor.copy(colorArm);
        }
      } else if (cfg.hasCentralBar && Math.random() < 0.2) {
        // Central Barred Core Structure
        const barLen = (Math.random() - 0.5) * cfg.barLength;
        const barWid = (Math.random() - 0.5) * cfg.barWidth * (1.0 - Math.abs(barLen) / (cfg.barLength * 0.6));
        const barAng = THREE.MathUtils.degToRad(30.0);

        x = barLen * Math.cos(barAng) - barWid * Math.sin(barAng);
        y = (Math.random() - 0.5) * 28;
        z = barLen * Math.sin(barAng) + barWid * Math.cos(barAng);
        mixedColor.copy(colorCore);
      } else if (cfg.isEdgeOnWithDustRing) {
        // Sombrero Galaxy: Giant Spheroidal Bulge + Razor Dark Circumstellar Dust Ring
        const isDustRing = Math.random() < 0.35;
        if (isDustRing) {
          const ringR = cfg.radius * (0.65 + Math.random() * 0.35);
          const theta = Math.random() * Math.PI * 2;
          x = Math.cos(theta) * ringR + (Math.random() - 0.5) * 15;
          y = (Math.random() - 0.5) * 6; // razor thin
          z = Math.sin(theta) * ringR + (Math.random() - 0.5) * 15;
          mixedColor.copy(colorDust);
        } else {
          // Giant Luminous Ellipsoidal Bulge / Halo
          const r = Math.pow(Math.random(), 1.6) * cfg.radius * 0.7;
          const u = Math.random() * 2 - 1;
          const phi = Math.random() * Math.PI * 2;
          const sinU = Math.sqrt(1 - u * u);
          x = r * sinU * Math.cos(phi);
          y = r * u * 0.65; // Oblate spheroid
          z = r * sinU * Math.sin(phi);
          mixedColor.copy(colorCore).lerp(colorArm, r / (cfg.radius * 0.7));
        }
      } else {
        // Standard Logarithmic Spiral Arms
        const r = Math.pow(Math.random(), 2.0) * cfg.radius;
        const armIndex = i % (cfg.arms || 2);
        const armAngle = (armIndex / (cfg.arms || 2)) * Math.PI * 2;
        const spiralTheta = Math.log(r + 1.0) * 1.85 + armAngle;

        const spreadX = (Math.random() - 0.5) * (r * 0.22 + 16);
        const spreadY = (Math.random() - 0.5) * (r * 0.08 + 8) * (1.0 - r / cfg.radius);
        const spreadZ = (Math.random() - 0.5) * (r * 0.22 + 16);

        x = Math.cos(spiralTheta) * r + spreadX;
        y = spreadY;
        z = Math.sin(spiralTheta) * r + spreadZ;

        const progress = r / cfg.radius;
        if (progress < 0.28) {
          mixedColor.lerp(colorArm, progress / 0.28);
        } else if (Math.random() < 0.14) {
          mixedColor.copy(colorHII); // H-II glowing pink emission nebula
        } else if (Math.random() < 0.18) {
          mixedColor.copy(colorDust); // Dust lane
        } else {
          mixedColor.copy(colorArm).lerp(new THREE.Color('#c084fc'), (progress - 0.28) / 0.72);
        }
      }

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: cfg.id === 'milkyway' ? 2.5 : 2.8,
      map: this.sharedParticleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const points = new THREE.Points(geo, mat);
    group.add(points);

    // Supermassive Core Glow Sphere
    // For Milky Way, offset the Sagittarius A* core so it does NOT collide with our Sun at (0, 0, 0)
    const coreGeo = new THREE.SphereGeometry(cfg.radius * 0.045, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: cfg.colorCore,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    if (cfg.id === 'milkyway') {
      core.position.set(-380, 0, -220); // Sagittarius A* Location in Galactic Core
    }
    group.add(core);

    // Companion Galaxy for Whirlpool (NGC 5195)
    if (cfg.hasCompanion && cfg.companionOffset) {
      const compGroup = new THREE.Group();
      compGroup.position.copy(cfg.companionOffset);
      const compCount = 4500;
      const compPositions = new Float32Array(compCount * 3);
      const compColors = new Float32Array(compCount * 3);
      const compColor = new THREE.Color('#e17055');

      for (let j = 0; j < compCount; j++) {
        const cr = Math.pow(Math.random(), 1.5) * 180;
        const u = Math.random() * 2 - 1;
        const phi = Math.random() * Math.PI * 2;
        const sinU = Math.sqrt(1 - u * u);
        compPositions[j * 3] = cr * sinU * Math.cos(phi);
        compPositions[j * 3 + 1] = cr * u * 0.6;
        compPositions[j * 3 + 2] = cr * sinU * Math.sin(phi);

        compColors[j * 3] = compColor.r;
        compColors[j * 3 + 1] = compColor.g;
        compColors[j * 3 + 2] = compColor.b;
      }
      const compGeo = new THREE.BufferGeometry();
      compGeo.setAttribute('position', new THREE.BufferAttribute(compPositions, 3));
      compGeo.setAttribute('color', new THREE.BufferAttribute(compColors, 3));
      const compPoints = new THREE.Points(compGeo, mat);
      compGroup.add(compPoints);
      group.add(compGroup);
    }

    // Solar System Position Marker inside Milky Way
    if (cfg.id === 'milkyway') {
      const markerGroup = new THREE.Group();
      markerGroup.position.set(0, 0, 0); // Solar System Reference Datum

      const markerGeo = new THREE.RingGeometry(8, 14, 32);
      const markerMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
      });
      this.solarMarker = new THREE.Mesh(markerGeo, markerMat);
      this.solarMarker.rotation.x = Math.PI / 2;
      markerGroup.add(this.solarMarker);

      group.add(markerGroup);
    }

    // Invisible Raycast Hitbox Mesh for Reliable Zoom & Clicks
    const hitboxGeo = new THREE.SphereGeometry(cfg.hitRadius, 16, 16);
    const hitboxMat = new THREE.MeshBasicMaterial({ visible: false, wireframe: true });
    const hitboxMesh = new THREE.Mesh(hitboxGeo, hitboxMat);
    hitboxMesh.userData = {
      id: cfg.id,
      name: cfg.name,
      category: 'GALAXY',
      type: cfg.type,
      config: cfg,
      radius: cfg.radius,
      cameraOffset: cfg.cameraOffset
    };
    group.add(hitboxMesh);
    this.interactiveObjects.push(hitboxMesh);

    return { group, points, core, config: cfg, hitbox: hitboxMesh };
  }

  // ----------------------------------------------------------------------------
  // The Sun: Convective Photosphere, Pulsing Corona & Radiant Solar Glare
  // ----------------------------------------------------------------------------
  initSun() {
    const sunData = CELESTIAL_CONFIG.sun;
    const sunGeo = new THREE.SphereGeometry(sunData.radius, 64, 64);

    // Texture loader with repeat wrapping and sRGB color space
    this.sunTex = this.textureLoader.load(sunData.textureFile, (tex) => {
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
    });
    this.sunTex.wrapS = THREE.RepeatWrapping;
    this.sunTex.wrapT = THREE.RepeatWrapping;

    // 1. Core Photosphere: 100% Guaranteed Self-Luminous Photosphere
    const sunMat = new THREE.MeshBasicMaterial({
      map: this.sunTex,
      color: 0xfff6c0
    });

    this.sunMesh = new THREE.Mesh(sunGeo, sunMat);
    this.sunMesh.userData = {
      id: sunData.id,
      name: sunData.name,
      category: sunData.category,
      radius: sunData.radius
    };
    this.scene.add(this.sunMesh);
    this.interactiveObjects.push(this.sunMesh);

    // 2. Inner Chromosphere Glow Shell (Additive Blending)
    const innerCoronaGeo = new THREE.SphereGeometry(sunData.radius * 1.05, 32, 32);
    const innerCoronaMat = new THREE.MeshBasicMaterial({
      color: 0xff9900,
      transparent: true,
      opacity: 0.38,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false
    });
    this.sunInnerCorona = new THREE.Mesh(innerCoronaGeo, innerCoronaMat);
    this.sunMesh.add(this.sunInnerCorona);

    // 3. Outer Coronal Atmosphere (Pulsing Additive Halo)
    const coronaGeo = new THREE.SphereGeometry(sunData.radius * 1.25, 32, 32);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: 0xff5500,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false
    });
    this.sunCorona = new THREE.Mesh(coronaGeo, coronaMat);
    this.sunMesh.add(this.sunCorona);

    // 4. Cosmic Solar Flare Glare Billboard Sprite (visible throughout Solar System)
    const flareCanvas = document.createElement('canvas');
    flareCanvas.width = 256;
    flareCanvas.height = 256;
    const fCtx = flareCanvas.getContext('2d');
    const fGrad = fCtx.createRadialGradient(128, 128, 0, 128, 128, 128);
    fGrad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    fGrad.addColorStop(0.12, 'rgba(255, 235, 140, 0.95)');
    fGrad.addColorStop(0.28, 'rgba(255, 160, 25, 0.70)');
    fGrad.addColorStop(0.55, 'rgba(255, 80, 0, 0.28)');
    fGrad.addColorStop(0.82, 'rgba(255, 30, 0, 0.06)');
    fGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    fCtx.fillStyle = fGrad;
    fCtx.fillRect(0, 0, 256, 256);

    const flareTex = new THREE.CanvasTexture(flareCanvas);
    const flareMat = new THREE.SpriteMaterial({
      map: flareTex,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false
    });
    this.sunFlareSprite = new THREE.Sprite(flareMat);
    this.sunFlareSprite.scale.set(sunData.radius * 6.5, sunData.radius * 6.5, 1.0);
    this.sunFlareSprite.renderOrder = 5;
    this.scene.add(this.sunFlareSprite);
  }

  // ----------------------------------------------------------------------------
  // Planets & Moons Initialization
  // ----------------------------------------------------------------------------
  initPlanetsAndMoons() {
    Object.keys(CELESTIAL_CONFIG).forEach((key) => {
      if (key === 'sun') return;
      const data = CELESTIAL_CONFIG[key];
      const planetRadius = data.radius;
      const planetGeo = new THREE.SphereGeometry(planetRadius, 64, 64);
      let planetMat;

      // Authentic Texture Loading
      const planetTex = this.textureLoader.load(data.textureFile);
      planetTex.colorSpace = THREE.SRGBColorSpace;

      // 1. Earth Day/Night Terminator + Rayleigh Atmosphere + Ocean Glint
      if (key === 'earth') {
        const nightTex = this.textureLoader.load(data.nightFile);
        nightTex.colorSpace = THREE.SRGBColorSpace;
        const specularTex = this.textureLoader.load(data.specularFile);
        const bumpTex = this.textureLoader.load(data.bumpFile);

        planetMat = new THREE.ShaderMaterial({
          uniforms: {
            dayMap: { value: planetTex },
            nightMap: { value: nightTex },
            specularMap: { value: specularTex },
            bumpMap: { value: bumpTex },
            sunDirection: { value: new THREE.Vector3(0, 0, 0) }
          },
          vertexShader: `
            varying vec2 vUv;
            varying vec3 vWorldNormal;
            varying vec3 vWorldPosition;
            void main() {
              vUv = uv;
              vec4 worldPos = modelMatrix * vec4(position, 1.0);
              vWorldPosition = worldPos.xyz;
              vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
              gl_Position = projectionMatrix * viewMatrix * worldPos;
            }
          `,
          fragmentShader: `
            uniform sampler2D dayMap;
            uniform sampler2D nightMap;
            uniform sampler2D specularMap;
            uniform sampler2D bumpMap;
            uniform vec3 sunDirection;
            varying vec2 vUv;
            varying vec3 vWorldNormal;
            varying vec3 vWorldPosition;

            void main() {
              vec3 sunDir = normalize(sunDirection - vWorldPosition);
              vec3 normal = normalize(vWorldNormal);
              float nDotL = dot(normal, sunDir);

              vec4 dayColor = texture2D(dayMap, vUv);
              vec4 nightColor = texture2D(nightMap, vUv);
              float specularStrength = texture2D(specularMap, vUv).r;

              float mixValue = smoothstep(-0.18, 0.22, nDotL);
              vec3 base = mix(nightColor.rgb * 1.85, dayColor.rgb, mixValue);

              vec3 viewDir = normalize(cameraPosition - vWorldPosition);
              vec3 halfVector = normalize(sunDir + viewDir);
              float NdotH = max(dot(normal, halfVector), 0.0);
              float glint = pow(NdotH, 64.0) * specularStrength * max(nDotL, 0.0) * 1.6;

              float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
              vec3 atmosphere = vec3(0.25, 0.65, 1.0) * fresnel * max(nDotL + 0.3, 0.0) * 0.9;

              gl_FragColor = vec4(base + vec3(glint) + atmosphere, 1.0);
            }
          `
        });
      } else {
        // Standard high-fidelity MeshStandardMaterial with bump mapping
        planetMat = new THREE.MeshStandardMaterial({
          map: planetTex,
          roughness: key === 'venus' ? 0.3 : 0.85,
          metalness: 0.05
        });

        if (data.bumpFile) {
          planetMat.bumpMap = this.textureLoader.load(data.bumpFile);
          planetMat.bumpScale = data.bumpScale || 0.05;
        }
      }

      const planetMesh = new THREE.Mesh(planetGeo, planetMat);
      planetMesh.castShadow = true;
      planetMesh.receiveShadow = true;

      const orbitalDistance = data.a_au * DISTANCE_SCALE;
      planetMesh.userData = {
        id: data.id,
        name: data.name,
        category: data.category,
        config: data,
        distance: orbitalDistance,
        radius: planetRadius
      };

      // Orbit Ring Visualizer
      const orbitGeo = new THREE.BufferGeometry();
      const orbitPoints = [];
      const segments = 128;
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const x = Math.cos(theta) * orbitalDistance;
        const z = Math.sin(theta) * orbitalDistance;
        const y = Math.sin(theta) * orbitalDistance * Math.sin(THREE.MathUtils.degToRad(data.inclinationDeg));
        orbitPoints.push(new THREE.Vector3(x, y, z));
      }
      orbitGeo.setFromPoints(orbitPoints);
      const orbitLine = new THREE.Line(orbitGeo, new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.18
      }));
      this.scene.add(orbitLine);
      this.orbitLines.push(orbitLine);

      // Earth Cloud Layer & Moon
      if (key === 'earth') {
        const cloudTex = this.textureLoader.load(data.cloudsFile);
        const cloudGeo = new THREE.SphereGeometry(planetRadius * 1.02, 64, 64);
        const cloudMat = new THREE.MeshStandardMaterial({
          map: cloudTex,
          transparent: true,
          opacity: 0.55,
          blending: THREE.AdditiveBlending
        });
        this.earthClouds = new THREE.Mesh(cloudGeo, cloudMat);
        planetMesh.add(this.earthClouds);

        // The Moon (Luna)
        const moonGeo = new THREE.SphereGeometry(0.42, 32, 32);
        const moonTex = this.textureLoader.load('textures/moon.jpg');
        moonTex.colorSpace = THREE.SRGBColorSpace;
        const moonBump = this.textureLoader.load('textures/moon_bump.jpg');
        const moonMat = new THREE.MeshStandardMaterial({ map: moonTex, bumpMap: moonBump, bumpScale: 0.05, roughness: 0.9 });
        this.moonMesh = new THREE.Mesh(moonGeo, moonMat);
        this.moonMesh.userData = {
          id: 'moon',
          name: 'The Moon (Luna)',
          category: 'NATURAL SATELLITE',
          parentName: 'earth',
          distance: 5.8,
          speed: 0.027,
          angle: 0.0,
          radius: 0.42
        };
        this.scene.add(this.moonMesh);
        this.moons.push({ mesh: this.moonMesh, parent: planetMesh });
        this.interactiveObjects.push(this.moonMesh);
      }

      // Mars Moons: Phobos & Deimos
      if (key === 'mars') {
        this.createGenericMoon({ name: 'Phobos', parent: planetMesh, radius: 0.18, distance: 2.2, speed: 0.08, color: 0x8c7e6c });
        this.createGenericMoon({ name: 'Deimos', parent: planetMesh, radius: 0.12, distance: 3.4, speed: 0.045, color: 0xa39585 });
      }

      // Saturn Cassini Rings with Planetary Shadow Cone
      if (key === 'saturn') {
        const ringGeo = new THREE.RingGeometry(planetRadius * 1.35, planetRadius * 2.55, 64);
        const ringTex = this.textureLoader.load(data.ringsFile);

        const ringMat = new THREE.ShaderMaterial({
          uniforms: {
            ringTexture: { value: ringTex },
            saturnRadius: { value: planetRadius }
          },
          vertexShader: `
            varying vec2 vUv;
            varying vec3 vLocalPos;
            void main() {
              vUv = uv;
              vLocalPos = position;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform sampler2D ringTexture;
            uniform float saturnRadius;
            varying vec2 vUv;
            varying vec3 vLocalPos;

            void main() {
              vec4 texColor = texture2D(ringTexture, vec2(vUv.x, 0.5));
              if (texColor.a < 0.05) discard;

              vec3 ringPoint = vLocalPos;
              float distToShadowAxis = length(vec2(ringPoint.y, ringPoint.z));
              float inShadow = (ringPoint.x > 0.0 && distToShadowAxis < saturnRadius * 1.05) ? 0.12 : 1.0;

              vec3 ringColor = texColor.rgb * inShadow * 1.15;
              gl_FragColor = vec4(ringColor, texColor.a * 0.95);
            }
          `,
          side: THREE.DoubleSide,
          transparent: true,
          depthWrite: false
        });

        const saturnRings = new THREE.Mesh(ringGeo, ringMat);
        saturnRings.rotation.x = Math.PI / 2;
        planetMesh.add(saturnRings);

        // Titan & Enceladus
        this.createGenericMoon({ name: 'Titan', parent: planetMesh, radius: 0.55, distance: 8.5, speed: 0.02, color: 0xd4a359 });
        this.createGenericMoon({ name: 'Enceladus', parent: planetMesh, radius: 0.22, distance: 5.6, speed: 0.04, color: 0xffffff });
      }

      // Jupiter Galilean Moons
      if (key === 'jupiter') {
        [
          { name: 'Io', radius: 0.38, distance: 6.2, speed: 0.05, color: 0xdfc136 },
          { name: 'Europa', radius: 0.35, distance: 7.8, speed: 0.038, color: 0xccc3ae },
          { name: 'Ganymede', radius: 0.52, distance: 9.8, speed: 0.026, color: 0x938575 },
          { name: 'Callisto', radius: 0.48, distance: 12.2, speed: 0.018, color: 0x6e6357 }
        ].forEach(m => this.createGenericMoon({ ...m, parent: planetMesh }));
      }

      // Neptune: Triton (Retrograde)
      if (key === 'neptune') {
        this.createGenericMoon({ name: 'Triton', parent: planetMesh, radius: 0.42, distance: 6.4, speed: -0.025, color: 0x93b7be });
      }

      this.scene.add(planetMesh);
      this.planets.set(key, planetMesh);
      this.interactiveObjects.push(planetMesh);
    });
  }

  createGenericMoon({ name, parent, radius, distance, speed, color }) {
    const moonGeo = new THREE.SphereGeometry(radius, 32, 32);
    const moonMat = new THREE.MeshStandardMaterial({ color, roughness: 0.9 });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonMesh.userData = {
      id: name.toLowerCase(),
      name,
      category: 'NATURAL SATELLITE',
      parentName: parent.userData.id,
      distance: distance * MOON_DISTANCE_SCALE,
      speed,
      angle: Math.random() * Math.PI * 2,
      radius
    };
    this.scene.add(moonMesh);
    this.moons.push({ mesh: moonMesh, parent });
    this.interactiveObjects.push(moonMesh);
  }

  // ----------------------------------------------------------------------------
  // Artificial Satellites: ISS, Tiangong CSS, JWST, Hubble, Voyager 1 & 2, Parker
  // ----------------------------------------------------------------------------
  initArtificialSatellites() {
    this.earthMesh = this.planets.get('earth');
    if (!this.earthMesh) return;

    const issBodyMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.85, roughness: 0.15 });
    const issSolarMat = new THREE.MeshStandardMaterial({ color: 0x0f2b5c, metalness: 0.95, roughness: 0.08 });
    const issTrussMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.7, roughness: 0.3 });

    // 1. ISS (International Space Station)
    this.issGroup = new THREE.Group();
    const bodyCylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.32, 16), issBodyMat);
    bodyCylinder.rotation.z = Math.PI / 2;
    this.issGroup.add(bodyCylinder);

    const truss = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.02, 0.02), issTrussMat);
    this.issGroup.add(truss);

    this.issSolarGimbal = new THREE.Group();
    const solarWingGeo = new THREE.BoxGeometry(0.42, 0.005, 0.14);
    const leftWing = new THREE.Mesh(solarWingGeo, issSolarMat);
    leftWing.position.x = -0.32;
    const rightWing = new THREE.Mesh(solarWingGeo, issSolarMat);
    rightWing.position.x = 0.32;
    this.issSolarGimbal.add(leftWing, rightWing);
    this.issGroup.add(this.issSolarGimbal);

    const beaconLight = new THREE.PointLight(0x00f0ff, 1.8, 2.5);
    this.issGroup.add(beaconLight);

    this.issGroup.userData = {
      id: 'iss',
      name: 'International Space Station (ISS)',
      category: 'ARTIFICIAL SATELLITE (LEO)',
      altitude_km: 420,
      speed_kms: 7.66,
      orbitRadius: 2.1,
      inclination: THREE.MathUtils.degToRad(51.64),
      speed: 0.04,
      angle: 0.0,
      radius: 0.5
    };
    this.scene.add(this.issGroup);
    this.satellites.push(this.issGroup);
    this.interactiveObjects.push(bodyCylinder);
    bodyCylinder.userData = this.issGroup.userData;

    // ISS Orbit Path Visualizer
    const issOrbitGeo = new THREE.BufferGeometry();
    const issPoints = [];
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      const r = 2.1;
      issPoints.push(new THREE.Vector3(
        r * Math.cos(a),
        r * Math.sin(a) * Math.sin(THREE.MathUtils.degToRad(51.64)),
        r * Math.sin(a) * Math.cos(THREE.MathUtils.degToRad(51.64))
      ));
    }
    issOrbitGeo.setFromPoints(issPoints);
    this.issOrbitTrail = new THREE.Line(issOrbitGeo, new THREE.LineBasicMaterial({
      color: 0xffb703,
      transparent: true,
      opacity: 0.35
    }));
    this.scene.add(this.issOrbitTrail);

    // 2. Tiangong Space Station (CSS - China Manned Space Agency)
    this.tiangongGroup = new THREE.Group();
    const cssBodyMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.9, roughness: 0.1 });
    const cssSolarMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.95, roughness: 0.05 });

    // Tianhe Core Module (Cylinder)
    const tianheCore = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.28, 16), cssBodyMat);
    tianheCore.rotation.z = Math.PI / 2;
    this.tiangongGroup.add(tianheCore);

    // Wentian & Mengtian Lab Modules in T-Shape
    const labModule1 = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.22, 16), cssBodyMat);
    labModule1.position.set(0, 0, 0.12);
    labModule1.rotation.x = Math.PI / 2;
    const labModule2 = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.22, 16), cssBodyMat);
    labModule2.position.set(0, 0, -0.12);
    labModule2.rotation.x = Math.PI / 2;
    this.tiangongGroup.add(labModule1, labModule2);

    // Large Flexible Solar Arrays for Tiangong
    this.tiangongSolarGimbal = new THREE.Group();
    const cssSolarGeo = new THREE.BoxGeometry(0.38, 0.005, 0.12);
    const cssSolarL = new THREE.Mesh(cssSolarGeo, cssSolarMat);
    cssSolarL.position.x = -0.28;
    const cssSolarR = new THREE.Mesh(cssSolarGeo, cssSolarMat);
    cssSolarR.position.x = 0.28;
    this.tiangongSolarGimbal.add(cssSolarL, cssSolarR);
    this.tiangongGroup.add(this.tiangongSolarGimbal);

    // Emerald Navigation Strobe Beacon
    const tiangongBeacon = new THREE.PointLight(0x06d6a0, 1.8, 2.5);
    this.tiangongGroup.add(tiangongBeacon);

    this.tiangongGroup.userData = {
      id: 'tiangong',
      name: 'Tiangong Space Station (CSS)',
      category: 'MODULAR SPACE STATION (LEO)',
      altitude_km: 390,
      speed_kms: 7.68,
      orbitRadius: 2.02,
      inclination: THREE.MathUtils.degToRad(41.47),
      speed: 0.042,
      angle: 2.1,
      radius: 0.5
    };
    this.scene.add(this.tiangongGroup);
    this.satellites.push(this.tiangongGroup);
    this.interactiveObjects.push(tianheCore);
    tianheCore.userData = this.tiangongGroup.userData;

    // Tiangong Orbit Path
    const tgOrbitGeo = new THREE.BufferGeometry();
    const tgPoints = [];
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      const r = 2.02;
      tgPoints.push(new THREE.Vector3(
        r * Math.cos(a),
        r * Math.sin(a) * Math.sin(THREE.MathUtils.degToRad(41.47)),
        r * Math.sin(a) * Math.cos(THREE.MathUtils.degToRad(41.47))
      ));
    }
    tgOrbitGeo.setFromPoints(tgPoints);
    this.tiangongOrbitTrail = new THREE.Line(tgOrbitGeo, new THREE.LineBasicMaterial({
      color: 0x06d6a0,
      transparent: true,
      opacity: 0.35
    }));
    this.scene.add(this.tiangongOrbitTrail);

    // 3. JWST (James Webb Space Telescope at Sun-Earth L2)
    this.jwstGroup = new THREE.Group();
    const jwstSunshieldMat = new THREE.MeshStandardMaterial({ color: 0xd8b4e2, metalness: 0.92, roughness: 0.1 });
    const jwstMirrorMat = new THREE.MeshStandardMaterial({ color: 0xffb703, metalness: 0.98, roughness: 0.02 });

    const mirrorMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.015, 6), jwstMirrorMat);
    mirrorMesh.rotation.x = Math.PI / 2;
    const sunshieldMesh = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.008, 0.24), jwstSunshieldMat);
    this.jwstGroup.add(sunshieldMesh, mirrorMesh);

    this.jwstGroup.userData = {
      id: 'jwst',
      name: 'James Webb Space Telescope (JWST)',
      category: 'DEEP SPACE OBSERVATORY (L2)',
      altitude_km: 1500000,
      speed_kms: 0.20,
      orbitRadius: 7.2,
      inclination: 0.08,
      speed: 0.008,
      angle: 0.0,
      radius: 0.5
    };
    this.scene.add(this.jwstGroup);
    this.satellites.push(this.jwstGroup);
    this.interactiveObjects.push(mirrorMesh);
    mirrorMesh.userData = this.jwstGroup.userData;

    // 4. Hubble Space Telescope (HST)
    this.hstGroup = new THREE.Group();
    const hstBody = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.24, 16), issBodyMat);
    this.hstGroup.add(hstBody);
    this.hstGroup.userData = {
      id: 'hubble',
      name: 'Hubble Space Telescope (HST)',
      category: 'SPACE OBSERVATORY (LEO)',
      altitude_km: 540,
      speed_kms: 7.59,
      orbitRadius: 2.25,
      inclination: THREE.MathUtils.degToRad(28.47),
      speed: 0.038,
      angle: 1.5,
      radius: 0.4
    };
    this.scene.add(this.hstGroup);
    this.satellites.push(this.hstGroup);
    this.interactiveObjects.push(hstBody);
    hstBody.userData = this.hstGroup.userData;

    // 5. Voyager 1 (Interstellar Space Probe — Farthest Human Made Object)
    this.voyager1Group = new THREE.Group();
    this.buildVoyagerMesh(this.voyager1Group, 'voyager-1', 'Voyager 1 (Interstellar Probe)', 162.0);
    this.voyager1Group.position.set(480, 275, -360); // Out beyond planetary boundaries
    this.scene.add(this.voyager1Group);
    this.satellites.push(this.voyager1Group);

    // 6. Voyager 2 (Interstellar Space Probe — Southern Trajectory)
    this.voyager2Group = new THREE.Group();
    this.buildVoyagerMesh(this.voyager2Group, 'voyager-2', 'Voyager 2 (Interstellar Probe)', 136.0);
    this.voyager2Group.position.set(-390, -320, 420);
    this.scene.add(this.voyager2Group);
    this.satellites.push(this.voyager2Group);

    // 7. Parker Solar Probe (Touching the Sun — Flying Through Solar Corona)
    this.parkerGroup = new THREE.Group();
    const heatShieldMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.1 });
    const probeBodyMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4, metalness: 0.8 });

    // 8-ft Carbon-Composite Heat Shield (Thermal Protection System - TPS)
    const heatShield = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.03, 24), heatShieldMat);
    heatShield.rotation.x = Math.PI / 2;
    this.parkerGroup.add(heatShield);

    // Spacecraft Bus hidden in the heat shield umbra shadow
    const parkerBus = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.22), probeBodyMat);
    parkerBus.position.z = -0.13;
    this.parkerGroup.add(parkerBus);

    // Dual solar panels tucked backwards behind heat shield edge
    const pWingGeo = new THREE.BoxGeometry(0.16, 0.005, 0.08);
    const pWingL = new THREE.Mesh(pWingGeo, issSolarMat);
    pWingL.position.set(-0.16, 0, -0.15);
    const pWingR = new THREE.Mesh(pWingGeo, issSolarMat);
    pWingR.position.set(0.16, 0, -0.15);
    this.parkerGroup.add(pWingL, pWingR);

    this.parkerGroup.userData = {
      id: 'parker-solar-probe',
      name: 'Parker Solar Probe',
      category: 'HELIOCENTRIC SOLAR PROBE',
      altitude_km: 6900000,
      speed_kms: 192.0,
      orbitRadius: 13.5, // Diving in close to Sun
      speed: 0.015,
      angle: 0.4,
      radius: 0.6
    };
    this.scene.add(this.parkerGroup);
    this.satellites.push(this.parkerGroup);
    this.interactiveObjects.push(heatShield);
    heatShield.userData = this.parkerGroup.userData;

    // 8. Starlink Megaconstellation Swarm (250 Satellites)
    const starlinkCount = 250;
    const starlinkGeo = new THREE.BufferGeometry();
    const starlinkPositions = new Float32Array(starlinkCount * 3);
    for (let i = 0; i < starlinkCount; i++) {
      const alt = 2.3 + Math.random() * 0.18;
      const theta = Math.random() * Math.PI * 2;
      const inc = THREE.MathUtils.degToRad(53.05 + (Math.random() - 0.5) * 8);
      starlinkPositions[i * 3] = alt * Math.cos(theta);
      starlinkPositions[i * 3 + 1] = alt * Math.sin(theta) * Math.sin(inc);
      starlinkPositions[i * 3 + 2] = alt * Math.sin(theta) * Math.cos(inc);
    }
    starlinkGeo.setAttribute('position', new THREE.BufferAttribute(starlinkPositions, 3));

    const satCanvas = document.createElement('canvas');
    satCanvas.width = 16;
    satCanvas.height = 16;
    const sCtx = satCanvas.getContext('2d');
    sCtx.beginPath();
    sCtx.arc(8, 8, 6, 0, Math.PI * 2);
    sCtx.fillStyle = '#06d6a0';
    sCtx.fill();

    const starlinkMat = new THREE.PointsMaterial({
      map: new THREE.CanvasTexture(satCanvas),
      color: 0x06d6a0,
      size: 4.0,
      sizeAttenuation: false,
      transparent: true,
      opacity: 0.95
    });
    this.starlinkMesh = new THREE.Points(starlinkGeo, starlinkMat);
    this.scene.add(this.starlinkMesh);

    // 9. GPS Navstar Constellation Ring (MEO)
    const gpsGeo = new THREE.RingGeometry(3.2, 3.23, 64);
    const gpsMat = new THREE.MeshBasicMaterial({ color: 0x3a86ff, side: THREE.DoubleSide, transparent: true, opacity: 0.4 });
    this.gpsRing = new THREE.Mesh(gpsGeo, gpsMat);
    this.gpsRing.rotation.x = Math.PI / 2;
    this.gpsRing.rotation.y = THREE.MathUtils.degToRad(55.0);
    this.scene.add(this.gpsRing);

    // 10. Geostationary Communication Belt (GEO)
    const geoRingGeo = new THREE.RingGeometry(4.2, 4.24, 64);
    const geoRingMat = new THREE.MeshBasicMaterial({ color: 0xffb703, side: THREE.DoubleSide, transparent: true, opacity: 0.45 });
    this.geoRing = new THREE.Mesh(geoRingGeo, geoRingMat);
    this.geoRing.rotation.x = Math.PI / 2;
    this.scene.add(this.geoRing);
  }

  buildVoyagerMesh(group, id, name, distAU) {
    const dishMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2, metalness: 0.8 });
    const busMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, roughness: 0.4, metalness: 0.6 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xffb703, roughness: 0.1, metalness: 0.95 });

    // 3.7m Parabolic High Gain Antenna Dish
    const dishGeo = new THREE.CylinderGeometry(0.24, 0.05, 0.06, 24);
    const dish = new THREE.Mesh(dishGeo, dishMat);
    dish.rotation.x = Math.PI / 2;
    group.add(dish);

    // 10-sided Spacecraft Bus
    const busGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.12, 10);
    const bus = new THREE.Mesh(busGeo, busMat);
    bus.position.z = -0.09;
    group.add(bus);

    // RTG Power Boom
    const rtgBoom = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.015, 0.36), busMat);
    rtgBoom.position.set(0.18, 0, -0.15);
    rtgBoom.rotation.y = Math.PI / 4;
    group.add(rtgBoom);

    // The Golden Record (Gold-anodized phonograph disc)
    const recordGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.005, 16);
    const goldenRecord = new THREE.Mesh(recordGeo, goldMat);
    goldenRecord.position.set(-0.125, 0, -0.09);
    goldenRecord.rotation.z = Math.PI / 2;
    group.add(goldenRecord);

    group.userData = {
      id,
      name,
      category: 'INTERSTELLAR DEEP SPACE PROBE',
      altitude_km: distAU * 149597870.7,
      speed_kms: id === 'voyager-1' ? 16.99 : 15.37,
      radius: 0.7
    };
    this.interactiveObjects.push(dish);
    dish.userData = group.userData;
  }

  // ----------------------------------------------------------------------------
  // Universal System Navigator Dropdown (38 System Elements)
  // ----------------------------------------------------------------------------
  initNavigatorDropdown() {
    const wrap = document.getElementById('navigator-dropdown-wrap');
    const btn = document.getElementById('nav-dropdown-btn');
    const menu = document.getElementById('nav-dropdown-menu');
    const list = document.getElementById('dropdown-scroll-list');
    const searchInput = document.getElementById('navigator-search-input');
    const clearBtn = document.getElementById('search-clear-btn');

    if (!btn || !menu || !list) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = menu.classList.toggle('show');
      btn.classList.toggle('active', isOpen);
      if (isOpen && searchInput) {
        searchInput.focus();
      }
    });

    document.addEventListener('click', (e) => {
      if (!wrap.contains(e.target)) {
        menu.classList.remove('show');
        btn.classList.remove('active');
      }
    });

    // Populate the 44 System Objects across all categories
    const catalog = [
      {
        categoryKey: 'galaxies',
        category: 'Galaxies (Cosmic Scale - 11 Worlds)',
        items: [
          { id: 'milkyway', name: 'Milky Way Galaxy', tag: 'SBbc • 100k ly • Home', dot: '#38bdf8' },
          { id: 'andromeda', name: 'Andromeda Galaxy (M31)', tag: 'SA(s)b • 2.5M ly', dot: '#74b9ff' },
          { id: 'triangulum', name: 'Triangulum Galaxy (M33)', tag: 'SA(s)cd • 2.7M ly', dot: '#00cec9' },
          { id: 'sombrero', name: 'Sombrero Galaxy (M104)', tag: 'SA(s)a • 31.1M ly', dot: '#ffeaa7' },
          { id: 'whirlpool', name: 'Whirlpool Galaxy (M51)', tag: 'M51 • 23.5M ly', dot: '#0984e3' },
          { id: 'pinwheel', name: 'Pinwheel Galaxy (M101)', tag: 'Face-On Spiral • 20.9M ly', dot: '#60a5fa' },
          { id: 'cartwheel', name: 'Cartwheel Galaxy (ESO 350-40)', tag: 'Ring Galaxy • 500M ly', dot: '#fb7185' },
          { id: 'cigar', name: 'Cigar Galaxy (M82)', tag: 'Starburst Plumes • 12M ly', dot: '#ef4444' },
          { id: 'blackeye', name: 'Black Eye Galaxy (M64)', tag: 'Evil Eye • 17.3M ly', dot: '#a78bfa' },
          { id: 'centaurus_a', name: 'Centaurus A (NGC 5128)', tag: 'Relativistic Jets • 13M ly', dot: '#38bdf8' },
          { id: 'tadpole', name: 'Tadpole Galaxy (Arp 188)', tag: 'Tidal Tail • 420M ly', dot: '#ec4899' }
        ]
      },
      {
        categoryKey: 'planets',
        category: 'The Sun (Central Star)',
        items: [
          { id: 'sun', name: 'The Sun', tag: 'G2V Star • 1.989×10^30 kg', dot: '#ffaa00' }
        ]
      },
      {
        categoryKey: 'planets',
        category: 'Planets (Interplanetary System)',
        items: [
          { id: 'mercury', name: 'Mercury', tag: '0.387 AU • Metallic Core', dot: '#a5a5a5' },
          { id: 'venus', name: 'Venus', tag: '0.723 AU • 465 °C Runaway', dot: '#e3bb76' },
          { id: 'earth', name: 'Earth', tag: '1.000 AU • Oasis of Life', dot: '#2e7bcf' },
          { id: 'mars', name: 'Mars', tag: '1.524 AU • Olympus Mons', dot: '#cf533a' },
          { id: 'jupiter', name: 'Jupiter', tag: '5.204 AU • Great Red Spot', dot: '#c49a6c' },
          { id: 'saturn', name: 'Saturn', tag: '9.537 AU • Cassini Rings', dot: '#e0cda9' },
          { id: 'uranus', name: 'Uranus', tag: '19.19 AU • 98° Tilt Roll', dot: '#73c4c9' },
          { id: 'neptune', name: 'Neptune', tag: '30.07 AU • 2,160 km/h Winds', dot: '#3d5ef0' }
        ]
      },
      {
        categoryKey: 'moons',
        category: 'Major Natural Satellites (Moons)',
        items: [
          { id: 'moon', name: 'The Moon (Luna)', tag: 'Earth • 384,400 km', dot: '#ffffff' },
          { id: 'phobos', name: 'Phobos', tag: 'Mars • 9,377 km', dot: '#8c7e6c' },
          { id: 'deimos', name: 'Deimos', tag: 'Mars • 23,460 km', dot: '#a39585' },
          { id: 'io', name: 'Io (Active Volcanoes)', tag: 'Jupiter • 421,700 km', dot: '#e0c743' },
          { id: 'europa', name: 'Europa (Subsurface Ocean)', tag: 'Jupiter • 670,900 km', dot: '#b5ab93' },
          { id: 'ganymede', name: 'Ganymede (Largest Moon)', tag: 'Jupiter • 1,070,400 km', dot: '#938575' },
          { id: 'callisto', name: 'Callisto (Cratered Ice)', tag: 'Jupiter • 1,882,700 km', dot: '#63584c' },
          { id: 'titan', name: 'Titan (Liquid Methane Lakes)', tag: 'Saturn • 1,221,870 km', dot: '#c99a4b' },
          { id: 'enceladus', name: 'Enceladus (Cryovolcanic Geysers)', tag: 'Saturn • 238,000 km', dot: '#ffffff' },
          { id: 'triton', name: 'Triton (Retrograde Ice Moon)', tag: 'Neptune • 354,800 km', dot: '#8bbad9' }
        ]
      },
      {
        categoryKey: 'satellites',
        category: 'Artificial Spacecraft & Interstellar Probes',
        items: [
          { id: 'iss', name: 'International Space Station (ISS)', tag: 'LEO • 420 km Altitude', dot: '#ffb703' },
          { id: 'tiangong', name: 'Tiangong Space Station (CSS)', tag: 'LEO • 390 km Altitude', dot: '#06d6a0' },
          { id: 'hubble', name: 'Hubble Space Telescope (HST)', tag: 'LEO • 540 km Orbit', dot: '#00f0ff' },
          { id: 'jwst', name: 'James Webb Space Telescope (JWST)', tag: 'Sun-Earth L2 • 1.5M km', dot: '#d8b4e2' },
          { id: 'voyager-1', name: 'Voyager 1 (Interstellar Probe)', tag: 'Interstellar • >160 AU', dot: '#fbbf24' },
          { id: 'voyager-2', name: 'Voyager 2 (Grand Tour)', tag: 'Interstellar • >135 AU', dot: '#fbbf24' },
          { id: 'parker-solar-probe', name: 'Parker Solar Probe (Touching the Sun)', tag: '0.046 AU Perihelion', dot: '#f97316' },
          { id: 'starlink', name: 'Starlink Constellation', tag: 'LEO Swarm • 550 km', dot: '#06d6a0' },
          { id: 'gps', name: 'GPS Navstar Constellation', tag: 'MEO Ring • 20,200 km', dot: '#3a86ff' },
          { id: 'geostationary', name: 'Geostationary Telecom Belt', tag: 'GEO Ring • 35,786 km', dot: '#ffb703' }
        ]
      }
    ];

    list.innerHTML = '';
    catalog.forEach((sec) => {
      const catTitle = document.createElement('div');
      catTitle.className = 'dropdown-category-title';
      catTitle.dataset.categoryKey = sec.categoryKey;
      catTitle.textContent = sec.category;
      list.appendChild(catTitle);

      sec.items.forEach((item) => {
        const row = document.createElement('div');
        row.className = 'dropdown-item';
        row.dataset.id = item.id;
        row.dataset.name = item.name.toLowerCase();
        row.dataset.categoryKey = sec.categoryKey;
        row.innerHTML = `
          <div class="dropdown-item-left">
            <span class="dropdown-item-dot" style="background:${item.dot}; box-shadow:0 0 6px ${item.dot}"></span>
            <span class="dropdown-item-name">${item.name}</span>
          </div>
          <span class="dropdown-item-tag">${item.tag}</span>
        `;

        row.addEventListener('click', () => {
          menu.classList.remove('show');
          btn.classList.remove('active');
          this.focusOnObject(item.id);
        });

        list.appendChild(row);
      });
    });

    // Category Filter Tabs
    const filterTabs = document.querySelectorAll('.dropdown-filter-tabs .filter-tab');
    let activeFilter = 'all';

    const applyFilters = () => {
      const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
      if (clearBtn) clearBtn.style.display = query ? 'block' : 'none';

      const items = list.querySelectorAll('.dropdown-item');
      const catTitles = list.querySelectorAll('.dropdown-category-title');

      items.forEach((el) => {
        const matchesCategory = activeFilter === 'all' || el.dataset.categoryKey === activeFilter;
        const matchesSearch = !query || el.dataset.name.includes(query) || el.textContent.toLowerCase().includes(query);
        el.style.display = (matchesCategory && matchesSearch) ? 'flex' : 'none';
      });

      catTitles.forEach((cat) => {
        const matchesCategory = activeFilter === 'all' || cat.dataset.categoryKey === activeFilter;
        let hasVisibleSibling = false;
        let next = cat.nextElementSibling;
        while (next && !next.classList.contains('dropdown-category-title')) {
          if (next.style.display !== 'none') {
            hasVisibleSibling = true;
            break;
          }
          next = next.nextElementSibling;
        }
        cat.style.display = (matchesCategory && hasVisibleSibling) ? 'flex' : 'none';
      });
    };

    filterTabs.forEach((tab) => {
      tab.addEventListener('click', (e) => {
        e.stopPropagation();
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        activeFilter = tab.dataset.filter;
        applyFilters();
      });
    });

    // Real-Time Search Filter
    if (searchInput) {
      searchInput.addEventListener('input', () => applyFilters());
    }

    if (clearBtn && searchInput) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearBtn.style.display = 'none';
        applyFilters();
      });
    }
  }

  // ----------------------------------------------------------------------------
  // Interactive Time Warp Flight Deck
  // ----------------------------------------------------------------------------
  initTimeControls() {
    const slider = document.getElementById('time-warp-slider');
    const readout = document.getElementById('speed-rate-readout');
    const dirBadge = document.getElementById('time-direction-badge');
    const btnReverse = document.getElementById('btn-reverse');
    const btnPlayPause = document.getElementById('btn-play-pause');
    const btnStep = document.getElementById('btn-step');
    const presetPills = document.querySelectorAll('.preset-pill');

    const updateDisplay = () => {
      if (this.isPaused) {
        if (dirBadge) {
          dirBadge.textContent = 'PAUSED';
          dirBadge.className = 'time-direction-badge';
        }
        if (readout) readout.textContent = '0.0x • SIMULATION FROZEN';
        if (btnPlayPause) btnPlayPause.textContent = '▶ RESUME';
        return;
      }

      const isReverse = this.timeScale < 0;
      const absSpeed = Math.abs(this.timeScale);

      if (btnPlayPause) btnPlayPause.textContent = '⏸ PAUSE';

      if (dirBadge) {
        dirBadge.textContent = isReverse ? 'REVERSE ⏪' : 'FORWARD ⏩';
        dirBadge.className = `time-direction-badge ${isReverse ? 'reverse' : ''}`;
      }

      let speedDesc = 'REAL TIME';
      if (absSpeed > 5000) speedDesc = 'COSMIC WARP';
      else if (absSpeed > 500) speedDesc = 'MAX ACCELERATION';
      else if (absSpeed > 50) speedDesc = 'HIGH SPEED';
      else if (absSpeed > 5) speedDesc = 'FAST ACCELERATION';

      if (readout) {
        readout.textContent = `${isReverse ? '-' : '+'}${absSpeed.toLocaleString()}x • ${speedDesc}`;
      }

      // Sync preset pill active states
      presetPills.forEach((p) => {
        const val = parseFloat(p.dataset.speed);
        p.classList.toggle('active', Math.abs(val - absSpeed) < 0.1 && !isReverse);
      });
    };

    // Continuous Scrubber Slider
    if (slider) {
      slider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.isPaused = false;
        if (val === 0) {
          this.timeScale = 1.0;
        } else if (val > 0) {
          this.timeScale = Math.round(Math.pow(10, val) * 10) / 10;
        } else {
          this.timeScale = -Math.round(Math.pow(10, Math.abs(val)) * 10) / 10;
        }
        updateDisplay();
      });
    }

    // Reverse Button
    if (btnReverse) {
      btnReverse.addEventListener('click', () => {
        this.timeScale = -this.timeScale;
        if (slider) {
          const absSpeed = Math.abs(this.timeScale);
          const logVal = Math.log10(absSpeed);
          slider.value = this.timeScale < 0 ? -logVal : logVal;
        }
        updateDisplay();
      });
    }

    // Play/Pause Button
    if (btnPlayPause) {
      btnPlayPause.addEventListener('click', () => {
        this.isPaused = !this.isPaused;
        updateDisplay();
      });
    }

    // Step Forward +1 Day
    if (btnStep) {
      btnStep.addEventListener('click', () => {
        this.simulationDays += 1.0;
        btnStep.classList.add('active');
        setTimeout(() => btnStep.classList.remove('active'), 200);
      });
    }

    // Preset Speed Pills
    presetPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        const speed = parseFloat(pill.dataset.speed);
        this.isPaused = false;
        this.timeScale = speed;
        if (slider) {
          slider.value = Math.log10(speed);
        }
        updateDisplay();
      });
    });

    updateDisplay();
  }

  // ----------------------------------------------------------------------------
  // Visual Clarity Mode Toggle
  // ----------------------------------------------------------------------------
  initClarityControl() {
    const clarityBtn = document.getElementById('btn-clarity');
    const clarityStatus = document.getElementById('clarity-status');

    if (!clarityBtn) return;

    clarityBtn.addEventListener('click', () => {
      this.isCrispMode = !this.isCrispMode;
      clarityBtn.classList.toggle('active', this.isCrispMode);

      if (this.isCrispMode) {
        this.renderer.toneMappingExposure = 1.45;
        this.sunLight.intensity = 4.0;
        this.ambientLight.intensity = 1.05;
        if (clarityStatus) clarityStatus.textContent = 'HDR CRYSTAL';
      } else {
        this.renderer.toneMappingExposure = 1.15;
        this.sunLight.intensity = 3.2;
        this.ambientLight.intensity = 0.75;
        if (clarityStatus) clarityStatus.textContent = 'CRISP VIEW';
      }
    });
  }

  // ----------------------------------------------------------------------------
  // UI Events, Raycasting & Smooth Navigation
  // ----------------------------------------------------------------------------
  initUIEvents() {
    const raycaster = this.raycaster;
    const mouse = this.mouse;
    const reticle = document.getElementById('target-reticle');
    const reticleLabel = document.getElementById('reticle-label');

    window.addEventListener('pointermove', (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, this.camera);
      const intersects = raycaster.intersectObjects(this.interactiveObjects, false);

      if (intersects.length > 0) {
        const data = intersects[0].object.userData;
        if (data && (data.name || data.id)) {
          reticle.style.display = 'block';
          reticle.style.left = `${e.clientX}px`;
          reticle.style.top = `${e.clientY}px`;
          reticleLabel.textContent = (data.name || data.id).toUpperCase();
          document.body.style.cursor = 'pointer';
        }
      } else {
        reticle.style.display = 'none';
        document.body.style.cursor = 'default';
      }
    });

    window.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.hud-header, .telemetry-card, .hud-footer, .scale-banner, .copyright-tag')) return;

      raycaster.setFromCamera(mouse, this.camera);
      const intersects = raycaster.intersectObjects(this.interactiveObjects, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        this.focusOnObject(hit.userData.id || hit.userData.name);
      }
    });

    // Navigation Quick Pills
    document.querySelectorAll('.nav-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const target = btn.dataset.target;
        if (target === 'galaxy') {
          this.zoomToGalaxy();
        } else {
          this.focusOnObject(target);
        }
      });
    });

    // Scale Action Button
    document.getElementById('btn-scale-action')?.addEventListener('click', () => {
      if (this.currentScaleLevel === 'GALAXY' || this.currentScaleLevel === 'INTERSTELLAR') {
        this.diveIntoSolarSystem();
      } else {
        this.zoomToGalaxy();
      }
    });

    document.getElementById('btn-focus-target')?.addEventListener('click', () => this.zoomCloserToTarget());
    document.getElementById('btn-reset-view')?.addEventListener('click', () => this.diveIntoSolarSystem());
    document.getElementById('close-card-btn')?.addEventListener('click', () => {
      document.getElementById('telemetry-card').classList.add('collapsed');
    });

    // Telemetry Tabs Switching (Overview, Astrophysics, Exploration)
    document.querySelectorAll('.tel-tab-btn').forEach((tabBtn) => {
      tabBtn.addEventListener('click', () => {
        const targetTab = tabBtn.dataset.tab;
        document.querySelectorAll('.tel-tab-btn').forEach(b => b.classList.remove('active'));
        tabBtn.classList.add('active');
        document.querySelectorAll('.tel-tab-pane').forEach((pane) => {
          pane.classList.toggle('active', pane.id === targetTab);
        });
      });
    });

    // Radar Layer Toggles
    document.getElementById('toggle-galaxy')?.addEventListener('change', (e) => {
      if (this.galaxiesGroup) this.galaxiesGroup.visible = e.target.checked;
    });
    document.getElementById('toggle-orbits')?.addEventListener('change', (e) => {
      this.orbitLines.forEach(l => (l.visible = e.target.checked));
    });
    document.getElementById('toggle-satellites')?.addEventListener('change', (e) => {
      this.satellites.forEach(s => (s.visible = e.target.checked));
      if (this.starlinkMesh) this.starlinkMesh.visible = e.target.checked;
      if (this.geoRing) this.geoRing.visible = e.target.checked;
      if (this.gpsRing) this.gpsRing.visible = e.target.checked;
      if (this.issOrbitTrail) this.issOrbitTrail.visible = e.target.checked;
      if (this.tiangongOrbitTrail) this.tiangongOrbitTrail.visible = e.target.checked;
    });
    document.getElementById('toggle-moons')?.addEventListener('change', (e) => {
      this.moons.forEach(m => (m.mesh.visible = e.target.checked));
    });

    // Cinematic Auto Tour
    const tourBtn = document.getElementById('btn-cinematic');
    tourBtn?.addEventListener('click', () => {
      this.isAutoTourActive = !this.isAutoTourActive;
      tourBtn.classList.toggle('active', this.isAutoTourActive);
      if (this.isAutoTourActive) {
        this.autoTourTimer = 0;
        this.cycleAutoTour();
      }
    });
  }

  // ----------------------------------------------------------------------------
  // Camera Navigation & Zoom Transitions
  // ----------------------------------------------------------------------------
  zoomToGalaxy() {
    this.focusedObject = null;
    this.isTransitioningCamera = true;
    this.targetCameraPosition.copy(INITIAL_COSMIC_POS);
    this.targetLookAt.set(0, 0, 0);

    document.querySelectorAll('.nav-pill').forEach(b => b.classList.remove('active'));
    document.getElementById('nav-galaxy')?.classList.add('active');

    const card = document.getElementById('telemetry-card');
    if (card) card.classList.add('collapsed');
  }

  diveIntoSolarSystem() {
    this.focusedObject = null;
    this.isTransitioningCamera = true;
    this.targetCameraPosition.copy(SOLAR_SYSTEM_OVERVIEW_POS);
    this.targetLookAt.set(0, 0, 0);

    document.querySelectorAll('.nav-pill').forEach(b => b.classList.remove('active'));
    document.getElementById('nav-sun')?.classList.add('active');

    this.focusOnObject('sun');
  }

  focusOnObject(targetId) {
    if (!targetId) return;
    const id = targetId.toLowerCase();

    // Check if targeting a Galaxy
    if (this.galaxies.has(id)) {
      const gObj = this.galaxies.get(id);
      this.focusedObject = gObj.hitbox;
      this.isTransitioningCamera = true;

      const card = document.getElementById('telemetry-card');
      if (card) card.classList.remove('collapsed');
      this.updateHUDWithObjectData(gObj.hitbox.userData);
      return;
    }

    let targetMesh = null;
    if (id === 'sun') targetMesh = this.sunMesh;
    else if (this.planets.has(id)) targetMesh = this.planets.get(id);
    else if (id === 'iss') targetMesh = this.issGroup;
    else if (id === 'tiangong') targetMesh = this.tiangongGroup;
    else if (id === 'jwst') targetMesh = this.jwstGroup;
    else if (id === 'hubble') targetMesh = this.hstGroup;
    else if (id === 'voyager-1' || id === 'voyager1') targetMesh = this.voyager1Group;
    else if (id === 'voyager-2' || id === 'voyager2') targetMesh = this.voyager2Group;
    else if (id === 'parker-solar-probe' || id === 'parker') targetMesh = this.parkerGroup;
    else if (id === 'starlink' || id === 'gps' || id === 'geostationary') targetMesh = this.earthMesh;
    else {
      const moonMatch = this.moons.find(m => m.mesh.userData.id === id);
      if (moonMatch) targetMesh = moonMatch.mesh;
    }

    if (!targetMesh) return;

    this.focusedObject = targetMesh;
    this.isTransitioningCamera = true;

    const card = document.getElementById('telemetry-card');
    if (card) card.classList.remove('collapsed');
    this.updateHUDWithObjectData(targetMesh.userData);
  }

  zoomCloserToTarget() {
    if (!this.focusedObject) return;
    const targetPos = new THREE.Vector3();
    this.focusedObject.getWorldPosition(targetPos);
    const radius = this.focusedObject.userData.radius || 2.0;

    this.camera.position.set(
      targetPos.x + radius * 2.4,
      targetPos.y + radius * 1.1,
      targetPos.z + radius * 2.6
    );
    this.controls.target.copy(targetPos);
  }

  cycleAutoTour() {
    const tourTargets = [
      'milkyway', 'andromeda', 'whirlpool', 'sun', 'earth', 'iss', 'tiangong',
      'jwst', 'mars', 'jupiter', 'saturn', 'voyager-1', 'parker-solar-probe'
    ];
    const nextTarget = tourTargets[this.autoTourIndex % tourTargets.length];
    this.autoTourIndex++;
    this.focusOnObject(nextTarget);
  }

  // ----------------------------------------------------------------------------
  // Backend Telemetry & Sub-Satellite Real-Time Calculations
  // ----------------------------------------------------------------------------
  async fetchBackendTelemetry() {
    const statusDot = document.getElementById('backend-status-dot');
    const statusText = document.getElementById('backend-status-text');

    try {
      const response = await fetch('/api/health');
      if (response.ok) {
        if (statusDot) statusDot.style.background = '#06d6a0';
        if (statusText) statusText.textContent = 'EPHEMERIS ONLINE';

        const planetRes = await fetch('/api/planets');
        if (planetRes.ok) {
          const planetData = await planetRes.json();
          this.backendPlanetData = planetData.planets;
        }

        const satRes = await fetch('/api/satellites');
        if (satRes.ok) {
          const satData = await satRes.json();
          this.backendSatellites = satData.satellites;
        }

        const galRes = await fetch('/api/galaxies');
        if (galRes.ok) {
          const galData = await galRes.json();
          this.backendGalaxies = galData.galaxies;
        }
      }
    } catch {
      if (statusDot) statusDot.style.background = '#ffb703';
      if (statusText) statusText.textContent = 'STANDALONE ORBITS';
    }
  }

  updateHUDWithObjectData(data) {
    if (!data) return;
    const nameEl = document.getElementById('target-name');
    const subEl = document.getElementById('target-subtitle');
    const catEl = document.getElementById('target-category');

    // Tab 1: Overview
    const radEl = document.getElementById('tel-radius');
    const tempEl = document.getElementById('tel-temp');
    const distEl = document.getElementById('tel-distance');
    const speedEl = document.getElementById('tel-speed');
    const massEl = document.getElementById('tel-mass');
    const rotEl = document.getElementById('tel-rotation');
    const compEl = document.getElementById('tel-composition');
    const factsEl = document.getElementById('tel-facts');
    const coordsEl = document.getElementById('tel-coords');
    const altEl = document.getElementById('tel-altitude');
    const periodEl = document.getElementById('tel-period');
    const moonsVal = document.getElementById('tel-moons');
    const moonsRow = document.getElementById('tel-moons-row');

    // Tab 2: Astrophysics & Interior
    const gravEl = document.getElementById('tel-gravity');
    const escEl = document.getElementById('tel-escape');
    const pressEl = document.getElementById('tel-pressure');
    const tiltEl = document.getElementById('tel-tilt');
    const structEl = document.getElementById('tel-structure');
    const magEl = document.getElementById('tel-magnetic');
    const compTagsEl = document.getElementById('tel-comp-tags');

    // Tab 3: Exploration & Science
    const missEl = document.getElementById('tel-missions');
    const discEl = document.getElementById('tel-discovery');
    const locEl = document.getElementById('tel-location');
    const deepFactsEl = document.getElementById('tel-deep-facts');
    const relLinksEl = document.getElementById('tel-related-links');

    const id = (data.id || (data.name ? data.name.toLowerCase() : '')).toLowerCase();

    // Helper: Render Composition Tag Badges
    const renderCompBadges = (compString, fallbackTags = []) => {
      if (!compTagsEl) return;
      compTagsEl.innerHTML = '';
      let tags = [];
      if (compString && compString !== '—') {
        tags = compString.split(/[,;•|]/).map(s => s.trim()).filter(s => s.length > 0 && s.length < 50);
      }
      if (tags.length === 0) tags = fallbackTags;
      tags.slice(0, 8).forEach(tag => {
        const span = document.createElement('span');
        span.className = 'comp-tag';
        span.textContent = tag;
        compTagsEl.appendChild(span);
      });
    };

    // Helper: Render Related Links / Jump Buttons
    const renderJumpButtons = (relatedArray = []) => {
      if (!relLinksEl) return;
      relLinksEl.innerHTML = '';
      if (!relatedArray || relatedArray.length === 0) {
        relLinksEl.innerHTML = '<span style="color:#64748b; font-size:0.75rem;">No immediate bound satellites</span>';
        return;
      }
      relatedArray.forEach(item => {
        const targetId = typeof item === 'string' ? item : item.id;
        const targetLabel = typeof item === 'string' ? item.toUpperCase() : item.label;
        const btn = document.createElement('button');
        btn.className = 'rel-link-btn';
        btn.textContent = `${targetLabel} →`;
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.focusOnObject(targetId);
        });
        relLinksEl.appendChild(btn);
      });
    };

    // 1. CHECK IF GALAXY
    const galaxyData = (Array.isArray(this.backendGalaxies) ? this.backendGalaxies.find(g => g.id === id) : this.backendGalaxies?.[id]) || GALAXY_METADATA_FALLBACK[id];
    if (galaxyData) {
      if (nameEl) nameEl.textContent = galaxyData.name;
      if (subEl) subEl.textContent = galaxyData.type;
      if (catEl) catEl.textContent = 'COSMIC REALM / GALAXY';

      // Tab 1
      if (radEl) radEl.textContent = galaxyData.diameter_ly;
      if (tempEl) tempEl.textContent = '2.725 K (Cosmic Microwave Background)';
      if (distEl) distEl.textContent = galaxyData.distance_ly;
      if (speedEl) speedEl.textContent = '~220 km/s (Galactic Virial Orbit)';
      if (massEl) massEl.textContent = galaxyData.mass_solar;
      if (rotEl) rotEl.textContent = galaxyData.rotation_period_years;
      if (moonsRow) moonsRow.style.display = 'none';
      if (compEl) compEl.textContent = galaxyData.composition;
      if (factsEl) factsEl.textContent = galaxyData.facts;
      if (coordsEl) coordsEl.textContent = `Supermassive Core: ${galaxyData.central_black_hole}`;
      if (altEl) altEl.textContent = `Total Stars: ${galaxyData.stars_count}`;
      if (periodEl) periodEl.textContent = `Redshift: z = ${galaxyData.redshift || '0.00'}`;

      // Tab 2
      if (gravEl) gravEl.textContent = galaxyData.mass_solar;
      if (escEl) escEl.textContent = '~550 - 620 km/s (Halo Escape Velocity)';
      if (pressEl) pressEl.textContent = '10^-19 bar (Intergalactic Ultra-High Vacuum)';
      if (tiltEl) tiltEl.textContent = galaxyData.morphology || galaxyData.type;
      if (structEl) structEl.textContent = `Supermassive Black Hole (${galaxyData.central_black_hole}) → Dense Nuclear Star Cluster → Bulge → Stellar Disk & Spiral Arms → Cold Dark Matter Halo`;
      if (magEl) magEl.textContent = 'Large-scale micro-Gauss galactic magnetic fields driven by differential interstellar dynamo.';
      renderCompBadges(galaxyData.composition, ['Population I & II Stars', 'Interstellar Hydrogen', 'Molecular Clouds', 'Cosmic Dust Silicates', 'Cold Dark Matter Halo']);

      // Tab 3
      if (missEl) missEl.textContent = 'Hubble Space Telescope (Deep Field), JWST NIRCam/MIRI, Gaia Astrometry, Chandra X-ray Observatory, ALMA Millimeter Array, VLA.';
      if (discEl) discEl.textContent = `${galaxyData.location} • Catalog Designation`;
      if (locEl) locEl.textContent = 'Local Supercluster Complex • Laniakea Filament';
      if (deepFactsEl) deepFactsEl.textContent = `${galaxyData.facts} Estimated stellar population: ${galaxyData.stars_count}.`;

      // Related jump targets
      const neighborGalaxies = [
        { id: 'milkyway', label: 'Milky Way' },
        { id: 'andromeda', label: 'Andromeda' },
        { id: 'triangulum', label: 'Triangulum' },
        { id: 'sombrero', label: 'Sombrero' },
        { id: 'whirlpool', label: 'Whirlpool' },
        { id: 'pinwheel', label: 'Pinwheel' },
        { id: 'cartwheel', label: 'Cartwheel' },
        { id: 'cigar', label: 'Cigar' },
        { id: 'centaurus_a', label: 'Centaurus A' }
      ].filter(g => g.id !== id).slice(0, 4);
      renderJumpButtons(neighborGalaxies);
      return;
    }

    // 2. CHECK IF SUN OR PLANET
    const ephem = this.backendPlanetData?.find(p => p.id === id);

    if (ephem) {
      if (nameEl) nameEl.textContent = ephem.name;
      if (subEl) subEl.textContent = ephem.type;
      if (catEl) catEl.textContent = id === 'sun' ? 'STELLAR ANCHOR / G2V' : (ephem.type.toUpperCase().includes('GIANT') ? 'JOVIAN PLANET' : 'TERRESTRIAL PLANET');

      // Tab 1: Overview
      if (radEl) radEl.textContent = `${ephem.radius_km.toLocaleString()} km`;
      if (tempEl) tempEl.textContent = ephem.surface_temp || '—';
      if (distEl) distEl.textContent = `${ephem.a_au ?? ephem.distance_from_sun_au ?? 0} AU`;
      if (speedEl) speedEl.textContent = `${ephem.orbital_speed_kms || 0} km/s`;
      if (massEl) massEl.textContent = ephem.mass_kg || '—';
      if (rotEl) {
        if (typeof ephem.rotation_period_days === 'number') {
          rotEl.textContent = `${(Math.abs(ephem.rotation_period_days) * 24).toFixed(1)} Hours (${ephem.rotation_period_days} d)`;
        } else {
          rotEl.textContent = ephem.rotation_period_days || '—';
        }
      }
      if (moonsRow) {
        moonsRow.style.display = 'flex';
        if (moonsVal) moonsVal.textContent = String(ephem.moons_count ?? '0');
      }
      if (compEl) compEl.textContent = ephem.composition || '—';
      if (factsEl) factsEl.textContent = ephem.facts || '—';
      if (coordsEl) coordsEl.textContent = id === 'sun' ? 'Solar Barycenter: (0.00, 0.00, 0.00)' : `Heliocentric X: ${ephem.position?.x_au ?? 0} AU | Z: ${ephem.position?.z_au ?? 0} AU`;
      if (altEl) altEl.textContent = id === 'sun' ? 'Solar Equator Datum' : 'Ecliptic Orbital Plane';
      if (periodEl) periodEl.textContent = typeof ephem.orbital_period_days === 'number' ? `${ephem.orbital_period_days.toLocaleString()} Earth Days` : ephem.orbital_period_days;

      // Tab 2: Astrophysics & Interior
      if (gravEl) gravEl.textContent = `${ephem.surface_gravity_ms2 ?? '—'} m/s² (${ephem.earth_g_ratio ?? '—'})`;
      if (escEl) escEl.textContent = `${ephem.escape_velocity_kms ?? '—'} km/s`;
      if (pressEl) pressEl.textContent = ephem.atmosphere_pressure || '—';
      if (tiltEl) tiltEl.textContent = ephem.axial_tilt || '—';
      if (structEl) structEl.textContent = ephem.internal_structure || '—';
      if (magEl) magEl.textContent = ephem.magnetic_field || '—';
      renderCompBadges(ephem.composition, ['Silicate Rock', 'Metallic Iron', 'Hydrogen', 'Helium']);

      // Tab 3: Exploration & Science
      if (missEl) missEl.textContent = ephem.discovery_and_missions || 'Historic scientific observation.';
      if (discEl) {
        const ancient = ['sun', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn'];
        discEl.textContent = ancient.includes(id) ? 'Known since Antiquity (Prehistoric / Naked Eye)' : (ephem.discovery_and_missions ? ephem.discovery_and_missions.split('.')[0] : 'Planetary Discovery');
      }
      if (locEl) locEl.textContent = id === 'sun' ? 'Center of Solar System • Orion Spur' : `${ephem.a_au ?? 1.0} AU Heliocentric Distance • Solar System`;
      if (deepFactsEl) deepFactsEl.textContent = ephem.facts || 'Major astronomical body in the Solar System.';

      // Related jump links
      let relatedBodies = [];
      if (id === 'earth') relatedBodies = [{ id: 'moon', label: 'The Moon' }, { id: 'iss', label: 'ISS Space Station' }, { id: 'tiangong', label: 'Tiangong CSS' }, { id: 'jwst', label: 'JWST' }];
      else if (id === 'sun') relatedBodies = [{ id: 'parker-solar-probe', label: 'Parker Solar Probe' }, { id: 'mercury', label: 'Mercury' }, { id: 'earth', label: 'Earth' }, { id: 'voyager-1', label: 'Voyager 1' }];
      else if (id === 'mars') relatedBodies = [{ id: 'phobos', label: 'Phobos' }, { id: 'deimos', label: 'Deimos' }, { id: 'earth', label: 'Earth' }];
      else if (id === 'jupiter') relatedBodies = [{ id: 'io', label: 'Io' }, { id: 'europa', label: 'Europa' }, { id: 'ganymede', label: 'Ganymede' }, { id: 'callisto', label: 'Callisto' }];
      else if (id === 'saturn') relatedBodies = [{ id: 'titan', label: 'Titan' }, { id: 'enceladus', label: 'Enceladus' }, { id: 'jupiter', label: 'Jupiter' }];
      else if (id === 'neptune') relatedBodies = [{ id: 'triton', label: 'Triton' }, { id: 'uranus', label: 'Uranus' }, { id: 'voyager-2', label: 'Voyager 2' }];
      else if (id === 'uranus') relatedBodies = [{ id: 'neptune', label: 'Neptune' }, { id: 'voyager-2', label: 'Voyager 2' }];
      else if (id === 'mercury') relatedBodies = [{ id: 'sun', label: 'Sun' }, { id: 'venus', label: 'Venus' }];
      else if (id === 'venus') relatedBodies = [{ id: 'mercury', label: 'Mercury' }, { id: 'earth', label: 'Earth' }];
      renderJumpButtons(relatedBodies);
      return;
    }

    // 3. MOONS & ARTIFICIAL SPACECRAFT
    const satEphem = this.backendSatellites?.find(s => s.id === id);
    const sat = satEphem || data;

    // Rich built-in encyclopedic registry for all Moons & Spacecraft
    const CELESTIAL_EXTRA = {
      moon: {
        name: 'The Moon (Luna)',
        type: 'Terrestrial Natural Satellite',
        cat: 'NATURAL SATELLITE',
        radius: '1,737.4 km',
        temp: '-130 °C to +120 °C',
        dist: '0.00257 AU (384,400 km from Earth)',
        speed: '1.022 km/s (Lunar Orbit)',
        mass: '7.342 × 10^22 kg (0.0123 Earths)',
        rot: '27.3 Earth Days (Tidally Locked Synchronous)',
        moons: '0 (Orbits Earth)',
        comp: '43% Oxygen, 20% Silicon, 19% Magnesium, 10% Iron, 3% Calcium, 3% Aluminum, Titanium',
        facts: 'The only celestial body beyond Earth where humans have walked. Formed 4.5 billion years ago after a Mars-sized planet (Theia) collided with proto-Earth.',
        grav: '1.62 m/s² (0.166 g - 1/6th Earth)',
        esc: '2.38 km/s',
        press: '3 × 10^-15 bar (Surface Boundary Exosphere)',
        tilt: '1.54° to ecliptic',
        struct: 'Small Metallic Core (~330 km radius) → Partial Melt Boundary → Mantle → Anorthositic Basaltic Regolith Crust',
        mag: 'Negligible global dipole; localized crustal magnetic anomalies (remanent paleomagnetism).',
        missions: 'Apollo 11–17 (12 moonwalkers), Soviet Luna series, Surveyor, Chang\'e 1–6 (far-side return), NASA Artemis program.',
        disc: 'Known since prehistoric antiquity • First visited in situ by Luna 2 (1959) & Apollo 11 (1969).',
        loc: 'Earth Orbit • Cis-Lunar Space • Inner Solar System',
        deepFacts: 'Tidal forces between Earth and Moon slow Earth\'s rotation by ~1.7 milliseconds per century and push the Moon 3.8 cm further away each year.',
        related: [{ id: 'earth', label: 'Earth' }, { id: 'iss', label: 'ISS' }, { id: 'tiangong', label: 'Tiangong' }]
      },
      phobos: {
        name: 'Phobos',
        type: 'Martian Inner Satellite (Captured Chondrite)',
        cat: 'NATURAL SATELLITE',
        radius: '11.26 km (Irregular 27×22×18 km)',
        temp: '-40 °C to -112 °C',
        dist: '1.52 AU (6,000 km above Mars surface)',
        speed: '2.138 km/s',
        mass: '1.065 × 10^16 kg',
        rot: '7.66 Hours (Tidally Locked to Mars)',
        moons: '0',
        comp: 'Carbonaceous chondrite silicates, carbon compounds, water ice voids',
        facts: 'Orbits Mars faster than Mars rotates. In 30–50 million years, tidal forces will tear Phobos apart into a Martian ring or crash it into the planet.',
        grav: '0.0057 m/s² (0.00058 g)',
        esc: '11.4 m/s (41 km/h - achievable on a bicycle)',
        press: '0.0 bar (Pure Vacuum)',
        tilt: '1.09° to Mars equator',
        struct: 'Porous rubble pile structure (void fraction ~30%) dominated by the colossal 9-km Stickney impact crater.',
        mag: 'None (No active or remanent field).',
        missions: 'Mariner 9, Viking 1 & 2, Phobos 2, Mars Express, Mars Reconnaissance Orbiter, upcoming JAXA MMX (sample return).',
        disc: 'Discovered by Asaph Hall on August 18, 1877 at US Naval Observatory.',
        loc: 'Mars Inner Orbit (Closest moon to any planet in the Solar System)',
        deepFacts: 'Phobos orbits inside Mars\' synchronous orbit radius; from the surface of Mars, it rises in the west and sets in the east twice every Martian day.',
        related: [{ id: 'mars', label: 'Mars' }, { id: 'deimos', label: 'Deimos' }]
      },
      deimos: {
        name: 'Deimos',
        type: 'Martian Outer Satellite',
        cat: 'NATURAL SATELLITE',
        radius: '6.2 km (Smooth regolith blanket)',
        temp: '-40 °C to -115 °C',
        dist: '1.52 AU (23,460 km from Mars center)',
        speed: '1.351 km/s',
        mass: '1.476 × 10^15 kg',
        rot: '30.35 Hours (Tidally Locked)',
        moons: '0',
        comp: 'Type C/D carbonaceous chondrite, silicates, organic-rich carbonaceous mantle',
        facts: 'Has an escape velocity of only 5.6 m/s (20 km/h). An astronaut jumping forcefully could easily achieve orbital escape velocity.',
        grav: '0.003 m/s² (0.0003 g)',
        esc: '5.6 m/s',
        press: '0.0 bar (Vacuum)',
        tilt: '0.93° to Mars equator',
        struct: 'Cratered chondritic core blanketed by a thick, 100-meter-deep pulverised regolith layer smoothing out surface relief.',
        mag: 'None.',
        missions: 'Viking 2, Mars Global Surveyor, Hope Mars Probe (UAE ultra-close flybys in 2023).',
        disc: 'Discovered by Asaph Hall on August 12, 1877.',
        loc: 'Mars Outer Orbit',
        deepFacts: 'From Mars, Deimos appears like a bright star or planet rather than a resolved disk, taking 2.7 days from rising in the east to setting in the west.',
        related: [{ id: 'mars', label: 'Mars' }, { id: 'phobos', label: 'Phobos' }]
      },
      io: {
        name: 'Io',
        type: 'Galilean Satellite (Volcanic Super-Engine)',
        cat: 'NATURAL SATELLITE',
        radius: '1,821.6 km',
        temp: '-130 °C (ambient) / 1,200 °C (Lava Lakes)',
        dist: '5.20 AU (421,700 km from Jupiter)',
        speed: '17.33 km/s',
        mass: '8.932 × 10^22 kg (1.21 Moons)',
        rot: '42.5 Hours (1.77 d Synchronous)',
        moons: '0',
        comp: 'Sulfur, Sulfur Dioxide frost, Ultramafic Silicate Magma, Iron-Nickel Core',
        facts: 'The most geologically and volcanically active body in the Solar System, boasting over 400 erupting volcanoes that shoot sulfur plumes 500 km high.',
        grav: '1.796 m/s² (0.183 g)',
        esc: '2.56 km/s',
        press: '10^-10 bar (Sulfur Dioxide exosphere)',
        tilt: '0.05°',
        struct: 'Iron-Nickel Metallic Core → Molten Silicate Magma Ocean Mantle → Thick sulfur-rich crust with actively recycling calderas.',
        mag: 'Generates a 1-million-amp electric current flux tube connecting directly into Jupiter\'s auroral ionosphere.',
        missions: 'Pioneer 10 & 11, Voyager 1 & 2, Galileo Orbiter, New Horizons, NASA Juno (polar perijoves).',
        disc: 'Discovered by Galileo Galilei on January 8, 1610 with his handmade telescope.',
        loc: 'Inner Jovian System • Orbiting inside Jupiter\'s lethal radiation belt',
        deepFacts: 'Tidal flexing from orbital resonance with Europa (2:1) and Ganymede (4:1) generates immense continuous frictional heating within Io\'s interior.',
        related: [{ id: 'jupiter', label: 'Jupiter' }, { id: 'europa', label: 'Europa' }, { id: 'ganymede', label: 'Ganymede' }, { id: 'callisto', label: 'Callisto' }]
      },
      europa: {
        name: 'Europa',
        type: 'Galilean Satellite (Global Subsurface Ocean World)',
        cat: 'NATURAL SATELLITE',
        radius: '1,560.8 km',
        temp: '-160 °C (Equator) to -220 °C (Poles)',
        dist: '5.20 AU (670,900 km from Jupiter)',
        speed: '13.74 km/s',
        mass: '4.800 × 10^22 kg',
        rot: '85.2 Hours (3.55 d Synchronous)',
        moons: '0',
        comp: 'Water Ice Shell (H2O), Saline Liquid Ocean (MgSO4/NaCl), Silicate Rock, Iron Core',
        facts: 'Harbors a subsurface saltwater ocean 100 km deep containing twice as much liquid water as all Earth\'s oceans combined. Prime search target for life.',
        grav: '1.315 m/s² (0.134 g)',
        esc: '2.025 km/s',
        press: '0.1 µPa (Tenuous Oxygen Exosphere produced by radiolysis)',
        tilt: '0.1°',
        struct: 'Metallic Iron Core → Silicate Mantle → 100-km Deep Liquid Saline Ocean → 15–25 km Floating Ice Lithosphere Crust.',
        mag: 'Induced dipolar magnetic field created by electrical currents in its conductive saline ocean passing through Jupiter\'s magnetosphere.',
        missions: 'Voyager 1 & 2, Galileo, NASA Europa Clipper (launched Oct 2024 with ice-penetrating radar), ESA JUICE.',
        disc: 'Discovered by Galileo Galilei on January 8, 1610.',
        loc: 'Galilean Jovian Orbit',
        deepFacts: 'Its smooth, bright icy surface is crisscrossed by dark reddish fractures called lineae, caused by tidal flexing cracking the floating crust.',
        related: [{ id: 'jupiter', label: 'Jupiter' }, { id: 'io', label: 'Io' }, { id: 'ganymede', label: 'Ganymede' }, { id: 'callisto', label: 'Callisto' }]
      },
      ganymede: {
        name: 'Ganymede',
        type: 'Galilean Satellite (Largest Moon in the Solar System)',
        cat: 'NATURAL SATELLITE',
        radius: '2,634.1 km (Larger than Mercury & Pluto)',
        temp: '-113 °C to -183 °C',
        dist: '5.20 AU (1,070,400 km from Jupiter)',
        speed: '10.88 km/s',
        mass: '1.482 × 10^23 kg (2.02 Moons)',
        rot: '171.7 Hours (7.15 d Synchronous)',
        moons: '0',
        comp: 'Silicate rock, Compressed High-Pressure Ice polymorphs, Liquid Saltwater, Atomic Oxygen',
        facts: 'The only moon in the Solar System known to possess its own self-generated magnetic dynamo, complete with auroral ribbons encircling its poles.',
        grav: '1.428 m/s² (0.146 g)',
        esc: '2.741 km/s',
        press: '0.2–1.2 µPa (Atomic Oxygen atmosphere)',
        tilt: '0.2°',
        struct: 'Molten Iron-Sulfur Core → Silicate Rock Mantle → High-Pressure Ice Mantle → Deep Ocean → Brittle Ice Crust.',
        mag: 'Permanent Intrinsic Dipole Field (719 nT at equator) generated by liquid iron convection.',
        missions: 'Pioneer 10 & 11, Voyager 1 & 2, Galileo, Juno, ESA JUICE (dedicated orbiter entering Ganymede orbit in 2034).',
        disc: 'Discovered by Galileo Galilei on January 7, 1610.',
        loc: 'Jovian Orbit',
        deepFacts: 'Ganymede has a diameter of 5,268 km. If it orbited the Sun independently instead of Jupiter, it would be classified as a major terrestrial planet.',
        related: [{ id: 'jupiter', label: 'Jupiter' }, { id: 'io', label: 'Io' }, { id: 'europa', label: 'Europa' }, { id: 'callisto', label: 'Callisto' }]
      },
      callisto: {
        name: 'Callisto',
        type: 'Galilean Satellite (Ancient Primordial World)',
        cat: 'NATURAL SATELLITE',
        radius: '2,410.3 km (99% the size of Mercury)',
        temp: '-108 °C to -193 °C',
        dist: '5.20 AU (1,882,700 km from Jupiter)',
        speed: '8.20 km/s',
        mass: '1.076 × 10^23 kg',
        rot: '400.5 Hours (16.69 d Synchronous)',
        moons: '0',
        comp: 'Equal parts Water Ice and Silicate Rock/Organics, Carbon Dioxide, Iron Sulfides',
        facts: 'The most heavily cratered object in the Solar System. Its surface is essentially frozen in time, having seen virtually no geologic activity for 4 billion years.',
        grav: '1.235 m/s² (0.126 g)',
        esc: '2.44 km/s',
        press: '7.5 × 10^-12 bar (CO2 Exosphere)',
        tilt: '0.28°',
        struct: 'Partially differentiated body: compressed ice-rock interior transitioning to an ice-rich shell and possible deep salty ocean layer.',
        mag: 'Weak induced magnetic field from Jupiter\'s magnetosphere.',
        missions: 'Voyager 1 & 2, Galileo, Cassini flyby, New Horizons, ESA JUICE.',
        disc: 'Discovered by Galileo Galilei on January 7, 1610.',
        loc: 'Outer Galilean Orbit • Outside Jupiter\'s main radiation belt',
        deepFacts: 'Because it lies outside Jupiter\'s radiation belt, Callisto is widely considered the safest location for a future human crewed base in the Jovian system.',
        related: [{ id: 'jupiter', label: 'Jupiter' }, { id: 'io', label: 'Io' }, { id: 'europa', label: 'Europa' }, { id: 'ganymede', label: 'Ganymede' }]
      },
      titan: {
        name: 'Titan',
        type: 'Saturnian Moon (Dense Nitrogen Atmosphere & Hydrocarbon Seas)',
        cat: 'NATURAL SATELLITE',
        radius: '2,574.7 km (Second largest moon in Solar System)',
        temp: '-179.2 °C (-290 °F)',
        dist: '9.54 AU (1,221,870 km from Saturn)',
        speed: '5.57 km/s',
        mass: '1.345 × 10^23 kg (1.82 Moons)',
        rot: '382.7 Hours (15.95 d Synchronous)',
        moons: '0',
        comp: '94.2% Nitrogen, 5.6% Methane, 0.2% Hydrogen, Liquid Methane/Ethane Lakes, Water Ice Bedrock',
        facts: 'The only moon with a thick, dense atmosphere (1.5x Earth\'s pressure) and the only extraterrestrial body with liquid lakes, rivers, and raining hydrocarbon weather.',
        grav: '1.352 m/s² (0.138 g)',
        esc: '2.64 km/s',
        press: '1.45 bars (145 kPa - 50% higher than Earth sea level)',
        tilt: '0.3° to Saturn equator',
        struct: 'Hydrated Silicate Core → High-pressure Ice Mantle → Subsurface Saline Water Ocean → Ice-I Crust covered in organic sand dunes & liquid methane seas.',
        mag: 'No intrinsic dynamo; periodically passes inside and outside Saturn\'s magnetosphere.',
        missions: 'Pioneer 11, Voyager 1 & 2, Cassini-Huygens (ESA Huygens landed on Titan surface Jan 14, 2005), NASA Dragonfly rotorcraft (launch 2028).',
        disc: 'Discovered by Dutch astronomer Christiaan Huygens on March 25, 1655.',
        loc: 'Saturn Orbit • Jewel of the Outer Solar System',
        deepFacts: 'On Titan\'s surface, gravity is so low (0.14g) and atmospheric air is so dense that a human with artificial wings strapped to their arms could easily take off and fly.',
        related: [{ id: 'saturn', label: 'Saturn' }, { id: 'enceladus', label: 'Enceladus' }]
      },
      enceladus: {
        name: 'Enceladus',
        type: 'Saturnian Moon (Cryovolcanic Geyser Ocean World)',
        cat: 'NATURAL SATELLITE',
        radius: '252.1 km (Pure reflective ice world)',
        temp: '-198 °C (Surface) / +90 °C (Hydrothermal Vents)',
        dist: '9.54 AU (238,000 km from Saturn)',
        speed: '12.63 km/s',
        mass: '1.080 × 10^20 kg',
        rot: '32.9 Hours (1.37 d Synchronous)',
        moons: '0',
        comp: '99% Reflective Pure Water Ice, Liquid H2O, Methane, Ammonia, Carbon Dioxide, Macromolecular Organics',
        facts: 'Spews supersonic cryovolcanic plumes of warm saltwater vapor, silica nanoparticles, and complex organic molecules from south-pole "tiger stripe" fractures.',
        grav: '0.113 m/s² (0.011 g)',
        esc: '0.24 km/s (860 km/h)',
        press: 'Ultra-tenuous water vapor plumes',
        tilt: '0.0°',
        struct: 'Porous Silicate Core (heated by tidal friction) → Global Hydrothermal Liquid Water Ocean → Pure Water Ice Lithosphere.',
        mag: 'Ionizes erupted vapor into Saturn\'s magnetosphere, creating a vast torus of neutral OH molecules.',
        missions: 'Voyager 1 & 2, Cassini (executed historic close dives directly through the erupting geyser plumes sampling chemical organics).',
        disc: 'Discovered by William Herschel on August 28, 1789.',
        loc: 'Saturn E-Ring Orbit (Enceladus\' plumes continuously feed and regenerate the entire E-Ring)',
        deepFacts: 'Cassini detected molecular hydrogen (H2) and phosphorus in the plumes, indicating active alkaline hydrothermal vents on the ocean floor identical to Earth\'s Lost City.',
        related: [{ id: 'saturn', label: 'Saturn' }, { id: 'titan', label: 'Titan' }]
      },
      triton: {
        name: 'Triton',
        type: 'Neptunian Moon (Captured Retrograde Kuiper Belt Dwarf)',
        cat: 'NATURAL SATELLITE',
        radius: '1,353.4 km',
        temp: '-235 °C (38 K - Coldest measured surface in the Solar System)',
        dist: '30.07 AU (354,760 km from Neptune)',
        speed: '4.39 km/s',
        mass: '2.140 × 10^22 kg',
        rot: '141.0 Hours (5.88 d Synchronous Retrograde)',
        moons: '0',
        comp: 'Frozen Nitrogen Frost, Water Ice, Frozen Carbon Dioxide, Methane, Tholins',
        facts: 'The only large moon in the Solar System with a retrograde orbit (opposite to planet rotation), proving it was a dwarf planet captured gravitationally from the Kuiper Belt.',
        grav: '0.779 m/s² (0.079 g)',
        esc: '1.455 km/s',
        press: '1.4 to 1.9 Pa (Nitrogen vapor exosphere)',
        tilt: '156.8° (Retrograde inclination to Neptune equator)',
        struct: 'High-density Metallic Core (comprising 2/3 of total mass) → Liquid/slush Water-Ammonia Mantle → Nitrogen-Methane Ice Crust with Active Nitrogen Geysers.',
        mag: 'Negligible.',
        missions: 'NASA Voyager 2 (historic close flyby in August 1989).',
        disc: 'Discovered by English astronomer William Lassell on October 10, 1846, just 17 days after Neptune itself was found.',
        loc: 'Neptunian Orbit',
        deepFacts: 'Triton features active nitrogen geysers that erupt dark particulate plumes 8 km high into its thin nitrogen atmosphere. In ~3.6 billion years it will fall into Neptune.',
        related: [{ id: 'neptune', label: 'Neptune' }, { id: 'voyager-2', label: 'Voyager 2' }]
      },
      iss: {
        name: 'International Space Station (ISS)',
        type: 'Crewed Microgravity Laboratory',
        cat: 'ARTIFICIAL SPACECRAFT',
        radius: '109 m × 73 m (Football field size)',
        temp: '-150 °C (Eclipse) to +120 °C (Sunlit)',
        dist: '1.00 AU (418 km altitude above Earth)',
        speed: '7.66 km/s (27,600 km/h / 17,150 mph)',
        mass: '444,000 kg (Nearly 1 million lbs)',
        rot: '92.6 Minutes per orbit (15.5 orbits per day)',
        moons: 'Docked spacecraft (Crew Dragon, Soyuz, Progress, Starliner, Cygnus)',
        comp: '2195 Aluminum-Lithium alloy pressure hull, Titanium fittings, Gallium-Arsenide / Silicon solar arrays, Whipple MMOD shields',
        facts: 'Inhabited continuously by international astronaut crews since November 2, 2000 (>24 years uninterrupted human presence in space). Completes an orbit every 92 minutes.',
        grav: 'Microgravity (~10^-6 g effective inside)',
        esc: 'N/A (Bound Low Earth Orbit)',
        press: '1.013 bars (101.3 kPa - Earth sea level breathable air)',
        tilt: '51.64° Orbital Inclination',
        struct: 'Pressurized Modules (Destiny, Columbus, Kibo, Zvezda, Zarya, Tranquility, Cupola) mounted on the 108-meter Integrated Truss Structure with 8 massive solar wings.',
        mag: 'Protected within Earth\'s inner geomagnetic magnetosphere.',
        missions: 'Over 70 expedition crews, >270 individual astronauts from 21 nations, conducting >3,000 breakthrough zero-gravity physics, medicine, and biology experiments.',
        disc: 'International partnership: NASA (USA), Roscosmos (Russia), ESA (Europe), JAXA (Japan), CSA (Canada). First module launched 1998.',
        loc: 'Low Earth Orbit (LEO) • 418 km mean altitude',
        deepFacts: 'Astronauts on the ISS witness 16 sunrises and 16 sunsets every single Earth day. Its solar array surface spans over 2,400 square meters generating 120 kW.',
        related: [{ id: 'earth', label: 'Earth' }, { id: 'tiangong', label: 'Tiangong' }, { id: 'moon', label: 'The Moon' }]
      },
      tiangong: {
        name: 'Tiangong Space Station (CSS)',
        type: 'Modular Low Earth Orbit Space Station',
        cat: 'ARTIFICIAL SPACECRAFT',
        radius: '55 m × 39 m (T-shaped modular configuration)',
        temp: '-120 °C to +100 °C',
        dist: '1.00 AU (390–420 km altitude above Earth)',
        speed: '7.68 km/s (27,650 km/h)',
        mass: '100,000 kg (Operational configuration)',
        rot: '92.2 Minutes per orbit',
        moons: 'Shenzhou crew craft & Tianzhou cargo transports',
        comp: 'Al-Li alloy pressure shell, flexible gallium arsenide solar wings, carbon-composite robotic arms',
        facts: 'Equipped with cutting-edge LHT-100 Hall-effect ion thrusters for orbital station-keeping, slashing required chemical propellant consumption by 90%.',
        grav: 'Microgravity (~10^-6 g)',
        esc: 'N/A (Bound LEO)',
        press: '1.01 bars (Earth atmospheric pressure)',
        tilt: '41.5° Orbital Inclination',
        struct: 'Tianhe Core Module + Wentian Science Module + Mengtian Laboratory Module in T-configuration with 10.2m high-dexterity robotic arm.',
        mag: 'Protected inside Earth\'s geomagnetic shield.',
        missions: 'Continuous 3-taikonaut crew rotations (Shenzhou 12 through Shenzhou 19+), deep science in fluid physics, space metallurgy, and cold-atom clocks.',
        disc: 'Constructed by CMSA (China Manned Space Agency); fully assembled in November 2022.',
        loc: 'Low Earth Orbit (LEO) • 390 km orbital inclination 41.5°',
        deepFacts: 'Tiangong will soon operate in tandem with the Xuntian Space Station Telescope (CSST), a 2-meter aperture space telescope with a field of view 300 times larger than Hubble.',
        related: [{ id: 'earth', label: 'Earth' }, { id: 'iss', label: 'ISS' }, { id: 'moon', label: 'The Moon' }]
      },
      jwst: {
        name: 'James Webb Space Telescope (JWST)',
        type: 'Flagship Space Infrared Observatory',
        cat: 'ARTIFICIAL SPACECRAFT',
        radius: '21.2 m Sunshield / 6.5 m Primary Mirror',
        temp: '-233 °C (Cryogenic Cold Side) / +85 °C (Sun-Facing Shield)',
        dist: '1.01 AU (1.5 million km from Earth at Sun-Earth L2)',
        speed: '0.2 to 1.0 km/s (L2 Halo Orbit)',
        mass: '6,161 kg',
        rot: 'Stationary pointing / 3-axis gyro stabilization',
        moons: 'None',
        comp: 'Gold-coated Beryllium mirrors (48 grams of gold total), 5-layer Kapton sunshield with aluminum and doped-silicon coatings',
        facts: 'Can detect infrared light emitted over 13.5 billion years ago, peering back to the formation of the very first galaxies after the Big Bang.',
        grav: 'Microgravity (Halo orbit around Lagrange Point 2)',
        esc: 'N/A (Stationary L2 gravitational equilibrium)',
        press: '10^-17 bar (Interplanetary Space Vacuum)',
        tilt: 'Always oriented shield-to-Sun',
        struct: '18 hexagonal gold-coated beryllium segments → Secondary mirror tripod → 5-layer tennis-court-sized Kapton sunshield → Integrated Science Instrument Module (NIRCam, NIRSpec, MIRI, FGS/NIRISS).',
        mag: 'Monitors solar wind magnetic boundaries at L2.',
        missions: 'Joint mission: NASA, ESA, CSA. Launched Christmas Day 2021 on Ariane 5; operational science commenced July 2022.',
        disc: 'Named in honor of James E. Webb, NASA administrator during the Apollo program.',
        loc: 'Sun-Earth L2 Lagrange Point (1.5 million km behind Earth)',
        deepFacts: 'The gold layer on the mirrors is only 100 nanometers thick (1,000 times thinner than a human hair). Its MIRI camera is cryo-cooled to just 7 Kelvin (-266 °C).',
        related: [{ id: 'earth', label: 'Earth' }, { id: 'hubble', label: 'Hubble' }, { id: 'sun', label: 'Sun' }]
      },
      hubble: {
        name: 'Hubble Space Telescope (HST)',
        type: 'Flagship Optical & UV Space Observatory',
        cat: 'ARTIFICIAL SPACECRAFT',
        radius: '13.2 m Length / 2.4 m Primary Mirror',
        temp: '-128 °C to +100 °C',
        dist: '1.00 AU (535 km altitude above Earth)',
        speed: '7.59 km/s (27,300 km/h)',
        mass: '11,110 kg',
        rot: '95.4 Minutes per orbit',
        moons: 'None',
        comp: 'Ultra-low expansion glass mirror coated with aluminum and magnesium fluoride, graphite-epoxy metering truss',
        facts: 'Operating for over 34 years in space, Hubble has made >1.6 million observations and helped determine the exact rate of expansion of the Universe (Hubble Constant).',
        grav: 'Microgravity (Low Earth Orbit)',
        esc: 'N/A (Bound LEO)',
        press: '10^-14 bar (Thermosphere Vacuum)',
        tilt: '28.5° Orbital Inclination',
        struct: 'Ritchey-Chrétien Cassegrain optical telescope with Advanced Camera for Surveys (ACS), Wide Field Camera 3 (WFC3), and Cosmic Origins Spectrograph (COS).',
        mag: 'Protected within Earth\'s magnetosphere.',
        missions: 'Launched April 24, 1990 aboard Space Shuttle Discovery (STS-31). Serviced by 5 crewed Shuttle missions (STS-61, 82, 103, 109, 125).',
        disc: 'Named after astronomer Edwin Hubble, who proved the existence of galaxies beyond the Milky Way.',
        loc: 'Low Earth Orbit (535 km altitude)',
        deepFacts: 'Hubble points with the precision of shining a laser beam onto a dime 320 kilometers (200 miles) away, holding steady for hours of deep-space exposure.',
        related: [{ id: 'earth', label: 'Earth' }, { id: 'jwst', label: 'JWST' }, { id: 'iss', label: 'ISS' }]
      },
      'voyager-1': {
        name: 'Voyager 1',
        type: 'Interstellar Deep Space Probe',
        cat: 'INTERSTELLAR PROBE',
        radius: '3.7 m (High-Gain Dish Antenna)',
        temp: '-240 °C (Interstellar Cold)',
        dist: '> 163 AU (24.4 Billion km from Sun)',
        speed: '16.9 km/s (61,000 km/h / 38,000 mph)',
        mass: '825.5 kg',
        rot: '3-Axis Stabilized by Sun Sensor & Star Tracker',
        moons: 'None',
        comp: 'Titanium-Aluminum alloy truss, Plutonium-238 Radioisotope Thermoelectric Generators (RTGs), Gold-Plated Interstellar Phonograph Record',
        facts: 'The farthest human-made object in history. On August 25, 2012, it became the first spacecraft to cross the Heliopause and enter true interstellar space.',
        grav: 'Negligible Interstellar Gravity',
        esc: 'Exceeded Solar System Escape Velocity',
        press: '10^-20 bar (Very Local Interstellar Medium)',
        tilt: '35.5° above ecliptic plane (Heading toward Ophiuchus)',
        struct: '10-sided electronics bus → 3.7m parabolic reflector → 3 Plutonium-238 RTG power canisters → 13-meter magnetometer boom → Golden Record.',
        mag: 'Directly measuring pristine interstellar magnetic fields outside the solar bubble.',
        missions: 'Launched September 5, 1977. Explored Jupiter (1979) and Saturn (1980). Entered interstellar space 2012; still transmitting data after 47+ years.',
        disc: 'NASA Jet Propulsion Laboratory (JPL) Interstellar Mission.',
        loc: 'Interstellar Space (Constellation Ophiuchus)',
        deepFacts: 'Radio signals traveling at the speed of light take over 22.5 hours to reach Voyager 1 from Earth, transmitted via NASA\'s Deep Space Network using an 8-watt transmitter.',
        related: [{ id: 'voyager-2', label: 'Voyager 2' }, { id: 'sun', label: 'Sun' }, { id: 'earth', label: 'Earth' }]
      },
      'voyager-2': {
        name: 'Voyager 2',
        type: 'Interstellar Grand Tour Probe',
        cat: 'INTERSTELLAR PROBE',
        radius: '3.7 m (High-Gain Dish Antenna)',
        temp: '-240 °C (Interstellar Cold)',
        dist: '> 136 AU (20.4 Billion km from Sun)',
        speed: '15.3 km/s (55,000 km/h)',
        mass: '825.5 kg',
        rot: '3-Axis Stabilized',
        moons: 'None',
        comp: 'Titanium, Aluminum, Beryllium, Plutonium-238 RTGs, Gold-Plated Copper Phonograph Record',
        facts: 'The only spacecraft in human history to visit all four giant planets: Jupiter (1979), Saturn (1981), Uranus (1986), and Neptune (1989). Crossed the Heliopause in 2018.',
        grav: 'Negligible Interstellar Gravity',
        esc: 'Hyperbolic Solar Escape Velocity',
        press: '10^-20 bar (Interstellar Medium)',
        tilt: '-48.0° south of ecliptic plane (Heading toward Pavo)',
        struct: 'Identical sister bus to Voyager 1, carrying the Golden Record with greetings in 55 human languages and sounds of Earth.',
        mag: 'Measuring interstellar cosmic rays and solar wind termination shock.',
        missions: 'Launched August 20, 1977 (16 days before Voyager 1). Grand Tour of the Solar System; entered interstellar space November 5, 2018.',
        disc: 'NASA Jet Propulsion Laboratory (JPL).',
        loc: 'Interstellar Space (Southern celestial hemisphere)',
        deepFacts: 'Voyager 2 discovered 16 new moons, rings around Neptune, and observed cryovolcanic geysers erupting on Neptune\'s moon Triton.',
        related: [{ id: 'voyager-1', label: 'Voyager 1' }, { id: 'uranus', label: 'Uranus' }, { id: 'neptune', label: 'Neptune' }]
      },
      'parker-solar-probe': {
        name: 'Parker Solar Probe',
        type: 'Solar Proximity & Coronal Penetration Probe',
        cat: 'SOLAR PROBE',
        radius: '2.3 m (Carbon-Composite Heat Shield diameter)',
        temp: 'Heat Shield: 1,400 °C (2,500 °F) / Electronics Bus: 30 °C',
        dist: '0.046 AU Perihelion (6.9 million km from Sun photosphere)',
        speed: 'Up to 192 km/s (690,000 km/h / 430,000 mph)',
        mass: '685 kg',
        rot: 'Autonomous solar-pointing thermal protection',
        moons: 'None',
        comp: '11.4 cm thick carbon-composite foam shield with alumina ceramic face sheets, Niobium C-103 thrusters, Gallium Arsenide solar wings with water cooling',
        facts: 'The fastest human-made object in history (reaching 690,000 km/h) and the first spacecraft to fly directly through the Sun\'s outer atmosphere (the Corona).',
        grav: 'Deep Solar Gravitational Well',
        esc: '617 km/s (Solar Surface Escape Velocity)',
        press: 'Solar Coronal Plasma Vacuum',
        tilt: '3.4° to solar equator',
        struct: 'Reinforced Carbon-Carbon Thermal Protection System (TPS) shielding a liquid-cooled bus with FIELDS magnetometers and SWEAP plasma detectors.',
        mag: 'Directly uncovers the origin of solar switchbacks and coronal magnetic reconnection.',
        missions: 'Launched August 12, 2018 on Delta IV Heavy. Successfully passed inside the Alfvén critical surface "touching the Sun" repeatedly.',
        disc: 'Named after astrophysicist Eugene N. Parker, who predicted the existence of the supersonic solar wind in 1958.',
        loc: 'Heliocentric Eccentric Orbit around the Sun',
        deepFacts: 'At closest perihelion, Parker Solar Probe travels fast enough to fly from New York to Tokyo in under a minute.',
        related: [{ id: 'sun', label: 'The Sun' }, { id: 'mercury', label: 'Mercury' }, { id: 'earth', label: 'Earth' }]
      }
    };

    // Aliases
    CELESTIAL_EXTRA['voyager1'] = CELESTIAL_EXTRA['voyager-1'];
    CELESTIAL_EXTRA['voyager2'] = CELESTIAL_EXTRA['voyager-2'];
    CELESTIAL_EXTRA['parker'] = CELESTIAL_EXTRA['parker-solar-probe'];

    const meta = CELESTIAL_EXTRA[id];

    let displayName = meta?.name || sat?.name || data.name || id.charAt(0).toUpperCase() + id.slice(1);
    if (nameEl) nameEl.textContent = displayName;
    if (subEl) subEl.textContent = meta?.type || sat?.type || data.category || 'Celestial Satellite';
    if (catEl) catEl.textContent = meta?.cat || data.category || 'EPHEMERIS TARGET';

    // Tab 1: Overview
    if (radEl) radEl.textContent = meta?.radius || (id.includes('voyager') ? '3.7 m' : (id.includes('parker') ? '2.3 m' : 'Satellite Object'));
    if (tempEl) tempEl.textContent = meta?.temp || '-150 °C to +120 °C';
    if (distEl) distEl.textContent = meta?.dist || (id.includes('voyager') ? '> 140 AU' : '1.00 AU (Earth System)');
    if (speedEl) speedEl.textContent = meta?.speed || `${sat.speed_kms || sat.orbital_velocity_kms || 7.66} km/s`;
    if (massEl) massEl.textContent = meta?.mass || 'Operational Spacecraft';
    if (rotEl) rotEl.textContent = meta?.rot || `${sat.period_mins || 92} min / orbit`;
    if (moonsRow) {
      if (meta?.moons) {
        moonsRow.style.display = 'flex';
        if (moonsVal) moonsVal.textContent = meta.moons;
      } else {
        moonsRow.style.display = 'none';
      }
    }
    if (compEl) compEl.textContent = meta?.comp || sat.description || 'Active celestial element.';
    if (factsEl) factsEl.textContent = meta?.facts || sat.facts || 'Operational astronomical object.';
    if (coordsEl) coordsEl.textContent = `Orbital Inclination: ${sat.inclination_deg ?? (data.inclination ? THREE.MathUtils.radToDeg(data.inclination).toFixed(2) : '51.6')}°`;
    if (altEl) altEl.textContent = `${(sat.altitude_km ?? 420).toLocaleString()} km Mission Altitude`;
    if (periodEl) periodEl.textContent = `${sat.period_mins ?? 92} minutes`;

    // Tab 2: Astrophysics & Interior
    if (gravEl) gravEl.textContent = meta?.grav || 'Microgravity Environment';
    if (escEl) escEl.textContent = meta?.esc || 'Bound Planetary Orbit';
    if (pressEl) pressEl.textContent = meta?.press || '10^-14 bar (Exosphere / High Vacuum)';
    if (tiltEl) tiltEl.textContent = meta?.tilt || '51.6° Orbital Plane';
    if (structEl) structEl.textContent = meta?.struct || 'Integrated Avionics, Structural Spaceframe, Propulsion Subsystem, and Solar Photovoltaic Power.';
    if (magEl) magEl.textContent = meta?.mag || 'Protected within local planetary magnetosphere.';
    renderCompBadges(meta?.comp || 'Aluminum Alloy, Titanium, Silicon Solar Cells', ['Aerospace Alloy', 'Silicon PV', 'Titanium Frame', 'Multi-layer Insulation']);

    // Tab 3: Exploration & Science
    if (missEl) missEl.textContent = meta?.missions || sat.facts || 'Active space exploration mission.';
    if (discEl) discEl.textContent = meta?.disc || 'Modern Space Age Catalog';
    if (locEl) locEl.textContent = meta?.loc || 'Earth Vicinity • Solar System';
    if (deepFactsEl) deepFactsEl.textContent = meta?.deepFacts || meta?.facts || 'Key mission asset exploring the cosmic frontier.';
    renderJumpButtons(meta?.related || [{ id: 'earth', label: 'Earth' }, { id: 'sun', label: 'The Sun' }]);
  }

  // ----------------------------------------------------------------------------
  // Dynamic Cosmic Scale Detection & Level-of-Detail (LOD)
  // ----------------------------------------------------------------------------
  updateScaleDetection() {
    const camDist = this.camera.position.length();
    const badge = document.getElementById('scale-badge');
    const desc = document.getElementById('scale-desc');
    const actionBtn = document.getElementById('btn-scale-action');
    const isGalaxyTarget = this.focusedObject?.userData?.category === 'GALAXY';

    if (this.galaxiesGroup) {
      const toggleGalaxyChecked = document.getElementById('toggle-galaxy')?.checked ?? true;
      // Galaxies are rendered in cosmic zoom or whenever a galaxy is explicitly focused
      this.galaxiesGroup.visible = toggleGalaxyChecked && (camDist > 180 || isGalaxyTarget);
    }

    if (camDist > 1200) {
      if (this.currentScaleLevel !== 'GALAXY') {
        this.currentScaleLevel = 'GALAXY';
        if (badge) badge.textContent = 'COSMIC REALM (MULTIVERSE)';
        if (desc) desc.textContent = '11 GALAXIES DETECTED • CLICK OR SCROLL TO EXPLORE';
        if (actionBtn) actionBtn.textContent = 'DIVE INTO SOLAR SYSTEM ↓';
      }
    } else if (camDist > 300) {
      if (this.currentScaleLevel !== 'INTERSTELLAR') {
        this.currentScaleLevel = 'INTERSTELLAR';
        if (badge) badge.textContent = 'INTERSTELLAR SCALE';
        if (desc) desc.textContent = 'VOYAGER TRAJECTORY • APPROACHING HELIOPAUSE';
        if (actionBtn) actionBtn.textContent = 'FOCUS SUN ↓';
      }
    } else if (camDist > 40) {
      if (this.currentScaleLevel !== 'SOLAR') {
        this.currentScaleLevel = 'SOLAR';
        if (badge) badge.textContent = 'SOLAR SYSTEM SCALE';
        if (desc) desc.textContent = 'INTERPLANETARY PLANE • 8 PLANETS DETECTED';
        if (actionBtn) actionBtn.textContent = 'ZOOM OUT TO GALAXY ↑';
      }
    } else {
      if (this.currentScaleLevel !== 'PROXIMITY') {
        this.currentScaleLevel = 'PROXIMITY';
        if (badge) badge.textContent = 'PLANETARY / SATELLITE RADAR';
        if (desc) desc.textContent = 'CLOSE ORBIT • SATELLITE TELEMETRY ACTIVE';
        if (actionBtn) actionBtn.textContent = 'ZOOM OUT TO GALAXY ↑';
      }
    }
  }

  // ----------------------------------------------------------------------------
  // Main Animation Loop
  // ----------------------------------------------------------------------------
  animate() {
    requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();
    const effectiveDelta = this.isPaused ? 0 : delta * this.timeScale;
    this.simulationDays += effectiveDelta * 0.8;

    // 1. Dynamic Galaxy Rotations
    this.galaxies.forEach((gObj) => {
      gObj.group.rotation.y += gObj.config.rotationSpeed;
    });
    if (this.solarMarker) {
      this.solarMarker.rotation.z += 0.01;
    }

    // 2. Sun Convection & Flare Animation
    if (this.sunMesh) {
      this.sunMesh.rotation.y += 0.001;
      if (this.sunTex) {
        this.sunTex.offset.x += 0.00025;
      }
      if (this.sunFlareSprite) {
        const pulse = 0.96 + 0.04 * Math.sin(this.simulationDays * 6.0);
        const r = CELESTIAL_CONFIG.sun.radius * 6.5 * pulse;
        this.sunFlareSprite.scale.set(r, r, 1.0);
      }
    }

    // 3. Planets Orbital Progression
    this.planets.forEach((mesh) => {
      const config = mesh.userData.config;
      const distance = mesh.userData.distance;
      const orbitalSpeed = (Math.PI * 2) / (config.orbitalPeriodDays * 0.15);
      const angle = this.simulationDays * orbitalSpeed;

      const x = Math.cos(angle) * distance;
      const z = Math.sin(angle) * distance;
      const y = Math.sin(angle) * distance * Math.sin(THREE.MathUtils.degToRad(config.inclinationDeg));

      mesh.position.set(x, y, z);
      mesh.rotation.y += config.rotationSpeed * (this.isPaused ? 0.1 : 1.0);
    });

    if (this.earthClouds) this.earthClouds.rotation.y += 0.0022;

    // 4. Moons Orbiting Parents
    this.moons.forEach(({ mesh, parent }) => {
      const data = mesh.userData;
      data.angle += data.speed * effectiveDelta * 4.0;
      mesh.position.set(
        parent.position.x + Math.cos(data.angle) * data.distance,
        parent.position.y,
        parent.position.z + Math.sin(data.angle) * data.distance
      );
    });

    // 5. Artificial Satellites relative to Earth / Sun
    if (this.earthMesh) {
      const earthPos = this.earthMesh.position;

      // ISS (Sun-tracking solar wings)
      if (this.issGroup) {
        const issData = this.issGroup.userData;
        issData.angle += issData.speed * (this.isPaused ? 0 : 1.0);
        const r = issData.orbitRadius;
        this.issGroup.position.set(
          earthPos.x + r * Math.cos(issData.angle),
          earthPos.y + r * Math.sin(issData.angle) * Math.sin(issData.inclination),
          earthPos.z + r * Math.sin(issData.angle) * Math.cos(issData.inclination)
        );
        if (this.issSolarGimbal) {
          this.issSolarGimbal.lookAt(new THREE.Vector3(0, 0, 0));
        }
        if (this.issOrbitTrail) this.issOrbitTrail.position.copy(earthPos);
      }

      // Tiangong Space Station (CSS)
      if (this.tiangongGroup) {
        const tgData = this.tiangongGroup.userData;
        tgData.angle += tgData.speed * (this.isPaused ? 0 : 1.0);
        const r = tgData.orbitRadius;
        this.tiangongGroup.position.set(
          earthPos.x + r * Math.cos(tgData.angle),
          earthPos.y + r * Math.sin(tgData.angle) * Math.sin(tgData.inclination),
          earthPos.z + r * Math.sin(tgData.angle) * Math.cos(tgData.inclination)
        );
        if (this.tiangongSolarGimbal) {
          this.tiangongSolarGimbal.lookAt(new THREE.Vector3(0, 0, 0));
        }
        if (this.tiangongOrbitTrail) this.tiangongOrbitTrail.position.copy(earthPos);
      }

      // JWST at Sun-Earth L2 (trailing 1.5M km behind Earth opposite the Sun)
      if (this.jwstGroup) {
        const jwstData = this.jwstGroup.userData;
        jwstData.angle += jwstData.speed * (this.isPaused ? 0 : 1.0);
        const r = jwstData.orbitRadius;
        const sunToEarth = earthPos.clone().normalize();
        const l2Base = earthPos.clone().add(sunToEarth.multiplyScalar(r));
        this.jwstGroup.position.set(
          l2Base.x + Math.cos(jwstData.angle) * 0.35,
          l2Base.y + Math.sin(jwstData.angle) * 0.25,
          l2Base.z + Math.sin(jwstData.angle) * 0.35
        );
        this.jwstGroup.lookAt(new THREE.Vector3(0, 0, 0));
      }

      // Hubble orbit
      if (this.hstGroup) {
        const hstData = this.hstGroup.userData;
        hstData.angle += hstData.speed * (this.isPaused ? 0 : 1.0);
        const r = hstData.orbitRadius;
        this.hstGroup.position.set(
          earthPos.x + r * Math.cos(hstData.angle),
          earthPos.y + r * Math.sin(hstData.angle) * Math.sin(hstData.inclination),
          earthPos.z + r * Math.sin(hstData.angle) * Math.cos(hstData.inclination)
        );
      }

      // Constellations locked to Earth position
      if (this.starlinkMesh) {
        this.starlinkMesh.position.copy(earthPos);
        this.starlinkMesh.rotation.y += 0.008;
      }
      if (this.gpsRing) this.gpsRing.position.copy(earthPos);
      if (this.geoRing) this.geoRing.position.copy(earthPos);
    }

    // Parker Solar Probe: Orbits the Sun and keeps its Heat Shield pointed straight into the Sun
    if (this.parkerGroup) {
      const pData = this.parkerGroup.userData;
      pData.angle += pData.speed * (this.isPaused ? 0 : 1.0);
      const r = pData.orbitRadius;
      const px = Math.cos(pData.angle) * r;
      const pz = Math.sin(pData.angle) * (r * 0.65); // Eccentric ellipse
      const py = Math.sin(pData.angle) * 1.8;
      this.parkerGroup.position.set(px, py, pz);
      // Heat shield points directly at the Sun at (0,0,0)
      this.parkerGroup.lookAt(new THREE.Vector3(0, 0, 0));
    }

    // 6. Camera Tracking & Interpolation
    if (this.focusedObject) {
      const targetPos = new THREE.Vector3();
      this.focusedObject.getWorldPosition(targetPos);

      if (this.isTransitioningCamera) {
        let desiredCamPos;
        const radius = this.focusedObject.userData.radius || 2.0;

        // If focusing on a Galaxy
        if (this.focusedObject.userData.category === 'GALAXY') {
          const cfg = this.focusedObject.userData.config;
          desiredCamPos = cfg.cameraOffset.clone();
        } else if (this.focusedObject === this.sunMesh || this.focusedObject.userData.id === 'sun') {
          // Perfectly frame the radiant glowing Sun in the open viewport area
          desiredCamPos = new THREE.Vector3(radius * 1.5, radius * 0.7, radius * 2.3);
        } else {
          const sunToPlanet = targetPos.clone().normalize();
          if (sunToPlanet.lengthSq() < 0.001) sunToPlanet.set(0, 0, 1);
          const offset = sunToPlanet.clone().multiplyScalar(-radius * 3.6);
          offset.y += radius * 1.5;
          offset.x += radius * 1.2;
          desiredCamPos = targetPos.clone().add(offset);
        }

        this.camera.position.lerp(desiredCamPos, 0.08);
        this.controls.target.lerp(targetPos, 0.08);

        if (this.camera.position.distanceTo(desiredCamPos) < 0.25 && this.controls.target.distanceTo(targetPos) < 0.25) {
          this.camera.position.copy(desiredCamPos);
          this.controls.target.copy(targetPos);
          this.isTransitioningCamera = false;
        }
      } else {
        // Follow moving planetary orbits smoothly
        if (this.focusedObject !== this.sunMesh && this.focusedObject.userData.id !== 'sun') {
          const prevTarget = this.controls.target.clone();
          const delta = targetPos.clone().sub(prevTarget);
          this.camera.position.add(delta);
        }
        this.controls.target.copy(targetPos);
      }
    } else if (this.isTransitioningCamera) {
      this.camera.position.lerp(this.targetCameraPosition, 0.06);
      this.controls.target.lerp(this.targetLookAt, 0.06);
      if (this.camera.position.distanceTo(this.targetCameraPosition) < 0.5) {
        this.isTransitioningCamera = false;
      }
    }

    // 7. Scale Level Monitor
    this.updateScaleDetection();

    // 8. Cinematic Auto Tour Progression
    if (this.isAutoTourActive) {
      this.autoTourTimer += delta;
      if (this.autoTourTimer > 9.0) {
        this.autoTourTimer = 0.0;
        this.cycleAutoTour();
      }
    }

    // 9. Mission Clock UTC
    const clockEl = document.getElementById('mission-clock');
    if (clockEl) {
      const now = new Date();
      clockEl.textContent = `UTC ${now.toUTCString().slice(17, 25)}`;
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

// Initialize Application on DOM Ready
window.addEventListener('DOMContentLoaded', () => {
  window.app = new HeliosCosmicApplication();
});
