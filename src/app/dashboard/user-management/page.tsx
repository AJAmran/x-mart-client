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
import {
  FileSpreadsheet,
  FileText,
  PlusIcon,
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
          placeholder="Search users..."
          startContent={<SearchIcon size={18} className="text-gray-400" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
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
      <Table aria-label="Users table" className="mt-4">
        <TableHeader>
          <TableColumn>NAME</TableColumn>
          <TableColumn>EMAIL</TableColumn>
          <TableColumn>PHONE</TableColumn>
          <TableColumn>ROLE</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>

        <TableBody
          isLoading={isLoading}
          loadingContent="Loading users..."
          emptyContent="No users found"
        >
          {users.map((user: any) => (
            <TableRow key={user._id}>
              <TableCell className="flex items-center gap-2">
                {user.profilePhoto ? (
                  <img
                    src={user.profilePhoto}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-medium text-gray-600">
                    {user.name.charAt(0)}
                  </div>
                )}
                {user.name}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.mobileNumber || "-"}</TableCell>
              <TableCell>
                <Select
                  size="sm"
                  variant="underlined"
                  selectedKeys={[user.role]}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  className="w-24"
                >
                  {Object.entries(USER_ROLE).map(([key, value]) => (
                    <SelectItem key={key}>
                      {value}
                    </SelectItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    user.status === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user.status}
                </span>
              </TableCell>
              <TableCell>
                <UserActions
                  user={user}
                  onEdit={() => handleOpenForm(user)}
                  onDelete={refetch}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <Select
          size="sm"
          className="w-20"
          selectedKeys={[limit.toString()]}
          onChange={(e) => setLimit(Number(e.target.value))}
        >
          <SelectItem key="10">
            10
          </SelectItem>
          <SelectItem key="25">
            25
          </SelectItem>
          <SelectItem key="50">
            50
          </SelectItem>
          <SelectItem key="100">
            100
          </SelectItem>
        </Select>

        <Pagination
          total={totalPages}
          page={page}
          onChange={setPage}
          showControls
        />
      </div>

      {/* Modal */}
      <UserFormModal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        user={selectedUser}
      />
    </div>
  );
};

export default UserManagementPage;
