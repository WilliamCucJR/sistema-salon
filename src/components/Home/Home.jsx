import { Icon, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
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
    </div>
  );
};

export default Home;

