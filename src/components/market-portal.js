import {
  BoxGeometry,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  InstancedMesh,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  PerspectiveCamera,
  Scene,
  TorusGeometry,
  WebGLRenderer
} from 'three';

const MAX_CANDLES = 24;
const GREEN = new Color(0x47b07b);
const PALE = new Color(0xf5faf7);
const RED = new Color(0xef6b73);

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const lerp = (start, end, progress) => start + (end - start) * progress;
const smoothstep = (start, end, value) => {
  const progress = clamp((value - start) / (end - start));
  return progress * progress * (3 - 2 * progress);
};

function getCandleCount() {
  if (window.innerWidth <= 620) return 8;
  if (window.innerWidth <= 960) return 14;
  return 22;
}

function createGrid() {
  const positions = [];
  for (let x = -4.8; x <= 4.8; x += .6) positions.push(x, -1.72, -.42, x, 1.72, -.42);
  for (let y = -1.72; y <= 1.72; y += .43) positions.push(-4.8, y, -.42, 4.8, y, -.42);
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  const material = new LineBasicMaterial({ color: 0x47b07b, transparent: true, opacity: .2 });
  return { geometry, material, mesh: new LineSegments(geometry, material) };
}

function createLayout(count, chapter) {
  const half = Math.ceil(count / 2);
  return Array.from({ length: count }, (_, index) => {
    const right = index >= half;
    const armIndex = right ? index - half : index;
    const armCount = right ? count - half : half;
    const along = armCount <= 1 ? 1 : armIndex / (armCount - 1);
    const direction = right ? 1 : -1;
    const noise = (((index + 3) * (chapter + 5) * 17) % 19) / 19;
    const vX = direction * lerp(2.45, .13, along);
    const vY = lerp(1.38, -1.42, along) + (noise - .5) * .12;
    return {
      startX: lerp(-4.15, 4.15, count === 1 ? .5 : index / (count - 1)),
      startY: -1.58 + (index % 3) * .035,
      startZ: -.08 + (noise - .5) * .16,
      vX,
      vY,
      vZ: (noise - .5) * .52,
      apartX: vX * 1.75 + direction * .72,
      apartY: vY + (noise - .5) * .7,
      apartZ: -1.1 - noise * 1.25,
      height: .42 + noise * .52,
      color: index % 7 === 0 ? RED : index % 4 === 0 ? PALE : GREEN
    };
  });
}

export function createMarketPortalSystem(zones) {
  if (!zones.length || !window.WebGLRenderingContext) return null;

  const scene = new Scene();
  const camera = new PerspectiveCamera(40, 1, .1, 30);
  camera.position.set(0, 0, 7.2);

  const renderer = new WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth <= 620 ? 1.15 : 1.5));
  renderer.shadowMap.enabled = false;
  renderer.domElement.dataset.marketPortalCanvas = '';
  renderer.domElement.setAttribute('aria-hidden', 'true');
  renderer.domElement.tabIndex = -1;

  const candleGeometry = new BoxGeometry(1, 1, 1);
  const candleMaterial = new MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 1 });
  const bodies = new InstancedMesh(candleGeometry, candleMaterial, MAX_CANDLES);
  const wicks = new InstancedMesh(candleGeometry, candleMaterial, MAX_CANDLES);
  bodies.frustumCulled = false;
  wicks.frustumCulled = false;
  scene.add(bodies, wicks);

  const torusGeometry = new TorusGeometry(1.47, .075, 10, 72);
  const torusMaterial = new MeshBasicMaterial({ color: 0x47b07b, transparent: true, opacity: 0 });
  const torus = new Mesh(torusGeometry, torusMaterial);
  scene.add(torus);

  const grid = createGrid();
  scene.add(grid.mesh);

  const matrix = new Object3D();
  let candleCount = getCandleCount();
  let activeIndex = -1;
  let activeZone = null;
  let activeLayout = createLayout(candleCount, 1);
  let lastProgress = 0;
  let renderCount = 0;

  const setInstance = (mesh, index, position, scale) => {
    matrix.position.set(...position);
    matrix.scale.set(...scale);
    matrix.rotation.set(0, 0, 0);
    matrix.updateMatrix();
    mesh.setMatrixAt(index, matrix.matrix);
  };

  const resize = () => {
    if (!activeZone) return;
    const mount = activeZone.querySelector('.market-portal__canvas-mount');
    const width = Math.max(1, mount.clientWidth);
    const height = Math.max(1, mount.clientHeight);
    const nextCount = getCandleCount();
    if (nextCount !== candleCount) {
      candleCount = nextCount;
      activeLayout = createLayout(candleCount, Number(activeZone.dataset.chapter));
    }
    bodies.count = candleCount;
    wicks.count = candleCount;
    activeZone.dataset.candleCount = String(candleCount);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth <= 620 ? 1.15 : 1.5));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  const activate = (index) => {
    if (activeIndex === index) return;
    zones.forEach((zone) => zone.classList.remove('is-webgl-active'));
    activeIndex = index;
    activeZone = zones[index];
    activeLayout = createLayout(candleCount, Number(activeZone.dataset.chapter));
    activeZone.querySelector('.market-portal__canvas-mount').append(renderer.domElement);
    activeZone.classList.add('is-webgl-active');
    renderer.domElement.style.visibility = 'visible';
    document.documentElement.dataset.activeMarketPortal = activeZone.dataset.chapter;
    resize();
  };

  const deactivate = (index) => {
    if (activeIndex !== index) return;
    activeZone?.classList.remove('is-webgl-active');
    renderer.domElement.style.visibility = 'hidden';
    activeIndex = -1;
    activeZone = null;
    delete document.documentElement.dataset.activeMarketPortal;
  };

  const render = (progress, index) => {
    if (document.hidden) return;
    activate(index);
    lastProgress = clamp(progress);
    const rise = smoothstep(0, .28, lastProgress);
    const form = smoothstep(.14, .54, lastProgress);
    const open = smoothstep(.52, .84, lastProgress);
    const portalReveal = smoothstep(.25, .56, lastProgress);
    const travel = smoothstep(.58, 1, lastProgress);

    activeLayout.forEach((candle, candleIndex) => {
      const formedX = lerp(candle.startX, candle.vX, form);
      const formedY = lerp(candle.startY + candle.height * rise * .5, candle.vY, form);
      const formedZ = lerp(candle.startZ, candle.vZ, form);
      const x = lerp(formedX, candle.apartX, open);
      const y = lerp(formedY, candle.apartY, open);
      const z = lerp(formedZ, candle.apartZ, open);
      const bodyHeight = Math.max(.025, candle.height * rise);
      setInstance(bodies, candleIndex, [x, y, z], [.12, bodyHeight, .12]);
      setInstance(wicks, candleIndex, [x, y, z], [.025, bodyHeight + .34 * rise, .025]);
      bodies.setColorAt(candleIndex, candle.color);
      wicks.setColorAt(candleIndex, candle.color);
    });

    bodies.instanceMatrix.needsUpdate = true;
    wicks.instanceMatrix.needsUpdate = true;
    bodies.instanceColor.needsUpdate = true;
    wicks.instanceColor.needsUpdate = true;
    candleMaterial.opacity = clamp(rise * (1 - travel * .58), 0, 1);
    grid.material.opacity = .24 * (1 - smoothstep(.24, .76, lastProgress));
    torus.scale.setScalar(.54 + portalReveal * .72 + travel * .14);
    torus.rotation.z = (Number(activeZone.dataset.chapter) - 2.5) * .055 + form * .08;
    torusMaterial.opacity = portalReveal * (1 - smoothstep(.84, 1, lastProgress) * .76) * .68;
    camera.position.z = lerp(7.2, -1.65, travel);
    camera.position.y = Math.sin(lastProgress * Math.PI) * .08;
    camera.rotation.set(0, 0, 0);
    renderer.render(scene, camera);
    renderCount += 1;
    renderer.domElement.dataset.renderCount = String(renderCount);
    renderer.domElement.dataset.progress = lastProgress.toFixed(3);
  };

  const firstMount = zones[0].querySelector('.market-portal__canvas-mount');
  firstMount.append(renderer.domElement);
  renderer.domElement.style.visibility = 'hidden';
  zones.forEach((zone) => { zone.dataset.candleCount = String(candleCount); });
  window.addEventListener('resize', resize, { passive: true });

  return {
    render,
    deactivate,
    getDiagnostics: () => ({ activeIndex, candleCount, renderCount, progress: lastProgress }),
    dispose() {
      window.removeEventListener('resize', resize);
      renderer.domElement.remove();
      candleGeometry.dispose();
      candleMaterial.dispose();
      torusGeometry.dispose();
      torusMaterial.dispose();
      grid.geometry.dispose();
      grid.material.dispose();
      renderer.dispose();
      zones.forEach((zone) => zone.classList.remove('is-webgl-active'));
      delete document.documentElement.dataset.activeMarketPortal;
    }
  };
}
