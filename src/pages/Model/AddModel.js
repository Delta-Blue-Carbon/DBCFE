import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Form, Input, Button, message, Card, Row, Col, Select } from "antd";
import { createModel, updateModel, getModelDetails } from "../../apis/model";
import { getAllMakes } from "../../apis/make";
import { getAllParameters } from "../../apis/parameter";

const { Option } = Select;

function AddModel({ isEditable = false }) {
  const [form] = Form.useForm();
  const history = useHistory();
  const { modelId } = useParams();

  const [makes, setMakes] = useState([]);
  const [parameters, setParameters] = useState([]);

  useEffect(() => {
    Promise.all([getAllMakes(), getAllParameters()]).then(([makesData, parametersData]) => {
        if (makesData.error) {
            message.error(makesData.data);
        } else {
            setMakes(makesData.data);
        }

        if (parametersData.error) {
            message.error(parametersData.data);
        } else {
            setParameters(parametersData.data);
            form.setFieldsValue({
                nationalityId: parametersData.data.find(param => param.name === 'Nationality')?.parameterId,
                modelCategoryId: parametersData.data.find(param => param.name === 'ModelCategory')?.parameterId,
            });
        }
    });

    if (isEditable && modelId) {
      getModelDetails(modelId).then(response => {
        form.setFieldsValue(response.data);
      }).catch(err => {
        message.error("Failed to fetch model details");
      });
    }
  }, [isEditable, modelId, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      isEditable ?
        updateModel(modelId, values).then((response) => {
          if (!response.error) {
            message.success("Model updated successfully");
            history.push("/models");
          } else {
            message.error(response.data);
          }
        }) :
        createModel(values).then((response) => {
          if (!response.error) {
            message.success("Model added successfully");
            history.push("/models");
          } else {
            message.error(response.data);
          }
        });
    });
  };

  return (
    <Card>
    <h2 style={{ textAlign: 'center', fontWeight: "bolder" }}>{isEditable ? "Edit Model" : "Add New Model"}</h2>
    <Form
        form={form}
        onFinish={handleOk}
        layout="vertical"
    >
        <Row gutter={16}>
            <Col xs={24} sm={12}>
                <Form.Item
                    name="makeId"
                    label="Make"
                    rules={[{ required: true, message: 'Please select a Make!' }]}
                >
                    <Select placeholder="Select a make">
                        {makes.map(make => (
                            <Option key={make.makeId} value={make.makeId}>{make.makeNameEn}</Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
                <Form.Item
                    name="modelNameAr"
                    label="Model Name (Arabic)"
                    rules={[{ required: true, message: 'Please input the model name in Arabic!' }]}
                >
                    <Input />
                </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
                <Form.Item
                    name="modelNameEn"
                    label="Model Name (English)"
                    rules={[{ required: true, message: 'Please input the model name in English!' }]}
                >
                    <Input />
                </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
                <Form.Item
                    name="najmModelCode"
                    label="Najm Model Code"
                    rules={[{ required: true, message: 'Please input the Najm Model Code!' }]}
                >
                    <Input />
                </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
                <Form.Item
                    name="yakeenModelCode"
                    label="Yakeen Model Code"
                    rules={[{ required: true, message: 'Please input the Yakeen Model Code!' }]}
                >
                    <Input />
                </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
                <Form.Item
                    name="giCoreModelCode"
                    label="GI Core Model Code"
                    rules={[{ required: true, message: 'Please input the GI Core Model Code!' }]}
                >
                    <Input />
                </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
                <Form.Item
                    name="bCareModelCode"
                    label="BiCare Model Code"
                    rules={[{ required: true, message: 'Please input the BiCare Model Code!' }]}
                >
                    <Input />
                </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
                <Form.Item
                    name="nationalityId"
                    label="Nationality"
                    initialValue={parameters.find(param => param.name === 'Nationality')?.parameterId}
                >
                    <Input disabled/>
                </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
                <Form.Item
                    name="seatingCapacity"
                    label="Seating Capacity"
                    rules={[{ required: true, message: 'Please input the Seating Capacity!' }]}
                >
                    <Input type="number" />
                </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
                <Form.Item
                    name="weight"
                    label="Weight"
                    rules={[{ required: true, message: 'Please input the Weight!' }]}
                >
                    <Input type="number" />
                </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
                <Form.Item
                    name="modelCategoryId"
                    label="Model Category"
                    initialValue={parameters.find(param => param.name === 'ModelCategory')?.parameterId}
                >
                    <Input disabled />
                </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
                <Form.Item
                    name="vehicleGroupCode"
                    label="Vehicle Group Code"
                    rules={[{ required: true, message: 'Please input the Vehicle Group Code!' }]}
                >
                    <Input />
                </Form.Item>
            </Col>
        </Row>
        <Form.Item style={{ textAlign: "end", paddingTop: "2rem" }}>
            <Button style={{ width: "40%" }} type="primary" htmlType="submit">
                Submit
            </Button>
        </Form.Item>
    </Form>
</Card>

  );
}

export default AddModel;
