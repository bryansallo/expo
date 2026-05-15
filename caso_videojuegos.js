// ══════════════════════════════════════════════
//  CASO 1 — VIDEOJUEGOS (INTERACTIVO)
// ══════════════════════════════════════════════
const casoVideojuegos = {
  sector: "Videojuegos",
  title: "Personaje con hitbox de colisión",
  desc: "Controla el personaje con WASD o las flechas del teclado. ESPACIO para saltar. Esquiva el proyectil amarillo. La hitbox roja muestra la caja de colisión real.",
  problem: "Calcular colisiones sobre la malla poligonal completa del personaje es costoso y lento a 60 fps.",
  solution: "Se usa una BoxGeometry simplificada como hitbox. El motor solo evalúa esa caja, no los miles de polígonos del modelo.",
  color: 0x3b82f6,
  code: `<span class="cc">// ─── Teclas presionadas (registro en tiempo real) ──</span>
<span class="ck">const</span> <span class="cv">keys</span> = {};
window.addEventListener(<span class="cs">'keydown'</span>, e => keys[e.code] = <span class="ck">true</span>);
window.addEventListener(<span class="cs">'keyup'</span>,   e => keys[e.code] = <span class="ck">false</span>);

<span class="cc">// ─── En cada frame: mover según teclas activas ─────</span>
<span class="ck">const</span> <span class="cv">vel</span> = <span class="cn">0.06</span>; <span class="cc">// velocidad de movimiento</span>
<span class="ck">if</span> (keys[<span class="cs">'KeyW'</span>] || keys[<span class="cs">'ArrowUp'</span>])    player.position.z -= vel;
<span class="ck">if</span> (keys[<span class="cs">'KeyS'</span>] || keys[<span class="cs">'ArrowDown'</span>])  player.position.z += vel;
<span class="ck">if</span> (keys[<span class="cs">'KeyA'</span>] || keys[<span class="cs">'ArrowLeft'</span>])  player.position.x -= vel;
<span class="ck">if</span> (keys[<span class="cs">'KeyD'</span>] || keys[<span class="cs">'ArrowRight'</span>]) player.position.x += vel;

<span class="cc">// ─── Salto con gravedad simple ──────────────────────</span>
<span class="ck">if</span> (keys[<span class="cs">'Space'</span>] && enSuelo) {
  velY = <span class="cn">0.15</span>;   <span class="cc">// impulso inicial hacia arriba</span>
  enSuelo = <span class="ck">false</span>;
}
velY -= <span class="cn">0.008</span>;          <span class="cc">// gravedad: resta velocidad cada frame</span>
player.position.y += velY;
<span class="ck">if</span> (player.position.y <= suelo) { <span class="cc">// toca el suelo</span>
  player.position.y = suelo;
  velY = <span class="cn">0</span>;
  enSuelo = <span class="ck">true</span>;
}

<span class="cc">// ─── Colisión AABB proyectil ↔ hitbox ──────────────</span>
<span class="ck">const</span> <span class="cv">golpe</span> = playerBox.intersectsBox(bulletBox);`,

  build(scene) {
    addFloor(scene, 0x0a1020);
    addLights(scene);

    const playerGroup = new THREE.Group();

    const body = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.5, 1.2, 8, 16),
      new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.4, metalness: 0.3 })
    );
    body.castShadow = true;

    const eyeGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-0.18, 0.55, 0.44);
    eyeR.position.set( 0.18, 0.55, 0.44);

    playerGroup.add(body, eyeL, eyeR);
    playerGroup.position.set(0, 0.1, 0);
    scene.add(playerGroup);

    const hitbox = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 2.2, 1.1),
      new THREE.MeshBasicMaterial({ color: 0xff3333, wireframe: true, transparent: true, opacity: 0.45 })
    );
    scene.add(hitbox);

    const bullet = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0xffdd00, emissive: 0xffaa00, emissiveIntensity: 1.2 })
    );
    bullet.position.set(-6, 0.1, 0);
    scene.add(bullet);

    const bulletLight = new THREE.PointLight(0xffdd00, 1.5, 3);
    scene.add(bulletLight);

    const grid = new THREE.GridHelper(14, 28, 0x1a3050, 0x0f2035);
    grid.position.y = -1.0;
    scene.add(grid);

    const keys = {};
    const onKey = e => { keys[e.code] = e.type === 'keydown'; };
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup',   onKey);

    let velY    = 0;
    let enSuelo = true;
    const SUELO = 0.1;

    const playerBox = new THREE.Box3();
    const bulletBox = new THREE.Box3();

    const estado = { hp: 100, hitCooldown: 0 };

    return { playerGroup, hitbox, bullet, bulletLight,
             keys, playerBox, bulletBox, estado,
             velY, enSuelo, SUELO, onKey };
  },

  animate(obj, t) {
    const VEL = 0.06;

    if (obj.keys['KeyW'] || obj.keys['ArrowUp'])    obj.playerGroup.position.z -= VEL;
    if (obj.keys['KeyS'] || obj.keys['ArrowDown'])  obj.playerGroup.position.z += VEL;
    if (obj.keys['KeyA'] || obj.keys['ArrowLeft'])  obj.playerGroup.position.x -= VEL;
    if (obj.keys['KeyD'] || obj.keys['ArrowRight']) obj.playerGroup.position.x += VEL;

    obj.playerGroup.position.x = Math.max(-5, Math.min(5, obj.playerGroup.position.x));
    obj.playerGroup.position.z = Math.max(-4, Math.min(4, obj.playerGroup.position.z));

    if ((obj.keys['Space'] || obj.keys['KeyW']) && obj.enSuelo) {
      obj.velY    = 0.15;
      obj.enSuelo = false;
    }
    obj.velY -= 0.008;
    obj.playerGroup.position.y += obj.velY;

    if (obj.playerGroup.position.y <= obj.SUELO) {
      obj.playerGroup.position.y = obj.SUELO;
      obj.velY    = 0;
      obj.enSuelo = true;
    }

    obj.hitbox.position.copy(obj.playerGroup.position);

    obj.bullet.position.x += 0.08;
    if (obj.bullet.position.x > 6) obj.bullet.position.x = -6;
    obj.bulletLight.position.copy(obj.bullet.position);

    obj.playerBox.setFromObject(obj.hitbox);
    obj.bulletBox.setFromObject(obj.bullet);
    const isHit = obj.playerBox.intersectsBox(obj.bulletBox);

    obj.hitbox.material.color.set(isHit ? 0xff0000 : 0xff3333);
    obj.hitbox.material.opacity = isHit ? 0.85 : 0.45;

    if (isHit && obj.estado.hitCooldown <= 0) {
      obj.estado.hp = Math.max(0, obj.estado.hp - 10);
      obj.estado.hitCooldown = 0.5;
    }
    if (obj.estado.hitCooldown > 0) obj.estado.hitCooldown -= 0.016;

    const bar    = document.getElementById('hud-bar');
    const hp     = document.getElementById('hud-hp');
    const status = document.getElementById('hud-status');
    const hit    = document.getElementById('hud-hit');
    const score  = document.getElementById('hud-score');
    if (!bar) return;

    score.textContent  = Math.floor(t * 5);
    hp.textContent     = obj.estado.hp;
    bar.style.width    = obj.estado.hp + '%';
    bar.style.background = obj.estado.hp > 50
      ? 'linear-gradient(90deg,#22c55e,#86efac)'
      : obj.estado.hp > 25
        ? 'linear-gradient(90deg,#f59e0b,#fcd34d)'
        : 'linear-gradient(90deg,#ef4444,#fca5a5)';
    status.textContent = isHit ? '¡GOLPE!' : (obj.enSuelo ? 'EN SUELO' : 'EN AIRE');
    hit.textContent    = isHit ? 'SÍ' : 'NO';
    hit.className      = 'hud-val' + (isHit ? ' hit' : '');
  }
};
