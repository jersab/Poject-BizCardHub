import React, { useState, useEffect } from 'react';
import { getAllUsers, deleteUser, updateUserStatus } from '../services/userService';
import { User } from '../interfaces/users/User';
import { errorMassage, successMassage } from '../services/feedbackService';

const Sandbox: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        getAllUsers()
            .then((res) => {
                setUsers(res.data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                errorMassage("Failed to load users");
                setIsLoading(false);
            });
    };

    const handleUserStatusChange = (user: User) => {
        if (user._id) {
            updateUserStatus(user._id)
                .then(() => {
                    successMassage("User status updated");
                    fetchUsers(); // רענון רשימת המשתמשים
                })
                .catch((err) => {
                    console.error(err);
                    errorMassage("Failed to update user status");
                });
        }
    };

    const handleUserDelete = (userId: string) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            deleteUser(userId)
                .then(() => {
                    successMassage("User deleted");
                    fetchUsers(); // רענון רשימת המשתמשים
                })
                .catch((err) => {
                    console.error(err);
                    errorMassage("Failed to delete user");
                });
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <h1>Admin Sandbox</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Business Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user._id || `user-${index}`}>
                            <td>{user.name.first} {user.name.last}</td>
                            <td>{user.email}</td>
                            <td>{user.isBusiness ? 'Business' : 'Regular'}</td>
                            <td>
                                <button 
                                    className="btn btn-sm btn-warning me-2"
                                    onClick={() => handleUserStatusChange(user)}
                                    disabled={user.isAdmin} // מנע שינוי סטטוס ממשתמש אדמין
                                >
                                    Toggle Status
                                </button>
                                <button 
                                    className="btn btn-sm btn-danger"
                                    onClick={() => user._id && handleUserDelete(user._id)}
                                    disabled={user.isAdmin} // מנע מחיקת אדמין
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Sandbox;