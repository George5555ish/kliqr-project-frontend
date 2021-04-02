
import React, {useState, useEffect} from 'react';
import './App.css';
import Expenses from './components/Expenses/Expenses';
import SingleUser from './components/SingleUser/SingleUser';

import axios from 'axios';
import {CircularProgress} from '@material-ui/core';

function App() {

const [users, setUsers] = useState([]);
const [active, setActive] = useState(false);

const [userForExpenses, setUserForExpenses] = useState();
const [allowExpenses, setAllowExpenses] = useState(false)
  let newArr = [];


  // To handle background change;
  const handleActive = (index) => {
    // console.log(index)
    setActive(true);
    setAllowExpenses(true)
    sendUserData(index)
  }

  const sendUserData = (user) => {
       
    setUserForExpenses(user);
    // console.log(user)
  }
  
const getUserId = (finalApi) => {

  console.log(finalApi)

  if (finalApi.length !== 0){
      
  
    for (var i = 0; i < finalApi.length; i++){
      newArr.push(finalApi[i].id);
    }

    console.log('this worked')
    

// console.log(newArr);
  }

  
}

  useEffect( async () => {
    

    const apiTransactions = await axios.get("http://localhost:3000/transactions");
    const apiUsers = await axios.get("http://localhost:3000/user");
   
    const finalApi = [...apiUsers.data.data];
    // console.log(apiUsers.data.data)
    setUsers(finalApi);
    getUserId(finalApi);
    // console.log(users)
  }, [])
  return (
    <div className="App">
    <div className="header"></div>
    
    <div className="main-wrapper">
    <div className="left-side">
    {
      users !== [] ? (
        <div className="users-container">
          <p className="users-heading">USERS</p>

          {   users.map((user, index) => (
          <div className={active ? "single-user active" : "single-user"} onClick={() => handleActive(user)}>
          <SingleUser user={user} active={active} showArrow={true} />
          </div>
        ))}
        </div>
      ) :<div className="margin-top"> <CircularProgress /></div>
    }
    </div>

    <div className="right-side">
      {
        !allowExpenses ? <div><h2>Please select a user</h2></div> :<Expenses userForExpenses={userForExpenses}/>
      }
    </div>
    </div>
    
    
    </div>
  );
}

export default App;
