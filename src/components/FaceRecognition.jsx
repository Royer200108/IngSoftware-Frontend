import React, { useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';

const FaceRecognition = () => {
    const videoRef = useRef();
    const canvasRef = useRef();

    useEffect(() => {
        const loadModels = async () => {
            try {
                await Promise.all([
                    faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
                    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
                    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
                ]);
                startWebcam();
            } catch (error) {
                console.error('Error loading models:', error);
            }
        };

        const startWebcam = () => {
            navigator.mediaDevices
                .getUserMedia({
                    video: true,
                    audio: false,
                })
                .then((stream) => {
                    videoRef.current.srcObject = stream;
                })
                .catch((error) => {
                    console.error('Error accessing webcam:', error);
                });
        };

        const getLabeledFaceDescriptions = async () => {
            const labels = ['Roger'];
            return Promise.all(
                labels.map(async (label) => {
                    const descriptions = [];
                    for (let i = 1; i <= 3; i++) {
                        const img = await faceapi.fetchImage(`./labels/${label}/${i}.png`);
                        const detections = await faceapi
                            .detectSingleFace(img)
                            .withFaceLandmarks()
                            .withFaceDescriptor();
                        descriptions.push(detections.descriptor);
                    }
                    return new faceapi.LabeledFaceDescriptors(label, descriptions);
                })
            );
        };

        const handleVideoPlay = async () => {
            const labeledFaceDescriptors = await getLabeledFaceDescriptions();
            const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

            const displaySize = {
                width: videoRef.current.width,
                height: videoRef.current.height,
            };
            faceapi.matchDimensions(canvasRef.current, displaySize);

            const detectionInterval = setInterval(async () => {
                const detections = await faceapi
                    .detectAllFaces(videoRef.current)
                    .withFaceLandmarks()
                    .withFaceDescriptors();

                const resizedDetections = faceapi.resizeResults(detections, displaySize);

                const context = canvasRef.current.getContext('2d');
                context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

                const results = resizedDetections.map((d) => {
                    return faceMatcher.findBestMatch(d.descriptor);
                });

                results.forEach((result, i) => {
                    const box = resizedDetections[i].detection.box;
                    const drawBox = new faceapi.draw.DrawBox(box, {
                        label: result.toString(),
                    });
                    drawBox.draw(canvasRef.current);
                });
            }, 100);

            return () => clearInterval(detectionInterval);
        };

        loadModels();

        if (videoRef.current) {
            videoRef.current.addEventListener('play', handleVideoPlay);
        }

        return () => {
            if (videoRef.current) {
                videoRef.current.removeEventListener('play', handleVideoPlay);
            }
            // Detener el stream de la webcam al desmontar
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <div className="face-recognition-container">
            <video
                ref={videoRef}
                width="600"
                height="450"
                autoPlay
                muted
                playsInline
            />
            <canvas
                ref={canvasRef}
                width="600"
                height="450"
                className="overlay-canvas"
            />
        </div>
    );
};

export default FaceRecognition;