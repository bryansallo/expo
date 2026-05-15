// ══════════════════════════════════════════════
//  CASO 5 — EDUCACIÓN
// ══════════════════════════════════════════════
const casoEducacion = {
  sector: "Educación",
  title: "Sistema solar interactivo",
  desc: "En lugar de observar ilustraciones estáticas en libros, los estudiantes interactúan con modelos 3D de planetas a escala real, comprendiendo distancias, órbitas y escalas de forma intuitiva.",
  problem: "Los libros de texto no transmiten la escala real del espacio ni el movimiento orbital, dificultando la comprensión conceptual.",
  solution: "Un modelo 3D interactivo del sistema solar permite explorar órbitas, velocidades angulares y comparar tamaños de planetas en tiempo real.",
  color: 0xa855f7,
  code: `<span class="cc">// Sol central (emisivo: no necesita luz externa)</span>
<span class="ck">const</span> <span class="cv">sun</span> = <span class="ck">new</span> THREE.Mesh(
  <span class="ck">new</span> THREE.SphereGeometry(<span class="cn">1.2</span>, <span class="cn">32</span>, <span class="cn">32</span>),
  <span class="ck">new</span> THREE.MeshBasicMaterial({ color: <span class="cn">0xffdd44</span> })
);

<span class="cc">// Planetas: radio orbital, tamaño, color y velocidad</span>
<span class="ck">const</span> <span class="cv">planets</span> = [
  { r: <span class="cn">2.5</span>, size: <span class="cn">0.18</span>, color: <span class="cn">0x4488ff</span>, speed: <span class="cn">1.0</span> },
  { r: <span class="cn">4.0</span>, size: <span class="cn">0.28</span>, color: <span class="cn">0xff8844</span>, speed: <span class="cn">0.6</span> },
  { r: <span class="cn">5.8</span>, size: <span class="cn">0.22</span>, color: <span class="cn">0x44ff88</span>, speed: <span class="cn">0.4</span> },
];

<span class="cc">// Movimiento orbital: posición en coordenadas polares</span>
planets.forEach((p, i) => {
  p.mesh.position.x = Math.cos(t * p.speed) * p.r;
  p.mesh.position.z = Math.sin(t * p.speed) * p.r;
});`,

  build(scene) {
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(600 * 3);
    for (let i = 0; i < 600 * 3; i++) starPos[i] = (Math.random() - 0.5) * 60;
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color: 0xffffff, size: 0.06 })
    ));

    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(1.2, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xffdd44 })
    );
    scene.add(sun);
    scene.add(new THREE.PointLight(0xffdd44, 2, 30));

    const data = [
      { r: 2.6, size: 0.18, color: 0x8888cc, speed: 1.0,  name: 'Mercurio' },
      { r: 3.6, size: 0.28, color: 0xffaa44, speed: 0.65, name: 'Venus'    },
      { r: 4.8, size: 0.30, color: 0x4488ff, speed: 0.45, name: 'Tierra'   },
      { r: 6.2, size: 0.20, color: 0xff6633, speed: 0.30, name: 'Marte'    },
    ];
    const meshes = data.map(d => {
      const orbitPoints = [];
      for (let i = 0; i <= 64; i++) {
        const a = (i / 64) * Math.PI * 2;
        orbitPoints.push(new THREE.Vector3(Math.cos(a) * d.r, 0, Math.sin(a) * d.r));
      }
      const orbit = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(orbitPoints),
        new THREE.LineBasicMaterial({ color: 0x223344, transparent: true, opacity: 0.5 })
      );
      scene.add(orbit);

      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(d.size, 20, 20),
        new THREE.MeshStandardMaterial({ color: d.color, roughness: 0.7, metalness: 0.1 })
      );
      scene.add(mesh);
      return { mesh, ...d };
    });

    scene.add(new THREE.AmbientLight(0x111122, 0.5));
    return { meshes, sun };
  },

  animate(obj, t) {
    obj.sun.rotation.y = t * 0.1;
    obj.meshes.forEach(p => {
      p.mesh.position.x = Math.cos(t * p.speed) * p.r;
      p.mesh.position.z = Math.sin(t * p.speed) * p.r;
      p.mesh.rotation.y = t * p.speed * 2;
    });
  }
};
