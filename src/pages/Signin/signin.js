import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../contexts/auth'
import logo from '../../assets/logo.png'
import './signin.css'
export default function Signin(){

    const[email,setEmail]=useState('')
    const[password,setPassword]=useState('')

    const {signIn, loadingAuth} = useContext(AuthContext)

  async function handleSignIn(e){
        e.preventDefault()
        if(email !=='' && password !==''){
        await signIn(email, password )
        }
    }

    return(
        <div className="container">
            <div className="login">
                <div className="login_area">
                   <img src={logo} alt="logo da tela de cadastro"/>
                </div>
                <form onSubmit={handleSignIn}>
                    <h1>Entrar</h1>

                    <input type='text' placeholder='email@email.com' value={email}
                     onChange={(e)=>setEmail(e.target.value)}/>

                    <input type='password' placeholder='********' value={password}
                     onChange={(e)=>setPassword(e.target.value)}/>

                    <button type='submit'> {loadingAuth ? 'Carregando...' : 'Acessar'}</button>
                </form>

               <Link to="/register">
                    Criar uma conta
               </Link> 

            </div>
        </div>
    )
}