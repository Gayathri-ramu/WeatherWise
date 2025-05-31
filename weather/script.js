document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const uploadBox = document.getElementById('uploadBox');
    const uploadPreview = document.getElementById('uploadPreview');
    const previewImage = document.getElementById('previewImage');
    const removeImageBtn = document.getElementById('removeImage');
    const detectBtn = document.getElementById('detectBtn');
    const resultsSection = document.getElementById('resultsSection');
    const originalImage = document.getElementById('originalImage');
    const resultImage = document.getElementById('resultImage');
    const fMeasure = document.getElementById('fMeasure');
    const processTime = document.getElementById('processTime');
    const loadingOverlay = document.getElementById('loadingOverlay');

    function showLoading() {
        loadingOverlay.style.display = 'flex';
        detectBtn.disabled = true;
        detectBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    }

    function hideLoading() {
        loadingOverlay.style.display = 'none';
        detectBtn.disabled = false;
        detectBtn.innerHTML = '<i class="fas fa-search"></i> Detect Forgery';
    }

    function resetUpload() {
        fileInput.value = '';
        uploadPreview.style.display = 'none';
        detectBtn.disabled = true;
        resultsSection.style.display = 'none';
    }

    detectBtn.addEventListener('click', async () => {
        if (!fileInput.files[0]) {
            alert('Please select an image first');
            return;
        }

        showLoading();

        try {
            // Create FormData object
            const formData = new FormData();
            formData.append('image', fileInput.files[0]);
            
            // Get parameters and validate them
            const params = {
                blockSize: parseInt(document.getElementById('blockSize').value) || 8,
                oklidThreshold: parseFloat(document.getElementById('oklidThreshold').value) || 3.5,
                correlationThreshold: parseInt(document.getElementById('correlationThreshold').value) || 8,
                vecLenThreshold: parseInt(document.getElementById('vecLenThreshold').value) || 100
            };

            // Append parameters as JSON string
            formData.append('params', JSON.stringify(params));

            // Send request to server
            const response = await fetch('/detect-forgery', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Server error occurred');
            }

            const result = await response.json();

            // Update the results section
            originalImage.src = result.originalImageUrl + '?t=' + new Date().getTime();
            resultImage.src = result.resultImageUrl + '?t=' + new Date().getTime();
            fMeasure.textContent = result.fMeasure.toFixed(4);
            processTime.textContent = `${result.processTime.toFixed(2)}s`;
            
            // Show results section
            resultsSection.style.display = 'block';
            
            // Scroll to results
            resultsSection.scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error('Error:', error);
            alert('Error: ' + (error.message || 'Failed to process image'));
        } finally {
            hideLoading();
        }
    });

    // File input change handler
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && isValidImage(file)) {
            handleImageUpload(file);
        }
    });

    // Drag and drop handlers
    uploadBox.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadBox.classList.add('drag-over');
    });

    uploadBox.addEventListener('dragleave', () => {
        uploadBox.classList.remove('drag-over');
    });

    uploadBox.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadBox.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file && isValidImage(file)) {
            fileInput.files = e.dataTransfer.files;
            handleImageUpload(file);
        }
    });

    removeImageBtn.addEventListener('click', resetUpload);

    function isValidImage(file) {
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            alert('Please upload a valid image file (JPEG or PNG)');
            return false;
        }
        return true;
    }

    function handleImageUpload(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.src = e.target.result;
            uploadPreview.style.display = 'block';
            detectBtn.disabled = false;
            resultsSection.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('search-btn');
    const locationInput = document.getElementById('location');
    const weatherInfo = document.getElementById('weather-info');

    searchBtn.addEventListener('click', getWeather);
    locationInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            getWeather();
        }
    });

    async function getWeather() {
        const cityName = locationInput.value.trim();
        if (!cityName) {
            showError('Please enter a city name');
            return;
        }

        try {
            const apiKey = 'd850f7f52bf19300a9eb4b0aa6b80f0d'; // Your API key
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
            
            const response = await fetch(url);
            const data = await response.json();

            if (data.cod === '404') {
                showError('City not found');
                return;
            }

            const temp = (data.main.temp - 273.15).toFixed(1);
            const weather = data.weather[0].description;
            const humidity = data.main.humidity;
            const pressure = data.main.pressure;

            displayWeather({
                city: cityName,
                temperature: temp,
                description: weather,
                humidity: humidity,
                pressure: pressure
            });

        } catch (error) {
            showError('Failed to fetch weather data');
        }
    }

    function displayWeather(data) {
        weatherInfo.style.display = 'block';
        weatherInfo.innerHTML = `
            <h2>${data.city}</h2>
            <div class="weather-details">
                <p><i class="fas fa-temperature-high"></i> Temperature: ${data.temperature}°C</p>
                <p><i class="fas fa-cloud"></i> Conditions: ${data.description}</p>
                <p><i class="fas fa-tint"></i> Humidity: ${data.humidity}%</p>
                <p><i class="fas fa-compress-alt"></i> Pressure: ${data.pressure} hPa</p>
            </div>
        `;
    }

    function showError(message) {
        weatherInfo.style.display = 'block';
        weatherInfo.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>${message}</p>
            </div>
        `;
    }
});

// Contact Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        try {
            // Here you would typically send the data to your backend
            // For demonstration, we'll just show a success message
            showSuccessMessage();
            contactForm.reset();
        } catch (error) {
            showError('Failed to send message. Please try again.');
        }
    });

    function showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.style.display = 'block';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            Thank you for your message! We'll get back to you soon.
        `;
        
        contactForm.appendChild(successDiv);
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Navigation handling
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Update active link based on scroll position
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight/3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Smooth scroll and active link handling
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(link => link.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Smooth scroll to target section
            const targetId = this.getAttribute('href').slice(1);
            const targetSection = document.getElementById(targetId);
            targetSection.scrollIntoView({ behavior: 'smooth' });
        });
    });
});

// API endpoints
const API_URL = 'http://localhost:3000';
const WEATHER_API_KEY = 'your_weather_api_key';

// DOM elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const weatherForm = document.getElementById('search-btn');
const weatherInfo = document.getElementById('weather-info');
const weatherHistory = document.getElementById('weather-history');

let token = localStorage.getItem('token');

// Authentication functions
async function login(email, password) {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (data.token) {
            token = data.token;
            localStorage.setItem('token', token);
            showWeatherHistory();
        }
        return data;
    } catch (err) {
        console.error('Login error:', err);
    }
}

async function register(name, email, password) {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        return await response.json();
    } catch (err) {
        console.error('Registration error:', err);
    }
}

// Weather functions
async function getWeather(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
        );
        const data = await response.json();
        
        if (data.cod === 200) {
            displayWeather(data);
            if (token) {
                saveWeatherHistory(data);
            }
        }
    } catch (err) {
        console.error('Weather fetch error:', err);
    }
}

async function saveWeatherHistory(weatherData) {
    try {
        await fetch(`${API_URL}/weather-history`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                city: weatherData.name,
                temperature: weatherData.main.temp,
                description: weatherData.weather[0].description
            })
        });
        showWeatherHistory();
    } catch (err) {
        console.error('Save history error:', err);
    }
}

async function showWeatherHistory() {
    try {
        const response = await fetch(`${API_URL}/weather-history`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const history = await response.json();
        displayWeatherHistory(history);
    } catch (err) {
        console.error('Fetch history error:', err);
    }
}

// Display functions
function displayWeather(data) {
    weatherInfo.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <div class="weather-details">
            <p class="temperature">${Math.round(data.main.temp)}°C</p>
            <p class="description">${data.weather[0].description}</p>
            <p class="humidity">Humidity: ${data.main.humidity}%</p>
            <p class="wind">Wind: ${data.wind.speed} m/s</p>
        </div>
    `;
}

function displayWeatherHistory(history) {
    const historyList = document.querySelector('.history-list');
    historyList.innerHTML = history.map(item => `
        <div class="history-item">
            <p>${item.city}: ${item.temperature}°C - ${item.description}</p>
            <small>${new Date(item.search_time).toLocaleString()}</small>
        </div>
    `).join('');
    weatherHistory.classList.remove('hidden');
}

// Event listeners
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const result = await login(email, password);
    if (result.token) {
        alert('Logged in successfully!');
        loginForm.reset();
    }
});

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const result = await register(name, email, password);
    if (result.message) {
        alert('Registered successfully! Please login.');
        registerForm.reset();
    }
});

weatherForm.addEventListener('click', () => {
    const city = document.getElementById('location').value;
    if (city) {
        getWeather(city);
    }
});

// Initialize
if (token) {
    showWeatherHistory();
}