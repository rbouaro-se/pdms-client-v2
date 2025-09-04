import { useBranches } from '../context/branches-context'
import { BranchActionDialog } from './branches-action-dialog'
import { BranchDeactivateDialog } from './branch-deactivation-dialog'
import { BranchDeleteDialog } from './branch-deletion-dialog'

export function BranchDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useBranches()
  return (
    <>
      <BranchActionDialog
        key='branch-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <BranchActionDialog
            key={`branch-edit-${currentRow.branchId}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <BranchDeactivateDialog
            key={`branch-deactivate-${currentRow.branchId}`}
            open={open === 'deactivate'}
            onOpenChange={() => {
              setOpen('deactivate')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <BranchDeleteDialog
            key={`branch-delete-${currentRow.branchId}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
