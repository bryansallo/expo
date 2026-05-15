// ══════════════════════════════════════════════
//  CASO 3 — ARQUITECTURA
// ══════════════════════════════════════════════
const casoArquitectura = {
  sector: "Arquitectura",
  title: "Maqueta digital BIM de edificio",
  desc: "Antes de construir, los arquitectos crean modelos BIM 3D del edificio completo. Esto permite detectar conflictos entre estructura, instalaciones eléctricas y tuberías.",
  problem: "En planos 2D, los conflictos entre vigas, tuberías y cables eléctricos no son visibles hasta la construcción, generando retrasos costosos.",
  solution: "El modelo 3D detecta colisiones automáticamente y permite simular la iluminación natural, ventilación y evacuación antes de construir.",
  color: 0xf59e0b,
  code: `<span class="cc">// Estructura del edificio (semitransparente)</span>
<span class="ck">const</span> <span class="cv">buildingGeo</span> = <span class="ck">new</span> THREE.BoxGeometry(<span class="cn">3</span>, <span class="cn">5</span>, <span class="cn">2</span>);
<span class="ck">const</span> <span class="cv">buildingMat</span> = <span class="ck">new</span> THREE.MeshStandardMaterial({
  color: <span class="cn">0xe8d5a0</span>, roughness: <span class="cn">0.8</span>,
  transparent: <span class="ck">true</span>, opacity: <span class="cn">0.7</span>,
});
<span class="ck">const</span> <span class="cv">building</span> = <span class="ck">new</span> THREE.Mesh(buildingGeo, buildingMat);

<span class="cc">// Tuberías de instalaciones internas</span>
<span class="ck">const</span> <span class="cv">pipeGeo</span> = <span class="ck">new</span> THREE.CylinderGeometry(<span class="cn">0.08</span>, <span class="cn">0.08</span>, <span class="cn">3.2</span>);
<span class="ck">const</span> <span class="cv">pipeMat</span> = <span class="ck">new</span> THREE.MeshStandardMaterial(
  { color: <span class="cn">0x3b82f6</span> }   <span class="cc">// azul = agua</span>
);

<span class="cc">// Detectar colisión tubería ↔ viga</span>
<span class="ck">const</span> <span class="cv">box1</span> = <span class="ck">new</span> THREE.Box3().setFromObject(pipe);
<span class="ck">const</span> <span class="cv">box2</span> = <span class="ck">new</span> THREE.Box3().setFromObject(beam);
<span class="ck">if</span> (box1.intersectsBox(box2)) {
  pipe.material.color.set(<span class="cn">0xff0000</span>); <span class="cc">// ¡conflicto!</span>
}`,

  build(scene) {
    addLights(scene, 0xfff5e0);
    addFloor(scene, 0x1a1408);

    const building = new THREE.Mesh(
      new THREE.BoxGeometry(3, 5, 2),
      new THREE.MeshStandardMaterial({
        color: 0xe8d5a0, roughness: 0.8, transparent: true, opacity: 0.22
      })
    );
    building.position.y = 1.5;
    building.castShadow = true;
    scene.add(building);

    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(3, 5, 2)),
      new THREE.LineBasicMaterial({ color: 0xf59e0b, opacity: 0.7, transparent: true })
    );
    edges.position.y = 1.5;
    scene.add(edges);

    for (let i = 0; i < 4; i++) {
      const floor = new THREE.Mesh(
        new THREE.BoxGeometry(3, 0.08, 2),
        new THREE.MeshStandardMaterial({ color: 0xd4b87a, roughness: 0.9 })
      );
      floor.position.y = i * 1.25 + 0.02;
      scene.add(floor);
    }

    const pipes = [];
    const pipeData = [
      { x: -0.8, color: 0x3b82f6 },
      { x:  0.0, color: 0xff3333 },
      { x:  0.8, color: 0x22c55e },
    ];
    pipeData.forEach(d => {
      const p = new THREE.Mesh(
        new THREE.CylinderGeometry(0.07, 0.07, 5, 12),
        new THREE.MeshStandardMaterial({
          color: d.color, roughness: 0.4, metalness: 0.6
        })
      );
      p.position.set(d.x, 2.5, 0.3);
      scene.add(p);
      pipes.push(p);
    });

    const beam = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 0.18, 0.18),
      new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.7, roughness: 0.3 })
    );
    beam.position.set(0, 1.25, 0.3);
    scene.add(beam);

    const grid = new THREE.GridHelper(12, 24, 0x2a1f08, 0x1a1408);
    grid.position.y = -1.0;
    scene.add(grid);

    return { building, edges, pipes };
  },

  animate(obj, t) {
    obj.pipes[1].material.opacity = 0.5 + 0.5 * Math.abs(Math.sin(t * 3));
    obj.pipes[1].material.transparent = true;
  }
};
