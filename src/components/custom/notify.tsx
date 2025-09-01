
import { setAlert } from '@/redux/slices/notification'
import { TAlert } from '@/types/alerts'
import { AppDispatch } from 'recharts/types/state/store'

type NotifyOptions = {
    title?: string
    message?: string
    color?: TAlert['color']
    duration?: number
}

/**
 * Lightweight notify helper — call from components/actions to show global alerts.
 * Example usage:
 *   notify(dispatch, { title: 'Saved', message: 'Branch updated', color: 'success' })
 */
export const notify = (dispatch: AppDispatch, opts: NotifyOptions) => {
    dispatch(
        setAlert({
            title: opts.title ?? '',
            message: opts.message ?? '',
            color: opts.color ?? 'default',
            duration: opts.duration ?? 1000 * 60 * 2,
        })
    )
}

export const notifySuccess = (dispatch: AppDispatch, title?: string, message?: string, duration?: number) =>
    notify(dispatch, { title: title ?? 'Success', message: message ?? '', color: 'default', duration })

export const notifyError = (dispatch: AppDispatch, title?: string, message?: string, duration?: number) =>
    notify(dispatch, { title: title ?? 'Error', message: message ?? '', color: 'destructive', duration })

export const notifyInfo = (dispatch: AppDispatch, title?: string, message?: string, duration?: number) =>
    notify(dispatch, { title: title ?? 'Info', message: message ?? '', color: 'default', duration })