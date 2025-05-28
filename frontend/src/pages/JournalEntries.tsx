import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  FileText, 
  Hash, 
  Eye, 
  Plus,
  Search,
  Filter,
  Download,
  ChevronRight
} from 'lucide-react'
import api from '../services/api'
import { JournalEntry, Company } from '../types'
import { format } from 'date-fns'
import { cn } from '../lib/utils'
import { pageTransition, staggerContainer, staggerItem, fadeIn } from '../lib/animations'

export default function JournalEntries() {
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)

  const { data: companies } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const response = await api.get<Company[]>('/companies/')
      return response.data
    }
  })

  const { data: entries, isLoading } = useQuery({
    queryKey: ['journal-entries', selectedCompanyId],
    queryFn: async () => {
      if (!selectedCompanyId) return []
      const response = await api.get<JournalEntry[]>(`/journal/?company_id=${selectedCompanyId}`)
      return response.data
    },
    enabled: !!selectedCompanyId
  })

  // Filter entries based on search
  const filteredEntries = entries?.filter(entry => 
    entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.reference?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <motion.div
      className="px-4 py-6 sm:px-0"
      initial="initial"
      animate="animate"
      variants={pageTransition}
    >
      <motion.div variants={staggerContainer}>
        {/* Header */}
        <motion.div className="sm:flex sm:items-center justify-between" variants={staggerItem}>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Journal Entries</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage and track all financial transactions
            </p>
          </div>
          <motion.button
            type="button"
            className="mt-4 sm:mt-0 inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Entry
          </motion.button>
        </motion.div>

        {/* Controls */}
        <motion.div 
          className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          variants={staggerContainer}
        >
          {/* Company Select */}
          <motion.div variants={staggerItem}>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
              Select Company
            </label>
            <select
              id="company"
              name="company"
              className="form-input block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-all duration-200"
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
          </motion.div>

          {/* Search */}
          <motion.div variants={staggerItem} className="sm:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Entries
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="search"
                className="form-input block w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-all duration-200"
                placeholder="Search by description or reference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={!selectedCompanyId}
              />
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div variants={staggerItem} className="flex items-end space-x-2">
            <motion.button
              className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </motion.button>
            <motion.button
              className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Table */}
        <AnimatePresence mode="wait">
          {selectedCompanyId && (
            <motion.div 
              className="mt-8"
              variants={fadeIn}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="bg-white shadow-soft rounded-lg border border-gray-100 overflow-hidden">
                {isLoading ? (
                  <div className="p-8">
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex space-x-4">
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : filteredEntries?.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No entries found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchTerm ? 'Try adjusting your search criteria.' : 'Create your first journal entry to get started.'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>Date</span>
                            </div>
                          </th>
                          <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <div className="flex items-center space-x-1">
                              <FileText className="h-4 w-4" />
                              <span>Description</span>
                            </div>
                          </th>
                          <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <div className="flex items-center space-x-1">
                              <Hash className="h-4 w-4" />
                              <span>Reference</span>
                            </div>
                          </th>
                          <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Lines
                          </th>
                          <th scope="col" className="relative py-3.5 pl-3 pr-6">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredEntries?.map((entry, index) => (
                          <motion.tr
                            key={entry.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.3 }}
                            className={cn(
                              "transition-colors duration-150",
                              hoveredRow === entry.id && "bg-gray-50"
                            )}
                            onMouseEnter={() => setHoveredRow(entry.id)}
                            onMouseLeave={() => setHoveredRow(null)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div className="flex items-center">
                                <div className="text-sm font-medium text-gray-900 tabular-nums">
                                  {format(new Date(entry.date), 'MM/dd/yyyy')}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              <div className="max-w-xs truncate">
                                {entry.description}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={cn(
                                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                entry.reference?.startsWith('INV') 
                                  ? "bg-success-100 text-success-800"
                                  : entry.reference?.startsWith('EXP')
                                  ? "bg-danger-100 text-danger-800"
                                  : "bg-gray-100 text-gray-800"
                              )}>
                                {entry.reference || 'N/A'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div className="flex items-center">
                                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-600 text-xs font-medium">
                                  {entry.lines.length}
                                </span>
                              </div>
                            </td>
                            <td className="relative px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <motion.button
                                className="inline-flex items-center text-primary-600 hover:text-primary-900 transition-colors duration-200"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                                <ChevronRight className="h-4 w-4 ml-1" />
                              </motion.button>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {filteredEntries && filteredEntries.length > 0 && (
                <motion.div 
                  className="mt-4 flex items-center justify-between"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{filteredEntries.length}</span> entries
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                      Previous
                    </button>
                    <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                      Next
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}