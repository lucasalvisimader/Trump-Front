import {Button, Form} from 'react-bootstrap';
import { UserService } from '../../service';
import { LoginService } from '../../security/service/LoginService';
import { useState } from 'react';
import "./Login.css";

function Login(props) {

  // const [user, setUser] = useState({
  //   "name" : "",
  //   "password": ""
  // });

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState({});

  // const updateUser = (event) => {
  //   setUser({...user, [event.target.name] : event.target.value})
  // }

  async function handleLogin(e) {
    e.preventDefault();
    try {
      // const [loginResponse] = await Promise.all([
      //   UserService.listLogin(username, password)
      // ]);
      setUser({
        "username": username,
        "password": password
      });

      
      const [loginResponse] = await Promise.all([
        LoginService.listLogin(user)
      ]);
      // if (loginResponse.data) {
        //   if (loginResponse.data.id === 1) {
          //     // Cookies.set('isAdmin', true);
          //     // Cookies.set('isLoggedIn', true);
          //     // Cookies.set('username', username);
          //     // Cookies.set('password', password);
          //     props.username(username);
          //     props.password(password);
          //     props.setIsAdmin(true);
          //     props.setIsLoggedIn(true);
          //   } else {
            //     // Cookies.set('isAdmin', false);
            //     // Cookies.set('isLoggedIn', true);
            //     // Cookies.set('username', username);
            //     // Cookies.set('password', password);
            //     props.username(username);
            //     props.password(password);
            //     props.setIsAdmin(false);
            //     props.setIsLoggedIn(true);
            //   }
            // }
            // window.location.href = "/";
      } catch (error) {
        console.log(error);
        // window.location.reload();
      }
      console.log(user)
    }
        
  return (
    <Form id="login">
      <Form.Group className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control id="name" name='name' type="text"
         placeholder="Name" value={username} onChange={(event) => setUsername(event.target.value)} required/>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control id="password" name='password' type="password"
         placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} required/>
      </Form.Group>
      <Button id='button_login' variant="primary" onClick={(e) => handleLogin(e)}>
        Submit
      </Button>
    </Form>
  );
}

export default Login;