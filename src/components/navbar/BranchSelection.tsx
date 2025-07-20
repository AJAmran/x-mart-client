"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/dropdown";
import { Select, SelectItem } from "@nextui-org/select";
import { Card, CardBody } from "@nextui-org/card";
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

  const branchAreas = useMemo(() => {
    if (!Array.isArray(branches)) return [];
    const areasMap = new Map<
      string,
      { label: string; branches: Array<{ label: string; value: string; branch: TBranch }> }
    >();

    branches.forEach((branch: TBranch) => {
      if (!branch?._id || !branch?.location?.city) return;
      const city = branch.location.city;

      if (!areasMap.has(city)) {
        areasMap.set(city, { label: city, branches: [] });
      }
      areasMap.get(city)?.branches.push({
        label: branch.name,
        value: branch._id,
        branch,
      });
    });

    return Array.from(areasMap.values());
  }, [branches]);

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
            key={branch._id}
            value={branch._id}
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
    <Dropdown>
      <DropdownTrigger>
        <MyButton
          variant="ghost"
          className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-primary-100/50 dark:hover:bg-primary-900/30 rounded-full px-4 py-2"
          endContent={<ChevronDownIcon className="w-4 h-4" />}
          startContent={<MapPinIcon className="w-5 h-5" />}
        >
          {selectedBranchName}
        </MyButton>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Branch selection"
        className="w-[400px] max-h-[500px] overflow-y-auto p-2"
        itemClasses={{ base: "gap-4" }}
      >
        {branchAreas.map((area) => (
          <DropdownItem key={area.label} textValue={area.label} className="group" isReadOnly>
            <div className="w-full">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">
                Select Area
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {area.branches.map((branch) => (
                  <Card
                    key={branch.value}
                    isPressable
                    onPress={() => handleBranchSelect(branch.value)}
                    className={`border-2 ${
                      selectedBranch === branch.value
                        ? "border-primary-500 dark:border-primary-400"
                        : "border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                    }`}
                  >
                    <CardBody className="p-3">
                      <div className="flex gap-3">
                        <div className="flex flex-col">
                          <h4 className="font-semibold">{branch.label}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {branch.branch.location.address}
                          </p>
                          <div className="flex items-center mt-1">
                            <MapPinIcon className="w-4 h-4 text-primary-500 mr-1" />
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {branch.branch.location.city}, {branch.branch.location.state}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}