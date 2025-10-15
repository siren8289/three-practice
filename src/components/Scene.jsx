import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Scene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // 씬
    const scene = new THREE.Scene();

    // 카메라
    const camera = new THREE.PerspectiveCamera(
      75,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 2;

    // 렌더러
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio); // ✅ retina 대응
    renderer.setClearColor(0x222222);
    mount.appendChild(renderer.domElement);

    // 큐브
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshNormalMaterial(); // ✅ 조명 없이 색 변화
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // 애니메이션
    function animate() {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();

    // 리사이즈
    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // cleanup
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
        overflow: "hidden",
        backgroundColor: "#222222",
      }}
    />
  );
}
