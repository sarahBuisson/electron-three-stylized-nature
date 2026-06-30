import { useState } from 'react'
import './InventoryList.css'
import type { InventoryItem } from './inventory.model.ts'

interface InventoryListProps {
  items: InventoryItem[]
  onCameraClick?: () => void
}

export function InventoryList({ items, onCameraClick }: InventoryListProps) {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)

  const handleItemClick = (item: InventoryItem) => {


    if (item.id === 'camera' && onCameraClick) {
      onCameraClick();

    }else {
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
              className="inventory-item"
              onClick={() => handleItemClick(item)}
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

      {selectedItem ? (
        <div className="inventory-modal-overlay" role="dialog" aria-modal="true" aria-label={selectedItem.name}>
          <div className="inventory-modal">
            <button type="button" className="inventory-modal__close" onClick={() => setSelectedItem(null)}>
              Fermer
            </button>

            <div className="inventory-modal__media">
              {selectedItem.urlImage ? (
                <img src={selectedItem.urlImage} alt={selectedItem.name} />
              ) : (
                <span className="inventory-modal__fallback">📦</span>
              )}
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
