import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router} from '@inertiajs/react';
import { PageProps } from '@/types';
import { useEffect, useState } from 'react';
import axios from 'axios';
import style from '../../css/PetitionView.module.css'
import moment from 'moment';
import dateFormat from '@/consts/dateFormat';
import usePetitionStaticProperties from '@/api/usePetitionStaticProperties';


export default function PetitionView({ auth }: PageProps) {

    const queryParams = new URLSearchParams(window.location.search)
    const queryId = queryParams.get('id')
    const properties = usePetitionStaticProperties()
    

    const [petition,setPetition] = useState<IPetition>()
    const [refresh, setRefresh] = useState(false)
    

    useEffect(() => {
        const fetchPetitions = async () => {
            const {data:response} = await axios('/api/v1/petitions/view', {params: {id: queryId}})
            setPetition(response.data)
        }   
        fetchPetitions()
    },[refresh])

    const handleEditButton = () => {
        router.get('/petitions/edit', {id: petition?.id})
    }

    const handleSignButton = () => {
        axios('/api/v1/petitions/sign', {method:'post' ,params: {petition_id: petition?.id}})
        setRefresh(!refresh)
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">
                <span className={eval(properties?.status[petition?.status || 1].statusClass || '')}>{properties?.status[petition?.status || 1].label}</span> {' '}
                {petition ? petition.name : 'Loading'}</h2>}>
                
            <Head title="Petition" />

                <div className={style.topBox}>
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

                <div>
                    <button className={style.editButton} onClick={handleEditButton}>Edit description</button>

                    {petition? (properties?.signButton.includes(petition.status)) ?
                        (petition.user_petitions.filter(item => item.user.id === auth.user.id).length !== 0)?

                        <button disabled className={style.signedButton}>
                            Signed
                        </button>
                        : 
                        <button className={style.editButton} onClick={handleSignButton}>
                            Sign
                        </button>
                        : '' : ''
                    } 
                </div>
                

                {petition? (properties?.answer.includes(petition.status)) ?
                    <div className={style.answerBox}>
                        Answer 
                    </div> : '' : ''
                }

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
                

        </AuthenticatedLayout>
    );
}
