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
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";
import "./Payment.css";
import paymentMethods from "../../assets/payment_methods.png";

export default function Payment() {
  const urlBase = import.meta.env.VITE_DEVELOP_URL_API;
  const urlFile = import.meta.env.VITE_DEVELOP_URL_FILE;
  const urlCart = `${urlBase}cart`;
  const [userSessionData, setUserSessionData] = useState(null);
  const [cartProducts, setCartProducts] = useState(null);
  const [totalPayment, setTotalPayment] = useState(0);
  const navigate = useNavigate(); // Obtener el objeto navigate

  const [formData, setFormData] = useState({
    paymentMethod: "efectivo",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nit: "",
    cardNumber: "",
    expiryDate: "",
    securityCode: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Factura", 105, 20, null, null, "center");

    doc.setFontSize(12);
    doc.text(`Nombre: ${formData.firstName} ${formData.lastName}`, 10, 40);
    doc.text(`Correo: ${formData.email}`, 10, 50);
    doc.text(`Teléfono: ${formData.phone}`, 10, 60);
    doc.text(`NIT: ${formData.nit}`, 10, 70);
    doc.text(`Método de Pago: ${formData.paymentMethod}`, 10, 80);

    doc.line(10, 90, 200, 90);

    doc.setFontSize(14);
    doc.text("Productos", 10, 100);

    doc.setFontSize(12);
    let y = 110;
    doc.text("No.", 10, y);
    doc.text("Producto", 30, y);
    doc.text("Precio", 150, y);
    doc.text("Cantidad", 170, y);
    doc.text("Total", 190, y);

    y += 10;
    cartProducts.forEach((product, index) => {
      doc.text(`${index + 1}`, 10, y);
      doc.text(product.PRO_NAME, 30, y);
      doc.text(`Q${product.ORD_TOTAL}`, 150, y);
      doc.text(`${product.ORD_QUANTITY}`, 170, y);
      doc.text(
        `Q${(product.ORD_TOTAL * product.ORD_QUANTITY).toFixed(2)}`,
        190,
        y
      );
      y += 10;
    });

    doc.line(10, y, 200, y);
    y += 10;

    doc.setFontSize(14);
    doc.text(`Total: Q${totalPayment.toFixed(2)}`, 10, y);

    const now = new Date();
    const dateTimeString = `${now.getFullYear()}${String(
      now.getMonth() + 1
    ).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}${String(
      now.getHours()
    ).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(
      now.getSeconds()
    ).padStart(2, "0")}${String(now.getMilliseconds()).padStart(3, "0")}`;

    doc.save(`factura_${dateTimeString}.pdf`);
  };

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

  const handlePayment = async (event) => {
    event.preventDefault();
    console.log("Datos del formulario:", formData);
    console.log("Productos a pagar:", cartProducts);

    for (const product of cartProducts) {
      try {
        const response = await fetch(`${urlCart}/${product.ORD_ID}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ORD_STATUS: 1 }),
        });

        if (!response.ok) {
          throw new Error(`Error al realizar el pago ${product.ORD_ID}`);
        }

        const updatedProduct = await response.json();
        console.log(`Producto actualizado: ${updatedProduct}`);
        Swal.fire({
          title: "Pagado",
          text: "Pago realizado exitosamente!",
          icon: "success",
          showCancelButton: true,
          confirmButtonText: "Descargar Factura",
          cancelButtonText: "Cerrar",
          preConfirm: () => {
            generatePDF();
            Swal.update({
              title: "Pagado",
              text: "Pago realizado exitosamente! Puedes cerrar esta alerta.",
              icon: "success",
              showCancelButton: true,
              confirmButtonText: "Descargar Factura",
              cancelButtonText: "Cerrar",
            });
            return false;
          },
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.cancel) {
            navigate("/store");
          }
        });
      } catch (error) {
        console.error(
          `Error al actualizar el producto ${product.ORD_ID}:`,
          error
        );
      }
    }
  };

  const handleExpiryDateChange = (e) => {
    let { value } = e.target;
    value = value.replace(/\D/g, "");

    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }

    if (value.length > 5) {
      value = value.slice(0, 5);
    }

    let [month, year] = value.split("/");
    let today = new Date();
    let currentYear = today.getFullYear() % 100;
    let currentMonth = today.getMonth() + 1;
    let error = 0;

    if (value.length === 5) {
      if (month && year) {
        if (parseInt(month, 10) < 1 || parseInt(month, 10) > 12) {
          error = 1;
        } else {
          if (parseInt(year, 10) < currentYear) {
            error = 1;
          } else if (
            parseInt(year, 10) === currentYear &&
            parseInt(month, 10) < currentMonth
          ) {
            error = 1;
          }
        }
      }

      if (error === 1) {
        Swal.fire({
          title: "Error",
          text: "La fecha de vencimiento no puede ser menor a la fecha actual y el mes debe estar entre 01 y 12",
          icon: "error",
        });
      }
    }

    console.log("Fecha de vencimiento:", value);
    console.log("Mes:", month);
    console.log("Año:", year);
    console.log("Mes actual:", currentMonth);
    console.log("Año actual:", currentYear);
    console.log("Error:", error);

    setFormData({
      ...formData,
      expiryDate: value,
    });
  };

  const handleSecurityCodeChange = (e) => {
    let { value } = e.target;
    value = value.replace(/\D/g, "");

    if (value.length > 3) {
      value = value.slice(0, 3);
    }

    setFormData({
      ...formData,
      securityCode: value,
    });
  };

  const handleCardNumberChange = (e) => {
    let { value } = e.target;
    value = value.replace(/\D/g, "");

    if (value.length > 16) {
      value = value.slice(0, 16);
    }

    // Agregar un espacio cada 4 caracteres
    value = value.replace(/(.{4})/g, "$1 ").trim();

    setFormData({
      ...formData,
      cardNumber: value,
    });
  };

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
                    name="paymentMethod"
                    value="efectivo"
                    checked={formData.paymentMethod === "efectivo"}
                    onChange={handleInputChange}
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
                    name="paymentMethod"
                    value="tarjeta"
                    checked={formData.paymentMethod === "tarjeta"}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup widths="equal">
                  <FormField
                    id="form-input-control-first-name"
                    control={Input}
                    label="Nombres"
                    placeholder="Nombres"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                  <FormField
                    id="form-input-control-last-name"
                    control={Input}
                    label="Apellidos"
                    placeholder="Apellidos"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup widths="equal">
                  <FormField
                    id="form-input-control-email"
                    control={Input}
                    label="Correo electrónico"
                    placeholder="Correo electrónico"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  <FormField
                    id="form-input-control-phone"
                    control={Input}
                    label="Teléfono"
                    placeholder="Teléfono"
                    name="phone"
                    value={formData.phone}
                    onChange={(e, { value }) => {
                      if (/^\d{0,8}$/.test(value)) {
                        handleInputChange(e, { name: "phone", value });
                      }
                    }}
                  />
                  <FormField
                    id="form-input-control-nit"
                    control={Input}
                    label="NIT"
                    placeholder="NIT"
                    name="nit"
                    value={formData.nit}
                    onChange={(e) => {
                      const { value } = e.target;
                      if (/^[a-zA-Z0-9-]{0,10}$/.test(value)) {
                        handleInputChange(e, { name: "nit", value });
                      }
                    }}
                  />
                </FormGroup>
                <FormGroup widths="equal">
                  <FormField
                    id="form-input-control-card-number"
                    control={Input}
                    label="Número de tarjeta"
                    placeholder="Número de tarjeta"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleCardNumberChange}
                    disabled={formData.paymentMethod === "efectivo"}
                  />
                </FormGroup>
                <FormGroup widths="equal">
                  <FormField
                    id="form-input-control-expiry-date"
                    control={Input}
                    label="Fecha de vencimiento (MM/YY)"
                    placeholder="MM/YY"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleExpiryDateChange}
                    disabled={formData.paymentMethod === "efectivo"}
                  />
                  <FormField
                    id="form-input-control-security-code"
                    control={Input}
                    label="Código de seguridad"
                    placeholder="Código de seguridad"
                    name="securityCode"
                    value={formData.securityCode}
                    onChange={handleSecurityCodeChange}
                    disabled={formData.paymentMethod === "efectivo"}
                  />
                </FormGroup>
                <FormField
                  control={Checkbox}
                  label={{ children: "Acepto los términos y condiciones" }}
                  name="acceptTerms"
                />
                <Button
                  type="submit"
                  color="teal"
                  className="pay-button"
                  onClick={handlePayment}
                >
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
                          <span>{product.PRO_DESCRIPTION}</span>
                          <br />
                          <span>
                            Precio:{" "}
                            <b>
                              Q
                              {(
                                product.ORD_TOTAL / product.ORD_QUANTITY
                              ).toFixed(2)}
                            </b>
                          </span>
                          <br />
                          <span>
                            Cantidad: <b>{product.ORD_QUANTITY}</b>
                          </span>
                          <br />
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
                      <span className="total-pay total-text ">
                        Total a pagar:
                      </span>
                    </GridColumn>
                    <GridColumn width={8}>
                      <span className="total-number-text">
                        <b>Q{totalPayment.toFixed(2)}</b>
                      </span>
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
