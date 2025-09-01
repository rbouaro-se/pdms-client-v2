import { useUsers } from '../context/users-context'
import { UsersActionDialog } from './users-action-dialog'
import { UserStatusDialog } from './users-suspend-dialog'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useUsers()
  return (
    <>
      <UsersActionDialog
        key='user-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <UsersActionDialog
            key={`user-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <UserStatusDialog
            key={`user-delete-${currentRow.id}`}
            open={open === 'suspend'}
            onOpenChange={() => {
              setOpen('suspend')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
            action="suspend"
          />

          <UserStatusDialog
            key={`user-delete-${currentRow.id}`}
            open={open === 'reinstate'}
            onOpenChange={() => {
              setOpen('reinstate')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
            action="reinstate"
          />
        </>
      )}
    </>
  )
}
