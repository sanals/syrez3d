export default function NeumorphismSandboxPage() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <iframe 
        src="/neumorphism/index.html" 
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Interactive Neumorphism Builder Sandbox"
      />
    </div>
  );
}
