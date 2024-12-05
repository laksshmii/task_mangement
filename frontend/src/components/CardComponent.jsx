import React from "react";
import { Card, CardBody, CardTitle } from "reactstrap";

function CardComponent({ title, content }) {
  return (
    <Card>
      <CardBody>
        <CardTitle tag="h5">{title}</CardTitle>
        {typeof content === "string" ? <p>{content}</p> : content}
      </CardBody>
    </Card>
  );
}

export default CardComponent;
