import { describe, expect, it } from 'vitest'
import type { InventoryItem } from './inventory.model'
import { updateInventoryAnimationQueue } from './inventoryAnimationQueue'

const item = (id: string): InventoryItem => ({ id, name: id, type: 'Objet', quantity: 1 })

describe('updateInventoryAnimationQueue', () => {
  it('ignores existing objects and changes to their properties', () => {
    expect(updateInventoryAnimationQueue(new Set(['camera']), [], [{ ...item('camera'), quantity: 2 }], false)).toEqual([])
  })

  it('queues new objects in order after the pending objects', () => {
    expect(updateInventoryAnimationQueue(
      new Set(['camera', 'first']),
      ['first'],
      [item('camera'), item('first'), item('second'), item('third')],
      false,
    )).toEqual(['first', 'second', 'third'])
  })

  it('removes objects no longer present and avoids duplicate queue entries', () => {
    expect(updateInventoryAnimationQueue(
      new Set(['camera', 'removed']),
      ['removed', 'new'],
      [item('camera'), item('new'), item('new')],
      false,
    )).toEqual(['new'])
  })

  it('animates an object re-added after removal', () => {
    expect(updateInventoryAnimationQueue(new Set(['camera']), [], [item('camera'), item('photo')], false))
      .toEqual(['photo'])
  })

  it('clears and skips the queue for reduced motion', () => {
    expect(updateInventoryAnimationQueue(new Set(['camera']), ['photo'], [item('camera'), item('photo')], true))
      .toEqual([])
  })
})
