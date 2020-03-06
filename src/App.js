import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

class App extends Component {
    state = {
        products: []
    }

    componentDidMount() {
        this.getProducts()
    }

    // getProducts = _ => {
    //     fetch('http://localhost:4000/users').then(function(response) {
    //         console.log('This is a response object', response.json());
    //         this.setState({ products: response.json() })
    //     })
    // }

    getProducts() {
        fetch('http://localhost:4000/users').then(res => res.json()).then(res => this.setState({ products: res }))
    }

    renderProduct = ({ email, profile }) => <div key = { email } > { profile } </div>

    render() {
        const { products } = this.state;
        return ( <div className = "App" > { products.map(this.renderProduct) } </div>)
            // return ( <div className = "App" > </div>)
        }

    }

    export default App;