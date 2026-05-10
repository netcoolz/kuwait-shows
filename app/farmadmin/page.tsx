"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Plus, Trash2, Edit2, LogOut, 
  ShieldAlert, Building, Key, User, Eye, EyeOff, Save, X
} from "lucide-react";

export default function FarmAdminPage() {
  // ─── AUTH STATE ─────────────────────────────────────────────────────────────
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");

  // ─── DATA STATE ─────────────────────────────────────────────────────────────
  const [farms, setFarms] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // ─── MODAL & FORM STATE ─────────────────────────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState<any>(null); // null = Create, object = Edit
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    farm_name: "",
    username: "",
    password: ""
  });

  // ─── AUTH LOGIC ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const auth = sessionStorage.getItem("super_admin_auth");
    if (auth === "true") setIsAuthenticated(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUser === "admin" && loginPass === "ZAQzaq12!@") {
      sessionStorage.setItem("super_admin_auth", "true");
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Invalid username or password");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("super_admin_auth");
    setIsAuthenticated(false);
    setLoginUser("");
    setLoginPass("");
  };

  // ─── DATA LOGIC ─────────────────────────────────────────────────────────────
  async function loadFarms() {
    setLoading(true);
    const { data, error } = await supabase
      .from("farms")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setFarms(data);
    if (error) console.error(error);
    setLoading(false);
  }

  useEffect(() => {
    if (isAuthenticated) loadFarms();
  }, [isAuthenticated]);

  const filteredFarms = useMemo(() => {
    return farms.filter(f => 
      f.farm_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      f.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [farms, searchQuery]);

  // ─── CRUD OPERATIONS ────────────────────────────────────────────────────────
  const openCreateModal = () => {
    setEditingFarm(null);
    setFormData({ farm_name: "", username: "", password: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (farm: any) => {
    setEditingFarm(farm);
    setFormData({ farm_name: farm.farm_name, username: farm.username, password: farm.password });
    setIsModalOpen(true);
  };

  const saveFarm = async () => {
    if (!formData.farm_name || !formData.username || !formData.password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    if (editingFarm) {
      // 📝 UPDATE
      const { error } = await supabase
        .from("farms")
        .update({
          farm_name: formData.farm_name,
          username: formData.username,
          password: formData.password
        })
        .eq("id", editingFarm.id);

      if (error) alert(error.message);
      else setIsModalOpen(false);

    } else {
      // ➕ CREATE
      const { error } = await supabase
        .from("farms")
        .insert([{
          farm_name: formData.farm_name,
          username: formData.username,
          password: formData.password
        }]);

      if (error) alert(error.message);
      else setIsModalOpen(false);
    }

    loadFarms();
  };

  const deleteFarm = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) return;
    
    setLoading(true);
    const { error } = await supabase.from("farms").delete().eq("id", id);
    if (error) alert(error.message);
    loadFarms();
  };


  // ─── RENDER LOGIN SCREEN ────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: "100vh", background: "#06071A", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,169,110,0.2)", padding: "40px", borderRadius: "24px", width: "100%", maxWidth: "400px", backdropFilter: "blur(20px)" }}>
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <div style={{ width: "60px", height: "60px", background: "rgba(201,169,110,0.1)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 15px", border: "1px solid rgba(201,169,110,0.3)" }}>
              <ShieldAlert style={{ color: "#C9A96E" }} size={30} />
            </div>
            <h1 style={{ color: "white", fontSize: "24px", fontWeight: "900" }}>Super Admin</h1>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>System Management Portal</p>
          </div>
          
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "15px" }}>
              <input type="text" placeholder="Admin Username" value={loginUser} onChange={e => setLoginUser(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <input type="password" placeholder="Admin Password" value={loginPass} onChange={e => setLoginPass(e.target.value)} style={inputStyle} />
            </div>
            {loginError && <p style={{ color: "#ef4444", fontSize: "13px", marginBottom: "15px", textAlign: "center", fontWeight: "bold" }}>{loginError}</p>}
            <button type="submit" style={primaryBtnStyle}>Login to System</button>
          </form>
        </motion.div>
      </div>
    );
  }

  // ─── RENDER ADMIN DASHBOARD ─────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#06071A", color: "white", padding: "40px 20px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* HEADER */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <h1 style={{ fontSize: "36px", fontWeight: "900", background: "linear-gradient(90deg, #fff, #C9A96E)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Farms Management
            </h1>
            <p style={{ color: "rgba(255,255,255,0.5)" }}>Manage registered farms and ministries access.</p>
          </div>
          <button onClick={handleLogout} style={{ ...actionBtnStyle, background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
            <LogOut size={18} /> Logout
          </button>
        </header>

        {/* TOOLBAR */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "15px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px", flex: 1, minWidth: "300px" }}>
            <div style={{ position: "relative", flex: 1, maxWidth: "400px" }}>
              <Search style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} size={18} />
              <input 
                type="text" 
                placeholder="Search farms or usernames..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ ...inputStyle, paddingLeft: "45px", marginBottom: 0 }} 
              />
            </div>
            <div style={{ background: "rgba(201,169,110,0.1)", color: "#C9A96E", padding: "10px 20px", borderRadius: "14px", fontWeight: "bold", border: "1px solid rgba(201,169,110,0.2)", display: "flex", alignItems: "center", gap: "8px" }}>
              <Building size={18} /> Total: {farms.length}
            </div>
          </div>
          <button onClick={openCreateModal} style={{ ...primaryBtnStyle, width: "auto", display: "flex", alignItems: "center", gap: "8px", padding: "12px 24px" }}>
            <Plus size={20} /> Add New Farm
          </button>
        </div>

        {/* DATA GRID */}
        {loading && farms.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px", color: "rgba(255,255,255,0.5)" }}>Loading data...</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "20px" }}>
            <AnimatePresence>
              {filteredFarms.map((farm) => (
                <motion.div 
                  key={farm.id}
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px", padding: "24px", display: "flex", flexDirection: "column" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                    <div>
                      <h3 style={{ fontSize: "20px", fontWeight: "900", marginBottom: "4px" }}>{farm.farm_name}</h3>
                      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>
                        Created: {new Date(farm.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div style={{ width: "40px", height: "40px", background: "rgba(255,255,255,0.05)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Building size={20} style={{ color: "rgba(255,255,255,0.3)" }} />
                    </div>
                  </div>

                  <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: "16px", padding: "15px", marginBottom: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", color: "rgba(255,255,255,0.7)" }}>
                      <User size={16} style={{ color: "#C9A96E" }} />
                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>{farm.username}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "rgba(255,255,255,0.7)" }}>
                      <Key size={16} style={{ color: "#C9A96E" }} />
                      <span style={{ fontSize: "14px", fontFamily: "monospace" }}>••••••••</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "10px", marginTop: "auto" }}>
                    <button onClick={() => openEditModal(farm)} style={{ ...actionBtnStyle, flex: 1 }}>
                      <Edit2 size={16} /> Edit
                    </button>
                    <button onClick={() => deleteFarm(farm.id, farm.farm_name)} style={{ ...actionBtnStyle, background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {filteredFarms.length === 0 && !loading && (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px", color: "rgba(255,255,255,0.4)" }}>
                No farms found matching "{searchQuery}"
              </div>
            )}
          </div>
        )}

      </div>

      {/* ─── ADD/EDIT MODAL ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              style={{ background: "#0B0C20", border: "1px solid rgba(201,169,110,0.3)", borderRadius: "24px", padding: "30px", width: "100%", maxWidth: "500px", position: "relative" }}
            >
              <button onClick={() => setIsModalOpen(false)} style={{ position: "absolute", top: "20px", right: "20px", background: "transparent", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer" }}>
                <X size={24} />
              </button>
              
              <h2 style={{ fontSize: "24px", fontWeight: "900", marginBottom: "25px", color: "#C9A96E" }}>
                {editingFarm ? "Edit Farm" : "Add New Farm"}
              </h2>

              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>Farm / Ministry Name</label>
                <input 
                  type="text" 
                  value={formData.farm_name} 
                  onChange={e => setFormData({...formData, farm_name: e.target.value})} 
                  style={inputStyle} 
                  placeholder="e.g. Al Shaqab Stud"
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>Admin Username</label>
                <input 
                  type="text" 
                  value={formData.username} 
                  onChange={e => setFormData({...formData, username: e.target.value})} 
                  style={inputStyle} 
                  placeholder="e.g. shaqab_admin"
                />
              </div>

              <div style={{ marginBottom: "30px", position: "relative" }}>
                <label style={labelStyle}>Password</label>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={formData.password} 
                  onChange={e => setFormData({...formData, password: e.target.value})} 
                  style={{...inputStyle, paddingRight: "45px"}} 
                  placeholder="Enter secure password"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "15px", top: "38px", background: "transparent", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer" }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button onClick={saveFarm} disabled={loading} style={{ ...primaryBtnStyle, display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", opacity: loading ? 0.7 : 1 }}>
                {loading ? "Saving..." : <><Save size={20} /> {editingFarm ? "Update Data" : "Create Farm"}</>}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// ─── SHARED STYLES ────────────────────────────────────────────────────────────

const inputStyle = {
  width: "100%",
  padding: "16px",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.03)",
  color: "white",
  fontSize: "15px",
  outline: "none",
  transition: "border-color 0.2s"
};

const labelStyle = {
  display: "block",
  fontSize: "12px",
  fontWeight: "bold",
  color: "rgba(255,255,255,0.5)",
  marginBottom: "8px",
  textTransform: "uppercase" as const,
  letterSpacing: "1px"
};

const primaryBtnStyle = {
  width: "100%",
  padding: "16px",
  borderRadius: "16px",
  border: "none",
  background: "#C9A96E",
  color: "#06071A",
  fontWeight: "900",
  fontSize: "16px",
  cursor: "pointer",
  transition: "transform 0.1s"
};

const actionBtnStyle = {
  padding: "10px 16px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.05)",
  color: "white",
  fontWeight: "bold",
  fontSize: "13px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  transition: "all 0.2s"
};