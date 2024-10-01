import { Icon, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import './Home.css'; // CSS personalizado

const Home = () => {
  return (
    <div className="menu-container">
      <h2>¿Cómo podemos ayudarte?</h2>
      <Grid columns={5} centered stackable doubling>
        <Grid.Column>
          <Link to="/appointment" className="menu-link">
            <div className="menu-box">
              <Icon name="calendar alternate outline" size="massive" />
              <p>Agendar</p>
            </div>
          </Link>
        </Grid.Column>
        <Grid.Column>
          <Link to="/customers" className="menu-link">
            <div className="menu-box">
              <Icon name="user outline" size="massive" />
              <p>Clientes</p>
            </div>
          </Link>
        </Grid.Column>
        <Grid.Column>
          <Link to="/" className="menu-link">
            <div className="menu-box">
              <Icon name="shopping bag" size="massive" />
              <p>Comprar</p>
            </div>
          </Link>
        </Grid.Column>
        <Grid.Column>
          <Link to="/" className="menu-link">
            <div className="menu-box">
              <Icon name="file alternate outline" size="massive" />
              <p>Reportes</p>
            </div>
          </Link>
        </Grid.Column>
        <Grid.Column>
          <Link to="/" className="menu-link">
            <div className="menu-box">
              <Icon name="tags" size="massive" />
              <p>Promociones</p>
            </div>
          </Link>
        </Grid.Column>
      </Grid>
        <InstagramButton
                href="https://www.instagram.com/cul4s_de_freefire/?hl=es-la"
                target="_blank"
                rel="noopener noreferrer"
            >
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
                    alt="Ver nuestro negocio en Instagram"
                />
            </InstagramButton>
            <WhatsappButton
                href="https://wa.me/50254050579?text=HOLA"
                target="_blank"
                rel="noopener noreferrer"
            >
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                    alt="Chat on WhatsApp"
                />
            </WhatsappButton>
    </div>
  );
};

const pulseAnimation = keyframes`
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
`;

const InstagramButton = styled.a`
    position: fixed;
    bottom: 100px;
    right: 20px;
    z-index: 1000;
    animation: ${pulseAnimation} 1.5s ease-in-out infinite;

    img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        transition: transform 0.3s ease-in-out;

        &:hover {
            transform: scale(1.1);
        }
    }
`;

const WhatsappButton = styled.a`
    position: fixed;
    bottom: 20px; 
    right: 20px;
    z-index: 1000;

    img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        transition: transform 0.3s ease-in-out;

        &:hover {
            transform: scale(1.1);
        }
    }
`;

export default Home;

