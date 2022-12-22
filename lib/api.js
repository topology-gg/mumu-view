import useSWR from "swr"

const fetcher = (...args) => fetch(...args).then(res => res.json())

export function useAllSolutions () {
    return useSWR('/api/allSolutions', fetcher)
}

export function useSolutions (minimum) {
    return useSWR(`/api/solutions/${minimum}`, fetcher)
}

export function useStardiscRegistryByAccount (account) {
    return useSWR(`/api/stardisc_registry/${account}`, fetcher)
}