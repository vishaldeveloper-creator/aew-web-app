import React, { useEffect, useState } from 'react';
import { url } from '../../Baseurl';
import './AssignAsset.css';   // <-- Import CSS file
export default function AssignAsset() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedUserInfo, setSelectedUserInfo] = useState(null);
  const [userLocation, setUserLocation] = useState('');
  const [selectedAssets, setSelectedAssets] = useState({});
  const [assetImages, setAssetImages] = useState({});
  const [previewImages, setPreviewImages] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const assetTypes = ['Laptop', 'Charger', 'Mouse', 'Chair', 'Bag', 'Solarkit', 'Mobile', 'Tablet', 'Bike'];
  const locations = ['Delhi', 'Haryana', 'Punjab', 'Rajasthan', 'Uttarakhand', 'Assam', 'Manipur', 'Mizoram', 'Bengal', 'Karnataka', 'Mumbai', 'Pune', 'Odisha', 'Bihar', 'Uttar Pradesh', 'Jharkhand', 'Madhya Pradesh', 'Himachal Pradesh', 'Jammu Kashmir', 'Ladakh'];

  useEffect(() => {
    userDepartment();
  }, []);

  const userDepartment = async () => {
    const role = localStorage.getItem("role");
    const managerId = localStorage.getItem("managerId");

    const res = await fetch(`${url}/employee?role=${role}&managerId=${managerId}`);
    const result = await res.json();
    setUsers(result || []);
  };

  const handleUserSelect = (id) => {
    setSelectedUser(id);
    const info = users.find(u => u._id === id);
    setSelectedUserInfo(info);
  };

  const handleImage = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.src = ev.target.result;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = 100 / img.width;
        canvas.width = 100;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        let quality = 0.9;
        let data = '';

        do {
          data = canvas.toDataURL('image/jpeg', quality);
          quality -= 0.05;
        } while (data.length > 40 * 1024 && quality > 0.1);

        setAssetImages(prev => ({ ...prev, [type]: data }));
        setPreviewImages(prev => ({ ...prev, [type]: data }));
      };
    };
    reader.readAsDataURL(file);
  };

  const add = a => setSelectedAssets(p => ({ ...p, [a]: (p[a] || 0) + 1 }));
  const remove = a => setSelectedAssets(p => {
    if (!p[a]) return p;
    if (p[a] === 1) { const copy = { ...p }; delete copy[a]; return copy; }
    return { ...p, [a]: p[a] - 1 };
  });
//current  handlesubmit
  // const handleAssign = async () => {
  //   if (!selectedUser || !userLocation || !Object.keys(selectedAssets).length)
  //     return setError("Please select user, location and assets.");

  //   const emp = selectedUserInfo;

  //   const payload = {
  //     employeeName: emp.name,
  //     employeescode: emp.employeescode,
  //     employeeId: emp._id,
  //     department: emp.department,
  //     email: emp.email,
  //     Location: userLocation,
  //     assignedAt: new Date(),
  //     assetImages: {}
  //   };

  //   Object.entries(selectedAssets).forEach(([type, qty]) => {
  //     payload[type] = "Assigned";
  //     payload[type + "_quantity"] = qty;
  //     if (assetImages[type]) payload.assetImages[type] = assetImages[type];
  //   });

  //   try {
  //     setLoading(true);
  //     const res = await fetch(`${url}/assign-assets`, {
  //       method: "POST",
  //       headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem("U_Token")}` },
  //       body: JSON.stringify(payload)
  //     });

  //     const data = await res.json();
  //     if (!res.ok) throw new Error(data.error);

  //     alert("Asset assigned successfully!");

  //     setSelectedAssets({});
  //     setPreviewImages({});
  //     setSelectedUser('');
  //     setSelectedUserInfo(null);
  //     setUserLocation('');
  //   } catch (e) {
  //     setError(e.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const handleAssign = async () => {
    if (!selectedUser || !userLocation || !Object.keys(selectedAssets).length) {
      return setError('Please select user, location, and assets.');
    }
    const emp = users.find(u => u._id === selectedUser);
    const payload = {
      employeeName: emp.name,
      employeescode: emp._id,
      employeeId: emp._id,
      Location: userLocation,
      assignedAt: new Date().toISOString(),
      assetImages: {}
    };
    Object.entries(selectedAssets).forEach(([type, qty]) => {
      payload[type] = 'Assigned';
      payload[`${type}_quantity`] = qty;
      if (assetImages[type]) payload.assetImages[type] = assetImages[type];
    });

    try {
      setLoading(true);
      const res = await fetch(`${url}/assign-assets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem("U_Token")}` },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Assignment failed');
      alert(result.message);
      setSelectedUser(''); setUserLocation('');
      setSelectedAssets({}); setAssetImages({}); setPreviewImages({});
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="assign-container">

      <h2 className="title">Assign Assets</h2>

      {/* USER INFO CARD */}
      {selectedUserInfo && (
        <div className="user-info-card">
          <h3>Employee Details</h3>
          <p><strong>Name:</strong> {selectedUserInfo.name}</p>
          <p><strong>Employee Code:</strong> {selectedUserInfo.employeescode}</p>
          <p><strong>Email:</strong> {selectedUserInfo.email}</p>
          <p><strong>Department:</strong> {selectedUserInfo.department}</p>
        </div>
      )}

      <div className="form-grid">
        {/* Location */}
        <div className="form-group">
          <label>Location*</label>
          <select value={userLocation} onChange={e => setUserLocation(e.target.value)}>
            <option value="">Select Location</option>
            {locations.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        {/* User */}
        <div className="form-group">
          <label>Select Employee*</label>
          <select value={selectedUser} onChange={e => handleUserSelect(e.target.value)}>
            <option value="">Select User</option>
            {users.map(u => (
              <option key={u._id} value={u._id}>{u.name}</option>
            ))}
          </select>
        </div>
      </div>

      <h3 className="section-title">Assets</h3>

      <div className="asset-grid">
        {assetTypes.map(asset => (
          <div className={`asset-card ${selectedAssets[asset] ? "active" : ""}`} key={asset}>
            <div className="asset-header">
              <strong>{asset}</strong>
              <div className="qty-btns">
                <button onClick={() => remove(asset)} disabled={!selectedAssets[asset]}>−</button>
                <span>{selectedAssets[asset] || 0}</span>
                <button onClick={() => add(asset)}>+</button>
              </div>
            </div>

            {selectedAssets[asset] > 0 && (
              <>
                <input type="file" accept="image/*" onChange={e => handleImage(e, asset)} />
                {previewImages[asset] && (
                  <img src={previewImages[asset]} alt={asset} className="preview-img" />
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {error && <p className="error">{error}</p>}

      <button className="assign-btn" onClick={handleAssign} disabled={loading}>
        {loading ? "Assigning..." : "Assign Asset"}
      </button>
    </div>
  );
}
