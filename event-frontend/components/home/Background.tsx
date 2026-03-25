export default function Background() {
  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      className="absolute top-0 left-0 w-full h-full object-cover"
    >
      <source src="/spiral.mp4" type="video/mp4" />
    </video>
  );
}