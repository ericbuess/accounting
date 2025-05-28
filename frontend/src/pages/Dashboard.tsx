import { useQuery } from '@tanstack/react-query'
import api from '../services/api'

interface DashboardData {
  total_assets: number
  total_liabilities: number
  net_income: number
  companies: Array<{
    id: number
    name: string
    assets: number
    liabilities: number
    equity: number
    revenue: number
    expenses: number
    net_income: number
  }>
}

export default function Dashboard() {
  const { data: dashboardData, isLoading } = useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await api.get('/reports/dashboard/')
      return response.data
    }
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading dashboard data...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Assets</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {formatCurrency(dashboardData?.total_assets || 0)}
              </dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Liabilities</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {formatCurrency(dashboardData?.total_liabilities || 0)}
              </dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Net Income (Current Month)</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {formatCurrency(dashboardData?.net_income || 0)}
              </dd>
            </div>
          </div>
        </div>

        {/* Company Details */}
        {dashboardData?.companies && dashboardData.companies.length > 0 && (
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Company Breakdown</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {dashboardData.companies.map((company) => (
                  <li key={company.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-indigo-600 truncate">
                            {company.name}
                          </p>
                          <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                            <div>
                              <p className="text-xs text-gray-500">Assets</p>
                              <p className="text-sm font-medium text-gray-900">
                                {formatCurrency(company.assets)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Liabilities</p>
                              <p className="text-sm font-medium text-gray-900">
                                {formatCurrency(company.liabilities)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Equity</p>
                              <p className="text-sm font-medium text-gray-900">
                                {formatCurrency(company.equity)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Revenue (Month)</p>
                              <p className="text-sm font-medium text-gray-900">
                                {formatCurrency(company.revenue)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Expenses (Month)</p>
                              <p className="text-sm font-medium text-gray-900">
                                {formatCurrency(company.expenses)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Net Income (Month)</p>
                              <p className="text-sm font-medium text-gray-900">
                                {formatCurrency(company.net_income)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}