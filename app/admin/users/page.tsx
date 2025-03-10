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
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchUsers, removeUser } from "@/redux/features/userSlice";
import { RootState } from "@/redux/store";
import toast from "react-hot-toast";
import { formatUserData } from "@/lib/utils";
import SearchBar from "@/components/adminDashboard/SearchBar";
import CategoryFilter from "@/components/adminDashboard/CategoryFilter";
import SortSelect from "@/components/adminDashboard/SortSelect";
import UserTable from "@/components/adminDashboard/users/userTable";


const ITEMS_PER_PAGE = 5;
const subscriptionOptions = ["All", "Free", "Plan A", "Plan B", "Plan C"];

const Page = () => {
  const dispatch = useAppDispatch();
  const { users: allUsers, status } = useAppSelector(
    (state: RootState) => state.user
  );
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("id_asc");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (status === "idle" && !allUsers.length) {
      dispatch(fetchUsers());
    }
  }, [dispatch, allUsers, status]);

  const regularUsers = allUsers.filter((user) => user.role === "user");

  console.log(regularUsers);

  // console.log(allUsers);

  // Filter and sort users
  const filteredUsers = formatUserData(regularUsers)
    .filter((user) => {
      const matchesSearch = user.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        category === "All" || user.subscription === category;
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

  const handleDelete = async (id: string) => {
    try {
      await dispatch(removeUser(id)).unwrap();
    } catch (error) {
      toast.error(error as string);
      console.error("Delete Error:", error);
    }
  };

  return (
    <section className="h-auto   p-7">
      <div className="container mx-auto">
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Users</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <h1 className="heading mb-4 mt-2">Users</h1>

        <div className="grid gap-4 md:grid-cols-3 mb-6 ">
          <SearchBar value={search} onChange={setSearch} />
          <CategoryFilter
            value={category}
            onChange={setCategory}
            subscriptionOptions={subscriptionOptions}
          />
          <SortSelect value={sortBy} onChange={setSortBy} />
        </div>

        {/* <UserTable users={paginatedUsers} onDelete={handleDelete} /> */}
        {typeof window !== "undefined" && (
          <UserTable users={paginatedUsers} onDelete={handleDelete} />
        )}

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
