import * as React from 'react';
import { TAlert } from '@/types';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { clearAlert } from '@/redux/slices/notification';
import { CheckCircleIcon, FireExtinguisher, InfoIcon, MessageCircleWarning } from 'lucide-react';
import { Alert } from '../ui/alert';

const alertTypes: TAlert[] = [
    { title: 'Success', color: 'success', icon: <CheckCircleIcon /> },
    { title: 'Warning', color: 'warning', icon: <MessageCircleWarning /> },
    { title: 'Error', color: 'danger', icon: <FireExtinguisher /> },
    { title: 'Neutral', color: 'neutral', icon: <InfoIcon /> },
];

export default function AppAlert() {

    const [appAlert, setAppAlert] = React.useState<TAlert | null>(null);

    const dispatch = useAppDispatch();

    const { alert } = useAppSelector(state => state.notification)


    const handleOnClose = () => {
        setAppAlert(null)
        dispatch(clearAlert())
    }

    React.useEffect(() => {

        if (alert) {
            const alertType = alertTypes.find(alertType => alertType.color === alert.color)!;
            alertType.title = alert.title
            setAppAlert(alertType)
        }

    }, [alert]);

    return (
        <>
            {appAlert ? <div style={{display: 'flex', flexDirection: 'column', gap: 2, width: '100%',}}>
                <Alert
                    variant="default"
                    color={appAlert.color}
                    // startDecorator={appAlert.icon}
                    // endDecorator={
                    //     <Button size="sm" variant="solid" color={appAlert.color} onClick={handleOnClose}>
                    //         Close
                    //     </Button>
                    // }
                    onCanPlay={handleOnClose}
                >
                    {appAlert.title}
                </Alert>
            </div> : null}
        </>
    );
}