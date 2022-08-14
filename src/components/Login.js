import { useRef, useState, useEffect, Fragment } from "react"
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from '../api/axios'
import useAuth from '../hooks/useAuth'
import { Link, useNavigate, useLocation } from "react-router-dom"
// import useLocalStorage from "../hooks/useLocalStorage"
import useInput from "../hooks/useInput"
import useToggle from "../hooks/useToggle"

const Login = () => {

    const { setAuth } = useAuth()
    const userRef = useRef()
    const errRef = useRef()

    const [user, resetUser, userAttribs] = useInput('user', '') //useState('')
    const [pwd, setPwd] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const [success, setSuccess] = useState(false)

    const LOGIN_URL = '/auth'

    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || "/"
    const [check, toggleCheck] = useToggle('persist', false)


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
            setAuth({ user, pwd, roles, accessToken })
            //setUser('')
            resetUser()
            setPwd('')
            navigate(from, { replace: true })
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

    // const togglePersist = () => {
    //     setPersist(prev => !prev)
    // }

    // useEffect(() => {
    //     localStorage.setItem("persist", persist)
    // }, [persist])





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
                                //onChange={(e) => setUser(e.target.value)}
                                //value={user}
                                {...userAttribs}
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
                            <div className="persistCheck">
                                <input type="checkbox"
                                    id="persist"
                                    // onChange={togglePersist}
                                    onChange={toggleCheck}
                                    checked={check}
                                />
                                <label htmlFor="persist">Trust this device</label>
                            </div>
                        </form>
                    </section>
                )
            }

        </Fragment>

    )
}

export default Login