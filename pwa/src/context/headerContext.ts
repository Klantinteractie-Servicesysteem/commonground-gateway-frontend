import * as React from 'react'

export interface HeaderProps {
  title: string,
  subText: string,
}

export const HeaderContext = React.createContext<[HeaderProps, (value: HeaderProps) => void]>(null)
export const HeaderProvider = HeaderContext.Provider
