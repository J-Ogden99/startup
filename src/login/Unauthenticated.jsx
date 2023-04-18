import { useState } from 'react';

import Button from 'react-bootstrap/Button';
import { MessageDialog } from './messageDialog';

export function Unauthenticated(props) {
  console.log(props);
  const [userName, setUserName] = useState(props.userName);
  const [password, setPassword] = useState('');
  const [displayError, setDisplayError] = useState(null);

  async function loginUser() {
    loginOrCreate(`/api/auth/login`);
  }

  async function createUser() {
    loginOrCreate(`/api/auth/create`);
  }

  async function loginOrCreate(endpoint) {
    const response = await fetch(endpoint, {
      method: 'post',
      body: JSON.stringify({ username: userName, password: password }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    if (response?.status === 200) {
      localStorage.setItem('userName', userName);
      props.onLogin(userName);
    } else {
      const body = await response.json();
      setDisplayError(`⚠ Error: ${body.msg}`);
    }
  }

  return (
    <>
        <div className="login-div container-fluid">
            <div id="loginControls" className="container-fluid">
                <h3 className="text-light">Login to Learn</h3>
                <div className="input-group mb-3">
                <span className="input-group-text">Username</span>
                <input
                    className='form-control'
                    type='text'
                    value={userName}
                    id='userName'
                    onChange={(e) => {
                      setUserName(e.target.value);
                      console.log(userName);
                    }}
                    placeholder='username'
                />
                </div>
                <div className="input-group mb-3">
                <span className="input-group-text">Password</span>
                <input
                    className='form-control'
                    type='password'
                    id="userPassword"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='password'
                />
                </div>
                <Button variant='primary' onClick={() => loginUser()}>
                Login
                </Button>
                <Button variant='secondary' onClick={() => createUser()}>
                Create
                </Button>
            </div>
        </div>
    </>
  );
}
