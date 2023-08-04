import { UserService } from '../../service';
import { Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import "./User-register.css";

function UserRegister() {
    const [user, setUser] = useState({
        "username": "",
        "password": ""
    });
    
    const updateUser = (event) => {
        setUser({...user, [event.target.name] : event.target.value})
        console.log(user)
    }
    
    const submitUser = () => {
        let password = document.getElementById("password").value;
        let confirmPassword = document.getElementById("confirm_password").value;
        
        if(password !== confirmPassword) {
            document.getElementById("confirm_password").setCustomValidity("Passwords don't match");
        } else {
            document.getElementById("confirm_password").setCustomValidity('');
            UserService.save(user);
        }
    }

    return (
        <Form id="login">
            <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control id="name" type="text" placeholder="Name" 
                name='username' onChange={updateUser} value={user.username} required/>
            </Form.Group>
            <Form.Group className="mb-3" min="8">
                <Form.Label>Password</Form.Label>
                <Form.Control id="password" type="password" placeholder="Password" 
                name='password' onChange={updateUser} value={user.password} minLength='8' required/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control id="confirm_password" type="password" placeholder="Password" 
                minLength='8' required/>
            </Form.Group>
            <Button id='user_register_button' variant="primary" type="submit" onClick={submitUser}>
                Submit
            </Button>
        </Form>
    );
}

export default UserRegister;