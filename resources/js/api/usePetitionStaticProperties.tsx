import axios from "axios";
import { useEffect, useState } from "react";

export interface IPetitionStatus {
    [key: string]: {
        label: string,
        value: number,
        statusClass: string,
    }
}

export interface IPetitionStaticProperties {
    status: IPetitionStatus,
    pages_dropdown: {
        [key: string]: {
            [key: number]: number[];
        }
    }
    answer: number[],
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

export const getStatusOptions = () => {
    const properties = usePetitionStaticProperties()
    const options = properties?.pages_dropdown?.status_all[1];
    const statusArray = properties?.status ? Object.values(properties?.status) : [];
    const statusOptions = statusArray.filter(status => options?.includes(status.value));

    return statusOptions
}




export default usePetitionStaticProperties