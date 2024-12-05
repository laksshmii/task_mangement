import React from "react";
import { Row, Col } from "reactstrap";
import CardComponent from "../components/CardComponent";
import ListComponent from "../components/ListComponent";
import TitleComponent from "../components/TitleComponent";

function Dashboard() {
  const employeeCount = "150";
  const pendingApprovals = "10";
  const tasksCompleted = "85%";

  const deadlines = ["Project X: Dec 10", "Project Y: Dec 15"];
  const activities = ["John submitted a report", "Anna updated her profile"];

  return (
    <div style={{ padding: "20px" }}>
      <TitleComponent title="Dashboard" align="left " />
      <Row>
        <Col md={4}>
          <CardComponent title="Total Employees" content={employeeCount} />
        </Col>
        <Col md={4}>
          <CardComponent title="Pending Approvals" content={pendingApprovals} />
        </Col>
        <Col md={4}>
          <CardComponent title="Tasks Completed" content={tasksCompleted} />
        </Col>
      </Row>
      <Row className="mt-4">
        <Col md={6}>
          <CardComponent
            title="Upcoming Deadlines"
            content={<ListComponent items={deadlines} />}
          />
        </Col>
        <Col md={6}>
          <CardComponent
            title="Recent Activities"
            content={<ListComponent items={activities} />}
          />
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
