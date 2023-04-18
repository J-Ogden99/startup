import React from 'react';

import { NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Learn } from './learn/learn';
import { AuthState } from './login/authState';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [userName, setUserName] = React.useState(localStorage.getItem('userName') || '');

  // Asynchronously determine if the user is authenticated by calling the service
  const [authState, setAuthState] = React.useState(AuthState.Unknown);
  React.useEffect(() => {
    if (userName) {
      fetch(`/api/user/${userName}`)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          }
        })
        .then((user) => {
          const state = user?.authenticated ? AuthState.Authenticated : AuthState.Unauthenticated;
          setAuthState(state);
        });
    } else {
      setAuthState(AuthState.Unauthenticated);
    }
  }, [userName]);

  return (
    <div className="body text-dark color-primary-0">
        <header className="container-fluid">
            <nav className="navbar navbar-expand-sm navbar-dark color-primary-0">
                <a className="navbar-brand" href="index.html">Study Buddy</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav">
                        <li className="nav-item active">
                          <NavLink className='nav-link' to=''>Home</NavLink>
                        </li>
                        {authState === AuthState.Authenticated && (
                          <li className="nav-item">
                            <NavLink className='nav-link' to='learn'>Learn</NavLink>
                          </li>
                        )}
                    </ul>
                </div>
            </nav>
        </header>

        <Routes>
        <Route
          path='/'
          element={
            <Login
              userName={userName}
              authState={authState}
              onAuthChange={(userName, authState) => {
                setAuthState(authState);
                setUserName(userName);
              }}
            />
          }
          exact
        />
          <Route path='/learn' element={<Learn />} />
          <Route path='*' element={<NotFound />} />
        </Routes>

        <footer className="bg-dark text-dark text-muted">
            <div className="container-fluid">
                <span className="text-reset">Author: Josh Ogden</span>
                <a
                        className="text-reset"
                        href="https://github.com/J-Ogden99/startup"
                        target="_blank"
                >GitHub</a
                >
            </div>
        </footer>
    </div>
  );
}

function NotFound() {
  return <main className='container-fluid bg-secondary text-center'>404: Return to sender. Address unknown.</main>;
}

export default App;