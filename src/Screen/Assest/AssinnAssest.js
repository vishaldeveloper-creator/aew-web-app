import React, { useEffect, useState } from 'react';
import { url } from '../../Baseurl';
import '../../Css/AssetAcknowledgment.css';

const AssetAcknowledgment = () => {
  const [assets, setAssets] = useState([]);
  const [acknowledged, setAcknowledged] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("U_Token");

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${url}/show-assign-assets`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const result = await res.json();
        console.log("======>>>>assest--->>>>", result)

        if (!Array.isArray(result)) throw new Error("Invalid asset data");

        const filteredAssets = role === "employee"
          ? result.filter(asset => asset.userId === userId || asset.userId?._id === userId)
          : result;

        const ackStatus = {};
        filteredAssets.forEach(emp => {
          ackStatus[emp._id] = {};
          emp.assets?.forEach(asset => {
            ackStatus[emp._id][asset.name] = asset.status === "Acknowledged";
          });
        });

        setAssets(filteredAssets);
        setAcknowledged(ackStatus);
      } catch (err) {
        console.error("Fetch error", err);
        setError("Failed to load asset data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, [role, token, userId]);

  const handleCheckboxChange = (empId, assetName) => {
    setAcknowledged(prev => ({
      ...prev,
      [empId]: {
        ...prev[empId],
        [assetName]: !prev[empId][assetName]
      }
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const payload = assets.map(emp => {
        const statusUpdates = {};
        emp.assets.forEach(asset => {
          statusUpdates[asset.name] = {
            status: acknowledged[emp._id][asset.name] ? "Acknowledged" : "Not Acknowledged"
          };
        });

        return {
          employeeId: emp._id,
          acknowledgedAt: new Date().toISOString(),
          ...statusUpdates
        };
      });

      const res = await fetch(`${url}/acknowledge-assets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result?.error || "Submission failed");

      alert("✅ Acknowledgment submitted successfully");
    } catch (err) {
      console.error(err);
      setError("❌ Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  const totalAssets = () => {
    const counts = {};
    assets.forEach(emp => {
      emp.assets?.forEach(asset => {
        counts[asset.name] = (counts[asset.name] || 0) + (asset.quantity || 0);
      });
    });
    return counts;
  };

  const totals = totalAssets();
  const grandTotal = Object.values(totals).reduce((sum, qty) => sum + qty, 0);

  return (
    <div className="asset-container">
      <h2 className="asset-title">🧾 Asset Acknowledgment</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="asset-error">{error}</p>}
      {!loading && assets.length === 0 && <p>No assets found.</p>}

      {assets.length > 0 && (
        <>
          <div className="asset-summary">
            <strong>Grand Total: {grandTotal}</strong>
            <ul className="asset-total-list">
              {Object.entries(totals).map(([name, qty]) => (
                <li key={name}>{name}: {qty}</li>
              ))}
            </ul>
          </div>

          {assets.map(emp => (
            <div key={emp._id} className="asset-card">
              <h3>{emp.employeeName} — {emp.Location}</h3>
              <ul className="asset-list">
                {emp.assets.map(asset => (
                  <li key={asset._id} className="asset-list-item">
                    <div className="asset-label-status">
                      <span>{asset.name} ({asset.quantity})</span>
                      <span>{acknowledged[emp._id][asset.name] ? '✅' : '❌'}</span>
                    </div>

                    {asset.image && (
                      <img
                        src={asset.image}
                        alt={asset.name}
                        className="asset-thumb"
                      />
                    )}

                    {role === "employee" && (
                      <input
                        type="checkbox"
                        checked={acknowledged[emp._id][asset.name]}
                        onChange={() => handleCheckboxChange(emp._id, asset.name)}
                      />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {role === "employee" && (
            <button
              onClick={handleSubmit}
              className="asset-submit-btn"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Acknowledgment"}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default AssetAcknowledgment;
