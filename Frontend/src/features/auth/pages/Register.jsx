import React from 'react'

const Register = () => {

     const handlerSubmit = (e) => {
        e.preventDefault()
    }
    
    return (
        <main>
            <div className='form-container'>
                <div>Register</div>

                <form onSubmit={handlerSubmit}>

                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" placeholder='Enter your email' />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" placeholder='Enter your password' />
                    </div>

                    <button className='button primary-button'>Register</button>
                </form>
            </div>
        </main>
    )
}   

export default Register