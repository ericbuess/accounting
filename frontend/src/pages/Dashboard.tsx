import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Building2, 
  CreditCard,
  PiggyBank,
  ArrowUpRight
} from 'lucide-react'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import api from '../services/api'
import { cn } from '../lib/utils'
import { pageTransition, staggerContainer, staggerItem } from '../lib/animations'

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

const CHART_COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

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
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatCompactCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`
    }
    return formatCurrency(amount)
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6">
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Prepare chart data
  const companyPerformanceData = dashboardData?.companies.map(company => ({
    name: company.name,
    revenue: company.revenue,
    expenses: company.expenses,
    netIncome: company.net_income
  })) || []

  const assetDistributionData = dashboardData?.companies.map(company => ({
    name: company.name,
    value: company.assets
  })) || []


  return (
    <motion.div
      className="px-4 py-6 sm:px-0"
      initial="initial"
      animate="animate"
      variants={pageTransition}
    >
      <motion.div variants={staggerContainer}>
        <motion.h1 
          className="text-3xl font-bold text-gray-900 mb-8"
          variants={staggerItem}
        >
          Financial Dashboard
        </motion.h1>
        
        {/* Summary Cards */}
        <motion.div 
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8"
          variants={staggerContainer}
        >
          {/* Total Assets Card */}
          <motion.div
            className="bg-white rounded-lg shadow-soft border border-gray-100 p-6 relative overflow-hidden"
            variants={staggerItem}
            whileHover={{ y: -4 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Assets</p>
                <motion.p 
                  className="mt-2 text-3xl font-bold text-gray-900 tabular-nums"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {formatCurrency(dashboardData?.total_assets || 0)}
                </motion.p>
                <div className="mt-2 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-success-600 mr-1" />
                  <span className="text-success-600 font-medium">+12.5%</span>
                  <span className="text-gray-500 ml-2">vs last month</span>
                </div>
              </div>
              <div className="bg-primary-50 rounded-lg p-3">
                <PiggyBank className="h-8 w-8 text-primary-600" />
              </div>
            </div>
            <div className="absolute -right-16 -bottom-16 h-40 w-40 bg-primary-50 rounded-full opacity-20"></div>
          </motion.div>

          {/* Total Liabilities Card */}
          <motion.div
            className="bg-white rounded-lg shadow-soft border border-gray-100 p-6 relative overflow-hidden"
            variants={staggerItem}
            whileHover={{ y: -4 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Liabilities</p>
                <motion.p 
                  className="mt-2 text-3xl font-bold text-gray-900 tabular-nums"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {formatCurrency(dashboardData?.total_liabilities || 0)}
                </motion.p>
                <div className="mt-2 flex items-center text-sm">
                  <TrendingDown className="h-4 w-4 text-danger-600 mr-1" />
                  <span className="text-danger-600 font-medium">-5.2%</span>
                  <span className="text-gray-500 ml-2">vs last month</span>
                </div>
              </div>
              <div className="bg-danger-50 rounded-lg p-3">
                <CreditCard className="h-8 w-8 text-danger-600" />
              </div>
            </div>
            <div className="absolute -right-16 -bottom-16 h-40 w-40 bg-danger-50 rounded-full opacity-20"></div>
          </motion.div>

          {/* Net Income Card */}
          <motion.div
            className="bg-white rounded-lg shadow-soft border border-gray-100 p-6 relative overflow-hidden"
            variants={staggerItem}
            whileHover={{ y: -4 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Income (Month)</p>
                <motion.p 
                  className={cn(
                    "mt-2 text-3xl font-bold tabular-nums",
                    (dashboardData?.net_income || 0) >= 0 ? "text-success-600" : "text-danger-600"
                  )}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {formatCurrency(dashboardData?.net_income || 0)}
                </motion.p>
                <div className="mt-2 flex items-center text-sm">
                  <ArrowUpRight className="h-4 w-4 text-success-600 mr-1" />
                  <span className="text-success-600 font-medium">+18.7%</span>
                  <span className="text-gray-500 ml-2">vs last month</span>
                </div>
              </div>
              <div className="bg-success-50 rounded-lg p-3">
                <DollarSign className="h-8 w-8 text-success-600" />
              </div>
            </div>
            <div className="absolute -right-16 -bottom-16 h-40 w-40 bg-success-50 rounded-full opacity-20"></div>
          </motion.div>
        </motion.div>

        {/* Charts Section */}
        {dashboardData?.companies && dashboardData.companies.length > 0 && (
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
            variants={staggerContainer}
          >
            {/* Company Performance Chart */}
            <motion.div 
              className="bg-white rounded-lg shadow-soft border border-gray-100 p-6"
              variants={staggerItem}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={companyPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => formatCompactCurrency(value)} />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#10b981" name="Revenue" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="netIncome" fill="#4f46e5" name="Net Income" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Asset Distribution Chart */}
            <motion.div 
              className="bg-white rounded-lg shadow-soft border border-gray-100 p-6"
              variants={staggerItem}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={assetDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {assetDistributionData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </motion.div>
        )}

        {/* Company Details */}
        {dashboardData?.companies && dashboardData.companies.length > 0 && (
          <motion.div variants={staggerItem}>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Company Details</h2>
            <motion.div 
              className="space-y-4"
              variants={staggerContainer}
            >
              {dashboardData.companies.map((company, index) => (
                <motion.div
                  key={company.id}
                  className="bg-white rounded-lg shadow-soft border border-gray-100 p-6"
                  variants={staggerItem}
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "h-10 w-10 rounded-lg flex items-center justify-center",
                        `bg-${['primary', 'success', 'warning'][index % 3]}-100`
                      )}>
                        <Building2 className={cn(
                          "h-6 w-6",
                          `text-${['primary', 'success', 'warning'][index % 3]}-600`
                        )} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                        <p className="text-sm text-gray-500">ID: {company.id}</p>
                      </div>
                    </div>
                    <motion.div 
                      className={cn(
                        "px-3 py-1 rounded-full text-sm font-medium",
                        company.net_income >= 0 
                          ? "bg-success-100 text-success-700" 
                          : "bg-danger-100 text-danger-700"
                      )}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      {company.net_income >= 0 ? 'Profitable' : 'Loss'}
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[
                      { label: 'Assets', value: company.assets, color: 'text-primary-600' },
                      { label: 'Liabilities', value: company.liabilities, color: 'text-danger-600' },
                      { label: 'Equity', value: company.equity, color: 'text-success-600' },
                      { label: 'Revenue', value: company.revenue, color: 'text-success-600' },
                      { label: 'Expenses', value: company.expenses, color: 'text-danger-600' },
                      { label: 'Net Income', value: company.net_income, color: company.net_income >= 0 ? 'text-success-600' : 'text-danger-600' }
                    ].map((item, itemIndex) => (
                      <motion.div 
                        key={item.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 + itemIndex * 0.05 }}
                      >
                        <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                        <p className={cn("text-sm font-semibold tabular-nums", item.color)}>
                          {formatCurrency(item.value)}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}