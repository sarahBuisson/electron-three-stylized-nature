import type { InventoryItem } from './inventory.model'

export function updateInventoryAnimationQueue(
  previousIds: ReadonlySet<string>,
  queue: readonly string[],
  items: readonly InventoryItem[],
  reducedMotion: boolean,
): string[] {
  if (reducedMotion) return []

  const currentIds = new Set(items.map((item) => item.id))
  const pending = queue.filter((id) => currentIds.has(id))
  const queuedIds = new Set(pending)

  for (const item of items) {
    if (!previousIds.has(item.id) && !queuedIds.has(item.id)) {
      pending.push(item.id)
      queuedIds.add(item.id)
    }
  }

  return pending
}
