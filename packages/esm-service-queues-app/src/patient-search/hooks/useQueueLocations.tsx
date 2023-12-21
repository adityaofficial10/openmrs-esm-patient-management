import { useMemo } from 'react';
import useSWR from 'swr';
import { fhirBaseUrl, openmrsFetch } from '@openmrs/esm-framework';

interface FHIRResponse {
  entry: Array<{ resource: fhir.Location }>;
  total: number;
  type: string;
  resourceType: string;
}
export function useQueueLocations() {
  const apiUrl = `${fhirBaseUrl}/Location?_summary=data&_tag=queue location`;
  const { data, error, isLoading } = useSWR<{ data: FHIRResponse }>(apiUrl, openmrsFetch);

  const queueLocations = useMemo(
    () =>
      data?.data?.entry
        ?.map((response) => response.resource)
        ?.sort(
          // sort location names with case-insensitive option
          (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
        ) ?? [],
    [data?.data?.entry],
  );
  return { queueLocations: queueLocations ? queueLocations : [], isLoading, error };
}
