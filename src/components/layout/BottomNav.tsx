interface BottomNavProps {
  onAdd?: () => void
  onMenu?: () => void

  activeTab?: string
  onChange?: (tab: string) => void
  onQuickAdd?: () => void
}

export function BottomNav({
  onAdd,
  onMenu,
}: BottomNavProps) {
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        background: '#FEFBFF',
        borderTop: '1px solid #D0D7E2',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}
    >
      <button onClick={onAdd}>Tambah</button>
      <button onClick={onMenu}>Menu</button>
    </nav>
  )
}
