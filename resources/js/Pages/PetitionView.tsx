import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router} from '@inertiajs/react';
import { PageProps } from '@/types';
import { useEffect, useState } from 'react';
import axios from 'axios';
import style from '../../css/PetitionView.module.css'
import moment from 'moment';
import dateFormat from '@/consts/dateFormat';
import usePetitionStaticProperties from '@/api/usePetitionStaticProperties';
import { PetitionButton } from '@/Components/Button/PetitionButton';


export default function PetitionView({ auth }: PageProps) {

    const queryParams = new URLSearchParams(window.location.search)
    const queryId = queryParams.get('id')
    const properties = usePetitionStaticProperties()
    

    const [petition,setPetition] = useState<IPetition>()
    const [refresh, setRefresh] = useState(false)
    

    useEffect(() => {
        const fetchPetitions = async () => {
            const {data:response} = await axios('/api/v1/petitions/view', {params: {id: queryId}})
            if(response.data === null || 
                (properties?.editButton.includes(response.data.status) &&
                (auth.user.id !== response.data.created_by && !auth.permissions.map(item => item.name).includes('view petitions')))) { 
                router.get('/petitions')
            }
            console.log(response.data)
            setPetition(response.data)
        }   
        fetchPetitions()
    },[refresh, properties])

    const handleEditButton = () => {
        router.get('/petitions/edit', {id: petition?.id})
    }

    const handleAnswerButton = () => {
        router.get('/petitions/answer', {id: petition?.id})
    }

    const handleSignButton = async () => {
        await axios('/api/v1/petitions/sign', {method:'post' ,params: {petition_id: petition?.id}})
        setRefresh(!refresh)
    }

    const handleChangeStatusButton = async (statusId: number) => {
        await axios('/api/v1/petitions/statusChange', {method:'post', params: {petition_id: petition?.id, status:statusId}})
        setRefresh(!refresh)
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            permissions={auth.permissions}
            header={
                <div className={style.headerBox}>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        {petition? properties?.hasSigns.includes(petition.status) ?
                        <span className={style.signCount}>{petition?.user_petitions.length}</span> : '' : ''}
                        
                        <span className={eval(properties?.status[petition?.status || 1].statusClass || '')}>{properties?.status[petition?.status || 1].label}</span> {' '}
                        {petition ? petition.name : 'Loading'}
                    </h2> 
                    <h3 className={petition? eval(properties?.payment[petition.is_paid].class || ''): ''}>
                        {petition? properties?.payment[petition?.is_paid].label : ''}
                    </h3>
                    
                </div>
            }>
                
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

                <div className={style.buttonBox}>

                    {petition ? properties?.editButton.includes(petition.status) ? 
                        <span style={{marginLeft: '30px'}}>
                            <PetitionButton text={'Edit description'} onClick={handleEditButton} /> 
                        </span> : '' : ''
                    }

                    {auth.permissions.map(item => item.name).includes('answer petitions') ? petition ? petition.status === 7 ? 
                        <span style={{marginLeft: '30px'}}>
                            <PetitionButton text={'Give answer'} onClick={handleAnswerButton} /> 
                        </span> : '' : '' : ''
                    }
                    
                    {petition? (properties?.signButton.includes(petition.status)) ?
                        (petition.user_petitions.filter(item => item.user.id === auth.user.id).length !== 0)?

                        <button disabled className={style.signedButton}>
                            Signed
                        </button>
                        : 
                        <span style={{marginLeft: '30px',}}>
                            <PetitionButton text={'Sign'} onClick={handleSignButton} />
                        </span>
                        
                        : '' : ''
                    }

                    {auth.permissions.map(item => item.name).includes('unmoderated2active petitions') ? properties?.status[petition?.status || 1].childrenAdmin?.map((item,index) => 
                        <div key={index} style={{marginLeft: '30px'}}>
                            <PetitionButton text={properties.status[item].button} onClick={() => handleChangeStatusButton(item)} />
                        </div>
                    ) : ''
                    } 
                </div>
                

                {petition? (properties?.answer.includes(petition.status)) ?
                    <div style={{margin: '0px 30px'}}>
                        <span className={style.answerText}>
                            Given answer:
                        </span>
                        <div className={style.answerBox}>
                            {petition.answer? petition.answer : 'Error: no answer found'}
                        </div> 
                    </div>
                    : '' : ''
                }

                <div className={style.signBox}>
                    <h1 className={style.signHeader}>Petition signed by:</h1>
                    <table>
                        { petition?.user_petitions?.map((item) => 
                            <tbody key={item.id}>
                                <tr>
                                    <td style={{width: '10%'}}>{item.user.id}. </td>
                                    <td className={style.signName} align='left'>
                                        {item.user.name}
                                    </td> 
                                    <td align='right'>at: {(moment(Number(item.created_at) * 1000)).format(dateFormat)}</td>
                                </tr>
                            </tbody>
                        )}
                    </table>
                </div>
                

        </AuthenticatedLayout>
    );
}
