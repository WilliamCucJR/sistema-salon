import { useState } from "react";
import { Sidenav, Nav, Sidebar, Container, Content, IconButton } from "rsuite";
import { Link, Routes, Route } from "react-router-dom";
import DashboardIcon from "@rsuite/icons/legacy/Dashboard";
import MagicIcon from "@rsuite/icons/legacy/Magic";
import ExitIcon from "@rsuite/icons/Exit";
import PeoplesIcon from "@rsuite/icons/Peoples";
import PeoplesMapIcon from "@rsuite/icons/PeoplesMap";
import CalendarIcon from "@rsuite/icons/Calendar";
import FileDownloadIcon from '@rsuite/icons/FileDownload';
import EditIcon from '@rsuite/icons/Edit';
import AdminIcon from "@rsuite/icons/Admin";
import TagIcon from "@rsuite/icons/Tag";
import GrowthIcon from '@rsuite/icons/Growth';
import Home from "../Home/";
import User from "../User/";
import Supplier from "../Supplier";
import Employee from "../Employee";
import Service from "../Service";
import Product from "../Product";
import Customer from "../Customer";
import Store from "../Store";
import Payment from "../Payment";
import Appointment from "../Appointment";
import Reports from "../Reports/Reports";
import userIcon from "../../assets/user-icon.png";
import logoSistema from "../../assets/logo-sistema.png";
import "./SideMenu.css";

export default function SideMenu() {
  const [expanded, setExpanded] = useState(true);

  const toggleSidebar = () => setExpanded(!expanded);
  
  const closeSession = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        style={{ display: "flex", flexDirection: "column", height: "100vh" }}
        width={expanded ? 240 : 56}
        collapsible
      >
        <Sidenav
          expanded={expanded}
          defaultOpenKeys={["3", "4"]}
          style={{ flex: 1, backgroundColor: "#9eb5b0" }}
        >
          <Sidenav.Header>
            <div style={{ padding: 18, textAlign: "center" }}>
              <IconButton
                icon={<i className="rs-icon rs-icon-bars" />}
                onClick={toggleSidebar}
                appearance="subtle"
                style={{ marginBottom: 10 }}
              />
              {expanded && (
                <div>
                  <img
                    src={userIcon}
                    alt="User Icon"
                    style={{ width: 50, borderRadius: "50%" }}
                  />
                  <p
                    style={{
                      color: "#000",
                      marginTop: "10px",
                      fontSize: "18px",
                    }}
                  >
                    Administrador
                  </p>
                </div>
              )}
            </div>
          </Sidenav.Header>
          <div style={{ height: "550px", overflowY: "auto" }}>
            <Sidenav.Body>
              <Nav>
                <Nav.Item
                  as={Link}
                  to="/"
                  eventKey="1"
                  icon={<DashboardIcon />}
                  style={{ backgroundColor: "#9eb5b0" }}
                >
                  Inicio
                </Nav.Item>
                <Nav.Item
                  as={Link}
                  to="/reports"
                  eventKey="2"
                  icon={<FileDownloadIcon />}
                  style={{ backgroundColor: "#9eb5b0" }}
                >
                  Reportes
                </Nav.Item>
                <Nav.Item
                  as={Link}
                  to="/appointment"
                  eventKey="3"
                  icon={<CalendarIcon />}
                  style={{ backgroundColor: "#9eb5b0" }}
                >
                  Citas
                </Nav.Item>
                <Nav.Item
                  as={Link}
                  to="/store"
                  eventKey="4"
                  icon={<GrowthIcon />}
                  style={{ backgroundColor: "#9eb5b0" }}
                >
                  Tienda
                </Nav.Item>
                <Nav.Menu 
                  eventKey="5" 
                  title="Mantenimiento" 
                  icon={<EditIcon />}
                  className="sidenav-container"
                  style={{ backgroundColor: "#9eb5b0" }}
                >
                  <Nav.Item
                    as={Link}
                    to="/customers"
                    eventKey="5-0"
                    icon={<PeoplesIcon />}
                    style={{ backgroundColor: "#9eb5b0", display: 'flex', gap: '10px'}}
                  >
                    Clientes
                  </Nav.Item>
                  <Nav.Item
                    as={Link}
                    to="/services"
                    eventKey="5-1"
                    icon={<MagicIcon />}
                    style={{ backgroundColor: "#9eb5b0", display: 'flex', gap: '10px'}}
                  >
                    Servicios
                  </Nav.Item>
                  <Nav.Item
                    as={Link}
                    to="/suppliers"
                    eventKey="5-2"
                    icon={<AdminIcon />}
                    style={{ backgroundColor: "#9eb5b0", display: 'flex', gap: '10px'}}
                  >
                    Proveedores
                  </Nav.Item>
                  <Nav.Item
                    as={Link}
                    to="/products"
                    eventKey="5-3"
                    icon={<TagIcon />}
                    style={{ backgroundColor: "#9eb5b0", display: 'flex', gap: '10px'}}
                  >
                    Productos
                  </Nav.Item>
                  <Nav.Item
                    as={Link}
                    to="/employees"
                    eventKey="5-4"
                    icon={<PeoplesMapIcon />}
                    style={{ backgroundColor: "#9eb5b0", display: 'flex', gap: '10px'}}
                  >
                    Empleados
                  </Nav.Item>
                </Nav.Menu>
                <Nav.Item
                  as={Link}
                  to="/"
                  eventKey="10"
                  icon={<ExitIcon />}
                  style={{ 
                    backgroundColor: "#9eb5b0"}}
                  onClick={closeSession}
                >
                    Salir
                </Nav.Item>
              </Nav>
            </Sidenav.Body>
          </div>
        </Sidenav>
        <div
          style={{
            textAlign: "center",
            padding: "10px",
            marginTop: "auto",
            backgroundColor: "#9eb5b0",
          }}
        >
          <img src={logoSistema} alt="Logo Sistema" style={{ width: 150 }} />
        </div>
      </Sidebar>
      <Container>
        <Content style={{ padding: "20px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<User />} />
            <Route
              path="/suppliers"
              element={<Supplier isSidebarVisible={expanded} />}
            />
            <Route
              path="/employees"
              element={<Employee isSidebarVisible={expanded} />}
            />
            <Route
              path="/services"
              element={<Service isSidebarVisible={expanded} />}
            />
            <Route
              path="/products"
              element={<Product isSidebarVisible={expanded} />}
            />
            <Route
              path="/customers"
              element={<Customer isSidebarVisible={expanded} />}
            />
            <Route 
              path="/store" 
              element={<Store isSidebarVisible={expanded} />} 
            />
            <Route 
              path="/payment" 
              element={<Payment isSidebarVisible={expanded} />}
            />
            <Route 
              path="/appointment" 
              element={<Appointment isSidebarVisible={expanded} />}
            />
            <Route 
              path="/reports" 
              element={<Reports isSidebarVisible={expanded} />}
            />
          </Routes>
        </Content>
      </Container>
    </div>
  );
}
