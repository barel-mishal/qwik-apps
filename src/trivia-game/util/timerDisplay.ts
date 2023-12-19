export default (timeSec: number) => {
    const minutes = Math.floor(timeSec / 60);
    const seconds = timeSec % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }