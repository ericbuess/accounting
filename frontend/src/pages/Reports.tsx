import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../services/api'
import { Company } from '../types'

export default function Reports() {
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null)
  const [reportType, setReportType] = useState<string>('balance-sheet')

  const { data: companies } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const response = await api.get<Company[]>('/companies')
      return response.data
    }
  })

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
                Select a company and report type to generate the report.
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Generate Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}