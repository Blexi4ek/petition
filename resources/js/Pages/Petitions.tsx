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
    const queryAnsweredFrom = queryParams.get('answeredFrom')
    const queryAnsweredTo = queryParams.get('answeredTo')

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
        activatedTo: '',
        answeredFrom: '',
        answeredTo: ''})

    useEffect(()=> {
        if (queryPage) setPage(Number(queryPage))

        let queryStatus:number[] = []
        if (queryParams.getAll('status[0]')) {
            
            queryParams.forEach((value, key) => {
                if (key.includes('status')) queryStatus.push(Number(value))
            })
        }
        setPetitionOptions({status: queryStatus, name: queryName || '', createdFrom:queryCreatedFrom || '',
            createdTo:queryCreatedTo || '', activatedFrom:queryActivatedFrom || '', activatedTo:queryActivatedTo || '',
            answeredFrom: queryAnsweredFrom || '', answeredTo: queryAnsweredTo || ''
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
                petitionAnsweredFrom: petitionOptions.answeredFrom,
                petitionAnsweredTo: petitionOptions.answeredTo
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

            router.get('petitions', {page: newPage, status:options.status, name:options.name,
                createdFrom:options.createdFrom, createdTo:options.createdTo, activatedFrom:options.activatedFrom,
                activatedTo:options.activatedTo, answeredFrom:options.answeredFrom, answeredTo:options.answeredTo},
                {preserveState: true, preserveScroll: true})
        }

        const handlePageClick = (e : any) => {   
            refreshPage(petitionOptions, e.selected+1)  
        }

        const handleStatusChange = (e: MultiSelectChangeEvent) => {        
            refreshPage({...petitionOptions ,status: e.target.value})  
        }

        const handleinputPetitionQChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            refreshPage({...petitionOptions , name: e.target.value})   
        }

        const handleCreatedFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            refreshPage({...petitionOptions , createdFrom: e.target.value})  
        }

        const handleCreatedToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            refreshPage({...petitionOptions , createdTo: e.target.value})  
        }

        const handleActivatedFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            refreshPage({...petitionOptions , activatedFrom: e.target.value})  
        }

        const handleActivatedToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            refreshPage({...petitionOptions , activatedTo: e.target.value})    
        }

        const handleAnsweredFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            refreshPage({...petitionOptions , answeredFrom: e.target.value})  
        }

        const handleAnsweredToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            refreshPage({...petitionOptions , answeredTo: e.target.value})    
        }

        const clickCheck = () => {
            refreshPage()
        }

        const handleRefresh = () => {
            setRefresh(!refresh)
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

                <MultiSelect value={petitionOptions.status} options={optionsStatus} optionLabel="label" onChange={(e) => handleStatusChange(e)}
                fixedPlaceholder={true} placeholder="Select Status" maxSelectedLabels={3} className={style.multiSelect}
                panelClassName={style.multiSelect} itemClassName={style.multiSelectItem} checkboxIcon={'a'} />
            
                <input value={petitionOptions.name} onChange={e => handleinputPetitionQChange(e)} placeholder='Search by name'/>
            
            </div>

            <div className={style.optionsBox}>
                <div>
                    Created {' '}
                    <input type='datetime-local' value={petitionOptions.createdFrom} onChange={e => handleCreatedFromChange(e)}/>
                    {' to '}
                    <input type='datetime-local' value={petitionOptions.createdTo} onChange={e => handleCreatedToChange(e)}/>
                </div>

                <div>
                    Activated {' '}
                    <input type='datetime-local' value={petitionOptions.activatedFrom} onChange={e => handleActivatedFromChange (e)}/>
                    {' to '}
                    <input type='datetime-local' value={petitionOptions.activatedTo} onChange={e => handleActivatedToChange (e)}/>
                </div>

                <div>
                    Answered {' '}
                    <input type='datetime-local' value={petitionOptions.answeredFrom} onChange={e => handleAnsweredFromChange (e)}/>
                    {' to '}
                    <input type='datetime-local' value={petitionOptions.answeredTo} onChange={e => handleAnsweredToChange (e)}/>
                </div>
            </div>
            

            {petitions.map((item) => <PetitionItem petition={item}
            key={item.id} refresh={() => handleRefresh()}/>)}

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
