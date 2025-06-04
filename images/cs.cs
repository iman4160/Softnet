@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
    font-family: 'Inter', sans-serif;
    background-color: #f6f9fe;
    color: #01377d;
}

.card {
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease-in-out;
}

.card:hover {
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
}

.metric-card {
    color: white;
    padding: 1.5rem;
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease-in-out;
}

.metric-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}

.metric-icon-wrapper {
    background-color: rgba(255, 255, 255, 0.2);
    padding: 0.75rem;
    border-radius: 50%;
    margin-right: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.metric-icon {
    width: 1.5rem;
    height: 1.5rem;
}

.bg-blue-gradient {
    background: linear-gradient(to right bottom, #01377d, #02459c);
}

.bg-green-gradient {
    background: linear-gradient(to right bottom, #01377d, #02459c);
}

.bg-yellow-gradient {
    background: linear-gradient(to right bottom, #ffd100, #fed211);
}

.bg-red-gradient {
    background: linear-gradient(to right bottom, #ffd100, #fed211);
}

.alert-custom {
    border-left: 4px solid;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.alert-critical {
    background-color: #fef2f2;
    border-color: #ef4444;
    color: #b91c1c;
}

.alert-warning {
    background-color: #fff8e6;
    border-color: #ffd100;
    color: #8d6b00;
}

.alert-info {
    background-color: #e6f0fa;
    border-color: #01377d;
    color: #01377d;
}

.chart-container {
    height: 300px;
    width: 100%;
}

.apply-filters-btn {
    background-color: #01377d;
    border-color: #01377d;
    color: white;
}

.apply-filters-btn:hover {
    background-color: #012a63;
    border-color: #012a63;
}

header.header-flex h1 {
    color: #01377d !important;
    font-weight: 700;
    text-align: left;
    padding-left: 80px;
}

header.header-flex {
    background-color: #ffd100;
    padding: 1rem;
    border-radius: 0.5rem;
}

header.header-flex .fa-bell {
    color: #01377d;
}

@media (max-width: 767.98px) {
    header.header-flex h1 {
        padding-left: 50px;
        font-size: 1.5rem;
    }
    .header-logo {
        height: 40px;
    }
    .header-flex {
        flex-direction: column;
        align-items: flex-start !important;
    }
    .header-flex h1 {
        margin-bottom: 1rem;
    }
    .filter-section {
        flex-direction: column;
        align-items: stretch !important;
    }
    .filter-section > div {
        width: 100%;
        margin-bottom: 1rem;
    }
    .filter-section button {
        width: 100%;
    }
}

.bg-purple-gradient {
    background: linear-gradient(to right bottom, #6a11cb, #2575fc);
}

.bg-orange-gradient {
    background: linear-gradient(to right bottom, #ff7e5f, #feb47b);
}

.header-logo {
    position: absolute;
    top: 8px;
    left: 20px;
    height: 60px;
    width: auto;
    z-index: 100;
}

@media (max-width: 767.98px) {
    .header-logo {
        height: 40px;
        left: 10px;
        top: 10px;
    }
}
