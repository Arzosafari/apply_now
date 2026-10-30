import { useQuery } from '@tanstack/react-query';
import { publicApi } from './api';

export function useSiteData() {
  return useQuery({
    queryKey: ['site'],
    queryFn: publicApi.site,
    staleTime: 60_000,
    retry: 1,
  });
}
