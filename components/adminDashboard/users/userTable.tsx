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
import { Eye, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { UserType } from "@/types";

interface UserTableProps {
  users: UserType[];
  onDelete: (id: string) => void;
  currentPage: number;
  itemsPerPage: number;
}

const UserTable = ({ users, onDelete, currentPage, itemsPerPage }: UserTableProps) => {
  const router = useRouter();

  const handleViewDetails = (user: UserType) => {
    router.push(`/admin/users/profile?id=${user?.id}&name=${user?.name}&avatar=${user?.avatar}`);
  };

  return (
    <div className="w-full panel overflow-hidden">
      <Table>
        <TableHeader className="bg-htb-bg/40 border-b border-htb-border">
          <TableRow>
            <TableHead className="w-[80px]">Sr. No.</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Join Date</TableHead>
            <TableHead className="text-center">Subscription</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, idx) => (
            <TableRow key={user.id}>
              <TableCell className="font-mono tabular-nums text-htb-muted">
                {(currentPage - 1) * itemsPerPage + idx + 1}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-7 w-7 ring-1 ring-neon/30">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-neon/10 text-neon font-mono text-xs">
                      {user.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-htb-text">{user.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-htb-muted text-xs">{user.country}</TableCell>
              <TableCell className="font-mono text-xs text-htb-muted">
                {new Date(user.joinDate).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-center">
                <span className="inline-flex items-center px-2 py-0.5 rounded font-mono text-[10px] font-semibold uppercase tracking-widest border border-sky-400/30 bg-sky-400/10 text-sky-300">
                  {user.subscription || "Free"}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-center gap-1.5">
                  <Button
                    variant="outline-dim"
                    size="sm"
                    onClick={() => handleViewDetails(user)}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="h-3.5 w-3.5" />
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
                          Are you sure you want to delete {user.name}? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-htb-panel border-htb-border text-htb-muted hover:bg-htb-panel-hover hover:text-htb-text">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(user.id)}
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

export default UserTable;
