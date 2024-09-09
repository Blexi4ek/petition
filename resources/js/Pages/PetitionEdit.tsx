import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router} from '@inertiajs/react';
import { PageProps } from '@/types';
import { useEffect, useState } from 'react';
import axios from 'axios';
import style from '../../css/PetitionEdit.module.css'
import { PetitionButton } from '@/Components/Button/PetitionButton';
import { loadStripe } from '@stripe/stripe-js';
import { UploadImages } from '@/Components/UploadImages/UploadImages';
import { ImageType } from 'react-images-uploading';

interface IErrorMessage {
    name: string[],
    description: string[]
}

export default function PetitionEdit({ auth }: PageProps) {

    const queryParams = new URLSearchParams(window.location.search)
    const queryId = queryParams.get('id')

    const [petition,setPetition] = useState<IPetition>()
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [errorMessage, setErrorMessage] = useState<IErrorMessage>()
    const [images, setImages] = useState<any>([]);

    

    useEffect(() => {
        if (queryId) {
            const fetchPetitions = async () => {
                const {data:response} = await axios('/api/v1/petitions/edit', {params: {id: queryId}})
                if(!response.name || (auth.user.id !== response.created_by && !auth.permissions.map(item => item.name).includes('edit petitions'))) { 
                    router.get('/petitions')
                }
                console.log(response)
                setPetition(response)
                setName(response.name)
                setDescription(response.description)
            }   
            fetchPetitions()
    }
    },[])

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    }

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value)
    }

    const handleEditClick = async (status:number) => {
        try {
            await axios({method: 'delete', url: '/api/v1/petition/imageClear', params: {id: petition?.id}})
            const formData = new FormData();  
            for (let i = 0; i < images.length; i++) {
                formData.append('image', images[i].dataURL);
                const resp = await axios.post('/api/v1/petitions/imageSave', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    params: {
                        id: petition?.id
                    }
                })
                console.log(resp)
            }
            
            const {data:response} = await axios({method: 'post', url: '/api/v1/petitions/edit', params: { id: petition?.id, name, description, status}})
            
            //router.get('/petitions/view', {id: response.id})
        } catch (e : any) {
            let error = JSON.parse(e.request.response)
            setErrorMessage(error.errors)
        }
    }

    const handlePaymentButton = async () => {
        const response = await axios({method: 'post', url: '/api/v1/petitions/edit/pay', params: {id: petition?.id}}).then(response => window.location.href = response.data)   
    }


    return (
        <AuthenticatedLayout
            user={auth.user}
            permissions={auth.permissions}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{petition? `Edit "${petition.name}"` : 'Create new petition'}     </h2>}>
                
            <Head title="Petition" />
            <button onClick={() => console.log(auth.permissions)}>check</button>
            <div className={style.outerBox}>

                <input className={style.editName} value={name} maxLength={100} onChange={e => handleNameChange(e) }/>

                {errorMessage?.name ? 
                <div>
                    <span className={style.errorText}>{errorMessage.name}</span>
                </div>     
                : '' 
                }

                <textarea className={style.editDescription} maxLength={500} value={description} onChange={e => handleDescriptionChange(e)} />

                {errorMessage?.description ? 
                <div>
                    <span className={style.errorText}>{errorMessage.description}</span>
                </div>     
                : '' 
                }

                <UploadImages images={images} setImages={setImages} />

                <div className={style.editBox}>
                    <PetitionButton text={'Save as draft'} onClick={() => handleEditClick(1)} />
                    <PetitionButton text={'Send to moderator'} onClick={() => handleEditClick(2)} />
                    <PetitionButton text={'Pay for petition'} onClick={() => handlePaymentButton()}/>
                </div>
                
            </div>
            

            


        </AuthenticatedLayout>
    );
}
