const userAgent = process.env.npm_config_user_agent || "";
const lifecycleEvent = process.env.npm_lifecycle_event || "";

if (!userAgent || userAgent.startsWith("pnpm/")) {
  process.exit(0);
}

const manager = userAgent.split(" ")[0] || "npm";
const commandByLifecycleEvent = {
  preinstall: "pnpm install",
  predev: "pnpm run dev",
  prebuild: "pnpm run build",
  prelint: "pnpm run lint",
  prepreview: "pnpm run preview",
};
const suggestedCommand =
  commandByLifecycleEvent[lifecycleEvent] || "pnpm <comando>";

console.error("");
console.error("Este frontend usa pnpm, no npm.");
console.error(`Detectado: ${manager}`);
console.error(`Usa: ${suggestedCommand}`);
console.error("");

process.exit(1);
