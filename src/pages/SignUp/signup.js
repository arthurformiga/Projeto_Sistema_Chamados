import { useContext, useState } from 'react'
import { AuthContext } from '../../contexts/auth'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'

export default function SignUp(){
        const[name,setName]=useState('')
        const[email,setEmail]=useState('')
        const[password,setPassword]=useState('')

        const {signUp, loadingAuth}=useContext(AuthContext)

      async function handleSubmit(e){
        e.preventDefault()
        if(name !=='' && email !=='' && password !==''){
        await signUp(email,password,name)
        }
       }
    
        return(
            <div className="container">
                <div className="login">
                    <div className="login_area">
                       <img src={logo} alt="logo da tela de cadastro"/>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <h1>Nova conta</h1>
                        <input type='text' placeholder='Seu nome' value={name} 
                        onChange={(e)=>setName(e.target.value)}/>

                        <input type='text' placeholder='email@email.com' value={email}
                         onChange={(e)=>setEmail(e.target.value)}/>

                        <input type='password' placeholder='********' value={password}
                         onChange={(e)=>setPassword(e.target.value)}/>
    
                        <button type='submit'>{loadingAuth ? 'Carregando...' : 'Cadastrar'}</button>
                    </form>
    
                   <Link to="/">
                    Já possui uma conta?
                   </Link> 
    
                </div>
            </div>
        )
    }