export interface InventoryItem {
  id: string
  name: string
  type: string
  quantity: number
  urlImage?: string
  description?: string
}

const INVENTORY_STORAGE_KEY = 'etb.inventory.v1'

export function createCameraInventoryItem(urlImage = '/inventory/camera.png'): InventoryItem {
  return {
    id: 'camera',
    name: 'Camera',
    type: 'Objet',
    quantity: 1,
    urlImage,
    description: 'Clique pour ajouter une nouvelle photo.',
  }
}

export function createPhotoInventoryItem(urlImage: string, index = 1): InventoryItem {
  return {
    id: `photo-${Date.now()}-${index}`,
    name: `Photo ${index}`,
    type: 'Photo',
    quantity: 1,
    urlImage,
    description: 'Nouvelle photo ajoutée à l’inventaire.',
  }
}

export function readInventory(initialUrl = '/inventory/camera.png'): InventoryItem[] {
  if (typeof window === 'undefined') {
    return [createCameraInventoryItem(initialUrl)]
  }

  try {
    const raw = window.localStorage.getItem(INVENTORY_STORAGE_KEY)
    if (!raw) {
      const initialItems = [createCameraInventoryItem(initialUrl)]
      writeInventory(initialItems)
      return initialItems
    }

    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as InventoryItem[]) : [createCameraInventoryItem(initialUrl)]
  } catch {
    return [createCameraInventoryItem(initialUrl)]
  }
}

export function writeInventory(items: InventoryItem[]): void {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(items))
}
