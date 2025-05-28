import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Building2, 
  LayoutDashboard, 
  Building, 
  FileText, 
  BookOpen, 
  ChartBar, 
  LogOut,
  User,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { cn } from '../lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Companies', href: '/companies', icon: Building },
  { name: 'Accounts', href: '/accounts', icon: FileText },
  { name: 'Journal Entries', href: '/journal', icon: BookOpen },
  { name: 'Reports', href: '/reports', icon: ChartBar },
]

export default function Layout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-soft border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {/* Logo */}
              <motion.div 
                className="flex-shrink-0 flex items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link to="/" className="flex items-center space-x-2">
                  <div className="h-9 w-9 bg-primary-600 rounded-lg flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <h1 className="text-xl font-bold text-gray-900">AccuBooks</h1>
                </Link>
              </motion.div>

              {/* Desktop Navigation */}
              <div className="hidden md:ml-10 md:flex md:space-x-1">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                    >
                      <motion.div
                        className={cn(
                          "flex items-center space-x-2 px-3 py-2 rounded-lg",
                          active 
                            ? "text-primary-600" 
                            : "text-gray-600 hover:text-gray-900"
                        )}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </motion.div>
                      {active && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                          layoutId="navbar-indicator"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* User Info - Desktop */}
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-3 px-3 py-1.5 rounded-lg bg-gray-50">
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                </div>
                <motion.button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </motion.button>
              </div>

              {/* Mobile menu button */}
              <motion.button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                whileTap={{ scale: 0.95 }}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-gray-100"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium transition-all duration-200",
                        active
                          ? "bg-primary-50 text-primary-600"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex items-center space-x-3 px-3 py-2">
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                      <p className="text-xs text-gray-500">Administrator</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <motion.main 
        className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </motion.main>
    </div>
  )
}