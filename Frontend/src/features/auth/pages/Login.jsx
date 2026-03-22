import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import '../auth.form.scss'
import { useAuth } from '/src/features/auth/hooks/useAuth.js'

const Login = () => {

    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handlerSubmit = async (e) => {
        e.preventDefault()
        await handleLogin({ email, password })
        navigate("/")
    }

    if(loading){
        return  (<main><h1>Loading.......</h1></main>)
    }


    return (
        <main>
            <div className='form-container'>
                <div>Login</div>

                <form onSubmit={handlerSubmit}>

                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            onChange={(e)=>{setEmail(e.target.value)}}
                            type="email" id="email" name="email" placeholder='Enter your email' autocomplete="username" />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={(e)=>{setPassword(e.target.value)}}
                            type="password" id="password" name="password" placeholder='Enter your password' autocomplete ="current-password" />
                    </div>

                    <button className='button primary-button'>Login</button>
                </form>

                <p>Don't have an account? <Link to={"/register"}>Register</Link></p>
            </div>
        </main>
    )
}

export default Login