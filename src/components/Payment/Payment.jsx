import { useState, useEffect, useCallback } from "react";
import {
  GridRow,
  GridColumn,
  Grid,
  Image,
  FormGroup,
  FormField,
  Form,
  Input,
  Icon,
  Checkbox,
  Button,
} from "semantic-ui-react";
import { jwtDecode } from "jwt-decode";
import "./Payment.css";
import paymentMethods from "../../assets/payment_methods.png";

export default function Payment() {
  const urlBase = import.meta.env.VITE_DEVELOP_URL_API;
  const urlFile = import.meta.env.VITE_DEVELOP_URL_FILE;
  const urlCart = `${urlBase}cart`;
  const [userSessionData, setUserSessionData] = useState(null);
  const [cartProducts, setCartProducts] = useState(null);
  const [totalPayment, setTotalPayment] = useState(0);

  const fetchCartProducts = useCallback(
    async (userId) => {
      try {
        const response = await fetch(`${urlCart}/${userId}`);
        if (!response.ok) {
          throw new Error("Error al obtener los productos del carrito");
        }
        const data = await response.json();

        const total = data.reduce(
          (sum, product) => sum + parseFloat(product.ORD_TOTAL),
          0
        );
        setTotalPayment(total);

        setCartProducts(data);
      } catch (error) {
        console.error("Error:", error);
      }
    },
    [urlCart]
  );
  useEffect(() => {
    const decodeToken = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in local storage");
        return null;
      }

      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);
        setUserSessionData(decoded);
      } catch (error) {
        console.error("Error decoding token:", error);
        setUserSessionData(null);
      }
    };

    decodeToken();
  }, []);

  useEffect(() => {
    if (userSessionData && userSessionData.id) {
      fetchCartProducts(userSessionData.id);
    }
  }, [userSessionData, fetchCartProducts]);

  return (
    <div>
      <h1>Formulario de pago</h1>
      <div>
        <Grid>
          <GridRow>
            <GridColumn width={8}>
              <Image src={paymentMethods} className="cards-image" />
              <Form>
                <FormGroup grouped>
                  <label>Método de pago</label>
                  <FormField
                    label={
                      <label>
                        <Icon name="money bill alternate outline" /> Efectivo
                      </label>
                    }
                    control="input"
                    type="radio"
                    name="paymentMethonOptions"
                    defaultChecked
                  />
                  <FormField
                    label={
                      <label>
                        <Icon name="credit card outline" /> Tarjeta de
                        Crédito/Débito
                      </label>
                    }
                    control="input"
                    type="radio"
                    name="paymentMethonOptions"
                  />
                </FormGroup>
                <FormGroup widths="equal">
                  <FormField
                    id="form-input-control-first-name"
                    control={Input}
                    label="Nombres"
                    placeholder="Nombres"
                  />
                  <FormField
                    id="form-input-control-last-name"
                    control={Input}
                    label="Apellidos"
                    placeholder="Apellidos"
                  />
                </FormGroup>
                <FormGroup widths="equal">
                  <FormField
                    id="form-input-control-first-name"
                    control={Input}
                    label="Correo electrónico"
                    placeholder="Correo electrónico"
                  />
                  <FormField
                    id="form-input-control-last-name"
                    control={Input}
                    label="Telefono"
                    placeholder="Telefono"
                  />
                  <FormField
                    id="form-input-control-last-name"
                    control={Input}
                    label="NIT"
                    placeholder="NIT"
                  />
                </FormGroup>
                <FormGroup widths="equal">
                  <FormField
                    id="form-input-control-first-name"
                    control={Input}
                    label="Número de tarjeta"
                    placeholder="Numero de tarjeta"
                  />
                </FormGroup>
                <FormGroup widths="equal">
                  <FormField
                    id="form-input-control-first-name"
                    control={Input}
                    label="Fecha de vencimiento (MM/YY)"
                    placeholder="Fecha de vencimiento (MM/YY)"
                  />
                  <FormField
                    id="form-input-control-last-name"
                    control={Input}
                    label="Código de seguridad"
                    placeholder="Código de seguridad"
                  />
                </FormGroup>
                <FormField
                  control={Checkbox}
                  label={{ children: "Acepto los términos y condiciones" }}
                />
                <Button type="submit" color="teal" className="pay-button">
                  Pagar
                </Button>
              </Form>
            </GridColumn>
            <GridColumn width={8}>
              <div className="cart-products-list">
                {cartProducts ? (
                  <Grid>
                    {cartProducts.map((product) => (
                      <GridRow key={product.ORD_ID} className="gird-row">
                        <GridColumn width={4}>
                          <Image
                            src={`${urlFile}${product.PRO_IMAGEN}`}
                            size="small"
                            className="product-image"
                          />
                        </GridColumn>
                        <GridColumn width={12}>
                          <h3>{product.PRO_NAME}</h3>
                          <span>{product.PRO_DESCRIPTION}</span><br/>
                          <span>Precio: <b>Q{product.ORD_TOTAL}</b></span><br/>
                          <span>Cantidad: <b>{product.ORD_QUANTITY}</b></span><br/>
                        </GridColumn>
                      </GridRow>
                    ))}
                  </Grid>
                ) : (
                  <p>Cargando productos del carrito...</p>
                )}
              </div>
              <div className="total-pay-content">
                <Grid>
                  <GridRow>
                    <GridColumn width={8}>
                        <span className="total-text"><b>Total a pagar:</b></span>
                    </GridColumn>
                    <GridColumn width={8}>
                        <span className="total-number-text"><b>Q{totalPayment.toFixed(2)}</b></span>
                    </GridColumn>
                  </GridRow>
                </Grid>
              </div>
            </GridColumn>
          </GridRow>
        </Grid>
      </div>
    </div>
  );
}
