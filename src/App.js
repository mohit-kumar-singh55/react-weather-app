import React, { Component } from 'react'
import './App.css';
import "weather-icons/css/weather-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Weather from './components/Weather';
import Form from './components/Form';
import Alert from './components/Alert';

// api call api.openweathermap.org/data/2.5/weather?q=London,uk&appid={API key}
// env is not working
const api_key = "d7d3c2ff1cd71ecaf9f2e4eaa8a04065";

class App extends Component {
  constructor() {
    super();

    this.state = {
      city: undefined,
      country: undefined,
      icon: undefined,
      main: undefined,
      temp_celsius: undefined,
      temp_max: undefined,
      temp_min: undefined,
      description: "",
      error: false,
      alert: null
    }

    this.weatherIcon = {
      Thunderstorm: "wi-thunderstorm",
      Drizzle: "wi-sleet",
      Rain: "wi-storm-showers",
      Snow: "wi-snow",
      Atmosphere: "wi-fog",
      Clear: "wi-day-sunny",
      Clouds: "wi-day-fog"
    }
  }

  // function to convert f to celsius
  calCelsius(temp) {
    let cell = Math.floor(temp - 273.15);
    return cell;
  }

  getWeatherIcon(icons, rangeID) {
    switch (true) {
      case rangeID >= 200 && rangeID <= 232:
        this.setState({ icon: this.weatherIcon.Thunderstorm });
        break;
      case rangeID >= 300 && rangeID <= 321:
        this.setState({ icon: this.weatherIcon.Drizzle });
        break;
      case rangeID >= 500 && rangeID <= 531:
        this.setState({ icon: this.weatherIcon.Rain });
        break;
      case rangeID >= 600 && rangeID <= 622:
        this.setState({ icon: this.weatherIcon.Snow });
        break;
      case rangeID >= 701 && rangeID <= 781:
        this.setState({ icon: this.weatherIcon.Atmosphere });
        break;
      case rangeID === 800:
        this.setState({ icon: this.weatherIcon.Clear });
        break;
      case rangeID >= 801 && rangeID <= 804:
        this.setState({ icon: this.weatherIcon.Clouds });
        break;
      default:
        this.setState({ icon: this.weatherIcon.Clear });
    }
  }

  // Show Alert
  showAlert = (message) => {
    this.setState({
      alert: {
        msg: message
      }
    })
    setTimeout(() => {
      this.setState({
        alert: null
      })
    }, 2000);
  }

  getWeather = async (e) => {
    e.preventDefault();

    try {
      const city = e.target.elements.city.value;
      const country = e.target.elements.country.value;

      if (city && country) {
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${api_key}`;

        let api_call = await fetch(url);

        let response = await api_call.json();

        this.setState({
          city: `${response.name}, ${response.sys.country}`,
          temp_celsius: this.calCelsius(response.main.temp),
          temp_min: this.calCelsius(response.main.temp_min),
          temp_max: this.calCelsius(response.main.temp_max),
          description: response.weather[0].description,
          error: false
        });

        this.getWeatherIcon(this.weatherIcon, response.weather[0].id);
      }
      else {
        this.setState({ error: true })
      }
    }
    catch (e) {
      this.showAlert("Typo Occured! Please check spelling mistakes and try again");
    }
  }


  render() {
    return (
      <div className="App">
        <Alert alert={this.state.alert} />
        <Form loadWeather={this.getWeather} error={this.state.error} />
        <Weather
          city={this.state.city}
          country={this.state.country}
          temp_celsius={this.state.temp_celsius}
          temp_min={this.state.temp_min}
          temp_max={this.state.temp_max}
          description={this.state.description}
          weatherIcon={this.state.icon} />
      </div>
    )
  }
}

export default App;
