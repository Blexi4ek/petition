import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import ReactPaginate from 'react-paginate';

import { PetitionItem } from '@/Components/PetitionItem';
import style from '../../css/Petition.module.css'
import optionsStatus from '../consts/petitionStatuses'


export default function Petitions({ auth }: PageProps) {

    const queryParams = new URLSearchParams(window.location.search)
    const queryPage = queryParams.get('page')
    const queryName = queryParams.get('name')
    const queryCreatedFrom = queryParams.get('createdFrom')
    const queryCreatedTo = queryParams.get('createdTo')
    const queryActivatedFrom = queryParams.get('activatedFrom')
    const queryActivatedTo = queryParams.get('activatedTo')

    const [petitions, setPetitions] = useState<IPetition[]>([])
    const [selectedSort, setSelectedSort] = useState('1')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [refresh, setRefresh] = useState(false)

    const [petitionOptions, setPetitionOptions] = useState<IPetitionOptions>({
        status: [2,3,4],
        name: '',
        createdFrom: '',
        createdTo: '',
        activatedFrom: '',
        activatedTo: ''})

    useEffect(()=> {
        if (queryPage) setPage(Number(queryPage))

        let queryStatus:number[] = []
        if (queryParams.getAll('status[0]')) {
            
            queryParams.forEach((value, key) => {
                if (key.includes('status')) queryStatus.push(Number(value))
            })
        }
        setPetitionOptions({status: queryStatus, name: queryName || '', createdFrom:queryCreatedFrom || '',
            createdTo:queryCreatedTo || '', activatedFrom:queryActivatedFrom || '', activatedTo:queryActivatedTo || ''
        })
        setRefresh(!refresh)
    },[])

    useEffect(()=> {
        const fetchPetitions = async () => {   
            const {data: response} = await axios(`/api/v1/petitions`, {params: {
                page, 
                petitionStatus:petitionOptions.status, 
                petitionQ:petitionOptions.name,
                petitionCreatedAtFrom:petitionOptions.createdFrom,
                petitionCreatedAtTo: petitionOptions.createdTo,
                petitionActivatedAtFrom: petitionOptions.activatedFrom,
                petitionActivatedAtTo: petitionOptions.activatedTo,
            }});
            setTotalPages(response.last_page)
            setPetitions(response.data)
        }
        fetchPetitions()
    }, [page,refresh])


        const selectSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
            setSelectedSort(e.target.value)
        }
        

        const refreshPage = (options = petitionOptions, newPage: number = 1  ) => {
            setPage(newPage)
            if (newPage === 1) setRefresh(!refresh)
            setPetitionOptions(options)

            let status = options.status                //workaround inertia+ts bug
            let name = options.name
            let createdFrom = options.createdFrom
            let createdTo = options.createdTo
            let activatedFrom = options.activatedFrom
            let activatedTo = options.activatedTo
            router.get('petitions', {page: newPage, status, name, createdFrom, createdTo, activatedFrom, activatedTo}, {preserveState: true, preserveScroll: true})
        }

        const handlePageClick = (e : any) => {   
            refreshPage(petitionOptions, e.selected+1)  
        }

        const handleStatusChange = (e: MultiSelectChangeEvent) => {        
            refreshPage({...petitionOptions ,status: e.value})  
        }

        const handleinputPetitionQChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            refreshPage({...petitionOptions , name: e.target.value})   
        }

        const handleCreatedFromChange = (e: any) => {
            refreshPage({...petitionOptions , createdFrom: e.target.value})  
        }

        const handleCreatedToChange = (e: any) => {
            refreshPage({...petitionOptions , createdTo: e.target.value})  
        }

        const handleActivatedFromChange = (e: any) => {
            refreshPage({...petitionOptions , activatedFrom: e.target.value})  
        }

        const handleActivatedToChange = (e: any) => {
            refreshPage({...petitionOptions , activatedTo: e.target.value})    
        }

        const clickCheck = async () => {
            console.log(petitionOptions.status)
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

                <MultiSelect value={petitionOptions.status} options={optionsStatus} optionLabel="label" onChange={(e) => handleStatusChange(e)} fixedPlaceholder={true} 
            placeholder="Select Status" maxSelectedLabels={3} className={style.multiSelect} panelClassName={style.multiSelect} itemClassName={style.multiSelectItem} />
            
                <input value={petitionOptions.name} onChange={e => handleinputPetitionQChange(e)} placeholder='Search by name'/>
            
            </div>

            <div className={style.optionsBox}>
                <div>
                    Created from {' '}
                    <input type='datetime-local' value={petitionOptions.createdFrom} onChange={e => handleCreatedFromChange(e)}/>
                    {' to '}
                    <input type='datetime-local' value={petitionOptions.createdTo} onChange={e => handleCreatedToChange(e)}/>
                </div>

                <div>
                    Activated from {' '}
                    <input type='datetime-local' value={petitionOptions.activatedFrom} onChange={e => handleActivatedFromChange (e)}/>
                    {' to '}
                    <input type='datetime-local' value={petitionOptions.activatedTo} onChange={e => handleActivatedToChange (e)}/>
                </div>
            </div>
            

            {petitions.map((item) => <PetitionItem name={item.name} author={item.created_by} created_at={item.created_at} updated_at={42}
            key={item.id} userName={item.userName} status={item.status}/>)}

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
