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

      if (cfg.hasCentralBar && Math.random() < 0.2) {
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
        // Spiral Arms
        const r = Math.pow(Math.random(), 2.0) * cfg.radius;
        const armIndex = i % cfg.arms;
        const armAngle = (armIndex / cfg.arms) * Math.PI * 2;
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
    const coreGeo = new THREE.SphereGeometry(cfg.radius * 0.05, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: cfg.colorCore,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
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
      const markerGeo = new THREE.RingGeometry(8, 13, 32);
      const markerMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      this.solarMarker = new THREE.Mesh(markerGeo, markerMat);
      this.solarMarker.rotation.x = Math.PI / 2;
      group.add(this.solarMarker);
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
  // The Sun: Convective Photosphere & Corona
  // ----------------------------------------------------------------------------
  initSun() {
    const sunData = CELESTIAL_CONFIG.sun;
    const sunGeo = new THREE.SphereGeometry(sunData.radius, 64, 64);
    const sunTex = this.textureLoader.load(sunData.textureFile);
    sunTex.colorSpace = THREE.SRGBColorSpace;

    const sunMat = new THREE.ShaderMaterial({
      uniforms: {
        sunTexture: { value: sunTex },
        time: { value: 0 }
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
        uniform sampler2D sunTexture;
        uniform float time;
        varying vec2 vUv;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPosition;

        void main() {
          vec2 uvFlow1 = vUv + vec2(time * 0.003, time * 0.001);
          vec2 uvFlow2 = vUv + vec2(-time * 0.002, time * 0.004);
          vec4 baseColor1 = texture2D(sunTexture, uvFlow1);
          vec4 baseColor2 = texture2D(sunTexture, uvFlow2);
          vec3 plasma = mix(baseColor1.rgb, baseColor2.rgb, 0.5);

          vec3 viewDir = normalize(cameraPosition - vWorldPosition);
          float cosTheta = max(dot(vWorldNormal, viewDir), 0.0);
          float u = 0.65;
          float limbDarkening = 1.0 - u * (1.0 - cosTheta);
          plasma *= limbDarkening;

          float fresnel = pow(1.0 - cosTheta, 2.5);
          vec3 coronaGlow = vec3(1.0, 0.75, 0.3) * fresnel * 2.2;

          gl_FragColor = vec4(plasma + coronaGlow, 1.0);
        }
      `
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

    // Pulsing Solar Corona Halo
    const coronaGeo = new THREE.SphereGeometry(sunData.radius * 1.35, 32, 32);
    const coronaMat = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 } },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          float intensity = pow(0.68 - dot(vNormal, vec3(0, 0, 1.0)), 2.2);
          float pulse = 0.9 + 0.1 * sin(time * 2.0);
          gl_FragColor = vec4(1.0, 0.6, 0.1, intensity * pulse * 0.85);
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false
    });
    this.sunCorona = new THREE.Mesh(coronaGeo, coronaMat);
    this.sunMesh.add(this.sunCorona);
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

    // Populate the 38 System Objects
    const catalog = [
      {
        category: 'Galaxies (Cosmic Scale)',
        items: [
          { id: 'milkyway', name: 'Milky Way Galaxy', tag: 'SBbc • 100k ly', dot: '#38bdf8' },
          { id: 'andromeda', name: 'Andromeda Galaxy (M31)', tag: 'SA(s)b • 2.5M ly', dot: '#74b9ff' },
          { id: 'triangulum', name: 'Triangulum Galaxy (M33)', tag: 'SA(s)cd • 2.7M ly', dot: '#00cec9' },
          { id: 'sombrero', name: 'Sombrero Galaxy (M104)', tag: 'SA(s)a • 31.1M ly', dot: '#ffeaa7' },
          { id: 'whirlpool', name: 'Whirlpool Galaxy (M51)', tag: 'M51 • 23.5M ly', dot: '#0984e3' }
        ]
      },
      {
        category: 'Stars',
        items: [
          { id: 'sun', name: 'The Sun', tag: 'G2V Yellow Dwarf', dot: '#ffaa00' }
        ]
      },
      {
        category: 'Planets',
        items: [
          { id: 'mercury', name: 'Mercury', tag: '0.387 AU', dot: '#a5a5a5' },
          { id: 'venus', name: 'Venus', tag: '0.723 AU', dot: '#e3bb76' },
          { id: 'earth', name: 'Earth', tag: '1.000 AU • Oasis', dot: '#2e7bcf' },
          { id: 'mars', name: 'Mars', tag: '1.524 AU • Red Planet', dot: '#cf533a' },
          { id: 'jupiter', name: 'Jupiter', tag: '5.204 AU • Giant', dot: '#c49a6c' },
          { id: 'saturn', name: 'Saturn', tag: '9.537 AU • Rings', dot: '#e0cda9' },
          { id: 'uranus', name: 'Uranus', tag: '19.19 AU • Ice Giant', dot: '#73c4c9' },
          { id: 'neptune', name: 'Neptune', tag: '30.07 AU • Windswept', dot: '#3d5ef0' }
        ]
      },
      {
        category: 'Major Natural Satellites',
        items: [
          { id: 'moon', name: 'The Moon (Luna)', tag: 'Earth • 384,400 km', dot: '#ffffff' },
          { id: 'phobos', name: 'Phobos', tag: 'Mars • 9,377 km', dot: '#8c7e6c' },
          { id: 'deimos', name: 'Deimos', tag: 'Mars • 23,460 km', dot: '#a39585' },
          { id: 'io', name: 'Io (Volcanoes)', tag: 'Jupiter • 421,700 km', dot: '#e0c743' },
          { id: 'europa', name: 'Europa (Subsurface Ocean)', tag: 'Jupiter • 670,900 km', dot: '#b5ab93' },
          { id: 'ganymede', name: 'Ganymede (Largest Moon)', tag: 'Jupiter • 1,070,400 km', dot: '#938575' },
          { id: 'callisto', name: 'Callisto (Cratered)', tag: 'Jupiter • 1,882,700 km', dot: '#63584c' },
          { id: 'titan', name: 'Titan (Methane Lakes)', tag: 'Saturn • 1,221,870 km', dot: '#c99a4b' },
          { id: 'enceladus', name: 'Enceladus (Cryogeysers)', tag: 'Saturn • 238,000 km', dot: '#ffffff' },
          { id: 'triton', name: 'Triton (Retrograde Orbit)', tag: 'Neptune • 354,800 km', dot: '#8bbad9' }
        ]
      },
      {
        category: 'Artificial Satellites & Space Probes',
        items: [
          { id: 'iss', name: 'International Space Station (ISS)', tag: 'LEO • 420 km', dot: '#ffb703' },
          { id: 'tiangong', name: 'Tiangong Space Station (CSS)', tag: 'LEO • 390 km', dot: '#06d6a0' },
          { id: 'hubble', name: 'Hubble Space Telescope (HST)', tag: 'LEO • 540 km', dot: '#00f0ff' },
          { id: 'jwst', name: 'James Webb Space Telescope (JWST)', tag: 'Sun-Earth L2 • 1.5M km', dot: '#d8b4e2' },
          { id: 'voyager-1', name: 'Voyager 1 (Interstellar Probe)', tag: 'Interstellar • >160 AU', dot: '#fbbf24' },
          { id: 'voyager-2', name: 'Voyager 2 (Grand Tour)', tag: 'Interstellar • >135 AU', dot: '#fbbf24' },
          { id: 'parker-solar-probe', name: 'Parker Solar Probe', tag: 'Perihelion • 0.046 AU', dot: '#f97316' },
          { id: 'starlink', name: 'Starlink Megaconstellation', tag: 'LEO Swarm • 550 km', dot: '#06d6a0' },
          { id: 'gps', name: 'GPS Navstar Constellation', tag: 'MEO Ring • 20,200 km', dot: '#3a86ff' },
          { id: 'geostationary', name: 'Geostationary Telecom Belt', tag: 'GEO Ring • 35,786 km', dot: '#ffb703' }
        ]
      }
    ];

    list.innerHTML = '';
    catalog.forEach((sec) => {
      const catTitle = document.createElement('div');
      catTitle.className = 'dropdown-category-title';
      catTitle.textContent = sec.category;
      list.appendChild(catTitle);

      sec.items.forEach((item) => {
        const row = document.createElement('div');
        row.className = 'dropdown-item';
        row.dataset.id = item.id;
        row.dataset.name = item.name.toLowerCase();
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

    // Real-Time Search Filter
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        if (clearBtn) clearBtn.style.display = query ? 'block' : 'none';

        const items = list.querySelectorAll('.dropdown-item');
        const catTitles = list.querySelectorAll('.dropdown-category-title');

        items.forEach((el) => {
          const match = el.dataset.name.includes(query) || el.textContent.toLowerCase().includes(query);
          el.style.display = match ? 'flex' : 'none';
        });

        catTitles.forEach((cat) => {
          let hasVisibleSibling = false;
          let next = cat.nextElementSibling;
          while (next && !next.classList.contains('dropdown-category-title')) {
            if (next.style.display !== 'none') {
              hasVisibleSibling = true;
              break;
            }
            next = next.nextElementSibling;
          }
          cat.style.display = hasVisibleSibling ? 'flex' : 'none';
        });
      });
    }

    if (clearBtn && searchInput) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearBtn.style.display = 'none';
        list.querySelectorAll('.dropdown-item, .dropdown-category-title').forEach(el => el.style.display = 'flex');
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

    const id = (data.id || (data.name ? data.name.toLowerCase() : '')).toLowerCase();

    // 1. Check if Galaxy
    const galaxyData = this.backendGalaxies?.[id] || GALAXY_METADATA_FALLBACK[id];
    if (galaxyData) {
      if (nameEl) nameEl.textContent = galaxyData.name;
      if (subEl) subEl.textContent = galaxyData.type;
      if (catEl) catEl.textContent = 'COSMIC REALM / GALAXY';
      if (radEl) radEl.textContent = galaxyData.diameter_ly;
      if (tempEl) tempEl.textContent = '2.725 K (Cosmic Microwave Background)';
      if (distEl) distEl.textContent = galaxyData.distance_ly;
      if (speedEl) speedEl.textContent = '~220 km/s (Galactic Orbit)';
      if (massEl) massEl.textContent = galaxyData.mass_solar;
      if (rotEl) rotEl.textContent = galaxyData.rotation_period_years;
      if (compEl) compEl.textContent = galaxyData.composition;
      if (factsEl) factsEl.textContent = galaxyData.facts;
      if (coordsEl) coordsEl.textContent = `Supermassive Core: ${galaxyData.central_black_hole}`;
      if (altEl) altEl.textContent = `Stars: ${galaxyData.stars_count}`;
      if (periodEl) periodEl.textContent = `Location: ${galaxyData.location}`;
      return;
    }

    // 2. Planets & Solar System Bodies
    const ephem = this.backendPlanetData?.find(p => p.id === id);
    const satEphem = this.backendSatellites?.find(s => s.id === id);

    let displayName = ephem?.name || satEphem?.name || data.name;
    if (!displayName && id) {
      displayName = id.charAt(0).toUpperCase() + id.slice(1);
    }

    if (nameEl) nameEl.textContent = displayName || 'Celestial Object';
    if (subEl) subEl.textContent = ephem?.type || satEphem?.type || data.category || 'Solar System Object';
    if (catEl) catEl.textContent = data.category || 'EPHEMERIS TARGET';

    if (ephem) {
      if (radEl) radEl.textContent = `${ephem.radius_km.toLocaleString()} km`;
      if (tempEl) tempEl.textContent = ephem.surface_temp || '—';
      if (distEl) distEl.textContent = `${ephem.a_au || ephem.distance_from_sun_au || 0} AU`;
      if (speedEl) speedEl.textContent = `${ephem.orbital_speed_kms || 0} km/s`;
      if (massEl) massEl.textContent = ephem.mass_kg || '—';
      if (rotEl) rotEl.textContent = `${ephem.rotation_period_days} Days`;
      if (compEl) compEl.textContent = ephem.composition || '—';
      if (factsEl) factsEl.textContent = ephem.facts || '—';
      if (coordsEl) coordsEl.textContent = `Heliocentric X: ${ephem.position?.x_au ?? 0} AU | Z: ${ephem.position?.z_au ?? 0} AU`;
      if (altEl) altEl.textContent = 'Heliocentric Orbit';
      if (periodEl) periodEl.textContent = `${ephem.orbital_period_days} Days`;
    } else {
      // Artificial Satellites & Probes
      const sat = satEphem || data;
      if (radEl) {
        if (id === 'iss') radEl.textContent = '109 m (Wingspan)';
        else if (id === 'tiangong') radEl.textContent = '55 m (Modular Width)';
        else if (id === 'jwst') radEl.textContent = '21 m (Sunshield)';
        else if (id.includes('voyager')) radEl.textContent = '3.7 m (High Gain Antenna)';
        else if (id.includes('parker')) radEl.textContent = '2.3 m (Carbon Heat Shield)';
        else radEl.textContent = 'Orbital Spacecraft';
      }
      if (tempEl) tempEl.textContent = id.includes('parker') ? 'Shield: 1,400 °C / Bus: 30 °C' : '-150 °C to +120 °C';
      if (distEl) distEl.textContent = id.includes('voyager') ? '> 140 AU from Sun' : (id.includes('parker') ? '0.046 AU Perihelion' : '1.00 AU (Sun-Earth System)');
      if (speedEl) speedEl.textContent = `${sat.speed_kms || sat.orbital_velocity_kms || (id.includes('parker') ? 192 : 7.66)} km/s`;
      if (massEl) massEl.textContent = id === 'iss' ? '444,000 kg' : (id === 'tiangong' ? '100,000 kg' : (id.includes('voyager') ? '825 kg' : 'Operational Bus'));
      if (rotEl) rotEl.textContent = id.includes('voyager') ? '3-Axis Stabilized' : `${sat.period_mins || 92.2} min / orbit`;
      if (compEl) compEl.textContent = sat.description || 'Active space mission.';
      if (factsEl) {
        if (id.includes('voyager')) factsEl.textContent = 'Farthest human-made object in history, carrying the interstellar Golden Record message to extraterrestrials.';
        else if (id.includes('parker')) factsEl.textContent = 'First spacecraft to "touch the Sun," flying directly through coronal mass ejections.';
        else if (id === 'tiangong') factsEl.textContent = 'China permanent modular space station hosting continuous 3-astronaut crews.';
        else factsEl.textContent = sat.facts || 'Operational spacecraft in active scientific service.';
      }

      if (coordsEl) coordsEl.textContent = `Orbital Inclination: ${sat.inclination_deg ?? (data.inclination ? THREE.MathUtils.radToDeg(data.inclination).toFixed(2) : '51.6')}°`;
      if (altEl) altEl.textContent = `${(sat.altitude_km ?? 420).toLocaleString()} km Mission Altitude`;
      if (periodEl) periodEl.textContent = `${sat.period_mins ?? 92} minutes`;
    }
  }

  // ----------------------------------------------------------------------------
  // Dynamic Cosmic Scale Detection & Level-of-Detail (LOD)
  // ----------------------------------------------------------------------------
  updateScaleDetection() {
    const camDist = this.camera.position.length();
    const badge = document.getElementById('scale-badge');
    const desc = document.getElementById('scale-desc');
    const actionBtn = document.getElementById('btn-scale-action');

    if (this.galaxiesGroup) {
      const toggleGalaxyChecked = document.getElementById('toggle-galaxy')?.checked ?? true;
      this.galaxiesGroup.visible = toggleGalaxyChecked && (camDist > 80);
    }

    if (camDist > 1200) {
      if (this.currentScaleLevel !== 'GALAXY') {
        this.currentScaleLevel = 'GALAXY';
        if (badge) badge.textContent = 'COSMIC REALM (MULTIVERSE)';
        if (desc) desc.textContent = '5 GALAXIES DETECTED • CLICK OR SCROLL TO EXPLORE';
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

    // 2. Sun Convection & Corona Animation
    if (this.sunMesh) {
      this.sunMesh.rotation.y += 0.001;
      if (this.sunMesh.material.uniforms) {
        this.sunMesh.material.uniforms.time.value += delta;
      }
      if (this.sunCorona) this.sunCorona.material.uniforms.time.value += delta;
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

        if (this.camera.position.distanceTo(desiredCamPos) < 0.3) {
          this.isTransitioningCamera = false;
        }
      } else {
        const prevTarget = this.controls.target.clone();
        const deltaTarget = targetPos.clone().sub(prevTarget);
        this.camera.position.add(deltaTarget);
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
  new HeliosCosmicApplication();
});
