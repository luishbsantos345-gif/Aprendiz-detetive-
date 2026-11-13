import * as THREE from "three";

/**
 * Cena de fundo do M0. Serve só para provar que o renderer sobe no aparelho:
 * um pedaço de almoxarifado em caixas. Sai no M1, quando entra o setor real.
 * Geometria gerada em código: nenhum asset externo.
 */
export function iniciarCenaTeste(canvas: HTMLCanvasElement): boolean {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: "high-performance" });
  } catch {
    return false; // sem WebGL: o lobby continua funcionando
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

  const cena = new THREE.Scene();
  cena.background = new THREE.Color(0x14181f);
  cena.fog = new THREE.Fog(0x14181f, 10, 34);

  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 60);

  cena.add(new THREE.HemisphereLight(0xffe2b0, 0x1a1d24, 0.9));
  const lampada = new THREE.PointLight(0xf2a93b, 60, 30);
  lampada.position.set(0, 6, 0);
  cena.add(lampada);

  const chao = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 60),
    new THREE.MeshStandardMaterial({ color: 0x2a2f38, roughness: 0.95 }),
  );
  chao.rotation.x = -Math.PI / 2;
  cena.add(chao);

  // Caixas em instancing: 1 draw call para todas.
  const quantidade = 90;
  const caixas = new THREE.InstancedMesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0xb98a55, roughness: 0.85 }),
    quantidade,
  );
  const m = new THREE.Matrix4();
  const cor = new THREE.Color();
  let semente = 7;
  const sorteio = () => ((semente = (semente * 16807) % 2147483647) - 1) / 2147483646;
  for (let i = 0; i < quantidade; i++) {
    const corredor = (i % 6) - 2.5;
    const nivel = Math.floor(sorteio() * 4);
    m.makeTranslation(corredor * 4.2, 0.5 + nivel * 1.02, -14 + Math.floor(i / 6) * 2 + sorteio() * 0.3);
    caixas.setMatrixAt(i, m);
    caixas.setColorAt(i, cor.setHSL(0.08 + sorteio() * 0.03, 0.4, 0.38 + sorteio() * 0.14));
  }
  cena.add(caixas);

  const ajustar = () => {
    const largura = canvas.clientWidth || window.innerWidth;
    const altura = canvas.clientHeight || window.innerHeight;
    renderer.setSize(largura, altura, false);
    camera.aspect = largura / altura;
    camera.updateProjectionMatrix();
  };
  ajustar();
  window.addEventListener("resize", ajustar);

  const semMovimento = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  renderer.setAnimationLoop((tempo) => {
    const angulo = semMovimento ? 0.6 : tempo * 0.00008;
    camera.position.set(Math.sin(angulo) * 15, 5.5, Math.cos(angulo) * 15);
    camera.lookAt(0, 1.5, 0);
    renderer.render(cena, camera);
  });
  return true;
}
