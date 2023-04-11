import Header from "../../components/Header/header"
import Title from "../../components/Title/title"
import {FiSettings, FiUpload} from 'react-icons/fi'

import avatar from '../../assets/avatar.png'
import { AuthContext } from "../../contexts/auth"
import { useContext, useState } from "react"

import './profile.css'
import { toast } from "react-toastify"
import { doc, updateDoc } from "firebase/firestore"
import { db, storage } from "../../services/firebaseConnection"
import { async } from "@firebase/util"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"

export default function Profile(){

        const {user, setUser, storageUser, logout}=useContext(AuthContext)

        const[email,setEmail] = useState(user && user.email)
        const[nome,setNome] = useState(user && user.nome)
        const[avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl)
        const[imageAvatar, setImageAvatar] = useState(null)

        //Pegando imagem que foi adicionada no input
        function handleFile(e){
          if(e.target.files[0]){
            const image = e.target.files[0]
        
         //Verificando se ela é do tipo válido para usar de foto de perfil 
        if(image.type ==='image/jpeg' || image.type=== 'image/png'){
          setImageAvatar(image)
          setAvatarUrl(URL.createObjectURL(image))
        }
        else{
          toast.warning('Envie uma imagem do tipo PNG ou JPEG')
          setImageAvatar(null)
        }
          }
      }
      //=========================================================================\\
    async function handleUpload(){
      const currentUid = user.uid

      const uploadRef = ref(storage,`image/${currentUid}/${imageAvatar.name}`)

      const uploadTesc = uploadBytes(uploadRef, imageAvatar)

      .then((snapShot) => {
        getDownloadURL(snapShot.ref).then(async(downLoadURL) => {
        
        let urlFoto= downLoadURL

        const docRef = doc(db,"users", user.uid)
        await updateDoc(docRef,{
          avatarUrl:urlFoto,
          nome: nome
        })

        .then(() => {
          let data = {
            ...user,
            nome: nome,
            avatarUrl: urlFoto
          }

          setUser(data)
          storageUser(data)
          toast.success("Nome atualizado com sucesso!")
        })

      })
    })
    }

    //================================================================================\\
    async function handleSubmit(e){
        e.preventDefault()
        if(imageAvatar === null && nome !==''){
          //Atulizar apenas o nome do user

          const docRef = doc(db, "users", user.uid)
          await updateDoc(docRef,{
            nome: nome,

          })
          .then(() => {
            let data = {
              ...user,
              nome:nome
            }

            setUser(data)
            storageUser(data)
            toast.success("Nome atualizado com sucesso!")
          })

        }else if( nome !=='' && imageAvatar !== null){
          //Atualizar tanto nome quanto a foto
          handleUpload()
        }
      }

    return(
        <div>
            <Header/>

            <div className="content">
                <Title name='Minha conta'>
                <FiSettings size={25}/>
                </Title>
                <div className="container_2">

           <form className="profile" onSubmit={handleSubmit}>
                    <label className="label_avatar">
                      <span>
                        <FiUpload color="#fff" size={25}/>
                        </span>  

                        <input type="file" accept="image/*" onChange={handleFile}/> <br/>
                      {avatarUrl=== null ?(
                        <img src={avatar}  alt="foto de avatar do usuário" width={250} height={250}/>  
                      ):(
                        <img src={avatarUrl}  alt="foto de avatar do usuário" width={250} height={250}/> 
                      )}  
                    

                    </label>

                    <label>Nome</label> 
                    <input type='text'
                    value={nome}  onChange={(e) => setNome(e.target.value)}/>  

                    <label>Email</label> 
                    <input type='text'disabled={true} 
                    value={email} onChange={(e) =>setEmail(e.target.value) }/>  

                    <button type="submit">Salvar</button> 

             </form>
                </div>
                   <div className="container_2">
                    <button className="logout" onClick={() => logout() }>Sair</button>
                    </div>     

            </div>
            
        </div>
    )
}