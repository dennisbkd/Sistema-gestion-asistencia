import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

type AlertDeleteProps = {
  onConfirm: () => void
  processing: boolean
  triggerLabel?: string
  title?: string
  description?: string
  icon?: React.ReactNode
  confirmLabel?: string
  cancelLabel?: string
}

export function AlertDelete({
  onConfirm,
  processing,
  triggerLabel = "Eliminar",
  title = "¿Estás completamente seguro?",
  description = "Esta acción no se puede deshacer. El elemento será eliminado permanentemente.",
  icon = <Trash2 className="w-4 h-4" />,
  confirmLabel = "Confirmar eliminación",
  cancelLabel = "Cancelar",
}: AlertDeleteProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="flex items-center gap-2">
          {icon}
          {triggerLabel}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-600 flex items-center gap-2">
            {icon}
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground mt-2">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel className="bg-muted text-muted-foreground hover:bg-muted/80">
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={processing}
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}