import './SnapshotGallery.css'

export interface SnapshotGalleryProps {
  snapshots: string[]
  onDelete?: (index: number) => void
}

export function SnapshotGallery({ snapshots, onDelete }: SnapshotGalleryProps) {
  if (snapshots.length === 0) {
    return null
  }

  return (
    <div className="snapshot-gallery">
      <div className="snapshot-gallery__header">
        <h3>Snapshots ({snapshots.length})</h3>
      </div>
      <div className="snapshot-gallery__container">
        {snapshots.map((snapshot, index) => (
          <div key={index} className="snapshot-gallery__item">
            <img src={snapshot} alt={`Snapshot ${index + 1}`} />
            <button
              className="snapshot-gallery__delete"
              onClick={() => onDelete?.(index)}
              title="Delete snapshot"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

