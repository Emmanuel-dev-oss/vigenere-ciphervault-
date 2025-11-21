document.addEventListener('DOMContentLoaded', function() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // functions to switch tabs
    function switchTab(tabId) {
        // Hide all tab content
        tabContents.forEach(content => {
            content.classList.remove('active');
        });

        //Remove active class from all tab buttons
        tabBtns.forEach(btn => {
            btn.classList.remove('active');
        });

        // Show the selected tab content
        document.getElementById(tabId).classList.add('active');

        // Add active class to the clicked tab button
        document.querySelector(`.tab-btn[data-tab="${tabId}"]`).classList.add('active');
    }

    // Add click event listeners to tab buttons
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Initialize with the first tab active
    switchTab('key-finder');
});



//This function generates the key in a cylic manner untils it's length is equal to the length of original text
function generateKey(str, key) {
    key = key.split("");

    if(str.length == key.length)
        return key.join("");
    else {
        let temp=key.length;
        for (let i = 0; i < (str.length-temp); i++){
            key.push(key[i%((key).length)])
        }
    }
    return key.join("")
}

// Encryption function
function cipherText(str, key) {
    let cipher_text = "";

    str = str.toUpperCase();
    key = key.toUpperCase();

    for (let i = 0; i < str.length; i++) {

        let currentChar = str[i];
        let currentKeyChar = key[i];
        
        // Check if current character is alphabetic
        if (currentChar >= 'A' && currentChar <= 'Z') {
            
            //converting into range 0-25
            let x = (currentChar.charCodeAt(0) + currentKeyChar.charCodeAt(0)) % 26;

            // converts into alphabetis(ASCII)
            x += 'A'.charCodeAt(0);

            cipher_text += String.fromCharCode(x);
        
        } else {
            // Keep non-alphabetic characters as they are
            cipher_text += currentChar;
        }
    }
    return cipher_text;
}     

//Decryption function
function originalText(str, key) {
    let original_text = "";

    str = str.toUpperCase();
    key = key.toUpperCase();
    
    for (let i = 0; i < str.length; i++) {
        let currentChar = str[i];
        let currentKeyChar = key[i];
        
        // Check if current character is alphabetic
        if (currentChar >= 'A' && currentChar <= 'Z') {
            
            // converting into range 0-25
            let x = (currentChar.charCodeAt(0) - currentKeyChar.charCodeAt(0) + 26) % 26;

            // converts into alphabetis(ASCII)
            x += 'A'.charCodeAt(0);

            original_text += String.fromCharCode(x);
        
        } else {
            // Keep non-alphabetic characters as they are
            original_text += currentChar;
        }
    }
    return original_text;
}

// Find the key function
function findKey(cipher_text, original_text) {

    let the_key="";

    cipher_text = cipher_text.toUpperCase();
    original_text = original_text.toUpperCase();

    //Convert into range 0-25
    for (let i = 0; i < cipher_text.length; i++) {

        let cipherChar = cipher_text[i];
        let originalChar = original_text[i];

        // Handle non-alphabetic characters
        if (cipherChar < 'A' || cipherChar > 'Z') {
           originalChar += cipherChar;
           the_key += "-";
            continue; // Don't advance key index for non-alphabetic characters
        }

        let x = (cipherChar.charCodeAt(0) - originalChar.charCodeAt(0) + 26) % 26;

        // converts into alphabetis(ASCII)
        x+='A'.charCodeAt(0);

        the_key+=String.fromCharCode(x)
    }
    return the_key;
}


// DOM elements
const findKeyBtn = document.getElementById('find-key-btn');
const encryptBtn = document.getElementById('encrypt-btn');
const decryptBtn = document.getElementById('decrypt-btn');

const cipherTextInput = document.getElementById('cipher-text');
const plainTextInput = document.getElementById('plain-text');
const keyOutput = document.getElementById('key-output');

const encryptPlainInput = document.getElementById('encrypt-plain');
const encryptKeyInput = document.getElementById('encrypt-key');
const encryptOutput = document.getElementById('encrypt-output');

const decryptCipherInput = document.getElementById('decrypt-cipher');
const decryptKeyInput = document.getElementById('decrypt-key');
const decryptOutput = document.getElementById('decrypt-output');

// Event Listener(for the find key btn)
findKeyBtn.addEventListener('click', () => {
    const cipherText = cipherTextInput.value;
    const plainText = plainTextInput.value;

    if (!cipherText || !plainText) {
        alert('Please enter both encrypted text and plain text');
        return;
    } 

    try {
        const key = findKey(cipherText, plainText);
        keyOutput.textContent = key;
    } catch (error) {
        alert('Error finding key: ' + error.message);
    }
});

// Event Listener(for the encrypt key btn)
encryptBtn.addEventListener('click', () => {
    const plainText = encryptPlainInput.value;
    const key = encryptKeyInput.value;
    
    if (!plainText || !key) {
        alert('Please enter both plain text and encryption key');
        return;
    }
    
    try {
        if (plainText.length != key.length) {
            const newKey =  generateKey(plainText, key);
            const encrypted = cipherText(plainText, newKey);
            encryptOutput.textContent = encrypted;
            encryptKeyInput.value = newKey;
        }
    } catch (error) {
        alert('Error encrypting: ' + error.message);
    }
});

// Event Listener(for the decrypt key btn)
decryptBtn.addEventListener('click', () => {
    const cipherText = decryptCipherInput.value;
    const key = decryptKeyInput.value;
    
    if (!cipherText || !key) {
        alert('Please enter both encrypted text and decryption key');
        return;
    }
    
    try {
         if (cipherText.length != key.length) {
            const newKey =  generateKey(cipherText, key);
            const decrypted = originalText(cipherText, newKey);
            decryptOutput.textContent = decrypted;
            decryptKeyInput.value = newKey;
        } else {
            const decrypted = originalText(cipherText, key);
            decryptOutput.textContent = decrypted;
        }
    } catch (error) {
        alert('Error decrypting: ' + error.message);
    }
});


