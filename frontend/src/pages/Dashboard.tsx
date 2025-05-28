export default function Dashboard() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h1>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Assets</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">$0.00</dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Liabilities</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">$0.00</dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Net Income</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">$0.00</dd>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}