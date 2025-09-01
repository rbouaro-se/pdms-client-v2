import { IconUserPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useDispatchers } from '../context/dispatchers-context'

export function DispatchersPrimaryButtons() {
  const { setOpen } = useDispatchers()
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Add Dispatcher</span> <IconUserPlus size={18} />
      </Button>
    </div>
  )
}
