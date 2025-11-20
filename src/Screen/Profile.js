import React, { useEffect, useState, useCallback } from "react";
import { url } from "../Baseurl";

/* ------------------- FIX: MOVE EMPTY PROFILE OUTSIDE COMPONENT ------------------- */
const EMPTY_PROFILE = {
    phone: "",
    website: "",
    profileimage: "",
    address: {
        street: "",
        suite: "",
        city: "",
        zipcode: "",
        geo: { lat: "", lng: "" }
    },
    company: {
        name: "",
        catchPhrase: "",
        bs: ""
    }
};

export default function Profile() {
    const token = localStorage.getItem("U_Token");

    const [form, setForm] = useState(EMPTY_PROFILE);
    const [exists, setExists] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [previewImg, setPreviewImg] = useState(null);

    const [userInfo, setUserInfo] = useState({
        name: "",
        email: "",
        employeescode: "",
        department: ""
    });

    /* ------------------- FETCH PROFILE ------------------- */
    const loadProfile = useCallback(() => {
        fetch(`${url}/api/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((res) => res.json())
            .then((data) => {
                if (!data.success) return;

                setUserInfo({
                    name: data.user.name,
                    email: data.user.email,
                    employeescode: data.user.employeescode,
                    department: data.user.department
                });

                if (!data.profile) {
                    setExists(false);
                    return;
                }

                setExists(true);
                setForm({ ...EMPTY_PROFILE, ...data.profile });
                setPreviewImg(`${url}${data.profile.profileimage}`);
            })
            .catch((err) => console.log("Fetch error:", err));
    }, [token]);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    /* ------------------- INPUT CHANGE ------------------- */
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.includes(".")) {
            const [main, sub] = name.split(".");
            setForm((prev) => ({
                ...prev,
                [main]: { ...prev[main], [sub]: value }
            }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleGeoChange = (field, value) => {
        setForm((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                geo: { ...prev.address.geo, [field]: value }
            }
        }));
    };

    /* ------------------- IMAGE CHANGE ------------------- */
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);

        if (file) {
            setPreviewImg(URL.createObjectURL(file));
        }
    };

    /* ------------------- SUBMIT ------------------- */
    const handleSubmit = async (e) => {
        e.preventDefault();

        const method = exists ? "PUT" : "POST";
        const formData = new FormData();

        formData.append("phone", form.phone);
        formData.append("website", form.website);
        formData.append("address", JSON.stringify(form.address));
        formData.append("company", JSON.stringify(form.company));

        if (imageFile) formData.append("profileimage", imageFile);

        const res = await fetch(`${url}/api/profile`, {
            method,
            headers: { Authorization: `Bearer ${token}` },
            body: formData
        });

        const result = await res.json();
        console.log("SAVE RESULT:", result);

        alert(exists ? "Profile Updated Successfully!" : "Profile Created Successfully!");
        loadProfile();
    };

    return (
        <div style={container}>
            <div style={card}>
                <h2 style={title}>User Information</h2>

                <div style={{ textAlign: "center" }}>
                    {previewImg && (
                        <img src={previewImg} alt="preview" style={profileImg} />
                    )}
                </div>

                <label style={label}>Profile Image</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={fileInput}
                />

                <div style={infoBox}>
                    <p><strong>Name:</strong> {userInfo.name}</p>
                    <p><strong>Email:</strong> {userInfo.email}</p>
                    <p><strong>Emp Code:</strong> {userInfo.employeescode}</p>
                    <p><strong>Department:</strong> {userInfo.department}</p>
                </div>

                <h2 style={title}>{exists ? "Update Profile" : "Create Profile"}</h2>

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <label style={label}>Phone</label>
                    <input name="phone" value={form.phone} onChange={handleChange} style={input} />

                    <label style={label}>Website</label>
                    <input name="website" value={form.website} onChange={handleChange} style={input} />

                    <h3 style={subtitle}>Address</h3>

                    <div style={grid2}>
                        <input name="address.street" value={form.address.street} onChange={handleChange} style={input} />
                        <input name="address.suite" value={form.address.suite} onChange={handleChange} style={input} />
                    </div>

                    <div style={grid2}>
                        <input name="address.city" value={form.address.city} onChange={handleChange} style={input} />
                        <input name="address.zipcode" value={form.address.zipcode} onChange={handleChange} style={input} />
                    </div>

                    <div style={grid2}>
                        <input value={form.address.geo.lat} onChange={(e) => handleGeoChange("lat", e.target.value)} style={input} />
                        <input value={form.address.geo.lng} onChange={(e) => handleGeoChange("lng", e.target.value)} style={input} />
                    </div>

                    <h3 style={subtitle}>Company Details</h3>

                    <input name="company.name" value={form.company.name} onChange={handleChange} style={input} />
                    <input name="company.catchPhrase" value={form.company.catchPhrase} onChange={handleChange} style={input} />
                    <input name="company.bs" value={form.company.bs} onChange={handleChange} style={input} />

                    <button type="submit" style={btnPrimary}>
                        {exists ? "Update Profile" : "Create Profile"}
                    </button>
                </form>
            </div>
        </div>
    );
}

/* ------------------- STYLES ------------------- */
const container = {
    width: "100%",
    padding: 20,
    display: "flex",
    justifyContent: "center",
};

const card = {
    width: "100%",
    maxWidth: 650,
    background: "#fff",
    padding: 25,
    borderRadius: 12,
    boxShadow: "0 3px 10px rgba(0,0,0,0.12)",
};

const title = {
    color: "#333",
    marginBottom: 10,
};

const subtitle = {
    marginTop: 20,
    color: "#444",
};

const infoBox = {
    background: "#f7f7f7",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20
};

const label = {
    fontWeight: "bold",
    marginTop: 10,
};

const profileImg = {
    width: 130,
    height: 130,
    borderRadius: 10,
    objectFit: "cover",
    marginBottom: 15,
    border: "2px solid #ddd"
};

const fileInput = {
    width: "100%",
    marginTop: 10,
    marginBottom: 20
};

const grid2 = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10
};

const input = {
    width: "100%",
    padding: 10,
    marginTop: 8,
    marginBottom: 12,
    border: "1px solid #ddd",
    borderRadius: 6
};

const btnPrimary = {
    width: "100%",
    padding: 12,
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: 6,
    marginTop: 10,
    cursor: "pointer",
    fontSize: 16
};
