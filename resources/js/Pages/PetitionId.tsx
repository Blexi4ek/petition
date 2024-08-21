import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head} from '@inertiajs/react';
import { PageProps } from '@/types';
import { useEffect, useState } from 'react';
import axios from 'axios';
import style from '../../css/PetitionId.module.css'
import moment from 'moment';
import dateFormat from '@/consts/dateFormat';


export default function Petitions({ auth }: PageProps) {

    const queryParams = new URLSearchParams(window.location.search)
    const queryId = queryParams.get('id')
    

    const [petition,setPetition] = useState<IPetition>()

    

    useEffect(() => {
        const fetchPetitions = async () => {
            const {data:response} = await axios('/api/v1/petitions/view', {params: {id: queryId}})
            setPetition(response.data)
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
                <div className={style.outerBox}>
                    <div className={style.descriptionBox}>
                        <span className={style.descriptionText}>{petition ? petition.description : 'loading'}</span> 
                    </div>

                    <div className={style.infoBox}>
                        <span className={style.descriptionText}>Created by: {petition ? petition.userName : 'loading'}
                            {' '} at: {petition ? (moment(Number(petition.created_at) * 1000)).format(dateFormat) : 'error'} 
                            <br/> Approved by: {petition? petition.adminName ? petition.adminName : 'Has not yet been approved' : 'loading'}
                            {' '} at: {petition ? petition.activated_at ?  (moment(Number(petition.activated_at) * 1000)).format(dateFormat):' ': 'error'} 
                            <br/> Answered by: {petition? petition.politicianName : 'loading'}
                            {' '} at: {petition ? petition.answered_at ?  (moment(Number(petition.answered_at) * 1000)).format(dateFormat):' ': 'error'} 
                        </span> 
                    </div>
                </div>

                <div className={style.signBox}>
                    <h1 className={style.signHeader}>Petition signed by:</h1>
                    <div>vasya, petya,</div>
                </div>
                
            </div>
            

            <button onClick={()=> clickCheck()}>
                console check
            </button>


        </AuthenticatedLayout>
    );
}
