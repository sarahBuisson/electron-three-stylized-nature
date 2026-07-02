export interface InventoryItem {
  id: string
  name: string
  type: string
  quantity: number
  urlImage?: string
  description?: string
}

const INVENTORY_STORAGE_KEY = 'etb.inventory.v1'

function getInventoryStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return window.localStorage
  } catch {
    return null
  }
}

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
export function createSolutionPhotoInventoryItem(urlImage): InventoryItem {
  return {
    id: 'camera',
    name: 'Photo',
    type: 'Photo',
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
    description: 'new picture taken',
  }
}

export function readInventory(initialUrl = './inventory/camera.png'): InventoryItem[] {
 return [createCameraInventoryItem(initialUrl)]
}

export function writeInventory(items: InventoryItem[]): void {
  const storage = getInventoryStorage()
  if (!storage) {
    return
  }

  storage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(items))
}
