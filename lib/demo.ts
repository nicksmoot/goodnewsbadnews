export function isDemoModeEnabled() {
  return process.env.ALLOW_DEMO_MODE === "true";
}

export function requireConfigured(name: string, value: string | undefined) {
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}
