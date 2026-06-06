import { useDashboardData } from './useDashboardData'
import { SummaryCards }      from './SummaryCards'
import { TrendChart }        from './TrendChart'
import { TopProducts }       from './TopProducts'
import { RecentTransactions } from './RecentTransactions'

function SkeletonBlock({ h = 80 }: { h?: number }) {
  return (
    <div
      className="skeleton"
      style={{ height: h }}
    />
  )
}

export default function DashboardPage() {
  const { today, month, trend, topProducts, recentTx, rp, loading } = useDashboardData()

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      <div className="page-scroll">
        <div className="wrap">
          {loading ? (
            <>
              <SkeletonBlock h={140} />
              <SkeletonBlock h={80} />
              <SkeletonBlock h={80} />
              <SkeletonBlock h={240} />
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
