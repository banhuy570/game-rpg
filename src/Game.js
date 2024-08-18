import React, { useState, useEffect } from "react";
import "./Game.css";

const getRandomPosition = (maxWidth, maxHeight) => {
  const x = Math.floor(Math.random() * (maxWidth - 50)); // Trừ 50 để đảm bảo ô tròn không bị cắt
  const y = Math.floor(Math.random() * (maxHeight - 50));
  return { x, y };
};

const Game = () => {
  const [points, setPoints] = useState(0);
  const [time, setTime] = useState(0);
  const [order, setOrder] = useState(1);
  const [cleared, setCleared] = useState(false);
  const [start, setStart] = useState(false);
  const [clickedCircles, setClickedCircles] = useState([]);
  const [circleOrder, setCircleOrder] = useState([]);
  const [positions, setPositions] = useState([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isStartButtonDisabled, setIsStartButtonDisabled] = useState(true);
  // Khởi động game
  useEffect(() => {
    if (start) {
      generateRandomOrder();
      setIsGameStarted(true);
    }
  }, [points, start]);
  // chạy timer
    useEffect(() => {
      if (start && !cleared) {
        const timer = setInterval(() => {
          setTime((prevTime) => parseFloat((prevTime + 0.1).toFixed(1)));
        }, 100);
        return () => clearInterval(timer);
      }
    }, [start, cleared]);
  // tạo mảng random các point
  const generateRandomOrder = () => {
    const numbers = Array.from({ length: points }, (_, i) => i + 1);
    const shuffledNumbers = numbers.sort(() => Math.random() - 0.5);
    setCircleOrder(shuffledNumbers);
    setPositions(
      shuffledNumbers.map(() => getRandomPosition(500, 500)) 
    );
  };
  // Xử lý sự kiện khi người chơi nhấn vào một vòng tròn
  const handleCircleClick = (num) => {
    if (num === order) {
      setClickedCircles([...clickedCircles, num]);
      setOrder(order + 1);
      if (num === points) {
        setTimeout(() => setCleared(true), 300);
      }
    } else {
      setGameOver(true);
      setStart(false);
    }
  };
 // Cập nhật số điểm và đặt lại trò chơi 
  const handlePointsChange = (e) => {
    const newPoints = Number(e.target.value);
    setPoints(newPoints);
    setIsStartButtonDisabled(newPoints < 1);
    resetGame();
  };
  // Reset game
  const resetGame = () => {
    setIsGameStarted(false);
    setTime(0);
    setOrder(1);
    setCleared(false);
    setClickedCircles([]);
    setStart(false);
    setGameOver(false);
  };
  // start new game
  const startGame = () => {
    resetGame();
    setStart(true);
  };

  return (
    <div className="bordered-div">
      <div>
        <h4>Let's Play</h4>
        <label>Points: </label>
        <input
          type="number"
          value={points}
          onChange={handlePointsChange}
          min="1"
        /> <label>(Nhập số lớn hơn 1) </label>
      </div>
      <div>
        <label>Time: {time}s</label>
      </div>
      <div>
        {!isGameStarted && <button onClick={startGame} disabled={isStartButtonDisabled} >Start</button>}
        {isGameStarted && <button onClick={resetGame}>Restart</button>}
      </div>
      <div className="game-board">
        {start && (
          <div>
            {circleOrder.map((num, index) => (
              <div
                key={num}
                className={`circle ${
                  clickedCircles.includes(num) ? "clicked" : ""
                }`}
                onClick={() => handleCircleClick(num)}
                style={{
                  left: positions[index].x,
                  top: positions[index].y,
                  position: "absolute",
                }}
              >
                {num}
              </div>
            ))}
          </div>
        )}
      </div>
      {cleared && <h3>All Cleared!</h3>}
      {gameOver && <h3 className="gameOver">Game Over!</h3>}
    </div>
  );
};

export default Game;
