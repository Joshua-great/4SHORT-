// Function to handle alert for shortened URL
function alertShortUrl(shortUrl) {
    alert('Shortened URL: ' + shortUrl);
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    function generateQRCode(url, qrCodeElement) {
      qrcode.toCanvas(qrCodeElement, url);
    }
  
    document.getElementById('shortenForm').addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const form = event.target;
      const originalUrl = form.elements.originalUrl.value;
  
      try {
        const response = await fetch('/shorten-url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ originalUrl })
        });
  
        if (!response.ok) {
          throw new Error('Failed to shorten URL');
        }
  
        const data = await response.json();
  
        if (response.ok) {
          alertShortUrl(data.shortUrl);
          data.originalUrl = originalUrl;
          data.clicks = 0;
          const tableData = getTableData();
          tableData.push(data); 
          saveTableData(tableData); 
          renderTable(); 
        } else {
          throw new Error('Response status not ok');
        }
      } catch (error) {
        console.error(error);
        alert('An error occurred. Please try again.');
      }
    });
  
    
    const renderTable = () => {
      console.log("Rendering table...");
      const tableBody = document.querySelector('#historyTable tbody');
      console.log("Table body element:", tableBody);
  
      const tableData = getTableData();
      console.log("Table data:", tableData);
  
      let totalClicks = 0;
      let locationClicks = {};
      tableData.forEach((row) => {
        totalClicks += row.clicks;
      
        if (row.location) {
          if (!locationClicks[row.location]) {
            locationClicks[row.location] = 0;
          }
          locationClicks[row.location] += row.clicks;
        }
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${row.originalUrl}</td>
          <td>${row.shortUrl}</td>
          <td>${row.clicks}</td>
          <td><canvas class="qr-code" data-url="${row.shortUrl}"></canvas></td>
          <td><button class="download-btn" data-url="${row.shortUrl}">Download QR</button></td>
          <td><button class="delete-btn">Delete</button></td>
        `;
        tableBody.appendChild(tr);
  
        
        const qrCodeCanvas = tr.querySelector('.qr-code');
        generateQRCode(row.shortUrl, qrCodeCanvas);
      });
  
  
      console.log("Total Clicks:", totalClicks);
      document.getElementById('totalClicks').textContent = totalClicks;
  
      const locationPercentageList = document.getElementById('locationPercentage');
      locationPercentageList.innerHTML = '';
  
      for (const location in locationClicks) {
        if (locationClicks.hasOwnProperty(location)) {
          const percentage = ((locationClicks[location] / totalClicks) * 100).toFixed(2);
          console.log(`${location}: ${percentage}%`);
          const li = document.createElement('li');
          li.textContent = `${location}: ${percentage}%`;
          locationPercentageList.appendChild(li);
        }
      }
  
      document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', () => {
          const url = button.dataset.url;
          copyToClipboard(url);
          alert('Copied to clipboard: ' + url);
        });
      });
  
    
      document.querySelector('#historyTable').addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-btn')) {
          const row = event.target.closest('tr');
          const tableData = getTableData();
          const index = Array.from(row.parentNode.children).indexOf(row); // Get row index
          tableData.splice(index, 1); 
          saveTableData(tableData); 
          renderTable(); 
        }
      });
  
      console.log("Table rendering complete.");
    };
  
   
    renderTable();
  });