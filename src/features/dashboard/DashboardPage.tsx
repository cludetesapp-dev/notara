import { useDashboardData } from './useDashboardData'
import { SummaryCards }      from './SummaryCards'
import { TrendChart }        from './TrendChart'
import { TopProducts }       from './TopProducts'
import { RecentTransactions } from './RecentTransactions'

// Skeleton loader — farm-v4 style shimmer
function SkeletonBlock({ h = 80 }: { h?: number }) {
  return (
    <div
      style={{
        background: 'linear-gradient(90deg, #e8f0e8 25%, #f0fdf4 50%, #e8f0e8 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.4s infinite',
        borderRadius: 'var(--r-lg)',
        height: h,
        marginBottom: 8,
      }}
    />
  )
}

export default function DashboardPage() {
  const { today, month, trend, topProducts, recentTx, rp, loading } = useDashboardData()

  return (
    <>
      {/* Inline shimmer keyframe */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div className="page-scroll">
        <div className="wrap">

          {loading ? (
            <>
              <SkeletonBlock h={108} />
              <SkeletonBlock h={60} />
              <SkeletonBlock h={80} />
              <SkeletonBlock h={160} />
              <SkeletonBlock h={200} />
              <SkeletonBlock h={200} />
            </>
          ) : (
            <>
              <SummaryCards today={today} month={month} rp={rp} />
              <TrendChart data={trend} />
              <TopProducts products={topProducts} />
              <RecentTransactions transactions={recentTx} />
            </>
          )}

        </div>
      </div>
    </>
  )
}
