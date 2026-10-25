/**
 * HELIOS 3D — SOLAR SYSTEM & SATELLITE ORBITAL SIMULATOR
 * Built with Three.js (WebGL) and connected to Python FastAPI Backend.
 *
 * TEXTURE CUSTOMIZATION:
 * Place your optional high-resolution textures in `public/textures/`:
 *   - sun.jpg             (Sun surface map)
 *   - mercury.jpg         (Mercury surface map)
 *   - venus.jpg           (Venus surface/atmosphere map)
 *   - earth_texture.jpg   (Earth day surface map)
 *   - earth_clouds.jpg    (Earth cloud layer)
 *   - moon.jpg            (Moon surface map)
 *   - mars.jpg            (Mars surface map)
 *   - jupiter.jpg         (Jupiter surface map)
 *   - saturn.jpg          (Saturn surface map)
 *   - saturn_rings.png    (Saturn ring alpha texture)
 *   - uranus.jpg          (Uranus surface map)
 *   - neptune.jpg         (Neptune surface map)
 *   - milkyway.jpg        (360 Equirectangular galaxy background)
 *
 * If any texture file is missing, the engine automatically falls back
 * to ultra-high-resolution procedural 2K Canvas textures generated at runtime.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ==============================================================================
// 1. CONFIGURATION & SCALING CONSTANTS
// ==============================================================================

// Logarithmic / Visual Scaling Constants for rendering usability:
// True 1:1 scale renders planets as invisible sub-pixel specks at astronomical distances.
const DISTANCE_SCALE = 38.0;     // AU to Scene Units multiplier
const PLANET_SIZE_SCALE = 1.0;   // Scaling factor for planet radii
const MOON_DISTANCE_SCALE = 4.2; // Scaling factor for moon orbit radii

// Celestial definitions (orbital semi-major axis in AU, radius in scene units, colors)
const CELESTIAL_CONFIG = {
  sun: {
    id: 'sun',
    name: 'The Sun',
    category: 'STAR / G2V',
    radius: 7.2,
    color: 0xffaa00,
    emissive: 0xff8800,
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
    textureFile: 'textures/mercury.jpg'
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
    textureFile: 'textures/venus.jpg'
  },
  earth: {
    id: 'earth',
    name: 'Earth',
    category: 'TERRESTRIAL PLANET',
    a_au: 1.000,
    radius: 1.5,
    orbitalPeriodDays: 365.25,
    eccentricity: 0.016,
    inclinationDeg: 0.0,
    axialTiltDeg: 23.44,
    rotationSpeed: 0.015,
    color: 0x2277bb,
    textureFile: 'textures/earth_texture.jpg',
    cloudsFile: 'textures/earth_clouds.jpg'
  },
  mars: {
    id: 'mars',
    name: 'Mars',
    category: 'TERRESTRIAL PLANET',
    a_au: 1.524,
    radius: 0.95,
    orbitalPeriodDays: 686.98,
    eccentricity: 0.093,
    inclinationDeg: 1.85,
    axialTiltDeg: 25.19,
    rotationSpeed: 0.014,
    color: 0xcf533a,
    textureFile: 'textures/mars.jpg'
  },
  jupiter: {
    id: 'jupiter',
    name: 'Jupiter',
    category: 'GAS GIANT',
    a_au: 2.85, // Scaled for visual spacing
    radius: 4.2,
    orbitalPeriodDays: 4332.59,
    eccentricity: 0.048,
    inclinationDeg: 1.3,
    rotationSpeed: 0.035,
    color: 0xd6a97a,
    textureFile: 'textures/jupiter.jpg'
  },
  saturn: {
    id: 'saturn',
    name: 'Saturn',
    category: 'GAS GIANT (RINGED)',
    a_au: 4.15,
    radius: 3.5,
    orbitalPeriodDays: 10759.22,
    eccentricity: 0.055,
    inclinationDeg: 2.48,
    axialTiltDeg: 26.73,
    rotationSpeed: 0.032,
    color: 0xe0cda9,
    textureFile: 'textures/saturn.jpg',
    ringsFile: 'textures/saturn_rings.png'
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
    category: 'ICE GIANT',
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
// 2. PROCEDURAL HIGH-RESOLUTION TEXTURE GENERATOR (FALLBACK & ZERO-ASSET READY)
// ==============================================================================
class ProceduralTextureEngine {
  /**
   * Generates a 2048x1024 high-res procedural planetary canvas texture
   */
  static generatePlanetTexture(type) {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    if (type === 'sun') {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#ff4800');
      grad.addColorStop(0.3, '#ffaa00');
      grad.addColorStop(0.7, '#ffcc00');
      grad.addColorStop(1, '#ff6600');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Granular convective noise & solar flares
      for (let i = 0; i < 4000; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const r = Math.random() * 25 + 5;
        const alpha = Math.random() * 0.25;
        ctx.fillStyle = `rgba(255, 240, 180, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (type === 'earth') {
      // Ocean Base
      ctx.fillStyle = '#0f3d73';
      ctx.fillRect(0, 0, w, h);

      // Procedural Continents
      ctx.fillStyle = '#2c6e3b';
      for (let i = 0; i < 40; i++) {
        const cx = Math.random() * w;
        const cy = h * 0.2 + Math.random() * h * 0.6;
        const rad = 60 + Math.random() * 180;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rad * 1.5, rad, Math.random(), 0, Math.PI * 2);
        ctx.fill();
      }

      // Mountain / Arid highlights
      ctx.fillStyle = '#9e7b4b';
      for (let i = 0; i < 25; i++) {
        const cx = Math.random() * w;
        const cy = h * 0.25 + Math.random() * h * 0.5;
        ctx.beginPath();
        ctx.arc(cx, cy, 30 + Math.random() * 50, 0, Math.PI * 2);
        ctx.fill();
      }

      // Polar Ice Caps
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h * 0.08);
      ctx.fillRect(0, h * 0.92, w, h * 0.08);
    } else if (type === 'earth_clouds') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0)';
      ctx.fillRect(0, 0, w, h);

      // Swirling Cloud Bands
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      for (let i = 0; i < 180; i++) {
        const cx = Math.random() * w;
        const cy = Math.random() * h;
        const rx = 40 + Math.random() * 160;
        const ry = 10 + Math.random() * 40;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0.15, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (type === 'jupiter') {
      // Banded Gas Atmospheric stripes
      const numBands = 60;
      const bandHeight = h / numBands;
      for (let i = 0; i < numBands; i++) {
        const y = i * bandHeight;
        const isWarm = i % 2 === 0;
        const r = isWarm ? 190 + Math.sin(i) * 30 : 150 + Math.cos(i) * 20;
        const g = isWarm ? 130 + Math.sin(i) * 20 : 100 + Math.cos(i) * 15;
        const b = isWarm ? 85 + Math.sin(i) * 15 : 65 + Math.cos(i) * 10;
        ctx.fillStyle = `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
        ctx.fillRect(0, y, w, bandHeight);
      }

      // Great Red Spot Oval Storm
      ctx.fillStyle = '#a63a23';
      ctx.beginPath();
      ctx.ellipse(w * 0.65, h * 0.62, 110, 60, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#d45b40';
      ctx.beginPath();
      ctx.ellipse(w * 0.65, h * 0.62, 70, 38, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (type === 'saturn') {
      // Golden yellow gas bands
      const numBands = 50;
      const bandHeight = h / numBands;
      for (let i = 0; i < numBands; i++) {
        const y = i * bandHeight;
        const v = 170 + Math.sin(i * 0.4) * 45;
        ctx.fillStyle = `rgb(${Math.floor(v * 1.1)}, ${Math.floor(v * 0.95)}, ${Math.floor(v * 0.72)})`;
        ctx.fillRect(0, y, w, bandHeight);
      }
    } else if (type === 'mars') {
      ctx.fillStyle = '#b34728';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#7a2814';
      for (let i = 0; i < 60; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        ctx.beginPath();
        ctx.arc(x, y, 40 + Math.random() * 80, 0, Math.PI * 2);
        ctx.fill();
      }
      // Polar Ice Caps
      ctx.fillStyle = '#f5e4db';
      ctx.fillRect(0, 0, w, h * 0.05);
      ctx.fillRect(0, h * 0.95, w, h * 0.05);
    } else if (type === 'moon' || type === 'mercury') {
      ctx.fillStyle = '#888888';
      ctx.fillRect(0, 0, w, h);
      // Impact craters
      for (let i = 0; i < 150; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const rad = 5 + Math.random() * 25;
        ctx.fillStyle = '#555555';
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#aaaaaa';
        ctx.beginPath();
        ctx.arc(x - 2, y - 2, rad * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // Default Smooth Gradient for Ice Giants (Uranus / Neptune)
      const baseColor = type === 'neptune' ? '#2255dd' : '#68bcc9';
      ctx.fillStyle = baseColor;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      for (let i = 0; i < 20; i++) {
        ctx.fillRect(0, Math.random() * h, w, 8 + Math.random() * 20);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  /**
   * Generates a 1024x1024 Saturn Ring alpha/color map
   */
  static generateSaturnRingTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
    grad.addColorStop(0.0, 'rgba(0, 0, 0, 0)');
    grad.addColorStop(0.15, 'rgba(180, 160, 130, 0.4)');
    grad.addColorStop(0.35, 'rgba(220, 200, 165, 0.85)');
    grad.addColorStop(0.5, 'rgba(40, 30, 20, 0.15)'); // Cassini Division gap!
    grad.addColorStop(0.55, 'rgba(210, 190, 155, 0.9)');
    grad.addColorStop(0.85, 'rgba(160, 140, 110, 0.5)');
    grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }
}

// ==============================================================================
// 3. MAIN APPLICATION ENGINE
// ==============================================================================
class HeliosSpaceApplication {
  constructor() {
    this.container = document.getElementById('canvas-container');
    this.planets = new Map();
    this.moons = [];
    this.satellites = [];
    this.orbitLines = [];
    this.labels = [];

    // Simulation Clock & Speed
    this.timeScale = 1.0;
    this.simulationDays = 0.0;
    this.isPaused = false;
    this.clock = new THREE.Clock();

    // Interaction & Camera Target State
    this.focusedObject = null;
    this.targetCameraPosition = new THREE.Vector3();
    this.targetLookAt = new THREE.Vector3();
    this.isTransitioningCamera = false;
    this.isAutoTourActive = false;
    this.autoTourIndex = 0;
    this.autoTourTimer = 0.0;

    // Raycasting
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-999, -999);
    this.interactiveObjects = [];
    this.hoveredObject = null;

    // Texture Loader with procedural fallback tracking
    this.textureLoader = new THREE.TextureLoader();

    this.initThree();
    this.initLights();
    this.initDeepSkyMilkyWay();
    this.initSun();
    this.initPlanetsAndMoons();
    this.initArtificialSatellites();
    this.initUIEvents();
    this.fetchBackendTelemetry();

    // Start Animation Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);

    // Hide Splash Loader
    setTimeout(() => {
      const loader = document.getElementById('loading-screen');
      if (loader) loader.classList.add('fade-out');
    }, 700);
  }

  // ----------------------------------------------------------------------------
  // Three.js Scene, Camera, High-Precision WebGL Renderer
  // ----------------------------------------------------------------------------
  initThree() {
    this.scene = new THREE.Scene();

    // Camera setup with high dynamic range for astronomical scales
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      50000
    );
    this.camera.position.set(0, 85, 210);

    // Renderer configured for high-res displays & zero z-fighting
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      logarithmicDepthBuffer: true // Crucial for rendering satellites next to planets
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.container.appendChild(this.renderer.domElement);

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxDistance = 2500;
    this.controls.minDistance = 2.5;

    // Window Resize Handler
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  // ----------------------------------------------------------------------------
  // Lighting (Sunlight Point Light & Deep Space Ambient)
  // ----------------------------------------------------------------------------
  initLights() {
    // The Sun is an omnidirectional light source casting dramatic planetary shadows
    this.sunLight = new THREE.PointLight(0xffffff, 2.5, 0, 0);
    this.sunLight.position.set(0, 0, 0);
    this.scene.add(this.sunLight);

    // Subtle cosmic ambient light so night sides and atmospheric details are beautifully visible
    const ambientLight = new THREE.AmbientLight(0x283854, 0.85);
    this.scene.add(ambientLight);
  }

  // ----------------------------------------------------------------------------
  // High-Resolution Milky Way Galaxy Background & 20,000 Cosmic Particle Field
  // ----------------------------------------------------------------------------
  initDeepSkyMilkyWay() {
    // 1. Equirectangular Skydome
    const skydomeGeo = new THREE.SphereGeometry(15000, 64, 32);
    const skydomeMat = new THREE.MeshBasicMaterial({
      side: THREE.BackSide,
      color: 0x070c18
    });
    const skydome = new THREE.Mesh(skydomeGeo, skydomeMat);
    this.scene.add(skydome);

    // Attempt loading custom high-res Milky Way equirectangular texture if user provides it
    this.textureLoader.load(
      'textures/milkyway.jpg',
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        skydomeMat.map = texture;
        skydomeMat.color.setHex(0xffffff);
        skydomeMat.needsUpdate = true;
      },
      undefined,
      () => {
        // Fallback: Elegant deep space nebula backdrop
      }
    );

    // 2. Multi-tier High-Resolution Star Particle Cloud (20,000 Stars)
    const starCount = 20000;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    // Star Spectral Color Palette (O, B, A, F, G, K, M)
    const spectralTypes = [
      new THREE.Color('#9bb0ff'), // Blue
      new THREE.Color('#bbccff'), // Blue-white
      new THREE.Color('#f8f9ff'), // White
      new THREE.Color('#ffffed'), // Yellow-white
      new THREE.Color('#ffd2a1'), // Orange
      new THREE.Color('#ffaa66')  // Red giant
    ];

    for (let i = 0; i < starCount; i++) {
      // Spherical distribution around outer solar system
      const radius = 3000 + Math.random() * 8000;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = (radius * Math.sin(phi) * Math.sin(theta)) * 0.45; // Galactic disk compression
      starPositions[i * 3 + 2] = radius * Math.cos(phi);

      const color = spectralTypes[Math.floor(Math.random() * spectralTypes.length)];
      starColors[i * 3] = color.r;
      starColors[i * 3 + 1] = color.g;
      starColors[i * 3 + 2] = color.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });

    const starPoints = new THREE.Points(starGeo, starMat);
    this.scene.add(starPoints);
  }

  // ----------------------------------------------------------------------------
  // The Sun: Glowing Core, Pulsing Shader Corona & Outer Flare Shell
  // ----------------------------------------------------------------------------
  initSun() {
    const sunData = CELESTIAL_CONFIG.sun;
    const sunGeo = new THREE.SphereGeometry(sunData.radius, 64, 64);

    // Load or generate procedural 2K Sun Surface
    const sunTexture = ProceduralTextureEngine.generatePlanetTexture('sun');
    this.textureLoader.load(sunData.textureFile, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      sunMat.map = tex;
      sunMat.needsUpdate = true;
    });

    const sunMat = new THREE.MeshBasicMaterial({
      map: sunTexture,
      color: 0xfff0c4
    });

    this.sunMesh = new THREE.Mesh(sunGeo, sunMat);
    this.sunMesh.userData = { id: 'sun', ...sunData };
    this.scene.add(this.sunMesh);
    this.interactiveObjects.push(this.sunMesh);

    // Outer Glowing Corona Atmospheric Shell (Additive Blending)
    const coronaGeo = new THREE.SphereGeometry(sunData.radius * 1.28, 48, 48);
    const coronaMat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        uniform float time;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
          vec3 coronaColor = mix(vec3(1.0, 0.7, 0.1), vec3(1.0, 0.3, 0.05), intensity * 0.8);
          gl_FragColor = vec4(coronaColor, intensity * 0.85);
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });

    this.sunCorona = new THREE.Mesh(coronaGeo, coronaMat);
    this.sunMesh.add(this.sunCorona);
  }

  // ----------------------------------------------------------------------------
  // Planets, Realistic Orbit Lines & Natural Moons
  // ----------------------------------------------------------------------------
  initPlanetsAndMoons() {
    const planetKeys = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];

    planetKeys.forEach((key) => {
      const config = CELESTIAL_CONFIG[key];
      const distance = config.a_au * DISTANCE_SCALE;

      // 1. Orbital Ellipse Curve & Visualization Line
      const orbitCurve = new THREE.EllipseCurve(
        0, 0,
        distance, distance * Math.sqrt(1 - config.eccentricity * config.eccentricity),
        0, 2 * Math.PI,
        false,
        0
      );
      const points = orbitCurve.getPoints(128);
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(
        points.map(p => new THREE.Vector3(p.x, 0, p.y))
      );

      // Rotate orbit for planetary inclination
      orbitGeo.rotateX(THREE.MathUtils.degToRad(config.inclinationDeg));

      const orbitMat = new THREE.LineBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.18
      });
      const orbitLine = new THREE.Line(orbitGeo, orbitMat);
      this.scene.add(orbitLine);
      this.orbitLines.push(orbitLine);

      // 2. Planet Mesh
      const planetGeo = new THREE.SphereGeometry(config.radius * PLANET_SIZE_SCALE, 64, 64);
      const proceduralTex = ProceduralTextureEngine.generatePlanetTexture(key);

      const planetMat = new THREE.MeshStandardMaterial({
        map: proceduralTex,
        roughness: 0.8,
        metalness: 0.1
      });

      // Attempt loading external high-res texture file
      this.textureLoader.load(config.textureFile, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        planetMat.map = tex;
        planetMat.needsUpdate = true;
      });

      const planetMesh = new THREE.Mesh(planetGeo, planetMat);
      if (config.axialTiltDeg) {
        planetMesh.rotation.z = THREE.MathUtils.degToRad(config.axialTiltDeg);
      }
      planetMesh.userData = { id: key, name: config.name, config, distance, radius: config.radius };

      this.scene.add(planetMesh);
      this.planets.set(key, planetMesh);
      this.interactiveObjects.push(planetMesh);

      // Special Layer: Earth Clouds & Atmosphere
      if (key === 'earth') {
        const cloudGeo = new THREE.SphereGeometry(config.radius * 1.025, 64, 64);
        const cloudTex = ProceduralTextureEngine.generatePlanetTexture('earth_clouds');
        const cloudMat = new THREE.MeshStandardMaterial({
          map: cloudTex,
          transparent: true,
          opacity: 0.55,
          blending: THREE.NormalBlending
        });

        this.earthClouds = new THREE.Mesh(cloudGeo, cloudMat);
        planetMesh.add(this.earthClouds);

        // Natural Satellite: Moon (Luna)
        this.createMoon({
          name: 'Moon',
          parent: planetMesh,
          radius: 0.42,
          distance: 3.8,
          speed: 0.035,
          color: 0xbbbbbb,
          type: 'moon'
        });
      }

      // Special Layer: Saturn's Rings
      if (key === 'saturn') {
        const innerRadius = config.radius * 1.45;
        const outerRadius = config.radius * 2.8;
        const ringGeo = new THREE.RingGeometry(innerRadius, outerRadius, 128);

        // Fix ring texture coordinates so mapping runs radially
        const pos = ringGeo.attributes.position;
        const v3 = new THREE.Vector3();
        for (let i = 0; i < pos.count; i++) {
          v3.fromBufferAttribute(pos, i);
          ringGeo.attributes.uv.setXY(i, (v3.length() - innerRadius) / (outerRadius - innerRadius), 0);
        }

        const ringMat = new THREE.MeshBasicMaterial({
          map: ProceduralTextureEngine.generateSaturnRingTexture(),
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.85
        });

        const saturnRings = new THREE.Mesh(ringGeo, ringMat);
        saturnRings.rotation.x = Math.PI / 2;
        planetMesh.add(saturnRings);

        // Saturn Moon: Titan
        this.createMoon({
          name: 'Titan',
          parent: planetMesh,
          radius: 0.55,
          distance: 8.5,
          speed: 0.02,
          color: 0xd4a359
        });
      }

      // Jupiter Galilean Moons (Io, Europa, Ganymede, Callisto)
      if (key === 'jupiter') {
        const galileanMoons = [
          { name: 'Io', radius: 0.38, distance: 6.2, speed: 0.05, color: 0xdfc136 },
          { name: 'Europa', radius: 0.35, distance: 7.8, speed: 0.038, color: 0xccc3ae },
          { name: 'Ganymede', radius: 0.52, distance: 9.8, speed: 0.026, color: 0x938575 },
          { name: 'Callisto', radius: 0.48, distance: 12.2, speed: 0.018, color: 0x6e6357 }
        ];
        galileanMoons.forEach(m => this.createMoon({ ...m, parent: planetMesh }));
      }
    });
  }

  createMoon({ name, parent, radius, distance, speed, color, type = 'moon' }) {
    const moonGeo = new THREE.SphereGeometry(radius, 32, 32);
    const moonMat = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.9
    });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonMesh.userData = {
      id: name.toLowerCase(),
      name,
      category: 'NATURAL SATELLITE',
      parentName: parent.userData.id,
      distance: distance * MOON_DISTANCE_SCALE,
      speed,
      angle: Math.random() * Math.PI * 2
    };

    this.scene.add(moonMesh);
    this.moons.push({ mesh: moonMesh, parent });
    this.interactiveObjects.push(moonMesh);
  }

  // ----------------------------------------------------------------------------
  // Artificial Satellites: ISS, Hubble, Starlink Swarm, GEO Belt
  // ----------------------------------------------------------------------------
  initArtificialSatellites() {
    this.earthMesh = this.planets.get('earth');
    if (!this.earthMesh) return;

    // 1. High-Detail ISS Composite 3D Model
    this.issGroup = new THREE.Group();
    const issBodyMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.8, roughness: 0.2 });
    const issSolarMat = new THREE.MeshStandardMaterial({ color: 0x114488, metalness: 0.9, roughness: 0.1 });

    // Central pressurized modules
    const bodyCylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.28, 16), issBodyMat);
    bodyCylinder.rotation.z = Math.PI / 2;
    this.issGroup.add(bodyCylinder);

    // Solar array wings
    const solarWingGeo = new THREE.BoxGeometry(0.38, 0.005, 0.12);
    const leftWing = new THREE.Mesh(solarWingGeo, issSolarMat);
    leftWing.position.x = -0.26;
    const rightWing = new THREE.Mesh(solarWingGeo, issSolarMat);
    rightWing.position.x = 0.26;
    this.issGroup.add(leftWing, rightWing);

    // Blinking navigation beacon
    const beaconLight = new THREE.PointLight(0x00f0ff, 1.5, 2);
    this.issGroup.add(beaconLight);

    this.issGroup.userData = {
      id: 'iss',
      name: 'International Space Station (ISS)',
      category: 'ARTIFICIAL SATELLITE (LEO)',
      altitude_km: 420,
      speed_kms: 7.66,
      orbitRadius: 2.1,
      inclination: THREE.MathUtils.degToRad(51.6),
      speed: 0.04,
      angle: 0.0
    };
    this.scene.add(this.issGroup);
    this.satellites.push(this.issGroup);
    this.interactiveObjects.push(bodyCylinder); // Make clickable
    bodyCylinder.userData = this.issGroup.userData;

    // 2. Starlink Swarm Constellation (Particle Mesh in LEO)
    const starlinkCount = 200;
    const starlinkGeo = new THREE.BufferGeometry();
    const starlinkPositions = new Float32Array(starlinkCount * 3);

    for (let i = 0; i < starlinkCount; i++) {
      const alt = 2.25 + Math.random() * 0.2;
      const theta = Math.random() * Math.PI * 2;
      const inc = THREE.MathUtils.degToRad(53.0 + (Math.random() - 0.5) * 10);
      starlinkPositions[i * 3] = alt * Math.cos(theta);
      starlinkPositions[i * 3 + 1] = alt * Math.sin(theta) * Math.sin(inc);
      starlinkPositions[i * 3 + 2] = alt * Math.sin(theta) * Math.cos(inc);
    }
    starlinkGeo.setAttribute('position', new THREE.BufferAttribute(starlinkPositions, 3));

    // Circular particle texture for crisp pinprick satellites
    const satCanvas = document.createElement('canvas');
    satCanvas.width = 16;
    satCanvas.height = 16;
    const sCtx = satCanvas.getContext('2d');
    sCtx.beginPath();
    sCtx.arc(8, 8, 6, 0, Math.PI * 2);
    sCtx.fillStyle = '#00f0ff';
    sCtx.fill();
    const satParticleTex = new THREE.CanvasTexture(satCanvas);

    const starlinkMat = new THREE.PointsMaterial({
      map: satParticleTex,
      color: 0x06d6a0,
      size: 4.0,
      sizeAttenuation: false, // Crisp constant screen pixels
      transparent: true,
      opacity: 0.95
    });
    this.starlinkMesh = new THREE.Points(starlinkGeo, starlinkMat);
    this.scene.add(this.starlinkMesh);

    // 3. Geostationary Communication Belt (GEO Ring at 35,786 km)
    const geoRingGeo = new THREE.RingGeometry(3.6, 3.65, 64);
    const geoRingMat = new THREE.MeshBasicMaterial({
      color: 0xffb703,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35
    });
    this.geoRing = new THREE.Mesh(geoRingGeo, geoRingMat);
    this.geoRing.rotation.x = Math.PI / 2;
    this.scene.add(this.geoRing);
  }

  // ----------------------------------------------------------------------------
  // Raycasting & Camera Tweening Interactivity
  // ----------------------------------------------------------------------------
  initUIEvents() {
    const raycaster = this.raycaster;
    const mouse = this.mouse;
    const reticle = document.getElementById('target-reticle');
    const reticleLabel = document.getElementById('reticle-label');

    // Pointer Move / Hover
    window.addEventListener('pointermove', (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, this.camera);
      const intersects = raycaster.intersectObjects(this.interactiveObjects, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const data = hit.userData;
        if (data && data.name) {
          reticle.style.display = 'block';
          reticle.style.left = `${e.clientX}px`;
          reticle.style.top = `${e.clientY}px`;
          reticleLabel.textContent = data.name.toUpperCase();
          document.body.style.cursor = 'pointer';
        }
      } else {
        reticle.style.display = 'none';
        document.body.style.cursor = 'default';
      }
    });

    // Pointer Click: Focus Celestial Object & Open Telemetry Card
    window.addEventListener('pointerdown', (e) => {
      // Ignore clicks on HUD elements
      if (e.target.closest('.hud-header, .telemetry-card, .hud-footer')) return;

      raycaster.setFromCamera(mouse, this.camera);
      const intersects = raycaster.intersectObjects(this.interactiveObjects, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        this.focusOnObject(hit.userData.id || hit.userData.name);
      }
    });

    // Quick Nav Pills
    document.querySelectorAll('.nav-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.focusOnObject(btn.dataset.target);
      });
    });

    // Card Actions
    document.getElementById('btn-focus-target')?.addEventListener('click', () => {
      if (this.focusedObject) this.zoomCloserToTarget();
    });

    document.getElementById('btn-reset-view')?.addEventListener('click', () => {
      this.resetOverview();
    });

    document.getElementById('close-card-btn')?.addEventListener('click', () => {
      document.getElementById('telemetry-card').classList.add('collapsed');
    });

    // Time Control Buttons
    document.querySelectorAll('.time-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const speed = parseFloat(btn.dataset.speed);
        if (speed === 0) {
          this.isPaused = !this.isPaused;
        } else {
          this.isPaused = false;
          this.timeScale = speed;
        }
      });
    });

    // Radar Overlay Toggles
    document.getElementById('toggle-orbits')?.addEventListener('change', (e) => {
      this.orbitLines.forEach(l => (l.visible = e.target.checked));
    });

    document.getElementById('toggle-satellites')?.addEventListener('change', (e) => {
      this.satellites.forEach(s => (s.visible = e.target.checked));
      if (this.starlinkMesh) this.starlinkMesh.visible = e.target.checked;
      if (this.geoRing) this.geoRing.visible = e.target.checked;
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
  // Camera Focusing & Smooth Interpolation
  // ----------------------------------------------------------------------------
  focusOnObject(targetId) {
    if (!targetId) return;
    const id = targetId.toLowerCase();

    let targetMesh = null;
    if (id === 'sun') targetMesh = this.sunMesh;
    else if (this.planets.has(id)) targetMesh = this.planets.get(id);
    else if (id === 'iss') targetMesh = this.issGroup;
    else {
      const moonMatch = this.moons.find(m => m.mesh.userData.id === id);
      if (moonMatch) targetMesh = moonMatch.mesh;
    }

    if (!targetMesh) return;

    this.focusedObject = targetMesh;
    this.isTransitioningCamera = true;

    // Open HUD Card and load telemetry
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
      targetPos.x + radius * 2.8,
      targetPos.y + radius * 1.5,
      targetPos.z + radius * 3.2
    );
    this.controls.target.copy(targetPos);
  }

  resetOverview() {
    this.focusedObject = null;
    this.isTransitioningCamera = true;
    this.targetCameraPosition.set(0, 85, 210);
    this.targetLookAt.set(0, 0, 0);

    document.querySelectorAll('.nav-pill').forEach(b => b.classList.remove('active'));
    document.querySelector('.nav-pill[data-target="sun"]')?.classList.add('active');
  }

  cycleAutoTour() {
    const tourTargets = ['sun', 'earth', 'iss', 'mars', 'jupiter', 'saturn'];
    const nextTarget = tourTargets[this.autoTourIndex % tourTargets.length];
    this.autoTourIndex++;
    this.focusOnObject(nextTarget);
  }

  // ----------------------------------------------------------------------------
  // Backend Ephemeris & Telemetry Synchronization
  // ----------------------------------------------------------------------------
  async fetchBackendTelemetry() {
    const statusDot = document.getElementById('backend-status-dot');
    const statusText = document.getElementById('backend-status-text');

    try {
      const response = await fetch('/api/health');
      if (response.ok) {
        if (statusDot) statusDot.style.background = '#06d6a0';
        if (statusText) statusText.textContent = 'EPHEMERIS ONLINE';

        // Fetch detailed planetary and satellite ephemeris
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
      }
    } catch {
      // Backend offline: engine seamlessly continues in standalone mode
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

    // Populate data from either backend ephemeris or local presets
    const id = (data.id || (data.name ? data.name.toLowerCase() : '')).toLowerCase();
    const ephem = this.backendPlanetData?.find(p => p.id === id);

    // Direct name resolution with auto-capitalization fallback
    let displayName = ephem?.name || data.name;
    if (!displayName && id) {
      displayName = id.charAt(0).toUpperCase() + id.slice(1);
    }

    if (nameEl) nameEl.textContent = displayName || 'Celestial Object';
    if (subEl) subEl.textContent = ephem?.type || data.category || 'Solar System Object';
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
    } else if (id === 'iss') {
      if (radEl) radEl.textContent = '109 m (Wingspan)';
      if (tempEl) tempEl.textContent = '-157 °C to +121 °C';
      if (distEl) distEl.textContent = '1.00 AU (Earth Orbit)';
      if (speedEl) speedEl.textContent = '7.66 km/s (27,600 km/h)';
      if (massEl) massEl.textContent = '444,000 kg';
      if (rotEl) rotEl.textContent = '92.8 min / orbit';
      if (compEl) compEl.textContent = 'Microgravity Science Lab, Inhabited by 7 astronauts';
      if (factsEl) factsEl.textContent = 'Travels around the Earth once every 90 minutes, seeing 16 sunrises and sunsets every day.';
    }
  }

  // ----------------------------------------------------------------------------
  // Animation Frame Loop
  // ----------------------------------------------------------------------------
  animate() {
    requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();
    const effectiveDelta = this.isPaused ? 0 : delta * this.timeScale;
    this.simulationDays += effectiveDelta * 0.8;

    // 1. Sun Corona Pulsation & Rotation
    if (this.sunMesh) {
      this.sunMesh.rotation.y += 0.001;
      if (this.sunCorona) {
        this.sunCorona.material.uniforms.time.value += delta;
      }
    }

    // 2. Planets Orbital Propagation & Axial Rotation
    this.planets.forEach((mesh, key) => {
      const config = mesh.userData.config;
      const distance = mesh.userData.distance;

      // Heliocentric orbit progression based on Keplerian period
      const orbitalSpeed = (Math.PI * 2) / (config.orbitalPeriodDays * 0.15);
      const angle = this.simulationDays * orbitalSpeed;

      const x = Math.cos(angle) * distance;
      const z = Math.sin(angle) * distance;
      const y = Math.sin(angle) * distance * Math.sin(THREE.MathUtils.degToRad(config.inclinationDeg));

      mesh.position.set(x, y, z);
      mesh.rotation.y += config.rotationSpeed * (this.isPaused ? 0.1 : 1.0);
    });

    // Earth Clouds rotation offset
    if (this.earthClouds) {
      this.earthClouds.rotation.y += 0.0025;
    }

    // 3. Natural Moons Orbiting Parents
    this.moons.forEach(({ mesh, parent }) => {
      const data = mesh.userData;
      data.angle += data.speed * effectiveDelta * 4.0;
      mesh.position.set(
        parent.position.x + Math.cos(data.angle) * data.distance,
        parent.position.y,
        parent.position.z + Math.sin(data.angle) * data.distance
      );
    });

    // 4. Artificial Satellites (ISS & Starlink) relative to Earth
    if (this.earthMesh) {
      const earthPos = this.earthMesh.position;

      // ISS orbit progression
      if (this.issGroup) {
        const issData = this.issGroup.userData;
        issData.angle += issData.speed * (this.isPaused ? 0 : 1.0);

        const r = issData.orbitRadius;
        this.issGroup.position.set(
          earthPos.x + r * Math.cos(issData.angle),
          earthPos.y + r * Math.sin(issData.angle) * Math.sin(issData.inclination),
          earthPos.z + r * Math.sin(issData.angle) * Math.cos(issData.inclination)
        );
        this.issGroup.rotation.y += 0.02;
      }

      // Starlink swarm locked to Earth position
      if (this.starlinkMesh) {
        this.starlinkMesh.position.copy(earthPos);
        this.starlinkMesh.rotation.y += 0.01;
      }

      // Geostationary belt locked to Earth position
      if (this.geoRing) {
        this.geoRing.position.copy(earthPos);
      }
    }

    // 5. Camera Tracking & Interpolation
    if (this.focusedObject) {
      const targetPos = new THREE.Vector3();
      this.focusedObject.getWorldPosition(targetPos);

      if (this.isTransitioningCamera) {
        const radius = this.focusedObject.userData.radius || 2.0;
        // Calculate camera position oriented towards the sunlit day side
        const sunToPlanet = targetPos.clone().normalize();
        if (sunToPlanet.lengthSq() < 0.001) {
          sunToPlanet.set(0, 0, 1);
        }
        // Place camera diagonally between the sun and the planet for cinematic lighting
        const offset = sunToPlanet.clone().multiplyScalar(-radius * 3.6);
        offset.y += radius * 1.5;
        offset.x += radius * 1.2;
        const desiredCamPos = targetPos.clone().add(offset);

        this.camera.position.lerp(desiredCamPos, 0.08);
        this.controls.target.lerp(targetPos, 0.08);

        if (this.camera.position.distanceTo(desiredCamPos) < 0.2) {
          this.isTransitioningCamera = false;
        }
      } else {
        // Continuous lockstep tracking as the planet moves in its orbit
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

    // 6. Cinematic Auto Tour Progression
    if (this.isAutoTourActive) {
      this.autoTourTimer += delta;
      if (this.autoTourTimer > 9.0) {
        this.autoTourTimer = 0.0;
        this.cycleAutoTour();
      }
    }

    // 7. Update Mission Clock UTC
    const clockEl = document.getElementById('mission-clock');
    if (clockEl) {
      const now = new Date();
      clockEl.textContent = `UTC ${now.toUTCString().slice(17, 25)}`;
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

// ==============================================================================
// 4. INITIALIZE APPLICATION ON DOM READY
// ==============================================================================
window.addEventListener('DOMContentLoaded', () => {
  new HeliosSpaceApplication();
});
