// ══════════════════════════════════════════════
//  CASO 6 — INGENIERÍA
// ══════════════════════════════════════════════
const casoIngenieria = {
  sector: "Ingeniería",
  title: "Simulación de puente — análisis estructural",
  desc: "Antes de construir un puente, los ingenieros simulan las cargas, tensiones y deformaciones mediante modelos 3D. Esto evita fallas estructurales y optimiza el uso de materiales.",
  problem: "Los cálculos estructurales 2D no capturan las fuerzas torsionales ni las resonancias que actúan en los tres ejes del puente.",
  solution: "El modelo 3D permite aplicar cargas virtuales (vehículos, viento, sismos) y visualizar zonas de tensión máxima antes de fabricar una sola pieza.",
  color: 0xf97316,
  code: `<span class="cc">// Tablero del puente (caja horizontal)</span>
<span class="ck">const</span> <span class="cv">deck</span> = <span class="ck">new</span> THREE.Mesh(
  <span class="ck">new</span> THREE.BoxGeometry(<span class="cn">8</span>, <span class="cn">0.2</span>, <span class="cn">1.5</span>),
  <span class="ck">new</span> THREE.MeshStandardMaterial({
    color: <span class="cn">0x888888</span>, metalness: <span class="cn">0.7</span>
  })
);

<span class="cc">// Torres de soporte verticales</span>
<span class="ck">const</span> <span class="cv">tower</span> = <span class="ck">new</span> THREE.Mesh(
  <span class="ck">new</span> THREE.BoxGeometry(<span class="cn">0.2</span>, <span class="cn">3</span>, <span class="cn">0.2</span>),
  <span class="ck">new</span> THREE.MeshStandardMaterial({
    color: <span class="cn">0xf97316</span>, metalness: <span class="cn">0.6</span>
  })
);

<span class="cc">// Zona de tensión máxima (rojo pulsante)</span>
<span class="ck">const</span> <span class="cv">stressMat</span> = <span class="ck">new</span> THREE.MeshStandardMaterial({
  color: <span class="cn">0xff2200</span>,
  emissive: <span class="cn">0xff1100</span>,
  emissiveIntensity: <span class="cn">0.4</span>,
});`,

  build(scene) {
    addLights(scene, 0xfff0e0);
    addFloor(scene, 0x0f1008);

    const deck = new THREE.Mesh(
      new THREE.BoxGeometry(8, 0.22, 1.6),
      new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.65, roughness: 0.35 })
    );
    deck.position.y = 0;
    deck.castShadow = true;
    scene.add(deck);

    const stress = new THREE.Mesh(
      new THREE.BoxGeometry(2.5, 0.24, 1.62),
      new THREE.MeshStandardMaterial({
        color: 0xff2200, emissive: 0xff1100, emissiveIntensity: 0.5
      })
    );
    stress.position.y = 0;
    scene.add(stress);

    [-2.8, 2.8].forEach(x => {
      const tower = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 3, 0.22),
        new THREE.MeshStandardMaterial({ color: 0xf97316, metalness: 0.6, roughness: 0.3 })
      );
      tower.position.set(x, 1.5, 0);
      tower.castShadow = true;
      scene.add(tower);

      const cross = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 0.16, 1.8),
        new THREE.MeshStandardMaterial({ color: 0xf97316, metalness: 0.6 })
      );
      cross.position.set(x, 2.8, 0);
      scene.add(cross);

      for (let i = -3.5; i <= 3.5; i += 0.7) {
        const pts = [
          new THREE.Vector3(x, 3, 0),
          new THREE.Vector3(i, 0.12, 0)
        ];
        const cable = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(pts),
          new THREE.LineBasicMaterial({ color: 0xcccccc, transparent: true, opacity: 0.5 })
        );
        scene.add(cable);
      }
    });

    const car = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.3, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.4 })
    );
    car.position.set(-3.5, 0.26, 0);
    scene.add(car);

    const grid = new THREE.GridHelper(16, 30, 0x1a1808, 0x0f1008);
    grid.position.y = -1.2;
    scene.add(grid);

    return { deck, stress, car };
  },

  animate(obj, t) {
    obj.car.position.x = -3.8 + ((t * 0.8) % 7.6);
    const pulse = 0.4 + 0.35 * Math.abs(Math.sin(t * 2));
    obj.stress.material.emissiveIntensity = pulse;
  }
};
