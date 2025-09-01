import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { User } from '../data/schema'
import { SystemUser } from '@/types/user'
import { Dispatcher } from '@/types/dispatcher'

type DispatchersDialogType = 'add' | 'edit'

interface DispatchersContextType {
  open: DispatchersDialogType | null
  setOpen: (str: DispatchersDialogType | null) => void
  currentRow: Dispatcher | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Dispatcher | null>>
}

const DispatchersContext = React.createContext<DispatchersContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function DispatchersProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<DispatchersDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Dispatcher | null>(null)

  return (
    <DispatchersContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </DispatchersContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useDispatchers = () => {
  const dispatchersContext = React.useContext(DispatchersContext)

  if (!dispatchersContext) {
    throw new Error('useUsers has to be used within <DispatchersContext>')
  }

  return dispatchersContext
}
