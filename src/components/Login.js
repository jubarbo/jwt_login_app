import { useRef, useState, useEffect, Fragment } from "react"
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from '../api/axios'
import useAuth from '../hooks/useAuth'
import { Link, useNavigate, useLocation } from "react-router-dom"

const Login = () => {

    const { setAuth } = useAuth()
    const userRef = useRef()
    const errRef = useRef()

    const [user, setUser] = useState('')
    const [pwd, setPwd] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const [success, setSuccess] = useState(false)

    const LOGIN_URL = '/auth'

    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || "/"

    useEffect(() => {
        userRef.current.focus()
    }, [])

    useEffect(() => {
        setErrMsg('')
    }, [user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ user, pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            )
            console.log(JSON.stringify(response?.data))
            const accessToken = response?.data?.accessToken
            const roles = response?.data?.roles
            setAuth({user, pwd, roles, accessToken})
            // console.log('accessToken data: ', accessToken)
            // console.log('roles data: ', roles)
            setUser('')
            setPwd('')
            // setSuccess(true)
                navigate(from, {replace: true})
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response')
            } else if (err?.response?.status === 400) {
                setErrMsg('Missing Username or Password')
            } else if (err?.response?.status === 401) {
                setErrMsg('Unauthorized')
            } else {
                setErrMsg('Login Failed')
            }
            console.log('err: ', err)

            errRef.current.focus()
        }

    }


    return (
        <Fragment>

            {
                success ? (
                    <section>
                        <p>
                            Logged In!
                        </p>
                    </section>
                ) : (

                    <section>
                        <p ref={errRef} className={errMsg ? "errmsg" :
                            "offscreen"} aria-live="assertive">{errMsg}</p>
                        <h1>Sign In</h1>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="username">Username: </label>
                            <input
                                type="text"
                                id="username"
                                ref={userRef}
                                autoComplete="off"
                                onChange={(e) => setUser(e.target.value)}
                                value={user}
                                required
                            />
                            <label htmlFor="password">Password: </label>
                            <input
                                type="password"
                                id="password"
                                onChange={(e) => setPwd(e.target.value)}
                                value={pwd}
                                required
                            />
                            <button >Sign In</button>

                        </form>
                    </section>
                )
            }

        </Fragment>

    )
} 

export default Login