import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faStop, faPlay, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Row,
    Col,
    Form,
    FormGroup,
    Label,
    Input,
    Container,
} from "reactstrap";
import "../../views/Test.css";

const SpeechToText = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioChunks, setAudioChunks] = useState([]);
    const mediaRecorderRef = useRef(null);
    const [responseText, setResponseText] = useState("");
    const [parsedText, setParsedText] = useState("");

    const handleStartRecording = () => {
        setIsRecording(true);
        // Start recording logic
    };

    const handleStopRecording = () => {
        setIsRecording(false);
        // Stop recording logic
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            if (mediaRecorderRef.current) {
                mediaRecorderRef.current = null;
                setAudioChunks([]);
            }

            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (event) => {
                setAudioChunks((prev) => [...prev, event.data]);
            };

            mediaRecorder.onstop = () => {
                stream.getTracks().forEach((track) => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error accessing the microphone:", err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const saveRecording = () => {
        if (audioChunks.length === 0) {
            console.log("No audio recorded.");
            return;
        }

        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);

        const link = document.createElement("a");
        link.href = audioUrl;
        link.download = "recorded_audio.wav";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log(audioBlob);
    };

    const sendRecordingToAPI = async () => {
        if (audioChunks.length === 0) {
            console.log("No audio recorded.");
            return;
        }

        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });

        try {
            const requestBody = new FormData();
            requestBody.append("file", audioBlob, "recorded_audio.wav");
            requestBody.append("model", "whisper-1");

            const response = await axios.post(
                "https://api.openai.com/v1/audio/translations",
                requestBody,
                {
                    headers: {
                        Authorization:
                            "Bearer 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",
                    },
                }
            );
            setResponseText(JSON.stringify(response.data));
            console.log("[Speech to Text]=>API response:", response.data.text);
            setParsedText(response.data.text);
        } catch (error) {
            console.error("Error sending audio to OpenAI API:", error);
        }
    };

    const parseTextToAPI = async () => {
        try {
            const convertedText = '{"text":"Patient name K L Ravikumar age 60 years complaints cough with fever for the past 5 days his vitals blood pressure 146 bar 88 mm Hg temperature 38 degree Celsius examination B slash L raunchy plus diagnosis fever for evaluation medicine suggested medicine number one augmentin 625 duo tablet one tablet in the morning one tablet in the night for five days to be taken on empty stomach medicine number two crocin advanced tablet one tablet when required for five days to be taken after food third tablet Xevinix C chewable tablet one tablet for 14 days to be taken in the morning investigation suggested C into RP slash a view CBC LFT RFT urine routine and microscopy and COVID-19 RT-PCR advice review with reports"}';
            const prompt = `Given the following medical text, extract and format the information in a structured JSON-like summary. "${convertedText}"`;
            const requestBody = {
                prompt: prompt,
                max_tokens: 1500, // Adjust this value based on how long you expect the summary to be
                temperature: 0.4, // Adjust for creativity, lower values make it more factual
            };
            const response = await axios.post(
                "https://api.openai.com/v1/engines/gpt-3.5-turbo-instruct/completions",
                requestBody,
                {
                    headers: {
                        Authorization:
                            "Bearer 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", // Replace with your OpenAI API key
                        "Content-Type": "application/json",
                    },
                }
            );
            if (
                response.data &&
                response.data.choices &&
                response.data.choices.length > 0
            ) {
                const summary = response.data.choices[0].text;
                console.log("response.data=", response.data);
                // console.log("Summarized and extracted information:", summary);
                // You can set this summary to the state or handle it as needed
            } else {
                console.log("No summary received from the API");
            }
        } catch (error) {
            console.error("Error sending audio to OpenAI API:", error);
        }
    };

    const handleConvert = () => {
        // Convert logic
    };

    return (
        <>
            <div className="content">
                <Row>
                    <Col md="12">
                        <Card>
                            <CardHeader>
                                <Button onClick={startRecording} disabled={isRecording}>
                                    Start Recording
                                </Button>
                                <Button onClick={stopRecording} disabled={!isRecording}>
                                    Stop Recording
                                </Button>
                                <Button onClick={saveRecording} disabled={audioChunks.length === 0}>
                                    Save Recording
                                </Button>
                                <Button onClick={sendRecordingToAPI} disabled={audioChunks.length === 0}>
                                    Send Recording to OpenAI API
                                </Button>
                                <Button onClick={parseTextToAPI} disabled={audioChunks.length === 0}>
                                    Send Text to OpenAI API for Parsing
                                </Button>
                            </CardHeader>
                            <CardBody>
                                <textarea
                                    value={responseText}
                                    readOnly
                                    style={{ width: "100%", height: "200px", color: "red" }}
                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        <Container>
                            <Row>
                                <Col sm="12" md={{ size: 8, offset: 2 }}>
                                    <Form>
                                        <FormGroup>
                                            <Label for="audioInput">Converting your audio to text</Label>
                                            <div className="d-flex align-items-start">
                                                <textarea
                                                    value={responseText}
                                                    readOnly
                                                    rows="12"
                                                    style={{ width: "100%", color: "red" }}
                                                />
                                                {/* <Input type="textarea" name="text" id="audioInput" disabled className="flex-grow-1 mr-2" /> */}
                                                <div className="d-flex flex-column">
                                                    <Button color="primary" onClick={startRecording} disabled={isRecording} className="mb-1">
                                                        <FontAwesomeIcon icon={faMicrophone} /> Start
                                                    </Button>
                                                    <Button color="danger" onClick={stopRecording} disabled={!isRecording} className="mb-1">
                                                        <FontAwesomeIcon icon={faStop} /> Stop
                                                    </Button>
                                                    <Button color="secondary" onClick={sendRecordingToAPI} disabled={audioChunks.length === 0}>
                                                        <FontAwesomeIcon icon={faSyncAlt} /> Convert
                                                    </Button>
                                                    <Button color="secondary" onClick={parseTextToAPI} disabled={audioChunks.length === 0}>
                                                        <FontAwesomeIcon icon={faPlay} /> Extract
                                                    </Button>
                                                </div>
                                            </div>
                                        </FormGroup>
                                    </Form>
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                </Row>
            </div>
        </>

    );

}

export default SpeechToText
