
import React from 'react'
import {BrowserRouter  ,Link, Route} from 'react-router-dom'
import Main1 from './components/Main1';

export default function Router1() {
    const navStyle = {
        backgroundColor: '#ced', 
        padding: '7px', 
        textAlign: 'center'
   }

    const linkStyle = {
        display: 'inline-block',
        color: 'blue',
        textDecoration: 'none',
    }

    return (
        <BrowserRouter>
            <nav style={navStyle}>
                <Link to="/" style={linkStyle}>Home</Link> -&nbsp; 
                <Link to="/products" style={linkStyle}>Products</Link> -&nbsp;
                <Link to="/member" style={linkStyle}>Member</Link> -&nbsp;
                <Link to="/index.jsx" style={linkStyle}>Contact Us</Link>
                
            </nav>

            
            
        
        </BrowserRouter>
    )
}