import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../services/api'
import { Company } from '../types'
import { format } from 'date-fns'

interface BalanceSheet {
  company: string
  as_of_date: string
  assets: {
    accounts: Array<{ code: string; name: string; balance: number }>
    total: number
  }
  liabilities: {
    accounts: Array<{ code: string; name: string; balance: number }>
    total: number
  }
  equity: {
    accounts: Array<{ code: string; name: string; balance: number }>
    total: number
  }
  total_liabilities_and_equity: number
}

interface IncomeStatement {
  company: string
  period: string
  revenue: {
    accounts: Array<{ code: string; name: string; balance: number }>
    total: number
  }
  expenses: {
    accounts: Array<{ code: string; name: string; balance: number }>
    total: number
  }
  net_income: number
}

interface TrialBalance {
  company: string
  as_of_date: string
  accounts: Array<{
    code: string
    name: string
    type: string
    debit: number
    credit: number
  }>
  total_debit: number
  total_credit: number
}

export default function Reports() {
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null)
  const [reportType, setReportType] = useState<string>('balance-sheet')
  const [reportData, setReportData] = useState<BalanceSheet | IncomeStatement | TrialBalance | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { data: companies } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const response = await api.get<Company[]>('/companies/')
      return response.data
    }
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const generateReport = async () => {
    if (!selectedCompanyId) return

    setIsLoading(true)
    try {
      let response
      const today = format(new Date(), 'yyyy-MM-dd')
      const startOfMonth = format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd')
      
      switch (reportType) {
        case 'balance-sheet':
          response = await api.get(`/reports/balance-sheet/${selectedCompanyId}?as_of_date=${today}`)
          break
        case 'income-statement':
          response = await api.get(`/reports/income-statement/${selectedCompanyId}?start_date=${startOfMonth}&end_date=${today}`)
          break
        case 'trial-balance':
          response = await api.get(`/reports/trial-balance/${selectedCompanyId}?as_of_date=${today}`)
          break
      }
      
      if (response) {
        setReportData(response.data)
      }
    } catch (error) {
      console.error('Error generating report:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderBalanceSheet = (data: BalanceSheet) => (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h4 className="text-lg font-semibold">{data.company}</h4>
        <p className="text-sm text-gray-600">Balance Sheet</p>
        <p className="text-sm text-gray-600">As of {format(new Date(data.as_of_date), 'MMMM d, yyyy')}</p>
      </div>
      
      {/* Assets */}
      <div>
        <h5 className="font-semibold text-gray-900 mb-2">ASSETS</h5>
        {data.assets.accounts.map((account, idx) => (
          <div key={idx} className="flex justify-between py-1">
            <span className="text-sm">{account.code} - {account.name}</span>
            <span className="text-sm">{formatCurrency(account.balance)}</span>
          </div>
        ))}
        <div className="flex justify-between border-t pt-1 mt-2 font-semibold">
          <span>Total Assets</span>
          <span>{formatCurrency(data.assets.total)}</span>
        </div>
      </div>
      
      {/* Liabilities */}
      <div>
        <h5 className="font-semibold text-gray-900 mb-2">LIABILITIES</h5>
        {data.liabilities.accounts.length > 0 ? (
          data.liabilities.accounts.map((account, idx) => (
            <div key={idx} className="flex justify-between py-1">
              <span className="text-sm">{account.code} - {account.name}</span>
              <span className="text-sm">{formatCurrency(account.balance)}</span>
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-500 py-1">No liabilities</div>
        )}
        <div className="flex justify-between border-t pt-1 mt-2 font-semibold">
          <span>Total Liabilities</span>
          <span>{formatCurrency(data.liabilities.total)}</span>
        </div>
      </div>
      
      {/* Equity */}
      <div>
        <h5 className="font-semibold text-gray-900 mb-2">EQUITY</h5>
        {data.equity.accounts.map((account, idx) => (
          <div key={idx} className="flex justify-between py-1">
            <span className="text-sm">{account.code} - {account.name}</span>
            <span className="text-sm">{formatCurrency(account.balance)}</span>
          </div>
        ))}
        <div className="flex justify-between border-t pt-1 mt-2 font-semibold">
          <span>Total Equity</span>
          <span>{formatCurrency(data.equity.total)}</span>
        </div>
      </div>
      
      <div className="flex justify-between border-t-2 pt-2 mt-4 font-bold">
        <span>Total Liabilities and Equity</span>
        <span>{formatCurrency(data.total_liabilities_and_equity)}</span>
      </div>
    </div>
  )

  const renderIncomeStatement = (data: IncomeStatement) => (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h4 className="text-lg font-semibold">{data.company}</h4>
        <p className="text-sm text-gray-600">Income Statement</p>
        <p className="text-sm text-gray-600">{data.period}</p>
      </div>
      
      {/* Revenue */}
      <div>
        <h5 className="font-semibold text-gray-900 mb-2">REVENUE</h5>
        {data.revenue.accounts.length > 0 ? (
          data.revenue.accounts.map((account, idx) => (
            <div key={idx} className="flex justify-between py-1">
              <span className="text-sm">{account.code} - {account.name}</span>
              <span className="text-sm">{formatCurrency(account.balance)}</span>
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-500 py-1">No revenue</div>
        )}
        <div className="flex justify-between border-t pt-1 mt-2 font-semibold">
          <span>Total Revenue</span>
          <span>{formatCurrency(data.revenue.total)}</span>
        </div>
      </div>
      
      {/* Expenses */}
      <div>
        <h5 className="font-semibold text-gray-900 mb-2">EXPENSES</h5>
        {data.expenses.accounts.length > 0 ? (
          data.expenses.accounts.map((account, idx) => (
            <div key={idx} className="flex justify-between py-1">
              <span className="text-sm">{account.code} - {account.name}</span>
              <span className="text-sm">{formatCurrency(account.balance)}</span>
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-500 py-1">No expenses</div>
        )}
        <div className="flex justify-between border-t pt-1 mt-2 font-semibold">
          <span>Total Expenses</span>
          <span>{formatCurrency(data.expenses.total)}</span>
        </div>
      </div>
      
      <div className="flex justify-between border-t-2 pt-2 mt-4 font-bold">
        <span>Net Income</span>
        <span>{formatCurrency(data.net_income)}</span>
      </div>
    </div>
  )

  const renderTrialBalance = (data: TrialBalance) => (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h4 className="text-lg font-semibold">{data.company}</h4>
        <p className="text-sm text-gray-600">Trial Balance</p>
        <p className="text-sm text-gray-600">As of {format(new Date(data.as_of_date), 'MMMM d, yyyy')}</p>
      </div>
      
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
            <th className="px-2 py-2 text-right text-xs font-medium text-gray-500 uppercase">Debit</th>
            <th className="px-2 py-2 text-right text-xs font-medium text-gray-500 uppercase">Credit</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.accounts.map((account, idx) => (
            <tr key={idx}>
              <td className="px-2 py-2 text-sm">{account.code} - {account.name}</td>
              <td className="px-2 py-2 text-sm text-right">{account.debit > 0 ? formatCurrency(account.debit) : ''}</td>
              <td className="px-2 py-2 text-sm text-right">{account.credit > 0 ? formatCurrency(account.credit) : ''}</td>
            </tr>
          ))}
          <tr className="font-bold">
            <td className="px-2 py-2">Totals</td>
            <td className="px-2 py-2 text-right">{formatCurrency(data.total_debit)}</td>
            <td className="px-2 py-2 text-right">{formatCurrency(data.total_credit)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Financial Reports</h1>
          <p className="mt-2 text-sm text-gray-700">
            Generate and view financial reports.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700">
            Select Company
          </label>
          <select
            id="company"
            name="company"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            onChange={(e) => setSelectedCompanyId(Number(e.target.value))}
            value={selectedCompanyId || ''}
          >
            <option value="">Select a company...</option>
            {companies?.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="report-type" className="block text-sm font-medium text-gray-700">
            Report Type
          </label>
          <select
            id="report-type"
            name="report-type"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            onChange={(e) => setReportType(e.target.value)}
            value={reportType}
          >
            <option value="balance-sheet">Balance Sheet</option>
            <option value="income-statement">Income Statement</option>
            <option value="trial-balance">Trial Balance</option>
          </select>
        </div>
      </div>

      {selectedCompanyId && (
        <div className="mt-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {reportType === 'balance-sheet' && 'Balance Sheet'}
                {reportType === 'income-statement' && 'Income Statement'}
                {reportType === 'trial-balance' && 'Trial Balance'}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {reportData ? 'Report generated successfully' : 'Click Generate Report to view the report'}
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <button
                type="button"
                onClick={generateReport}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? 'Generating...' : 'Generate Report'}
              </button>
            </div>
            
            {reportData && (
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                {reportType === 'balance-sheet' && renderBalanceSheet(reportData as BalanceSheet)}
                {reportType === 'income-statement' && renderIncomeStatement(reportData as IncomeStatement)}
                {reportType === 'trial-balance' && renderTrialBalance(reportData as TrialBalance)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}