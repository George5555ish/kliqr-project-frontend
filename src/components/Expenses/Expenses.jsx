import React from 'react';
import SimilarUsers from '../SimilarUsers/SimilarUsers';
import SingleUser from '../SingleUser/SingleUser';

const Expenses = ({userForExpenses, usersIdArray}) => {

    // console.log(usersIdArray)
    // console.log(userForExpenses.id)
    return (
        <div className="expenses-container">
            <div>
                <img src={userForExpenses.avatar} className="user-image adjust-width"/>
            </div>
            <div>
                <h2 className="expenses-user">{userForExpenses.first_name} {userForExpenses.last_name}</h2>

                <p className="expenses-top"> 300 Transactions <span>.</span> Joined 2 months ago</p>
            </div>

            <div className="transactions" />
            <div className="flex-side align-side space-side fancy">
                <div className="expenses-middle fancy-div">
                    <p  className="fancy-title">TOTAL SPENT</p>
                    <p className="fancy-text">N590.00</p>
                </div>

                <div className="expenses-middle fancy-div">
                    <p className="fancy-title">TOTAL INCOME</p>
                    <p className="fancy-text">N745.10</p>
                </div>

                <div className="expenses-middle fancy-div">
                    <p className="fancy-title">TRANSACTIONS</p>
                    <p className="fancy-text">300</p>
                </div>
            </div>

            <div >
                <div className="bottom-div">
                   
                    <div className="left-bottom">
                     <h3 className="recurring-expenses">RECURRING EXPENSES</h3>
                            <div className="img-recurring-div">
                            <img src={userForExpenses.avatar} className="img-recurring"/>
                        <img src={userForExpenses.avatar} className="img-recurring"/>
                        <img src={userForExpenses.avatar} className="img-recurring"/>
                        <img src={userForExpenses.avatar} className="img-recurring"/>
                        <img src={userForExpenses.avatar} className="img-recurring"/>
                        <img src={userForExpenses.avatar} className="img-recurring"/>
                        <img src={userForExpenses.avatar} className="img-recurring"/>
                        <img src={userForExpenses.avatar} className="img-recurring"/>
                            </div>
                       
                    </div>

                    <div className="left-bottom">
                     <h3 className="recurring-expenses">USERS LIKE "{userForExpenses.first_name} {userForExpenses.last_name}"</h3>
                            <div className="control-similar">
                        <SingleUser user={userForExpenses} showArrow={false}/>
                        <div className="transactions" />
                        <SingleUser user={userForExpenses} showArrow={false}/>
                            </div>
                       
                    </div>

                    {/* <div>
                        <p></p>

                        <div className="similar-trends">
                            <SimilarUsers userForExpenses={userForExpenses} />
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default Expenses
