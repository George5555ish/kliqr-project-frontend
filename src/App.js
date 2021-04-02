
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
const [allowExpenses, setAllowExpenses] = useState(false);
const [usersIdArray, setUsersIdArray] = useState([]);
const [finalTransaction, setFinalTransaction] = useState([]);
  let newArr = [];


  // To handle background change;
  const handleActive = (user,index) => {
    // console.log(index)
    setActive(true);
    setAllowExpenses(true)
    sendUserData(user)

    handleTransactions(usersIdArray, user.id, finalTransaction)
  }

  const sendUserData = (user) => {   
    setUserForExpenses(user);
  }
  
const getUserId = (finalApi) => {
  if (finalApi.length !== 0){
    for (var i = 0; i < finalApi.length; i++){
      newArr.push(finalApi[i].id);
    }
  }

  setUsersIdArray(newArr);
  
}

const getSingleUserTransaction = async (userId) => {

  const singleTransaction = await axios.get("http://localhost:3000/transactions/" + userId);

  console.log(singleTransaction.data.result);
  return singleTransaction.data.result;
}

const handleTransactions = async (userIdArray,userId, finalTrans) => {


  // Steps to Execute User Expense Trends.

  //1. Get the specific user to be checked. (Done)
  //2. Use logic to get a list of all categories spent by user (Done)
  //3. Sort Data on a monthly basis and increment a counter
      //based on the number of times a category appears.
  //4. 
  console.log(finalTrans);
  console.log(userId)

  const userTransactionArray = await getSingleUserTransaction(userId);
  getUserCategories(userTransactionArray)
}

const getUserCategories = (userArray) => {

  let finalCategories;

  let stringCategories = '';
  // console.log(userArray)
  userArray.map((userItem) => {

 

      if(stringCategories.includes(userItem.category) == false){
       
        stringCategories = stringCategories +"/"+ userItem.category;
      }
   
  });

  finalCategories = stringCategories.split('/').slice(1, stringCategories.length);
  console.log(finalCategories)

}

  useEffect( async () => {
    

    const apiTransactions = await axios.get("http://localhost:3000/transactions");
    const apiUsers = await axios.get("http://localhost:3000/user");
   

    // To get the list of user's in the database
    const finalApi = [...apiUsers.data.data];

    //To get all user transactions
    const finalTrans = [apiTransactions.data.data];
    // console.log(apiUsers.data.data)
    setUsers(finalApi);
    getUserId(finalApi);
    setFinalTransaction(finalTrans);
   
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

          {   
            users.map((user, index) => (
         index <= 10 ?  <div className={active ? "single-user active" : "single-user"} onClick={() => handleActive(user, index)}>
          <SingleUser user={user} active={active} showArrow={true} />
          </div> : null))
       }
        </div>
      ) :<div className="margin-top"> <CircularProgress /></div>
    }
    </div>

    <div className="right-side">
      {
        !allowExpenses ? <div><h2>Please select a user</h2></div> :<Expenses userForExpenses={userForExpenses} usersIdArray={usersIdArray}/>
      }
    </div>
    </div>
    
    
    </div>
  );
}

export default App;
