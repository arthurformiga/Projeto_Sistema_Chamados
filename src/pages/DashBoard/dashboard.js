import { useContext, useEffect, useState } from "react"
import Header from "../../components/Header/header"
import Title from "../../components/Title/title"
import { AuthContext } from "../../contexts/auth"
import {FiPlus, FiMessageSquare, FiSearch, FiEdit2} from 'react-icons/fi'
import "./dashboard.css"
import { Link } from "react-router-dom"
import { collection, getDoc, getDocs, limit, orderBy, query, startAfter } from "firebase/firestore"
import { db } from "../../services/firebaseConnection"
import { format } from "date-fns"
import { async } from "@firebase/util"
import Modal from "../../components/Modal/modal"

const listRef = collection(db, "chamados")

export default function DashBoard(){
    const {logout}= useContext(AuthContext)

    const[chamados,setChamados] = useState([])
    const[loading, setLoading] = useState(true)

    const[isEmpty, setIsEmpty] = useState (false)
    const[lastDocs, setLastDocs] = useState()
    const[loadingMore, setLoadingMore] = useState(false)

    const[showPostModal, setShowPostModal] = useState(false)
    const[detail, setDetail] = useState()

    useEffect(() => {
            async function loadChamados(){
                const q = query(listRef, orderBy('created', 'desc'), limit(5))

                const querySnapShot = await getDocs(q)
                setChamados([])

                await updateState(querySnapShot)
                
                setLoading(false)
              
            }

        loadChamados()   
        
        return () => { }
    },[])

    async function updateState(querySnapShot){
        const isCollectionEmpty = querySnapShot.size === 0

        if(!isCollectionEmpty){
            let lista = []

            querySnapShot.forEach((doc) => {
              lista.push({
                id: doc.id,
                assunto: doc.data().assunto,
                cliente: doc.data().cliente,
                clienteId: doc.data().clienteId,
                created: doc.data().created,
                createdFormat: format(doc.data().created.toDate(),'dd/MM/yyy'),
                status: doc.data().status,
                complemento: doc.data().complemento
              })  
            })
            //Pegando o último item renderizado
            const lastDoc = querySnapShot.docs[querySnapShot.docs.length -1]

            setChamados(chamados => [...chamados, ...lista])
            setLastDocs(lastDoc)

        }else{

            setIsEmpty(true)
        }

        setLoadingMore(false)
    }

    async function handleLogout(){
        await logout()
    }

   async function handleMore(){
        setLoadingMore(true)
        const q = query(listRef, orderBy('created', 'desc'),startAfter(lastDocs), limit(5))
        const querySnapShot = await getDocs(q) 

        await updateState(querySnapShot)
    }

    function toggleModal(item){
        setShowPostModal(!showPostModal)
        setDetail(item)
    }

    if(loading){
        return(
            <div>
                <Header/>
                <div className="content">
                <Title name="tickets">
                   <FiMessageSquare size={25}/>     
                </Title>

                <div className="container_2 dashboard">
                    <span>Buscando chamados...</span>
                </div>

                </div>
            </div>
        )
    }
    return(
        <div>
            <Header/>

            <div className="content">
                <Title name="tickets">
                   <FiMessageSquare size={25}/>     
                </Title>
                <>

                {chamados.length === 0  ? (
                  <div className="container_2 dashboard">
                    <span>Nenhum chamado encontrado...</span>

                    <Link to="/new" className="new">
                    <FiPlus size={25} color="#fff"/>
                    Novo chamado
                    </Link>

                  </div>      
                ) : (
                    <>
                    <Link to="/new" className="new">
                    <FiPlus size={25} color="#fff"/>
                     Novo chamado
                     </Link>
                     <table>
                    <thead>
                        <tr>
                            <th scope="col">Cliente</th>
                            <th scope="col">Assunto</th>
                            <th scope="col">Status</th>
                            <th scope="col">Cadastrado em</th>
                            <th scope="col">#</th>
                        </tr>
                    </thead>
                    <tbody>
                      {chamados.map((item, index) => {
                        return(
                            <tr key={index}>
                            <td data-label="Cliente">{item.cliente}</td>

                            <td data-label="Assunto">{item.assunto}</td>

                            <td data-label="Status">
                                <span className="badge" style={{backgroundColor: item.status === 'Aberto' ? '#5cb85c' : '#999'}}>{item.status}</span></td>

                            <td data-label="Cadastrado">{item.createdFormat}</td>
                            
                            <td data-label="#">

                                <button className="action" style={{backgroundColor:"#3583f6"}} onClick={ () => toggleModal(item) }>
                                <FiSearch color="#fff" size={17}/>
                                </button>

                                <Link to={`/new/${item.id}`} className="action"  style={{backgroundColor:"#f6a935"}}>
                                <FiEdit2 color="#fff" size={17}/>
                                </Link>
                            </td>
                        </tr>
                        )
                      })}
                    </tbody>
                </table>


                {loadingMore && <h3>Buscando mais chamados...</h3>}      
                {!loadingMore && !isEmpty && <button onClick={handleMore} className="btn_more">Buscar mais</button>}                

                    </>
                
                    )}
             
                </>
            </div>

             {showPostModal && (
                <Modal conteudo={detail} close={ () => setShowPostModal(!showPostModal) }/> 
             )}         

        </div>
            
    )
}