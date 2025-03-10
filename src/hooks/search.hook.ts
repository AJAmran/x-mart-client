import { useQuery } from "@tanstack/react-query";

import { searchItems } from "../services/search";

export const useSearchItems = (searchTerm: string) => {
  return useQuery({
    queryKey: ["SEARCH_ITEMS", searchTerm],
    queryFn: () => searchItems(searchTerm),
    enabled: !!searchTerm,
  });
};
