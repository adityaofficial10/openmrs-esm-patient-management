import useSWRImmutable from 'swr/immutable';
import { type FetchResponse, openmrsFetch, useConfig } from '@openmrs/esm-framework';
import { type ConfigObject } from '../config-schema';

export function useServiceConcepts() {
  const config = useConfig<ConfigObject>();
  const {
    concepts: { serviceConceptSetUuid },
  } = config;

  const apiUrl = `/ws/rest/v1/concept/${serviceConceptSetUuid}`;
  const { data, isLoading } = useSWRImmutable<FetchResponse>(apiUrl, openmrsFetch);

  return {
    queueConcepts: data ? data?.data?.setMembers : [],
    isLoading,
  };
}

export function saveQueue(queueName: string, queueConcept: string, queueDescription: string, queueLocation: string) {
  const abortController = new AbortController();

  return openmrsFetch(`/ws/rest/v1/queue`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: abortController.signal,
    body: {
      name: queueName,
      description: queueDescription,
      service: { uuid: queueConcept },
      location: {
        uuid: queueLocation,
      },
    },
  });
}
