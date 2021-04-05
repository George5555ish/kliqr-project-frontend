import React, { useState, useEffect } from "react";
import "./App.css";
import Expenses from "./components/Expenses/Expenses";
import SingleUser from "./components/SingleUser/SingleUser";

import axios from "axios";
import { CircularProgress } from "@material-ui/core";

function App() {
  const [users, setUsers] = useState([]);
  const [active, setActive] = useState(false);
  const [similarTrendsRun, setSimilarTrendsRun] = useState(true);


  const [showUsers, setShowUsers] = useState(false)
  const [userForExpenses, setUserForExpenses] = useState([]);
  const [userSingleTransaction, setUserSingleTransaction] = useState([]);
  const [allowExpenses, setAllowExpenses] = useState(false);
  const [usersIdArray, setUsersIdArray] = useState([]);
  const [finalSingleTransaction, setFinalSingleTransaction] = useState([]);
  const [indexCount, setIndexCount] = useState(0)
  const [expenseTrend, setExpenseTrend] = useState([]);
  const [userId, setUserId] = useState(641);
  const [showCircular, setShowCircular] = useState(true);
  const [circularPercentage, setCircularPercentage] = useState(0);

  const [similarTrendsData, setSimilarTrendsData] = useState([]);


  // const [expenseUserIdArray]

  let newArr = [];

  // To handle background change;
  const handleActive = async (user,finalTransaction, indexCount) => {
    // console.log(index)
    setActive(true);
    setIndexCount(indexCount)
    
    sendUserData(user,finalTransaction, indexCount);
    setUserId(user.id);
    handleTransactions( user.id);


    if (similarTrendsRun){
      setSimilarTrendsRun(false);
    // const firstId = await handleAllTransactions(usersIdArray);
    // console.log(firstId);
    setShowCircular(false);
    }
    setAllowExpenses(true);
  };

  //Function to be used in the Expenses array to 
  //find similar Trends
  const handleSimilarTrends = async(expenseTrend) => {

    console.log(usersIdArray)
    console.log(expenseTrend)
    setSimilarTrendsRun(true);

    // This generates the expense trend for other users.
   const finalArray =  await handleAllTransactions(usersIdArray);
   console.log('this is it')
   console.log(finalArray)
   setSimilarTrendsData(finalArray);

   console.log('About to send request to similar trend server')
   getSimilarTrends(expenseTrend, finalArray);

   

  }

  const getSimilarTrends = (expenseTrend, finalArray) => {

    const similarUserTrends = [];
    let numberOfTrends = 8;
    console.log('expenseTrend');
    console.log(expenseTrend);

    let shortenedTrends = expenseTrend.slice(0, numberOfTrends);

    console.log('finalArray')

    console.log(finalArray);


    // Looping through all trends of a particular user
    for (var i = 0; i < shortenedTrends.length; i++){
        let currentUserCategory = shortenedTrends[i];

        // Looping through all Users
        for (var j = 0; j < finalArray.length; j++){

          let currentTestUser = finalArray[j].transaction;

          // Looping through each user's categories
          const similarUser = currentTestUser.filter((x) => x.category == currentUserCategory)

          if (similarUser.length > 0){

           similarUserTrends.push(finalArray[j].userId)

          }
        }


    }

    console.log('Users with similar Trends')
    console.log(similarUserTrends)
  }

  const handleAllTransactions = async(userIdArray) => {
    let allTransactions = [];
    var number = 0;
    console.log(userIdArray)
    for (var count = 0; count < userIdArray.length; count++){
    
      setCircularPercentage(parseFloat(number /userIdArray.length) * 100)
      number++;
      const singleTrans = await handleTransactions(userIdArray[count]);
      console.log(singleTrans)
      allTransactions.push({ "transaction":singleTrans, "userId": userIdArray[count]});
      // console.log(allTransactions)
    }

    console.log('this one from function')
    console.log(allTransactions)

    return allTransactions;
  }
  const sendUserData = (user, finalTransaction, indexCount) => {

    //This function is an intermediate between Expenses component.
    //It sends data from the app to Expenses.
    setUserForExpenses(user);

  };

  // const getAllUserId = (finalApi) => {
  //   if (finalApi.length !=== 0) {
  //     for (var i = 0; i < finalApi.length; i++) {
  //       newArr.push(finalApi[i].id);
  //     }
  //   }

  //   setUsersIdArray(newArr);
  // };

  const getSingleUserTransaction = async (userId) => {
    const singleTransaction = await axios.get("http://localhost:3030/" + userId);

    // console.log(singleTransaction.data.result);
    await setUserSingleTransaction(singleTransaction.data.result);
    return singleTransaction.data.result;
  };

  const handleTransactions = async ( userId) => {
    // Steps to Execute User Expense Trends.


    //1. Get the specific user to be checked. 
    //2. Write logic to get a list of all categories spent by user 
    //3. Prepare each array of objects to house all monthly transactions by user.
    //4. Reduce the array to a sum of all monthly transactions, and increment each category.
    //5. Sort new array by category with highest number of monthly transactions.

    const userTransactionArray = await getSingleUserTransaction(userId);

    const userCategories = await getUserCategories(userTransactionArray); // Function to handle category generation
 
    const expenseTrend = await generateExpensesPerMonth(
      userCategories,
      userTransactionArray);
     
    setExpenseTrend(expenseTrend);

    return expenseTrend;
  };

  const generateExpensesPerMonth = (userCategories, userTransactionArray) => {
    // console.log('worked')
    // console.log(userCategories)

    // console.log(userTransactionArray)

    let arrayDates = [];
    let newUserCategories = [];
    let allTransactionsInYear = [];

    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth();
    const prevYear = currentYear - 1;

    // console.log(currentMonth, currentYear);

    let testMonth = 3;
    let testYear = 2021;

    while (testMonth <= currentMonth && testYear === currentYear) {
      if (testMonth === 0) {
        testMonth = 12;
        testYear--;
      }

      // console.log(testMonth + "/" + testYear);
      arrayDates.push(testMonth + "/" + testYear);

      if (testMonth > 0) {
        testMonth--;
      }
    }

    while (testMonth >= currentMonth) {
      arrayDates.push(testMonth + "/" + prevYear);
      testMonth--;
    }

    arrayDates = arrayDates.splice(1, arrayDates.length);
    // console.log(arrayDates)


    if (arrayDates) {
      for (var i = 0; i < arrayDates.length; i++) {
        let month = arrayDates[i].split("/")[0];
        let year = arrayDates[i].split("/")[1];

        let fixedMonth = month.length === 1 ? "0" + month : month;

        // console.log(fixedMonth, year)
        //This is the month out of the date for each of the dates in the
        //array. We use this as a parameter to filter the entire array.

        let sortedArray = userTransactionArray.map(
          (singleTrans) => singleTrans
        );
        let arraySortedByYear = sortedArray.filter(
          (x) => x.date_time.split("-")[0] === year
        );
        let finalArray = arraySortedByYear.filter(
          (x) => x.date_time.split("-")[1] === fixedMonth
        );

        // console.log(finalArray);

        allTransactionsInYear.push([finalArray]);

        newUserCategories = userCategories.reduce(function (s, a) {
          s.push({ category: a, categoryLength: 0 });
          return s;
        }, []);
      }

      setUserSingleTransaction(allTransactionsInYear);

      // console.log(newUserCategories);
      // console.log(allTransactionsInYear);

      for (var i = 0; i < allTransactionsInYear.length; i++) {
        var transact = allTransactionsInYear[i][0];
        // console.log(transact);

        for (var j = 0; j < transact.length; j++) {
          var answer = transact[j];
          for (var k = 0; k < newUserCategories.length; k++) {
            if (newUserCategories[k].category === answer.category) {
              newUserCategories[k].categoryLength =
                newUserCategories[k].categoryLength + 1;
            }
          }
        }
      }

      return newUserCategories.sort((a, b) =>
        a.categoryLength > b.categoryLength
          ? -1
          : b.categoryLength > a.categoryLength
          ? 1
          : 0
      );
    }
  };

  const getUserCategories = (userArray) => {
    let finalCategories;

    let stringCategories = "";
    // console.log(userArray)
    userArray.map((userItem) => {
      if (stringCategories.includes(userItem.category) === false) {
        stringCategories = stringCategories + "/" + userItem.category;
      }
    });

    finalCategories = stringCategories
      .split("/")
      .slice(1, stringCategories.length);
    return finalCategories;
  };

  useEffect(() => {
    const getAllUserId = (finalApi) => {
      console.log('start')
      if (finalApi.length !== 0) {
        for (var i = 0; i < finalApi.length; i++) {
          newArr.push(finalApi[i].id);
        }
      }
      

      setUsersIdArray(newArr);
      console.log('done')
    };

    const handleAllSingleTransactions = async(usersIdArray) => {
      let finalTransaction = [];
      for (var j = 0; j < usersIdArray.length; j++){
        let solution =  await getSingleUserTransaction(usersIdArray[j]);

       finalTransaction.push(solution.length);
       setCircularPercentage(parseFloat(j /usersIdArray.length) * 100)


       }

      

       setShowUsers(true)
       return finalTransaction;
    }
   const handleRendering = async () => {

        console.log('here')
        const apiUsers = await axios.get("http://localhost:3000/user");

        console.log(apiUsers)
        // To get the list of user's in the database
        const finalApi = [...apiUsers.data.data];
        console.log(finalApi)
      
        //To update the state of users that'll be rendered in the
        //Expenses component

      
           setUsers(finalApi);
    
           //This check is to re render useEffect till it is
           // in populated state.
        if (usersIdArray == 0){
         // Sets usersidArray to have all users id.
        getAllUserId(finalApi);
          
        }
        
        // console.log(usersIdArray)
        // console.log('here');

        // This gets the transasction length of all users
        //to render the number of transactions on componentDidMount
       
        if (usersIdArray.length !== 0){
          const allSingleTransactions = await handleAllSingleTransactions(usersIdArray);
        
          // console.log('FINAL')
          // console.log(allSingleTransactions);
          setFinalSingleTransaction(allSingleTransactions);
       
        
              
        }
      


    
        
        
      }
   
  

   handleRendering();
  }, [usersIdArray]);
  return (
    <div className="App">
      <div className="header"></div>

      <div className="main-wrapper">
        <div className="left-side">
          {showUsers ? (
            <div className="users-container">
              <p className="users-heading">USERS</p>

              {users.map((user, indexCount) =>
                indexCount <= 10 && showUsers ? (
                  <div
                    key={indexCount}
                    className={active ? "single-user active" : "single-user"}
                    onClick={() => handleActive(user, indexCount,finalSingleTransaction)}
                  >
                 
                      <SingleUser user={user} 
                      active={active} 
                      showArrow={true} 
                      finalSingleTransaction={finalSingleTransaction}
                      indexCount={indexCount}/> 
               
                  </div>
                ) : null
              )}
            </div>
          ) : (
            <div className="margin-top">
              {" "}
              <CircularProgress />
              <h2>Please wait ...</h2>
              <div>{circularPercentage}%</div>
            </div>
          )}
        </div>

        <div className="right-side">
          {!allowExpenses ? (
            <div>
              <h2>Please select a user</h2>
            </div>
          ) : (

            showCircular ? <div><CircularProgress /></div> : <Expenses
              userForExpenses={userForExpenses}
              expenseTrend={expenseTrend}
              userSingleTransaction={userSingleTransaction}
              finalSingleTransaction={finalSingleTransaction}
              indexCount={indexCount}
              userId={userId}
              similarTrendsRun={similarTrendsRun}
              similarTrendsData={similarTrendsData}
              handleSimilarTrends={handleSimilarTrends}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;


// <div>{circularPercentage} %</div>