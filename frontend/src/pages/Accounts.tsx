import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../services/api'
import { Account, Company } from '../types'

export default function Accounts() {
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null)

  const { data: companies } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const response = await api.get<Company[]>('/companies/')
      return response.data
    }
  })

  const { data: accounts, isLoading } = useQuery({
    queryKey: ['accounts', selectedCompanyId],
    queryFn: async () => {
      if (!selectedCompanyId) return []
      const response = await api.get<Account[]>(`/accounts/?company_id=${selectedCompanyId}`)
      return response.data
    },
    enabled: !!selectedCompanyId
  })

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Chart of Accounts</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your chart of accounts by company.
          </p>
        </div>
      </div>

      <div className="mt-4">
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

      {selectedCompanyId && (
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Code
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Name
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Type
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {isLoading ? (
                      <tr>
                        <td colSpan={4} className="text-center py-4">Loading...</td>
                      </tr>
                    ) : accounts?.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-4">No accounts found</td>
                      </tr>
                    ) : (
                      accounts?.map((account) => (
                        <tr key={account.id}>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{account.code}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{account.name}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {account.type}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              account.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {account.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}