import { Separator } from '@radix-ui/react-separator'
import { PaDeliveryConfigurationForm } from './config-form'


export default function DeliveryConfigurations() {
  return (
    <div className='flex flex-1 flex-col'>
      <div className='flex-none'>
        <h3 className='text-lg font-medium'>Delivery Configurations</h3>
        <p className='text-muted-foreground text-sm'>Configure how deliveries are managed.</p>
      </div>
      <Separator className='my-4 flex-none' />
      <div className='h-full w-full overflow-y-auto scroll-smooth pr-4 pb-12'>
        <div className='-mx-1 px-1.5 w-full'> {/* Remove lg:max-w-xl and add w-full */}
          <PaDeliveryConfigurationForm />
        </div>
      </div>
    </div>
  )
}
