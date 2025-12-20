
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Chip } from "@nextui-org/chip";
import { MapPinIcon, ChevronDownIcon, Navigation, Search, Clock, Store } from "lucide-react";
import { Skeleton } from "@heroui/skeleton";
import { useBranches } from "@/src/hooks/useBranch";
import { TBranch, TBranchOperatingHours } from "@/src/interface/branch";
import { toast } from "sonner";
import { ScrollShadow } from "@nextui-org/scroll-shadow";

interface BranchSelectorProps {
  isMobile?: boolean;
}

// Haversine formula to calculate distance
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const isOpenNow = (operatingHours: TBranchOperatingHours[]): boolean => {
  if (!operatingHours || operatingHours.length === 0) return false;

  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = days[now.getDay()];

  const todaySchedule = operatingHours.find(h => h.day === currentDay);

  if (!todaySchedule || todaySchedule.isClosed) return false;

  const currentTime = now.getHours() * 60 + now.getMinutes();

  const [openHour, openMin] = todaySchedule.openingTime.split(':').map(Number);
  const [closeHour, closeMin] = todaySchedule.closingTime.split(':').map(Number);

  const openTime = openHour * 60 + openMin;
  const closeTime = closeHour * 60 + closeMin;

  return currentTime >= openTime && currentTime <= closeTime;
};

export default function BranchSelector({ isMobile = false }: BranchSelectorProps) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [isLocating, setIsLocating] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: branchesResponse, isLoading } = useBranches();

  // Memoized branches list
  const allBranches: TBranch[] = useMemo(() => {
    if (!branchesResponse) return [];
    if (Array.isArray(branchesResponse)) return branchesResponse;
    if (branchesResponse.data && Array.isArray(branchesResponse.data)) return branchesResponse.data;

    return [];
  }, [branchesResponse]);

  // Handle initialization
  useEffect(() => {
    if (isLoading) return;

    // 1. Try URL param
    const branchParam = searchParams.get("branch");

    if (branchParam) {
      // Validate if this branch exists
      const exists = allBranches.find(b => b._id === branchParam);

      if (exists) {
        setSelectedBranch(branchParam);
        localStorage.setItem("selectedBranch", branchParam);

        return;
      }
    }

    // 2. Try LocalStorage
    const savedBranch = localStorage.getItem("selectedBranch");

    if (savedBranch) {
      const exists = allBranches.find(b => b._id === savedBranch);

      if (exists) {
        setSelectedBranch(savedBranch);

        return;
      }
    }

    // 3. If nothing selected & branches exist, try auto-detect (once)
    if (allBranches.length > 0 && !branchParam && !savedBranch) {
      detectLocation(true);
    }
  }, [searchParams, isLoading, allBranches]);


  const detectLocation = (isAuto = false) => {
    if (!navigator.geolocation) {
      if (!isAuto) toast.error("Geolocation is not supported");

      return;
    }

    setIsLocating(true);
    if (!isAuto) toast.info("Locating nearby stores...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setUserLocation({ lat: latitude, lng: longitude });

        // Auto-select logic logic (only if auto)
        if (isAuto) {
          let nearestId = "";
          let minDistance = Infinity;

          allBranches.forEach(branch => {
            if (branch.location.coordinates?.coordinates) {
              const [lng, lat] = branch.location.coordinates.coordinates;
              const d = calculateDistance(latitude, longitude, lat, lng);

              if (d < minDistance) {
                minDistance = d;
                nearestId = branch._id || "";
              }
            }
          });

          if (nearestId) {
            handleSelectBranch(nearestId, false); // Don't redirect on auto
            if (!isAuto) toast.success("Found nearest store!");
          }
        }
        setIsLocating(false);
      },
      (error) => {
        console.error(error);
        if (!isAuto) toast.error("Could not retrieve location");
        setIsLocating(false);
      }
    );
  };

  const currentBranchDef = allBranches.find(b => b._id === selectedBranch);

  const processedBranches = useMemo(() => {
    let processed = [...allBranches];

    // Filter by search
    if (searchQuery) {
      const lowerQ = searchQuery.toLowerCase();

      processed = processed.filter(b =>
        b.name.toLowerCase().includes(lowerQ) ||
        b.location.city.toLowerCase().includes(lowerQ) ||
        b.location.address.toLowerCase().includes(lowerQ)
      );
    }

    // Calculate distance & sort if user location works
    if (userLocation) {
      processed = processed.map(b => {
        let dist = Infinity;

        if (b.location.coordinates?.coordinates) {
          const [lng, lat] = b.location.coordinates.coordinates;

          dist = calculateDistance(userLocation.lat, userLocation.lng, lat, lng);
        }

        return { ...b, distance: dist };
      }).sort((a, b) => (a as any).distance - (b as any).distance);
    }

    return processed;
  }, [allBranches, searchQuery, userLocation]);


  const handleSelectBranch = (id: string, redirect = true) => {
    setSelectedBranch(id);
    localStorage.setItem("selectedBranch", id);
    if (redirect) {
      const params = new URLSearchParams(searchParams.toString());

      params.set("branch", id);
      router.push(`/? ${params.toString()} `);
    }
    onClose();
  };

  const TriggerButton = (
    <Button
      variant="flat"
      className={`
         bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-700
         ${isMobile ? "w-full h-12 justify-start px-4" : "h-10 px-4 min-w-[200px] justify-between"}
         group hover:border-primary/50 hover:bg-white dark:hover:bg-zinc-800 transition-all rounded-full
       `}
      onPress={onOpen}
      startContent={
        <div className="p-1.5 bg-primary/10 rounded-full text-primary group-hover:scale-110 transition-transform">
          <Store size={isMobile ? 18 : 16} />
        </div>
      }
      endContent={!isMobile && <ChevronDownIcon size={14} className="text-zinc-400 group-hover:text-primary transition-colors" />}
    >
      <div className="flex flex-col items-start text-left mx-2">
        <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider leading-none mb-0.5">
          Shopping at
        </span>
        <span className="text-sm font-bold text-zinc-800 dark:text-zinc-100 truncate max-w-[140px]">
          {currentBranchDef ? currentBranchDef.name : "Select Store"}
        </span>
      </div>
    </Button>
  );

  if (isLoading) return <Skeleton className={isMobile ? "w-full h-12 rounded-lg" : "w-40 h-10 rounded-full"} />;

  return (
    <>
      {TriggerButton}

      <Modal
        backdrop="blur"
        classNames={{
          base: "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl",
          header: "border-b border-zinc-100 dark:border-zinc-800",
          body: "p-0",
        }}
        isOpen={isOpen}
        scrollBehavior="inside"
        size="2xl"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(_onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 px-6 py-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  Select Your Store
                  <Chip color="primary" size="sm" variant="flat">
                    {allBranches.length} Available
                  </Chip>
                </h2>
                <p className="text-sm text-zinc-500 font-normal">
                  Choose a store nearby to check availability and prices.
                </p>
              </ModalHeader>

              <div className="sticky top-0 z-20 bg-white dark:bg-zinc-900 px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 space-y-4">
                <div className="flex gap-2">
                  <Input
                    isClearable
                    classNames={{
                      inputWrapper: "bg-zinc-100 dark:bg-zinc-800 group-data-[focus=true]:bg-white border-none shadow-none",
                    }}
                    placeholder="Search branch by name or area..."
                    size="lg"
                    startContent={<Search className="text-zinc-400" size={18} />}
                    value={searchQuery}
                    onClear={() => setSearchQuery("")}
                    onValueChange={setSearchQuery}
                  />
                  <Button
                    isIconOnly
                    className="min-w-[48px] h-[48px]"
                    color={isLocating ? "primary" : "default"}
                    isLoading={isLocating}
                    variant={isLocating ? "solid" : "flat"}
                    onPress={() => detectLocation(false)}
                  >
                    {!isLocating && <Navigation size={20} />}
                  </Button>
                </div>
              </div>

              <ModalBody>
                <ScrollShadow className="h-[400px] w-full p-6">
                  {processedBranches.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-zinc-400">
                      <Store className="mb-4 opacity-50" size={48} strokeWidth={1.5} />
                      <p>No stores found matching &quot;{searchQuery}&quot;</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {processedBranches.map((branch) => {
                        const isOpen = isOpenNow(branch.operatingHours);
                        const dist = (branch as any).distance;
                        const isSelected = selectedBranch === branch._id;

                        return (
                          <div
                            key={branch._id}
                            className={`
                                            group relative p - 4 rounded - 2xl border transition - all cursor - pointer text - left
                                            ${isSelected
                                ? "border-primary bg-primary/5 shadow-md"
                                : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-lg bg-white dark:bg-zinc-900"
                              }
`}
                            role="button"
                            tabIndex={0}
                            onClick={() => branch._id && handleSelectBranch(branch._id)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                branch._id && handleSelectBranch(branch._id);
                              }
                            }}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-2">
                                <div className={`p - 2 rounded - lg ${isSelected ? 'bg-primary text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 group-hover:text-primary transition-colors'} `}>
                                  <Store size={18} />
                                </div>
                                <div>
                                  <h3 className={`font - bold ${isSelected ? 'text-primary' : 'text-zinc-900 dark:text-zinc-100 group-hover:text-primary transition-colors'} `}>
                                    {branch.name}
                                  </h3>
                                  {dist !== undefined && dist !== Infinity && (
                                    <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                                      <Navigation size={10} />
                                      {dist < 1 ? `${(dist * 1000).toFixed(0)} m` : `${dist.toFixed(1)} km`} away
                                    </span>
                                  )}
                                </div>
                              </div>
                              {isSelected && (
                                <Chip className="h-5" color="primary" size="sm" variant="solid">Selected</Chip>
                              )}
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                                <MapPinIcon size={12} />
                                <span className="truncate">{branch.location.address}, {branch.location.city}</span>
                              </div>

                              <div className="flex items-center justify-between pt-2 border-t border-dashed border-zinc-200 dark:border-zinc-800">
                                <div className={`flex items - center gap - 1.5 text - xs font - semibold ${isOpen ? 'text-green-600' : 'text-red-500'} `}>
                                  <Clock size={12} />
                                  {isOpen ? 'Open Now' : 'Closed'}
                                </div>
                                <span className="text-[10px] text-zinc-400">
                                  {/* Optional: Show closing time logic here */}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </ScrollShadow>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
