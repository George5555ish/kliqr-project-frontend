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

  const [finalSimilarTrends, setFinalSimilarTrends] = useState([]);


  const [showUsers, setShowUsers] = useState(false)
  const [userForExpenses, setUserForExpenses] = useState([]);
  const [userSingleTransaction, setUserSingleTransaction] = useState([]);
  // const [allowExpenses, setAllowExpenses] = useState(false);
  const [usersIdArray, setUsersIdArray] = useState([]);
  const [finalSingleTransaction, setFinalSingleTransaction] = useState([]);
  const [indexCountValue, setIndexCountValue] = useState(0)
  const [expenseTrend, setExpenseTrend] = useState([]);
  const [userId, setUserId] = useState(641);
  const [showCircular, setShowCircular] = useState(true);
  const [circularPercentage, setCircularPercentage] = useState(0);

  const [similarTrendsData, setSimilarTrendsData] = useState([]);
  const [refreshUseEffect, setRefreshUseEffect] = useState(false);

  const expenseTrendLink = 'https://kliqr-project-expense-trend.herokuapp.com';
  const bridgeLink = 'https://kliqr-project-service-link.herokuapp.com';
  // const [expenseUserIdArray]

  let newArr = [];

  // To handle background change;
  const handleActive = async (user,finalTransaction, indexCount, setRefreshValue) => {
    //// console(index)
    setActive(true); 
    // setAllowExpenses(true);
    setIndexCountValue(indexCount)
    
    sendUserData(user,finalTransaction, indexCount, setRefreshValue);
    setUserId(user.id);
    handleTransactions( user.id);


    if (similarTrendsRun){
      setSimilarTrendsRun(false);
    // const firstId = await handleAllTransactions(usersIdArray);
    //// console(firstId);
    setShowCircular(false);
    }
   
  };

  //Function to be used in the Expenses array to 
  //find similar Trends
  const handleSimilarTrends = async(expenseTrend) => {

   // console(usersIdArray)
   // console(expenseTrend)
    setSimilarTrendsRun(true);

    // This generates the expense trend for other users.
   const finalArray =  await handleAllTransactions(usersIdArray);
  // console('this is it')
  // console(finalArray)
   setSimilarTrendsData(finalArray);
   getSimilarTrends(expenseTrend, finalArray);

   setFinalSimilarTrends(finalSimilarTrends * 1)

  }

  const getSimilarTrends = (expenseTrend, finalArray) => {

    const similarUserTrends = [];
    let numberOfTrends = 8; 
   
    let numberofSimilarTrendsBetweenUsers = 5;
    //// console('expenseTrend');
    //// console(expenseTrend);

    let shortenedTrends = expenseTrend.slice(0, numberOfTrends);

    //// console('finalArray')

    //// console(finalArray);
    //// console(finalArray[0])
    //// console(finalArray[0].transaction)
//  First loops will iterate through all the users

for (var users = 0; users < finalArray.length; users++){
  
 let firstUser = finalArray[users].transaction;
// // console('firstUser')
// // console(firstUser[users])
 let similarityCount = 0;
    // Looping through each trend for current user
    for (let userTrend = 0; userTrend < shortenedTrends.length; userTrend++){

      let currentUserTrend = shortenedTrends[userTrend];
     
      //// console(currentUserTrend);

    
     

      // Looping through all trends in each user transaction
      //to validate if current trends match with original trend
      for (var jent = 0; jent < firstUser.length; jent++){
        
        //// console(firstUser[jent].category)
        //// console(currentUserTrend.category)
        if (firstUser[jent].category === currentUserTrend.category){
          similarityCount++;
          //// console('it added');
          //// console(similarityCount)
        }
      }


      
    }


    //// console('similarity count after')
    //// console(similarityCount)

    if (similarityCount > numberofSimilarTrendsBetweenUsers){
      similarUserTrends.push(finalArray[users].userId);
    }
}

//// console(similarUserTrends)
setFinalSimilarTrends(similarUserTrends);
sendUserData(userForExpenses)
  }

  const handleAllTransactions = async(userIdArray) => {
    let allTransactions = [];
    var number = 0;
   // console(userIdArray)
    for (var count = 0; count < userIdArray.length; count++){
    
      setCircularPercentage(parseFloat(number /userIdArray.length) * 100)
      number++;
      const singleTrans = await handleTransactions(userIdArray[count]);
     // console(singleTrans)
      allTransactions.push({ "transaction":singleTrans, "userId": userIdArray[count]});
      //// console(allTransactions)
    }

   // console('this one from function')
   // console(allTransactions)

    return allTransactions;
  }
  const sendUserData = (user, finalTransaction, indexCount, setRefreshValue) => {

    //This function is an intermediate between Expenses component.
    //It sends data from the app to Expenses.
    setUserForExpenses(user);
    setRefreshUseEffect(false)


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
    let singleTransaction;
     await axios.get('https://kliqr-project-service-link.herokuapp.com/' + userId).then(response => {
      //  console.log(response);
       singleTransaction = response;
     
      }).catch(error => console.log(error));

  //     console.log(singleTransaction.data);
  //     console.log(singleTransaction.data.payload);
  //  console.log(singleTransaction.data.payload.data);
    await setUserSingleTransaction(singleTransaction.data.payload.data);
    return singleTransaction.data.payload.data;
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
    //// console('worked')
    //// console(userCategories)

    //// console(userTransactionArray)

    let arrayDates = [];
    let newUserCategories = [];
    let allTransactionsInYear = [];

    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth();
    const prevYear = currentYear - 1;

    //// console(currentMonth, currentYear);

    let testMonth = 3;
    let testYear = 2021;

    while (testMonth <= currentMonth && testYear === currentYear) {
      if (testMonth === 0) {
        testMonth = 12;
        testYear--;
      }

      //// console(testMonth + "/" + testYear);
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
    //// console(arrayDates)


    if (arrayDates) {
      for (var i = 0; i < arrayDates.length; i++) {
        let month = arrayDates[i].split("/")[0];
        let year = arrayDates[i].split("/")[1];

        let fixedMonth = month.length === 1 ? "0" + month : month;

        //// console(fixedMonth, year)
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

        //// console(finalArray);

        allTransactionsInYear.push([finalArray]);

        newUserCategories = userCategories.reduce(function (s, a) {
          s.push({ category: a, categoryLength: 0 });
          return s;
        }, []);
      }

      setUserSingleTransaction(allTransactionsInYear);

      //// console(newUserCategories);
      //// console(allTransactionsInYear);

      for (let select = 0; select < allTransactionsInYear.length; select++) {
        var transact = allTransactionsInYear[select][0];
        //// console(transact);

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
    //// console(userArray)
    userArray.forEach((userItem) => {
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
     // console('start')
      if (finalApi.length !== 0) {
        for (var i = 0; i < finalApi.length; i++) {
          newArr.push(finalApi[i].id);
        }
      }
      

      setUsersIdArray(newArr);
     // console('done')
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

      let finalApi;
       // console('here')
       await axios.get("https://kliqr-project-expense-trend.herokuapp.com/user").then(response => {
         
          // console.log('response');
          // console.log(response.data.data)
          finalApi = response.data.data;
        }).catch(error => console.log(error));

      //  console.log('apiUsers')
      //  console.log(apiUsers)
        // To get the list of user's in the database
        // const finalApi = [...apiUsers.data];
      //  console.log('finalApi')
      //  console.log(finalApi)
      //  finalApi = [...apiUsers.data.data];
      
        //To update the state of users that'll be rendered in the
        //Expenses component

      
           setUsers(finalApi);
    
           //This check is to re render useEffect till it is
           // in populated state.
        if (usersIdArray == 0){
         // Sets usersidArray to have all users id.
        getAllUserId(finalApi);
          
        }
        
        //// console(usersIdArray)
        //// console('here');

        // This gets the transasction length of all users
        //to render the number of transactions on componentDidMount
       
        if (usersIdArray.length !== 0 || refreshUseEffect){
          const allSingleTransactions = await handleAllSingleTransactions(usersIdArray);
        
          //// console('FINAL')
          //// console(allSingleTransactions);
          setFinalSingleTransaction(allSingleTransactions);
          setRefreshUseEffect(false)
        
              
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
            <div className="margin-top" style={{width: '200px'}}>
              {" "}
              <CircularProgress />
              <h2 className="fancy-text">Please wait ...</h2>
              <div className="fancy-text" style={{marginTop: '30px'}}>{circularPercentage}%</div>
            </div>
          )}
        </div>

        <div className="right-side">
       
            <div>

            {!showUsers ? '': (!active && <h2>Please select a user</h2>)}
          
            </div>
         

            {showCircular ? <div></div> : <Expenses
              userForExpenses={userForExpenses}
              expenseTrend={expenseTrend}
              userSingleTransaction={userSingleTransaction}
              finalSingleTransaction={finalSingleTransaction}
              indexCountValue={indexCountValue}
              userId={userId}
              similarTrendsRun={similarTrendsRun}
              similarTrendsData={similarTrendsData}
              handleSimilarTrends={handleSimilarTrends}
              finalSimilarTrends={finalSimilarTrends}
              handleActive={handleActive}
              refreshUseEffect={refreshUseEffect}
              getSingleUserTransaction={getSingleUserTransaction}
            />}
          
        </div>
      </div>
    </div>
  );
}

export default App;


// <div>{circularPercentage} %</div>