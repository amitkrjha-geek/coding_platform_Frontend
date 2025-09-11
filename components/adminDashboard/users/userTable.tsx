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
  const router = useRouter()

  const handleViewDetails = (user: UserType) => {
    router.push(`/admin/users/profile?id=${user?.id}&name=${user?.name}&avatar=${user?.avatar}`)
    };
  
  return (
    <div className=" w-full min-w-xl bg-white rounded-2xl border overflow-hidden space-y-6">
      <Table>
        <TableHeader className="bg-[#7421931A] ">
          <TableRow>
            <TableHead className="w-[80px] font-bold">Sr. No.</TableHead>
            <TableHead className="font-bold">Name</TableHead>
            <TableHead className="font-bold">Country</TableHead>
            <TableHead className="font-bold">Join Date</TableHead>
            <TableHead className="font-bold text-center"> Subscription</TableHead>
            <TableHead className=" text-center font-bold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, idx) => (
            <TableRow key={user.id}>
              <TableCell>{(currentPage - 1) * itemsPerPage + idx + 1}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  {user.name}
                </div>
              </TableCell>
              <TableCell>{user.country}</TableCell>
              <TableCell>{new Date(user.joinDate).toLocaleDateString()}</TableCell>
              <TableCell className="text-center">{user.subscription}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(user)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete User</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {user.name}? This action
                          cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(user.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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