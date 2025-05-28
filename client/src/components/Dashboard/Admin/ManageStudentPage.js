// client/src/components/Dashboard/Admin/ManageStudentsPage.js
import React, { useState, useEffect } from 'react';
import adminService from '../../../services/admin.service';
import Spinner from '../../Common/Spinner';
import Alert from '../../Common/Alert';
import { FaUserShield, FaEnvelope, FaCalendarAlt } from 'react-icons/fa';
import './AdminDashboard.css';

const ManageStudentsPage = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true);
            try {
                const response = await adminService.getAllStudents();
                setStudents(response.data.data || response.data.students || []);
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to load students list.');
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    if (loading) return <Spinner message="Loading students..." />;
    if (error) return <Alert type="danger" message={error} />;

    return (
        <div className="manage-students-page card">
            <h2 className="page-title"><FaUsers /> Manage Students</h2>
            {students.length === 0 ? (
                <Alert type="info" message="No students found." />
            ) : (
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Avatar</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Joined On</th>
                                <th>Role</th>
                                {/* <th>Actions</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => (
                                <tr key={student._id}>
                                    <td>
                                        <img
                                            src={student.avatar.startsWith('http') ? student.avatar : `${process.env.REACT_APP_API_URL_NO_PROXY || ''}${student.avatar}`}
                                            alt={student.name}
                                            className="table-avatar"
                                        />
                                    </td>
                                    <td>{student.name}</td>
                                    <td><FaEnvelope className="table-icon" /> {student.email}</td>
                                    <td><FaCalendarAlt className="table-icon" /> {new Date(student.createdAt || student.date).toLocaleDateString()}</td>
                                    <td><FaUserShield className="table-icon" /> {student.role}</td>
                                    {/* <td><button className="btn btn-sm btn-primary">View Details</button></td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManageStudentsPage;