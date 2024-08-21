import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router} from '@inertiajs/react';
import { PageProps } from '@/types';
import { useEffect, useState } from 'react';
import axios from 'axios';
import style from '../../css/PetitionEdit.module.css'



export default function PetitionEdit({ auth }: PageProps) {

    const queryParams = new URLSearchParams(window.location.search)
    const queryId = queryParams.get('id')

    const [petition,setPetition] = useState<IPetition>()
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')

    

    useEffect(() => {
        const fetchPetitions = async () => {
            const {data:response} = await axios('/api/v1/petitions/edit', {params: {id: queryId}})
            setPetition(response)
            setName(response.name)
            setDescription(response.description)
        }   
        fetchPetitions()
    },[])

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    }

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value)
    }

    const handleEditClick = () => {
        axios({method: 'post', url: '/api/v1/petitions/edit', params: { id: petition?.id, name, description }})
        router.get('/petitions/view', {id: petition?.id})
    }


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit "{petition?.name}"</h2>}>
                
            <Head title="Petition" />

            <div className={style.outerBox}>

                <input className={style.editName} value={name} onChange={e => handleNameChange(e)}/>

                <textarea className={style.editDescription} value={description} onChange={e => handleDescriptionChange(e)} />

                <button className={style.editButton} onClick={() => handleEditClick()}>Finish editing</button>
            </div>
            

            


        </AuthenticatedLayout>
    );
}
