import { useRef, useState } from 'react';
import { Button, Popconfirm, Table, message } from 'antd';
import { IUserDialogRef, IUserInfo } from '../../constants/type';
import UpdateUserInfoDialog from './UpdateUserInfoDialog';
import style from './index.module.scss';

const initDataSource = [
  {
    key: '1',
    name: '张三',
    sex: 1,
    age: 18,
    createdAt: new Date('2024-3-14 12:44:09').toLocaleString(),
  },
  {
    key: '2',
    name: '李四',
    sex: 2,
    age: 20,
    createdAt: new Date('2024-3-15 09:08:08').toLocaleString(),
  },
];

const Home = () => {
  const [dataSource, setDataSource] = useState<IUserInfo[]>(initDataSource);
  const ref = useRef<IUserDialogRef>(null);

  const getUniqueKey = () => {
    // 生成随机且唯一的key
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}}`;
  };

  const handleCreate = () => {
    ref.current?.create({
      options: {
        onOk: (newValue: IUserInfo) => {
          setDataSource([
            ...dataSource,
            {
              ...newValue,
              key: getUniqueKey(),
              createdAt: new Date().toLocaleString(),
            },
          ]);
          message.success('新增成功！');
        },
      },
    });
  };

  const handleEdit = (record: IUserInfo) => {
    ref.current?.edit({
      record,
      options: {
        onOk: (newValue: IUserInfo) => {
          const newData = dataSource.map(item => {
            if (item.key === newValue.key) {
              return newValue;
            }
            return item;
          });
          setDataSource(newData);
          message.success('更新成功！');
        },
      },
    });
  };

  const handleDelete = (record: IUserInfo) => {
    const newData = dataSource.filter(item => item.key !== record.key);
    setDataSource(newData);
    message.success('删除成功！');
  };

  const handleView = (record: IUserInfo) => {
    ref.current?.show({ record });
  };

  const defaultCell = (v: string) => {
    if (typeof v === 'undefined' || v === '') {
      return '-';
    }
    return v;
  };

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (v: string) => defaultCell(v),
    },
    {
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
      render: (v: number) => {
        if (!v) {
          return '-';
        }
        if (v === 1) {
          return '男';
        }
        return '女';
      },
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      render: (v: string) => defaultCell(v),
      sorter: (a: IUserInfo, b: IUserInfo) => {
        if (a.age === '' || b.age === '') {
          return false;
        }
        return a.age - b.age;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      defaultSortOrder: 'ascend',
      render: (v: string) => defaultCell(v),
      sorter: (a: IUserInfo, b: IUserInfo) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: '操作',
      width: 180,
      render: (record: IUserInfo) => {
        return (
          <div className={style.options}>
            <a onClick={() => handleView(record)}>详情</a>
            <a onClick={() => handleEdit(record)}>编辑</a>
            <Popconfirm
              title="删除用户"
              description="确定删除该用户吗?"
              onConfirm={() => handleDelete(record)}
              okText="确定"
              cancelText="取消">
              <a>删除</a>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  return (
    <div className={style.page}>
      <div className={style.title}>用户管理系统</div>
      <div className={style.create}>
        <Button type="primary" onClick={handleCreate}>
          新增
        </Button>
      </div>
      <Table dataSource={dataSource} columns={columns}></Table>
      <UpdateUserInfoDialog ref={ref} />
    </div>
  );
};

export default Home;
