import React from 'react'
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardTitle,
    Row,
    Col,
} from "reactstrap";
import "../../views/Test.css"

const DisplayCards = ({ cardTitle, cardMessage, footerMessage, cardBackGroundColor, cardImage }) => {
    return (
        <Card className="card-stats flex-fill" style={{ backgroundColor: { cardBackGroundColor } }}>
            <CardBody>
                <Row>
                    <Col md="6" xs="5" className="my-auto">
                        <div className="icon-big text-center icon-warning">
                            <img
                                alt="SMHC"
                                src={cardImage}
                                className="img-fluid"
                            />
                        </div>
                    </Col>
                    <Col md="6" xs="7">
                        <div className="numbers">
                            <p className="card-category" style={{ fontSize: "14px" }}>{cardTitle}</p>
                            <CardTitle tag="p">{cardMessage}</CardTitle>
                            <p />
                        </div>
                    </Col>
                </Row>
            </CardBody>
            <CardFooter>
                <hr />
                <div className="stats">
                    <i className="fas fa-sync-alt" />{footerMessage}
                </div>
            </CardFooter>
        </Card>

    )
}

export default DisplayCards
