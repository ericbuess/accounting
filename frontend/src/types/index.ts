export enum UserRole {
  ADMIN = 'admin',
  ACCOUNTANT = 'accountant',
  VIEWER = 'viewer'
}

export enum AccountType {
  ASSET = 'asset',
  LIABILITY = 'liability',
  EQUITY = 'equity',
  REVENUE = 'revenue',
  EXPENSE = 'expense'
}

export interface User {
  id: number
  email: string
  full_name?: string
  role: UserRole
  is_active: boolean
  created_at: string
}

export interface Company {
  id: number
  name: string
  code: string
  fiscal_year_start: string
  currency: string
  created_at: string
  updated_at?: string
}

export interface Account {
  id: number
  company_id: number
  code: string
  name: string
  type: AccountType
  parent_id?: number
  is_active: boolean
  created_at: string
  updated_at?: string
}

export interface JournalLine {
  id?: number
  account_id: number
  debit: number
  credit: number
  description?: string
}

export interface JournalEntry {
  id: number
  company_id: number
  date: string
  description: string
  reference?: string
  created_by: number
  created_at: string
  lines: JournalLine[]
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthToken {
  access_token: string
  token_type: string
}