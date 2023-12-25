import React, { useState, useEffect } from "react";
import moment from 'moment';
import { useHistory, useParams } from "react-router-dom";
import Cookies from "universal-cookie";
import { Form, Input, InputNumber, Button, Card, Row, Col, DatePicker, Switch, message } from "antd";
import { updateInventory, createInventory, getInventoryDetails } from "../../apis/inventory";

function AddInventory({ isEditable = false }) {
    
  const cookies = new Cookies();
    const [form] = Form.useForm();
    const history = useHistory();
    const { inventoryId } = useParams();

    useEffect(() => {
        if (isEditable && inventoryId) {
            getInventoryDetails(inventoryId).then(response => {
                if(response.error){
                    message.error(response.data);
                } else {
                    form.setFieldsValue({
                        ...response.data,
                        createdAt: moment(response.data.createdAt),
                    });
                }
            }).catch(err => {
                message.error("Failed to fetch inventory item details");
            });
        }
    }, [isEditable, inventoryId, form]);

    const handleOk = () => {
        form.validateFields().then((values) => {
            var itemData ={}
            if (isEditable) {
                itemData = {
                    ...values,
                };
            }else{
                var userID = cookies.get("user")?.id;
                itemData = {
                    ...values,
                    createdAt: moment(),
                    createdBy:userID,
                };

            }

            isEditable ?
                updateInventory(inventoryId, itemData).then((response) => {
                    if (!response.error) {
                        message.success("Inventory item updated successfully");
                        history.push("/inventories");
                    } else {
                        message.error(response.data);
                    }
                }) :
                createInventory(itemData).then((response) => {
                    if (!response.error) {
                        message.success("Inventory item added successfully");
                        history.push("/inventories");
                    } else {
                        message.error(response.data);
                    }
                });
        });
    };

    return (
        <Card>
            <h2 style={{ textAlign: 'center', fontWeight: "bolder" }}>
                {isEditable ? "Edit Inventory Item" : "Add New Inventory Item"}
            </h2>
            <Form form={form} onFinish={handleOk} layout="vertical">
                <Row gutter={16}>
                    {/* Inventory Item Fields */}
                    <Col xs={24} sm={12}>
                        <Form.Item name="itemName" label="Item Name" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item name="description" label="Description">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
                            <InputNumber min={1} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Form.Item name="price" label="Single Price" rules={[{ required: true }]}>
                            <InputNumber min={0} step={0.01} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Form.Item name="isInUse" label="In Use" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                    </Col>
                    {isEditable && (
                        <Col xs={24} sm={12}>
                            <Form.Item name="createdAt" label="Created On">
                                <DatePicker disabled format="YYYY-MM-DD" />
                            </Form.Item>
                        </Col>
                    )}
                </Row>
                {/* Submit Button */}
                <Form.Item style={{ textAlign: "end", paddingTop: "2rem" }}>
                    <Button style={{ width: "40%" }} type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
}

export default AddInventory;
