// This JavaScript file is included for completeness.
// It demonstrates how to access the 'data-heft' and 'data-src' attributes.
// For the current static layout, it doesn't add critical visual functionality,
// but it's a good place for future interactivity.

document.addEventListener('DOMContentLoaded', () => {
    // Example: Add an event listener to the install buttons (e.g., to trigger a download)
    const installButtons = document.querySelectorAll('.install-button');

    installButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // event.preventDefault(); // Uncomment this line if you want to prevent the default link navigation
            // Example action: You could log which app's install button was clicked
            const appName = button.closest('.app-item').querySelector('.app-name').textContent.trim();
            console.log(`Attempting to install: ${appName}`);
            // In a real application, you would add logic here to start the installation process.
        });
    });

    // Event listeners for the DNS PROFILE, CERTIFICATE, and TELEGRAM buttons
    // This demonstrates how to retrieve the custom 'data-heft' and 'data-src' attributes.
    const gridButtons = document.querySelectorAll('.grid-button');
    gridButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // event.preventDefault(); // Uncomment this line if you want to prevent the default link navigation
            const buttonText = button.querySelector('span:last-child').textContent.trim();
            const heftValue = button.dataset.heft; // Accessing data-heft attribute
            const srcValue = button.dataset.src;   // Accessing data-src attribute

            console.log(`Clicked ${buttonText} Button:`);
            console.log(`  Data-Heft: ${heftValue}`);
            console.log(`  Data-Src: ${srcValue}`);

            // In a real scenario, you would typically use these values to:
            // 1. Redirect to a specific URL that depends on these values.
            //    Example: window.location.href = `https://yourdomain.com/configure?type=${heftValue}&source=${srcValue}`;
            // 2. Fetch data from an API using these identifiers.
            // 3. Display specific information in a modal or new section.
        });
    });

    // You can add more JavaScript functionality here as needed,
    // for example, handling the header icons' clicks, search functionality, etc.
});
