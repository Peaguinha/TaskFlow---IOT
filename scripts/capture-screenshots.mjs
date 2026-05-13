import { chromium } from "playwright-chromium";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = "https://91511164-3000-4b10-852f-fc254bd8b99c-00-qt1797t1mb8i.expo.spock.replit.dev";
const OUT = path.join(__dirname, "../assets/screenshots");
const VIEWPORT = { width: 390, height: 844 };
const CHROMIUM_PATH = "/nix/store/qa9cnw4v5xkxyip6mb9kxqfq1z4x2dx1-chromium-138.0.7204.100/bin/chromium";

async function shot(page, name) {
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/${name}.png`, clip: { x: 0, y: 0, width: 390, height: 844 } });
  console.log(`✓ ${name}.png`);
}

async function goToWelcome(page) {
  await page.goto(BASE_URL, { waitUntil: "networkidle", timeout: 20000 });
  await page.waitForTimeout(800);
}

async function doLogin(page) {
  // Click the "Entrar" div button on welcome screen (first one in the list)
  await page.locator("div").filter({ hasText: /^Entrar$/ }).first().click();
  await page.waitForTimeout(700);
  // Fill inputs
  const inputs = page.locator("input");
  await inputs.first().fill("usuario@taskflow.com");
  const cnt = await inputs.count();
  if (cnt > 1) await inputs.nth(1).fill("123456");
  await page.waitForTimeout(300);
  // Click submit — last "Entrar" div (the button inside the login form)
  await page.locator("div").filter({ hasText: /^Entrar$/ }).last().click();
  await page.waitForTimeout(2500);
}

(async () => {
  const browser = await chromium.launch({
    executablePath: CHROMIUM_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
  });
  const page = await browser.newPage({ viewport: VIEWPORT });

  // ── 1. Welcome ────────────────────────────────────────────────────────────
  await goToWelcome(page);
  await shot(page, "welcome");

  // ── 2. Login screen ───────────────────────────────────────────────────────
  await page.locator("div").filter({ hasText: /^Entrar$/ }).first().click();
  await page.waitForTimeout(800);
  await shot(page, "login");

  // ── 3. Register screen ────────────────────────────────────────────────────
  await goToWelcome(page);
  await page.locator("div").filter({ hasText: /^Criar Conta$/ }).first().click();
  await page.waitForTimeout(800);
  await shot(page, "register");

  // ── 4. Dashboard ──────────────────────────────────────────────────────────
  await goToWelcome(page);
  await doLogin(page);
  await shot(page, "dashboard");

  // ── 5. Filters — click "Pendente" tab ────────────────────────────────────
  const filterOptions = ["Pendente", "Em Andamento", "Alta", "Média"];
  for (const f of filterOptions) {
    try {
      await page.locator("div").filter({ hasText: new RegExp(`^${f}$`) }).first().click({ timeout: 3000 });
      break;
    } catch (_) {}
  }
  await page.waitForTimeout(800);
  await shot(page, "filters");

  // ── 6. Create Task ────────────────────────────────────────────────────────
  await goToWelcome(page);
  await doLogin(page);
  // Try various create task button texts
  const createTexts = ["Nova Tarefa", "+ Nova", "Criar Tarefa", "Adicionar", "Nova"];
  for (const t of createTexts) {
    try {
      await page.locator("div").filter({ hasText: new RegExp(`^${t}$`) }).last().click({ timeout: 3000 });
      break;
    } catch (_) {
      try {
        await page.click(`text=${t}`, { timeout: 2000 });
        break;
      } catch (_) {}
    }
  }
  await page.waitForTimeout(1200);
  await shot(page, "create-task");

  // ── 7. Task details ───────────────────────────────────────────────────────
  await goToWelcome(page);
  await doLogin(page);
  await page.waitForTimeout(500);

  // Click first task card — look for known mock titles
  const taskKeywords = ["Preparar", "Estudar", "Comprar", "Revisar", "Ler", "Exerc", "Reuni", "Organiz", "React", "apresenta"];
  let clicked = false;
  for (const kw of taskKeywords) {
    try {
      await page.click(`text=${kw}`, { timeout: 2000 });
      clicked = true;
      break;
    } catch (_) {}
  }
  if (!clicked) {
    // Dump what's on screen for debugging
    const divTexts = await page.$$eval("div", els =>
      els.filter(el => el.textContent?.trim().length > 5 && el.textContent?.trim().length < 60 && el.children.length === 0)
         .map(el => el.textContent?.trim()).slice(0, 20)
    );
    console.log("Visible div texts:", divTexts);
  }
  await page.waitForTimeout(1200);
  await shot(page, "task-details");

  // ── 8. Update status ──────────────────────────────────────────────────────
  const statusOptions = ["Em Andamento", "Concluída", "Pendente", "Concluir", "Iniciar"];
  for (const s of statusOptions) {
    try {
      await page.locator("div").filter({ hasText: new RegExp(`^${s}$`) }).first().click({ timeout: 2500 });
      break;
    } catch (_) {
      try {
        await page.click(`text=${s}`, { timeout: 1500 });
        break;
      } catch (_) {}
    }
  }
  await page.waitForTimeout(800);
  await shot(page, "update-status");

  await browser.close();
  console.log("\nAll screenshots captured.");
})();
