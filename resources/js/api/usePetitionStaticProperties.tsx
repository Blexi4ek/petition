import axios from "axios";
import { useEffect, useState } from "react";

export interface IPetitionStatus {
    [key: string]: {
        label: string,
        value: number,
        statusClass: string,
        buttonClass: string,
        activeButtonClass: string
    }
}

export interface IPetitionStaticProperties {
    status: IPetitionStatus,
    pages_dropdown: {
        [key: number]: {
            [key: string]: number[];
        }
    }
    answer: number[],
    signButton: number[],
    payment: {
        label: string,
        value: number
    }
}

function usePetitionStaticProperties() { 

    const [properties, setProperties] = useState<IPetitionStaticProperties>()

    useEffect(() => {
        const fetchProperties = async () => {
            const response = await axios('/api/v1/petitions/staticProperties')
            setProperties(response.data)
        }
        fetchProperties()
    },[])
    
    return properties
}

export const getStatusOptions = (role: number, statusPath: string) => {
    let statusMode
    if (statusPath === '/petitions/my') statusMode = 'status_my'
    else if (statusPath === '/petitions/signs') statusMode = 'status_signs'
    else if (statusPath === '/petitions/moderated') statusMode = 'status_moderated'
    else if (statusPath === '/petitions/response') statusMode = 'status_response'
    else statusMode = 'status_all'

    const properties = usePetitionStaticProperties()
    const options = properties?.pages_dropdown[role][statusMode];
    const statusArray = properties?.status ? Object.values(properties?.status) : [];
    const statusOptions = statusArray.filter(status => options?.includes(status.value));

    return statusOptions
}




export default usePetitionStaticProperties