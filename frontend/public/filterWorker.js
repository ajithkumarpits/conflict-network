onmessage = function (e) {
  const { data, startDate, endDate, chunkSize = 1000 } = e.data;

  try {
    const filtered = data.filter((item) => {
      const eventDate = item.event_date_dt.split(" ")[0];
      return eventDate >= startDate && eventDate <= endDate;
    });

    const totalItems = filtered.length;
  
    let index = 0;

    function sendChunk() {
      if (index < totalItems) {
        const chunk = filtered.slice(index, index + chunkSize);
        postMessage({ success: true, chunk, done: false });
        index += chunkSize;

        setTimeout(sendChunk, 100);
      } else {
        postMessage({ success: true, done: true });
      }
    }

    sendChunk();
  } catch (err) {
    postMessage({ success: false, error: err.message });
  }
};
