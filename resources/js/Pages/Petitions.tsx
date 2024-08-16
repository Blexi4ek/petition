import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { PetitionItem } from '@/Components/PetitionItem';
import { MultiSelect } from 'primereact/multiselect';
import ReactPaginate from 'react-paginate';
import style from '../../css/Petition.module.css'
import optionsStatus from '../consts/petitionOptionsStatus'


export default function Petitions({ auth }: PageProps) {

    const queryParams = new URLSearchParams(window.location.search)
    const queryPage = queryParams.get('page')

    const [petitions, setPetitions] = useState<IPetition[]>([])
    const [petitionsAll, setPetitionsAll] = useState<IPetition[]>([])
    const [petitionsMy, setPetitionsMy] = useState<IPetition[]>([])
    const [petitionsSigned, setPetitionsSigned] = useState([])
    const [selectedSort, setSelectedSort] = useState('1')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)

    const [selectedStatus, setSelectedStatus] = useState([20, 30, 50, 60, 80])



    useEffect(()=> {
        if (queryPage) setPage(Number(queryPage))
        if (queryParams.getAll('status[0]')) {
            let queryStatus:number[] = []
            queryParams.forEach((value, key) => {
                if (key.includes('status')) queryStatus.push(Number(value))
            })
            console.log(queryStatus)
            setSelectedStatus(queryStatus)
        }
    },[])

    useEffect(()=> {
        const fetchPetitions = async () => {   
            const {data: response} = await axios(`/api/v1/petitions`, {params: {
                page, selectedStatus
            }});
            setTotalPages(response.last_page)
            setPetitions(response.data)


        }
        fetchPetitions()
        // const fetchData = async() => {
        //     const result = await axios(
        //         '/api/v1/petitions/all',);
        //     setPetitionsAll(result.data.data);
        //     setTotalPages(result.data.count)
        //     const resultMy = await axios(
        //         '/api/v1/petitions/my',);
        //     setPetitionsMy(resultMy.data.data);
        //     const resultSigned = await axios(
        //         '/api/v1/petitions/all',); //change when signed route is ready
        //     setPetitionsAll(resultSigned.data.data);
        //     }
        // fetchData()
    }, [page])


        const selectSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
            setSelectedSort(e.target.value)
            
        }
        
        const refreshPage = (page: number, status: number[]) => {
            router.get('petitions', {page, status}, {preserveState: true, preserveScroll: true})  
        }

        const handlePageClick = (e : any) => {   
            setPage(e.selected+1)
            refreshPage(e.selected+1, selectedStatus)  
        }

        const handleStatusChange = (e: any) => {        
            setSelectedStatus(e.value)
            setPage(1)
            refreshPage(1, e.value)  
        }

        const clickCheck = async () => {
            const result = await axios(
                '/api/v1/petitions',);
        }
    

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Petitions</h2>}
        >
            <Head title="Petitions" />

            <div className={style.optionsBox}>
                <button onClick={()=> clickCheck()}>
                console check
            </button>

            <select name="selectedSort" defaultValue={'1'} onChange={e => selectSort(e)}>
                <option value="1">All</option>
                <option value="2">My</option>
                <option value="3">Signed</option>
            </select>

            <MultiSelect value={selectedStatus} options={optionsStatus} optionLabel="label" onChange={(e) => handleStatusChange(e)} fixedPlaceholder={true} 
            placeholder="Select Status" maxSelectedLabels={3} className={style.multiSelect} panelClassName={style.multiSelect} itemClassName={style.multiSelectItem} />
            </div>

            

            {petitions.map((item) => <PetitionItem index={item.id} name={item.name} author={item.created_by} created_at={12} updated_at={42} key={item.id} userName={item.userName}/>)}

            {/* { selectedSort === '1' ? 
                petitionsAll.map((item, index) => <PetitionItem index={index} name={item.name} author={item.created_by} created_at={12} updated_at={42} key={item.id} userName={item.userName}  />)
            : selectedSort === '2' ?
              petitionsMy.map((item, index) => <PetitionItem index={index} name={item.name} author={item.created_by} created_at={12} updated_at={42} key={item.id} userName={item.userName} />)
            : 'empty' 
            } */}
            <div
                style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                padding: 20,
                boxSizing: 'border-box',
                width: '100%',
                height: '100%',
            }}>
                <ReactPaginate
                    breakLabel="..."
                    nextLabel=" >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={totalPages || 100}
                    previousLabel="< "
                    renderOnZeroPageCount={null}
                    containerClassName={style.pagination}
                    pageClassName={style.item}
                    activeClassName={style.active}
                    forcePage={(page || 1) - 1}
                />
            </div>
            
            
        </AuthenticatedLayout>
    );
}
