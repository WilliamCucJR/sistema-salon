import { useState } from 'react';
import { Sidenav, Nav, Sidebar, Container, Content, IconButton } from 'rsuite';
import { Link, Routes, Route } from 'react-router-dom';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import MagicIcon from '@rsuite/icons/legacy/Magic';
import ExitIcon from '@rsuite/icons/Exit';
import PeoplesIcon from '@rsuite/icons/Peoples';
import PeoplesMapIcon from '@rsuite/icons/PeoplesMap';
import CalendarIcon from '@rsuite/icons/Calendar';
import AdminIcon from '@rsuite/icons/Admin';
import TagIcon from '@rsuite/icons/Tag';
import Home from '../Home/';
import User from '../User/';
import Supplier from '../Supplier';
import Employee from '../Employee';
import Service from '../Service';
import Product from '../Product';
import userIcon from '../../assets/user-icon.png';
import logoSistema from '../../assets/logo-sistema.png';
import './SideMenu.css';

export default function SideMenu() {
  const [expanded, setExpanded] = useState(true);

  const toggleSidebar = () => setExpanded(!expanded);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar
        style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}
        width={expanded ? 240 : 56}
        collapsible
      >
        <Sidenav expanded={expanded} defaultOpenKeys={['3', '4']} style={{ flex: 1, backgroundColor: '#9eb5b0' }}>
          <Sidenav.Header>
            <div style={{ padding: 18, textAlign: 'center' }}>
              <IconButton
                icon={<i className="rs-icon rs-icon-bars" />}
                onClick={toggleSidebar}
                appearance="subtle"
                style={{ marginBottom: 10 }}
              />
              {expanded && (
                <div>
                  <img src={userIcon} alt="User Icon" style={{ width: 50, borderRadius: '50%' }} />
                  <p style={{ color: '#000', marginTop: '10px', fontSize: '18px' }}>Administrador</p>
                </div>
              )}
            </div>
          </Sidenav.Header>
          <Sidenav.Body>
            <Nav>
              <Nav.Item as={Link} to="/" eventKey="1" icon={<DashboardIcon />} style={{ backgroundColor: '#9eb5b0' }} >
                Inicio
              </Nav.Item>
              <Nav.Item as={Link} to="/appointments" eventKey="2" icon={<CalendarIcon />} style={{ backgroundColor: '#9eb5b0' }} >
                Citas
              </Nav.Item>
              <Nav.Item as={Link} to="/clients" eventKey="3" icon={<PeoplesIcon />} style={{ backgroundColor: '#9eb5b0' }} >
                Clientes
              </Nav.Item>
              <Nav.Item as={Link} to="/services" eventKey="4" icon={<MagicIcon />} style={{ backgroundColor: '#9eb5b0' }} >
                Servicios
              </Nav.Item>
              <Nav.Item as={Link} to="/suppliers" eventKey="5" icon={<AdminIcon />} style={{ backgroundColor: '#9eb5b0' }} >
                Proveedores
              </Nav.Item>
              <Nav.Item as={Link} to="/products" eventKey="6" icon={<TagIcon />} style={{ backgroundColor: '#9eb5b0' }} >
                Productos
              </Nav.Item>
              <Nav.Item as={Link} to="/employees" eventKey="7" icon={<PeoplesMapIcon />} style={{ backgroundColor: '#9eb5b0' }}>
                Empleados
              </Nav.Item>
              <Nav.Item as={Link} to="/employees" eventKey="8" icon={<ExitIcon />} style={{ backgroundColor: '#9eb5b0' }}>
                Salir
              </Nav.Item>
            </Nav>
          </Sidenav.Body>
        </Sidenav>
        <div style={{ textAlign: 'center', padding: '10px', marginTop: 'auto', backgroundColor: '#9eb5b0' }}>
          <img src={logoSistema} alt="Logo Sistema" style={{ width: 150 }} />
        </div>
      </Sidebar>
      <Container>
        <Content style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<User />} />
            <Route path="/suppliers" element={<Supplier isSidebarVisible={expanded} />} />
            <Route path="/employees" element={<Employee isSidebarVisible={expanded} />} />
            <Route path="/services" element={<Service isSidebarVisible={expanded} />} />
            <Route path="/products" element={<Product isSidebarVisible={expanded} />} />
          </Routes>
        </Content>
      </Container>
    </div>
  );
}