import { useState } from 'react';
import { Sidebar, Menu, Icon, Segment, Button, Image } from 'semantic-ui-react';
import userIcon from '../../assets/user-icon.png';
import logoSistema from '../../assets/logo-sistema.png';
import './SideMenu.css';

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

      <Sidebar.Pushable as={Segment} style={{ minHeight: '96vh', margin: 0 }}>
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
            <Menu.Item as="a" style={{ color: '#000', fontSize: 20 }}>
              <Icon name="home" />
              Inicio
            </Menu.Item>
            <Menu.Item as="a" style={{ color: '#000', fontSize: 20 }}>
              <Icon name="calendar" />
              Citas
            </Menu.Item>
            <Menu.Item as="a" style={{ color: '#000', fontSize: 20 }}>
              <Icon name="user" />
              Clientes
            </Menu.Item>
            <Menu.Item as="a" style={{ color: '#000', fontSize: 20 }}>
              <Icon name="shopping bag" />
              Servicios
            </Menu.Item>
            <Menu.Item as="a" style={{ color: '#000', fontSize: 20 }}>
              <Icon name="users" />
              Usuarios
            </Menu.Item>
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

        <Sidebar.Pusher>
          <Segment basic>
            <h1>Home</h1>
          </Segment>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </div>
  );
}