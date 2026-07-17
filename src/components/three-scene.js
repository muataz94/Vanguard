import {
  AmbientLight, BoxGeometry, BufferGeometry, Group, IcosahedronGeometry,
  LineBasicMaterial, LineLoop, Mesh, MeshStandardMaterial, PerspectiveCamera,
  PointLight, Scene, TorusGeometry, Vector3, WebGLRenderer
} from 'three';

export async function initThreeScene(container) {
  if (!container || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.WebGLRenderingContext || navigator.hardwareConcurrency <= 2) return;

  const scene = new Scene();
  const camera = new PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 7.5);
  const renderer = new WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  renderer.domElement.tabIndex = -1;
  container.append(renderer.domElement);

  const group = new Group();
  scene.add(group);
  const green = new MeshStandardMaterial({ color: 0x47b07b, roughness: 0.35, metalness: 0.45 });
  const pale = new MeshStandardMaterial({ color: 0xf5faf7, roughness: 0.55, metalness: 0.2 });
  const torus = new Mesh(new TorusGeometry(1.55, 0.12, 12, 64), green);
  torus.rotation.set(0.75, 0.25, 0.2);
  group.add(torus);

  const vShape = new Group();
  const leftArm = new Mesh(new BoxGeometry(0.16, 1.75, 0.13), green);
  const rightArm = new Mesh(new BoxGeometry(0.16, 1.75, 0.13), pale);
  leftArm.rotation.z = -0.53;
  rightArm.rotation.z = 0.53;
  leftArm.position.set(-0.43, 0.2, 0.42);
  rightArm.position.set(0.43, 0.2, 0.42);
  vShape.scale.setScalar(0.78);
  vShape.rotation.x = -0.12;
  vShape.add(leftArm, rightArm);
  group.add(vShape);

  const nodeGeometry = new IcosahedronGeometry(0.11, 0);
  const positions = [[-1.9, .8, .4], [1.8, .7, -.3], [-1.4, -1.25, .6], [1.35, -1.2, .2], [0, 1.7, -.5]];
  const points = [];
  positions.forEach((position, index) => {
    const node = new Mesh(nodeGeometry, index % 2 ? pale : green);
    node.position.set(...position);
    points.push(new Vector3(...position));
    group.add(node);
  });
  const lineMaterial = new LineBasicMaterial({ color: 0x68c895, transparent: true, opacity: 0.32 });
  group.add(new LineLoop(new BufferGeometry().setFromPoints(points), lineMaterial));

  const bars = new Group();
  for (let i = 0; i < 11; i += 1) {
    const height = 0.25 + ((i * 7) % 5) * 0.11;
    const bar = new Mesh(new BoxGeometry(0.07, height, 0.07), i % 3 === 0 ? pale : green);
    bar.position.set(-1.4 + i * 0.28, -1.95 + height / 2, -0.6);
    bars.add(bar);
  }
  group.add(bars);

  scene.add(new AmbientLight(0xf5faf7, 0.85));
  const light = new PointLight(0x47b07b, 10, 12);
  light.position.set(2.5, 2, 4);
  scene.add(light);

  let frameId;
  let visible = true;
  const pointer = { x: 0, y: 0 };
  const canHover = window.matchMedia('(hover: hover)').matches;
  const onPointer = (event) => {
    const rect = container.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width - .5) * .18;
    pointer.y = ((event.clientY - rect.top) / rect.height - .5) * .12;
  };
  if (canHover) container.addEventListener('pointermove', onPointer, { passive: true });

  const resize = () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  const animate = () => {
    if (!visible || document.hidden) return;
    group.rotation.y += 0.0022;
    group.rotation.x += (pointer.y - group.rotation.x) * 0.025;
    group.rotation.z += (pointer.x - group.rotation.z) * 0.025;
    renderer.render(scene, camera);
    frameId = requestAnimationFrame(animate);
  };
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    cancelAnimationFrame(frameId);
    if (visible && !document.hidden) animate();
  }, { threshold: 0.05 });
  const onVisibility = () => {
    cancelAnimationFrame(frameId);
    if (!document.hidden && visible) animate();
  };
  observer.observe(container);
  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('resize', resize, { passive: true });
  resize();
  animate();

  return () => {
    cancelAnimationFrame(frameId);
    observer.disconnect();
    window.removeEventListener('resize', resize);
    document.removeEventListener('visibilitychange', onVisibility);
    if (canHover) container.removeEventListener('pointermove', onPointer);
    scene.traverse((object) => {
      object.geometry?.dispose();
      if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
      else object.material?.dispose();
    });
    renderer.dispose();
  };
}
