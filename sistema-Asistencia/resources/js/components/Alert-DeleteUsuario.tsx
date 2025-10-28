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

export function AlertDeleteUsuario({
  eliminarUsuario,
  processing,
}: {
  eliminarUsuario: () => void
  processing: boolean
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="flex items-center gap-2">
          <Trash2 className="w-4 h-4" />
          Eliminar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-600 flex items-center gap-2">
            <Trash2 />
            ¿Estás completamente seguro?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground mt-2">
            Esta acción no se puede deshacer. El usuario será eliminado
            permanentemente junto con todos sus datos.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel className="bg-muted text-muted-foreground hover:bg-muted/80">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={processing}
            onClick={eliminarUsuario}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Confirmar eliminación
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}