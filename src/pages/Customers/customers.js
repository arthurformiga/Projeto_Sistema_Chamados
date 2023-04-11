import Header from "../../components/Header/header";
import Title from "../../components/Title/title";
import {FiUser} from 'react-icons/fi'
import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { toast } from "react-toastify";

export default function Customers(){
    const[nome,setNome] = useState('')
    const[cnpj, setCnpj] = useState('')
    const[endereco, setEndereco] = useState('')


   async function handleRegister(e){
        e.preventDefault()
        
        if(nome !== '' && cnpj !== '' && endereco !==''){
           await addDoc(collection(db, "customers"),{
            nomeFantasia: nome,
            cnpj: cnpj,
            endereco: endereco
           })

           .then(() => {
            toast.success("Empresa registrada com sucesso!")
            setNome('')
            setCnpj('')
            setEndereco('')
           })

           .catch((error) =>{
            toast.error("Erro ao fazer o cadastro")
           })
        }else{
            toast.error("Preencha todos os campos")
        }
    }

    return(
        <div>
            <Header/>

            <div className="content">
                <Title name="clientes">
                <FiUser size={25}/>
                </Title>

     <div className="container_2">
            <form className="profile" onSubmit={handleRegister}>
                <label>Nome fantasia</label>
                <input type="text" placeholder="Nome da empresa" 
                value={nome} onChange={(e) => setNome(e.target.value)}/>

                <label>CNPJ</label>
                <input type="text" placeholder="Digite o CNPJ" 
                value={cnpj} onChange={(e) => setCnpj(e.target.value)}/>
             

             <label>Endereço</label>
                <input type="text" placeholder="Endereço da empresa" 
                value={endereco} onChange={(e) => setEndereco(e.target.value)}/>

                <button type="submit">Salvar</button>
             </form>

           </div>
    
            </div>
             
        </div>
       
    )
}