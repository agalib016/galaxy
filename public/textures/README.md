# 🌌 High-Resolution Textures Directory

The **Helios 3D** engine features an in-memory **4K procedural texture generator** that automatically renders detailed planet surfaces, cloud formations, and Saturn's rings out of the box with zero external dependencies.

If you wish to use photographic high-resolution image maps, simply drop `.jpg` or `.png` files into this directory (`public/textures/`) using the filenames below:

| Filename | Description | Recommended Resolution | Free Resource Sources |
| :--- | :--- | :--- | :--- |
| `sun.jpg` | Solar photosphere surface map | 2048x1024 or 4096x2048 | [NASA SDO](https://sdo.gsfc.nasa.gov/) |
| `mercury.jpg` | Mercury topographic surface map | 2048x1024 | [Solar System Scope](https://www.solarsystemscope.com/textures/) |
| `venus.jpg` | Venus atmospheric / surface map | 2048x1024 | [Solar System Scope](https://www.solarsystemscope.com/textures/) |
| `earth_texture.jpg` | Earth day surface map (land/oceans) | 4096x2048 or 8192x4096 | [NASA Blue Marble](https://visibleearth.nasa.gov/) |
| `earth_clouds.jpg` | Earth cloud layer with transparency | 2048x1024 or 4096x2048 | [NASA Visible Earth](https://visibleearth.nasa.gov/) |
| `moon.jpg` | Earth's Moon surface map | 2048x1024 | [NASA LRO](https://svs.gsfc.nasa.gov/) |
| `mars.jpg` | Mars surface map with polar caps | 2048x1024 or 4096x2048 | [NASA Mars Global Surveyor](https://mars.nasa.gov/) |
| `jupiter.jpg` | Jupiter banded atmosphere & Red Spot | 2048x1024 or 4096x2048 | [NASA Juno Mission](https://www.missionjuno.swri.edu/) |
| `saturn.jpg` | Saturn golden cloud deck | 2048x1024 | [NASA Cassini](https://solarsystem.nasa.gov/) |
| `saturn_rings.png` | Saturn ring system with alpha transparency | 1024x64 or 2048x128 | [Solar System Scope](https://www.solarsystemscope.com/textures/) |
| `uranus.jpg` | Uranus pale cyan ice surface | 2048x1024 | [NASA Voyager 2](https://solarsystem.nasa.gov/) |
| `neptune.jpg` | Neptune deep azure blue surface | 2048x1024 | [NASA Voyager 2](https://solarsystem.nasa.gov/) |
| `milkyway.jpg` | 360° Equirectangular Milky Way galaxy skydome | 4096x2048 or 8192x4096 | [ESO / NASA Deep Sky](https://www.eso.org/) |

The application automatically checks for these files and replaces the procedural textures whenever present.
