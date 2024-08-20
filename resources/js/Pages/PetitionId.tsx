import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head} from '@inertiajs/react';
import { PageProps } from '@/types';
import { useEffect, useState } from 'react';
import axios from 'axios';
import style from '../../css/PetitionId.module.css'


export default function Petitions({ auth }: PageProps) {

    const queryParams = new URLSearchParams(window.location.search)
    const queryId = queryParams.get('id')

    const [petition,setPetition] = useState<IPetition>()

    useEffect(() => {
        const fetchPetitions = async () => {
            const {data:response} = await axios('/api/v1/petitions/view', {params: {id: queryId}})
            setPetition(response)
        }   
        fetchPetitions()
    },[])

    const clickCheck = () => {
        console.log(petition)
    }


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{petition ? petition.name : 'Loading'}</h2>}>
                
            <Head title="Petition" />

            <div className="py-3">
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className={style.descriptionBox}>
                        <span className={style.descriptionText}>{petition ? petition.description : 'loading'}</span> 
                    </div>
                    
                </div>
            </div>
            

            <button onClick={()=> clickCheck()}>
                console check
            </button>


        </AuthenticatedLayout>
    );
}
