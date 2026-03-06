import React from 'react'
import '../auth.form.scss'

const Login = () => {

    const handlerSubmit = (e) => {
        e.preventDefault()
    }



    return (
        <main>
            <div className='form-container'>
                <div>Login</div>

                <form onSubmit={handlerSubmit}>

                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" placeholder='Enter your email' />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" placeholder='Enter your password' />
                    </div>

                    <button className='button primary-button'>Login</button>
                </form>
            </div>
        </main>
    )
}

export default Login