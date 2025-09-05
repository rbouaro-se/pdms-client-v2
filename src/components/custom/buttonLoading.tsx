import { Loader2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"

interface ButtonProps {
    name?: string | null
}

export default function ButtonLoading({ name }: ButtonProps) {
    return (
        <Button size="sm" disabled>
            <Loader2Icon className="animate-spin" />
            {name ? name : 'Please wait'}
        </Button>
    )
}
