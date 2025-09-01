'use client'

import * as React from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { clearAlert } from '@/redux/slices/notification'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
    CheckCircleIcon,
    InfoIcon,
    AlertTriangle,
    FireExtinguisher,
    X as XIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { TAlert } from '@/types/alerts'

const DEFAULT_DURATION = 5000

function getIconForColor(color?: string) {
    switch (color) {
        case 'success':
        case 'green':
            return <CheckCircleIcon className="h-4 w-4" />
        case 'warning':
        case 'yellow':
            return <AlertTriangle className="h-4 w-4" />
        case 'danger':
        case 'red':
            return <FireExtinguisher className="h-4 w-4" />
        default:
            return <InfoIcon className="h-4 w-4" />
    }
}

export default function AppAlert() {
    const dispatch = useAppDispatch()
    const alert = useAppSelector((s) => (s as any).notification?.alert) as Omit<TAlert, 'icon'> | null

    const [visible, setVisible] = React.useState<boolean>(false)
    const timerRef = React.useRef<number | null>(null)
    const endAtRef = React.useRef<number | null>(null)
    const remainingRef = React.useRef<number | null>(null)

    const clearTimer = () => {
        if (timerRef.current) {
            window.clearTimeout(timerRef.current)
            timerRef.current = null
        }
        endAtRef.current = null
        remainingRef.current = null
    }

    const dismiss = React.useCallback(() => {
        setVisible(false)
        setTimeout(() => {
            try {
                dispatch(clearAlert())
            } catch {
                // ignore
            }
        }, 200)
        clearTimer()
    }, [dispatch])

    const startTimer = React.useCallback(
        (duration: number) => {
            clearTimer()
            const now = Date.now()
            endAtRef.current = now + duration
            remainingRef.current = duration
            timerRef.current = window.setTimeout(() => {
                timerRef.current = null
                endAtRef.current = null
                remainingRef.current = null
                dismiss()
            }, duration)
        },
        [dismiss]
    )

    const pauseTimer = React.useCallback(() => {
        if (!timerRef.current || !endAtRef.current) return
        const remaining = endAtRef.current - Date.now()
        if (remaining <= 0) return
        remainingRef.current = remaining
        window.clearTimeout(timerRef.current)
        timerRef.current = null
        endAtRef.current = null
    }, [])

    const resumeTimer = React.useCallback(() => {
        const remaining = remainingRef.current ?? DEFAULT_DURATION
        if (remaining <= 0) {
            dismiss()
            return
        }
        startTimer(remaining)
    }, [startTimer, dismiss])

    React.useEffect(() => {
        clearTimer()
        if (alert) {
            setVisible(true)
            const duration = (alert as any).duration ?? DEFAULT_DURATION
            const ms = typeof duration === 'number' && duration > 0 ? duration : DEFAULT_DURATION
            startTimer(ms)
        } else {
            setVisible(false)
        }
        return () => {
            clearTimer()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [alert])

    if (!alert || !visible) return null

    const icon = getIconForColor(alert.color)
    const title = alert.title ?? (alert.color === 'success' ? 'Success' : 'Notice')
    const message = (alert as any).message ?? ''

    return (
        <div
            className="fixed top-4 right-4 z-[9999] w-full max-w-sm"
            onMouseEnter={pauseTimer}
            onMouseLeave={resumeTimer}
            role="status"
            aria-live="polite"
        >
            <Alert
                variant="default"
                color={alert.color as any}
                className={cn('flex items-start gap-3 shadow-lg', 'pointer-events-auto')}
            >
                <div className="flex items-center gap-3 px-2">{icon}</div>

                <div className="flex-1 min-w-0">
                    <AlertTitle className="font-medium">{title}</AlertTitle>
                    {message ? <AlertDescription className="mt-1">{message}</AlertDescription> : null}
                </div>

                <div className="flex items-start pr-2">
                    <Button variant="ghost" size="sm" onClick={dismiss} aria-label="Close notification" className="opacity-70 hover:opacity-100">
                        <XIcon className="h-4 w-4" />
                    </Button>
                </div>
            </Alert>
        </div>
    )
}