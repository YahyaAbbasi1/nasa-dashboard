import React, { Fragment } from "react";
import { Row, Col } from "antd";
import { useMediaQuery } from "react-responsive";

interface ActionsBarProps {
  left?: React.ReactNode;
  middle?: React.ReactNode;
  right?: React.ReactNode;
}

const ActionsBar: React.FC<ActionsBarProps> = (props: ActionsBarProps) => {
  const isSmallScreen = useMediaQuery({ maxWidth: 768 });

  const { left, middle, right } = props;
  

  const hasLeft = !!left;
  const hasMiddle = !!middle;
  const hasRight = !!right;
  

  if (isSmallScreen) {
    return (
      <Fragment>
        <Row
          style={{
            display: "flex",
            marginTop: "5px",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "4px",
            padding: "0 16px",
            margin: "0",
            flexWrap: "wrap",
          }}
        >
          {hasLeft && (
            <Col
              span={24}
              style={{
                display: "flex",
                gap: "6px",
                alignItems: "center",
                justifyContent: "flex-start",
                padding: "0",
                margin: "0 0 8px 0",
                order: 1,
              }}
            >
              {left}
            </Col>
          )}
          
          {hasMiddle && (
            <Col
              span={24}
              style={{
                display: "flex",
                gap: "6px",
                alignItems: "center",
                justifyContent: "center",
                padding: "0",
                margin: "0 0 8px 0",
                order: hasLeft ? 2 : 1,
              }}
            >
              {middle}
            </Col>
          )}
          
          {hasRight && (
            <Col
              span={24}
              style={{
                display: "flex",
                gap: "6px",
                alignItems: "center",
                justifyContent: hasLeft || hasMiddle ? "flex-start" : "flex-end",
                padding: "0",
                margin: "0",
                order: 3,
              }}
            >
              {right}
            </Col>
          )}
        </Row>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Row
        style={{
          display: "flex",
          marginTop: "5px",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "4px",
          padding: "0 16px",
          margin: "0",
        }}
      >
        {hasLeft && hasMiddle && hasRight && (
          <>
            <Col
              span={8}
              style={{
                display: "flex",
                gap: "6px",
                alignItems: "center",
                justifyContent: "flex-start",
                padding: "0",
                margin: "0",
              }}
            >
              {left}
            </Col>
            
            <Col
              span={8}
              style={{
                display: "flex",
                gap: "6px",
                alignItems: "center",
                justifyContent: "center",
                padding: "0",
                margin: "0",
              }}
            >
              {middle}
            </Col>
            
            <Col
              span={8}
              style={{
                display: "flex",
                gap: "6px",
                alignItems: "center",
                justifyContent: "flex-end",
                padding: "0",
                margin: "0",
              }}
            >
              {right}
            </Col>
          </>
        )}
        {hasLeft && hasMiddle && !hasRight && (
          <>
            <Col
              span={12}
              style={{
                display: "flex",
                gap: "6px",
                alignItems: "center",
                justifyContent: "flex-start",
                padding: "0",
                margin: "0",
              }}
            >
              {left}
            </Col>
            
            <Col
              span={12}
              style={{
                display: "flex",
                gap: "6px",
                alignItems: "center",
                justifyContent: "flex-end",
                padding: "0",
                margin: "0",
              }}
            >
              {middle}
            </Col>
          </>
        )}
        {hasLeft && !hasMiddle && hasRight && (
          <>
            <Col
              span={12}
              style={{
                display: "flex",
                gap: "6px",
                alignItems: "center",
                justifyContent: "flex-start",
                padding: "0",
                margin: "0",
              }}
            >
              {left}
            </Col>
            
            <Col
              span={12}
              style={{
                display: "flex",
                gap: "6px",
                alignItems: "center",
                justifyContent: "flex-end",
                padding: "0",
                margin: "0",
              }}
            >
              {right}
            </Col>
          </>
        )}
        {!hasLeft && hasMiddle && hasRight && (
          <>
            <Col
              span={12}
              style={{
                display: "flex",
                gap: "6px",
                alignItems: "center",
                justifyContent: "flex-start",
                padding: "0",
                margin: "0",
              }}
            >
              {middle}
            </Col>
            
            <Col
              span={12}
              style={{
                display: "flex",
                gap: "6px",
                alignItems: "center",
                justifyContent: "flex-end",
                padding: "0",
                margin: "0",
              }}
            >
              {right}
            </Col>
          </>
        )}
        {!hasLeft && hasMiddle && !hasRight && (
          <Col
            span={24}
            style={{
              display: "flex",
              gap: "6px",
              alignItems: "center",
              justifyContent: "center",
              padding: "0",
              margin: "0",
            }}
          >
            {middle}
          </Col>
        )}
        {hasLeft && !hasMiddle && !hasRight && (
          <Col
            span={24}
            style={{
              display: "flex",
              gap: "6px",
              alignItems: "center",
              justifyContent: "flex-start",
              padding: "0",
              margin: "0",
            }}
          >
            {left}
          </Col>
        )}
        {!hasLeft && !hasMiddle && hasRight && (
          <Col
            span={24}
            style={{
              display: "flex",
              gap: "6px",
              alignItems: "center",
              justifyContent: "flex-end",
              padding: "0",
              margin: "0",
            }}
          >
            {right}
          </Col>
        )}
      </Row>
    </Fragment>
  );
};

export default ActionsBar;