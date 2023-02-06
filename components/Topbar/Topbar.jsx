import React from "react";
import { Input, Space } from 'antd';
const { Search } = Input;


const Topbar = () => {
  const onSearch = (value) => console.log(value);
  return (
    <Space direction="vertical">
      <Search
        placeholder="Buscar"
        onSearch={onSearch}
        style={{
          width: 200,
        }}
      />
    </Space>
  );
};

export default Topbar;
