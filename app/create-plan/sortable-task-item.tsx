"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SortableTaskItemProps {
    id: string
    content: string
    onRemove: () => void
}

export function SortableTaskItem({ id, content, onRemove }: SortableTaskItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.8 : 1,
    }

    return (
        <li
            ref={setNodeRef}
            style={style}
            className={`flex items-center gap-2 p-3 rounded-md border ${isDragging ? "bg-muted" : "bg-card"}`}
        >
            <div
                {...attributes}
                {...listeners}
                className="cursor-grab touch-none flex items-center justify-center p-1"
                aria-label="Drag handle"
            >
                <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-grow">{content}</div>
            <Button variant="ghost" size="icon" onClick={onRemove} className="h-8 w-8" aria-label="Remove task">
                <X className="h-4 w-4" />
            </Button>
        </li>
    )
}

