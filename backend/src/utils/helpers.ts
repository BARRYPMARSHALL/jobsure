export function generateId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 24; i++) id += chars.charAt(Math.floor(Math.random() * chars.length));
  return id;
}
