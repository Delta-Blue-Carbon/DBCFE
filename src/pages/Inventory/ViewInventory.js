import React, { useEffect, useState, useContext } from "react";
import {
  Row,
  Col,
  Card,
  Radio,
  Table,
  Button,
  Typography,
  Popconfirm,
  Form,
  Input,
  Modal,
  message,
  Select,
  Spin
} from "antd";

import { getAllInventories, deleteInventory } from "../../apis/inventory";
import { useHistory } from "react-router-dom";
import UserContext from "../../context/UserContext";

const originalDataSource1 = [
  {
    id: 4,
    itemName: "Table",
    quantity: 10,
    price: 20.00,
    description: "Wooden table",
    createdAt: "2023-01-01T12:00:00Z",
    updatedAt: "2023-01-02T12:00:00Z",
    createdBy: 1,
    isInUse: true
  },
  {
    id: 5,
    itemName: "Chair",
    quantity: 30,
    price: 300.00,
    description: "Comfortable office chair",
    createdAt: "2023-01-03T12:00:00Z",
    updatedAt: "2023-01-04T12:00:00Z",
    createdBy: 2,
    isInUse: true
  },
  {
    id: 6,
    itemName: "Bottle",
    quantity: 15,
    price: 10.00,
    description: "Water bottle",
    createdAt: "2023-01-05T12:00:00Z",
    updatedAt: "2023-01-06T12:00:00Z",
    createdBy: 3,
    isInUse: false
  },
  {
    id: 7,
    itemName: "Pouch",
    quantity: 50,
    price: 5.00,
    description: "Small pouch",
    createdAt: "2023-01-07T12:00:00Z",
    updatedAt: "2023-01-08T12:00:00Z",
    createdBy: 4,
    isInUse: true
  }
];


const permissionsProblem = {
  canEdit: true,
  canDelete: true,
  canAdd: true,
  canView: true,
}

function ViewUser({permissions = permissionsProblem}) {
  // console.log("permissions", permissions);
  
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record?.id === editingKey;
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const [originalDataSource, setOriginalDataSource] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  // Function to handle search
  const handleSearch = (searchValue) => {
    setSearchText(searchValue);
    const filtered = dataSource.filter(entry =>
      columns.some(column => {
        const cellValue = entry[column.dataIndex];
        let cellValueString;

        // Convert different data types to string
        if (cellValue != null) { // checks for both null and undefined
          if (cellValue instanceof Date) {
            // Format dates as you see fit
            cellValueString = cellValue.toLocaleDateString();
          } else {
            cellValueString = cellValue.toString();
          }
        }

        // Perform case-insensitive comparison
        return cellValueString && cellValueString.toLowerCase().includes(searchValue.toLowerCase());
      })
    );
    setFilteredData(filtered);
  };


  // const { permission } = useContext(UserContext);

  const error = (e) => {
    messageApi.open({
      type: 'error',
      content: e,
    });
  };
  const success = (e) => {
    messageApi.open({
      type: 'success',
      content: e,
    });
  };
  const FetchData = async () => {
    setLoading(true)
    // setDataSource(originalDataSource1);
    // setOriginalDataSource(originalDataSource1);
    getAllInventories().then((response) => {
      console.log(response);
      if (!response.error) {
        // console.log(response);
        setDataSource(response.data);
        setOriginalDataSource(response.data);
      } else {
        error(response.data);
      }
      setLoading(false)
    });
  }
  // const FetchData = () => {
  //   setLoading(true)
  //   setDataSource(originalDataSource1);
  //   setOriginalDataSource(originalDataSource1);
  //   console.log("useEffect called");
  //   setLoading(false)
  // }
  useEffect(() => {
    // Fetch data from the API when the component mounts
    FetchData();
  }, []);


  const edit = (record) => {
    history.push(`/edit-inventory/${record.id}`);
  };

  const onChangeTableFilter = (e) => {
    if (e.target.value === "all") {
      setDataSource(originalDataSource);
    } else if (e.target.value === "active") {
      const activeInventories = originalDataSource.filter(
        (item) => item.isInUse
      );
      setDataSource(activeInventories);
    }
  };

  // const handleOk = () => {
  //   form.validateFields().then((values) => {
  //     const roleIds = values.roleIds.map(roleId => parseInt(roleId, 10));
  //     // Ensure all values are valid integers (filter out any NaN values)
  //     const validRoleIds = roleIds.filter(roleId => !isNaN(roleId));

  //     // Now use validRoleIds...
  //     const updatedUserData = { ...values, roleIds: validRoleIds };
  //     createUser(updatedUserData).then((response) => {
  //       console.log(response);
  //       if (!response.error) {
  //         console.log(response);
  //         FetchData();
  //         setIsModalVisible(false);
  //         success("Inventory added successfully");
  //       } else {
  //         error(response.data);
  //       }
  //       setLoading(false)
  //     });

  //   });
  // };

  // const handleCancel = () => {
  //   setIsModalVisible(false);
  // };

  // const handleSave = async (key) => {
  //   try {
  //     const inventoryData = await form.validateFields();
  //     setLoading(true);
  //     const response = await updateUser(inventoryData);
  //     if (!response.error) {
  //       FetchData().then(() => {
  //         success("Inventory updated successfully");
  //         setEditingKey("");
  //       }
  //       )
  //       // Reload inventory data from API
  //     } else {
  //       error(response.data);
  //     }
  //     setLoading(false);
  //   } catch (errInfo) {
  //     console.log("Validate Failed:", errInfo);
  //     setLoading(false);
  //   }

  // };

  // const cancel = () => {
  //   setEditingKey("");
  // };

  const handleDelete = (key) => {
    setLoading(true);
    deleteInventory(key?.id).then((response) => {
      if (!response.error) {
        success("Inventory deleted successfully");
        FetchData();
      } else {
        error(response.data);
      }
      setLoading(false);
    });
  };
  const columns = [
    { title: "Inventory ID", dataIndex: "id", key: "id" },
    { title: "Item Name", dataIndex: "itemName", key: "itemName" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    { title: "Single Price", dataIndex: "price", key: "price" },
    { 
      title: "Total Price", 
      dataIndex: "totalPrice", 
      key: "totalPrice",
      render: (_, record) => {
        const totalPrice = (record.quantity * record.price).toFixed(2);
        return <>{totalPrice}</>;
      }
    },
    { title: "Created On", dataIndex: "createdAt", key: "createdAt", render: (createdAt) => new Date(createdAt).toLocaleDateString() },
    { title: "Updated On", dataIndex: "updatedAt", key: "updatedAt", render: (updatedAt) => new Date(updatedAt).toLocaleDateString() },
    { title: "Created By", dataIndex: "createdBy", key: "createdBy" },
    {
      title: "In Use", dataIndex: "isInUse", key: "isInUse", 
      render: (isInUse) => isInUse ? <>True</> : <>False</>
    },
    // Edit and Delete columns as per your existing setup
    permissions?.canEdit && {
      title: "Edit",
      dataIndex: "edit",
      render: (_, record) => {
        const editable = isEditing(record);
        return (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
              <Button type="dashed" >
            Edit
          </Button>
          </Typography.Link>
        );
      },
    },
    permissions?.canDelete && {
      title: "Delete",
      dataIndex: "delete",
      render: (_, record) => {
        const editable = isEditing(record);
        return !editable ? (
          dataSource.length >= 1 ? (
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDelete(record?.applicationUserId)}
            >
              <a><Button type="primary" danger>
            Delete
          </Button></a>
            </Popconfirm>
          ) : null
        ) : dataSource.length >= 1 ? (
          <Popconfirm title="Can't delete while editing!">
            <a>Delete</a>
          </Popconfirm>
        ) : null;
      },
    }
  ].filter(Boolean);
  
  // const columns = [
  //   { title: "Inventory ID", dataIndex: "inventoryId", key: "inventoryId" },
  //   { title: "Inventory Name", dataIndex: "inventoryName", key: "inventoryName" },
  //   { title: "Price", dataIndex: "price", key: "price" },
  //   { title: "Count", dataIndex: "count", key: "count" },
  //   { title: "Created On", dataIndex: "createdAt", key: "createdAt", render: (createdAt) => new Date(createdAt).toLocaleDateString() },

  //   {
  //     title: "In Use", dataIndex: "isInUse", key: "isInUse", render: (isInUse) => isInUse ? <>True</> : <>Flase</>
  //   },

  //   permissions?.canEdit &&
  //   {
  //     title: "Edit",
  //     dataIndex: "Edit",
  //     render: (_, record) => {
  //       const editable = isEditing(record);
  //       return (
  //         <Typography.Link
  //           disabled={editingKey !== ""}
  //           onClick={() => edit(record)}
  //         >
  //             <Button type="dashed" >
  //           Edit
  //         </Button>
  //         </Typography.Link>
  //       );
  //     },
  //   }, 
  //   {
  //     title: "Delete",
  //     dataIndex: "Delete",
  //     render: (_, record) => {
  //       // const editable = isEditing(record);
  //       return (
  //         dataSource.length >= 1 ? (
  //           <Popconfirm
  //             title="Delete this item?"
  //             onConfirm={() => handleDelete(record)}
  //           >
  //             <a><Button type="primary" danger>
  //           Delete
  //         </Button></a>
  //           </Popconfirm>
  //         ) : null);
  //     },
  //   },
  //   permissions.canDelete &&
  //   {
  //     title: "Delete",
  //     dataIndex: "Delete",
  //     render: (_, record) => {
  //       const editable = isEditing(record);
  //       return !editable ? (
  //         dataSource.length >= 1 ? (
  //           <Popconfirm
  //             title="Sure to delete?"
  //             onConfirm={() => handleDelete(record?.applicationUserId)}
  //           >
  //             <a>Delete</a>
  //           </Popconfirm>
  //         ) : null
  //       ) : dataSource.length >= 1 ? (
  //         <Popconfirm title="Can't delete while editing!">
  //           <a>Delete</a>
  //         </Popconfirm>
  //       ) : null;
  //     },
  //   },
  // ].filter(Boolean);

  const handleAddUser = () => {
    history.push('/add-inventory'); // Redirects to /addinventory
  };


  return (
    <>
      {contextHolder}
      <div className="tabled">
        <Row gutter={[24, 0]}>
          <Col xs="24" xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="Inventories"
              extra={
                <>
                <div style={{ display: 'flex', gap: '2rem' }}>
                  {permissions.canView && (
                    <Input
                      placeholder="Search..."
                      value={searchText}
                      onChange={e => handleSearch(e.target.value)}
                      style={{ marginBottom: 8, display: 'block',width: '30%' }}
                    />
                  )
                  }
                  {permissions?.canAdd && <span style={{ marginRight: "20px" }}>
                    <Button type="primary"
                    onClick={handleAddUser}
                    >
                      Add Inventory
                    </Button>
                  </span>}
                  <Radio.Group
                    onChange={onChangeTableFilter}
                    defaultValue="all"
                  >
                    <Radio.Button value="all">All</Radio.Button>
                    <Radio.Button value="active">ACTIVE</Radio.Button>
                  </Radio.Group>
                </div>
                </>
              }
            >
              <div className="table-responsive">
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '50px' }}>
                    <Spin size="large" />
                  </div>
                ) : (
                  <Form form={form} component={false}>
                    <Table
                      columns={columns}
                      dataSource={dataSource}
                      pagination={false}
                      className="ant-border-space inventorytable"
                      rowClassName="editable-row"
                    />
                  </Form>)
                }
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default ViewUser;
