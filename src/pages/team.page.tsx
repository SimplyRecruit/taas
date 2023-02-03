
import { useState } from 'react';
import { Button, Input, Modal, Pagination, Select, Space, Table } from 'antd';
import { FiEdit2, FiSearch } from "react-icons/fi"
import { SearchOutlined } from "@ant-design/icons"


export default function Team() {
  const roles = ['Admin', 'Manager', 'End-user'];
  const actionColumnWidth = 60;
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Hourly Rate',
      dataIndex: 'hourlyRate',
      key: 'hourlyRate',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string, record: any) => (
        <Select
          value={role}
          onChange={(value) => handleRoleChange(record, value)}
        >
          {roles.map((r) => (
            <Select.Option value={r} key={r}>
              {r}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: '',
      key: 'action',
      width: actionColumnWidth,
      render: () => (
        <span>
          <FiEdit2 type="edit" style={{ cursor: 'pointer' }} />
        </span>
      ),
    },
  ];

  const dummyData = [
    {
      key: 1,
      name: 'John Doe',
      email: 'johndoe@example.com',
      hourlyRate: 50,
      role: 'Developer',
      status: "active",
    },
    {
      key: 2,
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      hourlyRate: 60,
      role: 'Designer',
      status: "inactive",
    },
  ];
  const [modalOpen, setModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState(dummyData);
  const [data, setData] = useState(dummyData);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const handleRoleChange = (record: any, value: string) => {
    const updatedData = [...data];
    const index = updatedData.findIndex((d) => d.key === record.key);
    updatedData[index].role = value;
    setData(updatedData);
    filterData(selectedStatus, searchText);
  };
  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    filterData(value, searchText);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    filterData(selectedStatus, value);
  };

  const filterData = (status: string, search: string) => {
    let filtered = data;
    if (status !== 'all') {
      filtered = filtered.filter(item => item.status === status);
    }
    if (search) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredData(filtered);
  };
  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <Space size="small">
          <Select defaultValue="all" style={{ width: 120 }} onChange={handleStatusChange}>
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="active">Active</Select.Option>
            <Select.Option value="inactive">Inactive</Select.Option>
          </Select>
          <Input
            prefix={<SearchOutlined />}
            allowClear
            placeholder="Search Name"
            value={searchText}
            onChange={e => handleSearch(e.target.value)}
            style={{ width: 200 }}
          />
        </Space>
        <Button type='primary' onClick={() => setModalOpen(true)}>Add Client</Button>
      </div>
      <Table columns={columns} dataSource={filteredData} pagination={{
        position: ['bottomCenter'],
        responsive: true,
        showQuickJumper: false,
        showLessItems: true,
        showTotal: (total) => `Total ${total} clients`,
        showSizeChanger: false,
      }} />
      <Modal
        title="Add Client"
        open={modalOpen}
        onOk={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
      >
        {/* Add form inputs to capture new client data */}
      </Modal>
    </div>
  )
}
