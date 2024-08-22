import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router} from '@inertiajs/react';
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
            console.log(response)
        }   
        fetchPetitions()
    },[])

    const handleEditButton = () => {
        router.get('/petitions/edit', {id: petition?.id})
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
                        <span className={style.descriptionText}>
                            Created by: {  petition?.user_creator?.name || 'loading' } {' '} at: {petition ? (moment(Number(petition.created_at) * 1000)).format(dateFormat) : 'loading'} 
                            <br/> { petition?.user_moderator?  `Approved by: ${petition.user_moderator.name} at:` : 'Has not yet been approved'}
                            { petition?.activated_at ? (moment(Number(petition.activated_at) * 1000)).format(dateFormat):' '} 
                            <br/> { petition?.supported_at ? `Supported at: ${(moment(Number(petition.supported_at) * 1000)).format(dateFormat)}`: 'Has not yet been supported'} 
                            <br/> { petition?.answering_started_at ? `Signs finished at: ${(moment(Number(petition.answering_started_at) * 1000)).format(dateFormat)}`:'Signing is not yet finished'} 
                            <br/> { petition?.user_politician ?  `Answered by: ${petition.user_politician.name} at:`  : 'Has not yet been answered' }
                            {petition?.answered_at ? (moment(Number(petition.answered_at) * 1000)).format(dateFormat):' '} 
                        </span> 
                    </div>
                </div>

                <button className={style.editButton} onClick={handleEditButton}>Edit description</button>

                <div className={style.signBox}>
                    <h1 className={style.signHeader}>Petition signed by:</h1>
                    <div>
                        { petition?.user_petitions?.map((item) => 
                            <div className={style.signInnerBox} key={item.id}>
                                
                                <span>{item.user.id}. </span>
                                    <span className={style.signName}>
                                        {item.user.name}
                                    </span>
                                    
                                at: {(moment(Number(item.created_at) * 1000)).format(dateFormat)}
                            </div>
                        )}
                    </div>
                </div>
                
            </div>

        </AuthenticatedLayout>
    );
}
