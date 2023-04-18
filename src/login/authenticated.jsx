import React from 'react';
import { useNavigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button';

import './authenticated.css';

export function Authenticated(props) {
  const navigate = useNavigate();

  function logout() {
    fetch(`/api/auth/logout`, {
      method: 'delete',
    }).then(() => props.onLogout());
  }

  return (
    <div>
        <div id="home-cards-div" className="container-fluid d-none">
            <div className="row">
                <div className="col-sm-12">
                    <div className="card text-center mb-3">
                        <div className="card-header">
                            Review
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">Up for Review Today</h5>
                            <p className="card-text">Take a look at the card sets scheduled for review today!</p>
                            <a href="#" className="btn btn-primary">Let's Go!</a>
                        </div>
                        <div className="card-footer text-muted">
                            2 days ago
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-6">
                    <div className="card text-center mb-3">
                        <div className="card-header">
                            Create
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">Add Today's Notes</h5>
                            <p className="card-text">Be sure to add concepts from today's lectures you want to remember!</p>
                            <a href="#" className="btn btn-primary">Let's Go!</a>
                        </div>
                        <div className="card-footer text-muted">
                            2 days ago
                        </div>
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className="card text-center mb-3">
                        <div className="card-header">
                            Learn
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">Recently Created Cards</h5>
                            <p className="card-text">Take a look at your most recently created cards!</p>
                            <Button variant='primary' onClick={() => navigate('/learn')}>
                                Let's Go!
                            </Button>
                        </div>
                        <div className="card-footer text-muted">
                            2 days ago
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className='playerName'>{props.userName}</div>
        <Button variant='secondary' onClick={() => logout()}>
            Logout
        </Button>
    </div>
  );
}