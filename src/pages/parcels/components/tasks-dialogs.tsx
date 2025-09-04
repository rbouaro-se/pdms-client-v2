// import { showSubmittedData } from '@/utils/statuses'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useTasks } from '../context/tasks-context'
import { TasksImportDialog } from './tasks-import-dialog'
import { CreateParcelDrawer } from './create-parcel-drawer'

export function TasksDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useTasks()
  return (
    <>
      <CreateParcelDrawer
        key='task-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      <TasksImportDialog
        key='tasks-import'
        open={open === 'import'}
        onOpenChange={() => setOpen('import')}
      />

      {currentRow && (
        <>
          <CreateParcelDrawer
            key={`task-update-${currentRow.parcelId}`}
            open={open === 'update'}
            onOpenChange={() => {
              setOpen('update')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            // currentRow={currentRow}
          />

          <ConfirmDialog
            key='task-delete'
            destructive
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            handleConfirm={() => {
              setOpen(null)
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
              // showSubmittedData(
              //   currentRow,
              //   'The following task has been deleted:'
              // )
            }}
            className='max-w-md'
            title={`Delete this task: ${currentRow.parcelId} ?`}
            desc={
              <>
                You are about to delete a task with the ID{' '}
                <strong>{currentRow.parcelId}</strong>. <br />
                This action cannot be undone.
              </>
            }
            confirmText='Delete'
          />
        </>
      )}
    </>
  )
}
