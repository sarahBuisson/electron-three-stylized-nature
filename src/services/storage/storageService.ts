import type { StoragePort } from './StoragePort'
import { WebStorageAdapter } from './WebStorageAdapter'

export const storageService: StoragePort = new WebStorageAdapter()

