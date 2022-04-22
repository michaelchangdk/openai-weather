import React, { useState, useEffect } from "react";
import Loading from "../components/Loading";
import Results from "../components/Results";
import Error from "../components/Error";
import CurrentWeather from "../components/CurrentWeather";
import Forecast from "../components/Forecast";
import Warning from "../components/Warning";

// Import Styled Components
import { Container } from "../styled_components/styledelements";

const Home = () => {
  // For Loading and Errors
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // FOR UI & CURRENT WEATHER
  const [weatherGroup, setWeatherGroup] = useState("");
  const [night, setNight] = useState("");

  // FOR RESPONSE
  const [result, setResult] = useState();
  const [sunrise, setSunrise] = useState();
  const [sunset, setSunset] = useState();
  const [temp, setTemp] = useState();
  const [warning, setWarning] = useState("");

  // FOR FORECAST
  const [hourly, setHourly] = useState([]);

  // ISSUE: Calling APIs twice
  useEffect(() => {
    bigMomma();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // For Logic
  let latitude;
  let longitude;
  let sunriseEpoch;
  let sunsetEpoch;
  let currentTimeEpoch;
  let currentHours;
  let windspeed;
  let humidity;
  let temperature;
  let weatherID;

  // For OpenAI Prompt
  let cityName;
  let weather;
  let weatherDescription;
  let time;

  // Get Coordinates
  const getCoords = async () => {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          return {
            long: position.coords.longitude,
            lat: position.coords.latitude,
          };
        },
        (error) => {
          setError(error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
        }
      );

      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    return {
      long: position.coords.longitude,
      lat: position.coords.latitude,
    };
  };

  // Fetch City
  // const fetchCity = async () => {
  //   const response = await fetch(
  //     `http://localhost:8000/city?latitude=${latitude}&longitude=${longitude}`
  //   );
  //   const cityData = await response.json();
  //   return cityData;
  // };

  // Fetch City via Netlify Function
  const fetchCity = async () => {
    const response = await fetch(
      `/.netlify/functions/fetchcity?latitude=${latitude}&longitude=${longitude}`
    );
    const cityData = await response.json();
    return cityData;
  };

  // Get Weather
  // const fetchWeather = async () => {
  //   const response = await fetch(
  //     `http://localhost:8000/weather?latitude=${latitude}&longitude=${longitude}`
  //   );
  //   const weatherData = await response.json();
  //   return weatherData;
  // };

  // Get Weather via Netlify Function
  const fetchWeather = async () => {
    const response = await fetch(
      `/.netlify/functions/fetchweather?latitude=${latitude}&longitude=${longitude}`
    );
    const weatherData = await response.json();
    return weatherData;
  };

  // Fetch AI Description via Netlify Function
  // Fetch AI Disclaimer
  // const callWarning = async () => {
  //   console.log("sent request to disclaimer");
  //   const fetchWarning = await fetch("http://localhost:8000/aiwarning");
  //   const data = await fetchWarning.json();
  //   return data;
  // };

  // Fetch AI Disclaimer via Netlify Function
  const callWarning = async () => {
    console.log("sent request to disclaimer");
    const fetchWarning = await fetch("/.netlify/functions/disclaimerai");
    const data = await fetchWarning.json();
    return data;
  };

  // Fetch AI Description
  // const callOpenAI = async (aiPrompt) => {
  //   console.log("sent request to openai");
  //   console.log(aiPrompt);
  //   const fetchDescription = await fetch(
  //     `http://localhost:8000/aidescription?aiPrompt=${encodeURI(aiPrompt)}`
  //   );
  //   const data = await fetchDescription.json();
  //   return data;
  // };

  const callOpenAI = async (aiPrompt) => {
    console.log("sent request to openai");
    console.log(aiPrompt);
    const fetchDescription = await fetch(
      `/.netlify/functions/weatherai?aiprompt=${encodeURI(aiPrompt)}`
    );
    const data = await fetchDescription.json();
    return data;
  };

  const bigMomma = async () => {
    setIsLoading(true);
    console.log("big momma started");
    await getCoords({
      enableHighAccuracy: true,
      timeout: 10000,
    }).then((position) => {
      latitude = position.lat;
      longitude = position.long;
    });

    console.log("geo resolve finished, starting fetch city");

    await fetchCity().then((city) => {
      cityName = city[0].local_names.en;
    });

    console.log("fetch city finished, fetch weather starting");

    await fetchWeather().then((weatherData) => {
      console.log(weatherData);
      weather = weatherData.current.weather[0].main;
      weatherDescription = weatherData.current.weather[0].description;
      sunriseEpoch = weatherData.current.sunrise * 1000;
      sunsetEpoch = weatherData.current.sunset * 1000;
      currentTimeEpoch = Date.now();
      currentHours = new Date().getHours();
      windspeed = weatherData.current.wind_speed;
      humidity = weatherData.current.humidity;
      temperature = weatherData.current.temp;
      weatherID = weatherData.current.weather[0].id;
      setSunrise(sunriseEpoch);
      setSunset(sunsetEpoch);
      setTemp(weatherData.current.temp);
      setWeatherGroup(weatherID);
      setHourly(weatherData.hourly);
      classifyTime();
      classifyWind();
      classifyHumid();
      classifyTemp();
      classifySun();
    });

    let aiPrompt = `Write a weather description paragraph in a self-doubting, sarcastic, and nihilistic tone, only using computer metaphors and digital jargon, based on inputs. Must include city name. 
    Inputs: 
    City name: ${cityName}. 
    Weather category: ${weather}. 
    Weather description: ${weatherDescription} 
    ${time} 
    Description:`;

    console.log("fetchweather finished, call open ai start");

    await callWarning().then((response) => {
      setWarning(response.choices[0].text);
    });

    await callOpenAI(aiPrompt).then((response) => {
      setResult(response.choices[0].text);
    });

    console.log("callopenai done, setisloading to false next");

    setIsLoading(false);
  };

  // Add some logic for nordics - when it's morning but before sunrise
  const classifyTime = () => {
    if (currentTimeEpoch < sunriseEpoch) {
      time = "Time of day: night.";
      setNight("Night");
    } else if (currentTimeEpoch > sunsetEpoch) {
      time = "Time of day: night.";
      setNight("Night");
    } else if (currentHours < 11) {
      time = "Time of day: morning.";
      setNight("Day");
    } else if (currentHours > 11 && currentHours < 14) {
      time = "Time of day: midday.";
      setNight("Day");
    } else if (currentHours > 14 && currentHours < 18) {
      time = "Time of day: afternoon.";
      setNight("Day");
    } else if (currentHours > 18) {
      time = "Time of day: evening.";
      setNight("Day");
    }
  };

  const classifyWind = () => {
    if (windspeed > 15) {
      weatherDescription += ". dangerously windy. ";
    }
    if (windspeed > 8) {
      weatherDescription += ". very windy. ";
    }
    if (windspeed > 5.5) {
      weatherDescription += ". windy. ";
    }
    if (windspeed <= 5.5 && windspeed > 3) {
      weatherDescription += ". light breeze. ";
    }
    if (windspeed <= 3) {
      weatherDescription += ". not windy. ";
    }
  };

  const classifyHumid = () => {
    if (humidity > 75) {
      weatherDescription += "uncomfortably humid. ";
    }
    if (humidity < 20) {
      weatherDescription += "uncomfortably dry. ";
    }
  };

  const classifyTemp = () => {
    if (temperature <= 0) {
      weatherDescription += "freezing. ";
    }
    if (temperature > 0 && temperature < 5) {
      weatherDescription += "cold. ";
    }
    if (temperature >= 5 && temperature < 10) {
      weatherDescription += "chilly. ";
    }
    if (temperature >= 10 && temperature < 15) {
      weatherDescription += "cool. ";
    }
    if (temperature >= 15 && temperature < 25) {
      weatherDescription += "warm. ";
    }
    if (temperature >= 25 && temperature < 30) {
      weatherDescription += "hot. ";
    }
    if (temperature >= 30 && temperature < 35) {
      weatherDescription += "too hot. ";
    }
    if (temperature >= 35) {
      weatherDescription += "dangerously hot. ";
    }
  };

  const classifySun = () => {
    if (time !== "Time of day: night." && weather === "Clear") {
      weatherDescription += "sunny. ";
    }
    if (
      time !== "Time of day: night." &&
      weatherDescription.includes("few clouds") === true
    ) {
      weatherDescription += "some sun. ";
    }
  };

  if (error.length > 0) {
    return <Error error={error} />;
  }
  if (loading) {
    return <Loading />;
  } else {
    return (
      <Container>
        <CurrentWeather
          weatherID={weatherGroup}
          night={night}
          sunrise={sunrise}
          sunset={sunset}
          temp={temp}
        />
        <Results
          results={result}
          key={result}
          weatherGroup={weatherGroup}
          night={night}
        />
        <Forecast hourly={hourly} night={night} />
        <Warning warning={warning} />
      </Container>
    );
  }
};

export default Home;
