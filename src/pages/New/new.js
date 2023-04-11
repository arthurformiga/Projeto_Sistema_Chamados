import Header from "../../components/Header/header";
import Title from "../../components/Title/title";
import {FiPlusCircle} from "react-icons/fi"
import './new.css'

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/auth";
import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";


const listRef = collection(db, "customers")

export default function New(){
    const{user} = useContext(AuthContext)
    const{ id } = useParams()
    const navigate = useNavigate()

    const[customers, setCustomers] = useState([])
    const[loadCustomer, setLoadCustomer]= useState(true)
    const[customerSelected, setCustomerSelected] = useState(0)

    const[complemento, setComplemento] = useState('')
    const[assunto, setAssunto] = useState('Suporte')
    const[status, setStatus] = useState('Aberto')
    const[idCustomer, setIdCustomer] = useState(false)

    useEffect(() => {
            async function loadCustomers(){
               const querySnapShot = await getDocs(listRef) 

               .then((snapshot) => {
                  let lista = []

                  snapshot.forEach((doc) => {
                  lista.push({
                    id: doc.id,
                    nomeFantasia: doc.data().nomeFantasia
                  })

               })
               if(snapshot.docs.size === 0){
                setLoadCustomer(false)
                setCustomers([{id : '1', nomeFantasia : "FREELA"}])
                return
               }

               setCustomers(lista)
               setLoadCustomer(false)

               if(id){
                loadId(lista)
               }
            })

               .catch((error) => {
                toast.error("Erro ao buscar os clientes!!")
                setLoadCustomer(false)
                setCustomers([{id : '1', nomeFantasia : "FREELA"}])
               })
            }
            
            loadCustomers()
    },[id])

    async function loadId(lista){
        const docRef = doc(db, "chamados",id)
        await getDoc(docRef)

        .then((snapshot) => {
            setAssunto(snapshot.data().assunto)
            setStatus(snapshot.data().status)
            setComplemento(snapshot.data().complemento)


            let index = lista.findIndex(item => item.id === snapshot.data().clienteId)
            setCustomerSelected(index)
            setIdCustomer(true)
        })

        .catch((error) => {
          console.log(error)
          setIdCustomer(false) 
        })
    }

    function handleOptionChange(e){
       setStatus(e.target.value )
    }

    function handleChangeSelect(e){
        setAssunto(e.target.value )
     }

    function handleChangeCustomer(e){
        setCustomerSelected(e.target.value)
    }

   async function handleRegister(e){
        e.preventDefault()

        if(idCustomer){
            //Atualizando chamado
            const docRef = doc(db, "chamados", id)

            await updateDoc(docRef, {
            cliente: customers[customerSelected].nomeFantasia,
            clienteId: customers[customerSelected].id,
            assunto: assunto,
            complemento: complemento,
            status: status,
            userUid: user.uid,
            })
            .then(() => {
                toast.info("Chamado atualizado com sucesso!")
                setCustomerSelected(0)
                setComplemento('')
                navigate('/dashboard')
            })

            .catch(() => {
                toast.error("Ops erro ao atualizar esse chamado!")
            })
            return
        }


        //Registrar um chamado
        await addDoc(collection(db, "chamados"),{
            created: new Date(),
            cliente: customers[customerSelected].nomeFantasia,
            clienteId: customers[customerSelected].id,
            assunto: assunto,
            complemento: complemento,
            status: status,
            userUid: user.uid,
        })

        .then(() => {
            toast.success("Chamado registrado!")
            setComplemento('')
            setCustomerSelected(0)
        })

        .catch((error) => {
            toast.error("Ops erro ao registrar, tente mais tarde!")
            console.log(error)
        })
    }

    return(
    <div>
        <Header/>
        <div className="content">
        <Title name={id ? "Editando Chamado" : "Novo Chamado"}>
            <FiPlusCircle size={25}/>
        </Title>

        <div className="container_2">
        <form className="profile" onSubmit={handleRegister}>

        <label>Clientes</label>
        
            {loadCustomer ? (
                <input type="text" disabled={true} value="Carregando..."/>
               ):(
                  <select value={customerSelected} onChange={handleChangeCustomer}>

                    {customers.map((item, index) => {
                        return(
                          <option key={index} value={index}>
                            {item.nomeFantasia}
                          </option>  
                        )
                    })}    

                     </select>
                )
           }

        <label>Assunto</label>
        <select value={assunto} onChange={handleChangeSelect}>
            <option value="Suporte">Suporte</option>
            <option value="Visita Técnica">Visita Técnica</option>
            <option value="Financeiro">Financeiro</option>
        </select>

        <label>Status</label>
            <div className="status">

                <input type="radio" name="radio"
                 value="Aberto" onChange={handleOptionChange} checked={status === "Aberto"}/>
                <span>Em Aberto</span>
            

        
                <input type="radio" name="radio" 
                value="Progresso" onChange={handleOptionChange} checked={status === "Progresso"}/>
                <span>Progresso</span>
            

        
                <input type="radio" name="radio" 
                value="Atendido" onChange={handleOptionChange} checked={status === "Atendido"}/>
                <span>Atendido</span>

            </div>

            <label>Complemento</label> 

            <textarea type="text" placeholder="Descreva seu problema (opcional)" 
            value={complemento} onChange={(e) => setComplemento(e.target.value)}/>

            <button type="submit">Registrar</button>

        </form> 
            </div>
               </div>
        
    </div>
)
}