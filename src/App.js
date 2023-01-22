import React, {useState, useEffect, useRef} from 'react';
import quizImg from './images/quiz_starting.svg';
import closeIcon from './images/close-black-24dp.svg';
import checkIcon from './images/check_circle24dp.svg';
import winners from './images/winners.svg';
import './App.css';

function App() {

  const [country, setCountry] = useState([]);
  const [mode, setMode] = useState(parseInt((Math.random()*1).toFixed(0)));
  const [numRandom, setNumRandom] = useState(parseInt((Math.random()*3).toFixed(0)));
  const [score, setScore] = useState(0);
  const [showNext, setShowNext] = useState(false);
  const [end, setEnd] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const quizModal = useRef();

  const getData = async () => {
    setCountry([]);
    setMode(parseInt((Math.random()*1).toFixed(0)));
    setNumRandom(parseInt((Math.random()*3).toFixed(0)));
    setShowNext(false);
    let response = await fetch('https://restcountries.com/v3.1/all');
    let data = await response.json();
    let cca3Arr = [];
    for (let i = 0; i < data.length; i++) {
      cca3Arr.push(data[i].cca3);
    }
    let index = parseInt((Math.random()*250).toFixed(0));
    let cca3 = cca3Arr.slice(index, (index + 4));
    while (cca3.length < 4) {
      cca3 = cca3Arr.slice(index, (index + 4));
    }
    let codes = cca3.toString(); 
    fetch('https://restcountries.com/v3.1/alpha?codes=' + codes)
      .then(response => response.json())
      .then(data => {
        let dataModified = [];
        data.forEach((element, index) => {
          if (index === 0) element.option = "A";
          if (index === 1) element.option = "B";
          if (index === 2) element.option = "C";
          if (index === 3) element.option = "D";
          dataModified.push(element);
        });
        setCountry(dataModified);
      }, error => {
        console.log(error);
      })
  }

  const getResponse = (e) => {
    console.log(e)
    let a = 2, b = 3, c = 4, d = 5;
    if (mode === 1) {a++;b++;c++; d++;};
    e.target.ownerDocument.body.childNodes[3].childNodes[0].childNodes[1].childNodes[0].childNodes.forEach((node, index) => {
      if (index === a || index === b || index === c || index === d) {
        node.disabled = true;
        node.childNodes[2].style.opacity = 1;
        node.style.border = "1px solid #ff5151";
        node.style.color = "#fff";
        node.style.background = "#ff5151";
        if (node.firstElementChild.innerText === country[numRandom].name.common) {
          node.lastElementChild.src = checkIcon;
          node.style.background = "#47cb32";
          node.style.border = "1px solid #47cb32";
          node.style.color = "#fff";
        }
      }
    });
    try {
      if (e.target.childNodes[1].textContent === country[numRandom].name.common) {
        setScore(score + 1);
        setShowNext(true);
      } else {
        setTimeout(() => {
          quizModal.current.style.display = "none";
          setEnd(true);
        }, 2000);
      }
    } catch {
      if (e.target.parentElement.childNodes[1].textContent === country[numRandom].name.common) {
        setScore(score + 1);
        setShowNext(true);
      } else {
        setTimeout(() => {
          quizModal.current.style.display = "none";
          setEnd(true);
        }, 2000);
      }
    }
  }

  const next = () => {
    getData();
  }

  const tryAgain = () => {
    quizModal.current.style.display = "block";
    setScore(0);
    setEnd(false);
    getData();
  }

  return (
    <div className="App">
      <h1 className="title">COUNTRY QUIZ</h1>
      <main className="main" ref={quizModal}>
        {
          country.length === 4 ? (
            <div className="quiz">
              <img className="quiz-img" src={quizImg} alt="quiz"/>
              {
                mode === 0 ? (
                  <>
                    <h3>{country[numRandom].capital[0]} is the capital of</h3>
                  </>
                ) : (
                  <>
                    <div className="img-container">
                      <img src={country[numRandom].flags.svg} alt="country"/>
                    </div>
                    <h3>Which country does this flag belong to?</h3>
                  </>
                )
              }
              {
                country.map(element => {
                  return (
                    <button key={element.cca3} onClick={getResponse}>
                      {element.option}
                      <span>{element.name.common}</span>
                      <img className="icon" src={closeIcon} alt="icon"/>
                    </button>
                  );
                })
              }
              {
                showNext === true ? <div className="div-next"><button className="next" onClick={next}>Next</button></div> : ''
              }
            </div>
          ) : <div className="spinner"></div>
        }
      </main>
      {
        end === true ? (
          <div className="modal">
            <img src={winners} alt="quiz"/>
            <h1>Results</h1>
            <p>You got <span>{score}</span> correct answers</p>
            <button onClick={tryAgain}>Try again</button>
          </div>
        ) : ''
      }
    </div>
  );
}

export default App;
