import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { PetitionItem } from '@/Components/PetitionItem';
import { MultiSelect } from 'primereact/multiselect';
import ReactPaginate from 'react-paginate';
import stylePagination from '../../css/Pagination.module.css'


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
    const info = usePage()

    useEffect(()=> {
        if (queryPage) setPage(Number(queryPage))
    },[])

    useEffect(()=> {
        const fetchPetitions = async () => {

            
            const result = await axios(`/api/v1/petitions`, {params: {
                page
            }});
            console.log(queryPage)
            setTotalPages(result.data.data.last_page)
            setPetitions(result.data.data.data)

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
    }, [page, selectedSort])


        const selectSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
            setSelectedSort(e.target.value)
        }
        

        const handlePageClick = (e : any) => {
                
            setPage(e.selected+1)
            router.get('petitions', {page: e.selected+1}, {preserveState: true, preserveScroll: true})
                
            
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

            <button onClick={()=> clickCheck()}>
                console check
            </button>

            <select name="selectedSort" defaultValue={'1'} onChange={e => selectSort(e)}>
                <option value="1">All</option>
                <option value="2">My</option>
                <option value="3">Signed</option>
            </select>

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
                    containerClassName={stylePagination.pagination}
                    pageClassName={stylePagination.item}
                    activeClassName={stylePagination.active}
                    forcePage={(page || 1) - 1}
                />
            </div>
            
            
        </AuthenticatedLayout>
    );
}
