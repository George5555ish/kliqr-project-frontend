import React, {useEffect, useState} from 'react';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';



const SingleUser = ({user, showArrow, finalSingleTransaction, indexCount}) => {

    const [dateJoined, setDateJoined] = useState('')
    useEffect(() => {
        const getDateJoined = () => {
            const date = new Date();
            let newDate;
            const currentMonth = date.getMonth();
            const currentYear = date.getFullYear();
      
            const userMonthJoined = user.created_at.split('-')[1];
            const userYearJoined = user.created_at.split('-')[0];
      
            const yearsJoined = currentYear - userYearJoined;
            const monthsJoined = Math.abs(currentMonth - userMonthJoined);
      
              if (yearsJoined == 0){
                 newDate = `Joined ${monthsJoined} months ago`;
              } else if (yearsJoined === 1){
                  newDate = `Joined 1 year and ${monthsJoined} months ago`;
              } else {
                    newDate = `Joined ${yearsJoined} years and ${monthsJoined} months ago`;
              }

              setDateJoined(newDate)

            //  console.log(typeof)
          // console.log(date);
          // console.log(user.created_at)   
          }

          getDateJoined();
    })
    return (
        <div className="singleuser-wrapper">

      <div className="flex-side align-side space-side">
      <div className="flex-side align-side">
       <div className="left-img">
            <img src={user.avatar} className="user-image" alt="user-image"/>
        </div>
       
       <div className="right-data">
       <span className="user-name">{user.first_name} {user.last_name}</span>
            <div className="trans-div">
                <span className="trans-text">{finalSingleTransaction[indexCount]} Transactions <div></div><span>.</span> {dateJoined}</span>
            </div>
       </div>
       </div>

{showArrow && <span style={{marginRight: '10px'}}><ArrowForwardIosIcon /></span>}      </div>
        </div>
    )
}

export default SingleUser
