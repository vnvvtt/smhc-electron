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

const DisplayCardsNoImage = ({ cardTitle1, cardMessage1, footerMessage, cardBackGroundColor, cardTitle2, cardMessage2 }) => {
    return (
        <Card className="card-stats flex-fill" style={{ backgroundColor: { cardBackGroundColor } }}>
            <CardBody>
                <Row>
                    <Col md="6" xs="5" className="my-auto">
                        <div className="numbers">
                            <p className="card-category" style={{ fontSize: "14px" }}>{cardTitle1}</p>
                            <CardTitle tag="p">{cardMessage1}</CardTitle>
                            <p />
                        </div>
                    </Col>
                    <Col md="6" xs="7">
                        <div className="numbers">
                            <p className="card-category" style={{ fontSize: "14px" }}>{cardTitle2}</p>
                            <CardTitle tag="p">{cardMessage2}</CardTitle>
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

export default DisplayCardsNoImage
