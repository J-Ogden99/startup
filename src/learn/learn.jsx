import React from 'react';

import { getCardsets, VerticalCardCarousel, initAddCardset, initRemoveCardset } from './cardsets';

import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

export function Learn() {
  return (
    <main id="card-creation-main" className="container-fluid text-center ">
        <div id="cardset-carousel" className="container-fluid side-bar bg-light">
            <div id="cardsets-edit" className="container-fluid btn-group">
                <Button 
                variant='success' 
                classNameName="m-0 mt-2"
                onClick={() => initAddCardset()}
                >Add Cardsets</Button>
                <Button 
                variant='danger' 
                classNameName="m-0 mt-2"
                onClick={() => initRemoveCardset()}
                >Remove Cardsets</Button>
            </div>
            <div id="card-creation-carousel-wrapper" className="container-fluid overflow-auto vert-carousel-wrapper">
                
            </div>
        </div>
        <div id="card-creation" className="container-fluid">
            <div className="container-fluid card-view-wrapper">

            </div>

        </div>
    </main>
  );
}