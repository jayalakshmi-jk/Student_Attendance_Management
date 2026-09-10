document.addEventListener('DOMContentLoaded', loadDashboardStats);

async function loadDashboardStats() {
    try {
        const response = await fetch('http://localhost:3000/dashboard/stats');
        const stats = await response.json();

        if (response.ok) {
            document.getElementById('total-students').textContent = stats.totalStudents;
            document.getElementById('present-count').textContent = stats.presentCount;
            document.getElementById('absent-count').textContent = stats.absentCount;
        } else {
            console.error('Error loading stats:', stats.error);
        }
    } catch (err) {
        console.error('Failed to load dashboard stats:', err);
    }
}
