document.addEventListener('DOMContentLoaded', function() {
    let pieChart, lineChart, barChart;

    let activeStartDate = null;
    let activeEndDate = null;
    let activeVerificationType = 'all'; // State variable for granular filtering

    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const verificationTypeInput = document.getElementById('verificationType'); // Get the new select element
    const applyFiltersBtn = document.getElementById('apply-filters-btn');

    const reportTableContainer = document.getElementById('reportTableContainer'); // Container for the table

    // Function to format date to YYYY-MM-DD for input fields
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Set default dates for the input fields to the last 7 days from current date
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6); // Includes today

    startDateInput.value = formatDate(sevenDaysAgo);
    endDateInput.value = formatDate(today);

    // Initialize active filters with the default values
    activeStartDate = startDateInput.value;
    activeEndDate = endDateInput.value;

    // --- Function to generate mock data for KPI cards and charts ---
    // This function remains largely the same as its data is used for KPIs/charts,
    // not directly for the detailed report table, but it includes the filter logic.
    function generateMockData() {
        const totalVerifications = Math.floor(Math.random() * 10000) + 5000;
        const successfulVerifications = Math.floor(totalVerifications * (0.85 + Math.random() * 0.1)); // 85-95% success        const failedVerifications = totalVerifications - successfulVerifications;
        const successRate = ((successfulVerifications / totalVerifications) * 100).toFixed(2);
        const failedVerifications = totalVerifications - successfulVerifications;
        const newCustomers = Math.floor(Math.random() * 500) + 100;
        const pendingVerifications = Math.floor(Math.random() * 50) + 5;
        const failedAttempts = Math.floor(Math.random() * 100) + 10;
        const avgProcessingTime = `${(Math.random() * 5 + 1).toFixed(1)}s`; // 1 to 6 seconds


        // Simulate filtering based on activeVerificationType for KPIs
        let filteredTotalVerifications = totalVerifications;
        let filteredNewCustomers = newCustomers;
        let filteredPendingVerifications = pendingVerifications;
        let filteredSuccessfulVerifications = successfulVerifications;

        if (activeVerificationType !== 'all') {
            const filterFactor = 0.5 + Math.random() * 0.3; // Reduce by 20-50%
            filteredTotalVerifications = Math.floor(totalVerifications * filterFactor);
            filteredSuccessfulVerifications = Math.floor(successfulVerifications * filterFactor);
            filteredNewCustomers = Math.floor(newCustomers * filterFactor);
            filteredPendingVerifications = Math.floor(pendingVerifications * filterFactor / 2);
        }

        const filteredSuccessRate = ((filteredSuccessfulVerifications / filteredTotalVerifications) * 100).toFixed(2);
        const filteredErrorRate = ((100 - filteredSuccessRate)).toFixed(2);

        const trends = [];
        const daily = [];

        let start = new Date(activeStartDate);
        let end = new Date(activeEndDate);

        if (start > end) {
            [start, end] = [end, start];
        }

        let currentDate = new Date(start);
        while (currentDate <= end) {
            const formattedDate = currentDate.toISOString().split('T')[0];
            let dailySuccess = Math.floor(Math.random() * 200) + 50;
            let dailyError = Math.floor(Math.random() * 30) + 5;
            let dailyNewCustomers = Math.floor(Math.random() * 50) + 10;
            let dailyPending = Math.floor(Math.random() * 10) + 1;
            let dailyFailed = Math.floor(Math.random() * 15) + 3;

            if (activeVerificationType !== 'all') {
                const dailyFilterFactor = 0.6 + Math.random() * 0.2;
                dailySuccess = Math.floor(dailySuccess * dailyFilterFactor);
                dailyError = Math.floor(dailyError * dailyFilterFactor);
                dailyNewCustomers = Math.floor(dailyNewCustomers * dailyFilterFactor);
                dailyPending = Math.floor(dailyPending * dailyFilterFactor);
                dailyFailed = Math.floor(dailyFailed * dailyFilterFactor);
            }

            trends.push({
                date: formattedDate,
                success: dailySuccess,
                error: dailyError,
            });
            daily.push({
                date: formattedDate,
                newCustomers: dailyNewCustomers,
                pending: dailyPending,
                failed: dailyFailed,
            });
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return {
            totalVerifications: filteredTotalVerifications,
            successRate: parseFloat(filteredSuccessRate),
            errorRate: parseFloat(filteredErrorRate),
            newCustomers: filteredNewCustomers,
            pendingVerifications: filteredPendingVerifications,
            failedAttempts,
            avgProcessingTime,
            verificationTrends: trends,
            dailyMetrics: daily,
        };
    }

    let alerts = [];

    function renderAlerts() {
        const alertsContainer = document.getElementById('alerts-container');
        alertsContainer.innerHTML = '';
        const alertCountSpan = document.getElementById('alert-count');

        if (alerts.length > 0) {
            alertCountSpan.classList.remove('d-none');
            alertCountSpan.textContent = alerts.length;
        } else {
            alertCountSpan.classList.add('d-none');
        }

        alerts.forEach(alert => {
            const alertDiv = document.createElement('div');
            alertDiv.className = `alert-custom ${alert.severity === 'critical' ? 'alert-critical' : alert.severity === 'warning' ? 'alert-warning' : 'alert-info'}`;
            alertDiv.setAttribute('data-alert-id', alert.id);

            let iconClass = '';
            if (alert.severity === 'critical') {
                iconClass = 'fas fa-exclamation-circle';
            } else if (alert.severity === 'warning') {
                iconClass = 'fas fa-bell';
            } else {
                iconClass = 'fas fa-info-circle';
            }

            alertDiv.innerHTML = `
                <div class="d-flex align-items-center">
                    <i class="${iconClass} me-3"></i>
                    <p class="mb-0 fw-medium">${alert.message}</p>
                </div>
                <button type="button" class="alert-dismiss-btn" data-alert-id="${alert.id}">
                    Dismiss
                </button>
            `;
            alertsContainer.appendChild(alertDiv);
        });

        alertsContainer.querySelectorAll('.alert-dismiss-btn').forEach(button => {
            button.addEventListener('click', function() {
                const alertId = parseInt(this.getAttribute('data-alert-id'));
                alerts = alerts.filter(alert => alert.id !== alertId);
                renderAlerts();
            });
        });
    }

    function updateMetricCards(data) {
        document.getElementById('totalVerifications').textContent = data.totalVerifications.toLocaleString();
        document.getElementById('newCustomers').textContent = data.newCustomers.toLocaleString();
        document.getElementById('pendingVerifications').textContent = data.pendingVerifications.toLocaleString();
        document.getElementById('avgProcessingTime').textContent = data.avgProcessingTime;
        // REMOVE these two lines:
        // document.getElementById('slaMetRate').textContent = `${data.slaMetRate}%`;
        // document.getElementById('avgResolutionTime').textContent = data.avgResolutionTime;
    }

    function updateCharts(data) {
        const pieCtx = document.getElementById('pieChart').getContext('2d');
        if (pieChart) pieChart.destroy();
        pieChart = new Chart(pieCtx, {
            type: 'pie',
            data: {
                labels: ['Success', 'Error'],
                datasets: [{
                    data: [data.successRate, data.errorRate],
                    backgroundColor: ['#01377d', '#EF4444'],
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed !== null) {
                                    label += context.parsed + '%';
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });

        const lineCtx = document.getElementById('lineChart').getContext('2d');
        if (lineChart) lineChart.destroy();
        lineChart = new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: data.verificationTrends.map(d => d.date),
                datasets: [
                    {
                        label: 'Successful Verifications',
                        data: data.verificationTrends.map(d => d.success),
                        borderColor: '#01377d',
                        backgroundColor: 'rgba(1, 55, 125, 0.2)',
                        fill: true,
                        tension: 0.3
                    },
                    {
                        label: 'Failed Verifications',
                        data: data.verificationTrends.map(d => d.error),
                        borderColor: '#EF4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.2)',
                        fill: true,
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: false,
                    }
                },
                scales: {
                    x: {
                        beginAtZero: false,
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        const barCtx = document.getElementById('barChart').getContext('2d');
        if (barChart) barChart.destroy();
        barChart = new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: data.dailyMetrics.map(d => d.date),
                datasets: [
                    {
                        label: 'New Customers',
                        data: data.dailyMetrics.map(d => d.newCustomers),
                        backgroundColor: '#01377d',
                    },
                    {
                        label: 'Pending',
                        data: data.dailyMetrics.map(d => d.pending),
                        backgroundColor: '#ffd100',
                    },
                    {
                        label: 'Failed',
                        data: data.dailyMetrics.map(d => d.failed),
                        backgroundColor: '#ef4444',
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: false,
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // --- Main update function (renamed to renderDashboard for clarity) ---
    function renderDashboard() { // Renamed from updateDashboard
        const newData = generateMockData(); // Generates data for KPIs and charts based on filters
        updateMetricCards(newData);
        updateCharts(newData);

        // Update Data Freshness Indicator
        const now = new Date();
        document.getElementById('dataFreshness').textContent = now.toLocaleString();

        // Alerts logic
        if (newData.errorRate > 10 && !alerts.some(a => a.type === 'error-rate')) {
            alerts.push({
                id: Date.now(),
                type: 'error-rate',
                message: `Critical: High Error Rate Detected: ${newData.errorRate}%!`,
                severity: 'critical',
            });
        } else if (newData.errorRate <= 10) {
            alerts = alerts.filter(a => a.type !== 'error-rate');
        }

        if (newData.pendingVerifications > 20 && !alerts.some(a => a.type === 'pending-verifications')) {
            alerts.push({
                id: Date.now() + 1,
                type: 'pending-verifications',
                message: `Warning: Increased Pending Verifications: ${newData.pendingVerifications}`,
                severity: 'warning',
            });
        } else if (newData.pendingVerifications <= 20) {
            alerts = alerts.filter(a => a.type !== 'pending-verifications');
        }

        renderAlerts();
    }

    // --- Event Listener for Apply Filters button ---
    applyFiltersBtn.addEventListener('click', function() {
        const newStartDate = startDateInput.value;
        const newEndDate = endDateInput.value;
        const newVerificationType = verificationTypeInput.value;

        if (!newStartDate || !newEndDate || new Date(newStartDate) > new Date(newEndDate)) {
            alert('Please select valid start and end dates where the start date is not after the end date.');
            return;
        }
        activeStartDate = newStartDate;
        activeEndDate = newEndDate;
        activeVerificationType = newVerificationType;

        renderDashboard(); // Update KPIs and Charts
        displayCustomReportTable(); // Update the table
    });

    // Report Generation (CSV download)
    function generateCustomReport() {
        // This function will generate a CSV of the full mock data, regardless of current filters
        const reportData = [
            ["Report Date", "Verification Type", "Status", "Customer ID", "Processing Time (s)"],
            ["2025-05-28", "Identity", "Success", "CUST001", "2.5"],
            ["2025-05-28", "Address", "Error", "CUST002", "3.1"],
            ["2025-05-29", "Identity", "Success", "CUST003", "1.8"],
            ["2025-05-29", "Financial", "Pending", "CUST004", "N/A"],
            ["2025-05-30", "Identity", "Success", "CUST005", "2.0"],
            ["2025-05-30", "AML", "Success", "CUST006", "4.2"],
            ["2025-05-28", "AML", "Success", "CUST007", "1.9"],
            ["2025-05-29", "Address", "Success", "CUST008", "2.7"],
            ["2025-05-30", "Identity", "Error", "CUST009", "3.5"],
            ["2025-06-01", "Financial", "Success", "CUST010", "2.1"],
            ["2025-06-02", "Identity", "Pending", "CUST011", "N/A"],
            ["2025-06-03", "AML", "Error", "CUST012", "4.0"],
            ["2025-06-03", "Identity", "Success", "CUST013", "1.5"]
        ];

        let csvContent = reportData.map(e => e.join(",")).join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'KYC_Custom_Report.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            alert('Custom report "KYC_Custom_Report.csv" has been generated and downloaded!');
        } else {
            alert('Your browser does not support automatic downloads. Here is your report data:\n\n' + csvContent);
        }
    }

    // Function to display report as a table on the page (NOW WITH FILTERING)
    function displayCustomReportTable() {
        // Raw data (always includes header + all possible rows)
        const rawReportData = [
            ["Report Date", "Verification Type", "Status", "Customer ID", "Processing Time (s)"], // Header row
            ["2025-05-28", "Identity", "Success", "CUST001", "2.5"],
            ["2025-05-28", "Address", "Error", "CUST002", "3.1"],
            ["2025-05-29", "Identity", "Success", "CUST003", "1.8"],
            ["2025-05-29", "Financial", "Pending", "CUST004", "N/A"],
            ["2025-05-30", "Identity", "Success", "CUST005", "2.0"],
            ["2025-05-30", "AML", "Success", "CUST006", "4.2"],
            // Adding more mock data for better filtering demonstration
            ["2025-05-28", "AML", "Success", "CUST007", "1.9"],
            ["2025-05-29", "Address", "Success", "CUST008", "2.7"],
            ["2025-05-30", "Identity", "Error", "CUST009", "3.5"],
            ["2025-06-01", "Financial", "Success", "CUST010", "2.1"],
            ["2025-06-02", "Identity", "Pending", "CUST011", "N/A"],
            ["2025-06-03", "AML", "Error", "CUST012", "4.0"],
            ["2025-06-03", "Identity", "Success", "CUST013", "1.5"]
        ];

        // Get filter values (these are accessible from the global scope of this script)
        const filterStartDate = new Date(activeStartDate);
        const filterEndDate = new Date(activeEndDate);
        const filterType = activeVerificationType;

        // Filter the data rows (excluding the header row for filtering logic)
        const filteredDataRows = rawReportData.slice(1).filter(row => {
            const rowDate = new Date(row[0]); // Column 0 is "Report Date"
            const rowType = row[1].toLowerCase(); // Column 1 is "Verification Type"

            // Ensure date comparison includes the entire day for endDate
            // Set end date to the end of the day (23:59:59.999) for inclusive filtering
            const adjustedFilterEndDate = new Date(filterEndDate);
            adjustedFilterEndDate.setHours(23, 59, 59, 999);


            const isDateMatch = rowDate >= filterStartDate && rowDate <= adjustedFilterEndDate;
            const isTypeMatch = filterType === 'all' || rowType === filterType.toLowerCase();

            return isDateMatch && isTypeMatch;
        });

        // Reconstruct the reportData array with the original header and the filtered rows
        const reportDataToDisplay = [rawReportData[0], ...filteredDataRows];

        let tableHtml = '<table class="table table-striped table-hover">';
        // Table Header
        tableHtml += '<thead><tr>';
        reportDataToDisplay[0].forEach(header => {
            tableHtml += `<th>${header}</th>`;
        });
        tableHtml += '</tr></thead>';

        // Table Body
        tableHtml += '<tbody>';
        // Loop from index 1 to skip the header row when generating table body content
        if (reportDataToDisplay.length > 1) { // Check if there are data rows besides the header
            for (let i = 1; i < reportDataToDisplay.length; i++) {
                tableHtml += '<tr>';
                reportDataToDisplay[i].forEach(cell => {
                    tableHtml += `<td>${cell}</td>`;
                });
                tableHtml += '</tr>';
            }
        } else {
            tableHtml += '<tr><td colspan="' + rawReportData[0].length + '">No data available for the selected filters.</td></tr>';
        }
        tableHtml += '</tbody>';
        tableHtml += '</table>';

        reportTableContainer.innerHTML = tableHtml;
    }

    function viewAuditLogs() {
        alert('Displaying audit logs... (This would normally load a detailed log viewer)');
    }

    function showAuditSupportDocumentation() {
        alert('Opening audit support documentation... (e.g., Compliance Guide, API Documentation)');
    }

    // Event listeners for report and audit buttons
    const generateReportBtn = document.getElementById('generateCustomReportBtn');
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', generateCustomReport);
    }

    const viewAuditLogsBtn = document.getElementById('viewAuditLogsBtn');
    if (viewAuditLogsBtn) {
        viewAuditLogsBtn.addEventListener('click', viewAuditLogs);
    }

    const auditSupportDocBtn = document.getElementById('auditSupportDocBtn');
    if (auditSupportDocBtn) {
        auditSupportDocBtn.addEventListener('click', showAuditSupportDocumentation);
    }

    // Initial dashboard load
    renderDashboard();        // Update KPIs and Charts
    displayCustomReportTable(); // Display the table with initial data
});