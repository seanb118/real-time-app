import React from 'react';

const UserProfile = ({ username }) => {
    return (
        <div className="user-profile">
            <img src="profile-picture.jpg" alt="Profile" />
            <h3>{username}</h3>
        </div>
    );
};

export default UserProfile;