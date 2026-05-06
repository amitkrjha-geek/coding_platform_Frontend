"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { AdminType } from "@/types";

interface UserTableProps {
  admins: AdminType[];
  onDelete: (id: string) => void;
}

const AdminTable = ({ admins, onDelete }: UserTableProps) => {
  const router = useRouter();

  const handleViewDetails = (admin: AdminType) => {
    router.push(`/admin/administrator/editAdministrator?id=${admin?.id}`);
  };

  return (
    <div className="w-full panel overflow-hidden">
      <Table>
        <TableHeader className="bg-htb-bg/40 border-b border-htb-border">
          <TableRow>
            <TableHead className="w-[80px]">Sr. No.</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Join Date</TableHead>
            <TableHead className="text-center">Role</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins?.map((admin, index) => (
            <TableRow key={admin.id}>
              <TableCell className="font-mono tabular-nums text-htb-muted">{index + 1}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-7 w-7 ring-1 ring-neon/30">
                    <AvatarImage src={admin.avatar ?? "https://github.com/shadcn.png"} />
                    <AvatarFallback className="bg-neon/10 text-neon font-mono text-xs">
                      {admin.name[0] ?? "A"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-htb-text">{admin.name}</span>
                </div>
              </TableCell>
              <TableCell className="font-mono text-xs text-htb-muted">
                {new Date(admin.joinDate).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-center">
                <span className="inline-flex items-center px-2 py-0.5 rounded font-mono text-[10px] font-semibold uppercase tracking-widest border border-purple-500/30 bg-purple-500/10 text-purple-300">
                  {admin.role}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-center gap-1.5">
                  <Button
                    variant="outline-dim"
                    size="sm"
                    onClick={() => handleViewDetails(admin)}
                    className="h-8 w-8 p-0"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline-dim" size="sm" className="h-8 w-8 p-0 hover:border-danger/50 hover:text-danger">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-htb-panel border-htb-border">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-htb-text">Delete User</AlertDialogTitle>
                        <AlertDialogDescription className="text-htb-muted">
                          Are you sure you want to delete {admin.name}? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-htb-panel border-htb-border text-htb-muted hover:bg-htb-panel-hover hover:text-htb-text">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(admin.id)}
                          className="bg-danger text-white hover:bg-danger/80"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminTable;
