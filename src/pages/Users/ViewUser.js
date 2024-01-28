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

import { getAllUsers, deleteUser } from "../../apis/user";
import { useHistory } from "react-router-dom";
import UserContext from "../../context/UserContext";
import Cookies from "universal-cookie";

const originalDataSource1 = [{
  applicationUserId: 4,
  userName: "admin",
  email: "admin1@yopmail.com",
  phoneNumber: "111223344",
  isActive: true,
},
{
  applicationUserId: 5,
  userName: "admin2",
  email: "admin2@yopmail.com",
  phoneNumber: "111223344",
  isActive: true,
},
{
  applicationUserId: 6,
  userName: "testUser",
  email: "testuser@yopail.com",
  phoneNumber: "1122887766",
  isActive: false,
},]

var permissionsProblem = {
  canEdit: true,
  canDelete: false,
  canAdd: true,
  canView: true,
}

function ViewUser({permissions = permissionsProblem}) {
  // console.log("permissions", permissions);
  //if user is admin then give all permissions
  const cookies = new Cookies();
  const user = cookies.get('user');
  const username = user?.username;
  if (username != "Admin") {
    // permissions.canEdit = false;
    permissions.canDelete = false;
  }
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
    getAllUsers().then((response) => {
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
    history.push(`/edit-user/${record.id}`);
  };

  const onChangeTableFilter = (e) => {
    if (e.target.value === "all") {
      setDataSource(originalDataSource);
    } else if (e.target.value === "active") {
      const activeUsers = originalDataSource.filter(
        (item) => item.isActive
      );
      setDataSource(activeUsers);
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
  //         success("User added successfully");
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
  //     const userData = await form.validateFields();
  //     setLoading(true);
  //     const response = await updateUser(userData);
  //     if (!response.error) {
  //       FetchData().then(() => {
  //         success("User updated successfully");
  //         setEditingKey("");
  //       }
  //       )
  //       // Reload user data from API
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
    deleteUser(key?.id).then((response) => {
      if (!response.error) {
        success("User deleted successfully");
        FetchData();
      } else {
        error(response.data);
      }
      setLoading(false);
    });
  };

  const columns = [
    { title: "User ID", dataIndex: "id", key: "id" },
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Created On", dataIndex: "createdAt", key: "createdAt", render: (createdAt) => new Date(createdAt).toLocaleDateString() },

    {
      title: "Active", dataIndex: "isActive", key: "isActive", render: (isActive) => isActive ? <>Active</> : <>Inactive</>
    },

    permissions?.canEdit &&
    {
      title: "Edit",
      dataIndex: "Edit",
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
    {
      title: "Delete",
      dataIndex: "Delete",
      render: (_, record) => {
        // const editable = isEditing(record);
        return (
          dataSource.length >= 1 ? (
            <Popconfirm
              title="Delete this item?"
              onConfirm={() => handleDelete(record)}
            >
              <a><Button type="primary" danger>
            Delete
          </Button></a>
            </Popconfirm>
          ) : null);
      },
    },
    // permissions.canDelete &&
    // {
    //   title: "Delete",
    //   dataIndex: "Delete",
    //   render: (_, record) => {
    //     const editable = isEditing(record);
    //     return !editable ? (
    //       dataSource.length >= 1 ? (
    //         <Popconfirm
    //           title="Sure to delete?"
    //           onConfirm={() => handleDelete(record?.applicationUserId)}
    //         >
    //           <a>Delete</a>
    //         </Popconfirm>
    //       ) : null
    //     ) : dataSource.length >= 1 ? (
    //       <Popconfirm title="Can't delete while editing!">
    //         <a>Delete</a>
    //       </Popconfirm>
    //     ) : null;
    //   },
    // },
  ].filter(Boolean);

  const handleAddUser = () => {
    history.push('/add-user'); // Redirects to /adduser
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
              title="Users"
              extra={
                <>
                <div style={{ display: 'flex', gap: '2rem' }}>
                  {permissions.canView && (
                    <Input
                      placeholder="Search..."
                      value={searchText}
                      onChange={e => handleSearch(e.target.value)}
                      style={{ marginBottom: 8, display: 'block',width: '40%' }}
                    />
                  )
                  }
                  {permissions?.canAdd && <span style={{ marginRight: "20px" }}>
                    <Button type="primary" onClick={handleAddUser}>
                      Add User
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
                      className="ant-border-space usertable"
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
