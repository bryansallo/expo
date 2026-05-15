// ══════════════════════════════════════════════
//  CASO 2 — SALUD
//  Cabeza 3D low-poly con malla poligonal, plano de corte TC
//  animado y zona de anomalía pulsante.
// ══════════════════════════════════════════════
const casoSalud = {
  sector: "Salud",
  title: "Diagnóstico neurológico — Cabeza 3D poligonal",
  desc: "A partir de tomografías computarizadas (TC), se genera una malla poligonal 3D del cráneo y tejidos blandos. El médico puede rotar el modelo, aplicar planos de corte y localizar anomalías antes de cualquier procedimiento.",
  problem: "Las imágenes 2D de TC y resonancia magnética no permiten visualizar la profundidad ni planificar accesos quirúrgicos con precisión tridimensional.",
  solution: "La malla poligonal del cráneo permite rotar, seccionar y medir distancias desde cualquier ángulo, reduciendo el tiempo quirúrgico y el riesgo para el paciente.",
  color: 0xef4444,
  code: `<span class="cc">// Malla poligonal de baja resolución (low-poly)</span>
<span class="cc">// simula reconstrucción volumétrica desde TC</span>
<span class="ck">const</span> <span class="cv">headGeo</span> = <span class="ck">new</span> THREE.SphereGeometry(
  <span class="cn">1</span>, <span class="cn">12</span>, <span class="cn">10</span>  <span class="cc">// bajo nº de segmentos = low-poly</span>
);
<span class="cc">// Deformar vértices para forma craneal</span>
<span class="ck">const</span> <span class="cv">pos</span> = headGeo.attributes.position;
<span class="ck">for</span> (<span class="ck">let</span> i = <span class="cn">0</span>; i < pos.count; i++) {
  <span class="ck">const</span> <span class="cv">y</span> = pos.getY(i);
  <span class="ck">if</span> (y < -<span class="cn">0.3</span>) pos.setY(i, y * <span class="cn">0.6</span>);
}
headGeo.computeVertexNormals();

<span class="cc">// Material translúcido con wireframe visible</span>
<span class="ck">const</span> <span class="cv">headMat</span> = <span class="ck">new</span> THREE.MeshStandardMaterial({
  color: <span class="cn">0xf0dcc8</span>,
  roughness: <span class="cn">0.7</span>,
  transparent: <span class="ck">true</span>,
  opacity: <span class="cn">0.72</span>,
});

<span class="cc">// Wireframe superpuesto (malla poligonal)</span>
<span class="ck">const</span> <span class="cv">wireMat</span> = <span class="ck">new</span> THREE.MeshBasicMaterial({
  color: <span class="cn">0xef4444</span>,
  wireframe: <span class="ck">true</span>,
  transparent: <span class="ck">true</span>,
  opacity: <span class="cn">0.18</span>,
});

<span class="cc">// Plano de corte axial animado</span>
<span class="ck">const</span> <span class="cv">cutPlane</span> = <span class="ck">new</span> THREE.Mesh(
  <span class="ck">new</span> THREE.PlaneGeometry(<span class="cn">3</span>, <span class="cn">3</span>),
  <span class="ck">new</span> THREE.MeshBasicMaterial({
    color: <span class="cn">0x00d4ff</span>,
    transparent: <span class="ck">true</span>,
    opacity: <span class="cn">0.18</span>,
    side: THREE.DoubleSide,
  })
);
<span class="cc">// El plano sube y baja simulando el barrido TC</span>
cutPlane.position.y = Math.sin(t * <span class="cn">0.6</span>) * <span class="cn">1.1</span>;`,

  build(scene) {
    // Luces
    scene.add(new THREE.AmbientLight(0xffeedd, 0.5));
    const dir = new THREE.DirectionalLight(0xffffff, 1.1);
    dir.position.set(4, 8, 6);
    dir.castShadow = true;
    scene.add(dir);
    const rimLight = new THREE.PointLight(0x4488ff, 0.8, 10);
    rimLight.position.set(-3, 2, -4);
    scene.add(rimLight);

    // Cabeza low-poly (cráneo)
    const headGeo = new THREE.SphereGeometry(1, 12, 10);
    const pos = headGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      if (y < -0.2) pos.setY(i, y * 0.55);
      if (z > 0.5 && y > 0) pos.setZ(i, z * 1.12);
      if (z < -0.4) pos.setZ(i, z * 1.08);
      if (Math.abs(x) > 0.7 && y > 0.1) pos.setX(i, x * 0.92);
    }
    headGeo.computeVertexNormals();

    const headMat = new THREE.MeshStandardMaterial({
      color: 0xf0dcc8, roughness: 0.68, metalness: 0.04,
      transparent: true, opacity: 0.78
    });
    const head = new THREE.Mesh(headGeo, headMat);
    head.castShadow = true;
    head.position.y = 0.2;
    scene.add(head);

    // Wireframe poligonal
    const wire = new THREE.Mesh(
      headGeo,
      new THREE.MeshBasicMaterial({
        color: 0xef4444, wireframe: true, transparent: true, opacity: 0.22
      })
    );
    wire.position.y = 0.2;
    scene.add(wire);

    // Aristas resaltadas (EdgesGeometry)
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(headGeo),
      new THREE.LineBasicMaterial({ color: 0xcc2233, transparent: true, opacity: 0.35 })
    );
    edges.position.y = 0.2;
    scene.add(edges);

    // Cuello
    const neck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.38, 0.6, 10),
      new THREE.MeshStandardMaterial({ color: 0xe8ccb4, roughness: 0.75 })
    );
    neck.position.y = -0.72;
    scene.add(neck);

    const neckWire = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.38, 0.6, 10),
      new THREE.MeshBasicMaterial({ color: 0xef4444, wireframe: true, transparent: true, opacity: 0.15 })
    );
    neckWire.position.y = -0.72;
    scene.add(neckWire);

    // Órbitas oculares
    [-0.32, 0.32].forEach(xOff => {
      const orbit = new THREE.Mesh(
        new THREE.SphereGeometry(0.16, 8, 6),
        new THREE.MeshStandardMaterial({ color: 0x1a0a06, roughness: 0.9 })
      );
      orbit.position.set(xOff, 0.35, 0.9);
      scene.add(orbit);
      const orbitEdge = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.SphereGeometry(0.17, 8, 6)),
        new THREE.LineBasicMaterial({ color: 0xff6633, transparent: true, opacity: 0.5 })
      );
      orbitEdge.position.set(xOff, 0.35, 0.9);
      scene.add(orbitEdge);
    });

    // Marcadores de vértices (puntos rojos)
    const dotGeo = new THREE.SphereGeometry(0.035, 5, 4);
    const dotMat = new THREE.MeshBasicMaterial({ color: 0xff2244 });
    for (let i = 0; i < pos.count; i += 3) {
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.set(pos.getX(i), pos.getY(i) + 0.2, pos.getZ(i));
      scene.add(dot);
    }

    // Plano de corte axial (barrido TC)
    const planeMat = new THREE.MeshBasicMaterial({
      color: 0x00d4ff, transparent: true, opacity: 0.16, side: THREE.DoubleSide
    });
    const cutPlane = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 2.8), planeMat);
    cutPlane.rotation.x = Math.PI / 2;
    scene.add(cutPlane);

    const cutEdge = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.PlaneGeometry(2.8, 2.8)),
      new THREE.LineBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.6 })
    );
    cutEdge.rotation.x = Math.PI / 2;
    scene.add(cutEdge);

    // Eje sagital de referencia
    const axisLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, -1.5, 0), new THREE.Vector3(0, 1.5, 0)
      ]),
      new THREE.LineBasicMaterial({ color: 0x22c55e, transparent: true, opacity: 0.3 })
    );
    scene.add(axisLine);

    // Grid
    const grid = new THREE.GridHelper(12, 24, 0x0f2035, 0x060810);
    grid.position.y = -1.4;
    scene.add(grid);

    // Zona de anomalía pulsante
    const anomGeo = new THREE.SphereGeometry(0.18, 7, 5);
    const anomMat = new THREE.MeshStandardMaterial({
      color: 0xff1111, emissive: 0xff0000, emissiveIntensity: 0.6,
      transparent: true, opacity: 0.7
    });
    const anomaly = new THREE.Mesh(anomGeo, anomMat);
    anomaly.position.set(0.45, 0.5, 0.55);
    scene.add(anomaly);

    // Luz de escaneo
    const scanLight = new THREE.PointLight(0x00d4ff, 0.9, 4);
    scene.add(scanLight);

    return { head, wire, edges, neck, cutPlane, cutEdge, anomaly, anomMat, scanLight };
  },

  animate(obj, t) {
    // Rotación lenta del modelo
    obj.head.rotation.y  = t * 0.18;
    obj.wire.rotation.y  = t * 0.18;
    obj.edges.rotation.y = t * 0.18;
    obj.neck.rotation.y  = t * 0.18;

    // Plano de corte sube y baja (barrido TC)
    const cutY = Math.sin(t * 0.55) * 1.1;
    obj.cutPlane.position.y = cutY;
    obj.cutEdge.position.y  = cutY;
    obj.scanLight.position.set(0, cutY, 2);

    // Anomalía pulsa y rota con el cráneo
    obj.anomaly.rotation.y  = t * 0.18;
    obj.anomaly.position.x  = Math.cos(t * 0.18) * 0.62 - Math.sin(t * 0.18) * 0.3 + 0.1;
    obj.anomaly.position.z  = Math.sin(t * 0.18) * 0.62 + Math.cos(t * 0.18) * 0.3;
    const pulse = 0.45 + 0.45 * Math.abs(Math.sin(t * 2.5));
    obj.anomMat.emissiveIntensity = pulse;
    obj.anomMat.opacity = 0.55 + 0.35 * Math.abs(Math.sin(t * 2.5));
  }
};
