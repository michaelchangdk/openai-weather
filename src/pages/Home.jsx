import React, { useState, useEffect } from "react";
import Loading from "../components/Loading";
import Error from "../components/Error";
import Results from "../components/Results";
import CurrentWeather from "../components/CurrentWeather";
import Forecast from "../components/Forecast";
import Warning from "../components/Warning";

// Import Styled Components
import { Container } from "../styled_components/styledelements";

const Home = () => {
  // For Loading and Errors
  const [loading, setIsLoading] = useState(true);
  const [foundError, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  let error = "";

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

  // Start API Calls
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
          setError(true);
          error = error.message;
          setErrorMessage(error);
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

  // Rate Limit Checker
  const rateLimit = async () => {
    console.log("sent rate limit tester");
    const fetchLimit = await fetch(`/.netlify/functions/ratelimit`);
    const data = await fetchLimit.json();
    console.log("rate limit data", data);
    error = data.error;
    console.log("error", error);
    if (error.length > 0) {
      setError(true);
      setIsLoading(false);
      setErrorMessage(error);
    }
  };

  // Fetch City via Netlify Function
  const fetchCity = async () => {
    console.log("sent rate limit tester");
    const response = await fetch(
      `/.netlify/functions/fetchcity?latitude=${latitude}&longitude=${longitude}`
    );
    const cityData = await response.json();
    return cityData;
  };

  // Get Weather via Netlify Function
  const fetchWeather = async () => {
    console.log("sent fetchweather request");
    const response = await fetch(
      `/.netlify/functions/fetchweather?latitude=${latitude}&longitude=${longitude}`
    );
    const weatherData = await response.json();
    return weatherData;
  };

  // Fetch AI Disclaimer via Netlify Function
  const callWarning = async () => {
    console.log("sent request to disclaimer");
    const fetchWarning = await fetch("/.netlify/functions/disclaimerai");
    const data = await fetchWarning.json();
    return data;
  };

  // Fetch AI Weather Description via Netlify Function
  const callOpenAI = async (aiPrompt) => {
    console.log("sent request to openai");
    console.log(aiPrompt);
    const fetchDescription = await fetch(
      `/.netlify/functions/weatherai?aiprompt=${encodeURI(aiPrompt)}`
    );
    const data = await fetchDescription.json();
    return data;
  };

  // Big Function for all of the API calls
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

    console.log("geolocation finished, starting rate limit");

    await rateLimit();

    if (error.length === 0) {
      console.log("rate limit not exceeded, starting fetch city");
      await fetchCity().then((city) => {
        console.log(city);
        cityName = city[0].local_names.en;
      });
    }

    if (error.length === 0) {
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
    }

    if (error.length === 0) {
      await callWarning().then((response) => {
        setWarning(response.choices[0].text);
        console.log("disclaimer", response.choices[0].text);
      });
    }

    let aiPrompt = `Write a weather description paragraph in a self-doubting, sarcastic, and nihilistic tone, only using computer metaphors and digital jargon, based on inputs. Must include city name. \nInputs: \nCity name: ${cityName}. \nWeather category: ${weather}. \nWeather description: ${weatherDescription} \nTime of day: ${time} \nDescription:`;

    if (error.length === 0) {
      console.log("fetchweather finished, call open ai start");
      await callOpenAI(aiPrompt).then((response) => {
        setResult(response.choices[0].text);
        console.log("weather response", response.choices[0].text);
        setIsLoading(false);
        console.log("callopenai done, setisloading to false");
      });
    }
  };

  // START Functions for AI Prompt
  const classifyTime = () => {
    if (currentTimeEpoch < sunriseEpoch) {
      time = "night.";
      setNight("Night");
    } else if (currentTimeEpoch > sunsetEpoch) {
      time = "night.";
      setNight("Night");
    } else if (currentHours <= 11) {
      time = "morning.";
      setNight("Day");
    } else if (currentHours > 11 && currentHours < 14) {
      time = "midday.";
      setNight("Day");
    } else if (currentHours >= 14 && currentHours < 18) {
      time = "afternoon.";
      setNight("Day");
    } else if (currentHours >= 18) {
      time = "evening.";
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
  // END Functions for AI Prompt

  return (
    <>
      {loading && <Loading />}
      {foundError && <Error key={errorMessage} error={errorMessage} />}
      {!loading && !foundError && (
        <Container>
          <CurrentWeather
            weatherID={weatherGroup}
            night={night}
            sunrise={sunrise}
            sunset={sunset}
            temp={temp}
          />
          <Results results={result} key={result} />
          <Forecast hourly={hourly} night={night} />
          <Warning warning={warning} />
        </Container>
      )}
    </>
  );
};

export default Home;
