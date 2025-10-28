// === DỮ LIỆU PROJECT (DỊCH TỪ REACT) ===
const projects = [
  {
    year: 2025,
    title: "Embedded Systems - ATmega128-Based Egg Incubator Controller",
    description: "Engineered and prototyped a complete temperature and automation control system for an egg incubator, from circuit simulation in Proteus to a fully functional physical model.",
    tech: "ATmega128, Sensors (LM35,DHT22), Microchip Studio, ADC, PWM, Timer Interrupts, EEPROM."
  },
  {
    year: 2025,
    title: "Machine Learning - Hands Detection",
    description: "Developed and trained a Convolutional Neural Network (CNN) model. Applied Transfer Learning techniques using the VGG16 architecture, fine-tuning the model on a custom dataset of 5000+ images...",
    tech: "Python, TensorFlow, Keras, OpenCV, CNN, VGG16"
  },
  {
    year: 2024,
    title: 'Data-Driven Approaches to Volcanology. "When will Axial Seamount be erupted?"',
    description: "Provide visualization of hydrothermal plumesthe overthe years, using datacollected by COVIS. Create contour imagesrepresenting the spatial distribution in the diffuse hydrothermal flow.",
    tech: "Data Analysis, Visualization, Python"
  },
  {
    year: 2024,
    title: "Web Programming with HTML",
    description: "Designed and developed a fully responsive personal portfolio website from scratch using HTML5 and CSS, ensuring a seamless experience across all devices.",
    tech: "HTML5, CSS3, Visual Studio Code, Git."
  },
  {
    year: 2023,
    title: "Coding a polynomial equation",
    description: "Engineered a parser and calculator in C programing to compute polynomial equations from user-input character strings. Ensured accurate computation and robust error handling...",
    tech: "C, Data Structures and Algorithms."
  },
  {
    year: 2022,
    title: "Image Loader",
    description: "Developed an image processing application with a MATLAB GUI to enable users to effectively denoise digital images. Implemented and compared the performance of various filters...",
    tech: "MATLAB, GUI, Image Processing"
  }
];


document.addEventListener('DOMContentLoaded', function() {

    // --- LOGIC XỬ LÝ TABS ---
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            const tabId = link.getAttribute('data-tab');
            tabLinks.forEach(item => item.classList.remove('active'));
            tabContents.forEach(item => item.classList.remove('active'));
            link.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // --- SLIDER   ---
    const sliderContainer = document.querySelector('.slider');
    const navButtonsContainer = document.getElementById('navButtons');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');

    // Chỉ chạy code slider nếu các element tồn tại
    if (sliderContainer && navButtonsContainer && prevButton && nextButton) {
        let currentSlide = 0;
        let previousSlide = null;
        let slideTimer;
        const interval = 4000; // 4 giây
        let slides = [];
        let dots = [];

        // 1. Hàm khởi tạo slider: Tạo ra các slide và dấu chấm
        function initializeSlider() {
            projects.forEach((project, index) => {
                // Tạo slide
                const slide = document.createElement('div');
                slide.className = 'project-slide';
                slide.innerHTML = `
                    <div class="project-slide-content">
                        <span class="project-year">${project.year}</span>
                        <h4 class="project-title">${project.title}</h4>
                        <p class="project-description">${project.description}</p>
                        <p class="project-tech"><strong>Technologies:</strong> ${project.tech}</p>
                    </div>
                `;
                sliderContainer.appendChild(slide);
                slides.push(slide);

                // Tạo dấu chấm
                const dot = document.createElement('span');
                dot.className = 'line';
                dot.dataset.index = index; // Lưu index vào data-attribute
                navButtonsContainer.appendChild(dot);
                dots.push(dot);
            });
        }

        // 2. Hàm hiển thị slide: Cập nhật class 'active' và 'previous'
        function showSlide(index) {
            previousSlide = currentSlide;
            currentSlide = (index + projects.length) % projects.length; // Quay vòng

            slides.forEach((slide, i) => {
                slide.classList.remove('active', 'previous');
                if (i === currentSlide) {
                    slide.classList.add('active');
                }
                if (i === previousSlide) {
                    slide.classList.add('previous');
                }
            });

            dots.forEach((dot, i) => {
                dot.classList.remove('active');
                if (i === currentSlide) {
                    dot.classList.add('active');
                }
            });
        }

        // 3. Hàm Timer: Tự động chuyển slide
        function resetTimer() {
            clearInterval(slideTimer); // Xóa timer cũ
            slideTimer = setInterval(() => { // Đặt timer mới
                showSlide(currentSlide + 1);
            }, interval);
        }

        // 4. Gắn Event Listeners
        prevButton.addEventListener('click', () => {
            showSlide(currentSlide - 1);
            resetTimer();
        });

        nextButton.addEventListener('click', () => {
            showSlide(currentSlide + 1);
            resetTimer();
        });

        // Dùng event delegation cho các dấu chấm
        navButtonsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('line')) {
                const index = parseInt(e.target.dataset.index, 10);
                if (index !== currentSlide) {
                    showSlide(index);
                    resetTimer();
                }
            }
        });

        // 5. Khởi chạy slider
        initializeSlider();
        showSlide(0); // Hiển thị slide đầu tiên
        resetTimer(); // Bắt đầu tự động chạy
    }
    // --- HẾT LOGIC SLIDER MỚI ---



    // --- LOGIC XỬ LÝ BÀI TẬP (API)  ---
    const inClassResultsDiv = document.getElementById('api-in-class-results');

    // --- WIDGET THỜI TIẾT  ---
    
    function getWeatherInfo(code) {
        const weatherMap = {
            0: { description: 'Trời quang', icon: '☀️' }, 1: { description: 'Gần quang', icon: '🌤️' },
            2: { description: 'Ít mây', icon: '⛅' }, 3: { description: 'Nhiều mây', icon: '☁️' },
            45: { description: 'Sương mù', icon: '🌫️' }, 48: { description: 'Sương mù dày', icon: '🌫️' },
            51: { description: 'Mưa phùn nhẹ', icon: '🌦️' }, 53: { description: 'Mưa phùn', icon: '🌦️' },
            55: { description: 'Mưa phùn dày', icon: '🌦️' }, 61: { description: 'Mưa nhẹ', icon: '🌧️' },
            63: { description: 'Mưa vừa', icon: '🌧️' }, 65: { description: 'Mưa to', icon: '🌧️' },
            80: { description: 'Mưa rào nhẹ', icon: '🌧️' }, 81: { description: 'Mưa rào vừa', icon: '🌧️' },
            82: { description: 'Mưa rào to', icon: ' torrential rain' }, 95: { description: 'Dông', icon: '⛈️' },
        };
        return weatherMap[code] || { description: 'Không xác định', icon: '🤷' };
    }
    
    const weatherContainer = document.createElement('div');
    weatherContainer.id = 'weather-widget-container';
    weatherContainer.className = 'api-section';
    if(inClassResultsDiv) inClassResultsDiv.appendChild(weatherContainer);

    function fetchWeatherData(lat, lon, locationName) {
        weatherContainer.innerHTML = `<p>Đang cập nhật thời tiết tại ${locationName}...</p>`;
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

        fetch(weatherUrl)
            .then(response => response.json())
            .then(data => {
                const weather = data.current_weather;
                const now = new Date();
                const formattedTime = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
                const { description, icon } = getWeatherInfo(weather.weathercode);
                
                weatherContainer.innerHTML = `
                    <h5>Thời tiết</h5>
                    <div class="weather-status">
                        <span class="weather-icon">${icon}</span>
                        <div>
                            <strong>${description}</strong>
                            <p style="margin: 0; font-size: 0.9em;">Nhiệt độ: ${weather.temperature}°C / Gió: ${weather.windspeed} km/h</p>
                        </div>
                    </div>
                    <p><small>Vị trí: ${locationName} (Cập nhật lúc: ${formattedTime})</small></p>
                    <button id="refresh-weather-btn" class="widget-button">Làm mới</button>
                `;
            }).catch(error => {
                console.error('Lỗi khi gọi Open-Meteo API:', error);
                weatherContainer.innerHTML = `<p>Lỗi, không thể tải dữ liệu thời tiết.</p>`;
            });
    }

    function geolocationSuccess(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`)
            .then(res => res.json())
            .then(data => {
                let locationName = 'Vị trí hiện tại';
                if (data && data.address) {
                    const address = data.address;
                    const locationParts = [
                        address.suburb,
                        address.city_district,
                        address.city || address.state
                    ];
                    const constructedName = locationParts.filter(Boolean).join(', ');
                    if (constructedName) {
                        locationName = constructedName;
                    } else if (data.display_name) {
                        locationName = data.display_name;
                    }
                }
                fetchWeatherData(lat, lon, locationName);
            })
            .catch((error) => {
                console.error("Lỗi khi dịch ngược địa chỉ:", error);
                fetchWeatherData(lat, lon, 'Vị trí hiện tại');
            });
    }

    function geolocationError() {
        console.log("Không thể lấy vị trí. Sử dụng vị trí mặc định.");
        const fallbackLat = 10.8231;
        const fallbackLon = 106.6297;
        const fallbackName = 'TP. Hồ Chí Minh (mặc định)';
        fetchWeatherData(fallbackLat, fallbackLon, fallbackName);
    }

    function initializeWeatherWidget() {
        if (!weatherContainer) return;
        weatherContainer.innerHTML = `<p>Đang xin phép truy cập vị trí của bạn...</p>`;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError);
        } else {
            geolocationError();
        }
    }

    // --- WIDGET POKEMON (Giữ nguyên) ---
    function fetchPikachuData() {
        if (!inClassResultsDiv) return;
        fetch('https://pokeapi.co/api/v2/pokemon/pikachu')
            .then(response => response.json())
            .then(data => {
                function findImageUrls(obj) { let urls = []; for (let key in obj) { if (typeof obj[key] === 'string' && obj[key] && obj[key].startsWith('http')) { urls.push(obj[key]); } else if (typeof obj[key] === 'object' && obj[key] !== null) { urls = urls.concat(findImageUrls(obj[key])); } } return [...new Set(urls)]; }
                const allSpriteUrls = findImageUrls(data.sprites);
                const pikachuSection = document.createElement('div');
                pikachuSection.className = 'api-section';
                pikachuSection.innerHTML = `<h5>Pokemon: ${data.name}</h5><img src="${data.sprites.front_default}" alt="Pikachu Sprite" style="width:120px; image-rendering: pixelated;"><br><button class="toggle-variants-btn widget-button">Hiện/Ẩn các biến thể</button><span id="pikachu-sprite-count"></span>`;
                const variantsContainer = document.createElement('div');
                variantsContainer.className = 'pikachu-variants';
                allSpriteUrls.forEach(url => { variantsContainer.innerHTML += `<img src="${url}" alt="Pikachu variant">`; });
                pikachuSection.appendChild(variantsContainer);
                inClassResultsDiv.appendChild(pikachuSection);
                pikachuSection.querySelector('#pikachu-sprite-count').textContent = `(Tìm thấy ${allSpriteUrls.length} ảnh)`;
                pikachuSection.querySelector('.toggle-variants-btn').addEventListener('click', () => { variantsContainer.classList.toggle('visible'); });
            }).catch(error => console.error('Lỗi khi gọi PokeAPI:', error));
    }

    // --- WIDGET TỶ GIÁ  ---
    const rateDisplay = document.getElementById('rate-display');
    const refreshButton = document.getElementById('refresh-button');
    function fetchExchangeRate() {
        if (!rateDisplay) return;
        rateDisplay.textContent = 'Đang cập nhật...';
        fetch('https://open.er-api.com/v6/latest/USD')
            .then(response => response.json())
            .then(data => { rateDisplay.textContent = `1 USD = ${parseFloat(data.rates.VND).toLocaleString('vi-VN')} VND`; })
            .catch(error => { console.error('Lỗi khi gọi Exchange Rate API:', error); rateDisplay.textContent = 'Lỗi, không thể tải tỷ giá.'; });
    }

    // --- GỌI CÁC HÀM & GẮN SỰ KIỆN  ---
    initializeWeatherWidget();
    fetchPikachuData();
    fetchExchangeRate();

    if(refreshButton) refreshButton.addEventListener('click', fetchExchangeRate);

    if(inClassResultsDiv) {
      inClassResultsDiv.addEventListener('click', function(event) {
          if (event.target && event.target.id === 'refresh-weather-btn') {
              initializeWeatherWidget();
          }
      });
    }
});