// Global state
    let isAdmin = false;
    let currentUser = 'Sakin';
    let currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format

    // Custom alert function for sandbox environment
    function showCustomAlert(message) {
        // Create a temporary notification div
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-sm';
        notification.innerHTML = `
            <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
        
        console.log('📢 Custom Alert:', message);
    }

    // Sample data
    let residents = [
        { id: 1, apartment: 1, name: "Ahmet Yılmaz", phone: "0532 123 4567", email: "ahmet@email.com", status: "Aktif", monthlyDues: 850 },
        { id: 2, apartment: 2, name: "Ayşe Demir", phone: "0533 234 5678", email: "ayse@email.com", status: "Aktif", monthlyDues: 920 },
        { id: 3, apartment: 3, name: "Mehmet Kaya", phone: "0534 345 6789", email: "mehmet@email.com", status: "Aktif", monthlyDues: 780 },
        { id: 4, apartment: 4, name: "Fatma Yıldız", phone: "0535 456 7890", email: "fatma@email.com", status: "Aktif", monthlyDues: 850 },
        { id: 5, apartment: 5, name: "Ali Özkan", phone: "0536 567 8901", email: "ali@email.com", status: "Aktif", monthlyDues: 1050 }
    ];

    let dues = [
        { apartment: 1, resident: "Ahmet Yılmaz", amount: 850, status: "Ödendi", lastPayment: "15.01.2024" },
        { apartment: 2, resident: "Ayşe Demir", amount: 920, status: "Ödendi", lastPayment: "12.01.2024" },
        { apartment: 3, resident: "Mehmet Kaya", amount: 780, status: "Kısmi", lastPayment: "10.01.2024" },
        { apartment: 4, resident: "Fatma Yıldız", amount: 850, status: "Bekliyor", lastPayment: "-" },
        { apartment: 5, resident: "Ali Özkan", amount: 1050, status: "Ödendi", lastPayment: "18.01.2024" }
    ];

    let payments = [
        { id: 1, apartment: 1, resident: "Ahmet Yılmaz", amount: 850, date: "2024-01-15", description: "Ocak 2024 Aidatı", type: "Aidat" },
        { id: 2, apartment: 2, resident: "Ayşe Demir", amount: 920, date: "2024-01-12", description: "Ocak 2024 Aidatı", type: "Aidat" },
        { id: 3, apartment: 3, resident: "Mehmet Kaya", amount: 400, date: "2024-01-10", description: "Ocak 2024 Aidatı (Kısmi)", type: "Aidat" },
        { id: 4, apartment: 5, resident: "Ali Özkan", amount: 1050, date: "2024-01-18", description: "Ocak 2024 Aidatı", type: "Aidat" },
        { id: 5, apartment: 1, resident: "Ahmet Yılmaz", amount: 200, date: "2024-01-20", description: "Asansör Bakım Payı", type: "Ek Ödeme" },
        { id: 6, apartment: 2, resident: "Ayşe Demir", amount: 150, date: "2024-01-22", description: "Temizlik Malzeme Payı", type: "Ek Ödeme" },
        { id: 7, apartment: 3, resident: "Mehmet Kaya", amount: 380, date: "2024-01-25", description: "Ocak 2024 Aidatı (Kalan)", type: "Aidat" }
    ];

    let expenses = [
        { id: 1, date: "2024-01-15", description: "Temizlik Malzemesi", category: "Temizlik", amount: 450 },
        { id: 2, date: "2024-01-10", description: "Elektrik Faturası", category: "Elektrik", amount: 2800 },
        { id: 3, date: "2024-01-08", description: "Su Faturası", category: "Su", amount: 1200 },
        { id: 4, date: "2024-01-05", description: "Asansör Bakımı", category: "Bakım-Onarım", amount: 1500 }
    ];

    // Admin login functions
    function toggleAdminLogin() {
        if (isAdmin) {
            // Logout
            if (confirm('Yönetici modundan çıkmak istediğiniz emin misiniz?')) {
                logout();
            }
        } else {
            // Show login modal
            showAdminLogin();
        }
    }

    function showAdminLogin() {
        document.getElementById('adminLoginModal').classList.remove('hidden');
        document.getElementById('adminLoginModal').classList.add('flex');
        document.getElementById('adminUsername').focus();
    }

    function hideAdminLogin() {
        document.getElementById('adminLoginModal').classList.add('hidden');
        document.getElementById('adminLoginModal').classList.remove('flex');
        document.getElementById('adminUsername').value = '';
        document.getElementById('adminPassword').value = '';
    }

    function handleAdminLogin(event) {
        event.preventDefault();
        
        const username = document.getElementById('adminUsername').value.trim().toLowerCase();
        const password = document.getElementById('adminPassword').value;
        
        // Check admin credentials
        if ((username === 'admin' && password === '123456') || 
            (username === 'yonetici' && password === 'bina2024')) {
            
            // Set admin mode
            isAdmin = true;
            currentUser = username === 'admin' ? 'Sistem Yöneticisi' : 'Ahmet Yılmaz';
            
            // Update UI
            updateUserInterface();
            
            // Hide modal
            hideAdminLogin();
            
            showCustomAlert('Yönetici girişi başarılı! Artık düzenleme yapabilirsiniz.');
            
        } else {
            showCustomAlert('Hatalı kullanıcı adı veya şifre! Demo hesap: admin / 123456');
            document.getElementById('adminPassword').value = '';
            document.getElementById('adminUsername').focus();
        }
    }

    function logout() {
        isAdmin = false;
        currentUser = 'Sakin';
        updateUserInterface();
        showCustomAlert('Yönetici modundan çıkış yapıldı.');
    }

    function updateUserInterface() {
        // Update user name and status
        document.getElementById('currentUserName').textContent = currentUser;
        
        const userStatus = document.getElementById('userStatus');
        const loginButton = document.getElementById('loginButton');
        
        if (isAdmin) {
            userStatus.textContent = 'Yönetici Modu';
            userStatus.className = 'text-xs px-2 py-1 rounded-full bg-green-100 text-green-600';
            
            loginButton.innerHTML = `
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                </svg>
                Çıkış Yap
            `;
            loginButton.className = 'text-sm text-red-600 hover:text-red-800 font-medium flex items-center';
            
            // Show admin-only elements
            document.querySelectorAll('.admin-only').forEach(element => {
                element.classList.add('show');
                element.style.display = '';
                if (element.tagName === 'TH' || element.tagName === 'TD') {
                    element.style.display = 'table-cell';
                }
            });
            
        } else {
            userStatus.textContent = 'Görüntüleme Modu';
            userStatus.className = 'text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600';
            
            loginButton.innerHTML = `
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                </svg>
                Yönetici Girişi
            `;
            loginButton.className = 'text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center';
            
            // Hide admin-only elements
            document.querySelectorAll('.admin-only').forEach(element => {
                element.classList.remove('show');
                element.style.display = 'none';
            });
        }
        
        // Reload current tab data
        const activeTab = document.querySelector('.tab-content.active');
        if (activeTab) {
            const tabId = activeTab.id;
            if (tabId === 'residents') loadResidents();
            else if (tabId === 'dues') loadDues();
            else if (tabId === 'expenses') loadExpenses();
        }
    }

    // Tab functionality
    function showTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Remove active class from all buttons
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show selected tab
        document.getElementById(tabName).classList.add('active');
        
        // Add active class to clicked button
        event.target.classList.add('active');
        
        // Load data for specific tabs
        if (tabName === 'residents') {
            loadResidents();
        } else if (tabName === 'dues') {
            loadDues();
        } else if (tabName === 'expenses') {
            loadExpenses();
        } else if (tabName === 'reports') {
            loadCharts();
        }
    }

    // Load residents table
    function loadResidents() {
        const tbody = document.getElementById('residentsTable');
        tbody.innerHTML = residents.map(resident => `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${resident.apartment}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${resident.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${resident.phone}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${resident.email}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">₺${resident.monthlyDues}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        ${resident.status}
                    </span>
                </td>
                <td class="admin-only px-6 py-4 whitespace-nowrap text-sm font-medium" style="${isAdmin ? 'display: table-cell;' : 'display: none;'}">
                    <button type="button" onclick="editResident(${resident.id})" class="text-blue-600 hover:text-blue-900 mr-3 px-2 py-1 rounded hover:bg-blue-50 border border-blue-300 hover:border-blue-500">Düzenle</button>
                    <button type="button" onclick="deleteResident(${resident.id})" class="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50 border border-red-300 hover:border-red-500">Sil</button>
                </td>
            </tr>
        `).join('');
    }

    // Load dues table
    function loadDues() {
        const tbody = document.getElementById('duesTable');
        tbody.innerHTML = residents.map((resident, index) => {
            // Calculate payments for this resident
            const residentPayments = payments.filter(p => p.apartment === resident.apartment);
            const totalPaid = residentPayments.reduce((sum, p) => sum + p.amount, 0);
            const remaining = Math.max(0, resident.monthlyDues - totalPaid);
            
            let status = 'Ödendi';
            let statusColor = 'bg-green-100 text-green-800';
            
            if (remaining > 0) {
                if (totalPaid > 0) {
                    status = 'Kısmi';
                    statusColor = 'bg-yellow-100 text-yellow-800';
                } else {
                    status = 'Bekliyor';
                    statusColor = 'bg-red-100 text-red-800';
                }
            }
            
            // Create payment list HTML
            const paymentListHtml = residentPayments.length > 0 ? 
                residentPayments.map(payment => `
                    <div class="flex items-center justify-between py-2 px-4 border-b border-gray-100 last:border-b-0">
                        <div class="flex-1">
                            <div class="flex items-center justify-between">
                                <span class="text-sm font-medium text-gray-900">${payment.description}</span>
                                <span class="px-2 py-1 text-xs font-semibold rounded-full ${payment.type === 'Aidat' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}">
                                    ${payment.type}
                                </span>
                            </div>
                            <div class="flex items-center justify-between mt-1">
                                <span class="text-xs text-gray-500">${new Date(payment.date).toLocaleDateString('tr-TR')}</span>
                                <span class="text-sm font-bold text-green-600">₺${payment.amount.toLocaleString('tr-TR')}</span>
                            </div>
                        </div>
                        <div class="admin-only ml-4" style="${isAdmin ? 'display: flex;' : 'display: none;'}">
                            <button type="button" onclick="editPayment(${payment.id})" class="text-blue-600 hover:text-blue-900 text-xs px-2 py-1 rounded hover:bg-blue-50 border border-blue-300 hover:border-blue-500 mr-1">Düzenle</button>
                            <button type="button" onclick="deletePayment(${payment.id})" class="text-red-600 hover:text-red-900 text-xs px-2 py-1 rounded hover:bg-red-50 border border-red-300 hover:border-red-500">Sil</button>
                        </div>
                    </div>
                `).join('') : 
                '<div class="py-4 px-4 text-center text-gray-500 text-sm">Henüz ödeme yapılmamış</div>';
            
            return `
            <tr class="border-b border-gray-200">
                <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">${resident.apartment}</td>
                <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">${resident.name}</td>
                <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">₺${resident.monthlyDues.toLocaleString('tr-TR')}</td>
                <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-green-600">₺${totalPaid.toLocaleString('tr-TR')}</td>
                <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-red-600">₺${remaining.toLocaleString('tr-TR')}</td>
                <td class="px-3 py-2 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-4 font-semibold rounded-full ${statusColor}">
                        ${status}
                    </span>
                </td>
                <td class="px-3 py-2 whitespace-nowrap text-sm">
                    <button type="button" onclick="togglePaymentDetails(${index})" class="flex items-center text-blue-600 hover:text-blue-900 font-medium text-xs">
                        <span class="mr-1">${residentPayments.length} Ödeme</span>
                        <svg class="w-3 h-3 transform transition-transform duration-200" id="arrow-${index}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </button>
                </td>
                <td class="admin-only px-3 py-2 whitespace-nowrap text-sm font-medium" style="${isAdmin ? 'display: table-cell;' : 'display: none;'}">
                    <button type="button" onclick="viewPaymentDetails(${resident.apartment})" class="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50 border border-blue-300 hover:border-blue-500 text-xs">Detay</button>
                </td>
            </tr>
            <tr id="payment-details-${index}" class="hidden">
                <td colspan="8" class="px-0 py-0">
                    <div class="bg-gray-50 border-t border-gray-200">
                        <div class="px-4 py-3">
                            <h4 class="text-sm font-medium text-gray-900 mb-2">Ödeme Geçmişi - ${resident.name}</h4>
                            <div class="bg-white rounded-lg border border-gray-200 max-h-48 overflow-y-auto">
                                ${paymentListHtml}
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
            `;
        }).join('');
        
        updateDuesStatistics();
        loadPaymentHistory();
    }

    // Load expenses table
    function loadExpenses() {
        const tbody = document.getElementById('expensesTable');
        tbody.innerHTML = expenses.map(expense => `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${new Date(expense.date).toLocaleDateString('tr-TR')}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${expense.description}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${expense.category}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₺${expense.amount}</td>
                <td class="admin-only px-6 py-4 whitespace-nowrap text-sm font-medium" style="${isAdmin ? 'display: table-cell;' : 'display: none;'}">
                    <button type="button" onclick="editExpense(${expense.id})" class="text-blue-600 hover:text-blue-900 mr-3 px-2 py-1 rounded hover:bg-blue-50 border border-blue-300 hover:border-blue-500">Düzenle</button>
                    <button type="button" onclick="deleteExpense(${expense.id})" class="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50 border border-red-300 hover:border-red-500">Sil</button>
                </td>
            </tr>
        `).join('');
    }



    function updatePaymentStatistics() {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        // Filter payments for current month
        const monthlyPayments = payments.filter(payment => {
            const paymentDate = new Date(payment.date);
            return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
        });
        
        const monthlyTotal = monthlyPayments.reduce((sum, payment) => sum + payment.amount, 0);
        const duesPayments = monthlyPayments.filter(p => p.type === 'Aidat').reduce((sum, p) => sum + p.amount, 0);
        const extraPayments = monthlyPayments.filter(p => p.type === 'Ek Ödeme').reduce((sum, p) => sum + p.amount, 0);
        const paymentCount = monthlyPayments.length;
        
        // Update elements if they exist
        const monthlyPaymentsTotalEl = document.getElementById('monthlyPaymentsTotal');
        const duesPaymentsTotalEl = document.getElementById('duesPaymentsTotal');
        const extraPaymentsTotalEl = document.getElementById('extraPaymentsTotal');
        const paymentCountEl = document.getElementById('paymentCount');
        
        if (monthlyPaymentsTotalEl) monthlyPaymentsTotalEl.textContent = `₺${monthlyTotal.toLocaleString('tr-TR')}`;
        if (duesPaymentsTotalEl) duesPaymentsTotalEl.textContent = `₺${duesPayments.toLocaleString('tr-TR')}`;
        if (extraPaymentsTotalEl) extraPaymentsTotalEl.textContent = `₺${extraPayments.toLocaleString('tr-TR')}`;
        if (paymentCountEl) paymentCountEl.textContent = paymentCount.toString();
    }

    function viewPaymentDetails(apartmentNo) {
        if (!isAdmin) {
            showCustomAlert('Bu işlem için yönetici girişi gereklidir.');
            return;
        }
        
        const resident = residents.find(r => r.apartment === apartmentNo);
        const residentPayments = payments.filter(p => p.apartment === apartmentNo);
        
        if (!resident) {
            showCustomAlert('Sakin bulunamadı!');
            return;
        }
        
        let message = `${resident.name} (Daire ${apartmentNo}) - Ödeme Detayları:\n\n`;
        message += `Aylık Aidat: ₺${resident.monthlyDues.toLocaleString('tr-TR')}\n`;
        message += `Toplam Ödenen: ₺${residentPayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString('tr-TR')}\n`;
        message += `Kalan: ₺${Math.max(0, resident.monthlyDues - residentPayments.reduce((sum, p) => sum + p.amount, 0)).toLocaleString('tr-TR')}\n\n`;
        
        if (residentPayments.length > 0) {
            message += 'Ödemeler:\n';
            residentPayments.forEach(payment => {
                message += `• ${new Date(payment.date).toLocaleDateString('tr-TR')} - ${payment.description} - ₺${payment.amount.toLocaleString('tr-TR')} (${payment.type})\n`;
            });
        } else {
            message += 'Henüz ödeme yapılmamış.';
        }
        
        showCustomAlert(message);
    }

    // Load payment history
    function loadPaymentHistory() {
        const historyDiv = document.getElementById('paymentHistory');
        
        // Sort payments by date (newest first)
        const sortedPayments = [...payments].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (sortedPayments.length === 0) {
            historyDiv.innerHTML = '<p class="text-gray-500 text-center py-8">Henüz ödeme kaydı bulunmuyor</p>';
            return;
        }
        
        historyDiv.innerHTML = sortedPayments.map(payment => {
            const typeColor = payment.type === 'Aidat' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
            
            return `
            <div class="border-l-3 border-green-400 bg-green-50 p-2 rounded-r-lg">
                <div class="flex items-start justify-between">
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between mb-1">
                            <h4 class="text-xs font-medium text-gray-900 truncate">Daire ${payment.apartment}</h4>
                            <span class="px-1 py-0.5 text-xs font-semibold rounded-full ${typeColor} ml-1">
                                ${payment.type}
                            </span>
                        </div>
                        <p class="text-xs text-gray-700 mb-1 truncate">${payment.description}</p>
                        <div class="flex items-center justify-between">
                            <span class="text-xs text-gray-500">${new Date(payment.date).toLocaleDateString('tr-TR')}</span>
                            <span class="text-sm font-bold text-green-600">₺${payment.amount.toLocaleString('tr-TR')}</span>
                        </div>
                    </div>
                    <div class="admin-only ml-2 flex flex-col space-y-1" style="${isAdmin ? 'display: flex;' : 'display: none;'}">
                        <button type="button" onclick="editPayment(${payment.id})" class="text-blue-600 hover:text-blue-900 text-xs px-1 py-0.5 rounded hover:bg-blue-50 border border-blue-300 hover:border-blue-500">Düzenle</button>
                        <button type="button" onclick="deletePayment(${payment.id})" class="text-red-600 hover:text-red-900 text-xs px-1 py-0.5 rounded hover:bg-red-50 border border-red-300 hover:border-red-500">Sil</button>
                    </div>
                </div>
            </div>
            `;
        }).join('');
    }

    // Update dues statistics
    function updateDuesStatistics() {
        const totalDues = residents.reduce((sum, resident) => sum + resident.monthlyDues, 0);
        const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
        const totalRemaining = Math.max(0, totalDues - totalPaid);
        const collectionRate = totalDues > 0 ? Math.round((totalPaid / totalDues) * 100) : 0;
        
        document.getElementById('totalDues').textContent = `₺${totalDues.toLocaleString('tr-TR')}`;
        document.getElementById('totalPaid').textContent = `₺${totalPaid.toLocaleString('tr-TR')}`;
        document.getElementById('totalRemaining').textContent = `₺${totalRemaining.toLocaleString('tr-TR')}`;
        document.getElementById('collectionRate').textContent = `${collectionRate}%`;
        
        updatePaymentStatistics();
    }

    // Modal functions (Admin only)
    function showAddResidentModal() {
        if (!isAdmin) {
            alert('Bu işlem için yönetici girişi gereklidir.');
            return;
        }
        document.getElementById('addResidentModal').classList.remove('hidden');
        document.getElementById('addResidentModal').classList.add('flex');
    }

    function hideAddResidentModal() {
        document.getElementById('addResidentModal').classList.add('hidden');
        document.getElementById('addResidentModal').classList.remove('flex');
    }

    function showAddExpenseModal() {
        if (!isAdmin) {
            alert('Bu işlem için yönetici girişi gereklidir.');
            return;
        }
        document.getElementById('addExpenseModal').classList.remove('hidden');
        document.getElementById('addExpenseModal').classList.add('flex');
        
        // Set today's date
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('expenseDate').value = today;
    }

    function hideAddExpenseModal() {
        document.getElementById('addExpenseModal').classList.add('hidden');
        document.getElementById('addExpenseModal').classList.remove('flex');
    }

    function showAddPaymentModal() {
        if (!isAdmin) {
            showCustomAlert('Bu işlem için yönetici girişi gereklidir.');
            return;
        }
        
        // Populate apartment dropdown
        const apartmentSelect = document.getElementById('paymentApartment');
        apartmentSelect.innerHTML = '<option value="">Seçiniz</option>' + 
            residents.map(resident => 
                `<option value="${resident.apartment}" data-resident="${resident.name}">${resident.apartment} - ${resident.name}</option>`
            ).join('');
        
        document.getElementById('addPaymentModal').classList.remove('hidden');
        document.getElementById('addPaymentModal').classList.add('flex');
        
        // Set today's date
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('paymentDate').value = today;
    }

    function hideAddPaymentModal() {
        document.getElementById('addPaymentModal').classList.add('hidden');
        document.getElementById('addPaymentModal').classList.remove('flex');
    }

    function updatePaymentResident() {
        const apartmentSelect = document.getElementById('paymentApartment');
        const residentInput = document.getElementById('paymentResident');
        
        if (apartmentSelect.value) {
            const selectedOption = apartmentSelect.options[apartmentSelect.selectedIndex];
            residentInput.value = selectedOption.dataset.resident || '';
        } else {
            residentInput.value = '';
        }
    }

    // CRUD functions (Admin only)
    function addResident(event) {
        event.preventDefault();
        if (!isAdmin) return;
        
        const modal = document.getElementById('addResidentModal');
        const editId = modal.dataset.editId;
        
        if (editId) {
            // Update existing resident
            const residentIndex = residents.findIndex(r => r.id === parseInt(editId));
            if (residentIndex !== -1) {
                residents[residentIndex] = {
                    ...residents[residentIndex],
                    apartment: parseInt(document.getElementById('apartmentNo').value),
                    name: document.getElementById('residentName').value,
                    phone: document.getElementById('residentPhone').value,
                    email: document.getElementById('residentEmail').value,
                    monthlyDues: parseFloat(document.getElementById('residentDues').value)
                };
                
                // Update dues table if apartment number changed
                const dueIndex = dues.findIndex(d => d.apartment === residents[residentIndex].apartment);
                if (dueIndex !== -1) {
                    dues[dueIndex].resident = residents[residentIndex].name;
                    dues[dueIndex].amount = residents[residentIndex].monthlyDues;
                }
                
                showCustomAlert('Sakin bilgileri başarıyla güncellendi!');
            }
            
            // Reset modal
            delete modal.dataset.editId;
            document.querySelector('#addResidentModal h3').textContent = 'Yeni Sakin Ekle';
            document.querySelector('#addResidentModal button[type="submit"]').textContent = 'Ekle';
            
        } else {
            // Add new resident
            const newResident = {
                id: Math.max(...residents.map(r => r.id), 0) + 1,
                apartment: parseInt(document.getElementById('apartmentNo').value),
                name: document.getElementById('residentName').value,
                phone: document.getElementById('residentPhone').value,
                email: document.getElementById('residentEmail').value,
                status: 'Aktif',
                monthlyDues: parseFloat(document.getElementById('residentDues').value)
            };
            
            residents.push(newResident);
            
            // Add to dues table
            dues.push({
                apartment: newResident.apartment,
                resident: newResident.name,
                amount: newResident.monthlyDues,
                status: 'Bekliyor',
                lastPayment: '-'
            });
            
            showCustomAlert('Yeni sakin başarıyla eklendi!');
        }
        
        loadResidents();
        if (document.querySelector('.tab-content.active').id === 'dues') {
            loadDues();
        }
        updateDashboard();
        updateReportsTab();
        hideAddResidentModal();
        
        // Reset form
        event.target.reset();
    }

    function addExpense(event) {
        event.preventDefault();
        if (!isAdmin) return;
        
        const modal = document.getElementById('addExpenseModal');
        const editId = modal.dataset.editId;
        
        if (editId) {
            // Update existing expense
            const expenseIndex = expenses.findIndex(e => e.id === parseInt(editId));
            if (expenseIndex !== -1) {
                expenses[expenseIndex] = {
                    ...expenses[expenseIndex],
                    date: document.getElementById('expenseDate').value,
                    description: document.getElementById('expenseDescription').value,
                    category: document.getElementById('expenseCategory').value,
                    amount: parseFloat(document.getElementById('expenseAmount').value)
                };
                
                showCustomAlert('Gider bilgileri başarıyla güncellendi!');
            }
            
            // Reset modal
            delete modal.dataset.editId;
            document.querySelector('#addExpenseModal h3').textContent = 'Yeni Gider Ekle';
            document.querySelector('#addExpenseModal button[type="submit"]').textContent = 'Ekle';
            
        } else {
            // Add new expense
            const newExpense = {
                id: Math.max(...expenses.map(e => e.id), 0) + 1,
                date: document.getElementById('expenseDate').value,
                description: document.getElementById('expenseDescription').value,
                category: document.getElementById('expenseCategory').value,
                amount: parseFloat(document.getElementById('expenseAmount').value)
            };
            
            expenses.push(newExpense);
            showCustomAlert('Yeni gider başarıyla eklendi!');
        }
        
        loadExpenses();
        updateDashboard();
        updateReportsTab();
        hideAddExpenseModal();
        
        // Reset form
        event.target.reset();
    }

    function editResident(id) {
        if (!isAdmin) {
            showCustomAlert('Bu işlem için yönetici girişi gereklidir.');
            return;
        }
        
        const resident = residents.find(r => r.id === id);
        if (!resident) {
            showCustomAlert('Sakin bulunamadı!');
            return;
        }
        
        // Fill the form with existing data
        document.getElementById('apartmentNo').value = resident.apartment;
        document.getElementById('residentName').value = resident.name;
        document.getElementById('residentPhone').value = resident.phone;
        document.getElementById('residentEmail').value = resident.email;
        document.getElementById('residentDues').value = resident.monthlyDues;
        
        // Change modal title and button text
        document.querySelector('#addResidentModal h3').textContent = 'Sakin Bilgilerini Düzenle';
        document.querySelector('#addResidentModal button[type="submit"]').textContent = 'Güncelle';
        
        // Store the ID for updating
        document.getElementById('addResidentModal').dataset.editId = id;
        
        // Show modal
        showAddResidentModal();
    }

    function deleteResident(id) {
        console.log('🚀 DELETE RESIDENT - NEW VERSION START');
        console.log('📋 ID received:', id, 'Type:', typeof id);
        
        if (!isAdmin) {
            console.log('❌ Not admin, showing alert...');
            showCustomAlert('Bu işlem için yönetici girişi gereklidir.');
            return;
        }
        
        const numericId = typeof id === 'string' ? parseInt(id) : id;
        console.log('🔢 Numeric ID:', numericId);
        
        const resident = residents.find(r => r.id === numericId);
        console.log('👤 Found resident:', resident);
        
        if (!resident) {
            console.log('❌ Resident not found!');
            showCustomAlert('Sakin bulunamadı!');
            return;
        }
        
        console.log('✅ Resident found, proceeding with deletion...');
        
        // Direct deletion without confirm for sandbox environment
        console.log('🗑️ Deleting resident directly...');
        console.log('📊 Before deletion - Array length:', residents.length);
        
        residents = residents.filter(r => r.id !== numericId);
        dues = dues.filter(d => d.apartment !== resident.apartment);
        
        console.log('📊 After deletion - Array length:', residents.length);
        console.log('✅ Resident deleted:', resident.name);
        
        console.log('🔄 Reloading table...');
        loadResidents();
        if (document.querySelector('.tab-content.active').id === 'dues') {
            loadDues();
        }
        updateDashboard();
        updateReportsTab();
        
        showCustomAlert(`${resident.name} başarıyla silindi!`);
        console.log('🎉 SUCCESS: Deletion completed!');
        console.log('🏁 DELETE RESIDENT - NEW VERSION END');
    }

    function editExpense(id) {
        if (!isAdmin) {
            showCustomAlert('Bu işlem için yönetici girişi gereklidir.');
            return;
        }
        
        const expense = expenses.find(e => e.id == id);
        if (!expense) {
            showCustomAlert('Gider bulunamadı!');
            return;
        }
        
        // Fill the form with existing data
        document.getElementById('expenseDate').value = expense.date;
        document.getElementById('expenseDescription').value = expense.description;
        document.getElementById('expenseCategory').value = expense.category;
        document.getElementById('expenseAmount').value = expense.amount;
        
        // Change modal title and button text
        document.querySelector('#addExpenseModal h3').textContent = 'Gider Bilgilerini Düzenle';
        document.querySelector('#addExpenseModal button[type="submit"]').textContent = 'Güncelle';
        
        // Store the ID for updating
        document.getElementById('addExpenseModal').dataset.editId = id;
        
        // Show modal
        showAddExpenseModal();
    }

    function deleteExpense(id) {
        console.log('🚀 DELETE EXPENSE - NEW VERSION START');
        console.log('📋 ID received:', id, 'Type:', typeof id);
        
        if (!isAdmin) {
            console.log('❌ Not admin, showing alert...');
            showCustomAlert('Bu işlem için yönetici girişi gereklidir.');
            return;
        }
        
        const numericId = typeof id === 'string' ? parseInt(id) : id;
        console.log('🔢 Numeric ID:', numericId);
        
        const expense = expenses.find(e => e.id === numericId);
        console.log('💰 Found expense:', expense);
        
        if (!expense) {
            console.log('❌ Expense not found!');
            showCustomAlert('Gider bulunamadı!');
            return;
        }
        
        console.log('✅ Expense found, proceeding with deletion...');
        
        // Direct deletion without confirm for sandbox environment
        console.log('🗑️ Deleting expense directly...');
        console.log('📊 Before deletion - Array length:', expenses.length);
        
        expenses = expenses.filter(e => e.id !== numericId);
        
        console.log('📊 After deletion - Array length:', expenses.length);
        console.log('✅ Expense deleted:', expense.description);
        
        console.log('🔄 Reloading table...');
        loadExpenses();
        updateDashboard();
        updateReportsTab();
        
        showCustomAlert(`"${expense.description}" gideri başarıyla silindi!`);
        console.log('🎉 SUCCESS: Deletion completed!');
        console.log('🏁 DELETE EXPENSE - NEW VERSION END');
    }

    function addPayment(event) {
        event.preventDefault();
        if (!isAdmin) return;
        
        const modal = document.getElementById('addPaymentModal');
        const editId = modal.dataset.editId;
        
        if (editId) {
            // Update existing payment
            const paymentIndex = payments.findIndex(p => p.id === parseInt(editId));
            if (paymentIndex !== -1) {
                payments[paymentIndex] = {
                    ...payments[paymentIndex],
                    date: document.getElementById('paymentDate').value,
                    apartment: parseInt(document.getElementById('paymentApartment').value),
                    resident: document.getElementById('paymentResident').value,
                    type: document.getElementById('paymentType').value,
                    description: document.getElementById('paymentDescription').value,
                    amount: parseFloat(document.getElementById('paymentAmount').value)
                };
                
                showCustomAlert('Ödeme bilgileri başarıyla güncellendi!');
            }
            
            // Reset modal
            delete modal.dataset.editId;
            document.querySelector('#addPaymentModal h3').textContent = 'Yeni Ödeme Ekle';
            document.querySelector('#addPaymentModal button[type="submit"]').textContent = 'Ekle';
            
        } else {
            // Add new payment
            const newPayment = {
                id: Math.max(...payments.map(p => p.id), 0) + 1,
                date: document.getElementById('paymentDate').value,
                apartment: parseInt(document.getElementById('paymentApartment').value),
                resident: document.getElementById('paymentResident').value,
                type: document.getElementById('paymentType').value,
                description: document.getElementById('paymentDescription').value,
                amount: parseFloat(document.getElementById('paymentAmount').value)
            };
            
            payments.push(newPayment);
            showCustomAlert('Yeni ödeme başarıyla eklendi!');
        }
        
        loadDues(); // Reload dues to update payment status
        updateDashboard();
        updateReportsTab();
        hideAddPaymentModal();
        
        // Reset form
        event.target.reset();
    }

    function editPayment(id) {
        if (!isAdmin) {
            showCustomAlert('Bu işlem için yönetici girişi gereklidir.');
            return;
        }
        
        const payment = payments.find(p => p.id === id);
        if (!payment) {
            showCustomAlert('Ödeme bulunamadı!');
            return;
        }
        
        // Populate apartment dropdown first
        const apartmentSelect = document.getElementById('paymentApartment');
        apartmentSelect.innerHTML = '<option value="">Seçiniz</option>' + 
            residents.map(resident => 
                `<option value="${resident.apartment}" data-resident="${resident.name}">${resident.apartment} - ${resident.name}</option>`
            ).join('');
        
        // Fill the form with existing data
        document.getElementById('paymentDate').value = payment.date;
        document.getElementById('paymentApartment').value = payment.apartment;
        document.getElementById('paymentResident').value = payment.resident;
        document.getElementById('paymentType').value = payment.type;
        document.getElementById('paymentDescription').value = payment.description;
        document.getElementById('paymentAmount').value = payment.amount;
        
        // Change modal title and button text
        document.querySelector('#addPaymentModal h3').textContent = 'Ödeme Bilgilerini Düzenle';
        document.querySelector('#addPaymentModal button[type="submit"]').textContent = 'Güncelle';
        
        // Store the ID for updating
        document.getElementById('addPaymentModal').dataset.editId = id;
        
        // Show modal
        showAddPaymentModal();
    }

    function deletePayment(id) {
        console.log('🚀 DELETE PAYMENT - START');
        console.log('📋 ID received:', id, 'Type:', typeof id);
        
        if (!isAdmin) {
            console.log('❌ Not admin, showing alert...');
            showCustomAlert('Bu işlem için yönetici girişi gereklidir.');
            return;
        }
        
        const numericId = typeof id === 'string' ? parseInt(id) : id;
        console.log('🔢 Numeric ID:', numericId);
        
        const payment = payments.find(p => p.id === numericId);
        console.log('💳 Found payment:', payment);
        
        if (!payment) {
            console.log('❌ Payment not found!');
            showCustomAlert('Ödeme bulunamadı!');
            return;
        }
        
        console.log('✅ Payment found, proceeding with deletion...');
        
        // Direct deletion without confirm for sandbox environment
        console.log('🗑️ Deleting payment directly...');
        console.log('📊 Before deletion - Array length:', payments.length);
        
        payments = payments.filter(p => p.id !== numericId);
        
        console.log('📊 After deletion - Array length:', payments.length);
        console.log('✅ Payment deleted:', payment.description);
        
        console.log('🔄 Reloading table...');
        loadDues(); // Reload dues to update payment status
        updateDashboard();
        updateReportsTab();
        
        showCustomAlert(`"${payment.description}" ödemesi başarıyla silindi!`);
        console.log('🎉 SUCCESS: Deletion completed!');
        console.log('🏁 DELETE PAYMENT - END');
    }

    function markAsPaid() {
        if (!isAdmin) {
            showCustomAlert('Bu işlem için yönetici girişi gereklidir.');
            return;
        }
        
        const checkboxes = document.querySelectorAll('.due-checkbox:checked');
        if (checkboxes.length === 0) {
            showCustomAlert('Lütfen en az bir aidat seçin.');
            return;
        }
        
        checkboxes.forEach(checkbox => {
            const index = parseInt(checkbox.dataset.index);
            dues[index].status = 'Ödendi';
            dues[index].lastPayment = new Date().toLocaleDateString('tr-TR');
        });
        
        loadDues();
        updateDashboard();
        updateReportsTab();
        showCustomAlert(`${checkboxes.length} aidat ödendi olarak işaretlendi.`);
    }

    function markAsUnpaid() {
        if (!isAdmin) {
            showCustomAlert('Bu işlem için yönetici girişi gereklidir.');
            return;
        }
        
        const checkboxes = document.querySelectorAll('.due-checkbox:checked');
        if (checkboxes.length === 0) {
            showCustomAlert('Lütfen en az bir aidat seçin.');
            return;
        }
        
        checkboxes.forEach(checkbox => {
            const index = parseInt(checkbox.dataset.index);
            dues[index].status = 'Bekliyor';
            dues[index].lastPayment = '-';
        });
        
        loadDues();
        updateDashboard();
        updateReportsTab();
        showCustomAlert(`${checkboxes.length} aidat ödenmedi olarak işaretlendi.`);
    }

    function toggleSelectAll() {
        if (!isAdmin) return;
        
        const selectAll = document.getElementById('selectAll');
        const checkboxes = document.querySelectorAll('.due-checkbox');
        
        checkboxes.forEach(checkbox => {
            checkbox.checked = selectAll.checked;
        });
    }

    function downloadReport(type) {
        alert(`${type} raporu indiriliyor... (Demo sürümünde aktif değil)`);
    }

    // Dashboard update functions
    function updateDashboard() {
        // Update total apartments
        document.getElementById('totalApartments').textContent = residents.length;
        
        // Calculate monthly collected from payments (more accurate)
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        const monthlyPayments = payments.filter(payment => {
            const paymentDate = new Date(payment.date);
            return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
        });
        const monthlyCollected = monthlyPayments.reduce((sum, payment) => sum + payment.amount, 0);
        document.getElementById('monthlyCollected').textContent = `₺${monthlyCollected.toLocaleString('tr-TR')}`;
        
        // Calculate pending dues
        const pendingDues = dues.filter(due => due.status !== 'Ödendi');
        const pendingAmount = pendingDues.reduce((sum, due) => sum + due.amount, 0);
        document.getElementById('pendingDues').textContent = `₺${pendingAmount.toLocaleString('tr-TR')}`;
        
        // Calculate monthly expenses
        const currentMonthExpenses = expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() === currentMonth && 
                   expenseDate.getFullYear() === currentYear;
        });
        const monthlyExpensesTotal = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        document.getElementById('monthlyExpenses').textContent = `₺${monthlyExpensesTotal.toLocaleString('tr-TR')}`;
    }

    function populateMonthSelector() {
        const selector = document.getElementById('monthSelector');
        if (!selector) return;
        
        const months = [
            'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
            'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
        ];
        
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonthIndex = currentDate.getMonth();
        
        selector.innerHTML = '';
        
        // Add current and previous months
        for (let i = 0; i < 6; i++) {
            const monthIndex = (currentMonthIndex - i + 12) % 12;
            const year = currentMonthIndex - i < 0 ? currentYear - 1 : currentYear;
            const monthName = months[monthIndex];
            
            const option = document.createElement('option');
            option.value = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
            option.textContent = `${monthName} ${year}`;
            
            if (i === 0) option.selected = true;
            
            selector.appendChild(option);
        }
    }

    function filterDuesByMonth() {
        const selectedMonth = document.getElementById('monthSelector').value;
        // For now, just reload the dues table
        // In a real app, this would filter by the selected month
        loadDues();
        showCustomAlert(`${document.getElementById('monthSelector').selectedOptions[0].text} ayı seçildi`);
    }

    function togglePaymentDetails(index) {
        const detailsRow = document.getElementById(`payment-details-${index}`);
        const arrow = document.getElementById(`arrow-${index}`);
        
        if (detailsRow.classList.contains('hidden')) {
            detailsRow.classList.remove('hidden');
            arrow.style.transform = 'rotate(180deg)';
        } else {
            detailsRow.classList.add('hidden');
            arrow.style.transform = 'rotate(0deg)';
        }
    }

    function updateReportsTab() {
        // Calculate totals for reports using payments data
        const totalIncome = payments.reduce((sum, payment) => sum + payment.amount, 0);
        const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const netBalance = totalIncome - totalExpenses;
        
        const totalDues = dues.reduce((sum, due) => sum + due.amount, 0);
        const paidDues = dues.filter(due => due.status === 'Ödendi').reduce((sum, due) => sum + due.amount, 0);
        const pendingDues = totalDues - paidDues;
        const collectionRate = totalDues > 0 ? Math.round((paidDues / totalDues) * 100) : 0;
        
        // Update report elements
        document.getElementById('reportTotalIncome').textContent = `₺${totalIncome.toLocaleString('tr-TR')}`;
        document.getElementById('reportTotalExpenses').textContent = `₺${totalExpenses.toLocaleString('tr-TR')}`;
        document.getElementById('reportNetBalance').textContent = `₺${netBalance.toLocaleString('tr-TR')}`;
        
        document.getElementById('reportTotalDues').textContent = `₺${totalDues.toLocaleString('tr-TR')}`;
        document.getElementById('reportPaidDues').textContent = `₺${paidDues.toLocaleString('tr-TR')}`;
        document.getElementById('reportPendingDues').textContent = `₺${pendingDues.toLocaleString('tr-TR')}`;
        document.getElementById('reportCollectionRate').textContent = `${collectionRate}%`;
        document.getElementById('reportCollectionBar').style.width = `${collectionRate}%`;
        
        // Update expense categories
        updateExpenseCategories();
        
        // Update recent activities
        updateRecentActivities();
        
        // Update report info
        document.getElementById('duesReportInfo').textContent = `${residents.length} daire • Güncel`;
        document.getElementById('expensesReportInfo').textContent = `${expenses.length} gider • Bu ay`;
        document.getElementById('residentsReportInfo').textContent = `${residents.length} sakin • Aktif`;
    }

    function updateExpenseCategories() {
        const categoriesDiv = document.getElementById('expenseCategoriesReport');
        if (!categoriesDiv) return;
        
        // Group expenses by category
        const categories = {};
        expenses.forEach(expense => {
            if (!categories[expense.category]) {
                categories[expense.category] = 0;
            }
            categories[expense.category] += expense.amount;
        });
        
        const totalExpenses = Object.values(categories).reduce((sum, amount) => sum + amount, 0);
        
        categoriesDiv.innerHTML = Object.entries(categories).map(([category, amount]) => {
            const percentage = totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0;
            return `
                <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div class="flex items-center">
                        <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                        <span class="text-sm text-gray-700">${category}</span>
                    </div>
                    <div class="text-right">
                        <div class="text-sm font-medium">₺${amount.toLocaleString('tr-TR')}</div>
                        <div class="text-xs text-gray-500">${percentage}%</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function updateRecentActivities() {
        const activitiesDiv = document.getElementById('recentActivitiesReport');
        if (!activitiesDiv) return;
        
        // Get recent expenses (last 5)
        const recentExpenses = expenses.slice(-5).reverse();
        
        activitiesDiv.innerHTML = recentExpenses.map(expense => `
            <div class="flex items-center justify-between p-2 border-l-4 border-red-400 bg-red-50">
                <div>
                    <div class="text-sm font-medium text-gray-900">${expense.description}</div>
                    <div class="text-xs text-gray-500">${new Date(expense.date).toLocaleDateString('tr-TR')} • ${expense.category}</div>
                </div>
                <div class="text-sm font-medium text-red-600">-₺${expense.amount.toLocaleString('tr-TR')}</div>
            </div>
        `).join('');
        
        if (recentExpenses.length === 0) {
            activitiesDiv.innerHTML = '<p class="text-gray-500 text-sm text-center py-4">Henüz aktivite bulunmuyor</p>';
        }
    }

    function loadCharts() {
        updateReportsTab();
    }

    // Initialize page
    document.addEventListener('DOMContentLoaded', function() {
        updateUserInterface();
        updateDashboard();
        populateMonthSelector();
        loadResidents();
        loadDues();
        loadExpenses();
        updateReportsTab();
    });

