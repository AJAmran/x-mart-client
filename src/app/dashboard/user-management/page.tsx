"use client";

import { useState } from "react";
import {
  FileSpreadsheet,
  FileText,
  RefreshCw,
  SearchIcon,
  Users,
} from "lucide-react";

import UserActions from "@/src/components/user/UserActions";
import UserFormModal from "@/src/components/user/UserFormModal";
import {
  StatusBadge,
  userStatusTone,
} from "@/src/components/dashboard/StatusBadge";
import { IconButton } from "@/src/components/dashboard/Controls";
import { Toolbar, ToolbarGroup } from "@/src/components/dashboard/Panel";
import { PageHeader } from "@/src/components/UI/Section";
import { Container } from "@/src/components/UI/Container";
import { USER_ROLE } from "@/src/constants";
import { useUsers, useUpdateUserRole } from "@/src/hooks/useUser";
import { exportToExcel, exportToPDF } from "@/src/utils/exportUtils";
import { Pagination } from "@heroui/pagination";
import { Select, SelectItem } from "@heroui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { IUser } from "@/src/types";

const UserManagementPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const { data, isLoading, refetch } = useUsers({
    page,
    limit,
    search,
  });

  const updateUserRole = useUpdateUserRole();

  const users = data?.data || [];
  const total = data?.meta?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const handleExportExcel = () => {
    exportToExcel(users, "users");
  };

  const handleExportPDF = () => {
    exportToPDF(users, "users");
  };

  const handleOpenForm = (user: IUser | null = null) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedUser(null);
  };

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      await updateUserRole.mutateAsync({ id: userId, role });
      refetch();
    } catch {
      // Role update failed — the table stays on the previous value.
    }
  };

  return (
    <>
      <PageHeader
        action={
          <div className="flex items-center gap-2">
            <IconButton label="Refresh users" onClick={() => refetch()}>
              <RefreshCw className="size-4" />
            </IconButton>
            <IconButton label="Export to Excel" onClick={handleExportExcel}>
              <FileSpreadsheet className="size-4" />
            </IconButton>
            <IconButton label="Export to PDF" onClick={handleExportPDF}>
              <FileText className="size-4" />
            </IconButton>
          </div>
        }
        description="Registered accounts, roles, and account health."
        eyebrow="General"
        title="User management"
      />

      <Container className="py-6 sm:py-8">
        {/* Filters */}
        <Toolbar className="mb-5">
          <div className="relative w-full max-w-xs">
            <label className="sr-only" htmlFor="user-search">
              Search users
            </label>
            <SearchIcon
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-content-subtle"
            />
            <input
              className="h-9 w-full rounded-md border border-line-hairline bg-surface-raised pl-9 pr-3 text-body-sm text-content transition-colors duration-fast ease-standard placeholder:text-content-subtle hover:border-line-strong focus:border-brand focus:outline-none"
              id="user-search"
              placeholder="Search by name or email…"
              type="search"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />
          </div>
          <ToolbarGroup className="md:ml-auto">
            <p className="tabular text-label-sm text-content-subtle">
              {total} {total === 1 ? "user" : "users"}
            </p>
          </ToolbarGroup>
        </Toolbar>

        {/* Table */}
        <section className="overflow-hidden rounded-lg border border-line-hairline bg-surface-raised shadow-xs">
          <div className="overflow-x-auto">
            <Table
              aria-label="Users table"
              classNames={{
                th: "text-overline font-semibold uppercase tracking-[0.12em] text-content-subtle",
              }}
              shadow="none"
            >
              <TableHeader>
                <TableColumn>User</TableColumn>
                <TableColumn className="hidden md:table-cell">
                  Email
                </TableColumn>
                <TableColumn className="hidden lg:table-cell">
                  Phone
                </TableColumn>
                <TableColumn>Role</TableColumn>
                <TableColumn>Status</TableColumn>
                <TableColumn align="end">Actions</TableColumn>
              </TableHeader>

              <TableBody
                emptyContent={
                  <div className="flex flex-col items-center gap-3 py-16 text-center">
                    <span className="grid size-12 place-items-center rounded-full border border-dashed border-line-strong bg-surface-sunken text-content-subtle">
                      <Users aria-hidden size={20} />
                    </span>
                    <p className="text-body-sm font-medium text-content">
                      No users found
                    </p>
                    <p className="max-w-sm text-label-sm text-content-subtle">
                      Try a different search, or register a new account from
                      the storefront.
                    </p>
                  </div>
                }
                isLoading={isLoading}
              >
                {users.map((user: IUser) => (
                  <TableRow
                    key={user._id}
                    className="transition-colors duration-fast hover:bg-surface-sunken/60"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {user.profilePhoto ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            alt={user.name}
                            className="size-9 rounded-full border border-line-hairline object-cover"
                            src={user.profilePhoto}
                          />
                        ) : (
                          <span className="grid size-9 place-items-center rounded-full bg-brand-subtle text-label-sm font-bold text-brand">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate text-body-sm font-semibold text-content">
                            {user.name}
                          </span>
                          <span className="text-label-sm capitalize text-content-subtle">
                            {user.role.toLowerCase()}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-body-sm text-content-muted">
                        {user.email}
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="tabular text-body-sm text-content-muted">
                        {user.mobileNumber || "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Select
                        className="w-32"
                        selectedKeys={[user.role]}
                        size="sm"
                        variant="bordered"
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      >
                        {Object.entries(USER_ROLE).map(([key, value]) => (
                          <SelectItem key={key}>{value}</SelectItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>
                      <StatusBadge dot tone={userStatusTone(user.status)}>
                        {user.status}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <UserActions
                          user={user}
                          onDelete={refetch}
                          onEdit={() => handleOpenForm(user)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination footer */}
          <div className="flex flex-col gap-3 border-t border-line-hairline px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
            <Select
              className="w-40"
              selectedKeys={[limit.toString()]}
              size="sm"
              variant="bordered"
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
            >
              <SelectItem key="10">10 per page</SelectItem>
              <SelectItem key="25">25 per page</SelectItem>
              <SelectItem key="50">50 per page</SelectItem>
              <SelectItem key="100">100 per page</SelectItem>
            </Select>
            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <p className="tabular text-label-sm text-content-subtle">
                Page {page} of {totalPages}
              </p>
              <Pagination
                showControls
                color="primary"
                page={page}
                total={totalPages}
                variant="flat"
                onChange={setPage}
              />
            </div>
          </div>
        </section>

        {/* Modal */}
        <UserFormModal
          isOpen={isFormOpen}
          user={selectedUser}
          onClose={handleCloseForm}
        />
      </Container>
    </>
  );
};

export default UserManagementPage;
