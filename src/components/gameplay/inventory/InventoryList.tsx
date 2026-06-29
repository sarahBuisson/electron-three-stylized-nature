import './InventoryList.css'
import type { InventoryItem } from './inventory.model'

interface InventoryListProps {
  items: InventoryItem[]
  onCameraClick?: () => void
}

export function InventoryList({ items, onCameraClick }: InventoryListProps) {
  return (
    <div className="inventory-bar" aria-label="inventaire">
      <div className="inventory-bar__header">
        <span>Inventaire</span>
        <small>{items.length} objet{items.length > 1 ? 's' : ''}</small>
      </div>

      <div className="inventory-bar__items">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className="inventory-item"
            onClick={() => {
              if (item.id === 'camera' && onCameraClick) {
                onCameraClick()
              }
            }}
          >
            <div className="inventory-item__media">
              {item.urlImage ? (
                <img src={item.urlImage} alt={item.name} />
              ) : (
                <span>📦</span>
              )}
            </div>

            <div className="inventory-item__info">
              <strong>{item.name}</strong>
              <span>{item.type}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

