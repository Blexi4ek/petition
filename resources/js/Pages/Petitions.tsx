import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { PetitionItem } from '@/Components/PetitionItem';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import ReactPaginate from 'react-paginate';
import style from '../../css/Petition.module.css'
import optionsStatus from '../consts/petitionOptionsStatus'


export default function Petitions({ auth }: PageProps) {

    const queryParams = new URLSearchParams(window.location.search)
    const queryPage = queryParams.get('page')
    const queryTitle = queryParams.get('title')
    const queryCreatedFrom = queryParams.get('createdFrom')
    const queryCreatedTo = queryParams.get('createdTo')

    const [petitions, setPetitions] = useState<IPetition[]>([])
    const [petitionsAll, setPetitionsAll] = useState<IPetition[]>([])
    const [petitionsMy, setPetitionsMy] = useState<IPetition[]>([])
    const [petitionsSigned, setPetitionsSigned] = useState([])
    const [selectedSort, setSelectedSort] = useState('1')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [refresh, setRefresh] = useState(false)
    const [inputPetitionQ, setinputPetitionQ] = useState('')
    const [inputPetitionCreatedFrom, setinputPetitionCreatedFrom] = useState('')
    const [inputPetitionCreatedTo, setinputPetitionCreatedTo] = useState('')

    const [selectedStatus, setSelectedStatus] = useState([2, 3, 5, 6, 8])



    useEffect(()=> {
        if (queryPage) setPage(Number(queryPage))
        if (queryParams.getAll('status[0]')) {
            let queryStatus:number[] = []
            queryParams.forEach((value, key) => {
                if (key.includes('status')) queryStatus.push(Number(value))
            })
            setSelectedStatus(queryStatus)
        }
        if (queryTitle) { 
            setinputPetitionQ(queryTitle)
        }
        if (queryCreatedFrom) { 
            setinputPetitionCreatedFrom(queryCreatedFrom)
        }
        if (queryCreatedTo) { 
            setinputPetitionCreatedTo(queryCreatedTo)
        }
        setRefresh(!refresh)
    },[])

    useEffect(()=> {
        const fetchPetitions = async () => {   
            const {data: response} = await axios(`/api/v1/petitions`, {params: {
                page, 
                petitionStatus:selectedStatus, 
                petitionQ:inputPetitionQ,
                petitionCreatedAtFrom:inputPetitionCreatedFrom,
                petitionCreatedAtTo: inputPetitionCreatedTo
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
    }, [page,refresh])


        const selectSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
            setSelectedSort(e.target.value)
            
        }
        
        const refreshPage = (page: number, status: number[] = selectedStatus, title: string = inputPetitionQ, createdFrom: string = inputPetitionCreatedFrom,
            createdTo: string = inputPetitionCreatedTo  
        ) => {
            router.get('petitions', {page, status, title, createdFrom, createdTo}, {preserveState: true, preserveScroll: true})  
        }

        const handlePageClick = (e : any) => {   
            setPage(e.selected+1)
            refreshPage(e.selected+1, selectedStatus)  
        }

        const handleStatusChange = (e: MultiSelectChangeEvent) => {        
            setSelectedStatus(e.value)
            if (page === 1) setRefresh(!refresh) 
            setPage(1)
            refreshPage(1, e.value)  
        }

        const handleinputPetitionQChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setinputPetitionQ(e.target.value)
            if (page === 1) setRefresh(!refresh) 
            setPage(1)
            refreshPage(1, selectedStatus, e.target.value)  
        }

        const handleDateFromChange = (e: any) => {
            setinputPetitionCreatedFrom(e.target.value)
            if (page === 1) setRefresh(!refresh) 
            setPage(1)
            refreshPage(1, selectedStatus, inputPetitionQ, e.target.value)  
        }

        const handleDateToChange = (e: any) => {
            setinputPetitionCreatedTo(e.target.value)
            if (page === 1) setRefresh(!refresh) 
            setPage(1)
            refreshPage(1, selectedStatus, inputPetitionQ, inputPetitionCreatedFrom,e.target.value)  
        }

        const clickCheck = async () => {
            console.log(inputPetitionCreatedFrom)
        }
    

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Petitions</h2>}
        >
            <Head title="Petitions" />

            <button onClick={()=> clickCheck()}>
                console check
            </button>

            <div className={style.optionsBox}>
                

                <select name="selectedSort" defaultValue={'1'} onChange={e => selectSort(e)}>
                    <option value="1">All</option>
                    <option value="2">My</option>
                    <option value="3">Signed</option>
                </select>

                <MultiSelect value={selectedStatus} options={optionsStatus} optionLabel="label" onChange={(e) => handleStatusChange(e)} fixedPlaceholder={true} 
            placeholder="Select Status" maxSelectedLabels={3} className={style.multiSelect} panelClassName={style.multiSelect} itemClassName={style.multiSelectItem} />
           
                <input value={inputPetitionQ} onChange={e => handleinputPetitionQChange(e)} placeholder='Search by name'/>
           
                <div>
                    Created from {' '}
                    <input type='datetime-local' value={inputPetitionCreatedFrom} onChange={e => handleDateFromChange(e)}/>
                    {' to '}
                    <input type='datetime-local' value={inputPetitionCreatedTo} onChange={e => handleDateToChange(e)}/>
                </div>

            </div>

            

            {petitions.map((item, index) => <PetitionItem index={(index+2)+(10*(page-1))} name={item.name} author={item.created_by} created_at={item.created_at} updated_at={42} key={item.id} userName={item.userName}/>)}

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
                    pageCount={totalPages || 1}
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
