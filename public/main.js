/**
 * HELIOS 3D — MILKY WAY TO SOLAR SYSTEM & SATELLITE SIMULATOR
 * Designed & Developed by Asadullahil Galib
 *
 * FEATURING:
 * - 3D Logarithmic Milky Way Spiral Galaxy (55,000 stars & galactic core)
 * - Seamless Cosmic Scale Zoom (Galaxy -> Solar System -> Planetary Orbits -> Satellites)
 * - Ultra-high-resolution original NASA/ESA planetary texture maps
 * - Artificial Satellite Fleet: ISS, JWST (L2), Starlink, GPS, GEO Belt, Hubble, NOAA
 * - Real-time geocentric vectors and sub-satellite geographic coordinates (Lat/Lon)
 * - Raycasting, smooth camera tweening, lockstep orbital tracking
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ==============================================================================
// 1. CONFIGURATION & SCALING CONSTANTS
// ==============================================================================

const DISTANCE_SCALE = 38.0;     // AU to Scene Units multiplier
const PLANET_SIZE_SCALE = 1.0;   // Scaling factor for planet radii
const MOON_DISTANCE_SCALE = 4.2; // Scaling factor for moon orbit radii

// Initial Galactic viewpoint (Far outer cosmos overlooking the Milky Way)
const INITIAL_GALAXY_POS = new THREE.Vector3(0, 1600, 2400);
const SOLAR_SYSTEM_OVERVIEW_POS = new THREE.Vector3(0, 75, 185);

const CELESTIAL_CONFIG = {
  sun: {
    id: 'sun',
    name: 'The Sun',
    category: 'STAR / G2V',
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
    a_au: 2.85,
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
// 2. PROCEDURAL TEXTURE GENERATOR (ROBUST BACKUP SYSTEM)
// ==============================================================================
class ProceduralTextureEngine {
  static generatePlanetTexture(type) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;

    if (type === 'sun') {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#ff4800');
      grad.addColorStop(0.5, '#ffaa00');
      grad.addColorStop(1, '#ff6600');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    } else {
      ctx.fillStyle = type === 'neptune' ? '#2255dd' : '#68bcc9';
      ctx.fillRect(0, 0, w, h);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  static generateSaturnRingTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
    grad.addColorStop(0.0, 'rgba(0, 0, 0, 0)');
    grad.addColorStop(0.2, 'rgba(195, 175, 145, 0.6)');
    grad.addColorStop(0.5, 'rgba(40, 30, 20, 0.05)'); // Cassini Division
    grad.addColorStop(0.55, 'rgba(215, 195, 160, 0.9)');
    grad.addColorStop(0.85, 'rgba(165, 145, 115, 0.5)');
    grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }
}

// ==============================================================================
// 3. MAIN SIMULATION ENGINE
// ==============================================================================
class HeliosCosmicApplication {
  constructor() {
    this.container = document.getElementById('canvas-container');
    this.planets = new Map();
    this.moons = [];
    this.satellites = [];
    this.orbitLines = [];

    // Scale State
    this.currentScaleLevel = 'GALAXY'; // 'GALAXY', 'INTERSTELLAR', 'SOLAR', 'PROXIMITY'
    this.timeScale = 1.0;
    this.simulationDays = 0.0;
    this.isPaused = false;
    this.clock = new THREE.Clock();

    // Camera & Tweening
    this.focusedObject = null;
    this.targetCameraPosition = INITIAL_GALAXY_POS.clone();
    this.targetLookAt = new THREE.Vector3(0, 0, 0);
    this.isTransitioningCamera = false;
    this.isAutoTourActive = false;
    this.autoTourIndex = 0;
    this.autoTourTimer = 0.0;

    // Raycasting
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-999, -999);
    this.interactiveObjects = [];
    this.textureLoader = new THREE.TextureLoader();

    this.initThree();
    this.initLights();
    this.initDeepSkyMilkyWay();
    this.initMilkyWaySpiralGalaxy(); // 55,000 Particle Spiral Galaxy
    this.initSun();
    this.initPlanetsAndMoons();
    this.initArtificialSatellites();
    this.initUIEvents();
    this.fetchBackendTelemetry();

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);

    setTimeout(() => {
      const loader = document.getElementById('loading-screen');
      if (loader) loader.classList.add('fade-out');
    }, 600);
  }

  // ----------------------------------------------------------------------------
  // Three.js Scene, Camera, Renderer
  // ----------------------------------------------------------------------------
  initThree() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      80000
    );
    // Start at Milky Way Galaxy scale!
    this.camera.position.copy(INITIAL_GALAXY_POS);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      logarithmicDepthBuffer: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxDistance = 6000;
    this.controls.minDistance = 2.0;

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  // ----------------------------------------------------------------------------
  // Lighting
  // ----------------------------------------------------------------------------
  initLights() {
    this.sunLight = new THREE.PointLight(0xffffff, 2.8, 0, 0);
    this.sunLight.position.set(0, 0, 0);
    this.scene.add(this.sunLight);

    const ambientLight = new THREE.AmbientLight(0x283854, 0.95);
    this.scene.add(ambientLight);
  }

  // ----------------------------------------------------------------------------
  // Deep Sky Skydome & Outer Starfield
  // ----------------------------------------------------------------------------
  initDeepSkyMilkyWay() {
    const skydomeGeo = new THREE.SphereGeometry(30000, 64, 32);
    const skydomeMat = new THREE.MeshBasicMaterial({ side: THREE.BackSide, color: 0x050812 });
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
  // 3D Logarithmic Milky Way Spiral Galaxy Model (55,000 Particle Arms)
  // ----------------------------------------------------------------------------
  initMilkyWaySpiralGalaxy() {
    this.galaxyGroup = new THREE.Group();

    const starCount = 55000;
    const arms = 4; // 4 Logarithmic Spiral Arms: Perseus, Scutum-Centaurus, Sagittarius, Orion
    const maxRadius = 1400;

    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    // Galactic Core Bright Color (Yellow-White / Gold)
    const colorCore = new THREE.Color('#fff2cc');
    // Spiral Arm Young Stellar Color (Electric Blue / Cyan)
    const colorArm = new THREE.Color('#38bdf8');
    // Outer Halo / Dust Color (Violet / Magenta)
    const colorOuter = new THREE.Color('#c084fc');

    for (let i = 0; i < starCount; i++) {
      // Radial distribution with density concentrated towards galactic center
      const r = Math.pow(Math.random(), 2.2) * maxRadius;
      const armIndex = i % arms;
      const armAngle = (armIndex / arms) * Math.PI * 2;
      
      // Logarithmic spiral progression: theta = log(r) / b
      const spiralTheta = Math.log(r + 1.0) * 1.8 + armAngle;

      // Random dispersion around the arm width
      const spreadX = (Math.random() - 0.5) * (r * 0.22 + 15);
      const spreadY = (Math.random() - 0.5) * (r * 0.08 + 8) * (1.0 - r / maxRadius);
      const spreadZ = (Math.random() - 0.5) * (r * 0.22 + 15);

      const x = Math.cos(spiralTheta) * r + spreadX;
      const y = spreadY;
      const z = Math.sin(spiralTheta) * r + spreadZ;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color gradient from bright warm core to electric blue and outer nebula violet
      const mixedColor = colorCore.clone();
      const progress = r / maxRadius;
      if (progress < 0.35) {
        mixedColor.lerp(colorArm, progress / 0.35);
      } else {
        mixedColor.copy(colorArm).lerp(colorOuter, (progress - 0.35) / 0.65);
      }

      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    const galaxyGeo = new THREE.BufferGeometry();
    galaxyGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    galaxyGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Circular crisp particle texture
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 16;
    pCanvas.height = 16;
    const pCtx = pCanvas.getContext('2d');
    const grad = pCtx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.4, 'rgba(180, 220, 255, 0.7)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    pCtx.fillStyle = grad;
    pCtx.fillRect(0, 0, 16, 16);

    const galaxyMat = new THREE.PointsMaterial({
      size: 2.2,
      map: new THREE.CanvasTexture(pCanvas),
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.galaxyPoints = new THREE.Points(galaxyGeo, galaxyMat);
    this.galaxyGroup.add(this.galaxyPoints);

    // Galactic Core Supermassive Bulge (Sagittarius A*)
    const coreGeo = new THREE.SphereGeometry(45, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xffeedd,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    this.galaxyCore = new THREE.Mesh(coreGeo, coreMat);
    this.galaxyGroup.add(this.galaxyCore);

    // Orion Arm Marker (Pointing directly to Solar System location)
    const markerGeo = new THREE.RingGeometry(8, 12, 32);
    const markerMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75
    });
    this.solarMarker = new THREE.Mesh(markerGeo, markerMat);
    this.solarMarker.rotation.x = Math.PI / 2;
    this.solarMarker.position.set(0, 0, 0); // Sun is at center
    this.galaxyGroup.add(this.solarMarker);

    this.scene.add(this.galaxyGroup);
  }

  // ----------------------------------------------------------------------------
  // The Sun: Real Texture, Corona Shader, Glow
  // ----------------------------------------------------------------------------
  initSun() {
    const sunData = CELESTIAL_CONFIG.sun;
    const sunGeo = new THREE.SphereGeometry(sunData.radius, 64, 64);

    const sunMat = new THREE.MeshBasicMaterial({
      color: 0xffffff
    });

    // Load authentic high-res texture
    this.textureLoader.load(
      sunData.textureFile,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        sunMat.map = tex;
        sunMat.needsUpdate = true;
      },
      undefined,
      () => {
        sunMat.map = ProceduralTextureEngine.generatePlanetTexture('sun');
        sunMat.needsUpdate = true;
      }
    );

    this.sunMesh = new THREE.Mesh(sunGeo, sunMat);
    this.sunMesh.userData = { id: 'sun', ...sunData };
    this.scene.add(this.sunMesh);
    this.interactiveObjects.push(this.sunMesh);

    // Dynamic Corona Glow Shell
    const coronaGeo = new THREE.SphereGeometry(sunData.radius * 1.3, 48, 48);
    const coronaMat = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 } },
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
          float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.4);
          vec3 coronaColor = mix(vec3(1.0, 0.75, 0.2), vec3(1.0, 0.3, 0.05), intensity * 0.8);
          gl_FragColor = vec4(coronaColor, intensity * 0.9);
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
  // Planets, Moons & High-Resolution Textures
  // ----------------------------------------------------------------------------
  initPlanetsAndMoons() {
    const planetKeys = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];

    planetKeys.forEach((key) => {
      const config = CELESTIAL_CONFIG[key];
      const distance = config.a_au * DISTANCE_SCALE;

      // Orbit Ellipse Path
      const orbitCurve = new THREE.EllipseCurve(
        0, 0,
        distance, distance * Math.sqrt(1 - config.eccentricity * config.eccentricity),
        0, 2 * Math.PI, false, 0
      );
      const points = orbitCurve.getPoints(128);
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(p.x, 0, p.y)));
      orbitGeo.rotateX(THREE.MathUtils.degToRad(config.inclinationDeg));
      const orbitLine = new THREE.Line(orbitGeo, new THREE.LineBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.18
      }));
      this.scene.add(orbitLine);
      this.orbitLines.push(orbitLine);

      // Planet Mesh with Authentic High-Res Texture
      const planetGeo = new THREE.SphereGeometry(config.radius * PLANET_SIZE_SCALE, 64, 64);
      const planetMat = new THREE.MeshStandardMaterial({
        roughness: 0.8,
        metalness: 0.1
      });

      this.textureLoader.load(
        config.textureFile,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          planetMat.map = tex;
          planetMat.needsUpdate = true;
        },
        undefined,
        () => {
          planetMat.map = ProceduralTextureEngine.generatePlanetTexture(key);
          planetMat.needsUpdate = true;
        }
      );

      const planetMesh = new THREE.Mesh(planetGeo, planetMat);
      if (config.axialTiltDeg) {
        planetMesh.rotation.z = THREE.MathUtils.degToRad(config.axialTiltDeg);
      }
      planetMesh.userData = { id: key, name: config.name, config, distance, radius: config.radius };

      this.scene.add(planetMesh);
      this.planets.set(key, planetMesh);
      this.interactiveObjects.push(planetMesh);

      // Earth Clouds & Luna (Moon)
      if (key === 'earth') {
        const cloudGeo = new THREE.SphereGeometry(config.radius * 1.025, 64, 64);
        const cloudMat = new THREE.MeshStandardMaterial({
          transparent: true,
          opacity: 0.65,
          blending: THREE.NormalBlending
        });

        this.textureLoader.load(config.cloudsFile, (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          cloudMat.map = tex;
          cloudMat.needsUpdate = true;
        });

        this.earthClouds = new THREE.Mesh(cloudGeo, cloudMat);
        planetMesh.add(this.earthClouds);

        // Natural Moon (Luna) with authentic Moon map
        const moonGeo = new THREE.SphereGeometry(0.42, 32, 32);
        const moonMat = new THREE.MeshStandardMaterial({ roughness: 0.9 });
        this.textureLoader.load('textures/moon.jpg', (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          moonMat.map = tex;
          moonMat.needsUpdate = true;
        });
        const moonMesh = new THREE.Mesh(moonGeo, moonMat);
        moonMesh.userData = {
          id: 'moon',
          name: 'The Moon (Luna)',
          category: 'NATURAL SATELLITE',
          parentName: 'earth',
          distance: 3.8 * MOON_DISTANCE_SCALE,
          speed: 0.035,
          angle: 0
        };
        this.scene.add(moonMesh);
        this.moons.push({ mesh: moonMesh, parent: planetMesh });
        this.interactiveObjects.push(moonMesh);
      }

      // Saturn Ring System & Titan
      if (key === 'saturn') {
        const innerRadius = config.radius * 1.45;
        const outerRadius = config.radius * 2.85;
        const ringGeo = new THREE.RingGeometry(innerRadius, outerRadius, 128);
        const pos = ringGeo.attributes.position;
        const v3 = new THREE.Vector3();
        for (let i = 0; i < pos.count; i++) {
          v3.fromBufferAttribute(pos, i);
          ringGeo.attributes.uv.setXY(i, (v3.length() - innerRadius) / (outerRadius - innerRadius), 0);
        }

        const ringMat = new THREE.MeshBasicMaterial({
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.88
        });

        this.textureLoader.load(
          config.ringsFile,
          (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            ringMat.map = tex;
            ringMat.needsUpdate = true;
          },
          undefined,
          () => {
            ringMat.map = ProceduralTextureEngine.generateSaturnRingTexture();
            ringMat.needsUpdate = true;
          }
        );

        const saturnRings = new THREE.Mesh(ringGeo, ringMat);
        saturnRings.rotation.x = Math.PI / 2;
        planetMesh.add(saturnRings);

        // Saturn Moon: Titan
        this.createGenericMoon({ name: 'Titan', parent: planetMesh, radius: 0.55, distance: 8.5, speed: 0.02, color: 0xd4a359 });
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
      angle: Math.random() * Math.PI * 2
    };
    this.scene.add(moonMesh);
    this.moons.push({ mesh: moonMesh, parent });
    this.interactiveObjects.push(moonMesh);
  }

  // ----------------------------------------------------------------------------
  // Artificial Satellites: ISS, JWST (L2), Hubble, Starlink, GPS, GEO Ring
  // ----------------------------------------------------------------------------
  initArtificialSatellites() {
    this.earthMesh = this.planets.get('earth');
    if (!this.earthMesh) return;

    // 1. ISS (International Space Station)
    this.issGroup = new THREE.Group();
    const issBodyMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.8, roughness: 0.2 });
    const issSolarMat = new THREE.MeshStandardMaterial({ color: 0x114488, metalness: 0.9, roughness: 0.1 });

    const bodyCylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.28, 16), issBodyMat);
    bodyCylinder.rotation.z = Math.PI / 2;
    this.issGroup.add(bodyCylinder);

    const solarWingGeo = new THREE.BoxGeometry(0.38, 0.005, 0.12);
    const leftWing = new THREE.Mesh(solarWingGeo, issSolarMat);
    leftWing.position.x = -0.26;
    const rightWing = new THREE.Mesh(solarWingGeo, issSolarMat);
    rightWing.position.x = 0.26;
    this.issGroup.add(leftWing, rightWing);

    const beaconLight = new THREE.PointLight(0x00f0ff, 1.5, 2);
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

    // 2. JWST (James Webb Space Telescope at Sun-Earth L2 Lagrangian Point)
    this.jwstGroup = new THREE.Group();
    const jwstSunshieldMat = new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.9, roughness: 0.1 });
    const jwstMirrorMat = new THREE.MeshStandardMaterial({ color: 0xffb703, metalness: 0.95, roughness: 0.05 });

    // Hexagonal primary mirror representation
    const mirrorMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.02, 6), jwstMirrorMat);
    mirrorMesh.rotation.x = Math.PI / 2;
    const sunshieldMesh = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.01, 0.22), jwstSunshieldMat);
    this.jwstGroup.add(sunshieldMesh, mirrorMesh);

    this.jwstGroup.userData = {
      id: 'jwst',
      name: 'James Webb Space Telescope (JWST)',
      category: 'DEEP SPACE OBSERVATORY (L2)',
      altitude_km: 1500000,
      speed_kms: 0.20,
      orbitRadius: 6.8, // Sun-Earth L2 representation behind Earth
      inclination: 0.08,
      speed: 0.008,
      angle: 0.0,
      radius: 0.5
    };
    this.scene.add(this.jwstGroup);
    this.satellites.push(this.jwstGroup);
    this.interactiveObjects.push(mirrorMesh);
    mirrorMesh.userData = this.jwstGroup.userData;

    // 3. Hubble Space Telescope (HST)
    this.hstGroup = new THREE.Group();
    const hstBody = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.22, 16), issBodyMat);
    this.hstGroup.add(hstBody);
    this.hstGroup.userData = {
      id: 'hubble',
      name: 'Hubble Space Telescope (HST)',
      category: 'ARTIFICIAL SATELLITE (LEO)',
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

    // 4. Starlink Megaconstellation Swarm (250 Circular Pinprick Satellites)
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

    // 5. GPS Navstar Constellation Ring (MEO at 20,200 km)
    const gpsGeo = new THREE.RingGeometry(3.2, 3.23, 64);
    const gpsMat = new THREE.MeshBasicMaterial({ color: 0x3a86ff, side: THREE.DoubleSide, transparent: true, opacity: 0.4 });
    this.gpsRing = new THREE.Mesh(gpsGeo, gpsMat);
    this.gpsRing.rotation.x = Math.PI / 2;
    this.gpsRing.rotation.y = THREE.MathUtils.degToRad(55.0);
    this.scene.add(this.gpsRing);

    // 6. Geostationary Communication Belt (GEO Ring at 35,786 km)
    const geoRingGeo = new THREE.RingGeometry(4.2, 4.24, 64);
    const geoRingMat = new THREE.MeshBasicMaterial({ color: 0xffb703, side: THREE.DoubleSide, transparent: true, opacity: 0.45 });
    this.geoRing = new THREE.Mesh(geoRingGeo, geoRingMat);
    this.geoRing.rotation.x = Math.PI / 2;
    this.scene.add(this.geoRing);
  }

  // ----------------------------------------------------------------------------
  // UI Events, Raycasting & Smooth Navigation
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

    // Pointer Click on 3D Objects
    window.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.hud-header, .telemetry-card, .hud-footer, .scale-banner, .copyright-tag')) return;

      raycaster.setFromCamera(mouse, this.camera);
      const intersects = raycaster.intersectObjects(this.interactiveObjects, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        this.focusOnObject(hit.userData.id || hit.userData.name);
      }
    });

    // Quick Jump Buttons
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

    // Cosmic Scale Banner Action Button
    document.getElementById('btn-scale-action')?.addEventListener('click', () => {
      if (this.currentScaleLevel === 'GALAXY' || this.currentScaleLevel === 'INTERSTELLAR') {
        this.diveIntoSolarSystem();
      } else {
        this.zoomToGalaxy();
      }
    });

    // Card Actions
    document.getElementById('btn-focus-target')?.addEventListener('click', () => this.zoomCloserToTarget());
    document.getElementById('btn-reset-view')?.addEventListener('click', () => this.diveIntoSolarSystem());
    document.getElementById('close-card-btn')?.addEventListener('click', () => {
      document.getElementById('telemetry-card').classList.add('collapsed');
    });

    // Time Warp Buttons
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

    // Visual Layer Toggles
    document.getElementById('toggle-galaxy')?.addEventListener('change', (e) => {
      if (this.galaxyGroup) this.galaxyGroup.visible = e.target.checked;
    });
    document.getElementById('toggle-orbits')?.addEventListener('change', (e) => {
      this.orbitLines.forEach(l => (l.visible = e.target.checked));
    });
    document.getElementById('toggle-satellites')?.addEventListener('change', (e) => {
      this.satellites.forEach(s => (s.visible = e.target.checked));
      if (this.starlinkMesh) this.starlinkMesh.visible = e.target.checked;
      if (this.geoRing) this.geoRing.visible = e.target.checked;
      if (this.gpsRing) this.gpsRing.visible = e.target.checked;
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
  // Camera Transitions (Milky Way -> Solar System -> Planets)
  // ----------------------------------------------------------------------------
  zoomToGalaxy() {
    this.focusedObject = null;
    this.isTransitioningCamera = true;
    this.targetCameraPosition.copy(INITIAL_GALAXY_POS);
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

    let targetMesh = null;
    if (id === 'sun') targetMesh = this.sunMesh;
    else if (this.planets.has(id)) targetMesh = this.planets.get(id);
    else if (id === 'iss') targetMesh = this.issGroup;
    else if (id === 'jwst') targetMesh = this.jwstGroup;
    else if (id === 'hubble') targetMesh = this.hstGroup;
    else if (id === 'starlink') targetMesh = this.earthMesh;
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
      targetPos.x + radius * 2.5,
      targetPos.y + radius * 1.2,
      targetPos.z + radius * 2.8
    );
    this.controls.target.copy(targetPos);
  }

  cycleAutoTour() {
    const tourTargets = ['galaxy', 'sun', 'earth', 'iss', 'jwst', 'mars', 'jupiter', 'saturn'];
    const nextTarget = tourTargets[this.autoTourIndex % tourTargets.length];
    this.autoTourIndex++;
    if (nextTarget === 'galaxy') {
      this.zoomToGalaxy();
    } else {
      this.focusOnObject(nextTarget);
    }
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
    } else if (satEphem || id === 'iss' || id === 'jwst') {
      const sat = satEphem || data;
      if (radEl) radEl.textContent = id === 'iss' ? '109 m (Wingspan)' : (id === 'jwst' ? '21 m (Sunshield)' : 'Orbital Spacecraft');
      if (tempEl) tempEl.textContent = '-150 °C to +120 °C';
      if (distEl) distEl.textContent = '1.00 AU (Sun-Earth System)';
      if (speedEl) speedEl.textContent = `${sat.speed_kms || sat.orbital_velocity_kms || 7.66} km/s`;
      if (massEl) massEl.textContent = id === 'iss' ? '444,000 kg' : (id === 'jwst' ? '6,200 kg' : 'Operational Bus');
      if (rotEl) rotEl.textContent = `${sat.period_mins || 92.8} min / orbit`;
      if (compEl) compEl.textContent = sat.description || 'Artificial Spacecraft in active mission service.';
      if (factsEl) factsEl.textContent = id === 'iss' ? 'Seeing 16 sunrises and sunsets every 24 hours.' : 'Observing first generation galaxies formed after the Big Bang.';
      
      const v = sat.current_vector;
      if (v) {
        if (coordsEl) coordsEl.textContent = `Sub-Sat Lat: ${v.latitude_deg}° | Lon: ${v.longitude_deg}°`;
        if (altEl) altEl.textContent = `${v.altitude_km.toLocaleString()} km Altitude`;
        if (periodEl) periodEl.textContent = `${sat.period_mins} mins`;
      } else {
        if (coordsEl) coordsEl.textContent = `Orbit Inclination: ${sat.inclination_deg ?? 51.6}°`;
        if (altEl) altEl.textContent = `${sat.altitude_km?.toLocaleString() ?? 420} km Altitude`;
        if (periodEl) periodEl.textContent = `${sat.period_mins ?? 92.8} mins`;
      }
    }
  }

  // ----------------------------------------------------------------------------
  // Dynamic Cosmic Scale Detection
  // ----------------------------------------------------------------------------
  updateScaleDetection() {
    const camDist = this.camera.position.length();
    const badge = document.getElementById('scale-badge');
    const desc = document.getElementById('scale-desc');
    const actionBtn = document.getElementById('btn-scale-action');

    // Distance-based Galaxy Level-of-Detail (LOD):
    // Fade out dense galactic arm particles when exploring inner planetary orbits
    if (this.galaxyGroup) {
      const toggleGalaxyChecked = document.getElementById('toggle-galaxy')?.checked ?? true;
      this.galaxyGroup.visible = toggleGalaxyChecked && (camDist > 90);
    }

    if (camDist > 900) {
      if (this.currentScaleLevel !== 'GALAXY') {
        this.currentScaleLevel = 'GALAXY';
        if (badge) badge.textContent = 'GALAXY SCALE';
        if (desc) desc.textContent = 'MILKY WAY • ORION ARM • SCROLL TO ZOOM IN';
        if (actionBtn) actionBtn.textContent = 'DIVE INTO SOLAR SYSTEM ↓';
      }
    } else if (camDist > 250) {
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
  // Animation Loop
  // ----------------------------------------------------------------------------
  animate() {
    requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();
    const effectiveDelta = this.isPaused ? 0 : delta * this.timeScale;
    this.simulationDays += effectiveDelta * 0.8;

    // 1. Milky Way Galaxy Slow Majestic Rotation
    if (this.galaxyGroup) {
      this.galaxyGroup.rotation.y += 0.0003;
      if (this.solarMarker) {
        this.solarMarker.rotation.z += 0.01;
      }
    }

    // 2. Sun Corona Pulsing & Rotation
    if (this.sunMesh) {
      this.sunMesh.rotation.y += 0.001;
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

    // Earth Cloud Shell Rotation
    if (this.earthClouds) this.earthClouds.rotation.y += 0.0025;

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

    // 5. Artificial Satellites relative to Earth
    if (this.earthMesh) {
      const earthPos = this.earthMesh.position;

      // ISS orbit
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

      // JWST at Sun-Earth L2 (trailing Earth opposite Sun)
      if (this.jwstGroup) {
        const jwstData = this.jwstGroup.userData;
        jwstData.angle += jwstData.speed * (this.isPaused ? 0 : 1.0);
        const r = jwstData.orbitRadius;
        // Oriented outward from Sun
        const sunToEarth = earthPos.clone().normalize();
        const l2Base = earthPos.clone().add(sunToEarth.multiplyScalar(r));
        this.jwstGroup.position.set(
          l2Base.x + Math.cos(jwstData.angle) * 0.4,
          l2Base.y + Math.sin(jwstData.angle) * 0.3,
          l2Base.z + Math.sin(jwstData.angle) * 0.4
        );
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

      // Starlink swarm locked to Earth position
      if (this.starlinkMesh) {
        this.starlinkMesh.position.copy(earthPos);
        this.starlinkMesh.rotation.y += 0.008;
      }

      // GPS Constellation ring
      if (this.gpsRing) this.gpsRing.position.copy(earthPos);

      // Geostationary belt
      if (this.geoRing) this.geoRing.position.copy(earthPos);
    }

    // 6. Camera Tracking & Interpolation
    if (this.focusedObject) {
      const targetPos = new THREE.Vector3();
      this.focusedObject.getWorldPosition(targetPos);

      if (this.isTransitioningCamera) {
        const radius = this.focusedObject.userData.radius || 2.0;
        const sunToPlanet = targetPos.clone().normalize();
        if (sunToPlanet.lengthSq() < 0.001) sunToPlanet.set(0, 0, 1);
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

// Initialize Application
window.addEventListener('DOMContentLoaded', () => {
  new HeliosCosmicApplication();
});
