export function logger(msg: string) {
  console.log(`[${new Date().toISOString()} LOG] ${msg}`);
}
