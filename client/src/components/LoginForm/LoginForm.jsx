import React, { useState, useEffect, useRef } from 'react';
import { useCurrentUser } from '../../contexts/CurrentUserProvider.jsx'
import './LoginForm.min.css'

// const API = "localhost:3000/"

const LoginForm = (props) => {
    const [formData, setFormData] = useState({
        username: "",
        userID: "",
    })
    const [error, setError] = useState("")
    const usernameInputRef = useRef()
    const [, setCurrentUser] = useCurrentUser()

    // console.log("In login component: ", { currentUser })

    useEffect(() => {
        usernameInputRef.current.focus()
    }, [])

    const handleUsernameChange = (e) => {
        let newFormData = { ...formData }
        newFormData.username = e.target.value
        setFormData(newFormData)
    }

    const handleUserIDChange = (e) => {
        let newFormData = { ...formData }
        newFormData.userID = e.target.value
        setFormData(newFormData)
    }

    const resetForm = () => {
        let newFormData = { ...formData }
        newFormData.username = ""
        newFormData.password = ""
        setFormData(newFormData)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!formData.username) {
            setError("username cannot be empty")
        } else if (!formData.userID) {
            setError("UserID cannot be empty")
        } else {
            let currentUserInfo = {
                name: formData.username,
                id: formData.userID
            }

            setCurrentUser(currentUserInfo)
            resetForm()
            setError("")
            props.history.push('/')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="myform login-form">
            <div className="form-title">Login</div>
            <ErrorMsg error={error} />
            <div className="form-group">
                <input
                    ref={usernameInputRef}
                    placeholder="Username: "
                    type="text"
                    value={formData.username}
                    onChange={handleUsernameChange}
                />
            </div>
            <div className="form-group">
                <input
                    placeholder="ID: "
                    type="text"
                    value={formData.userID}
                    onChange={handleUserIDChange}
                />
            </div>
            <div className="form-group">
                <input type="submit" value="Log In" />
            </div>
        </form>
    );
}

const ErrorMsg = ({ error }) => {
    const styles = {
        color: "red",
        fontStyle: "italic",
        fontSize: '12px',
        margin: '5px auto',
        textTransform: 'capitalize'
    }
    return (
        <p className="error" style={styles}>{error}</p>
    )
}

export default LoginForm;
