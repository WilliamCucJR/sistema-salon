import { useState } from 'react';
import { Sidebar, Menu, Icon, Segment, Button, Image } from 'semantic-ui-react';
import { Link, Routes, Route } from 'react-router-dom';
import Home from '../Home/';
import User from '../User/';
import Supplier from '../Supplier';
import userIcon from '../../assets/user-icon.png';
import logoSistema from '../../assets/logo-sistema.png';
import './SideMenu.css';
import Employee from '../Employee';
import Product from '../Product';

export default function SideMenu() {
  const [visible, setVisible] = useState(true);

  const toggleSidebar = () => setVisible(!visible);

  return (
    <div>
      <div style={{ padding: '5px', backgroundColor: '#e6e6e6', display: 'flex', alignItems: 'center' }}>
        <Button icon onClick={toggleSidebar} style={{ margin: 0, padding: '5px' }}>
          <Icon name="bars" size="large" />
        </Button>
      </div>

      <Sidebar.Pushable as={Segment} style={{ minHeight: '96vh', margin: 0, display: 'flex' }}>
        <Sidebar
          as={Menu}
          animation="push"
          inverted
          vertical
          visible={visible}
          className="sidemenu-style"
          style={{
            backgroundColor: '#9eb5b0',
            width: '225px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <Menu.Item>
              <div style={{ textAlign: 'center', padding: '10px' }}>
                <Image src={userIcon} size="small" circular centered />
                <p style={{ color: '#000', marginTop: '10px', fontSize: '18px' }}>Administrador</p>
              </div>
            </Menu.Item>
            <Menu.Item as={Link} to="/" style={{ color: '#000', fontSize: 20 }}>
              <Icon name="home" />
              Inicio
            </Menu.Item>
            <Menu.Item as={Link} to="/appointments" style={{ color: '#000', fontSize: 20 }}>
              <Icon name="calendar" />
              Citas
            </Menu.Item>
            <Menu.Item as={Link} to="/clients" style={{ color: '#000', fontSize: 20 }}>
              <Icon name="user" />
              Clientes
            </Menu.Item>
            <Menu.Item as={Link} to="/services" style={{ color: '#000', fontSize: 20 }}>
              <Icon name="shopping bag" />
              Servicios
            </Menu.Item>
            <Menu.Item as={Link} to="/users" style={{ color: '#000', fontSize: 20 }}>
              <Icon name="users" />
              Usuarios
            </Menu.Item>
            <Menu.Item as={Link} to="/suppliers" style={{ color: '#000', fontSize: 20 }}>
              <Icon name="truck" />
              Proveedores
            </Menu.Item>
            <Menu.Item as={Link} to="/employees" style={{ color: '#000', fontSize: 20 }}>
              <Icon name="users" />
              Empleados
            </Menu.Item>
            {/* <Menu.Item as={Link} to="/products" style={{ color: '#000', fontSize: 20 }}>
              <Icon name="users" />
              Productos
            </Menu.Item> */}
            <Menu.Item as="a" style={{ color: '#000', fontSize: 20 }}>
              <Icon name="sign-out" />
              Salir
            </Menu.Item>
          </div>
          <Menu.Item className="bottom-image-container">
            <div style={{ textAlign: 'center', padding: '10px' }}>
              <Image src={logoSistema} size="small" centered />
            </div>
          </Menu.Item>
        </Sidebar>

        <Sidebar.Pusher style={{ padding: '20px', flex: 1 }}>
          <Segment basic>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/users" element={<User />} />
              <Route path="/suppliers" element={<Supplier isSidebarVisible={visible}/>} />
              <Route path="/employees" element={<Employee isSidebarVisible={visible}/>} />
              <Route path="/products" element={<Product isSidebarVisible={visible}/>} />
            </Routes>
          </Segment>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </div>
  );
}