import React, { useEffect, useState } from 'react';
import { url } from '../../Baseurl';


export default function AssignAsset() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [selectedAssets, setSelectedAssets] = useState({});
  const [assetImages, setAssetImages] = useState({});
  const [previewImages, setPreviewImages] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const assetTypes = ['Laptop', 'Charger', 'Mouse', 'Chair', 'Bag', 'Solarkit', 'Mobile', 'Tablet', 'Bike'];
  const locations = ['Delhi', 'Haryana', 'Punjab', 'Rajasthan', 'Uttarakhand', 'Assam', 'Manipur', 'Mizoram', 'Bengal', 'Karnataka', 'Mumbai', 'Pune', 'Odisha', 'Bihar', 'Uttar Pradesh', 'Jharkhand', 'Madhya Pradesh', 'Himachal Pradesh', 'Jammu Kashmir', 'Ladakh'];


  useEffect(() => {
    // (async () => {
    //   const res = await fetch(`${url}users`, { headers: { Authorization: `Bearer ${localStorage.getItem("U_Token")}` } });
    //   const data = await res.json();
    //   if (res.ok) setUsers(data.filter(u => u.role !== 'admin'));
    // })();
    userdeparment();
  }, []);


  const userdeparment = async () => {
    // const userCode = localStorage.getItem("userCode");
    const username = localStorage.getItem("role");
    const managerId = localStorage.getItem("managerId");
    // const token = localStorage.getItem("U_Token");
    const res = await fetch(`${url}/employee?role=${username}&managerId=${managerId}`);
    const result = await res.json()
    console.log(result)
    setUsers(result)
  }

  // useEffect(() => {
  //   axios.get(`${url}api/users/my-team`, { headers: { Authorization: `Bearer ${localStorage.getItem("U_Token")}` } }).then(res => { console.log(res.data); setUsers(res.data) });
  // }, []);


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
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        let quality = 0.9, data = '';
        do { data = canvas.toDataURL('image/jpeg', quality); quality -= 0.05; }
        while (data.length > 40 * 1024 && quality > 0.1);
        setAssetImages(prev => ({ ...prev, [type]: data }));
        setPreviewImages(prev => ({ ...prev, [type]: data }));
      };
    };
    reader.readAsDataURL(file);
  };

  const incrementAsset = asset => setSelectedAssets(prev => ({ ...prev, [asset]: (prev[asset] || 0) + 1 }));
  const decrementAsset = asset => setSelectedAssets(prev => {
    const cur = prev[asset] || 0;
    if (cur <= 1) { const u = { ...prev }; delete u[asset]; return u; }
    return { ...prev, [asset]: cur - 1 };
  });

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
    <div className="container" style={{ maxWidth: '850px', margin: 'auto' }}>
      <h2>Assign Assets</h2>
      {/* Location + User selectors */}
      <div>
        <label>Location*</label>
        <select value={userLocation} onChange={e => setUserLocation(e.target.value)}>
          <option value="">Select</option>
          {locations.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>
      <div>
        <label>User*</label>
        <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
          <option value="">Select</option>
          {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
        </select>
      </div>

      {/* Assets UI */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '16px' }}>
        {assetTypes.map(asset => (
          <div key={asset} style={{ flex: '1 1 calc(50% - 20px)', border: '1px solid #ccc', padding: '12px', borderRadius: '8px', background: selectedAssets[asset] ? '#e6ffed' : '#f9f9f9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>{asset}</strong>
              <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                <button onClick={() => decrementAsset(asset)} disabled={!selectedAssets[asset]} style={btnStyle}>−</button>
                <span>{selectedAssets[asset] || 0}</span>
                <button onClick={() => incrementAsset(asset)} style={btnStyle}>+</button>
              </div>
            </div>
            {selectedAssets[asset] > 0 && (
              <div style={{ marginTop: '10px' }}>
                <input type="file" accept="image/*" onChange={e => handleImage(e, asset)} style={{ width: '100%' }} />
                {previewImages[asset] && <img src={previewImages[asset]} alt={asset} style={{ maxWidth: '100%', marginTop: 10, borderRadius: 6 }} />}
              </div>
            )}
          </div>
        ))}
      </div>

      {error && <div style={{ color: 'red', marginTop: '12px' }}>{error}</div>}
      <button onClick={handleAssign} disabled={loading} style={{
        marginTop: 25, padding: '12px 24px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: '16px'
      }}>
        {loading ? 'Assigning...' : 'Assign Assets'}
      </button>
    </div>
  );
}

const btnStyle = { width: 30, height: 30, borderRadius: '50%', border: 'none', backgroundColor: '#4CAF50', color: 'white', fontSize: 18, cursor: 'pointer' };
