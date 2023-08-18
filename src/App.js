import React, { useState } from "react";
import axios from "axios";
import { Button, Input, Table, Typography, Row, Col, message } from "antd";

const { TextArea } = Input;
const { Title } = Typography;

function App() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleExecute = async () => {
    try {
      const response = await axios.post("http://localhost:3001/execute", {
        query,
      });

      if (response.status === 500) {
        message.error("Server Error: Something went wrong.");
      } else {
        message.success("Query executed successfully!");
        setResult(response.data);
      }
    } catch (error) {
      console.error("Error executing SQL:", error);
      message.error("An error occurred while executing the SQL.");
    }
  };

  const columns = result[0]
    ? Object.keys(result[0]).map((key) => ({
        title: key,
        dataIndex: key,
        key: key,
      }))
    : [];

  return (
    <div style={{ padding: "32px" }}>
      <Row
        justify="center"
        align="middle"
        className="row-title-bar"
        style={{ padding: "10px 0", marginBottom: "20px" }}
      >
        <Col>
          <Title level={2}>SQL Executor</Title>
        </Col>
      </Row>

      <TextArea
        rows={5}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your SQL query"
        style={{ marginBottom: "20px" }}
      />
      <Button type="primary" onClick={handleExecute} size="large">
        Execute
      </Button>

      <div
        style={{
          maxWidth: "calc(100vw - 80px)", // Subtracting 80px for left and right padding of 40px each
          overflowX: "auto",
          marginTop: "20px",
        }}
      >
        <Table
          dataSource={result}
          columns={columns}
          rowKey={(record, index) => index}
          pagination={{
            current: page,
            pageSize: rowsPerPage,
            total: result.length,
            onChange: (page) => setPage(page),
            onShowSizeChange: (_, size) => setRowsPerPage(size),
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "25"],
          }}
          bordered
        />
      </div>
    </div>
  );
}

export default App;
