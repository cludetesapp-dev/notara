import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, ArrowLeftRight, Plus, Package, Menu } from 'lucide-react'

interface BottomNavProps {
  onAdd?:  () => void
  onMenu?: () => void
}

export function BottomNav({ onAdd, onMenu }: BottomNavProps) {
  const navigate   = useNavigate()
  const { pathname } = useLocation()
  const active = (p: string) => p === '/' ? pathname === '/' : pathname.startsWith(p)

  return (
    <nav className="bottom-nav">
      <button className={`nav-item${active('/') ? ' active' : ''}`}
        onClick={() => navigate('/')} aria-label="Dashboard">
        <LayoutDashboard size={20} />
        <span className="nav-item-label">Dashboard</span>
      </button>

      <button className={`nav-item${active('/transactions') ? ' active' : ''}`}
        onClick={() => navigate('/transactions')} aria-label="Transaksi">
        <ArrowLeftRight size={20} />
        <span className="nav-item-label">Transaksi</span>
      </button>

      <button className="nav-add" onClick={onAdd} aria-label="Tambah transaksi">
        <Plus size={24} strokeWidth={2.5} />
      </button>

      <button className={`nav-item${active('/products') ? ' active' : ''}`}
        onClick={() => navigate('/products')} aria-label="Barang">
        <Package size={20} />
        <span className="nav-item-label">Barang</span>
      </button>

      <button className="nav-item" onClick={onMenu} aria-label="Menu">
        <Menu size={20} />
        <span className="nav-item-label">Menu</span>
      </button>
    </nav>
  )
}
