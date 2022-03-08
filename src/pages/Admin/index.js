import React, {useState} from 'react';
import {Card, Typography, Table, Button, Tag, Modal, Form, Input, Row, Col, Select, message, Spin} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import Icon, {EditOutlined, EyeOutlined, DeleteOutlined, ExclamationCircleOutlined} from '@ant-design/icons';
import {observer} from "mobx-react-lite";
import {useStore} from "../../utils/useStore";

const {Title} = Typography;

export const Admin = observer(() => {
    const store = useStore();
    const [form] = Form.useForm();
    const [isModal, setIsModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [IDData, setIDData] = useState('');

    const styles = {
        actionFooter: {
            display: 'flex',
            justifyContent: 'end',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: '5px',
        },
    };

    const statusValues = (record) => {
        switch (record || '') {
            case 'transferred':
                return <Tag color={'green'}>Transferred</Tag>;
            case 'not_available':
                return <Tag color={'red'}>Not Available</Tag>;
            default:
                return record;
        }
    };

    async function onSubmit(data) {
        try {
            setIsLoading(true);
            const body = {
                artistName: data.artist,
                email: data.email,
                firstName: data.firstname,
                lastName: data.lastname,
                bankName: data.bank_name,
                accountNumber: data.bank_account_no,
                accountName: data.bank_account_holder_name,
                phone: data.phone_number,
                status: data.status,
            };

            if (isEdit) {
                await store.admin.update(IDData, body);
            } else {
                await store.admin.create(body);
            }

            setIsLoading(false);
        } catch (e) {
            message.error(e);
        }
    };

    const modalAddRevenue = () => {
        return (
            <Modal
                title={
                    <Title level={4} strong>
                        {isEdit ? 'Edit Revenue' : 'Add Revenue'}
                    </Title>
                }
                visible={isModal}
                maskClosable={false}
                closable={true}
                onCancel={() => setIsModal(false)}
                footer={
                    <div style={styles.actionFooter}>
                        <Button
                            onClick={() => {
                                setIsModal(false);
                                setIsEdit(false);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type='primary'
                            onClick={() => {
                                form.validateFields().then((values) => {
                                    onSubmit(values);
                                });
                            }}
                        >
                            Submit
                        </Button>
                    </div>
                }
            >
                <Form form={form} layout={'vertical'}>
                    <Form.Item name={'artist'} label={'Artist Name'}>
                        <Input disabled defaultValue={'DJ Cemplek'}/>
                    </Form.Item>
                    <Form.Item
                        name={'email'}
                        label={'Email'}
                        rules={[
                            {
                                required: true,
                                message: 'Please input your email!',
                            },
                        ]}
                    >
                        <Input placeholder={'Input email'}/>
                    </Form.Item>
                    <Row gutter={24}>
                        <Col>
                            <Form.Item
                                name={'firstname'}
                                label={'First Name'}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input firstname!',
                                    },
                                ]}
                            >
                                <Input placeholder={'Input firstname'}/>
                            </Form.Item>
                        </Col>
                        <Col>
                            <Form.Item
                                name={'lastname'}
                                label={'Last Name'}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input lastname!',
                                    },
                                ]}
                            >
                                <Input placeholder={'Input lastname'}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col>
                            <Form.Item
                                name={'bank_name'}
                                label={'Bank Name'}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input bank name!',
                                    },
                                ]}
                            >
                                <Input placeholder={'Input bank name'}/>
                            </Form.Item>
                        </Col>
                        <Col>
                            <Form.Item
                                name={'bank_account_no'}
                                label={'Bank Account Number'}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input bank account number!',
                                    },
                                ]}
                            >
                                <Input placeholder={'Input bank account number'}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        name={'bank_account_holder_name'}
                        label={'Bank Account Holder Name'}
                        rules={[
                            {
                                required: true,
                                message: 'Please input bank account holder name!',
                            },
                        ]}
                    >
                        <Input placeholder={'Input bank account holder name'}/>
                    </Form.Item>
                    <Form.Item
                        name={'phone'}
                        label={'Phone Number'}
                        rules={[
                            {
                                required: true,
                                message: 'Please input phone number!',
                            },
                        ]}
                    >
                        <Input placeholder={'Input phone number'}/>
                    </Form.Item>
                    <Form.Item
                        name={'status'}
                        label={'Status Transfer'}
                        rules={[
                            {
                                required: true,
                                message: 'Please select status transfer!',
                            },
                        ]}
                    >
                        <Select placeholder={'Select status transfer'}>
                            <Select.Option key='transferred' value={'transferred'}>
                                Transferred
                            </Select.Option>
                            <Select.Option key='not_available' value={'not_available'}>
                                Not Available
                            </Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        );
    };

    const modalDelete = (id) => {
        Modal.confirm({
            title: 'Hapus Transaksi',
            icon: <ExclamationCircleOutlined/>,
            content: 'Apakah anda yakin ingin mengahapus data transaksi ini?',
            okText: 'Oke',
            cancelText: 'Cancel',
            onOk() {
                store.admin.delete(id);
            }
        });
    };

    const columns = [
        {
            title: 'No. ',
            key: 'no',
            dataIndex: 'no',
        },
        {
            title: 'Date',
            key: 'date',
            dataIndex: 'date',
        },
        {
            title: 'Amount',
            key: 'amount',
            dataIndex: 'amount',
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            render: (record) => statusValues(record),
        },
        {
            title: 'Action',
            key: 'action',
            width: 120,
            align: 'center',
            render: (record) => (
                <div style={{display: 'flex', gap: '1em', justifyContent: 'center'}}>
                    <Button
                        type='link'
                        icon={<EditOutlined/>}
                        style={{color: '#000000'}}
                        onClick={() => {
                            setIDData(record.id);
                            setIsEdit(true);
                            setIsModal(true);
                        }}
                    />
                    <Button
                        type='link'
                        icon={<EyeOutlined/>}
                        style={{color: '#000000'}}
                    />
                    <Button
                        type='link'
                        icon={<DeleteOutlined/>}
                        style={{color: '#000000'}}
                        onClick={() => {
                            modalDelete(record.id);
                        }}
                    />
                </div>
            ),
        },
    ];

    const dataSource = [
        {
            key: 1,
            no: 1,
            date: '26/02/2022 12:21',
            amount: 'Rp. 25000',
            status: 'transferred',
        },
        {
            key: 2,
            no: 2,
            date: '26/02/2022 12:21',
            amount: 'Rp. 25000',
            status: 'not_available',
        },
        {
            key: 3,
            no: 3,
            date: '26/02/2022 12:21',
            amount: 'Rp. 25000',
            status: 'transferred',
        },
        {
            key: 4,
            no: 4,
            date: '26/02/2022 12:21',
            amount: 'Rp. 25000',
            status: 'transferred',
        },
        {
            key: 5,
            no: 5,
            date: '26/02/2022 12:21',
            amount: 'Rp. 25000',
            status: 'transferred',
        },
        {
            key: 6,
            no: 6,
            date: '26/02/2022 12:21',
            amount: 'Rp. 25000',
            status: 'not_available',
        },
        {
            key: 7,
            no: 7,
            date: '26/02/2022 12:21',
            amount: 'Rp. 25000',
            status: 'not_available',
        },
        {
            key: 8,
            no: 8,
            date: '26/02/2022 12:21',
            amount: 'Rp. 25000',
            status: 'transferred',
        },
        {
            key: 9,
            no: 9,
            date: '26/02/2022 12:21',
            amount: 'Rp. 25000',
            status: 'not_available',
        },
        {
            key: 10,
            no: 10,
            date: '26/02/2022 12:21',
            amount: 'Rp. 25000',
            status: 'not_available',
        },
        {
            key: 11,
            no: 11,
            date: '26/02/2022 12:21',
            amount: 'Rp. 25000',
            status: 'transferred',
        },
    ];

    return (
        <Card
            title={<Title level={4} strong>Admin</Title>}
            extra={
                <Button type={'primary'} icon={<PlusOutlined/>} onClick={() => setIsModal(true)}>
                    Add Revenue
                </Button>
            }
        >
            {modalAddRevenue()}
            <Spin spinning={isLoading}>
                <Table columns={columns} dataSource={dataSource} scroll={{x: 'max-content', y: 400}}/>
            </Spin>
        </Card>
    );
});
