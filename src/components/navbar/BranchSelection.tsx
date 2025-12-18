"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/dropdown";
import { Select, SelectItem } from "@nextui-org/select";
import { MapPinIcon, ChevronDownIcon } from "lucide-react";
import { Skeleton } from "@heroui/skeleton";
import { MyButton } from "../UI/MyButton";
import { useBranches } from "@/src/hooks/useBranch";
import { TBranch } from "@/src/interface/branch";

interface BranchSelectorProps {
  isMobile?: boolean;
}

export default function BranchSelector({ isMobile = false }: BranchSelectorProps) {
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: branchesResponse, isLoading } = useBranches();

  const branches: TBranch[] = useMemo(() => {
    if (!branchesResponse) return [];
    if (Array.isArray(branchesResponse)) return branchesResponse;
    if (branchesResponse.data && Array.isArray(branchesResponse.data)) return branchesResponse.data;

    return [];
  }, [branchesResponse]);

  const selectedBranchName = useMemo(() => {
    if (!selectedBranch) return "Select Branch";
    const branch = branches.find((b) => b._id === selectedBranch);

    return branch ? branch.name : "Select Branch";
  }, [selectedBranch, branches]);

  useEffect(() => {
    const branchParam = searchParams.get("branch");
    const savedBranch = localStorage.getItem("selectedBranch");

    if (branchParam) {
      setSelectedBranch(branchParam);
      localStorage.setItem("selectedBranch", branchParam);
    } else if (savedBranch) {
      setSelectedBranch(savedBranch);
    }
  }, [searchParams]);

  const handleBranchSelect = (branchId: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("branch", branchId);
    setSelectedBranch(branchId);
    localStorage.setItem("selectedBranch", branchId);
    router.push(`/?${params.toString()}`);
  };

  if (isMobile) {
    return isLoading ? (
      <Skeleton className="h-12 w-full rounded-lg" />
    ) : (
      <Select
        label="Select Your Branch"
        size="sm"
        startContent={<MapPinIcon className="w-5 h-5" />}
        value={selectedBranch}
        onChange={(e) => handleBranchSelect(e.target.value)}
        classNames={{ trigger: "h-12" }}
      >
        {branches.map((branch) => (
          <SelectItem
            key={branch._id || ""}
            value={branch._id || ""}
            textValue={branch.name}
          >
            <div className="flex flex-col">
              <span className="font-medium">{branch.name}</span>
              <span className="text-xs text-gray-500">
                {branch.location.city}, {branch.location.address}
              </span>
            </div>
          </SelectItem>
        ))}
      </Select>
    );
  }

  return isLoading ? (
    <Skeleton className="h-10 w-40 rounded-full" />
  ) : (
    <Dropdown placement="bottom-start" backdrop="blur">
      <DropdownTrigger>
        <MyButton
          variant="flat"
          className="flex items-center gap-2 text-sm font-bold bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-2xl px-5 py-2 hover:opacity-80 transition-opacity"
          endContent={<ChevronDownIcon className="w-3 h-3" />}
          startContent={<MapPinIcon className="w-4 h-4" />}
        >
          {selectedBranchName}
        </MyButton>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Branch selection"
        className="w-[350px] p-2"
        variant="flat"
      >
        {branches.map((branch) => (
          <DropdownItem
            key={branch._id || ""}
            textValue={branch.name}
            onPress={() => branch._id && handleBranchSelect(branch._id)}
            className={`py-3 ${selectedBranch === branch._id ? "bg-primary/10" : ""}`}
            startContent={
              <div className="p-2 bg-primary/10 rounded-xl">
                <MapPinIcon className="w-4 h-4 text-primary" />
              </div>
            }
          >
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-sm text-default-700">{branch.name}</span>
              <span className="text-tiny text-default-400 font-medium">
                {branch.location.address}, {branch.location.city}
              </span>
            </div>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
