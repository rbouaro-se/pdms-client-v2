import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { Branch } from '@/types/parcel'

type BranchesDialogType = 'deactivate' | 'add' | 'edit' | 'delete'

interface BranchesContextType {
  open: BranchesDialogType | null
  setOpen: (str: BranchesDialogType | null) => void
  currentRow: Branch | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Branch | null>>
}

const BranchesContext = React.createContext<BranchesContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function UsersProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<BranchesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Branch | null>(null)

  return (
    <BranchesContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </BranchesContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useBranches = () => {
  const branchesContext = React.useContext(BranchesContext)

  if (!branchesContext) {
    throw new Error('useUsers has to be used within <BranchesContext>')
  }

  return branchesContext
}
