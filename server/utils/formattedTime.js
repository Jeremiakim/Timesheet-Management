export default function formattedTime(timeString) {
  const time = new Date(timeString);
  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  return hours + "." + minutes;
}
