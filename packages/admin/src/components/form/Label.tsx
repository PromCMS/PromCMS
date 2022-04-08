import { FC } from 'react'

export const Label: FC = ({ children }) => (
  <label className="text-sm font-bold uppercase text-blue-500">
    {children}
  </label>
)
