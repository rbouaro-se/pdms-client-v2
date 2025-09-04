import { Button } from '@/components/ui/button'
import { useBranches } from '../context/branches-context'
import { Split } from 'lucide-react'

export function BranchPrimaryButtons() {
  const { setOpen } = useBranches()
  return (
    <div className='flex gap-2'>
      {/* <Button
        variant='outline'
        className='space-x-1'
        onClick={() => setOpen('invite')}
      >
        <span>Invite User</span> <IconMailPlus size={18} />
      </Button> */}
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Add Branch</span> <Split size={18} />
      </Button>
    </div>
  )
}
