
self.onmessage = async () => {
  try {
    const response = await fetch('/output.json');
    const json = await response.json();
    self.postMessage({ success: true, data:  json?.details });
  } catch (error) {
    self.postMessage({ success: false, error: error.message });
  }
};
