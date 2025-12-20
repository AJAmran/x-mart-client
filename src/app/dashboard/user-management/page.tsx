"use client";

import UserActions from "@/src/components/user/UserActions";
import UserFormModal from "@/src/components/user/UserFormModal";
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
import { Tooltip } from "@heroui/tooltip";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Chip } from "@heroui/chip";
import {
  FileSpreadsheet,
  FileText,
  RefreshCw,
  SearchIcon,
} from "lucide-react";
import React, { useState } from "react";

const UserManagementPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const { data, isLoading, refetch } = useUsers({
    page,
    limit,
    search,
  });

  const updateUserRole = useUpdateUserRole();

  const users = data?.data || [];
  const totalPages = Math.ceil((data?.meta?.total || 0) / limit);

  const handleExportExcel = () => {
    exportToExcel(users, "users");
  };

  const handleExportPDF = () => {
    exportToPDF(users, "users");
  };

  const handleOpenForm = (user: any = null) => {
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
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <h1 className="text-2xl font-bold">User Management</h1>
      </div>

      {/* Filters & Exports */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <Input
          className="max-w-xs"
          placeholder="Search users..."
          startContent={<SearchIcon className="text-gray-400" size={18} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2">
          <Tooltip content="Refresh">
            <Button isIconOnly variant="flat" onClick={() => refetch()}>
              <RefreshCw size={18} />
            </Button>
          </Tooltip>
          <Tooltip content="Export to Excel">
            <Button isIconOnly variant="flat" onClick={handleExportExcel}>
              <FileSpreadsheet size={18} />
            </Button>
          </Tooltip>
          <Tooltip content="Export to PDF">
            <Button isIconOnly variant="flat" onClick={handleExportPDF}>
              <FileText size={18} />
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* Table */}
      <Table
        aria-label="Users table"
        className="mt-4"
        classNames={{
          wrapper: "bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-none",
          th: "bg-gray-100/50 dark:bg-gray-900/50 text-default-600",
        }}
        shadow="none"
      >
        <TableHeader>
          <TableColumn>USER</TableColumn>
          <TableColumn>EMAIL</TableColumn>
          <TableColumn>PHONE</TableColumn>
          <TableColumn>ROLE</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn align="center">ACTIONS</TableColumn>
        </TableHeader>

        <TableBody
          emptyContent="No users found"
          isLoading={isLoading}
          loadingContent="Loading users..."
        >
          {users.map((user: any) => (
            <TableRow key={user._id} className="border-b border-gray-100 dark:border-gray-800 last:border-none">
              <TableCell>
                <div className="flex items-center gap-3">
                  {user.profilePhoto ? (
                    <img
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-primary/20"
                      src={user.profilePhoto}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">{user.name}</span>
                    <span className="text-tiny text-default-400 capitalize">{user.role.toLowerCase()}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm font-medium">{user.email}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-default-500">{user.mobileNumber || "N/A"}</span>
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
                    <SelectItem key={key}>
                      {value}
                    </SelectItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell>
                <Chip
                  color={user.status === "ACTIVE" ? "success" : "danger"}
                  size="sm"
                  variant="flat"
                >
                  {user.status}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="flex justify-center">
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

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <Select
          className="w-48"
          label="Rows per page"
          labelPlacement="outside-left"
          selectedKeys={[limit.toString()]}
          size="sm"
          onChange={(e) => setLimit(Number(e.target.value))}
        >
          <SelectItem key="10">10 per page</SelectItem>
          <SelectItem key="25">25 per page</SelectItem>
          <SelectItem key="50">50 per page</SelectItem>
          <SelectItem key="100">100 per page</SelectItem>
        </Select>

        <Pagination
          showControls
          color="primary"
          page={page}
          total={totalPages}
          variant="flat"
          onChange={setPage}
        />
      </div>

      {/* Modal */}
      <UserFormModal
        isOpen={isFormOpen}
        user={selectedUser}
        onClose={handleCloseForm}
      />
    </div>
  );
};

export default UserManagementPage;
