'use client'

import { ReactNode } from 'react'

interface TabsProps {
  defaultValue: string
  children: ReactNode
  className?: string // className 속성 추가
}

export function Tabs({ defaultValue, children, className }: TabsProps) {
  return (
    <div className={`tabs ${className}`}> {/* className을 div에 추가 */}
      {children}
    </div>
  )
}

interface TabsListProps {
  children: ReactNode
}

export function TabsList({ children }: TabsListProps) {
  return (
    <div className="flex space-x-4 border-b">
      {children}
    </div>
  )
}

interface TabsTriggerProps {
  value: string
  children: ReactNode
}

export function TabsTrigger({ value, children }: TabsTriggerProps) {
  return (
    <button className="py-2 px-4 text-sm font-medium text-gray-600 hover:text-gray-900">
      {children}
    </button>
  )
}

interface TabsContentProps {
  value: string
  children: ReactNode
}

export function TabsContent({ value, children }: TabsContentProps) {
  return (
    <div className="mt-4">
      {children}
    </div>
  )
}