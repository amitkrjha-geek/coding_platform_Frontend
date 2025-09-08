"use client";

import { useEffect, useState } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
// import { deleteAdmin, getAllAdmins } from "@/API/admin";
// import { AdminType } from "@/types";
import SectionHeader from "@/components/adminDashboard/SectionHeader";
import CategoryFilter from "@/components/adminDashboard/CategoryFilter";
import SearchBar from "@/components/adminDashboard/SearchBar";
import SortSelect from "@/components/adminDashboard/SortSelect";
import AdminTable from "@/components/adminDashboard/administrators/AdminTable";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { formatUserData } from "@/lib/utils";
import { fetchUsers, removeUser } from "@/redux/features/userSlice";

const ITEMS_PER_PAGE = 5;
const roles = [
  "All",
  "Tech Lead",
  "QA Engineer",
  "Backend Dev",
  "Product Manager",
  "DevOps Engineer",
  "System Analyst",
];
const Page = () => {
  // const [admins, setAdmins] = useState<AdminType[]>([]);
  const dispatch = useAppDispatch();
  const { users: allUsers, status } = useAppSelector(
    (state: RootState) => state.user
  );
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("id_asc");
  const [currentPage, setCurrentPage] = useState(1);
  const route = useRouter();


  useEffect(() => {
    if (status === "idle" && !allUsers.length) {
      dispatch(fetchUsers());
    }
  }, [dispatch, allUsers, status]);

  console.log({allUsers})

  const regularUsers = allUsers.filter((user) => user.role === "admin");

  console.log({regularUsers})


  // useEffect(() => {
  //   const getAdmin = async () => {
  //     try {
  //       const res = await getAllAdmins();
  //       const formattedData = res?.map((admin: any) => ({
  //         id: admin._id,
  //         name: admin.name,
  //         country: admin?.address?.country,
  //         joinDate: admin.createdAt,
  //         role: admin.role,
  //         avatar: admin.avatar,
  //       }));
  //       // console.log({formattedData})
  //       setAdmins(formattedData);
  //     } catch (error) {
  //       console.error("Failed to fetch admins", error);
  //     }
  //   };

  //   getAdmin();
  // }, []);

  // Filter and sort users
  const filteredUsers = formatUserData(regularUsers)
    .filter((admin) => {
      const matchesSearch = admin.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory = category === "All" || admin.role === category;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "name_desc":
          return b.name.localeCompare(a.name);
        case "date_asc":
          return (
            new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime()
          );
        case "date_desc":
          return (
            new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()
          );
        default:
          return 0;
      }
    });

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // const handleDelete = async (id: string) => {
  //   try {
  //     await deleteAdmin(id);
  //     setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin.id !== id));
  //     toast.success("Admin deleted successfully.");
  //   } catch (error) {
  //     console.error("Failed to delete admin:", error);
  //     toast.error("Failed to delete admin.");
  //   }
  // };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(removeUser(id)).unwrap();
    } catch (error) {
      toast.error(error as string);
      console.error("Delete Error:", error);
    }
  };

  const handleAddAdministrator = () => {
    route.push(`/admin/administrator/addAdministrator`);
  };

  return (
    <section className="h-auto   p-7">
      <div className="container mx-auto">
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Administrators</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        {/* <SectionHeader
          title="Administrators"
          buttonText="Add Admin"
          onButtonClick={handleAddAdministrator}
          icon={<Plus />}
          className="mb-4"
        /> */}
        <h1 className="heading mb-4 mt-2">Administrators</h1>

        <div className="grid gap-4 md:grid-cols-3 mb-6 ">
          <SearchBar value={search} onChange={setSearch} />
          <CategoryFilter
            value={category}
            onChange={setCategory}
            subscriptionOptions={roles}
          />
          <SortSelect value={sortBy} onChange={setSortBy} />
        </div>

        {/* <UserTable users={paginatedUsers} onDelete={handleDelete} /> */}
        <AdminTable admins={paginatedUsers} onDelete={handleDelete} />

        <div className="mt-4">
          {typeof window !== "undefined" && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50 "
                        : "cursor-pointer text-[#742193] hover:text-[#57176e] hover:border hover:border-[#7421931A] hover:bg-[#7421931A]"
                    }
                  />
                </PaginationItem>

                {currentPage > 3 && (
                  <>
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => setCurrentPage(1)}
                        isActive={currentPage === 1}
                        className="cursor-pointer text-[#742193] hover:text-[#57176e]"
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    {currentPage > 4 && <PaginationEllipsis />}
                  </>
                )}

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNumber = Math.max(1, currentPage - 2) + i;
                  return pageNumber <= totalPages ? (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        onClick={() => setCurrentPage(pageNumber)}
                        isActive={currentPage === pageNumber}
                        className={
                          currentPage === pageNumber
                            ? "text-[#742193] border border-[#7421931A] bg-[#7421931A]"
                            : "cursor-pointer text-[#742193] hover:text-[#57176e]"
                        }
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  ) : null;
                })}

                {currentPage < totalPages - 2 && (
                  <>
                    {currentPage < totalPages - 3 && <PaginationEllipsis />}
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => setCurrentPage(totalPages)}
                        isActive={currentPage === totalPages}
                        className="cursor-pointer text-[#742193] hover:text-[#57176e]"
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer text-[#742193] hover:text-[#57176e] hover:border hover:border-[#7421931A] hover:bg-[#7421931A]"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </section>
  );
};

export default Page;
