import React from 'react'
export const Card = ({ children }: { children: React.ReactNode }) => <div className='border rounded p-4 shadow-sm'>{children}</div>
export const Badge = ({ children }: { children: React.ReactNode }) => <span className='px-2 py-1 bg-gray-200 rounded'>{children}</span>
