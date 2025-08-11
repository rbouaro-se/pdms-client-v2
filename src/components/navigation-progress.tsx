import { useEffect, useRef } from 'react'
import LoadingBar, { LoadingBarRef } from 'react-top-loading-bar'
import {useNavigation} from 'react-router-dom'
export function NavigationProgress() {
  const ref = useRef<LoadingBarRef>(null)
  const navigation = useNavigation()

  useEffect(() => {
    if (navigation.state === 'loading') {
      ref.current?.continuousStart()
    } else {
      ref.current?.complete()
    }
  }, [navigation.state])

  return (
    <LoadingBar
      color='var(--muted-foreground)'
      ref={ref}
      shadow={true}
      height={2}
    />
  )
}
