import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { PetitionItem } from '@/Components/PetitionItem';

export default function Petitions({ auth }: PageProps) {

    interface IPetition {
        
            id: number;
            created_by: number;
            moderated_by: number;
            answered_by: number;
            name: string;
            description: string;
            status: number;
            created_at: Date;
            updated_at: Date;
            deleted_at: Date;
            moderating_started_at: Date;
            activated_at: Date;
            declined_at: Date;
            supported_at: Date;
            answering_started_at: Date;
            answered_at: Date;
        
        
    }

    const [petitionsAll, setPetitionsAll] = useState<IPetition[]>([])
    const [petitionsMy, setPetitionsMy] = useState<IPetition[]>([])
    const [petitionsSigned, setPetitionsSigned] = useState([])
    const [selectedSort, setSelectedSort] = useState('1')

    useEffect(()=> {
        const fetchData = async() => {
            const result = await axios(
                '/api/v1/petitions/all',);
            setPetitionsAll(result.data.data);
            const resultMy = await axios(
                '/api/v1/petitions/my',);
            setPetitionsMy(resultMy.data.data);
            const resultSigned = await axios(
                '/api/v1/petitions/all',); //change when signed route is ready
            setPetitionsAll(resultSigned.data.data);
            }
            fetchData()
        },[])
        
        const selectSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
            setSelectedSort(e.target.value)
        }



    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Petitions</h2>}
        >
            <Head title="Petitions" />

            <button onClick={()=> console.log(petitionsAll)}>
                console check
            </button>

            <select name="selectedSort" defaultValue={'1'} onChange={e => selectSort(e)}>
                <option value="1">All</option>
                <option value="2">My</option>
                <option value="3">Signed</option>
            </select>
            { selectedSort === '1' ? 
                petitionsAll.map(item => <PetitionItem name={item.name} author={item.created_by} created_at={12} updated_at={42} key={item.id}  />)
            : selectedSort === '2' ?
              petitionsMy.map(item => <PetitionItem name={item.name} author={item.created_by} created_at={12} updated_at={42} key={item.id}  />)
            : 'empty' 
                }
            
        </AuthenticatedLayout>
    );
}
