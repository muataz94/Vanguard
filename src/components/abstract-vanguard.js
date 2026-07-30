import {
  AmbientLight,
  BoxGeometry,
  Color,
  DirectionalLight,
  Group,
  IcosahedronGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  TorusGeometry,
  Vector2,
  WebGLRenderer,
  BufferGeometry,
  Float32BufferAttribute
} from 'three';

const reduceMotionQuery = '(prefers-reduced-motion: reduce)';

function createWireFrame() {
  const points = [
    -2.1, .8, -.7, 0, 1.65, -.3, 2.1, .8, -.7,
    -1.7, -.9, -.45, 0, -1.55, -.2, 1.7, -.9, -.45,
    -2.1, .8, -.7, -1.7, -.9, -.45,
    2.1, .8, -.7, 1.7, -.9, -.45
  ];
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(points, 3));
  const material = new LineBasicMaterial({ color: 0x47b07b, transparent: true, opacity: .28 });
  return { geometry, material, lines: new LineSegments(geometry, material) };
}

export function initAbstractVanguard(stage) {
  if (!stage || window.matchMedia(reduceMotionQuery).matches || !window.WebGLRenderingContext) return null;

  const scene = new Scene();
  const camera = new PerspectiveCamera(35, 1, .1, 100);
  camera.position.set(0, .05, 7.2);

  const canvas = document.createElement('canvas');
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth <= 620 ? 1.2 : 1.5));
  renderer.shadowMap.enabled = false;
  renderer.domElement.dataset.vanguardAbstract = '';
  renderer.domElement.setAttribute('aria-hidden', 'true');
  renderer.domElement.tabIndex = -1;
  stage.append(renderer.domElement);

  const root = new Group();
  const greenMaterial = new MeshStandardMaterial({ color: 0x47b07b, metalness: .42, roughness: .32, emissive: new Color(0x0c2a19), emissiveIntensity: .72 });
  const whiteMaterial = new MeshStandardMaterial({ color: 0xf5faf7, metalness: .22, roughness: .42, emissive: new Color(0x18231d), emissiveIntensity: .2 });
  const darkMaterial = new MeshStandardMaterial({ color: 0x050907, metalness: .58, roughness: .3, transparent: true, opacity: .85 });
  const armGeometry = new BoxGeometry(.25, 2.36, .22);
  const leftArm = new Mesh(armGeometry, greenMaterial);
  const rightArm = new Mesh(armGeometry, whiteMaterial);
  leftArm.rotation.z = .58;
  rightArm.rotation.z = -.58;
  leftArm.position.set(-.68, .02, .1);
  rightArm.position.set(.68, .02, .1);
  root.add(leftArm, rightArm);

  const coreGeometry = new IcosahedronGeometry(.53, 1);
  const core = new Mesh(coreGeometry, darkMaterial);
  core.position.y = -.1;
  root.add(core);

  const ringGeometry = new TorusGeometry(1.65, .042, 8, 48);
  const ring = new Mesh(ringGeometry, greenMaterial);
  ring.rotation.set(.34, -.18, .18);
  root.add(ring);

  const wire = createWireFrame();
  root.add(wire.lines);
  root.rotation.x = -.08;
  scene.add(root);

  scene.add(new AmbientLight(0xf5faf7, .72));
  const keyLight = new DirectionalLight(0x47b07b, 2.8);
  keyLight.position.set(3, 3.5, 4);
  scene.add(keyLight);
  const fillLight = new DirectionalLight(0xf5faf7, 1.15);
  fillLight.position.set(-3, -1.5, 3);
  scene.add(fillLight);

  const pointer = new Vector2();
  const targetPointer = new Vector2();
  const canHover = window.matchMedia('(hover: hover)').matches;
  let frameId = 0;
  let visible = true;
  let lastTime = 0;
  let lastRenderTime = 0;
  let renderCount = 0;
  let scrolling = false;
  let scrollTimer = 0;

  const resize = () => {
    const width = Math.max(1, stage.clientWidth);
    const height = Math.max(1, stage.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth <= 620 ? 1.2 : 1.5));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };

  const render = (time) => {
    if (!visible || document.hidden || scrolling) return;
    if (time - lastRenderTime < 32) {
      frameId = requestAnimationFrame(render);
      return;
    }
    lastRenderTime = time;
    const elapsed = time * .001;
    const delta = Math.min(.05, (time - lastTime) * .001 || .016);
    lastTime = time;
    pointer.lerp(targetPointer, Math.min(1, delta * 2.6));
    root.rotation.y += delta * .18;
    root.rotation.z = Math.sin(elapsed * .33) * .05 + pointer.x * .16;
    root.position.y = Math.sin(elapsed * .7) * .12 + pointer.y * .1;
    core.rotation.x = elapsed * .22;
    core.rotation.y = -elapsed * .3;
    const pulse = 1 + Math.sin(elapsed * 1.25) * .055;
    core.scale.setScalar(pulse);
    ring.rotation.z = elapsed * .12;
    ring.scale.setScalar(1 + Math.sin(elapsed * .56) * .035);
    wire.lines.rotation.z = -elapsed * .08;
    renderer.render(scene, camera);
    renderCount += 1;
    renderer.domElement.dataset.renderCount = String(renderCount);
    frameId = requestAnimationFrame(render);
  };

  const start = () => {
    cancelAnimationFrame(frameId);
    if (visible && !document.hidden && !scrolling) frameId = requestAnimationFrame(render);
  };
  const onPointerMove = (event) => {
    const bounds = stage.getBoundingClientRect();
    targetPointer.set(((event.clientX - bounds.left) / bounds.width - .5), -((event.clientY - bounds.top) / bounds.height - .5));
  };
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    renderer.domElement.dataset.active = String(visible);
    if (visible) start();
    else cancelAnimationFrame(frameId);
  }, { threshold: .08 });
  const onVisibilityChange = () => { if (!document.hidden) start(); else cancelAnimationFrame(frameId); };
  const onScroll = () => {
    scrolling = true;
    cancelAnimationFrame(frameId);
    window.clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(() => {
      scrolling = false;
      start();
    }, 140);
  };

  if (canHover) stage.addEventListener('pointermove', onPointerMove, { passive: true });
  observer.observe(stage);
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('visibilitychange', onVisibilityChange);
  resize();
  stage.classList.add('is-webgl-ready');
  start();

  return () => {
    cancelAnimationFrame(frameId);
    observer.disconnect();
    window.removeEventListener('resize', resize);
    window.removeEventListener('scroll', onScroll);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    window.clearTimeout(scrollTimer);
    if (canHover) stage.removeEventListener('pointermove', onPointerMove);
    renderer.domElement.remove();
    armGeometry.dispose();
    coreGeometry.dispose();
    ringGeometry.dispose();
    wire.geometry.dispose();
    wire.material.dispose();
    greenMaterial.dispose();
    whiteMaterial.dispose();
    darkMaterial.dispose();
    renderer.dispose();
    stage.classList.remove('is-webgl-ready');
  };
}
