import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './3d.css';

function ThreeDVisualization({ measurements }) {
  const containerRef = useRef();
  const sceneRef = useRef();
  const rendererRef = useRef();
  const controlsRef = useRef();

  useEffect(() => {
    if (!measurements) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);

    // Create t-shirt based on measurements
    const createTShirt = () => {
      const group = new THREE.Group();

      // Convert measurements to appropriate scale (assuming measurements are in cm)
      const scale = 0.01; // Convert cm to meters
      const chest = measurements.chest * scale;
      const shoulder = measurements.shoulder * scale;
      const sleeve = measurements.sleeve * scale;
      const length = measurements.length * scale;
      const neck = measurements.neck * scale;

      // Create t-shirt body (front)
      const bodyGeometry = new THREE.BoxGeometry(chest, length, 0.01);
      const bodyMaterial = new THREE.MeshPhongMaterial({
        color: 0x3498db, // Blue color for the t-shirt
        flatShading: true,
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.y = -length / 2;
      group.add(body);

      // Create sleeves
      const sleeveGeometry = new THREE.BoxGeometry(sleeve, shoulder / 2, 0.01);
      const sleeveMaterial = new THREE.MeshPhongMaterial({
        color: 0x3498db,
        flatShading: true,
      });

      // Left sleeve
      const leftSleeve = new THREE.Mesh(sleeveGeometry, sleeveMaterial);
      leftSleeve.position.set(-chest / 2 - sleeve / 2, 0, 0);
      leftSleeve.rotation.z = Math.PI / 4; // Rotate to create sleeve angle
      group.add(leftSleeve);

      // Right sleeve
      const rightSleeve = new THREE.Mesh(sleeveGeometry, sleeveMaterial);
      rightSleeve.position.set(chest / 2 + sleeve / 2, 0, 0);
      rightSleeve.rotation.z = -Math.PI / 4; // Rotate to create sleeve angle
      group.add(rightSleeve);

      // Create neck
      const neckGeometry = new THREE.CircleGeometry(neck / 2, 32);
      const neckMaterial = new THREE.MeshPhongMaterial({
        color: 0x3498db,
        flatShading: true,
      });
      const neckMesh = new THREE.Mesh(neckGeometry, neckMaterial);
      neckMesh.position.set(0, length / 2 - neck / 2, 0.01);
      group.add(neckMesh);

      // Add measurement lines
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
      
      // Chest line
      const chestLineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-chest / 2, 0, 0.02),
        new THREE.Vector3(chest / 2, 0, 0.02)
      ]);
      const chestLine = new THREE.Line(chestLineGeometry, lineMaterial);
      group.add(chestLine);

      // Shoulder line
      const shoulderLineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-shoulder / 2, 0, 0.02),
        new THREE.Vector3(shoulder / 2, 0, 0.02)
      ]);
      const shoulderLine = new THREE.Line(shoulderLineGeometry, lineMaterial);
      group.add(shoulderLine);

      // Length line
      const lengthLineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(chest / 2 + 0.05, -length / 2, 0.02),
        new THREE.Vector3(chest / 2 + 0.05, length / 2, 0.02)
      ]);
      const lengthLine = new THREE.Line(lengthLineGeometry, lineMaterial);
      group.add(lengthLine);

      // Sleeve line
      const sleeveLineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(chest / 2, 0, 0.02),
        new THREE.Vector3(chest / 2 + sleeve, 0, 0.02)
      ]);
      const sleeveLine = new THREE.Line(sleeveLineGeometry, lineMaterial);
      group.add(sleeveLine);

      return group;
    };

    const tShirt = createTShirt();
    scene.add(tShirt);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
      controls.dispose();
    };
  }, [measurements]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}

export default ThreeDVisualization;
