import { useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'
import './InventoryList.css'
import type { InventoryItem } from './inventory.model.ts'
import { updateInventoryAnimationQueue } from './inventoryAnimationQueue'

interface InventoryListProps {
  items: InventoryItem[]
  onCameraClick?: () => void
}

const motionQuery = '(prefers-reduced-motion: reduce)'

function subscribeToMotionPreference(onChange: () => void) {
  const preference = window.matchMedia(motionQuery)
  preference.addEventListener('change', onChange)
  return () => preference.removeEventListener('change', onChange)
}

function prefersReducedMotion() {
  return window.matchMedia(motionQuery).matches
}

function serverPrefersReducedMotion() {
  return true
}

function InventoryImage({ item }: { item: InventoryItem }) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null)

  return item.urlImage && item.urlImage !== failedUrl ? (
    <img
      className={item.type === 'Photo' ? 'inventory-photo' : undefined}
      src={item.urlImage}
      alt={item.name}
      onError={() => setFailedUrl(item.urlImage ?? null)}
    />
  ) : (
    <span aria-label={item.name}>📦</span>
  )
}

export function InventoryList({ items, onCameraClick }: InventoryListProps) {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [queue, setQueue] = useState<string[]>([])
  const reducedMotion = useSyncExternalStore(subscribeToMotionPreference, prefersReducedMotion, serverPrefersReducedMotion)
  const previousIds = useRef(new Set(items.map((item) => item.id)))
  const mediaElements = useRef(new Map<string, HTMLDivElement>())
  const animationElement = useRef<HTMLDivElement>(null)
  const activeId = queue[0]
  const activeItem = items.find((item) => item.id === activeId)
  const hasActiveItem = Boolean(activeItem)

  useLayoutEffect(() => {
    const previous = previousIds.current
    previousIds.current = new Set(items.map((item) => item.id))
    setQueue((current) => {
      const next = updateInventoryAnimationQueue(previous, current, items, reducedMotion)
      return next.length === current.length && next.every((id, index) => id === current[index]) ? current : next
    })
  }, [items, reducedMotion])

  useLayoutEffect(() => {
    if (!activeId || !hasActiveItem || reducedMotion) return

    const overlay = animationElement.current
    const target = mediaElements.current.get(activeId)
    if (!overlay || !target) {
      setQueue((current) => current.filter((id) => id !== activeId))
      return
    }

    let frame = 0
    let started: number | undefined
    const holdDuration = 5000
    const travelDuration = 700

    const animate = (time: number) => {
      started ??= time
      const elapsed = time - started
      const travel = Math.min(Math.max(0, (elapsed - holdDuration) / travelDuration), 1)
      const eased = 1 - (1 - travel) ** 3
      const destination = target.getBoundingClientRect()
      const width = window.innerWidth + (destination.width - window.innerWidth) * eased
      const height = window.innerHeight + (destination.height - window.innerHeight) * eased
      overlay.style.left = `${destination.left * eased}px`
      overlay.style.top = `${destination.top * eased}px`
      overlay.style.width = `${width}px`
      overlay.style.height = `${height}px`
      overlay.style.borderRadius = `${10 * eased}px`
      overlay.style.fontSize = `${Math.min(window.innerWidth, window.innerHeight) * 0.3 * (1 - eased) + 16 * eased}px`
      overlay.style.setProperty('--photo-size', `${80 + 20 * eased}%`)
      overlay.style.setProperty('--photo-border-width', `${20 - 15 * eased}px`)

      if (travel < 1 && target.isConnected) {
        frame = window.requestAnimationFrame(animate)
      } else {
        setQueue((current) => current.filter((id) => id !== activeId))
      }
    }

    const image = overlay.querySelector('img')
    const start = () => { frame = window.requestAnimationFrame(animate) }
    if (image && !image.complete) {
      image.addEventListener('load', start, { once: true })
      image.addEventListener('error', start, { once: true })
    } else {
      start()
    }

    return () => {
      window.cancelAnimationFrame(frame)
      image?.removeEventListener('load', start)
      image?.removeEventListener('error', start)
    }
  }, [activeId, hasActiveItem, reducedMotion])

  const handleItemClick = (item: InventoryItem) => {
    if (item.id === 'camera' && onCameraClick) {
      onCameraClick()
    } else {
      setSelectedItem(item)
    }
  }

  return (
    <>
      <div className="inventory-bar" aria-label="inventaire">
        <div className="inventory-bar__header">
          <span>Inventory</span>
          <small>{items.length} objet{items.length > 1 ? 's' : ''}</small>
        </div>

        <div className="inventory-bar__items">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`inventory-item${queue.includes(item.id) ? ' inventory-item--pending' : ''}`}
              disabled={queue.includes(item.id)}
              onClick={() => handleItemClick(item)}
            >
              <div
                className="inventory-item__media"
                ref={(element) => {
                  if (element) mediaElements.current.set(item.id, element)
                  else mediaElements.current.delete(item.id)
                }}
              >
                <InventoryImage item={item} />
              </div>

              <div className="inventory-item__info">
                <strong>{item.name}</strong>
                <span>{item.type}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {activeItem && !reducedMotion ? (
        <div className="inventory-add-animation" ref={animationElement} aria-hidden="true">
          <InventoryImage key={activeItem.id} item={activeItem} />
        </div>
      ) : null}

      {selectedItem ? (
        <div className="inventory-modal-overlay" role="dialog" aria-modal="true" aria-label={selectedItem.name}>
          <div className="inventory-modal">
            <button type="button" className="inventory-modal__close" onClick={() => setSelectedItem(null)}>
              Fermer
            </button>

            <div className="inventory-modal__media">
              <InventoryImage item={selectedItem} />
            </div>

            <div className="inventory-modal__message">
              <h3>{selectedItem.name}</h3>
              <p>{selectedItem.description ?? 'Cet objet a été ajouté à votre inventaire.'}</p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
