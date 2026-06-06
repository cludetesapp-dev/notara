import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  ArrowLeftRight,
  Plus,
  Package,
  Menu
} from 'lucide-react'

interface BottomNavProps {
  onAdd?: () => void
  onMenu?: () => void
}

export function BottomNav({ onAdd, onMenu }: BottomNavProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const active = (path: string) =>
    path === '/'
      ? pathname === '/'
      : pathname.startsWith(path)

  return (
    <nav className="bottom-nav">
      <NavItem
        icon={<LayoutDashboard size={22} />}
        label="Dashboard"
        isActive={active('/')}
        onClick={() => navigate('/')}
      />

      <NavItem
        icon={<ArrowLeftRight size={22} />}
        label="Transaksi"
        isActive={active('/transactions')}
        onClick={() => navigate('/transactions')}
      />

      <button
        className="nav-add"
        onClick={onAdd}
        aria-label="Tambah Transaksi"
      >
        <Plus size={24} />
      </button>

      <NavItem
        icon={<Package size={22} />}
        label="Barang"
        isActive={active('/products')}
        onClick={() => navigate('/products')}
      />

      <NavItem
        icon={<Menu size={22} />}
        label="Menu"
        isActive={false}
        onClick={onMenu}
      />
    </nav>
  )
}

function NavItem({
  icon,
  label,
  isActive,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  isActive: boolean
  onClick?: () => void
}) {
  return (
    <button
      className={`nav-item${isActive ? ' active' : ''}`}
      onClick={onClick}
    >
      <div className="nav-item-indicator">{icon}</div>
      <span className="nav-item-label">{label}</span>
    </button>
  )
}
