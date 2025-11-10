import React, { useEffect, useState } from 'react';
import { url } from '../Baseurl';
import { useNavigate } from 'react-router-dom';

const USERS = ['Earn Leave', 'Current Leave', 'Half Day'];

const AddLeave = () => {
    const navigate = useNavigate();
    const [selectedUser, setSelectedUser] = useState('');
    const [empoyeecode, setempoyeecode] = useState('');
    const [employeename, setEmployeeName] = useState('');
    const [designation, setDesignation] = useState('');
    const [department, setDepartment] = useState('');
    const [purpose, setPurpose] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [error, setError] = useState(false);



    const calculateDays = () => {
        if (selectedUser === 'Half Day') return 'Half Day';
        if (fromDate && toDate) {
            const start = new Date(fromDate);
            const end = new Date(toDate);
            const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
            return diff > 0 ? `${diff} day(s)` : '0 day';
        }
        return '0 day';
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        try {
            const usercode = localStorage.getItem("userCode");
            const username = localStorage.getItem("username");
            setempoyeecode(usercode);
            setEmployeeName(username);
        } catch (err) {
            console.error("Init error", err);
            alert('An error occurred.');
        }
    }, []);

    // Reset or sync toDate when leave type changes
    useEffect(() => {
        if (selectedUser === 'Half Day') {
            setToDate('');
        }
    }, [selectedUser]);

    // Sync toDate to fromDate for Half Day type
    useEffect(() => {
        if (selectedUser === 'Half Day') {
            setToDate(fromDate);
        }
    }, [fromDate, selectedUser]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;

            img.onload = () => {
                const MAX_WIDTH = 600;
                const MAX_HEIGHT = 600;
                let width = img.width;
                let height = img.height;

                if (width > MAX_WIDTH || height > MAX_HEIGHT) {
                    const aspectRatio = width / height;
                    if (aspectRatio > 1) {
                        width = MAX_WIDTH;
                        height = MAX_WIDTH / aspectRatio;
                    } else {
                        height = MAX_HEIGHT;
                        width = MAX_HEIGHT * aspectRatio;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                let quality = 0.9;
                let base64 = canvas.toDataURL('image/jpeg', quality);

                const TARGET_SIZE = 80 * 1024;
                while (base64.length > TARGET_SIZE && quality > 0.3) {
                    quality -= 0.05;
                    base64 = canvas.toDataURL('image/jpeg', quality);
                }

                setSelectedImage(base64);
            };
        };
    };

    const handleAddLeave = async () => {
        if (
            !empoyeecode ||
            !employeename ||
            !designation ||
            !department ||
            !purpose ||
            !fromDate ||
            (!toDate && selectedUser !== 'Half Day') ||
            !selectedUser
        ) {
            setError(true);
            alert("Please fill all fields correctly.");
            return;
        }

        const duration = calculateDays();

        try {
            const token = localStorage.getItem("U_Token");
            const response = await fetch(`${url}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    leavetype: selectedUser,
                    name: employeename,
                    employeescode: empoyeecode,
                    designation,
                    department,
                    purpose,
                    leaveimage: selectedImage,
                    fromdate: formatDate(fromDate),
                    todate: selectedUser === 'Half Day' ? '' : formatDate(toDate),
                    duration
                })
            });

            const result = await response.json();
            alert('Leave Submitted Successfully!');
            navigate('/');
            console.log(result);
            setError(false);
        } catch (err) {
            console.error(err);
            alert('Something went wrong.');
        }
    };

    return (
        <div className="container">
            <h2 className="header">LEAVE REQUEST</h2>

            <label>Leave Type *</label>
            {error && !selectedUser && <span className="error">Please select leave type</span>}
            <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
            >
                <option value="">Select</option>
                {USERS.map((user, index) => (
                    <option key={index} value={user}>{user}</option>
                ))}
            </select>

            <label>Employee Code *</label>
            {error && !empoyeecode && <span className="error">Enter code</span>}
            <input type="text" value={empoyeecode} onChange={(e) => setempoyeecode(e.target.value)} />

            <label>Employee Name *</label>
            {error && !employeename && <span className="error">Enter name</span>}
            <input type="text" value={employeename} onChange={(e) => setEmployeeName(e.target.value)} />

            <label>Designation *</label>
            {error && !designation && <span className="error">Enter designation</span>}
            {/* <input type="text" value={designation} onChange={(e) => setDesignation(e.target.value)} /> */}

            <select
                name="Designation"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
            >
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
                <option value="ceo">CEO</option>
                <option value="admin">Admin</option>
            </select>

            <label>Department *</label>
            {error && !department && <span className="error">Enter department</span>}
            {/* <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} /> */}
            <select
                name="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
            >
                <option value="">Select Department</option>
                <option value="Finance">Finance</option>
                <option value="HR">HR</option>
                <option value="IT">IT</option>
                <option value="Meter">Meter</option>
                <option value="Solar">Solar</option>
                <option value="Sales">Sales</option>
                <option value="CEO">CEO</option>
            </select>



            <label>Purpose *</label>
            {error && !purpose && <span className="error">Enter purpose</span>}
            <input type="text" value={purpose} onChange={(e) => setPurpose(e.target.value)} />

            {/* Date Fields */}
            <label>{selectedUser === 'Half Day' ? 'Date *' : 'From Date *'}</label>
            {error && !fromDate && <span className="error">Select date</span>}
            <input
                type="date"
                value={fromDate}
                onChange={(e) => {
                    setFromDate(e.target.value);
                    if (toDate && new Date(e.target.value) > new Date(toDate)) {
                        setToDate('');
                    }
                }}
            />

            {/* To Date for non-Half Day */}
            {selectedUser !== 'Half Day' && (
                <>
                    <label>To Date *</label>
                    {error && !toDate && <span className="error">Select date</span>}
                    <input
                        type="date"
                        value={toDate}
                        min={fromDate}
                        disabled={!fromDate}
                        onChange={(e) => setToDate(e.target.value)}
                    />
                </>
            )}

            {fromDate && (selectedUser === 'Half Day' || toDate) && (
                <p>
                    <strong>Total Leave:</strong>{' '}
                    {selectedUser === 'Half Day' ? formatDate(fromDate) + ' - Half Day' : calculateDays()}
                </p>
            )}

            <label>File Attachment (optional)</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />

            {selectedImage && (
                <img src={selectedImage} alt="Preview" style={styles.image} />
            )}

            <button className="submitBtn" onClick={handleAddLeave}>Submit</button>
        </div>
    );
};
// Image preview styles
const styles = {
    image: {
        width: '250px',
        height: '290px',
        objectFit: 'cover',
        borderRadius: '8px',
        border: '1px solid #ddd',
        marginTop: '10px'
    }
};

export default AddLeave;
