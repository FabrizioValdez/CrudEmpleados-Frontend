import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://localhost:7256/api";

const App = () => {
  const [empleados, setEmpleados] = useState([]);
  const [nuevoEmpleado, setNuevoEmpleado] = useState({ nombre: "", apellido: "", sueldo: "" });
  const [login, setLogin] = useState({ username: "", password: "" });
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isAuth, setIsAuth] = useState(!!token);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const axiosAuth = axios.create({
    baseURL: API,
    headers: { Authorization: `Bearer ${token}` }
  });

  const showNotification = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const iniciarSesion = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const res = await axios.post(`${API}/Auth/login`, login);
    const newToken = res.data.token;
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setIsAuth(true);
    showNotification("Sesión iniciada correctamente");

    // Usar el token nuevo directamente, no axiosAuth
    const empRes = await axios.get(`${API}/Empleados`, {
      headers: { Authorization: `Bearer ${newToken}` }
    });
    setEmpleados(empRes.data);

  } catch {
    showNotification("Credenciales incorrectas", "error");
  } finally {
    setLoading(false);
  }
};

  const cerrarSesion = () => {
  localStorage.removeItem("token");
  setToken("");
  setIsAuth(false);
  setEmpleados([]);
  setLogin({ username: "", password: "" }); // 👈 esto
};

  const getEmpleados = async () => {
    setTableLoading(true);
    try {
      const res = await axiosAuth.get("/Empleados");
      setEmpleados(res.data);
    } catch {
      showNotification("No autorizado", "error");
    } finally {
      setTableLoading(false);
    }
  };

  const guardarEmpleado = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosAuth.post("/Empleados", {
        ...nuevoEmpleado,
        sueldo: parseFloat(nuevoEmpleado.sueldo),
      });
      setNuevoEmpleado({ nombre: "", apellido: "", sueldo: "" });
      showNotification("Empleado agregado exitosamente");
      getEmpleados();
    } catch {
      showNotification("Solo Admin puede crear empleados", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) getEmpleados();
  }, []);

  if (!isAuth) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'DM Sans', sans-serif; }

          .login-root {
            min-height: 100vh;
            display: flex;
            background: #0a0a0f;
            position: relative;
            overflow: hidden;
          }

          .login-bg {
            position: absolute; inset: 0;
            background:
              radial-gradient(ellipse 80% 60% at 20% 50%, rgba(99,102,241,0.15) 0%, transparent 60%),
              radial-gradient(ellipse 60% 80% at 80% 20%, rgba(236,72,153,0.1) 0%, transparent 60%),
              radial-gradient(ellipse 50% 50% at 60% 80%, rgba(16,185,129,0.08) 0%, transparent 60%);
          }

          .login-grid {
            position: absolute; inset: 0;
            background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
            background-size: 60px 60px;
          }

          .login-panel {
            margin: auto;
            width: 100%;
            max-width: 420px;
            position: relative;
            z-index: 10;
            padding: 16px;
          }

          .login-card {
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 20px;
            padding: 48px 40px;
            backdrop-filter: blur(20px);
            box-shadow: 0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08);
          }

          .login-logo {
            width: 48px; height: 48px;
            background: linear-gradient(135deg, #6366f1, #ec4899);
            border-radius: 14px;
            display: flex; align-items: center; justify-content: center;
            margin-bottom: 28px;
            font-size: 22px;
          }

          .login-title {
            font-family: 'Syne', sans-serif;
            font-size: 28px;
            font-weight: 800;
            color: #fff;
            margin-bottom: 6px;
            letter-spacing: -0.5px;
          }

          .login-sub {
            color: rgba(255,255,255,0.4);
            font-size: 14px;
            margin-bottom: 36px;
          }

          .field-label {
            display: block;
            font-size: 12px;
            font-weight: 500;
            color: rgba(255,255,255,0.5);
            text-transform: uppercase;
            letter-spacing: 0.8px;
            margin-bottom: 8px;
          }

          .field-input {
            width: 100%;
            background: rgba(255,255,255,0.06);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 10px;
            padding: 12px 16px;
            color: #fff;
            font-size: 15px;
            font-family: 'DM Sans', sans-serif;
            transition: border-color 0.2s, background 0.2s;
            outline: none;
            margin-bottom: 20px;
          }

          .field-input:focus {
            border-color: #6366f1;
            background: rgba(99,102,241,0.08);
          }

          .field-input::placeholder { color: rgba(255,255,255,0.25); }

          .btn-primary {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: #fff;
            border: none;
            border-radius: 10px;
            font-size: 15px;
            font-weight: 600;
            font-family: 'DM Sans', sans-serif;
            cursor: pointer;
            transition: opacity 0.2s, transform 0.15s;
            margin-top: 4px;
          }

          .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
          .btn-primary:active { transform: translateY(0); }
          .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

          .notif {
            position: fixed; top: 20px; right: 20px;
            padding: 14px 20px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 500;
            z-index: 9999;
            animation: slideIn 0.3s ease;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          }

          .notif.success { background: #059669; color: #fff; }
          .notif.error { background: #dc2626; color: #fff; }

          @keyframes slideIn {
            from { opacity: 0; transform: translateX(20px); }
            to { opacity: 1; transform: translateX(0); }
          }
        `}</style>

        {notification && (
          <div className={`notif ${notification.type}`}>{notification.msg}</div>
        )}

        <div className="login-root">
          <div className="login-bg" />
          <div className="login-grid" />
          <div className="login-panel">
            <div className="login-card">
              <div className="login-logo">👤</div>
              <h2 className="login-title">Bienvenido</h2>
              <p className="login-sub">Sistema de Gestión de Empleados</p>

              <form onSubmit={iniciarSesion}>
                <label className="field-label">Usuario</label>
                <input
                  type="text"
                  placeholder="Ingresa tu usuario"
                  value={login.username}
                  onChange={(e) => setLogin({ ...login, username: e.target.value })}
                  className="field-input"
                  required
                />
                <label className="field-label">Contraseña</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={login.password}
                  onChange={(e) => setLogin({ ...login, password: e.target.value })}
                  className="field-input"
                  required
                />
                <button className="btn-primary" disabled={loading}>
                  {loading ? "Ingresando..." : "Iniciar sesión →"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #f4f5f7; }

        .app-root { min-height: 100vh; background: #f0f1f5; }

        /* HEADER */
        .header {
          background: #0a0a0f;
          padding: 0 32px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky; top: 0; z-index: 100;
          box-shadow: 0 1px 0 rgba(255,255,255,0.06);
        }

        .header-left { display: flex; align-items: center; gap: 12px; }

        .header-logo {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, #6366f1, #ec4899);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
        }

        .header-title {
          font-family: 'Syne', sans-serif;
          font-size: 17px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.3px;
        }

        .header-badge {
          background: rgba(99,102,241,0.2);
          color: #818cf8;
          font-size: 11px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 20px;
          border: 1px solid rgba(99,102,241,0.3);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .btn-logout {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.7);
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
          display: flex; align-items: center; gap: 6px;
        }

        .btn-logout:hover { background: rgba(220,38,38,0.2); border-color: rgba(220,38,38,0.4); color: #f87171; }

        /* MAIN */
        .main { padding: 32px; max-width: 1100px; margin: 0 auto; }

        /* STATS */
        .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 28px; }

        .stat-card {
          background: #fff;
          border-radius: 14px;
          padding: 20px 24px;
          border: 1px solid #e8e9ef;
          display: flex; align-items: center; gap: 16px;
        }

        .stat-icon {
          width: 44px; height: 44px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }

        .stat-icon.purple { background: rgba(99,102,241,0.1); }
        .stat-icon.green { background: rgba(16,185,129,0.1); }
        .stat-icon.orange { background: rgba(245,158,11,0.1); }

        .stat-value {
          font-family: 'Syne', sans-serif;
          font-size: 26px;
          font-weight: 800;
          color: #0a0a0f;
          line-height: 1;
        }

        .stat-label {
          font-size: 12px;
          color: #9ca3af;
          margin-top: 3px;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          font-weight: 500;
        }

        /* FORM CARD */
        .form-card {
          background: #fff;
          border: 1px solid #e8e9ef;
          border-radius: 16px;
          padding: 28px;
          margin-bottom: 24px;
        }

        .card-header {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 20px;
        }

        .card-title {
          font-family: 'Syne', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #0a0a0f;
        }

        .card-dot {
          width: 8px; height: 8px;
          background: linear-gradient(135deg, #6366f1, #ec4899);
          border-radius: 50%;
        }

        .form-row { display: flex; gap: 12px; flex-wrap: wrap; }

        .form-input {
          flex: 1;
          min-width: 140px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 11px 14px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #0a0a0f;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }

        .form-input:focus { border-color: #6366f1; background: #fff; }
        .form-input::placeholder { color: #9ca3af; }

        .btn-add {
          background: #0a0a0f;
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 11px 22px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
          white-space: nowrap;
          display: flex; align-items: center; gap: 6px;
        }

        .btn-add:hover { opacity: 0.85; transform: translateY(-1px); }
        .btn-add:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

        /* TABLE */
        .table-card {
          background: #fff;
          border: 1px solid #e8e9ef;
          border-radius: 16px;
          overflow: hidden;
        }

        .table-header-row {
          padding: 20px 28px;
          border-bottom: 1px solid #f3f4f6;
          display: flex; align-items: center; justify-content: space-between;
        }

        .table-count {
          font-size: 12px;
          color: #9ca3af;
          font-weight: 500;
          background: #f3f4f6;
          padding: 4px 10px;
          border-radius: 20px;
        }

        table { width: 100%; border-collapse: collapse; }

        thead tr { background: #fafafa; }

        th {
          padding: 12px 24px;
          text-align: left;
          font-size: 11px;
          font-weight: 600;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          border-bottom: 1px solid #f3f4f6;
        }

        tbody tr {
          border-bottom: 1px solid #f9fafb;
          transition: background 0.15s;
        }

        tbody tr:last-child { border-bottom: none; }
        tbody tr:hover { background: #fafafa; }

        td {
          padding: 14px 24px;
          font-size: 14px;
          color: #374151;
        }

        .td-id {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          color: #d1d5db;
          font-size: 13px;
        }

        .td-name { font-weight: 500; color: #111827; }

        .td-sueldo {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          color: #059669;
        }

        .avatar {
          width: 32px; height: 32px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          margin-right: 10px;
          vertical-align: middle;
        }

        .empty-state {
          padding: 60px;
          text-align: center;
          color: #9ca3af;
          font-size: 14px;
        }

        .empty-state-icon { font-size: 40px; margin-bottom: 12px; }

        .notif {
          position: fixed; top: 20px; right: 20px;
          padding: 14px 20px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          z-index: 9999;
          animation: slideIn 0.3s ease;
          box-shadow: 0 8px 32px rgba(0,0,0,0.15);
        }

        .notif.success { background: #059669; color: #fff; }
        .notif.error { background: #dc2626; color: #fff; }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @media (max-width: 640px) {
          .main { padding: 16px; }
          .stats-row { grid-template-columns: 1fr; }
          .form-row { flex-direction: column; }
          .form-input { min-width: unset; }
        }
      `}</style>

      {notification && (
        <div className={`notif ${notification.type}`}>{notification.msg}</div>
      )}

      <div className="app-root">
        {/* HEADER */}
        <header className="header">
          <div className="header-left">
            <div className="header-logo">👥</div>
            <span className="header-title">Empleados</span>
            <span className="header-badge">Admin</span>
          </div>
          <button onClick={cerrarSesion} className="btn-logout">
            <span>⎋</span> Cerrar sesión
          </button>
        </header>

        <main className="main">
          {/* STATS */}
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-icon purple">👥</div>
              <div>
                <div className="stat-value">{empleados.length}</div>
                <div className="stat-label">Total empleados</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green">💰</div>
              <div>
                <div className="stat-value">
                  S/. {empleados.reduce((a, e) => a + (e.sueldo || 0), 0).toLocaleString()}
                </div>
                <div className="stat-label">Planilla total</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon orange">📊</div>
              <div>
                <div className="stat-value">
                  S/. {empleados.length ? Math.round(empleados.reduce((a, e) => a + (e.sueldo || 0), 0) / empleados.length).toLocaleString() : 0}
                </div>
                <div className="stat-label">Sueldo promedio</div>
              </div>
            </div>
          </div>

          {/* FORM */}
          <div className="form-card">
            <div className="card-header">
              <div className="card-dot" />
              <span className="card-title">Nuevo empleado</span>
            </div>
            <form onSubmit={guardarEmpleado}>
              <div className="form-row">
                <input
                  placeholder="Nombre"
                  value={nuevoEmpleado.nombre}
                  onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, nombre: e.target.value })}
                  className="form-input"
                  required
                />
                <input
                  placeholder="Apellido"
                  value={nuevoEmpleado.apellido}
                  onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, apellido: e.target.value })}
                  className="form-input"
                  required
                />
                <input
                  placeholder="Sueldo"
                  type="number"
                  value={nuevoEmpleado.sueldo}
                  onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, sueldo: e.target.value })}
                  className="form-input"
                  required
                />
                <button type="submit" className="btn-add" disabled={loading}>
                  {loading ? "Guardando..." : "＋ Agregar"}
                </button>
              </div>
            </form>
          </div>

          {/* TABLE */}
          <div className="table-card">
            <div className="table-header-row">
              <div className="card-header" style={{ margin: 0 }}>
                <div className="card-dot" />
                <span className="card-title">Lista de empleados</span>
              </div>
              <span className="table-count">{empleados.length} registros</span>
            </div>

            {tableLoading ? (
              <div className="empty-state">
                <div className="empty-state-icon">⏳</div>
                Cargando empleados...
              </div>
            ) : empleados.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">👤</div>
                No hay empleados registrados aún
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Empleado</th>
                    <th>Apellido</th>
                    <th>Sueldo</th>
                  </tr>
                </thead>
                <tbody>
                  {empleados.map((emp) => (
                    <tr key={emp.idEmpleado}>
                      <td className="td-id">#{emp.idEmpleado}</td>
                      <td>
                        <span className="avatar">
                          {emp.nombre?.charAt(0).toUpperCase()}
                        </span>
                        <span className="td-name">{emp.nombre}</span>
                      </td>
                      <td>{emp.apellido}</td>
                      <td className="td-sueldo">S/. {emp.sueldo?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default App;