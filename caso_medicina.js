// ══════════════════════════════════════════════
//  CASO 4 — MEDICINA
// ══════════════════════════════════════════════
const casoMedicina = {
  sector: "Medicina",
  title: "Diseño de prótesis personalizada",
  desc: "A partir del escaneo 3D de un muñón, se diseña digitalmente una prótesis de ajuste perfecto. El modelo se envía directamente a una impresora 3D médica.",
  problem: "Las prótesis estándar no se ajustan a la anatomía particular de cada paciente, causando dolor, lesiones y rechazo.",
  solution: "El modelado 3D del miembro residual permite crear una prótesis a medida en horas, con ajuste preciso y menor costo que las técnicas tradicionales.",
  color: 0x22c55e,
  code: `<span class="cc">// Escaneo del miembro residual</span>
<span class="ck">const</span> <span class="cv">stumpGeo</span> = <span class="ck">new</span> THREE.CylinderGeometry(
  <span class="cn">0.4</span>, <span class="cn">0.55</span>, <span class="cn">1.8</span>, <span class="cn">32</span>
);
<span class="ck">const</span> <span class="cv">stump</span> = <span class="ck">new</span> THREE.Mesh(stumpGeo,
  <span class="ck">new</span> THREE.MeshStandardMaterial({
    color: <span class="cn">0xf5c8a0</span>, roughness: <span class="cn">0.9</span>
  })
);

<span class="cc">// Prótesis generada a medida</span>
<span class="ck">const</span> <span class="cv">prosGeo</span> = <span class="ck">new</span> THREE.CylinderGeometry(
  <span class="cn">0.3</span>, <span class="cn">0.1</span>, <span class="cn">2.2</span>, <span class="cn">32</span>
);
<span class="ck">const</span> <span class="cv">prosthesis</span> = <span class="ck">new</span> THREE.Mesh(prosGeo,
  <span class="ck">new</span> THREE.MeshStandardMaterial({
    color: <span class="cn">0xaaccff</span>,
    metalness: <span class="cn">0.8</span>, roughness: <span class="cn">0.2</span>
  })
);
prosthesis.position.y = -<span class="cn">2.0</span>; <span class="cc">// encaja debajo del muñón</span>`,

  build(scene) {
    addLights(scene);
    addFloor(scene, 0x0a160f);

    const stump = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, 0.56, 1.8, 32),
      new THREE.MeshStandardMaterial({ color: 0xf5c8a0, roughness: 0.88 })
    );
    stump.position.y = 1.6;
    stump.castShadow = true;
    scene.add(stump);

    const socket = new THREE.Mesh(
      new THREE.CylinderGeometry(0.52, 0.48, 0.55, 32, 1, true),
      new THREE.MeshStandardMaterial({
        color: 0x22c55e, roughness: 0.3, metalness: 0.5, side: THREE.DoubleSide
      })
    );
    socket.position.y = 0.64;
    scene.add(socket);

    const shaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.14, 1.6, 24),
      new THREE.MeshStandardMaterial({ color: 0xaaccff, metalness: 0.85, roughness: 0.15 })
    );
    shaft.position.y = -0.4;
    scene.add(shaft);

    const foot = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.18, 1.1),
      new THREE.MeshStandardMaterial({ color: 0x334455, roughness: 0.6, metalness: 0.4 })
    );
    foot.position.set(0.15, -1.35, 0.2);
    scene.add(foot);

    const scanMat = new THREE.MeshBasicMaterial({
      color: 0x22c55e, transparent: true, opacity: 0.15, side: THREE.DoubleSide
    });
    for (let i = 0; i < 8; i++) {
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.44, 0.62, 32), scanMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.9 + i * 0.2;
      scene.add(ring);
    }

    const grid = new THREE.GridHelper(10, 20, 0x0f2a18, 0x0a160f);
    grid.position.y = -1.6;
    scene.add(grid);

    return { stump, socket, shaft };
  },

  animate(obj, t) {
    obj.stump.rotation.y  = t * 0.25;
    obj.socket.rotation.y = t * 0.25;
    obj.shaft.rotation.y  = t * 0.25;
  }
};
