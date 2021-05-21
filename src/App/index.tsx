import React from 'react';

import Crivo from '../components/Crivo';

import './styles.css';

function App() {
    return (
        <div id="app">
            <Crivo max={150} columns={15} />
        </div>
    );
}

export default App;
