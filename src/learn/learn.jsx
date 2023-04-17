import React from 'react';

export function Learn() {
  return (
    <main id="card-creation-main" class="container-fluid text-center ">
        <div id="cardset-carousel" class="container-fluid side-bar bg-light">
            <div id="cardsets-edit" class="container-fluid btn-group">
                <Button 
                variant='success' 
                className="m-0 mt-2"
                onClick={() => initAddCardset()}
                >Add Cardsets</Button>
                <Button 
                variant='danger' 
                className="m-0 mt-2"
                onClick={() => initRemoveCardset()}
                >Remove Cardsets</Button>
            </div>
            <div id="card-creation-carousel-wrapper" class="container-fluid overflow-auto vert-carousel-wrapper">
                
            </div>
        </div>
        <div id="card-creation" class="container-fluid">
            <div class="container-fluid card-view-wrapper">

            </div>

        </div>
    </main>
  );
}