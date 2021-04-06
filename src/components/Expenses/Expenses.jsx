import { CircularProgress } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import axios from "axios";

const Expenses = ({
  getSingleUserTransaction,
  handleActive,
  userForExpenses,
  userSingleTransaction,
  expenseTrend,
  userId,
  refreshUseEffect,
  handleSimilarTrends,
  finalSimilarTrends,
  indexCountValue,
}) => {
  const [urlIcons, setUrlIcons] = useState([]);
  const [userAmount, setUserAmount] = useState(0);
  const [noOfTransactions, setNoOfTransactions] = useState(0);
  const [userDate, setUserDate] = useState("");
//   const [shortenedTrends, setShortenedTrends] = useState([]);

  const [arrangeNewUsers, setArrangeNewUsers] = useState([]);
  const [arrangeNewTransaction, setArrangeNewTransactions] = useState([])

 
  const [showExpenseCircular, setShowExpenseCircular] = useState(false)
  const getUsersById = async (usersArray) => {
    let users = [];
    let transactions = [];
    for (var testing = 0; testing < 2; testing++) {
    //   // console.log("started");
      const transaction = await getSingleUserTransaction(usersArray[testing]);
      const apiUsers = await axios.get("http://localhost:3000/user");
    //   // console.log("users");
    //   // console.log(apiUsers.data.data);

      users.push(apiUsers.data.data[testing]);
      transactions.push(transaction);
    }

    // // console.log(users);
    setArrangeNewUsers(users);
    setArrangeNewTransactions(transactions)
    // console.log('userSingleTransaction')
    // console.log(userSingleTransaction)

//     if (userSingleTransaction == undefined){

//  const newTransaction = await getSingleUserTransaction(userId);
//         handleActive(userForExpenses, newTransaction, indexCountValue);

//     }
  };

  useEffect(() => {
    //     // console.log(userId)

    // console.log("user for expenses");
    // console.log(userForExpenses);
    // console.log("user");
    // console.log(userSingleTransaction);
    //    // console.log('final')
    //    // console.log(finalSingleTransaction)
    //    // console.log(indexCount)

    if (finalSimilarTrends.length !== 0) {
      // console.log("finalSimilarTrends");
      // console.log(finalSimilarTrends);

      handleActive(userForExpenses, userSingleTransaction, indexCountValue);
      getUsersById(finalSimilarTrends);
    }

    const getUrlIcons = () => {
      let yearlyTransactions = [];
      let numberOfTrends = 8;
      let finalUrlArray = [];

      for (var i = 0; i < userSingleTransaction.length; i++) {
        if (userSingleTransaction[i].length !== 0) {
          yearlyTransactions.push(...userSingleTransaction[i][0]);
        }
      }
      setNoOfTransactions(yearlyTransactions.length);

      let current = expenseTrend.slice(0, numberOfTrends);

    //   setShortenedTrends(current);
      // console.log();

      let answer = current.map((x) => x.category);

      for (var j = 0; j < answer.length; j++) {
        // // console.log('URL array loading')
        const anotherOne = yearlyTransactions.filter(
          (x) => x.category == answer[j]
        )[0];
        finalUrlArray.push(anotherOne.icon_url);
      }

      setUrlIcons(finalUrlArray);
    };

    const getAmount = () => {
      let monthlyExpense = [];
      let currentMonthly = 0;
      let totalExpense = 0;

      for (var k = 0; k < userSingleTransaction.length; k++) {
        const arr = userSingleTransaction[k][0];

        if (arr == []) return;
        for (var i = 0; i < arr.length; i++) {
          let test = arr[i].amount;
          currentMonthly = currentMonthly + test;
        }
        monthlyExpense.push(currentMonthly);
      }

      for (var l = 0; l < monthlyExpense.length; l++) {
        totalExpense = totalExpense + monthlyExpense[l];
      }

      setUserAmount(totalExpense);
    };

    const getDateJoined = () => {
      const date = new Date();
      let newDate;
      const currentMonth = date.getMonth();
      const currentYear = date.getFullYear();

      const userMonthJoined = userForExpenses.created_at.split("-")[1];
      const userYearJoined = userForExpenses.created_at.split("-")[0];

      const yearsJoined = currentYear - userYearJoined;
      const monthsJoined = Math.abs(currentMonth - userMonthJoined);

      if (yearsJoined == 0) {
        newDate = `Joined ${monthsJoined} months ago`;
      } else if (yearsJoined == 1) {
        newDate = `Joined 1 year and ${monthsJoined} months ago`;
      } else {
        newDate = `Joined ${yearsJoined} years and ${monthsJoined} months ago`;
      }

      setUserDate(newDate);

      //  // console.log(typeof)
      // // console.log(date);
      // // console.log(user.created_at)
    };
    getUrlIcons();
    getAmount();
    getDateJoined();

  }, [userId, userForExpenses, refreshUseEffect]);

  return (
    <div className="expenses-container">
      <div>
        <img src={userForExpenses.avatar} className="user-image adjust-width" />
      </div>
      <div>
        <h2 className="expenses-user">
          {userForExpenses.first_name} {userForExpenses.last_name}
        </h2>

        <p className="expenses-top">
          {" "}
          {noOfTransactions} Transactions <span>.</span> {userDate}
        </p>
      </div>

      <div className="transactions" />
      <div className="flex-side align-side space-side fancy">
        <div className="expenses-middle fancy-div">
          <p className="fancy-title">TOTAL SPENT</p>
          <p className="fancy-text">N{userAmount}</p>
        </div>

        <div className="expenses-middle fancy-div">
          <p className="fancy-title">TOTAL INCOME</p>
          <p className="fancy-text">N745.10</p>
        </div>

        <div className="expenses-middle fancy-div">
          <p className="fancy-title">TRANSACTIONS</p>
          <p className="fancy-text">{noOfTransactions}</p>
        </div>
      </div>

      <div>
        <div className="bottom-div">
          <div className="left-bottom">
            <h3 className="recurring-expenses">RECURRING EXPENSES</h3>
            {/* */}
            <div className="img-recurring-div">
              {urlIcons !== [] ? (
                urlIcons.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    className="img-recurring"
                    alt="expenses"
                  />
                ))
              ) : (
                <CircularProgress />
              )}
            </div>
          </div>
          <div></div>
          <div
            className="expenses-middle fancy-div fix-height"
            // onClick={() =>
            //   handleSimilarTrends(expenseTrend, shortenedTrends, userId)
            // }
          >
         
            {arrangeNewUsers.length == 0  ? (
              <div className="fancy-text" onClick={() => setShowExpenseCircular(true)}> {showExpenseCircular ? '' : 'Show Similar Trends' } {showExpenseCircular && <div><CircularProgress /></div>}</div>
            ) : finalSimilarTrends.length !== 0 ? (
              <div className="left-bottom">
                {" "}
                <h3 className="recurring-expenses">
                  USERS LIKE "{userForExpenses.first_name}{" "}
                  {userForExpenses.last_name}"
                </h3>
                {arrangeNewUsers.length !== 0 ? (
                  arrangeNewUsers.map((newUser) => (

                      <div>
                    <div className="singleuser-wrapper">

      <div className="flex-side align-side space-side">
      <div className="flex-side align-side">
       <div className="left-img">
            <img src={newUser.avatar} className="user-image"/>
        </div>
       
       <div className="right-data">
       <div className="user-name">{newUser.first_name} {newUser.last_name}</div>
            <div className="trans-div">
                <div className="trans-text">{arrangeNewTransaction ? arrangeNewTransaction.length : 96} Transactions <div></div></div>
            </div>
       </div>
       </div>
    </div>
        </div>
        </div>
                  ))
                ) : (
               <div></div>
                )}
              </div>
            ) : (
              <CircularProgress />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
