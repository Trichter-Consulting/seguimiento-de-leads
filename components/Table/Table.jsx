import {
  Form,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
  Input,
  Progress,
  Dropdown,
  Space,
  Skeleton,
  Tag
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";
import { render } from "react-dom";
import styles from "./Table.module.scss";
import { useRouter } from "next/router";
import TableContext from "../../context/TableContext";

const originData = [];
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

// COMPONENTE
const TableCom = () => {
  // useContext
  const context = useContext(TableContext);
  const textoLabel = context.locationState.label;
  const apiKey = context.locationState.value;
  // useContext

  // FUNCION GET API CALL
  const getContacts = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${apiKey}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const response = await fetch(
      "https://rest.gohighlevel.com/v1/contacts?limit=100",
      requestOptions
    );
    const parseResponse = await response.json();

    const filterResponse = parseResponse.contacts;

    return filterResponse;
  };

  useEffect(() => {
    getContacts().then((contacts) => {
      const newArr = contacts.map((contacto) => {
        return {
          key: contacto.id,
          name: contacto.firstName + " " + contacto.lastName,
          phone: contacto.phone,
          email: contacto.email,
          tags: contacto.tags
        };
      });
      setData(newArr);
    });
  }, [context.locationState]);

  // MAP PARA CADA CONTACTO

  // FIN DE MIS FUNCIONES

  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      phone: "",
      email: "",
      ...record,
    });
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey("");
  };
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const [keyState, setKeyState] = useState(0);
  const items = [
    {
      key: "1",
      label: "Item 1",
    },
    {
      key: "2",
      label: "Item 2",
    },
    {
      key: "3",
      label: "Item 3",
    },
  ];

  const columns = [
    {
      title: "Lead",
      dataIndex: "name",
      width: 250,
      editable: false,
    },
    // {
    //   title: "Lead",
    //   dataIndex: "name",
    //   width: 200,
    //   editable: false,
    // },
    {
      title: "Correo",
      dataIndex: "email",
      width: 250,
      editable: true,
    },
    {
      title: "Numero Telef??nico",
      dataIndex: "phone",
      width: 200,
      editable: true,
    },
    // {
    //   title: "Tags",
    //   dataIndex: "address",
    //   width: 200,
    //   editable: true,
    // },
    {
      title: "Tags",
      dataIndex: "tags",
      width: 200,
      editable: false,
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            let color = tag == 'lead de facebook'? 'blue': 'green';
            if (tag == '[whatsapp] - contact is not registered on whatsapp') {
              null
            } else if (tag == '[whatsapp] - phone device is disconnected'){
              null
            } else {
              return (
                <Tag color={color} key={tag} style={{marginBottom: 5}}>
                  {tag.toUpperCase()}
                </Tag>
              );
            }
          })}
        </>
      )
    },
    // {
    //   title: "Tiempo estimado de compra",
    //   dataIndex: "name",
    //   width: 200,
    //   editable: false,
    // },
    // {
    //   title: "Capital disponible",
    //   dataIndex: "name",
    //   width: 200,
    //   editable: false,
    // },
    // {
    //   title: "Stage",
    //   dataIndex: "age",
    //   render: () => {
    //     return (
    //       <Dropdown
    //         menu={{
    //           items,
    //           selectable: true,
    //           defaultSelectedKeys: ["2"],
    //           onSelect: ({ keys }) => {
    //             return setKeyState(keys);
    //           },
    //         }}
    //       >
    //         <Typography.Link>
    //           <Space>
    //             Hola como estas
    //             <DownOutlined />
    //           </Space>
    //         </Typography.Link>
    //       </Dropdown>
    //     );
    //   },
    //   width: 200,
    //   editable: true,
    // },
    // {
    //   title: "Calificaci??n",
    //   dataIndex: "age",
    //   render: (age) => {
    //     return (
    //       <span>
    //         <Progress percent={age} status="active" />
    //       </span>
    //     );
    //   },
    //   width: 300,
    //   editable: true,
    // },
    {
      title: "Acciones",
      dataIndex: "operation",
      width: 100,
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Desea cancelar?" onConfirm={cancel}>
              <a>Cancelar</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Editar
          </Typography.Link>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  // SKELETON TIMEOUT
  const [skeleton, setSkeleton] = useState(true)
  useEffect(() => {
    setSkeleton(true)
    setTimeout(() => {
      setSkeleton(false)
    }, 1000)
  },[context])
  

  return (
    <div className={styles.main_container}>
      <Form form={form} component={false}>
        <Skeleton
          loading={skeleton}
          active={true}
          style={{ width: 1100, marginTop: 50 }}
          paragraph={{
            rows: 15,
            width: 1100,
          }}
        >
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            dataSource={data}
            columns={mergedColumns}
            rowClassName="editable-row"
            pagination={{
              onChange: cancel,
            }}
            scroll={{
              x: 1000,
              y: 530,
            }}
          ></Table>
        </Skeleton>
      </Form>
    </div>
  );
};

export default TableCom;
