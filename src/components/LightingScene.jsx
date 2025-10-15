import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function LightingScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // === Scene ===
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);

    // === Camera ===
    const camera = new THREE.PerspectiveCamera(
      75,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.set(2, 2, 4);
    camera.lookAt(0, 0, 0);

    // === Renderer ===
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);

    // === Lights ===
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // === Material ===
    const material = new THREE.MeshStandardMaterial({
      color: 0x0077ff,
      metalness: 0.5,
      roughness: 0.2,
    });

    // === Cube ===
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const cube = new THREE.Mesh(geometry, material);
    cube.castShadow = true;
    cube.position.y = 0.5;
    scene.add(cube);

    // === Ground ===
    const planeGeometry = new THREE.PlaneGeometry(10, 10);
    const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    scene.add(plane);

    // === Animation ===
    const animate = () => {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // === Resize ===
    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // === Cleanup ===
    return () => {
      window.removeEventListener("resize", handleResize);
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#111111",
      }}
    />
  );
}
