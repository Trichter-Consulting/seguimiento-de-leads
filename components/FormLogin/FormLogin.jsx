import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, Option, Empty, message } from "antd";
import styles from "./FormLogin.module.scss";
import Image from "next/image";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";

// Notificacion de email incorrecto
const notify = (message) => toast.error(message);

const FormLogin = () => {
  const { push } = useRouter();

  // Peticion fetch para validar email
  const getServerData = async (userEmail) => {

    var myHeaders = new Headers();
    const key = process.env.NEXT_PUBLIC_API_KEY;
    myHeaders.append("Authorization", `Bearer ${key}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    await fetch(
      `https://rest.gohighlevel.com/v1/users/lookup?email=${userEmail}`,
      requestOptions
    )
    .then((response) => response.json())
    .then((result) => {
      if (result.id == undefined) {
        notify("Email incorrecto o invalido")
      } else if (result.roles.locationIds == 0) {
        notify("No eres usuario en ninguna cuenta")
      } else {
        push(`/table/${result.roles.locationIds}`)
      }
    })
    .catch((error) => console.log(error));
  };

  // Funcion que envia la data de los inputs
  const onFinish = (values) => {
    getServerData(values.username);
  };

  // Handel button login
  const [loadingBtn, setLoadingBtn] = useState(false);
  const handleLoadin = () => {
    setLoadingBtn(true)
  }

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Form
        name="normal_login"
        className={styles.login_form}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Image
          src="/images/cropped-logotipo.png"
          width={300}
          height={100}
          alt="Logo Trichter Consulting"
        />
        <br />
        <br />
        <br />
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: "Por favor introduzca su correo!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className={styles.site_form_item_icon} />}
            placeholder="Email"
          />
        </Form.Item>

        {/* <Form.Item
          name="phone"
          rules={[
            {
              required: true,
              message: "Por favor introduzca su número telefónico!",
            },
          ]}
        >
          <Input
            addonBefore={prefixSelector}
            style={{
              width: "100%",
            }}
          />
        </Form.Item> */}

        <Form.Item>
          <Button 
            htmlType="submit" 
            className={styles.login_form_button} 
            loading={loadingBtn} 
            onClick={handleLoadin}
          >
            Ingresar
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
export default FormLogin;
