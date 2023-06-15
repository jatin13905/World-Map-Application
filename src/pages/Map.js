import React, { useState } from 'react';
import raw_cities from '../data/cities.json';
import { Card, Row, Col, Spinner, Modal, Button } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css';
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import axios from 'axios';
import "../../src/Styles.css"

const Map=()=> {
    const _defaultCity = {
        'name': 'Delhi',
        'country': 'India',
        'latitude': 28.644800,
        'longitude': 77.216721
    }

    const [cityList] = useState(raw_cities);
    const [defaultCity] = useState(_defaultCity);
    const [selectedCity, setSelectedCity] = useState(null);
    const [weatherData, setWeatherData] = useState(null);
    const [weatherError, setWeatherError] = useState(null);
    const [isAlert, setIsAlert] = useState(false);
    const [isWeatherLoading, setIsWeatherLoading] = useState(true);
    const [isWeatherError, setIsWeatherError] = useState(false);
    const [displayWeatherModal, setDisplayWeatherModal] = useState(false);
    const [displayErrorModal, setDisplayErrorModal] = useState(false);
    const mapMarker = new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]});

    const showErrorModal = () => { setDisplayErrorModal(true) };
    const showWeatherModal = () => { setDisplayWeatherModal(true) };
    const hideWeatherModal = () => { setDisplayWeatherModal(false) };
    const resetStates = () => {
        setSelectedCity(null);
        setWeatherData(null);
        setIsWeatherLoading(true);
        setIsWeatherError(false);
        setDisplayWeatherModal(false);
        setDisplayErrorModal(false);
        setIsAlert(false);
    }

    const getWeather=(city)=> {
        showWeatherModal();
        const api_url = `https://api.openweathermap.org/data/2.5/onecall?lat=${city.latitude}&lon=${city.longitude}&exclude=minutely,hourly&appid=${`edb895d10505db5dafedb0b698a9bd0b`}`;
        setSelectedCity(city);
        axios.get(api_url)
            .then(response => {
                setWeatherData(response.data);
                if ("alerts" in response.data) {
                    setIsAlert(true);
                }
            })
            .then(() => {
                setIsWeatherLoading(false);
            })
            .catch(error => {
                setWeatherError(error.message);
                setIsWeatherError(true);
                hideWeatherModal();
                showErrorModal();
            })
    }

    const setTitleCase=(str)=> {
        if (str === null) {
            return "No Data Found";
        } else {
            str = str.toLowerCase();
            str = str.split(' ');
            for (let i = 0; i < str.length; i++) {
                str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
            }
            return str.join(' ');
        }
    }

    const getDateFromTimestamp=(timestamp)=> {
        timestamp = new Date(timestamp * 1000);
        return timestamp.getFullYear() + "-" + (timestamp.getMonth() + 1) + "-" + timestamp.getDate();
    }

    const getTimeFromTimestamp=(timestamp)=> {
        timestamp = new Date(timestamp * 1000);
        return timestamp.getHours() + ":" + timestamp.getMinutes() + ":" + timestamp.getSeconds();
    }

    return (
        <div>
            <MapContainer center={ [defaultCity.latitude, defaultCity.longitude] } zoom={4} minZoom={4} maxZoom={10} scrollWheelZoom={true} worldCopyJump={true}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                { cityList.map(city => (
                    <Marker key={ city.id } position={ [city.latitude, city.longitude] } icon={mapMarker} title={ city.name + ', ' + city.country } eventHandlers={{ click: () => { getWeather(city) }}} />
                ))}
            </MapContainer>

            {
                isWeatherLoading ?
                    <Modal show={ displayWeatherModal } backdrop="static">
                        <Modal.Body>
                            <h1 className="text-center"><Spinner animation="grow" /> Loading Weather Data</h1>
                        </Modal.Body>
                    </Modal>
                :
                <Modal show={ displayWeatherModal } onHide={ resetStates } backdrop="static" keyboard={ false } size="lg">
                        <Modal.Header closeButton>
                            <Modal.Title><img className="icon" src={"https://openweathermap.org/img/wn/" + weatherData.current.weather[0].icon + ".png"} alt="Weather Icon" /> { selectedCity.name }, { selectedCity.country }</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {
                                isAlert ? 
                                weatherData.alerts.map(alert => {
                                    return (
                                        <Card bg="danger" className="text-center mb-3" key={alert.event.toLowerCase() + '-' + alert.start}>
                                            <Card.Header><h3 style={{"textTransform":"uppercase"}}>{ alert.event }</h3></Card.Header>
                                            <Card.Body>{ alert.description }</Card.Body>
                                            <Card.Footer>Issued By: { alert.sender_name }</Card.Footer>
                                        </Card>
                                    )
                                }) : null
                            }
                            <Card border="secondary" className="mb-3">
                                <Card.Header><h4>Current Weather</h4></Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col>{ setTitleCase(weatherData.current.weather[0].description) }</Col>
                                        <Col>Temperature: { (weatherData.current.temp - 273.15).toFixed(2) } °C</Col>
                                        <Col>Feels Like: { (weatherData.current.feels_like - 273.15).toFixed(2) } °C</Col>
                                    </Row>
                                    <Row>
                                        <Col>Humidity: { weatherData.current.humidity }%</Col>
                                        <Col>Visibility: { weatherData.current.visibility } m</Col>
                                        <Col>Wind Speed: { weatherData.current.wind_speed } m/s</Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                            <Card border="secondary" className="mb-3">
                                <Card.Header><h4>7 Day Forecast</h4></Card.Header>
                                {
                                    weatherData.daily.map((day) => {
                                        return (
                                            <Card className="mt-2" key={day.dt}>
                                                <Card.Header>
                                                    <Row>
                                                        <Col>
                                                            <h5>{ getDateFromTimestamp(day.dt) }</h5>
                                                        </Col>
                                                        <Col>
                                                            <img className="icon" src={"https://openweathermap.org/img/wn/" + day.weather[0].icon + ".png"} alt="Weather Icon" /> { setTitleCase(day.weather[0].description) }
                                                        </Col>
                                                    </Row>
                                                </Card.Header>
                                                <Card.Body>
                                                    <Row>
                                                        <Col>Temperature: { (day.temp.day - 273.15).toFixed(2) } °C</Col>
                                                        <Col>Feels Like: { (day.feels_like.day - 273.15).toFixed(2) } °C</Col>
                                                    </Row>
                                                    <Row>
                                                        <Col>Humidity: { day.humidity }%</Col>
                                                        <Col>Wind Speed: { day.wind_speed } m/s</Col>
                                                    </Row>
                                                    <Row>
                                                        <Col>Sunrise: { getTimeFromTimestamp(day.sunrise) }</Col>
                                                        <Col>Sunset: { getTimeFromTimestamp(day.sunset) }</Col>
                                                    </Row>
                                                </Card.Body>
                                            </Card>
                                        )
                                    })
                                }
                            </Card>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="outline-primary" onClick={ resetStates }>Close Weather</Button>
                        </Modal.Footer>
                    </Modal>
            }

            {
                isWeatherError ?
                    <Modal show={ displayErrorModal } onHide={ resetStates } backdrop="static">
                        <Modal.Header closeButton>
                            <Modal.Title>An Error Occurred</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="text-center">
                            <code>{ weatherError }</code>
                        </Modal.Body>
                    </Modal>
                :
                null
            }
        </div>
    )
}

export default Map;