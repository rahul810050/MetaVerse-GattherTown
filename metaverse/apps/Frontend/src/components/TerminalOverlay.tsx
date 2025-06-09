const TerminalOverlay = () => {
  return (
    <div className="absolute inset-0 p-4">
      <div className="relative w-full h-full bg-cyber-terminal-bg backdrop-blur-sm border border-border rounded-lg overflow-hidden">
        <video
          className="w-full h-full object-cover rounded-lg"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/components/images/vdo1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default TerminalOverlay;
