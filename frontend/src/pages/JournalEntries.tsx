import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../services/api'
import { JournalEntry, Company } from '../types'
import { format } from 'date-fns'

export default function JournalEntries() {
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null)

  const { data: companies } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const response = await api.get<Company[]>('/companies')
      return response.data
    }
  })

  const { data: entries, isLoading } = useQuery({
    queryKey: ['journal-entries', selectedCompanyId],
    queryFn: async () => {
      if (!selectedCompanyId) return []
      const response = await api.get<JournalEntry[]>(`/journal?company_id=${selectedCompanyId}`)
      return response.data
    },
    enabled: !!selectedCompanyId
  })

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Journal Entries</h1>
          <p className="mt-2 text-sm text-gray-700">
            View and manage journal entries.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            New Entry
          </button>
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
                        Date
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Description
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Reference
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Lines
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">View</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="text-center py-4">Loading...</td>
                      </tr>
                    ) : entries?.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-4">No entries found</td>
                      </tr>
                    ) : (
                      entries?.map((entry) => (
                        <tr key={entry.id}>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                            {format(new Date(entry.date), 'MM/dd/yyyy')}
                          </td>
                          <td className="px-3 py-4 text-sm text-gray-900">{entry.description}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{entry.reference || '-'}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{entry.lines.length}</td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <a href="#" className="text-indigo-600 hover:text-indigo-900">
                              View
                            </a>
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