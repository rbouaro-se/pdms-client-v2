import { useDispatchers } from '../context/dispatchers-context'
import { DispatchersActionDialog } from './dispatchers-action-dialog'

export function DispatchersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useDispatchers()
  return (
    <>
      <DispatchersActionDialog
        key='dispatcher-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
        agents={[]}
      />

      {currentRow && (
        <DispatchersActionDialog
          key={`dispatcher-edit-${currentRow.dispatcherId}`}
          open={open === 'edit'}
          onOpenChange={() => {
            setOpen('edit')
            setTimeout(() => {
              setCurrentRow(null)
            }, 500)
          }}
          agents={[]}
          currentRow={currentRow}
        />
      )}
    </>
  )
}
