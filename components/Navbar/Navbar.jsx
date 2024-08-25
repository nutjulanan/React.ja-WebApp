import React from 'react';
import { Link } from 'react-router-dom';
//import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


export default function Navbar (){
    return (
      <>
        <div className="navbar bg-base-100">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">Autocar</a><button className="btn btn-success">    เริมนัดหมาย    </button>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li><a href="Login.jsx" >Login</a></li>
            <li>
              <details>
                <summary>
                  บริการ
                </summary>
                <ul className="p-2 bg-base-100 rounded-t-none">
                  <li><a>จัดการพนักงาน</a></li>
                  <li><a>รับซ่อม</a></li>
                  <li><a>อะไหร่รถยนต์</a></li> 
                </ul>
              </details>
            </li> 
          </ul>
        </div>
      </div>
      </>
    )
}