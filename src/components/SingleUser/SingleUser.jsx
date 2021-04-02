import React from 'react';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

const SingleUser = ({user, showArrow}) => {
    return (
        <div className="singleuser-wrapper">

      <div className="flex-side align-side space-side">
      <div className="flex-side align-side">
       <div className="left-img">
            <img src={user.avatar} className="user-image"/>
        </div>
       
       <div className="right-data">
       <p className="user-name">{user.first_name} {user.last_name}</p>
            <div className="trans-div">
                <p className="trans-text">300 Transactions <span>.</span>Joined 2 months ago</p>
            </div>
       </div>
       </div>

   {
    showArrow &&   <span style={{marginRight: '10px'}}><ArrowForwardIosIcon /></span>
   }
      </div>
        </div>
    )
}

export default SingleUser
