import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types'
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import style from '../../css/PetitionAnswer.module.css'
import { PetitionButton } from '@/Components/Button/PetitionButton';

interface IErrorMessage {
    answer: string[]
}

export default function PetitionAnswer ({ auth }: PageProps)  {

    const queryParams = new URLSearchParams(window.location.search)
    const queryId = queryParams.get('id')

    const [petition,setPetition] = useState<IPetition>()
    const [answer, setAnswer] = useState('')
    const [errorMessage, setErrorMessage] = useState<IErrorMessage>()

    useEffect (() => {
        if(queryId) {
            const fetchPetitions = async () => {
                const {data:response} = await axios('/api/v1/petitions/edit', {params: {id: queryId}})
                setPetition(response)
                if(response.status !== 7) router.get('/petitions')
            }   
            fetchPetitions()
        } else router.get('/petitions')
    },[])

    const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setAnswer(e.target.value)
    }

    const handleAnswerClick = async (status:number) => {
        try {
            const {data:response} = await axios({method: 'post', url: '/api/v1/petitions/edit', params: { id: petition?.id, answer, status }})
            router.get('/petitions/view', {id: response.id})
        } catch (e : any) {
            let error = JSON.parse(e.request.response)
            setErrorMessage(error.errors)
        }
    }

return (
    <AuthenticatedLayout 
        user={auth.user}
        header={<h1 className="font-semibold text-xl text-gray-800 leading-tight">{`Give answer to: "${petition?.name}"`}</h1>}>

    <Head title = 'Give answer'/>

    <div className={style.outerBox}>

        <div className={style.nameBox}> 
            {petition?.name}
        </div>

        <div className={style.descriptionBox}> 
            {petition?.description}
        </div>

        <br />  

        <textarea className={style.editAnswer} maxLength={500} value={answer} onChange={e => handleAnswerChange(e)} />

        {errorMessage?.answer ? 
            <div>
                <span className={style.errorText}>{errorMessage.answer}</span>
            </div>     
        : '' 
        }

        <div className={style.buttonBox}>
            <span style={{marginRight: '30px'}}>
                <PetitionButton text = 'Give positive answer' onClick={() => handleAnswerClick(8)} />
            </span>
            <PetitionButton text = 'Give negative answer' onClick={() => handleAnswerClick(9)} />
        </div>
    </div>


    </AuthenticatedLayout>
)
}
