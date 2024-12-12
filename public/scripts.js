document.getElementById('search-btn').addEventListener('click', searchEmails);
document.getElementById('clear-btn').addEventListener('click', clearResults);
document.getElementById('copy-btn').addEventListener('click', copyEmails);
document.getElementById('export-btn').addEventListener('click', exportEmails);

let emailResults = [];

// Function to search for emails based on the keyword
async function searchEmails() {
    const keyword = document.getElementById('keyword').value.trim();
    if (!keyword) {
        alert('Please enter a keyword');
        return;
    }

    try {
        const response = await fetch('https://your-backend-url.com/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ keyword }),
        });

        const data = await response.json();
        emailResults = data.emails;

        if (emailResults.length === 0) {
            document.getElementById('results').innerHTML = 'No emails found.';
        } else {
            displayEmails();
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to display found emails
function displayEmails() {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = emailResults.map(email => `<p>${email}</p>`).join('');
}

// Function to clear the results
function clearResults() {
    document.getElementById('results').innerHTML = '';
    document.getElementById('keyword').value = '';
    emailResults = [];
}

// Function to copy emails to clipboard
function copyEmails() {
    const textToCopy = emailResults.join('\n');
    navigator.clipboard.writeText(textToCopy).then(() => {
        alert('Emails copied to clipboard!');
    });
}

// Function to export emails as a .txt file
function exportEmails() {
    const textToExport = emailResults.join('\n');
    const blob = new Blob([textToExport], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'emails.txt';
    link.click();
}
