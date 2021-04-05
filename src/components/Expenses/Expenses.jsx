import { CircularProgress } from '@material-ui/core';
import React, {useState,useEffect} from 'react';

const Expenses = ({userForExpenses, userSingleTransaction, expenseTrend,userId,similarTrendsData, handleSimilarTrends, similarTrendsRun}) => {


    


    const [urlIcons, setUrlIcons] = useState([]);
    const [userAmount, setUserAmount] = useState(0);
    const [noOfTransactions, setNoOfTransactions] = useState(0);
    const [userDate, setUserDate] = useState('');
    const [shortenedTrends, setShortenedTrends] = useState([]);
  


    useEffect(() => {
        
    //     console.log(userId)
    //    console.log(userForExpenses)
    // console.log('user')
    //    console.log(userSingleTransaction)
    //    console.log('final')
    //    console.log(finalSingleTransaction)
    //    console.log(indexCount)

    if (similarTrendsData){
        console.log('similarTrendsData');
        console.log(similarTrendsData);
    }
        const getUrlIcons = () => {
            let yearlyTransactions = [];
            let numberOfTrends = 8;
            let finalUrlArray = [];
            


                    for (var i = 0; i < userSingleTransaction.length; i++){
                        if (userSingleTransaction[i].length !== 0){
                         yearlyTransactions.push(...userSingleTransaction[i][0])
                        }
                             }
                    setNoOfTransactions(yearlyTransactions.length);

 let current = expenseTrend.slice(0, numberOfTrends);

 setShortenedTrends(current);


 let answer = current.map((x) => x.category)

 for (var j = 0; j < answer.length; j++){
// console.log('URL array loading')
    const anotherOne = yearlyTransactions.filter((x) => x.category == answer[j])[0];
    finalUrlArray.push(anotherOne.icon_url);
 }

setUrlIcons(finalUrlArray);
            }

    const getAmount =  () => {
        let monthlyExpense = [];
        let currentMonthly = 0;
        let totalExpense = 0;

        for (var k = 0; k < userSingleTransaction.length; k++){
            const arr = userSingleTransaction[k][0];

            if (arr == []) return;
            for (var i = 0; i < arr.length; i++){
                let test = arr[i].amount;
                currentMonthly = currentMonthly + test;
            }
            monthlyExpense.push(currentMonthly);
        }

      for (var l = 0; l < monthlyExpense.length; l++){
        totalExpense = totalExpense + monthlyExpense[l];
      }

 
        setUserAmount(totalExpense);
    }

    const getDateJoined = () => {
        const date = new Date();
        let newDate;
        const currentMonth = date.getMonth();
        const currentYear = date.getFullYear();
  
        const userMonthJoined = userForExpenses.created_at.split('-')[1];
        const userYearJoined = userForExpenses.created_at.split('-')[0];
  
        const yearsJoined = currentYear - userYearJoined;
        const monthsJoined = Math.abs(currentMonth - userMonthJoined);
  
          if (yearsJoined == 0){
             newDate = `Joined ${monthsJoined} months ago`;
          } else if (yearsJoined == 1){
              newDate = `Joined 1 year and ${monthsJoined} months ago`;
          } else {
                newDate = `Joined ${yearsJoined} years and ${monthsJoined} months ago`;
          }

          setUserDate(newDate)

        //  console.log(typeof)
      // console.log(date);
      // console.log(user.created_at)   
      }
getUrlIcons();
getAmount();
getDateJoined();
    }, [userId, similarTrendsData])

    return (
        <div className="expenses-container">
            <div>
                <img src={userForExpenses.avatar} className="user-image adjust-width"/>
            </div>
            <div>
                <h2 className="expenses-user">{userForExpenses.first_name} {userForExpenses.last_name}</h2>

                <p className="expenses-top"> {noOfTransactions} Transactions <span>.</span> {userDate}</p>
            </div>

            <div className="transactions" />
            <div className="flex-side align-side space-side fancy">
              <div className="expenses-middle fancy-div">
                    <p  className="fancy-title">TOTAL SPENT</p>
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

            <div >
                <div className="bottom-div">
                   
                    <div className="left-bottom">
                     <h3 className="recurring-expenses">RECURRING EXPENSES</h3>
                            {/* */}<div className="img-recurring-div">
                         
                  {
                      urlIcons !==[] ? urlIcons.map((image, index) => <img key={index} src={image} className="img-recurring" alt="expenses"/>) : <CircularProgress />   
                       
                  }
                            </div> 
                          
                    </div>
                    <div>

                    </div>
{/*                     
                    <div className="left-bottom">
                     <h3 className="recurring-expenses">USERS LIKE "{userForExpenses.first_name} {userForExpenses.last_name}"</h3>
                            <div className="control-similar">
                        <SingleUser user={userForExpenses} showArrow={false} />
                        <div className="transactions" />
                        <SingleUser user={userForExpenses} showArrow={false}/>
                            </div>
                       
                    </div>  */}
                    <div className="expenses-middle fancy-div fix-height" onClick={() =>handleSimilarTrends(expenseTrend, shortenedTrends)}>
                   
                   {
                       !similarTrendsRun ? <div className="fancy-text" >Show Similar Trends</div> : (similarTrendsData !== [] ? <div> Similar Trends shown</div> : <CircularProgress />)
                   }
                </div>
                 
                </div>
            </div>
        </div>
    )
}

export default Expenses
