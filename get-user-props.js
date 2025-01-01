// ==UserScript==
// @name         Torn User Property Info
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds info column to rental market
// @author       beans_
// @match        https://www.torn.com/properties.php?step=rentalmarket*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the page to load
    const waitForElement = setInterval(() => {
        const titleDiv = document.querySelector('.users-list-title');
        const userRows = document.querySelectorAll('.users-list > li');

        if (titleDiv && userRows.length > 0) {
            clearInterval(waitForElement);
            
            // Add info icons to each user row
            userRows.forEach(row => {
                const honorTextWrap = row.querySelector('.honor-text-wrap');
                if (honorTextWrap) {
                    const infoIcon = document.createElement('span');
                    infoIcon.innerHTML = ' ℹ️';
                    infoIcon.style.cursor = 'pointer';
                    infoIcon.style.position = 'absolute';
                    infoIcon.style.right = '10px';
                    infoIcon.style.top = '50%';
                    infoIcon.style.transform = 'translateY(-50%)';
                    
                    // Ensure parent has relative positioning
                    honorTextWrap.style.position = 'relative';
                    
                    // Get user ID from row's nested elements
                    const userId = row.children[0].children[1].children[2].attributes[1].value.match(/\[(.*?)\]/)[1];
                    
                    // Add click handler
                    infoIcon.addEventListener('click', async () => {
                        const API_KEY = localStorage.getItem('tornApiKey');
                        try {
                            const response = await fetch(`https://api.torn.com/user/${userId}?selections=properties&key=${API_KEY}`);
                            const data = await response.json();
                            
                            if (data.error) {
                                alert(`Error: ${data.error.error}`);
                                return;
                            }

                            // Count only private islands (type 13)
                            const privateIslandCount = Object.values(data.properties)
                                .filter(prop => prop.property_type === 13)
                                .length;

                            alert(`Private Islands: ${privateIslandCount}`);
                        } catch (error) {
                            alert(`Error fetching data: ${error.message}`);
                        }
                    });
                    
                    honorTextWrap.appendChild(infoIcon);
                }
            });
        }
    }, 1000);
})();

