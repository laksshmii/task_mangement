import React from "react";
import { Row, Col } from "reactstrap";

function TitleComponent({ title, className = "", align = "left" }) {
  return (
    <Row className={`my-3 ${className}`} style={{ textAlign: align }}>
      <Col>
        <h2 className="text-primary">{title}</h2>
      </Col>
    </Row>
  );
}

export default TitleComponent;
