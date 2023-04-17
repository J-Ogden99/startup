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
        <div id="home-cards-div" class="container-fluid d-none">
            <div class="row">
                <div class="col-sm-12">
                    <div class="card text-center mb-3">
                        <div class="card-header">
                            Review
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">Up for Review Today</h5>
                            <p class="card-text">Take a look at the card sets scheduled for review today!</p>
                            <a href="#" class="btn btn-primary">Let's Go!</a>
                        </div>
                        <div class="card-footer text-muted">
                            2 days ago
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-6">
                    <div class="card text-center mb-3">
                        <div class="card-header">
                            Create
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">Add Today's Notes</h5>
                            <p class="card-text">Be sure to add concepts from today's lectures you want to remember!</p>
                            <a href="#" class="btn btn-primary">Let's Go!</a>
                        </div>
                        <div class="card-footer text-muted">
                            2 days ago
                        </div>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="card text-center mb-3">
                        <div class="card-header">
                            Learn
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">Recently Created Cards</h5>
                            <p class="card-text">Take a look at your most recently created cards!</p>
                            <Button variant='primary' onClick={() => navigate('/learn')}>
                                Let's Go!
                            </Button>
                        </div>
                        <div class="card-footer text-muted">
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